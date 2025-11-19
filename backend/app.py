import os
import re
import glob
import uuid
from datetime import datetime, timedelta
from functools import wraps

import bcrypt
import jwt
import PyPDF2
from dotenv import load_dotenv
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from supabase import create_client, Client
from werkzeug.utils import secure_filename

load_dotenv()

UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'resumes')
ALLOWED_EXTENSIONS = {'pdf', 'txt'}
JWT_SECRET = os.environ.get('JWT_SECRET', 'super-secret-key')
JWT_EXP_MINUTES = int(os.environ.get('JWT_EXP_MINUTES', '120'))
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')
FRONTEND_ORIGIN = os.environ.get('FRONTEND_ORIGIN', '*')

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": FRONTEND_ORIGIN}},
    supports_credentials=True
)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_pdf(filepath):
    try:
        with open(filepath, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + " "
            return text.strip()
    except Exception:
        return ""


def calculate_match_score(jd_text, resume_text):
    jd_words = set(jd_text.lower().split())
    resume_words = set(resume_text.lower().split())
    common_words = jd_words.intersection(resume_words)
    if not jd_words:
        return 0.0
    return (len(common_words) / len(jd_words)) * 100


def serialize_user(document):
    if not document:
        return None
    # Handle both dict and dict with data key (Supabase response format)
    data = document if isinstance(document, dict) and "data" not in document else document.get("data", document)
    if not data:
        return None
    
    # Handle created_at - could be string (from PostgreSQL) or datetime object
    created_at = data.get("created_at")
    if created_at:
        if isinstance(created_at, str):
            created_at_str = created_at
        elif hasattr(created_at, 'isoformat'):
            created_at_str = created_at.isoformat()
        else:
            created_at_str = str(created_at)
    else:
        created_at_str = None
    
    return {
        "id": str(data.get("id", "")),
        "email": data.get("email", ""),
        "role": data.get("role", "jobseeker"),
        "firstName": data.get("first_name"),
        "lastName": data.get("last_name"),
        "mobile": data.get("mobile"),
        "createdAt": created_at_str
    }


def create_access_token(user_id, role):
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXP_MINUTES),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def token_required(fn):
    @wraps(fn)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = None
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]

        if not token:
            return jsonify({"error": "Authorization token missing"}), 401

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            user_id = payload["sub"]
            
            # Query user from Supabase
            response = supabase.table("users").select("*").eq("id", user_id).single().execute()
            user = response.data if hasattr(response, 'data') and response.data else None
            if not user:
                return jsonify({"error": "User not found"}), 404
            g.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except (jwt.InvalidTokenError, KeyError):
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"error": "User not found"}), 404

        return fn(*args, **kwargs)

    return decorated


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = (data.get('email') or '').lower().strip()
    password = data.get('password')
    role = data.get('userType', 'jobseeker')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        # Convert bytes to string for PostgreSQL storage
        hashed_password_str = hashed_password.decode('utf-8')
        
        user_doc = {
            "id": str(uuid.uuid4()),
            "email": email,
            "password": hashed_password_str,
            "role": role,
            "first_name": data.get('firstName'),
            "last_name": data.get('lastName'),
            "mobile": data.get('mobile'),
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Insert into Supabase
        response = supabase.table("users").insert(user_doc).execute()
        user_data = response.data[0] if response.data else user_doc
    except Exception as e:
        error_msg = str(e)
        # Check if it's a duplicate email error
        if "duplicate" in error_msg.lower() or "unique" in error_msg.lower() or "23505" in error_msg:
            return jsonify({"error": "Email already registered"}), 409
        return jsonify({"error": f"Registration failed: {error_msg}"}), 500

    token = create_access_token(user_data.get("id"), role)
    return jsonify({
        "token": token,
        "user": serialize_user(user_data)
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').lower().strip()
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Query user from Supabase
        response = supabase.table("users").select("*").eq("email", email).single().execute()
        user = response.data if hasattr(response, 'data') and response.data else None
    except Exception:
        return jsonify({"error": "Invalid credentials"}), 401

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # Verify password
    password_hash = user.get("password", "")
    # Handle both string and bytes password hash
    if isinstance(password_hash, str):
        password_hash = password_hash.encode('utf-8')
    
    if not bcrypt.checkpw(password.encode('utf-8'), password_hash):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(user.get("id"), user.get("role", "jobseeker"))
    return jsonify({
        "token": token,
        "user": serialize_user(user)
    }), 200


@app.route('/api/auth/me', methods=['GET'])
@token_required
def me():
    return jsonify({"user": serialize_user(g.get("current_user"))}), 200


@app.route('/upload', methods=['POST'])
def upload_resumes():
    if 'files' not in request.files:
        return jsonify({"error": "No files part"}), 400

    files = request.files.getlist('files')
    uploaded_files = []

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            uploaded_files.append(filename)

    return jsonify({"uploaded_files": uploaded_files}), 200


@app.route('/shortlist', methods=['POST'])
def shortlist():
    data = request.get_json() or {}
    jd_text = data.get('jd', '')

    if not jd_text:
        return jsonify({"error": "Job description required"}), 400

    resumes = []
    for filepath in glob.glob(os.path.join(UPLOAD_FOLDER, '*.pdf')):
        text = extract_text_from_pdf(filepath)
        if text:
            name = os.path.splitext(os.path.basename(filepath))[0]
            score = calculate_match_score(jd_text, text)
            resumes.append({
                'name': name,
                'file': os.path.basename(filepath),
                'score': round(score, 1)
            })

    sorted_resumes = sorted(resumes, key=lambda x: x['score'], reverse=True)
    return jsonify(sorted_resumes), 200


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200


@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "service": "talentmatch-backend",
        "status": "running",
        "endpoints": [
            "/health",
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/me",
            "/upload",
            "/shortlist",
        ]
    }), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '5001'))
    app.run(host='0.0.0.0', port=port, debug=False)