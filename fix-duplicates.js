#!/usr/bin/env node

/**
 * Fix duplicate supabase declarations
 */

const fs = require('fs');

// Read the service file
let content = fs.readFileSync('lib/supabase-service.ts', 'utf8');

// Remove duplicate const supabase = createClient() declarations
content = content.replace(/const supabase = createClient\(\)\s*const supabase = createClient\(\)/g, 'const supabase = createClient()');

// Write the fixed content
fs.writeFileSync('lib/supabase-service.ts', content);

console.log('✅ Fixed duplicate supabase declarations');
