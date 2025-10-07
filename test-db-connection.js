require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('🔍 Testing Supabase connection...\n');

  // Test 1: Count total songs
  const { data: songsCount, error: countError } = await supabase
    .from('songs')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error counting songs:', countError.message);
  } else {
    console.log(`✅ Total songs in database: ${songsCount?.length || 0}`);
  }

  // Test 2: Fetch first 5 songs with artist info
  const { data: songs, error: songsError } = await supabase
    .from('songs')
    .select(`
      id,
      title,
      genre,
      key_signature,
      tempo,
      year,
      artists (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (songsError) {
    console.error('❌ Error fetching songs:', songsError.message);
  } else {
    console.log(`\n✅ Successfully fetched ${songs?.length || 0} songs\n`);
    console.log('📋 Sample songs:');
    songs?.forEach((song, index) => {
      console.log(`\n${index + 1}. ${song.title}`);
      console.log(`   Artist: ${song.artists?.name || 'Unknown'}`);
      console.log(`   Genre: ${song.genre || 'N/A'}`);
      console.log(`   Year: ${song.year || 'N/A'}`);
      console.log(`   Key: ${song.key_signature || 'N/A'}`);
    });
  }

  // Test 3: Count total artists
  const { data: artistsCount, error: artistsError } = await supabase
    .from('artists')
    .select('*', { count: 'exact', head: true });

  if (artistsError) {
    console.error('\n❌ Error counting artists:', artistsError.message);
  } else {
    console.log(`\n\n✅ Total artists in database: ${artistsCount?.length || 0}`);
  }

  console.log('\n✨ Database connection test completed!');
}

testConnection().catch(console.error);

