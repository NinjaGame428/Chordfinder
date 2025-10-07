# Supabase Setup for HeavenKeys Chords Finder

This directory contains the Supabase configuration and database schema for the HeavenKeys Chords Finder application.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `heavenkeys-chords-finder`
   - **Database Password**: Generate a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"

### 2. Get Your Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `your_supabase_anon_key`

### 3. Set Up the Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `schema.sql`
3. Click **Run** to execute the schema
4. (Optional) Copy and paste the contents of `seed.sql` to add sample data
5. Click **Run** to execute the seed data

### 4. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `https://your-vercel-app.vercel.app`
   - **Redirect URLs**: Add your production and development URLs
   - **Email confirmation**: Enable if desired
   - **Email templates**: Customize as needed

### 5. Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 6. Deploy to Vercel

1. Update your Vercel environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

2. Redeploy your application:
   ```bash
   vercel --prod
   ```

## 📊 Database Schema

The database includes the following tables:

### Core Tables
- **users** - Extended user profiles (extends auth.users)
- **artists** - Music artists and performers
- **songs** - Song catalog with chords and lyrics
- **resources** - Educational materials and downloads

### Relationship Tables
- **favorites** - User favorite songs and resources
- **ratings** - User ratings and reviews

### Key Features
- **Row Level Security (RLS)** - Secure data access
- **Automatic user creation** - Triggers for new user registration
- **Optimized indexes** - Fast queries and searches
- **Sample data** - Ready-to-use test data

## 🔐 Security

The database is configured with:
- **Row Level Security (RLS)** on all tables
- **User-specific policies** for data access
- **Secure authentication** with Supabase Auth
- **API key protection** with proper permissions

## 🧪 Testing

After setup, you can test your configuration:

1. Visit `/test-supabase` - Test database connection
2. Visit `/env-check` - Verify environment variables
3. Visit `/auth-test` - Test authentication flows

## 📝 Development

For local development:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

3. Start local development:
   ```bash
   supabase start
   ```

4. Apply migrations:
   ```bash
   supabase db reset
   ```

## 🚀 Production Deployment

1. **Database**: Your Supabase project handles the database
2. **Authentication**: Supabase Auth handles user management
3. **Storage**: Supabase Storage for file uploads
4. **API**: Auto-generated REST and GraphQL APIs
5. **Real-time**: Real-time subscriptions for live features

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 🆘 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your environment variables
   - Verify the API key is correct
   - Ensure the project is active

2. **Database connection issues**
   - Check your project URL
   - Verify database is running
   - Check network connectivity

3. **Authentication not working**
   - Check redirect URLs
   - Verify site URL configuration
   - Check email settings

### Getting Help

- Check the `/test-supabase` page for diagnostics
- Review the Supabase dashboard logs
- Check the browser console for errors
- Verify environment variables are set correctly
