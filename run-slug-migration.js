const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Starting slug column migration...');
    
    // Add slug column
    console.log('Adding slug column...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS slug TEXT;'
    });
    
    if (alterError) {
      console.error('Error adding slug column:', alterError);
      return;
    }
    
    // Create unique index
    console.log('Creating unique index...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_songs_slug_unique ON public.songs(slug);'
    });
    
    if (indexError) {
      console.error('Error creating index:', indexError);
      return;
    }
    
    // Get all songs without slugs
    console.log('Fetching songs without slugs...');
    const { data: songs, error: fetchError } = await supabase
      .from('songs')
      .select('id, title')
      .is('slug', null);
    
    if (fetchError) {
      console.error('Error fetching songs:', fetchError);
      return;
    }
    
    console.log(`Found ${songs?.length || 0} songs to update`);
    
    // Generate and update slugs
    for (const song of songs || []) {
      const slug = song.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      console.log(`Updating song "${song.title}" with slug "${slug}"`);
      
      const { error: updateError } = await supabase
        .from('songs')
        .update({ slug })
        .eq('id', song.id);
      
      if (updateError) {
        console.error(`Error updating song ${song.id}:`, updateError);
      }
    }
    
    // Make slug column NOT NULL
    console.log('Making slug column NOT NULL...');
    const { error: notNullError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.songs ALTER COLUMN slug SET NOT NULL;'
    });
    
    if (notNullError) {
      console.error('Error making slug NOT NULL:', notNullError);
      return;
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
