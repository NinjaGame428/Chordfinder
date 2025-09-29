#!/usr/bin/env node

/**
 * Update all files to use Firebase instead of Supabase
 */

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/auth-test/page.tsx',
  'components/resource-rating.tsx',
  'app/dashboard/page.tsx',
  'components/navbar/navigation-sheet.tsx',
  'components/navbar/nav-menu.tsx',
  'components/song-rating.tsx',
  'components/navbar/user-menu.tsx',
  'components/notifications-icon.tsx',
  'components/protected-route.tsx',
  'components/navbar/navbar.tsx'
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace SupabaseAuthContext with FirebaseAuthContext
    content = content.replace(/SupabaseAuthContext/g, 'FirebaseAuthContext');
    
    // Replace supabase imports with firebase
    content = content.replace(/from ['"]@\/lib\/supabase['"]/g, 'from "@/lib/firebase"');
    content = content.replace(/from ['"]@\/lib\/supabase-service['"]/g, 'from "@/lib/firebase-service"');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🔄 Updating files to use Firebase...\n');

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    updateFile(fullPath);
  } else {
    console.log(`⚠️ File not found: ${filePath}`);
  }
});

console.log('\n✅ All files updated to use Firebase!');
