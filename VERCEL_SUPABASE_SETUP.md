# Vercel + Supabase Setup Guide

## 🚀 Quick Setup for Vercel Deployment

### 1. Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set up Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow public read access for basic user info
CREATE POLICY "Public read access" ON users
  FOR SELECT USING (true);
```

### 3. Supabase Auth Settings

In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. Set **Site URL** to your Vercel domain: `https://your-app.vercel.app`
3. Add **Redirect URLs**: 
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/dashboard`
4. **Disable email confirmation** (for easier testing):
   - Go to **Authentication** → **Settings** → **Email**
   - Uncheck "Enable email confirmations"

### 4. Test Pages

After deployment, test these URLs:

- `/env-check` - Check if environment variables are loaded
- `/auth-test` - Test authentication flow
- `/login` - Login page
- `/register` - Registration page

### 5. Common Issues & Solutions

#### Issue: "Supabase not configured"
**Solution**: Check that environment variables are set in Vercel dashboard

#### Issue: "Registration failed"
**Solution**: 
1. Check Supabase auth settings
2. Ensure database schema is created
3. Check browser console for detailed errors

#### Issue: "Login redirects but dashboard loads forever"
**Solution**: 
1. Check that user is created in database
2. Verify RLS policies are correct
3. Check browser console for auth state

### 6. Debug Steps

1. Visit `/env-check` to verify environment variables
2. Visit `/auth-test` to test authentication
3. Check browser console for error messages
4. Check Supabase logs in dashboard

### 7. Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Database schema created in Supabase
- [ ] Auth settings configured
- [ ] Site URL set to production domain
- [ ] Redirect URLs configured
- [ ] Email confirmation disabled (optional)
- [ ] Test registration and login flow

## 🔧 Troubleshooting

If authentication still doesn't work:

1. **Check Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
   - Redeploy after adding variables

2. **Check Supabase Configuration**:
   - Verify the URL and keys are correct
   - Check Supabase project is active
   - Verify database is accessible

3. **Check Browser Console**:
   - Open browser dev tools
   - Look for error messages
   - Check network requests to Supabase

4. **Test with Test Pages**:
   - Use `/env-check` to verify configuration
   - Use `/auth-test` to debug authentication flow
