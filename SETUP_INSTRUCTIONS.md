# Setup Instructions for Supabase Migration

## Quick Setup Checklist

### ✅ Code Changes Completed
1. ✅ Updated `backend/requirements.txt` - Replaced `pymongo` with `supabase`
2. ✅ Refactored `backend/app.py` - All MongoDB operations converted to Supabase
3. ✅ Updated `docker-compose.yml` - Removed MongoDB service

### 📋 What You Need to Do

#### Step 1: Set Up Supabase Project
1. Go to https://supabase.com and create an account
2. Create a new project:
   - Project name: `talentmatch` (or any name you prefer)
   - Set a strong database password (save it!)
   - Choose a region close to you
3. Wait for project to initialize (1-2 minutes)

#### Step 2: Get Your Supabase Credentials
1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (the long string starting with `eyJ`)

#### Step 3: Create Database Schema
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `supabase_schema.sql`
4. Click **Run** (or press Ctrl+Enter)
5. Verify the table was created: Go to **Table Editor** → You should see `users` table

#### Step 4: Create Environment File
Create a `.env` file in the `backend` directory with:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc... (paste your anon/public key here)

# JWT Configuration
JWT_SECRET=super-secret-key
JWT_EXP_MINUTES=120

# Flask Configuration
FRONTEND_ORIGIN=http://localhost:5173
PORT=5001

# File Upload Configuration
UPLOAD_FOLDER=resumes
```

**Replace the placeholder values with your actual Supabase URL and key!**

#### Step 5: Install Dependencies (Without Docker)
```bash
cd backend
pip install -r requirements.txt
```

#### Step 6: Run the Application (Without Docker)
**Backend:**
```bash
cd backend
python app.py
```

**Frontend (in a new terminal):**
```bash
npm install
npm run dev
```

#### Step 7: Test the Application
1. Open http://localhost:5173
2. Try registering a new user
3. Try logging in
4. Check Supabase Dashboard → Table Editor → `users` to see your data

## Important Notes

- **No Docker required**: The application now runs directly without Docker
- **MongoDB removed**: All MongoDB references have been removed from the codebase
- **Database**: Your data is now stored in Supabase (PostgreSQL cloud database)
- **Environment variables**: Make sure to set `SUPABASE_URL` and `SUPABASE_KEY` in your `.env` file

## Troubleshooting

**Error: "SUPABASE_URL not set"**
- Make sure you created a `.env` file in the `backend` directory
- Check that `SUPABASE_URL` and `SUPABASE_KEY` are set correctly

**Error: "Table users does not exist"**
- Run the SQL schema from `supabase_schema.sql` in Supabase SQL Editor

**Error: "Invalid API key"**
- Double-check that you copied the **anon/public** key (not the service_role key)
- Make sure there are no extra spaces in your `.env` file

**Connection errors**
- Verify your Supabase project is active (check Supabase dashboard)
- Check that your internet connection is working
- Ensure firewall isn't blocking Supabase API calls

## Field Name Changes

The database now uses snake_case instead of camelCase:
- `firstName` → `first_name`
- `lastName` → `last_name`
- `createdAt` → `created_at`
- `_id` → `id` (UUID instead of ObjectId)

The API still returns camelCase to the frontend for compatibility.

