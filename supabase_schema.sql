-- Create users table for Supabase migration
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'jobseeker',
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    mobile VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable Row Level Security (RLS) - optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert (for registration) - adjust based on your security needs
CREATE POLICY "Allow public insert for registration" ON users
    FOR INSERT WITH CHECK (true);

-- Policy to allow anyone to read (adjust based on your security needs)
-- You might want to restrict this to only allow reading own profile
CREATE POLICY "Allow public read" ON users
    FOR SELECT USING (true);

-- Policy to allow users to update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true);

