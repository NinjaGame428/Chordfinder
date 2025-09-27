# Supabase Setup Guide for Chords Finder

This guide will help you set up Supabase for your Chords Finder application.

## 🚀 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `chords-finder`
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be set up (usually takes 1-2 minutes)

## 🔑 Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)
   - **Service role key** (starts with `eyJ`) - Keep this secret!

## ⚙️ Step 3: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## 🗄️ Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- ✅ User profiles table
- ✅ Artists table
- ✅ Songs table
- ✅ Resources table
- ✅ Favorites table
- ✅ Ratings table
- ✅ Song requests table
- ✅ Row Level Security policies
- ✅ Sample data

## 🔐 Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following:

### Site URL
- Add your production URL: `https://your-domain.vercel.app`
- Add your development URL: `http://localhost:3000`

### Email Templates (Optional)
- Customize the email templates for signup, password reset, etc.

### Providers (Optional)
- Enable Google, GitHub, or other OAuth providers if desired

## 🚀 Step 6: Deploy to Vercel

1. Add your environment variables to Vercel:
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add the same variables from your `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

2. Redeploy your application:
   ```bash
   vercel --prod
   ```

## 🧪 Step 7: Test the Integration

1. **Test Authentication**:
   - Try signing up with a new account
   - Try logging in
   - Check if user data appears in Supabase dashboard

2. **Test Data Operations**:
   - Browse songs and artists
   - Try adding favorites
   - Test the rating system

3. **Check Database**:
   - Go to Supabase dashboard → **Table Editor**
   - Verify that data is being created correctly

## 🔧 Step 8: Admin Setup

1. **Create Admin User**:
   - Sign up with your admin email
   - Go to Supabase dashboard → **Table Editor** → **users**
   - Find your user and change `role` from `user` to `admin`

2. **Test Admin Features**:
   - Log in and navigate to `/admin`
   - Verify you can see the admin dashboard
   - Test user management features

## 📊 Step 9: Monitor and Maintain

1. **Monitor Usage**:
   - Check Supabase dashboard for API usage
   - Monitor database performance

2. **Backup Strategy**:
   - Set up automated backups in Supabase
   - Consider point-in-time recovery

3. **Scaling**:
   - Monitor database size and performance
   - Upgrade Supabase plan if needed

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid API key" error**:
   - Double-check your environment variables
   - Ensure you're using the correct project URL and keys

2. **"Row Level Security" errors**:
   - Verify that RLS policies are set up correctly
   - Check that users are authenticated before accessing protected data

3. **Authentication not working**:
   - Check Site URL configuration in Supabase
   - Verify environment variables are set correctly

4. **Database connection issues**:
   - Check if your Supabase project is paused
   - Verify your database password is correct

### Getting Help:

- 📚 [Supabase Documentation](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 🐛 [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🎉 You're All Set!

Your Chords Finder application is now connected to Supabase with:
- ✅ Real user authentication
- ✅ Persistent data storage
- ✅ Row Level Security
- ✅ Real-time capabilities
- ✅ Admin dashboard functionality

Happy coding! 🎵
