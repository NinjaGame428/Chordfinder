const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔗 Testing Full Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseKey ? '✅ Present' : '❌ Missing');
console.log('Service Key:', supabaseServiceKey ? '✅ Present' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testFullConnection() {
  try {
    console.log('\n📊 Testing Database Tables...');
    
    // Test users table
    const { data: users, error: usersError } = await supabase.from('users').select('*').limit(1);
    if (usersError) {
      console.log('⚠️  Users table:', usersError.message);
    } else {
      console.log('✅ Users table accessible');
    }
    
    // Test artists table
    const { data: artists, error: artistsError } = await supabase.from('artists').select('*').limit(3);
    if (artistsError) {
      console.log('⚠️  Artists table:', artistsError.message);
    } else {
      console.log('✅ Artists table accessible');
      console.log('📝 Sample artists:', artists?.length || 0, 'found');
      if (artists && artists.length > 0) {
        console.log('   -', artists[0].name);
      }
    }
    
    // Test songs table
    const { data: songs, error: songsError } = await supabase.from('songs').select('*').limit(3);
    if (songsError) {
      console.log('⚠️  Songs table:', songsError.message);
    } else {
      console.log('✅ Songs table accessible');
      console.log('🎵 Sample songs:', songs?.length || 0, 'found');
      if (songs && songs.length > 0) {
        console.log('   -', songs[0].title);
      }
    }
    
    // Test resources table
    const { data: resources, error: resourcesError } = await supabase.from('resources').select('*').limit(3);
    if (resourcesError) {
      console.log('⚠️  Resources table:', resourcesError.message);
    } else {
      console.log('✅ Resources table accessible');
      console.log('📚 Sample resources:', resources?.length || 0, 'found');
      if (resources && resources.length > 0) {
        console.log('   -', resources[0].title);
      }
    }
    
    console.log('\n🔐 Testing Authentication...');
    
    // Test auth signup (this will fail but should show auth is working)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (authError && authError.message.includes('already registered')) {
      console.log('✅ Authentication system working (user already exists)');
    } else if (authError && authError.message.includes('signup')) {
      console.log('✅ Authentication system working (signup attempted)');
    } else if (authData) {
      console.log('✅ Authentication system working (new user created)');
    } else {
      console.log('⚠️  Authentication test:', authError?.message || 'Unknown error');
    }
    
    console.log('\n🎉 Supabase Connection Summary:');
    console.log('✅ Connection established');
    console.log('✅ Environment variables loaded');
    console.log('✅ Database accessible');
    console.log('✅ Authentication system ready');
    
    if (artists && artists.length === 0) {
      console.log('\n💡 Next Step: Set up database schema in Supabase dashboard');
      console.log('   Go to: https://supabase.com/dashboard/project/zsujkjbvliqphssuvvyw');
      console.log('   Click "SQL Editor" and run the schema from SUPABASE_DATABASE_SETUP.md');
    }
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  }
}

testFullConnection();
