const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const schemaSQL = `
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'FMLSthR1vM/1kx865oLr0Raa6PbcSc1w8eVc21aZB22NtD1TZw80YrmAzvzu1g+gxqhO0lE6a2/E524uCnk9Lg==';

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resource_type AS ENUM ('pdf', 'video', 'audio', 'image', 'document');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artists table
CREATE TABLE IF NOT EXISTS public.artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs table
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  genre TEXT,
  key TEXT,
  tempo INTEGER,
  chords TEXT[],
  lyrics TEXT,
  description TEXT,
  year INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type resource_type,
  category TEXT,
  file_url TEXT,
  file_size BIGINT,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  author TEXT DEFAULT 'Heavenkeys Music Academy',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id),
  UNIQUE(user_id, resource_id)
);

-- Ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id),
  UNIQUE(user_id, resource_id)
);

-- Song requests table
CREATE TABLE IF NOT EXISTS public.song_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  genre TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Artists are publicly readable" ON public.artists;
DROP POLICY IF EXISTS "Admins can manage artists" ON public.artists;
DROP POLICY IF EXISTS "Songs are publicly readable" ON public.songs;
DROP POLICY IF EXISTS "Admins can manage songs" ON public.songs;
DROP POLICY IF EXISTS "Resources are publicly readable" ON public.resources;
DROP POLICY IF EXISTS "Admins can manage resources" ON public.resources;
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can manage own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can manage own song requests" ON public.song_requests;

-- RLS Policies
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Artists are publicly readable" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Admins can manage artists" ON public.artists FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Songs are publicly readable" ON public.songs FOR SELECT USING (true);
CREATE POLICY "Admins can manage songs" ON public.songs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Resources are publicly readable" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own ratings" ON public.ratings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own song requests" ON public.song_requests FOR ALL USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_artists_updated_at ON public.artists;
DROP TRIGGER IF EXISTS update_songs_updated_at ON public.songs;
DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
DROP TRIGGER IF EXISTS update_ratings_updated_at ON public.ratings;
DROP TRIGGER IF EXISTS update_song_requests_updated_at ON public.song_requests;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON public.songs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_song_requests_updated_at BEFORE UPDATE ON public.song_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.artists (name, bio, image_url) VALUES
('Kirk Franklin', 'American gospel musician, songwriter, and choir director', 'https://example.com/kirk-franklin.jpg'),
('CeCe Winans', 'American gospel singer and songwriter', 'https://example.com/cece-winans.jpg'),
('Fred Hammond', 'American gospel singer, songwriter, and producer', 'https://example.com/fred-hammond.jpg'),
('Yolanda Adams', 'American gospel singer, actress, and radio host', 'https://example.com/yolanda-adams.jpg'),
('Donnie McClurkin', 'American gospel singer and minister', 'https://example.com/donnie-mcclurkin.jpg')
ON CONFLICT (name) DO NOTHING;

-- Insert sample songs
INSERT INTO public.songs (title, artist_id, genre, key, tempo, chords, lyrics, description, year, rating, downloads) VALUES
('Amazing Grace', (SELECT id FROM public.artists WHERE name = 'Kirk Franklin'), 'Classic Hymn', 'G', 80, ARRAY['G', 'C', 'D', 'G'], 'Amazing grace, how sweet the sound...', 'A timeless hymn of redemption', 1779, 4.8, 1250),
('I Smile', (SELECT id FROM public.artists WHERE name = 'Kirk Franklin'), 'Contemporary', 'C', 120, ARRAY['C', 'F', 'G', 'Am'], 'I smile, even though I hurt see I smile...', 'An uplifting contemporary gospel song', 2011, 4.6, 980),
('Total Praise', (SELECT id FROM public.artists WHERE name = 'Richard Smallwood'), 'Classic Hymn', 'F', 90, ARRAY['F', 'Bb', 'C', 'F'], 'Lord, I will lift mine eyes to the hills...', 'A powerful worship anthem', 1996, 4.9, 1100)
ON CONFLICT DO NOTHING;

-- Insert sample resources
INSERT INTO public.resources (title, description, type, category, file_url, file_size, downloads, rating, author) VALUES
('Gospel Chord Progressions Guide', 'Complete guide to common gospel chord progressions', 'pdf', 'Education', 'https://example.com/gospel-chords.pdf', 2048000, 450, 4.7, 'Heavenkeys Music Academy'),
('Worship Piano Techniques', 'Advanced piano techniques for worship music', 'pdf', 'Education', 'https://example.com/piano-techniques.pdf', 1536000, 320, 4.5, 'Heavenkeys Music Academy'),
('Gospel Music History', 'Comprehensive history of gospel music', 'pdf', 'Education', 'https://example.com/gospel-history.pdf', 3072000, 280, 4.8, 'Heavenkeys Music Academy')
ON CONFLICT DO NOTHING;
`;

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database schema...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    
    if (error) {
      console.error('❌ Error setting up database:', error);
      return;
    }
    
    console.log('✅ Database schema setup completed!');
    
    // Test the connection
    const { data: users, error: usersError } = await supabase.from('users').select('count').limit(1);
    
    if (usersError) {
      console.log('⚠️  Users table test failed:', usersError.message);
    } else {
      console.log('✅ Users table is accessible');
    }
    
    // Test artists table
    const { data: artists, error: artistsError } = await supabase.from('artists').select('*').limit(3);
    
    if (artistsError) {
      console.log('⚠️  Artists table test failed:', artistsError.message);
    } else {
      console.log('✅ Artists table is accessible');
      console.log('Sample artists:', artists?.length || 0, 'found');
    }
    
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
  }
}

setupDatabase();
