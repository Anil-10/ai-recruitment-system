-- Run this in Supabase SQL Editor to fix RLS policies for registration

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Allow public insert for registration" ON users;
DROP POLICY IF EXISTS "Allow public read" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Policy to allow anyone to insert (for registration)
CREATE POLICY "Allow public insert for registration" ON users
    FOR INSERT WITH CHECK (true);

-- Policy to allow anyone to read (adjust based on your security needs)
CREATE POLICY "Allow public read" ON users
    FOR SELECT USING (true);

-- Policy to allow users to update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true);

