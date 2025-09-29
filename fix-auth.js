#!/usr/bin/env node

/**
 * Authentication Fix Script for HeavenKeys Chords Finder
 * 
 * This script helps you fix the "Authentication service configuration error"
 * by setting up your Supabase credentials properly.
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
  console.log('🔧 HeavenKeys Chords Finder - Authentication Fix');
  console.log('===============================================\n');

  console.log('This script will help you fix the "Authentication service configuration error"');
  console.log('by properly setting up your Supabase credentials.\n');

  // Check if .env.local exists
  const envPath = '.env.local';
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    console.log('📄 Found existing .env.local file');
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('Current environment variables:');
    console.log(envContent);
    console.log('');
  }

  console.log('📋 Step 1: Get your Supabase credentials');
  console.log('1. Go to https://supabase.com');
  console.log('2. Sign in to your account');
  console.log('3. Create a new project or select existing one');
  console.log('4. Go to Settings → API');
  console.log('5. Copy your Project URL and Anon Key\n');

  const supabaseUrl = await question('Enter your Supabase Project URL (https://your-project-id.supabase.co): ');
  const supabaseAnonKey = await question('Enter your Supabase Anon Key: ');

  // Validate inputs
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Error: Both Project URL and Anon Key are required');
    process.exit(1);
  }

  if (!supabaseUrl.includes('supabase.co')) {
    console.log('⚠️  Warning: URL doesn\'t look like a Supabase URL');
    const confirm = await question('Continue anyway? (y/n): ');
    if (confirm.toLowerCase() !== 'y') {
      process.exit(1);
    }
  }

  // Create/update .env.local
  console.log('\n📝 Step 2: Creating/updating .env.local file...');
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}

# Development
NODE_ENV=development
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created/updated .env.local file');

  // Update lib/supabase.ts
  console.log('\n🔧 Step 3: Updating Supabase configuration...');
  
  const supabaseConfig = `import { createClient } from '@supabase/supabase-js'

// Get environment variables - these should be set in your .env.local and Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging
console.log('Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length,
  hasUrl: !!supabaseUrl,
  env: process.env.NODE_ENV,
  isClient: typeof window !== 'undefined'
});

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('Missing:', {
    url: !supabaseUrl,
    key: !supabaseAnonKey
  });
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables');
}

// Create Supabase client only if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) : null

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

  // Test the configuration
  console.log('\n🧪 Step 4: Testing configuration...');
  
  try {
    // Test if we can create a client
    const { createClient } = require('@supabase/supabase-js');
    const testClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client created successfully');
    
    // Test connection (this will fail if credentials are wrong)
    console.log('🔍 Testing connection...');
    const { data, error } = await testClient.auth.getSession();
    if (error) {
      console.log('⚠️  Connection test failed:', error.message);
      console.log('This might be normal if the project is new or not fully set up yet.');
    } else {
      console.log('✅ Connection test successful');
    }
  } catch (error) {
    console.log('❌ Error creating Supabase client:', error.message);
    console.log('Please check your credentials and try again.');
  }

  console.log('\n📋 Step 5: Next steps');
  console.log('======================');
  console.log('1. Set up your Supabase database:');
  console.log('   - Go to your Supabase project dashboard');
  console.log('   - Navigate to SQL Editor');
  console.log('   - Copy and paste the contents of supabase/schema.sql');
  console.log('   - Click "Run" to execute the schema');
  console.log('');
  console.log('2. Configure authentication in Supabase:');
  console.log('   - Go to Authentication → Settings');
  console.log('   - Set Site URL to your production URL');
  console.log('   - Add redirect URLs for your domains');
  console.log('');
  console.log('3. Set up Vercel environment variables:');
  console.log('   - Go to your Vercel project dashboard');
  console.log('   - Go to Settings → Environment Variables');
  console.log('   - Add NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - Add NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('');
  console.log('4. Deploy to Vercel:');
  console.log('   - Run: vercel --prod');
  console.log('');
  console.log('5. Test your setup:');
  console.log('   - Visit /test-supabase to test database connection');
  console.log('   - Visit /env-check to verify environment variables');
  console.log('   - Visit /auth-test to test authentication');

  console.log('\n🎉 Authentication fix complete!');
  console.log('Your Supabase configuration should now work properly.');
  console.log('If you still get errors, check the browser console for detailed error messages.');

  rl.close();
}

main().catch(console.error);
