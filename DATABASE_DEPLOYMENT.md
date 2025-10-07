# Database Deployment Guide

## 🚀 Deploy User Analytics Database Schema

To enable user tracking and analytics in your admin dashboard, you need to deploy the database schema to your Supabase database.

### 📋 Step 1: Access Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### 📝 Step 2: Execute Database Schema

Copy and paste the following SQL into the SQL Editor and execute it:

```sql
-- User Analytics Tables Migration
-- This script creates the necessary tables for user tracking and analytics

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  device_type VARCHAR(50),
  browser VARCHAR(100),
  operating_system VARCHAR(100),
  screen_resolution VARCHAR(50),
  country VARCHAR(100),
  city VARCHAR(100),
  region VARCHAR(100),
  ip_address INET,
  timezone VARCHAR(100),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activities Table
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  description TEXT,
  metadata JSONB,
  page VARCHAR(255),
  action VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add ban fields to users table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_banned') THEN
    ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'ban_reason') THEN
    ALTER TABLE users ADD COLUMN ban_reason TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'ban_expires_at') THEN
    ALTER TABLE users ADD COLUMN ban_expires_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
    ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'full_name') THEN
    ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
  END IF;
END $$;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- RLS Policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User Sessions Policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- User Activities Policies
CREATE POLICY "Users can view their own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Profiles Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies for analytics
CREATE POLICY "Admins can view all sessions" ON user_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all activities" ON user_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
```

### ✅ Step 3: Verify Deployment

After executing the SQL:

1. **Check Tables**: Go to **Table Editor** and verify these tables exist:
   - `user_sessions`
   - `user_activities` 
   - `user_profiles`

2. **Check Users Table**: Verify the `users` table has these new columns:
   - `is_banned`
   - `ban_reason`
   - `ban_expires_at`
   - `status`
   - `role`
   - `full_name`

3. **Test Admin Panel**: Go to your admin panel and click "Test DB" to verify the connection works.

### 🎯 What This Enables

After deployment, your admin dashboard will show:

- **Real User Data**: Actual users from your database
- **Location Analytics**: Countries, cities, IP addresses
- **Device Analytics**: Device types, browsers, operating systems
- **User Activity**: Session tracking, page views, interactions
- **User Management**: Ban/unban users, role management
- **Real-time Analytics**: Live user activity and engagement metrics

### 🔧 Troubleshooting

If you encounter issues:

1. **Permission Errors**: Make sure you're logged in as the project owner
2. **Table Already Exists**: The script uses `IF NOT EXISTS` so it's safe to run multiple times
3. **RLS Policies**: If policies fail, you may need to disable RLS temporarily and re-enable it

### 📊 Next Steps

Once deployed:

1. **Add User Tracking**: Wrap your app with `UserTrackingProvider`
2. **Initialize Tracking**: Call `startTracking(userId)` when users log in
3. **View Analytics**: Check the admin panel for real user data
4. **Monitor Activity**: Track user behavior and engagement

Your admin dashboard will now display real user analytics with location, device, and activity data!
