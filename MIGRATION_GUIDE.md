# MongoDB to Supabase Migration Guide

## Overview
This guide will help you migrate from MongoDB to Supabase (PostgreSQL) without using Docker.

## Prerequisites
- Supabase account (free tier works)
- Python 3.7+ installed locally
- Node.js installed (for frontend)

## Step-by-Step Migration

### Step 1: Set Up Supabase Project

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up or log in

2. **Create a New Project**
   - Click "New Project"
   - Choose organization
   - Set project name (e.g., "talentmatch")
   - Set database password (save it securely!)
   - Select region closest to you
   - Click "Create new project"

3. **Get Connection Details**
   - Once project is ready, go to Project Settings → API
   - Note down:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **Project API Key (anon/public)**: `eyJhbGc...` (starts with `eyJ`)
     - **Database Password**: (the one you set)

4. **Get Database Connection String**
   - Go to Project Settings → Database
   - Find "Connection string" → "URI"
   - It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual password

### Step 2: Create Database Schema

1. **Open SQL Editor in Supabase Dashboard**
   - Go to SQL Editor in left sidebar
   - Click "New query"

2. **Run the Schema SQL**
   - Copy and paste the contents of `supabase_schema.sql`
   - Click "Run" or press Ctrl+Enter
   - Verify the table is created by checking "Table Editor" → "users"

### Step 3: Install Supabase Python Client

Update your `backend/requirements.txt` to replace MongoDB dependencies with Supabase:

```txt
Flask==2.3.3
flask-cors==4.0.0
PyPDF2==3.0.1
Werkzeug==2.3.7
supabase==2.3.4
bcrypt==4.1.2
PyJWT==2.8.0
python-dotenv==1.0.1
postgrest==0.13.0
```

Install the new dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Step 4: Update Backend Code

The main changes needed in `backend/app.py`:

1. **Replace MongoDB imports** with Supabase client
2. **Replace all MongoDB operations** with Supabase queries
3. **Update ObjectId handling** to use UUID instead
4. **Update user serialization** to match PostgreSQL schema

Key differences:
- MongoDB `ObjectId` → PostgreSQL `UUID`
- MongoDB `find_one({"_id": ObjectId(id)})` → Supabase `.select().eq('id', id).single()`
- MongoDB `insert_one()` → Supabase `.insert()`
- MongoDB `find_one({"email": email})` → Supabase `.select().eq('email', email).single()`

### Step 5: Update Environment Variables

Create or update `.env` file in backend directory:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc... (your anon/public key)
SUPABASE_DB_PASSWORD=your_database_password
JWT_SECRET=super-secret-key
JWT_EXP_MINUTES=120
FRONTEND_ORIGIN=http://localhost:5173
PORT=5001
UPLOAD_FOLDER=resumes
```

### Step 6: Update docker-compose.yml

Remove the MongoDB service and update backend environment variables:

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: talentmatch-backend
    restart: unless-stopped
    environment:
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_KEY: ${SUPABASE_KEY}
      JWT_SECRET: super-secret-key
      FRONTEND_ORIGIN: http://localhost:5173
      PORT: 5001
    volumes:
      - backend_resumes:/app/resumes
    ports:
      - "5001:5001"

  frontend:
    # ... frontend config remains same

volumes:
  backend_resumes:
```

**Note:** If you're not using Docker, you can remove the docker-compose.yml entirely and run backend/frontend directly.

### Step 7: Running Without Docker

**Backend:**
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
npm install
npm run dev
```

### Step 8: Test the Migration

1. Test registration: `POST http://localhost:5001/api/auth/register`
2. Test login: `POST http://localhost:5001/api/auth/login`
3. Verify data in Supabase Dashboard → Table Editor → users

## Data Migration (If you have existing MongoDB data)

If you have existing users in MongoDB, you'll need to:

1. Export MongoDB users collection
2. Transform data:
   - Convert `_id` (ObjectId) to UUID
   - Map field names (camelCase → snake_case)
   - Ensure password hashes are preserved
3. Import to Supabase using SQL INSERT statements or Supabase dashboard

## Troubleshooting

- **Connection errors**: Check SUPABASE_URL and SUPABASE_KEY in .env
- **Authentication errors**: Verify RLS policies if enabled
- **UUID errors**: Ensure all ObjectId references are converted to UUID
- **Password verification**: Ensure bcrypt hashes are stored correctly

## Next Steps After Migration

1. Update frontend if it references MongoDB-specific features
2. Set up proper RLS policies in Supabase
3. Configure Supabase Auth if you want to use their built-in auth system
4. Consider using Supabase Storage for resume files instead of local storage

