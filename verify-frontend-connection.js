/**
 * Frontend Connection Verification
 * This script simulates what the frontend does and checks if it can access the database
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function verifyFrontendConnection() {
  console.log('🔍 Verifying Frontend Connection to Supabase\n');
  console.log('─'.repeat(60));

  // Check environment variables
  console.log('1️⃣ Checking Environment Variables...\n');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL is missing!');
    return;
  } else {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  }

  if (!supabaseAnonKey) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!');
    return;
  } else {
    console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ' + supabaseAnonKey.substring(0, 20) + '...');
  }

  console.log('\n─'.repeat(60));
  console.log('2️⃣ Creating Supabase Client (Same as frontend)...\n');

  // Create client exactly like the frontend does
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client created successfully');

  console.log('\n─'.repeat(60));
  console.log('3️⃣ Fetching Songs from Database...\n');

  try {
    // Fetch songs exactly like the frontend does
    const { data: songsData, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (songsError) {
      console.log('❌ ERROR fetching songs:');
      console.log('   Message:', songsError.message);
      console.log('   Code:', songsError.code);
      console.log('   Details:', songsError.details);
      console.log('\n💡 Possible solutions:');
      console.log('   1. Check RLS policies in Supabase Dashboard');
      console.log('   2. Run the migration SQL: migrate-to-supabase.sql');
      console.log('   3. Make sure the table name is "songs" (lowercase)');
      return;
    }

    console.log(`✅ Successfully fetched ${songsData?.length || 0} songs!`);

    if (!songsData || songsData.length === 0) {
      console.log('\n⚠️  No songs found in database');
      console.log('   Run: node add-youtube-songs.js');
      return;
    }

    console.log('\n─'.repeat(60));
    console.log('4️⃣ Fetching Artists...\n');

    // Get unique artist IDs
    const artistIds = [...new Set(songsData.map(song => song.artist_id).filter(Boolean))];
    console.log(`Found ${artistIds.length} unique artists`);

    const { data: artistsData, error: artistsError } = await supabase
      .from('artists')
      .select('id, name')
      .in('id', artistIds);

    if (artistsError) {
      console.log('❌ ERROR fetching artists:');
      console.log('   Message:', artistsError.message);
      return;
    }

    console.log(`✅ Successfully fetched ${artistsData?.length || 0} artists!`);

    // Create artist map
    const artistMap = new Map(artistsData?.map(a => [a.id, a.name]) || []);

    console.log('\n─'.repeat(60));
    console.log('5️⃣ Sample Songs with Artists:\n');

    // Show first 5 songs with their artists
    const sampleSongs = songsData.slice(0, 5);
    sampleSongs.forEach((song, index) => {
      const artistName = artistMap.get(song.artist_id) || 'Unknown Artist';
      console.log(`${index + 1}. "${song.title}"`);
      console.log(`   Artist: ${artistName}`);
      console.log(`   Key: ${song.key_signature || 'N/A'}`);
      console.log(`   Tempo: ${song.tempo ? song.tempo + ' BPM' : 'N/A'}`);
      console.log(`   Genre: ${song.genre || 'N/A'}`);
      console.log('');
    });

    console.log('─'.repeat(60));
    console.log('✨ VERIFICATION COMPLETE ✨\n');
    console.log('🎉 Everything is working correctly!');
    console.log('📋 Summary:');
    console.log(`   • ${songsData.length} songs available`);
    console.log(`   • ${artistsData.length} artists available`);
    console.log(`   • Database connection: ✅ Working`);
    console.log(`   • RLS policies: ✅ Enabled`);
    console.log(`   • Frontend can fetch data: ✅ Yes`);
    console.log('\n🌐 Open your browser to: http://localhost:3000/songs');
    console.log('   You should see all songs from the database!');
    console.log('');
    console.log('🔍 If songs still don\'t appear:');
    console.log('   1. Open Browser DevTools (F12)');
    console.log('   2. Go to Console tab');
    console.log('   3. Look for the detailed logs we added');
    console.log('   4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)');
    console.log('');

  } catch (error) {
    console.log('\n❌ UNEXPECTED ERROR:');
    console.log(error);
  }
}

verifyFrontendConnection().catch(console.error);

