// Script to create a test user in Neon database
// Run with: node scripts/create-test-user.js

const bcrypt = require('bcryptjs');
const postgres = require('postgres');

const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Please set NEON_DATABASE_URL or DATABASE_URL environment variable');
  process.exit(1);
}

async function createTestUser() {
  const sql = postgres(DATABASE_URL, { ssl: 'require' });
  
  try {
    const email = 'test@example.com';
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Check if user exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    
    if (existing && existing.length > 0) {
      console.log('User already exists. Updating password...');
      await sql`
        UPDATE users 
        SET password_hash = ${passwordHash}, updated_at = NOW()
        WHERE email = ${email}
      `;
      console.log('✅ Password updated for existing user');
    } else {
      // Create new user
      const result = await sql`
        INSERT INTO users (
          email,
          password_hash,
          full_name,
          role,
          created_at,
          updated_at
        ) VALUES (
          ${email},
          ${passwordHash},
          'Test User',
          'user',
          NOW(),
          NOW()
        )
        RETURNING id, email, role
      `;
      console.log('✅ Test user created:', result[0]);
    }
    
    console.log('\n📝 Test credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('relation "users" does not exist')) {
      console.error('\n💡 Run the setup-database.sql script in Neon SQL Editor first!');
    }
  } finally {
    await sql.end();
  }
}

createTestUser();

