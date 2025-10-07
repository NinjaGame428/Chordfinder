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

async function fixDatabaseIssues() {
  try {
    console.log('🔧 Fixing database issues...');
    
    // Step 1: Check if slug column exists
    console.log('📋 Checking if slug column exists...');
    
    try {
      const { data: testData, error: testError } = await supabase
        .from('songs')
        .select('id, title, slug')
        .limit(1);
      
      if (testError && testError.message.includes('column songs.slug does not exist')) {
        console.log('❌ Slug column does not exist');
        console.log('');
        console.log('🚨 MANUAL STEP REQUIRED:');
        console.log('Please run the following SQL in your Supabase SQL editor:');
        console.log('');
        console.log('-- Add slug column');
        console.log('ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS slug TEXT;');
        console.log('');
        console.log('-- Create unique index');
        console.log('CREATE UNIQUE INDEX IF NOT EXISTS idx_songs_slug_unique ON public.songs(slug);');
        console.log('');
        console.log('After running the SQL, run this script again.');
        return;
      } else if (testError) {
        console.error('❌ Error checking slug column:', testError);
        return;
      } else {
        console.log('✅ Slug column exists');
      }
    } catch (error) {
      console.error('❌ Error checking database:', error);
      return;
    }
    
    // Step 2: Get all songs and populate slugs
    console.log('📋 Fetching all songs...');
    const { data: songs, error: fetchError } = await supabase
      .from('songs')
      .select('id, title, slug');
    
    if (fetchError) {
      console.error('❌ Error fetching songs:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${songs?.length || 0} songs`);
    
    // Step 3: Update songs that don't have slugs
    const songsToUpdate = songs?.filter(song => !song.slug || song.slug.trim() === '') || [];
    
    if (songsToUpdate.length === 0) {
      console.log('✅ All songs already have slugs');
      return;
    }
    
    console.log(`🔄 Updating ${songsToUpdate.length} songs without slugs...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const song of songsToUpdate) {
      const slug = createSlug(song.title);
      
      try {
        const { error: updateError } = await supabase
          .from('songs')
          .update({ slug })
          .eq('id', song.id);
        
        if (updateError) {
          console.error(`❌ Error updating song "${song.title}":`, updateError);
          errorCount++;
        } else {
          console.log(`✅ Updated "${song.title}" with slug "${slug}"`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Exception updating song "${song.title}":`, error);
        errorCount++;
      }
    }
    
    console.log('');
    console.log('📊 Migration Summary:');
    console.log(`✅ Successfully updated: ${successCount} songs`);
    console.log(`❌ Errors: ${errorCount} songs`);
    console.log('');
    console.log('🎉 Database migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

fixDatabaseIssues();
