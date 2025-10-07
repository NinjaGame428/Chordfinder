const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function addSlugColumn() {
  try {
    console.log('Adding slug column to songs table...');
    
    // First, let's try to add the slug column using a direct SQL query
    // We'll use the service role key which has admin privileges
    
    // Get all songs first (without slug column)
    const { data: songs, error: fetchError } = await supabase
      .from('songs')
      .select('id, title');
    
    if (fetchError) {
      console.error('Error fetching songs:', fetchError);
      return;
    }
    
    console.log(`Found ${songs?.length || 0} songs to process`);
    
    // Since we can't directly alter the table structure through the client,
    // we'll need to do this through the Supabase dashboard or SQL editor
    console.log('Please run the following SQL in your Supabase SQL editor:');
    console.log('');
    console.log('-- Add slug column');
    console.log('ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS slug TEXT;');
    console.log('');
    console.log('-- Create unique index');
    console.log('CREATE UNIQUE INDEX IF NOT EXISTS idx_songs_slug_unique ON public.songs(slug);');
    console.log('');
    console.log('After running the SQL, run this script again to populate the slugs.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addSlugColumn();
