#!/usr/bin/env node

/**
 * Supabase Setup Script for HeavenKeys Chords Finder
 * 
 * This script helps you set up your Supabase project with the correct configuration.
 * Run this after creating your Supabase project to get everything configured properly.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('🎵 HeavenKeys Chords Finder - Supabase Setup');
  console.log('==========================================\n');

  console.log('This script will help you configure your Supabase project.');
  console.log('Make sure you have created a Supabase project first.\n');

  // Get Supabase credentials
  console.log('📋 Step 1: Get your Supabase credentials');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to Settings → API');
  console.log('3. Copy your Project URL and Anon Key\n');

  const supabaseUrl = await question('Enter your Supabase Project URL: ');
  const supabaseAnonKey = await question('Enter your Supabase Anon Key: ');
  const supabaseServiceKey = await question('Enter your Supabase Service Role Key (optional): ');

  // Validate inputs
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Error: Project URL and Anon Key are required');
    process.exit(1);
  }

  if (!supabaseUrl.includes('supabase.co')) {
    console.log('⚠️  Warning: URL doesn\'t look like a Supabase URL');
  }

  // Create .env.local file
  console.log('\n📝 Step 2: Creating environment file...');
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
${supabaseServiceKey ? `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}` : '# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here'}

# Development
NODE_ENV=development
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local file');

  // Update lib/supabase.ts with new credentials
  console.log('\n🔧 Step 3: Updating Supabase configuration...');
  
  const supabaseConfig = `import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '${supabaseUrl}'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '${supabaseAnonKey}'

// Debug logging
console.log('Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length,
  isPlaceholder: supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key',
  env: process.env.NODE_ENV
});

// Always create client - use hardcoded values as fallback
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  firstName?: string
  lastName?: string
  avatar_url?: string
  avatar?: string
  role: 'user' | 'moderator' | 'admin'
  created_at: string
  updated_at: string
  joinDate?: string
  preferences?: {
    language: string
    theme: string
    notifications: boolean
  }
  stats?: {
    favoriteSongs: number
    downloadedResources: number
    ratingsGiven: number
    lastActive: string
  }
}

export interface Song {
  id: string
  title: string
  artist: string
  genre: string
  key: string
  tempo: number
  chords: string[]
  lyrics: string
  description?: string
  year?: number
  rating?: number
  downloads: number
  created_at: string
  updated_at: string
}

export interface Artist {
  id: string
  name: string
  bio?: string
  image_url?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: string
  category: string
  file_url?: string
  file_size?: number
  downloads: number
  rating?: number
  author: string
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  song_id?: string
  resource_id?: string
  created_at: string
}

export interface Rating {
  id: string
  user_id: string
  song_id?: string
  resource_id?: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
}
`;

  fs.writeFileSync('lib/supabase.ts', supabaseConfig);
  console.log('✅ Updated lib/supabase.ts');

  // Create deployment instructions
  console.log('\n📋 Step 4: Next steps for deployment');
  console.log('=====================================');
  console.log('1. Set up your database:');
  console.log('   - Go to your Supabase project dashboard');
  console.log('   - Navigate to SQL Editor');
  console.log('   - Copy and paste the contents of supabase/schema.sql');
  console.log('   - Click "Run" to execute the schema');
  console.log('   - (Optional) Copy and paste supabase/seed.sql for sample data');
  console.log('');
  console.log('2. Configure authentication:');
  console.log('   - Go to Authentication → Settings');
  console.log('   - Set Site URL to your production URL');
  console.log('   - Add redirect URLs for your domains');
  console.log('');
  console.log('3. Deploy to Vercel:');
  console.log('   - Set environment variables in Vercel dashboard');
  console.log('   - Run: vercel --prod');
  console.log('');
  console.log('4. Test your setup:');
  console.log('   - Visit /test-supabase to test database connection');
  console.log('   - Visit /env-check to verify environment variables');
  console.log('   - Visit /auth-test to test authentication');

  console.log('\n🎉 Setup complete! Your Supabase configuration is ready.');
  console.log('Check the supabase/README.md file for detailed instructions.');

  rl.close();
}

main().catch(console.error);
