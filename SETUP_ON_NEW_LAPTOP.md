# Complete Setup Guide - Running Project on a New Laptop

This guide will help you set up and run the AI Recruitment Platform on a new laptop from scratch.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### 1. **Python 3.8+**
   - Download from: https://www.python.org/downloads/
   - During installation, check "Add Python to PATH"
   - Verify installation:
     ```powershell
     python --version
     ```

### 2. **Node.js 16+ and npm**
   - Download from: https://nodejs.org/
   - Install the LTS version
   - Verify installation:
     ```powershell
     node --version
     npm --version
     ```

### 3. **Git** (Optional, if using version control)
   - Download from: https://git-scm.com/downloads

---

## 📦 Step 1: Transfer/Copy Project Files

### Option A: Using USB Drive or Cloud Storage
1. Copy the entire project folder to the new laptop
2. Place it in a location like `D:\College\FinalYearProject\TRY 2` or `C:\Projects\TRY 2`

### Option B: Using Git (if project is in a repository)
```powershell
git clone <your-repository-url>
cd "TRY 2"
```

---

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create Supabase Account & Project
1. Go to https://supabase.com
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: `talentmatch` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"** and wait 1-2 minutes

### 2.2 Get Supabase Credentials
1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (the long string)

### 2.3 Create Database Schema
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Open `supabase_schema.sql` from your project
4. Copy and paste the entire contents into the SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. You should see: "Success. No rows returned"

### 2.4 Update RLS Policies (Important!)
1. Still in **SQL Editor**, click **"New query"**
2. Open `UPDATE_RLS_POLICIES.sql` from your project (if it exists)
3. Or copy and paste this SQL:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Allow public insert for registration" ON users;
DROP POLICY IF EXISTS "Allow public read" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Policy to allow anyone to insert (for registration)
CREATE POLICY "Allow public insert for registration" ON users
    FOR INSERT WITH CHECK (true);

-- Policy to allow anyone to read
CREATE POLICY "Allow public read" ON users
    FOR SELECT USING (true);

-- Policy to allow users to update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true);
```

4. Click **"Run"**

---

## 🔧 Step 3: Backend Setup

### 3.1 Navigate to Backend Directory
```powershell
cd "D:\College\FinalYearProject\TRY 2\backend"
```

### 3.2 Create Environment File
Create a file named `.env` in the `backend` folder with this content:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...

# JWT Configuration
JWT_SECRET=super-secret-key-change-in-production
JWT_EXP_MINUTES=120

# Flask Configuration
FRONTEND_ORIGIN=http://localhost:5173
PORT=5001

# File Upload Configuration
UPLOAD_FOLDER=resumes
```

**⚠️ IMPORTANT:** Replace `xxxxx.supabase.co` and `eyJhbGc...` with your actual Supabase URL and key from Step 2.2!

### 3.3 Install Python Dependencies
```powershell
# Make sure you're in the backend directory
pip install -r requirements.txt
```

If you get permission errors, use:
```powershell
pip install --user -r requirements.txt
```

### 3.4 Create Resumes Folder
```powershell
# Make sure resumes folder exists
mkdir resumes
```

---

## 🎨 Step 4: Frontend Setup

### 4.1 Navigate to Project Root
```powershell
cd "D:\College\FinalYearProject\TRY 2"
```

### 4.2 Create Frontend Environment File (Optional)
If you need to change the backend URL, create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5001
```

**Note:** This is optional. The frontend defaults to `http://localhost:5001` if not set.

### 4.3 Install Node Dependencies
```powershell
npm install
```

This may take a few minutes. Wait for it to complete.

---

## 🚀 Step 5: Run the Project

You need to run both backend and frontend simultaneously in separate terminal windows.

### Terminal 1: Start Backend Server
```powershell
cd "D:\College\FinalYearProject\TRY 2\backend"
python app.py
```

You should see:
```
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5001
```

**Keep this terminal open!**

### Terminal 2: Start Frontend Server
Open a **new** terminal/PowerShell window:
```powershell
cd "D:\College\FinalYearProject\TRY 2"
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Keep this terminal open too!**

### 5.3 Access the Application
1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the application homepage

---

## ✅ Step 6: Verify Everything Works

### Test Backend Health
In a new terminal:
```powershell
curl http://localhost:5001/health
```

Or in PowerShell:
```powershell
Invoke-RestMethod -Uri http://localhost:5001/health
```

Should return: `{"status": "ok"}`

### Test Registration
1. Go to http://localhost:5173
2. Click "Register" or "Sign Up"
3. Create a test account
4. Try logging in

### Check Database
1. Go to Supabase Dashboard
2. Navigate to **Table Editor** → **users**
3. You should see your registered user

---

## 🔍 Troubleshooting

### Issue: "SUPABASE_URL not set" or "SUPABASE_KEY not set"
**Solution:**
- Make sure `.env` file exists in `backend/` folder
- Check that there are no spaces around the `=` sign
- Verify the values are correct (no quotes needed)

### Issue: "Table users does not exist"
**Solution:**
- Run the SQL from `supabase_schema.sql` in Supabase SQL Editor
- Make sure you clicked "Run" after pasting

### Issue: "Port 5001 already in use"
**Solution:**
- Change `PORT=5001` to `PORT=5002` in `backend/.env`
- Update `FRONTEND_ORIGIN` if needed
- Restart the backend server

### Issue: "Port 5173 already in use" (Frontend)
**Solution:**
- Vite will automatically use the next available port
- Or stop the process using port 5173

### Issue: "Module not found" (Python)
**Solution:**
```powershell
cd backend
pip install -r requirements.txt
```

### Issue: "npm install fails"
**Solution:**
- Make sure Node.js is installed: `node --version`
- Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again
- Check your internet connection

### Issue: "Registration fails with RLS policy error"
**Solution:**
- Make sure you ran the RLS policy update SQL in Step 2.4
- Check Supabase Dashboard → Authentication → Policies

### Issue: "Cannot connect to backend"
**Solution:**
- Make sure backend is running (check Terminal 1)
- Verify backend URL in frontend code matches `http://localhost:5001`
- Check Windows Firewall isn't blocking the connection
- If backend runs on a different port, create `.env` file in project root with `VITE_API_BASE_URL=http://localhost:YOUR_PORT`

---

## 📝 Quick Reference Commands

### Start Backend
```powershell
cd backend
python app.py
```

### Start Frontend
```powershell
npm run dev
```

### Test Backend Connection
```powershell
python backend/test_connection.py
```

### Run Full Project Tests
```powershell
python test_full_project.py
```

---

## 🔐 Security Notes

1. **Never commit `.env` file to Git** - It contains sensitive credentials
2. **Change `JWT_SECRET`** - Use a strong random string in production
3. **Update RLS Policies** - For production, make policies more restrictive
4. **Use Environment Variables** - Don't hardcode credentials in code

---

## 📦 Project Structure Overview

```
TRY 2/
├── backend/           # Flask backend server
│   ├── app.py        # Main backend application
│   ├── .env          # Environment variables (create this!)
│   ├── requirements.txt
│   └── resumes/      # Uploaded resume files
├── src/              # React frontend source code
├── package.json      # Frontend dependencies
└── supabase_schema.sql  # Database schema
```

---

## 🆘 Need Help?

1. Check the error message carefully
2. Verify all prerequisites are installed
3. Make sure Supabase project is active
4. Check that both servers are running
5. Review the troubleshooting section above

---

## ✅ Success Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Project files copied to new laptop
- [ ] Supabase project created
- [ ] Database schema created
- [ ] RLS policies updated
- [ ] `.env` file created with correct credentials
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running on port 5001
- [ ] Frontend server running on port 5173
- [ ] Application accessible in browser
- [ ] Registration works
- [ ] Login works

---

**You're all set! 🎉**

The application should now be running on your new laptop. If you encounter any issues, refer to the troubleshooting section above.

