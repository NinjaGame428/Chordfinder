require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function verifySongs() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('\n🔍 Verifying Supabase Database...\n');

  // Get song count
  const { data: allSongs, error } = await supabase
    .from('songs')
    .select('id, title, artists(name)')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Found ${allSongs.length} songs (showing first 10):\n`);
  
  allSongs.forEach((song, i) => {
    console.log(`${i + 1}. "${song.title}"`);
    console.log(`   Artist: ${song.artists?.name || 'Unknown'}`);
    console.log(`   ID: ${song.id}\n`);
  });

  const { count } = await supabase
    .from('songs')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Total songs in database: ${count}`);
  console.log('\n✨ Your songs are ready to be displayed!\n');
}

verifySongs();

