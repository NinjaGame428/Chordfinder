# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect GitHub Repository:**
   - Go to https://vercel.com
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

3. **Add Environment Variables:**
   Go to Project Settings → Environment Variables and add:

   ```
   NEON_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

Or use the PowerShell script:
```powershell
.\scripts\deploy-vercel.ps1
```

## Post-Deployment

### 1. Verify Deployment
- Visit your Vercel deployment URL
- Check that all pages load correctly
- Test API endpoints: `/api/songs`, `/api/artists`

### 2. Set Up Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

### 3. Enable Analytics (Optional)
- Go to Project Settings → Analytics
- Enable Vercel Analytics for performance monitoring

## Environment Variables Checklist

Make sure these are set in Vercel:

- ✅ `NEON_DATABASE_URL` - Your Neon PostgreSQL connection string
- ✅ `DATABASE_URL` - Alternative name (same as above)
- ✅ `JWT_SECRET` - Secret key for JWT authentication
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - If still using Supabase
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - If still using Supabase
- ✅ `NODE_ENV` - Set to `production`

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` dependencies are correct

### Database Connection Issues
- Verify `NEON_DATABASE_URL` is correct
- Check Neon dashboard for connection string
- Ensure SSL mode is enabled (`?sslmode=require`)

### API Routes Not Working
- Check server logs in Vercel dashboard
- Verify database connection
- Ensure environment variables are set correctly

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:
- `main` branch → Production deployment
- Other branches → Preview deployments

No additional configuration needed!

