# Database Fix Instructions

## Issues Fixed

1. **Missing `slug` column in songs table** - This was causing the error "column songs.slug does not exist"
2. **Error handling in fetchFavoriteSongs function** - Improved error handling to prevent console errors

## Manual Steps Required

### Step 1: Add Slug Column to Database

Run the following SQL in your Supabase SQL editor:

```sql
-- Add slug column to songs table
ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index for slug column
CREATE UNIQUE INDEX IF NOT EXISTS idx_songs_slug_unique ON public.songs(slug);
```

### Step 2: Populate Slug Column

After adding the column, run the migration script:

```bash
node fix-database-issues.js
```

This will:
- Generate slugs for all existing songs
- Update the database with the new slugs
- Handle any errors gracefully

## Code Changes Made

### 1. Database Schema (`supabase/schema.sql`)
- Added `slug TEXT UNIQUE` column to songs table
- Added index for slug column

### 2. Song Details Page (`app/songs/[slug]/page.tsx`)
- Added fallback logic when slug column doesn't exist
- Improved error handling for database queries

### 3. User Stats (`lib/user-stats.ts`)
- Improved error handling in `fetchFavoriteSongs` function
- Better error logging and graceful fallbacks

## Files Created

- `add-slug-column.sql` - SQL migration script
- `migrate-slugs.js` - Node.js migration script
- `fix-database-issues.js` - Comprehensive database fix script
- `run-slug-migration.js` - Alternative migration script

## Testing

After completing the manual steps:

1. Check that song pages load correctly
2. Verify that favorite songs functionality works
3. Test that song slugs are generated properly
4. Ensure no console errors appear

## Next Steps

1. Run the SQL commands in Supabase
2. Run the migration script
3. Test the application
4. Commit and push changes to GitHub
