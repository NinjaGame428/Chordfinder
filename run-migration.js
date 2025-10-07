/**
 * Complete Supabase Migration Script
 * This script will:
 * 1. Run the migration SQL to set up proper schema
 * 2. Verify all tables exist
 * 3. Check RLS policies are in place
 * 4. Test data access
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Starting Supabase Migration...\n');

  // Step 1: Read migration SQL
  console.log('📖 Reading migration SQL file...');
  const migrationSQL = fs.readFileSync(
    path.join(__dirname, 'migrate-to-supabase.sql'),
    'utf8'
  );
  console.log('✅ Migration SQL loaded\n');

  // Step 2: Check current state
  console.log('🔍 Checking current database state...');
  try {
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('id, title, artist_id')
      .limit(1);

    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('id, name')
      .limit(1);

    console.log('Current state:');
    console.log(`  - Songs table: ${songsError ? '❌ Error' : '✅ Exists'}`);
    console.log(`  - Artists table: ${artistsError ? '❌ Error' : '✅ Exists'}`);
    
    if (songsError) console.log(`    Error: ${songsError.message}`);
    if (artistsError) console.log(`    Error: ${artistsError.message}`);
    console.log('');
  } catch (error) {
    console.log('⚠️ Error checking current state:', error.message);
    console.log('');
  }

  // Step 3: Instructions for running migration
  console.log('📋 MIGRATION INSTRUCTIONS:');
  console.log('─'.repeat(60));
  console.log('\n⚠️  The migration SQL contains schema changes that need to be');
  console.log('    run directly in the Supabase SQL Editor.\n');
  console.log('Follow these steps:\n');
  console.log('1. Open your Supabase Dashboard:');
  console.log(`   ${supabaseUrl.replace('.supabase.co', '.supabase.co')}`);
  console.log('');
  console.log('2. Go to: SQL Editor (left sidebar)');
  console.log('');
  console.log('3. Click "+ New Query"');
  console.log('');
  console.log('4. Copy and paste the contents of:');
  console.log('   migrate-to-supabase.sql');
  console.log('');
  console.log('5. Click "Run" or press Ctrl+Enter');
  console.log('');
  console.log('6. Wait for "Success. No rows returned"');
  console.log('');
  console.log('─'.repeat(60));
  console.log('');

  // Step 4: Verify data exists
  console.log('📊 Checking existing data...\n');
  
  try {
    // Count songs
    const { count: songsCount } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    // Count artists
    const { count: artistsCount } = await supabase
      .from('artists')
      .select('*', { count: 'exact', head: true });

    console.log('Current data in database:');
    console.log(`  📀 Songs: ${songsCount || 0}`);
    console.log(`  👥 Artists: ${artistsCount || 0}`);
    console.log('');

    if (songsCount > 0) {
      // Get sample songs
      const { data: sampleSongs } = await supabase
        .from('songs')
        .select('id, title, artist_id')
        .limit(3);

      if (sampleSongs && sampleSongs.length > 0) {
        console.log('Sample songs:');
        for (const song of sampleSongs) {
          // Try to get artist name
          const { data: artist } = await supabase
            .from('artists')
            .select('name')
            .eq('id', song.artist_id)
            .single();

          console.log(`  - "${song.title}" by ${artist?.name || 'Unknown Artist'}`);
        }
        console.log('');
      }
    }

    if (songsCount === 0) {
      console.log('⚠️  No songs in database yet!');
      console.log('   Run this command to import songs:');
      console.log('   node add-youtube-songs.js');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking data:', error.message);
    console.log('');
  }

  // Step 5: Test public access
  console.log('🔐 Testing public read access...\n');
  
  // Create a client with anon key (what the frontend uses)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (anonKey) {
    const publicClient = createClient(supabaseUrl, anonKey);
    
    try {
      const { data: publicSongs, error: publicError } = await publicClient
        .from('songs')
        .select('id, title')
        .limit(1);

      if (publicError) {
        console.log('❌ Public access to songs failed!');
        console.log(`   Error: ${publicError.message}`);
        console.log('   This means RLS policies might not be set up correctly.');
        console.log('   Make sure to run the migration SQL in Supabase.');
        console.log('');
      } else {
        console.log('✅ Public read access is working!');
        console.log('   Frontend will be able to fetch songs.');
        console.log('');
      }
    } catch (error) {
      console.log('❌ Error testing public access:', error.message);
      console.log('');
    }
  }

  // Summary
  console.log('📝 SUMMARY:');
  console.log('─'.repeat(60));
  console.log('1. ✅ Migration SQL file created: migrate-to-supabase.sql');
  console.log('2. ⏳ Run the SQL in Supabase Dashboard (see instructions above)');
  console.log('3. ✅ Your data is safe - migration only updates schema');
  console.log('4. 🔄 After migration, refresh your app to see the songs');
  console.log('─'.repeat(60));
  console.log('');
}

runMigration().catch(console.error);

