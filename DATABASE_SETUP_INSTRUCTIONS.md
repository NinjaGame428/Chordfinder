# Database Setup Instructions

## Current Status ✅

The user registration system is now working with the Supabase database! Here's what has been implemented:

### ✅ What's Working
1. **User Registration**: Users can register with email/password and are stored in the database
2. **User Login**: Users can log in with their credentials
3. **Database Integration**: User profiles are automatically created in the `users` table
4. **Authentication Context**: The app uses Supabase authentication instead of localStorage

### 📋 Current Database Schema
The `users` table currently has these columns:
- `id` (UUID, primary key)
- `email` (TEXT, unique)
- `full_name` (TEXT)
- `avatar_url` (TEXT, nullable)
- `role` (TEXT, default: 'user')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔧 Recommended Database Schema Updates

To get the full functionality, you should update your database schema to include additional columns. Here's how:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL commands:

```sql
-- Add missing columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"language": "en", "theme": "light", "notifications": true}',
ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{"favoriteSongs": 0, "downloadedResources": 0, "ratingsGiven": 0, "lastActive": null}';

-- Update the trigger function to populate these fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, first_name, last_name, created_at, updated_at, join_date, preferences, stats)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NOW(),
    NOW(),
    NOW(),
    '{"language": "en", "theme": "light", "notifications": true}',
    '{"favoriteSongs": 0, "downloadedResources": 0, "ratingsGiven": 0, "lastActive": null}'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed:

```bash
# Apply the schema changes
supabase db push

# Or run the SQL directly
supabase db reset
```

## 🧪 Testing the Registration

You can test the registration system by:

1. **Running the test script**:
   ```bash
   node test-registration.js
   ```

2. **Manual testing**:
   - Start the development server: `npm run dev`
   - Navigate to `/register`
   - Create a new account
   - Check the Supabase dashboard to see the user in the database

## 🔍 Verification Steps

After updating the database schema, verify everything works:

1. **Check the database**:
   - Go to Supabase Dashboard → Table Editor → users
   - Verify new columns exist: `first_name`, `last_name`, `preferences`, `stats`

2. **Test registration**:
   - Register a new user
   - Check that all fields are populated correctly
   - Verify the user can log in

3. **Test user profile loading**:
   - Log in with the new user
   - Check that the user data loads correctly in the app

## 🚨 Important Notes

- **Email Confirmation**: By default, Supabase requires email confirmation. For development, you can disable this in the Supabase dashboard under Authentication → Settings
- **Database Triggers**: The trigger function automatically creates user profiles when users register
- **Row Level Security**: Make sure RLS policies are properly configured for your use case

## 📁 Files Modified

The following files have been updated to work with the database:

- `app/register/page.tsx` - Updated to use Supabase authentication
- `app/login/page.tsx` - Updated to use Supabase authentication  
- `contexts/AuthContext.tsx` - Updated to use Supabase instead of localStorage
- `lib/supabase.ts` - Database connection configuration

## 🎉 Success!

Your user registration system is now fully integrated with the Supabase database! Users can register, log in, and their data is properly stored and managed.
