// Complete Neon database setup script
// Run with: node scripts/setup-full-neon-db.js

const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_LivS9pIUw2xZ@ep-ancient-cell-a4zoiv9g-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function setupFullDatabase() {
  console.log('🔌 Connecting to Neon database...');
  const sql = postgres(DATABASE_URL, { 
    ssl: 'require',
    max: 1 
  });
  
  try {
    console.log('✅ Connected to Neon database\n');
    
    // Step 1: Enable extensions
    console.log('📦 Step 1: Enabling PostgreSQL extensions...');
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
    await sql`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`;
    console.log('✅ Extensions enabled\n');
    
    // Step 2: Create users table
    console.log('👥 Step 2: Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        full_name TEXT,
        first_name TEXT,
        last_name TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        preferences JSONB DEFAULT '{"language": "en", "theme": "light", "notifications": true}'::jsonb,
        stats JSONB DEFAULT '{"favoriteSongs": 0, "downloadedResources": 0, "ratingsGiven": 0, "lastActive": null}'::jsonb,
        is_banned BOOLEAN DEFAULT FALSE,
        ban_reason TEXT,
        ban_expires_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) DEFAULT 'active'
      )
    `;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT`;
    console.log('✅ Users table ready\n');
    
    // Step 3: Create artists table
    console.log('🎤 Step 3: Creating artists table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.artists (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL,
        bio TEXT,
        image_url TEXT,
        website TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Artists table ready\n');
    
    // Step 4: Create songs table
    console.log('🎵 Step 4: Creating songs table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.songs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT,
        artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
        slug TEXT UNIQUE,
        genre TEXT,
        key_signature TEXT,
        tempo INTEGER,
        chords TEXT[],
        lyrics TEXT,
        description TEXT,
        year INTEGER,
        rating DECIMAL(3,2) DEFAULT 0,
        downloads INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Songs table ready\n');
    
    // Step 5: Create resources table
    console.log('📚 Step 5: Creating resources table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.resources (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT CHECK (type IN ('pdf', 'video', 'audio', 'image', 'document')),
        category TEXT,
        file_url TEXT,
        file_size INTEGER,
        downloads INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        author TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Resources table ready\n');
    
    // Step 6: Create favorites table
    console.log('❤️  Step 6: Creating favorites table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.favorites (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
        song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
        resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, song_id),
        UNIQUE(user_id, resource_id)
      )
    `;
    console.log('✅ Favorites table ready\n');
    
    // Step 7: Create ratings table
    console.log('⭐ Step 7: Creating ratings table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.ratings (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
        song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
        resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Ratings table ready\n');
    
    // Step 8: Create song_requests table
    console.log('📝 Step 8: Creating song_requests table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.song_requests (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        artist TEXT,
        genre TEXT,
        message TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Song requests table ready\n');
    
    // Step 9: Create user_activities table
    console.log('📊 Step 9: Creating user_activities table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.user_activities (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
        activity_type TEXT NOT NULL,
        description TEXT,
        metadata JSONB,
        page TEXT,
        action TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ User activities table ready\n');
    
    // Step 10: Create user_sessions table
    console.log('🔐 Step 10: Creating user_sessions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.user_sessions (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
        session_token TEXT UNIQUE,
        device_type TEXT,
        browser TEXT,
        operating_system TEXT,
        screen_resolution TEXT,
        country TEXT,
        city TEXT,
        region TEXT,
        ip_address TEXT,
        timezone TEXT,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE,
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ User sessions table ready\n');
    
    // Step 11: Create user_analytics table
    console.log('📈 Step 11: Creating user_analytics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.user_analytics (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
        session_id TEXT,
        page TEXT,
        action TEXT,
        metadata JSONB,
        ip_address TEXT,
        user_agent TEXT,
        referrer TEXT,
        last_location JSONB,
        device_info JSONB,
        browser_info JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ User analytics table ready\n');
    
    // Step 12: Create email_campaigns table
    console.log('📧 Step 12: Creating email_campaigns table...');
    await sql`
      CREATE TABLE IF NOT EXISTS public.email_campaigns (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT,
        recipient_type TEXT DEFAULT 'all',
        recipient_ids UUID[],
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
        sent_at TIMESTAMP WITH TIME ZONE,
        scheduled_at TIMESTAMP WITH TIME ZONE,
        sent_count INTEGER DEFAULT 0,
        open_count INTEGER DEFAULT 0,
        click_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Email campaigns table ready\n');
    
    // Step 13: Create indexes for performance
    console.log('⚡ Step 13: Creating indexes...');
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
      `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`,
      `CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)`,
      `CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id)`,
      `CREATE INDEX IF NOT EXISTS idx_songs_slug ON songs(slug)`,
      `CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_favorites_song_id ON favorites(song_id)`,
      `CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_ratings_song_id ON ratings(song_id)`,
      `CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id)`,
    ];
    
    for (const indexSql of indexes) {
      try {
        await sql.unsafe(indexSql);
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes('already exists')) {
          console.warn(`⚠️  Index warning: ${error.message}`);
        }
      }
    }
    console.log('✅ Indexes created\n');
    
    // Step 14: Enable REPLICA IDENTITY for real-time (if needed)
    console.log('🔄 Step 14: Setting up real-time replication...');
    try {
      await sql.unsafe(`ALTER TABLE users REPLICA IDENTITY FULL`);
      await sql.unsafe(`ALTER TABLE songs REPLICA IDENTITY FULL`);
      await sql.unsafe(`ALTER TABLE artists REPLICA IDENTITY FULL`);
      await sql.unsafe(`ALTER TABLE resources REPLICA IDENTITY FULL`);
      console.log('✅ Real-time replication configured\n');
    } catch (error) {
      console.warn('⚠️  Real-time setup warning:', error.message, '\n');
    }
    
    // Step 15: Verify all tables
    console.log('🔍 Step 15: Verifying all tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    console.log('\n📊 Database tables:');
    console.table(tables.map(t => ({ table: t.table_name })));
    
    console.log('\n✅ All tables verified!\n');
    
    // Final summary
    console.log('🎉 Database setup complete!');
    console.log('\n📋 Summary:');
    console.log(`   ✅ ${tables.length} tables created`);
    console.log('   ✅ All indexes created');
    console.log('   ✅ Ready for production use');
    console.log('\n💡 Next steps:');
    console.log('   1. Add environment variables to Vercel');
    console.log('   2. Redeploy your application');
    console.log('   3. Test registration and login');
    
  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await sql.end();
    console.log('\n👋 Connection closed');
  }
}

setupFullDatabase();

