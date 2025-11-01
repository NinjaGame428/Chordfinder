-- Script to fix songs with null artist_id in the database
-- This script will:
-- 1. Find songs with null artist_id but have an artist name
-- 2. Try to match them with existing artists by name
-- 3. Create missing artists if they don't exist
-- 4. Update songs with the correct artist_id

-- Step 1: Create a temporary function to get or create artist by name
CREATE OR REPLACE FUNCTION get_or_create_artist(artist_name TEXT)
RETURNS UUID AS $$
DECLARE
  artist_uuid UUID;
BEGIN
  -- Try to find existing artist by name (case-insensitive)
  SELECT id INTO artist_uuid
  FROM artists
  WHERE LOWER(TRIM(name)) = LOWER(TRIM(artist_name))
  LIMIT 1;
  
  -- If artist doesn't exist, create it
  IF artist_uuid IS NULL THEN
    INSERT INTO artists (name, created_at, updated_at)
    VALUES (TRIM(artist_name), NOW(), NOW())
    RETURNING id INTO artist_uuid;
  END IF;
  
  RETURN artist_uuid;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Update songs with null artist_id but have artist name
UPDATE songs
SET artist_id = get_or_create_artist(artist)
WHERE artist_id IS NULL 
  AND artist IS NOT NULL 
  AND TRIM(artist) != '';

-- Step 3: Also update artist text field for songs that have artist_id but null artist text
UPDATE songs
SET artist = (
  SELECT name 
  FROM artists 
  WHERE artists.id = songs.artist_id
)
WHERE artist_id IS NOT NULL 
  AND (artist IS NULL OR TRIM(artist) = '');

-- Step 4: Drop the temporary function
DROP FUNCTION IF EXISTS get_or_create_artist(TEXT);

-- Verification query: Show songs that still have null artist_id
SELECT 
  id,
  title,
  artist,
  artist_id,
  created_at
FROM songs
WHERE artist_id IS NULL
ORDER BY created_at DESC;

