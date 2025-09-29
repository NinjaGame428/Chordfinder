# Fix Network Error on Login

## 🔧 Quick Fixes for "Network error" on Sign In

### 1. **Check Vercel Environment Variables**

Your Vercel deployment needs the correct Supabase environment variables. Let's verify and fix them:

#### Option A: Via Vercel Dashboard
1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Make sure these variables are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://zsujkjbvliqphssuvvyw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdWpramJ2bGlxcGhzc3V2dnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjEwMjYsImV4cCI6MjA3NDY5NzAyNn0.5bb8uOT3hexN832BiW9pg2LAN1NwgQoBkgYQAY4GH-4
   ```
4. **Redeploy** your project after adding the variables

#### Option B: Via Vercel CLI
```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://zsujkjbvliqphssuvvyw.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdWpramJ2bGlxcGhzc3V2dnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjEwMjYsImV4cCI6MjA3NDY5NzAyNn0.5bb8uOT3hexN832BiW9pg2LAN1NwgQoBkgYQAY4GH-4

# Redeploy
vercel --prod
```

### 2. **Update Supabase URL Configuration**

Your Supabase project needs to allow your Vercel domain:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/zsujkjbvliqphssuvvyw
2. **Navigate to Authentication → URL Configuration**
3. **Add your Vercel domain**:
   - **Site URL**: `https://heavenkeys-chords-finder-907hc8bd1-jackmichaels-projects.vercel.app`
   - **Redirect URLs**: 
     - `https://heavenkeys-chords-finder-907hc8bd1-jackmichaels-projects.vercel.app/**`
     - `https://heavenkeys-chords-finder-907hc8bd1-jackmichaels-projects.vercel.app/dashboard`
     - `https://heavenkeys-chords-finder-907hc8bd1-jackmichaels-projects.vercel.app/login`

### 3. **Test the Fix**

After making these changes:

1. **Redeploy your Vercel project**:
   ```bash
   vercel --prod
   ```

2. **Test the login**:
   - Go to your Vercel URL
   - Try to register a new user
   - Try to log in with existing credentials

### 4. **Debug Network Issues**

If the problem persists, check the browser console:

1. **Open Developer Tools** (F12)
2. **Go to Network tab**
3. **Try to log in**
4. **Look for failed requests** to Supabase
5. **Check the Console tab** for error messages

### 5. **Alternative: Test with Local Development**

To verify the authentication works:

1. **Run locally**:
   ```bash
   npm run dev
   ```

2. **Test on localhost**:
   - Go to `http://localhost:3000/login`
   - Try to log in
   - If it works locally, the issue is with Vercel configuration

## 🚨 Common Issues

- **Missing Environment Variables**: Vercel doesn't have the Supabase credentials
- **Wrong Supabase URL**: Using old/incorrect Supabase project URL
- **CORS Issues**: Supabase not configured to allow your domain
- **Network Timeout**: Supabase project might be paused or have issues

## ✅ Success Indicators

After fixing, you should see:
- ✅ Login works without network errors
- ✅ Users can register and log in
- ✅ No console errors in browser
- ✅ Successful requests to Supabase in Network tab
