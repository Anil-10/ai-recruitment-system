"""
Test script to check Supabase connection
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')

print("=" * 50)
print("Supabase Connection Test")
print("=" * 50)
print(f"SUPABASE_URL: {'Set' if SUPABASE_URL else 'NOT SET'}")
print(f"SUPABASE_KEY: {'Set' if SUPABASE_KEY else 'NOT SET'}")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("\n[ERROR] SUPABASE_URL and SUPABASE_KEY must be set in .env file")
    print("\nPlease create a .env file in the backend directory with:")
    print("SUPABASE_URL=https://xxxxx.supabase.co")
    print("SUPABASE_KEY=eyJhbGc...")
    exit(1)

try:
    print(f"\nAttempting to connect to: {SUPABASE_URL}")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Try to query the users table
    print("Testing database connection...")
    response = supabase.table("users").select("count", count="exact").execute()
    
    print("\n[SUCCESS] Connected to Supabase!")
    print("[SUCCESS] Database is accessible")
    print("[SUCCESS] Users table exists")
    print(f"\nCurrent user count: {response.count if hasattr(response, 'count') else 'N/A'}")
    
except Exception as e:
    error_msg = str(e)
    print(f"\n[ERROR] Connection failed")
    print(f"Error details: {error_msg}")
    
    if "Invalid API key" in error_msg or "401" in error_msg:
        print("\n-> Check that your SUPABASE_KEY is correct (use the 'anon' public key)")
    elif "Table" in error_msg and "does not exist" in error_msg:
        print("\n-> Run the SQL schema from supabase_schema.sql in Supabase SQL Editor")
    elif "Connection" in error_msg or "network" in error_msg.lower():
        print("\n-> Check your internet connection and SUPABASE_URL")
    else:
        print("\n-> Please check your Supabase project settings")

print("=" * 50)

