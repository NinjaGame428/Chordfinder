# Deployment Guide for Vercel

## 🚀 Deploy Your Updated Registration System to Vercel

### Prerequisites
- Vercel account (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)
- Updated code with Supabase integration

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to your project directory**:
   ```bash
   cd "C:\Users\micha\OneDrive\Desktop\Chords finder new\pure-landing-shadcnui-template"
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy your project**:
   ```bash
   vercel
   ```

5. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? Choose your account
   - Link to existing project? **No** (for new deployment)
   - Project name: `chords-finder` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings? **No**

### Method 2: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/dashboard

2. **Import Project**:
   - Click **"New Project"**
   - Import your Git repository
   - Select your repository from the list

3. **Configure Environment Variables**:
   - In the project settings, go to **Environment Variables**
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://zsujkjbvliqphssuvvyw.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdWpramJ2bGlxcGhzc3V2dnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjEwMjYsImV4cCI6MjA3NDY5NzAyNn0.5bb8uOT3hexN832BiW9pg2LAN1NwgQoBkgYQAY4GH-4
     ```

4. **Deploy**:
   - Click **"Deploy"**
   - Wait for the deployment to complete

### Method 3: Deploy via Git Push (Automatic)

1. **Push your changes to Git**:
   ```bash
   git add .
   git commit -m "Add Supabase authentication integration"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to Vercel Dashboard
   - Import your Git repository
   - Vercel will automatically deploy on every push

## 🔧 Post-Deployment Configuration

### 1. Update Supabase Settings

After deployment, update your Supabase project settings:

1. **Go to Supabase Dashboard**:
   - Navigate to your project: https://supabase.com/dashboard/project/zsujkjbvliqphssuvvyw

2. **Update Site URL**:
   - Go to **Authentication** → **URL Configuration**
   - Add your Vercel domain to **Site URL**: `https://your-app-name.vercel.app`
   - Add your Vercel domain to **Redirect URLs**: `https://your-app-name.vercel.app/**`

3. **Disable Email Confirmation** (if not done already):
   - Go to **Authentication** → **Settings**
   - Uncheck **"Enable email confirmations"**
   - Click **Save**

### 2. Test Your Deployment

1. **Visit your deployed app**:
   - Go to your Vercel URL (e.g., `https://your-app-name.vercel.app`)

2. **Test Registration**:
   - Navigate to `/register`
   - Create a new account
   - Verify the user appears in Supabase dashboard

3. **Test Login**:
   - Try logging in with the new account
   - Verify authentication works

## 📋 Environment Variables for Vercel

Make sure these environment variables are set in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=https://zsujkjbvliqphssuvvyw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdWpramJ2bGlxcGhzc3V2dnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjEwMjYsImV4cCI6MjA3NDY5NzAyNn0.5bb8uOT3hexN832BiW9pg2LAN1NwgQoBkgYQAY4GH-4
```

## 🎉 Success!

After deployment, your registration system will be live and working with:
- ✅ Supabase authentication
- ✅ Automatic user verification
- ✅ Database integration
- ✅ Production-ready deployment

## 🔍 Troubleshooting

If you encounter issues:

1. **Check Vercel logs**:
   - Go to your project dashboard
   - Click on the deployment
   - Check the **Functions** tab for errors

2. **Verify environment variables**:
   - Ensure all Supabase credentials are correctly set

3. **Test locally first**:
   - Run `npm run dev` to test before deploying

4. **Check Supabase logs**:
   - Go to Supabase dashboard → Logs
   - Check for any authentication errors
