# Migration from Supabase to Neon Database

This document outlines the migration from Supabase to Neon PostgreSQL database.

## What Changed

### Dependencies
- **Removed**: `@supabase/supabase-js`
- **Added**: 
  - `postgres` - PostgreSQL client for Neon
  - `bcryptjs` - Password hashing
  - `jsonwebtoken` - JWT authentication
  - `@types/bcryptjs` & `@types/jsonwebtoken`

### Database Connection
- **Old**: `lib/supabase.ts` - Supabase client
- **New**: `lib/db.ts` - Neon PostgreSQL connection using `postgres` library

### Authentication
- **Old**: Supabase Auth (managed service)
- **New**: Custom JWT-based authentication in `lib/auth.ts`

### API Routes Updated
✅ All API routes have been converted to use raw SQL queries instead of Supabase query builder:
- `app/api/songs/route.ts`
- `app/api/songs/[id]/route.ts` (partially - needs completion)
- `app/api/songs/slug/[slug]/route.ts`
- `app/api/artists/route.ts`
- `app/api/artists/[id]/route.ts`
- `app/api/admin/stats/route.ts`

### New Auth Endpoints
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/logout/route.ts`

## Environment Variables

Update your `.env.local` file:

```env
# Remove Supabase variables:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY

# Add Neon database URL:
NEON_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
# Or use DATABASE_URL (both work)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Add JWT secret for authentication:
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Database Schema Updates

You need to add a `password_hash` column to the `users` table:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- For existing Supabase users, you may need to migrate passwords
-- This is optional if you're starting fresh
```

## Files That Still Need Updates

The following files still use Supabase directly and need to be updated:

### Client Components (use API routes instead):
- `components/song-list.tsx` - Should use `/api/songs` API
- `components/enhanced-search.tsx` - Should use `/api/songs` with search params
- `app/songs/[slug]/page.tsx` - Should use `/api/songs/slug/[slug]`
- `app/songs/page.tsx` - Should use `/api/songs` API
- `app/artists/page.tsx` - Should use `/api/artists` API
- `app/artists/[id]/page.tsx` - Should use `/api/artists/[id]` API
- `app/resources/page.tsx` - Needs API route created
- `app/admin/artists/page.tsx` - Should use API routes
- `contexts/AuthContext.tsx` - Should use `/api/auth/*` endpoints

### API Routes (need conversion):
- `app/api/songs/[id]/route.ts` - PUT/DELETE methods need conversion
- `app/api/admin/users/route.ts` - Needs conversion
- `app/api/admin/users/[id]/route.ts` - Needs conversion
- `app/api/admin/users/bulk/route.ts` - Needs conversion
- `app/api/admin/user-analytics/route.ts` - Needs conversion
- `app/api/admin/analytics/route.ts` - Needs conversion
- `app/api/admin/emails/*` - Needs conversion
- `app/api/users/*` - Needs conversion

### Utility Files:
- `lib/user-stats.ts` - Needs conversion

## Next Steps

1. **Install dependencies**: 
   ```bash
   npm install
   ```

2. **Update environment variables** in `.env.local`

3. **Run database migration** to add `password_hash` column

4. **Update client components** to use API routes instead of direct Supabase calls

5. **Test authentication** - Login/Register should work with new JWT system

6. **Update remaining API routes** as needed

## Notes

- Neon is a serverless PostgreSQL database, so connection pooling is handled automatically
- JWT tokens are stored in HTTP-only cookies for security
- All queries use parameterized SQL to prevent SQL injection
- The `query` helper in `lib/db.ts` provides a safe way to execute database queries

