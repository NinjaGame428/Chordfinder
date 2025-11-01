# Deployment Guide

## 1. Push Database to Neon

### Quick Deploy (Recommended)

1. Go to your Neon project: https://console.neon.tech
2. Open the SQL Editor
3. Copy the entire contents of `neon/neon-migration.sql`
4. Paste and run in the SQL Editor

### Alternative: Command Line

```bash
# Set your Neon connection string
export NEON_DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Run migration
node neon/deploy-schema.js
```

### Enable Real-Time (PostgreSQL Logical Replication)

Neon supports logical replication, but for true real-time subscriptions you need:

1. **Simple polling:** Update your code to poll endpoints
2. **Server-Sent Events:** Use SSE for real-time updates
3. **WebSocket:** Implement WebSocket server with Socket.io
4. **Supabase Realtime:** Use Supabase Realtime service separately

The schema already includes `REPLICA IDENTITY FULL` for all tables, which is required for logical replication.

## 2. Deploy to GitHub

### Initial Setup

```bash
# Initialize git if not already done
git init

# Add remote repository
git remote add origin https://github.com/yourusername/your-repo.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - Neon database migration"

# Push to GitHub
git push -u origin main
```

### GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
- Runs on every push to main/master
- Installs dependencies
- Runs linter and type checks
- Builds the Next.js app
- Uploads build artifacts

### Environment Variables in GitHub

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `NEON_DATABASE_URL` - Your Neon connection string
- `DATABASE_URL` - Alternative name (same value)
- `JWT_SECRET` - Your JWT secret key
- `NEXT_PUBLIC_SUPABASE_URL` - If still using Supabase for some features
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - If still using Supabase

## 3. Deploy to Vercel/Netlify

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and add environment variables in Vercel dashboard
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## 4. Environment Variables

Create `.env.local` for local development:

```env
# Neon Database
NEON_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
# OR
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# JWT Authentication
JWT_SECRET=your-super-secret-key-change-this-in-production

# Supabase (if still using)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Node Environment
NODE_ENV=production
```

## 5. Verify Deployment

1. **Database:**
   ```sql
   -- Check tables
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' ORDER BY table_name;
   ```

2. **Application:**
   - Visit your deployed URL
   - Test API endpoints: `/api/songs`, `/api/artists`
   - Verify authentication works

## 6. Real-Time Setup (Optional)

Since Neon doesn't have built-in real-time like Supabase, you have options:

### Option 1: Polling
Update your components to poll API endpoints every few seconds.

### Option 2: Server-Sent Events
Use Next.js API routes with SSE for real-time updates.

### Option 3: Supabase Realtime
Keep using Supabase Realtime separately for real-time features while using Neon for main database.

### Option 4: WebSocket
Implement WebSocket server using Socket.io or ws.

## Troubleshooting

### Database Connection Issues
- Verify your Neon connection string is correct
- Check that your IP is allowed (Neon allows all by default)
- Ensure SSL is enabled (`?sslmode=require`)

### Migration Errors
- Some SQL features may require superuser privileges
- Remove `CREATE PUBLICATION` lines if you get permission errors
- Remove RLS policies if you're not using them

### Build Errors
- Ensure all environment variables are set
- Check that TypeScript types are correct
- Verify all dependencies are installed

