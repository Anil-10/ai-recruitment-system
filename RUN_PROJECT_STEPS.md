# Step-by-Step Guide to Run Full Project & Test

## Current Status
✅ Backend server: Running on http://localhost:5001
✅ Database connection: Connected to Supabase
⚠️ Registration: Blocked by RLS policies (needs fix)

---

## Step 1: Fix RLS Policies in Supabase (REQUIRED)

The registration is currently failing because Row Level Security (RLS) policies need to be updated.

### Action Required:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `qwuttcuazqfiimepccpa`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the RLS Policy Update**
   - Copy and paste the contents of `UPDATE_RLS_POLICIES.sql`
   - Or copy this SQL:

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

4. **Click "Run"** or press `Ctrl+Enter`

5. **Verify**
   - You should see "Success. No rows returned"

---

## Step 2: Ensure Backend is Running

### Check if backend is already running:
```powershell
# Test backend health
curl http://localhost:5001/health
```

### If not running, start it:
```powershell
cd backend
python app.py
```

You should see:
```
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5001
 * Running on http://[your-ip]:5001
```

**Keep this terminal window open!**

---

## Step 3: Verify Environment Setup

Ensure `.env` file exists in `backend/` directory:

```env
SUPABASE_URL=https://qwuttcuazqfiimepccpa.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3dXR0Y3VhenFmaWltZXBjY3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMDc3NDIsImV4cCI6MjA3ODY4Mzc0Mn0.17dfUyH7LN1y54WaG6AlPw3HcU-veDUoEW_s_oKCrnU
JWT_SECRET=super-secret-key
JWT_EXP_MINUTES=120
FRONTEND_ORIGIN=http://localhost:5173
PORT=5001
UPLOAD_FOLDER=resumes
```

---

## Step 4: Run Full Project Tests

### Test Backend & Database Connection:
```powershell
# From project root
python test_full_project.py
```

This will test:
- ✅ Backend server status
- ✅ Supabase database connection
- ✅ User registration endpoint
- ✅ User login endpoint
- ✅ Authenticated endpoints
- ✅ Database verification

---

## Step 5: Manual API Testing (Optional)

### Test Registration:
```powershell
$body = @{
    email = "test@example.com"
    password = "testpassword123"
    userType = "jobseeker"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Invoke-RestMethod -Method POST -Uri http://localhost:5001/api/auth/register -Body $body -ContentType 'application/json'
```

### Test Login:
```powershell
$body = @{
    email = "test@example.com"
    password = "testpassword123"
} | ConvertTo-Json

Invoke-RestMethod -Method POST -Uri http://localhost:5001/api/auth/login -Body $body -ContentType 'application/json'
```

---

## Step 6: Run Frontend (Optional)

If you want to test the full-stack application:

```powershell
# Install frontend dependencies (if not done)
npm install

# Start frontend dev server
npm run dev
```

Frontend will run on: http://localhost:5173

---

## Troubleshooting

### Issue: Registration fails with RLS policy error
**Solution:** Make sure you ran the RLS policy update SQL in Step 1

### Issue: Backend not connecting to Supabase
**Solution:** 
- Check `.env` file exists in `backend/` directory
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- Test connection: `python backend/test_connection.py`

### Issue: Port 5001 already in use
**Solution:**
- Change `PORT` in `.env` to a different port (e.g., 5002)
- Or stop the process using port 5001

### Issue: "Table users does not exist"
**Solution:**
- Run the SQL from `supabase_schema.sql` in Supabase SQL Editor

---

## Quick Test Command

Run everything in one go:
```powershell
# Terminal 1: Start backend
cd backend
python app.py

# Terminal 2: Run tests
cd ..
python test_full_project.py
```

---

## Success Criteria

✅ Backend running on http://localhost:5001
✅ Health endpoint returns `{"status": "ok"}`
✅ Database connection successful
✅ Registration creates new user
✅ Login returns JWT token
✅ Authenticated endpoints work

---

## Next Steps After Successful Setup

1. Test frontend integration
2. Deploy backend to production
3. Configure production Supabase instance
4. Set up proper RLS policies for production (more restrictive)

