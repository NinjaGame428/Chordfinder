// Script to setup Neon database
// Run with: node scripts/setup-neon-db.js

const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_LivS9pIUw2xZ@ep-ancient-cell-a4zoiv9g-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function setupDatabase() {
  console.log('🔌 Connecting to Neon database...');
  const sql = postgres(DATABASE_URL, { 
    ssl: 'require',
    max: 1 
  });
  
  try {
    console.log('✅ Connected to Neon database');
    
    // Read the SQL setup script
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'setup-database.sql'), 
      'utf8'
    );
    
    // Split by semicolons and execute each statement
    const statements = sqlScript
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 0) {
        try {
          await sql.unsafe(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
        } catch (error) {
          // Ignore errors for IF NOT EXISTS statements
          if (!error.message.includes('already exists') && 
              !error.message.includes('duplicate') &&
              !error.message.includes('DROP TABLE')) {
            console.warn(`⚠️  Statement ${i + 1} warning:`, error.message);
          }
        }
      }
    }
    
    // Verify users table
    console.log('\n🔍 Verifying users table...');
    const result = await sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
      ORDER BY ordinal_position
    `;
    
    console.log('\n📊 Users table structure:');
    console.table(result);
    
    // Check if password_hash exists
    const hasPasswordHash = result.some(r => r.column_name === 'password_hash');
    
    if (hasPasswordHash) {
      console.log('\n✅ Database setup complete! password_hash column exists.');
    } else {
      console.log('\n⚠️  Warning: password_hash column not found. Adding it...');
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT`;
      console.log('✅ password_hash column added');
    }
    
    console.log('\n🎉 Database setup successful!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.message.includes('relation "users" does not exist')) {
      console.error('\n💡 Creating users table...');
      try {
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
          );
          
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
          CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        `;
        console.log('✅ Users table created!');
      } catch (createError) {
        console.error('❌ Failed to create users table:', createError.message);
      }
    }
    process.exit(1);
  } finally {
    await sql.end();
    console.log('\n👋 Connection closed');
  }
}

setupDatabase();

