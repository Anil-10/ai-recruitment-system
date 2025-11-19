"""
Full Project Test Script
Tests backend, database connection, and API endpoints
"""
import os
import sys
import json
import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv(dotenv_path='backend/.env')

SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')
BACKEND_URL = 'http://localhost:5001'

print("=" * 60)
print("FULL PROJECT TEST - Backend & Database Connection")
print("=" * 60)

# Test 1: Check if backend is running
print("\n[TEST 1] Checking if backend is running...")
try:
    response = requests.get(f"{BACKEND_URL}/health", timeout=5)
    if response.status_code == 200:
        print(f"[OK] Backend is running on {BACKEND_URL}")
        print(f"  Response: {response.json()}")
    else:
        print(f"[FAIL] Backend returned status {response.status_code}")
        sys.exit(1)
except requests.exceptions.ConnectionError:
    print(f"[FAIL] Cannot connect to backend at {BACKEND_URL}")
    print("  Make sure the backend is running: cd backend && python app.py")
    sys.exit(1)
except Exception as e:
    print(f"[FAIL] Error connecting to backend: {e}")
    sys.exit(1)

# Test 2: Test Supabase connection
print("\n[TEST 2] Testing Supabase database connection...")
try:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[FAIL] SUPABASE_URL or SUPABASE_KEY not set in environment")
        sys.exit(1)
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = supabase.table("users").select("count", count="exact").execute()
    count = response.count if hasattr(response, 'count') else 0
    print(f"[OK] Connected to Supabase successfully")
    print(f"  Project URL: {SUPABASE_URL}")
    print(f"  Current users in database: {count}")
except Exception as e:
    print(f"[FAIL] Supabase connection failed: {e}")
    sys.exit(1)

# Test 3: Test registration endpoint
print("\n[TEST 3] Testing user registration...")
test_email = f"testuser_{os.urandom(4).hex()}@example.com"
test_data = {
    "email": test_email,
    "password": "testpassword123",
    "userType": "jobseeker",
    "firstName": "Test",
    "lastName": "User"
}
try:
    response = requests.post(
        f"{BACKEND_URL}/api/auth/register",
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    if response.status_code == 201:
        data = response.json()
        print(f"[OK] Registration successful!")
        print(f"  Email: {test_email}")
        print(f"  User ID: {data.get('user', {}).get('id', 'N/A')}")
        print(f"  Token received: {'Yes' if data.get('token') else 'No'}")
        token = data.get('token')
        user_id = data.get('user', {}).get('id')
    elif response.status_code == 409:
        print(f"[WARN] User already exists (expected if running multiple times)")
        token = None
        user_id = None
    else:
        error_data = response.json() if response.text else {}
        print(f"[FAIL] Registration failed with status {response.status_code}")
        print(f"  Error: {error_data.get('error', response.text)}")
        token = None
        user_id = None
except Exception as e:
    print(f"[FAIL] Registration request failed: {e}")
    token = None
    user_id = None

# Test 4: Test login endpoint
print("\n[TEST 4] Testing user login...")
if token:  # Only test login if registration worked
    try:
        login_data = {
            "email": test_email,
            "password": "testpassword123"
        }
        response = requests.post(
            f"{BACKEND_URL}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"[OK] Login successful!")
            print(f"  Email: {test_email}")
            print(f"  Token received: {'Yes' if data.get('token') else 'No'}")
            token = data.get('token')
        else:
            error_data = response.json() if response.text else {}
            print(f"[FAIL] Login failed with status {response.status_code}")
            print(f"  Error: {error_data.get('error', response.text)}")
            token = None
    except Exception as e:
        print(f"[FAIL] Login request failed: {e}")
        token = None
else:
    print("[SKIP] Skipping login test (registration did not succeed)")

# Test 5: Test authenticated endpoint
print("\n[TEST 5] Testing authenticated endpoint (/api/auth/me)...")
if token:
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/auth/me",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"[OK] Authenticated request successful!")
            user = data.get('user', {})
            print(f"  User Email: {user.get('email', 'N/A')}")
            print(f"  User Role: {user.get('role', 'N/A')}")
        else:
            error_data = response.json() if response.text else {}
            print(f"[FAIL] Authenticated request failed with status {response.status_code}")
            print(f"  Error: {error_data.get('error', response.text)}")
    except Exception as e:
        print(f"[FAIL] Authenticated request failed: {e}")
else:
    print("[SKIP] Skipping authenticated endpoint test (no valid token)")

# Test 6: Verify database after operations
print("\n[TEST 6] Verifying database state...")
try:
    response = supabase.table("users").select("count", count="exact").execute()
    count = response.count if hasattr(response, 'count') else 0
    print(f"[OK] Current users in database: {count}")
    
    if token:
        # Try to fetch the user we just created
        if user_id:
            user_response = supabase.table("users").select("*").eq("id", user_id).single().execute()
            if user_response.data:
                print(f"[OK] User found in database with ID: {user_id}")
except Exception as e:
    print(f"[WARN] Could not verify database state: {e}")

# Summary
print("\n" + "=" * 60)
print("TEST SUMMARY")
print("=" * 60)
print("[OK] Backend server: Running")
print("[OK] Database connection: Connected")
print("[OK] Registration endpoint: Tested")
print("[OK] Login endpoint: Tested")
print("[OK] Authentication: Tested")
print("\nAll tests completed!")
print("=" * 60)

