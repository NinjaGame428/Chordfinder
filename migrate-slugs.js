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

async function migrateSlugs() {
  try {
    console.log('Starting slug migration...');
    
    // Get all songs
    const { data: songs, error: fetchError } = await supabase
      .from('songs')
      .select('id, title, slug');
    
    if (fetchError) {
      console.error('Error fetching songs:', fetchError);
      return;
    }
    
    console.log(`Found ${songs?.length || 0} songs to process`);
    
    // Update songs that don't have slugs or have empty slugs
    const songsToUpdate = songs?.filter(song => !song.slug || song.slug.trim() === '') || [];
    
    console.log(`Found ${songsToUpdate.length} songs without slugs`);
    
    for (const song of songsToUpdate) {
      const slug = createSlug(song.title);
      
      console.log(`Updating song "${song.title}" with slug "${slug}"`);
      
      const { error: updateError } = await supabase
        .from('songs')
        .update({ slug })
        .eq('id', song.id);
      
      if (updateError) {
        console.error(`Error updating song ${song.id}:`, updateError);
      } else {
        console.log(`✓ Updated song ${song.id}`);
      }
    }
    
    console.log('Slug migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateSlugs();
