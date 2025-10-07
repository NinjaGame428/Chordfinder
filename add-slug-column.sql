-- Migration script to add slug column to songs table
-- This script should be run on the existing database

-- Add slug column to songs table
ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index for slug column
CREATE UNIQUE INDEX IF NOT EXISTS idx_songs_slug_unique ON public.songs(slug);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Update existing songs with generated slugs
UPDATE public.songs 
SET slug = generate_slug(title) 
WHERE slug IS NULL OR slug = '';

-- Make slug column NOT NULL after populating
ALTER TABLE public.songs ALTER COLUMN slug SET NOT NULL;

-- Drop the temporary function
DROP FUNCTION IF EXISTS generate_slug(TEXT);
