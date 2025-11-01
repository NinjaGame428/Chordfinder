/**
 * Deploy Database Schema to Neon
 * 
 * Usage: node neon/deploy-schema.js
 * 
 * Requires: NEON_DATABASE_URL or DATABASE_URL in environment
 */

const { readFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: NEON_DATABASE_URL or DATABASE_URL environment variable is required');
  console.log('\nPlease set your Neon connection string:');
  console.log('  export NEON_DATABASE_URL="postgresql://user:password@host/database?sslmode=require"');
  process.exit(1);
}

const sqlFile = path.join(__dirname, 'neon-migration.sql');

try {
  console.log('📦 Reading migration file...');
  const sql = readFileSync(sqlFile, 'utf8');
  
  console.log('🚀 Deploying to Neon database...');
  console.log(`📡 Connection: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
  
  // Use psql to execute the SQL
  try {
    execSync(`psql "${databaseUrl}" -f "${sqlFile}"`, {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Error executing migration:', error.message);
    console.log('\n💡 Alternative: Copy the contents of neon/neon-migration.sql');
    console.log('   and paste into Neon SQL Editor at: https://console.neon.tech');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error reading migration file:', error.message);
  process.exit(1);
}

