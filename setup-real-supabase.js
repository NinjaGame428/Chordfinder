#!/usr/bin/env node

/**
 * Real Supabase Setup Script for HeavenKeys Chords Finder
 * 
 * This script helps you set up your ACTUAL Supabase project credentials
 * to fix the "Invalid API key" error.
 */

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('🔧 HeavenKeys Chords Finder - Real Supabase Setup');
  console.log('================================================\n');

  console.log('❌ CURRENT ISSUE: You are using placeholder Supabase credentials');
  console.log('   This is causing the "Invalid API key" error.\n');

  console.log('📋 Step 1: Create a REAL Supabase Project');
  console.log('1. Go to https://supabase.com');
  console.log('2. Sign up/Login to your account');
  console.log('3. Click "New Project"');
  console.log('4. Fill in project details:');
  console.log('   - Name: heavenkeys-chords-finder');
  console.log('   - Database Password: [create a strong password]');
  console.log('   - Region: [choose closest to your users]');
  console.log('5. Click "Create new project"');
  console.log('6. Wait 2-3 minutes for project to be ready\n');

  console.log('📋 Step 2: Get Your REAL Credentials');
  console.log('1. In your Supabase project dashboard');
  console.log('2. Go to Settings → API');
  console.log('3. Copy your Project URL and Anon Key');
  console.log('4. These will be DIFFERENT from the placeholder ones\n');

  const supabaseUrl = await question('Enter your REAL Supabase Project URL (https://your-project-id.supabase.co): ');
  const supabaseAnonKey = await question('Enter your REAL Supabase Anon Key: ');

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

  // Create .env.local with REAL credentials
  console.log('\n📝 Step 3: Updating .env.local with REAL credentials...');
  
  const envContent = `# Supabase Configuration - REAL CREDENTIALS
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}

# Development
NODE_ENV=development
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Updated .env.local with your REAL Supabase credentials');

  // Update lib/supabase.ts to use environment variables only
  console.log('\n🔧 Step 4: Updating Supabase configuration...');
  
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
  console.log('✅ Updated lib/supabase.ts to use environment variables only');

  // Test the configuration
  console.log('\n🧪 Step 5: Testing configuration...');
  
  try {
    // Test if we can create a client
    const { createClient } = require('@supabase/supabase-js');
    const testClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client created successfully');
    
    // Test connection
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

  console.log('\n📋 Step 6: Set up your Supabase database');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the contents of supabase/schema.sql');
  console.log('4. Click "Run" to execute the schema');
  console.log('5. (Optional) Copy and paste supabase/seed.sql for sample data');

  console.log('\n📋 Step 7: Configure authentication');
  console.log('1. Go to Authentication → Settings');
  console.log('2. Set Site URL to your production URL');
  console.log('3. Add redirect URLs for your domains');

  console.log('\n📋 Step 8: Deploy to Vercel');
  console.log('1. Set environment variables in Vercel:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('2. Run: vercel --prod');

  console.log('\n🎉 Setup complete!');
  console.log('Your app should now work with your REAL Supabase project.');
  console.log('The "Invalid API key" error should be resolved!');

  rl.close();
}

main().catch(console.error);
