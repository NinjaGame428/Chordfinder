#!/usr/bin/env node

/**
 * Update Supabase Service to use SSR client
 */

const fs = require('fs');

// Read the current service file
let content = fs.readFileSync('lib/supabase-service.ts', 'utf8');

// Replace all supabase references with createClient() calls
content = content.replace(/if \(!supabase\)/g, 'const supabase = createClient()\n    if (!supabase)');
content = content.replace(/await supabase\./g, 'await supabase.');

// Write the updated content
fs.writeFileSync('lib/supabase-service.ts', content);

console.log('✅ Updated supabase-service.ts to use SSR client');
