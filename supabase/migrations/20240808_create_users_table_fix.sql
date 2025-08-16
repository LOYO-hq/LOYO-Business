-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token_identifier TEXT NOT NULL,
  name TEXT,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Disable RLS temporarily to allow initial setup
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Enable realtime for users table
alter publication supabase_realtime add table users;
