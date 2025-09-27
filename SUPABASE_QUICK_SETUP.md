# 🚀 Quick Supabase Setup for Chords Finder

Your Supabase project is ready! Now let's set up the database schema.

## ✅ **Step 1: Set Up Database Schema**

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/weoukngkpqvfkxerpvno
2. **Navigate to SQL Editor** (left sidebar)
3. **Copy and paste the following SQL** into the editor:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE resource_type AS ENUM ('pdf', 'video', 'audio', 'image', 'document');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artists table
CREATE TABLE public.artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs table
CREATE TABLE public.songs (
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
CREATE TABLE public.resources (
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
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id),
  UNIQUE(user_id, resource_id)
);

-- Ratings table
CREATE TABLE public.ratings (
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
CREATE TABLE public.song_requests (
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

-- RLS Policies

-- Users can read all users, but only update their own
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Artists are publicly readable
CREATE POLICY "Artists are publicly readable" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Admins can manage artists" ON public.artists FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Songs are publicly readable
CREATE POLICY "Songs are publicly readable" ON public.songs FOR SELECT USING (true);
CREATE POLICY "Admins can manage songs" ON public.songs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Resources are publicly readable
CREATE POLICY "Resources are publicly readable" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Favorites are user-specific
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Ratings are user-specific
CREATE POLICY "Users can manage own ratings" ON public.ratings FOR ALL USING (auth.uid() = user_id);

-- Song requests are user-specific
CREATE POLICY "Users can manage own song requests" ON public.song_requests FOR ALL USING (auth.uid() = user_id);

-- Functions and Triggers

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
('Donnie McClurkin', 'American gospel singer and minister', 'https://example.com/donnie-mcclurkin.jpg');

-- Insert sample songs
INSERT INTO public.songs (title, artist_id, genre, key, tempo, chords, lyrics, description, year, rating, downloads) VALUES
('Amazing Grace', (SELECT id FROM public.artists WHERE name = 'Kirk Franklin'), 'Classic Hymn', 'G', 80, ARRAY['G', 'C', 'D', 'G'], 'Amazing grace, how sweet the sound...', 'A timeless hymn of redemption', 1779, 4.8, 1250),
('I Smile', (SELECT id FROM public.artists WHERE name = 'Kirk Franklin'), 'Contemporary', 'C', 120, ARRAY['C', 'F', 'G', 'Am'], 'I smile, even though I hurt see I smile...', 'An uplifting contemporary gospel song', 2011, 4.6, 980),
('Total Praise', (SELECT id FROM public.artists WHERE name = 'Richard Smallwood'), 'Classic Hymn', 'F', 90, ARRAY['F', 'Bb', 'C', 'F'], 'Lord, I will lift mine eyes to the hills...', 'A powerful worship anthem', 1996, 4.9, 1100);

-- Insert sample resources
INSERT INTO public.resources (title, description, type, category, file_url, file_size, downloads, rating, author) VALUES
('Gospel Chord Progressions Guide', 'Complete guide to common gospel chord progressions', 'pdf', 'Education', 'https://example.com/gospel-chords.pdf', 2048000, 450, 4.7, 'Heavenkeys Music Academy'),
('Worship Piano Techniques', 'Advanced piano techniques for worship music', 'pdf', 'Education', 'https://example.com/piano-techniques.pdf', 1536000, 320, 4.5, 'Heavenkeys Music Academy'),
('Gospel Music History', 'Comprehensive history of gospel music', 'pdf', 'Education', 'https://example.com/gospel-history.pdf', 3072000, 280, 4.8, 'Heavenkeys Music Academy');
```

4. **Click "Run"** to execute the schema

## ✅ **Step 2: Configure Authentication**

1. **Go to Authentication → Settings**
2. **Set Site URL**: `http://localhost:3000` (for development)
3. **Add Redirect URLs**: 
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback`

## ✅ **Step 3: Test Your Application**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**: http://localhost:3000

3. **Test the features**:
   - Try signing up with a new account
   - Browse songs and artists
   - Test the admin dashboard

## ✅ **Step 4: Deploy to Vercel**

1. **Add environment variables to Vercel**:
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://weoukngkpqvfkxerpvno.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb3VrbmdrcHF2Zmt4ZXJwdm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTE4MDYsImV4cCI6MjA3NDUyNzgwNn0.kfkg_Smf7CxxgvJloy817JrDLrQQBvFUAImPRXyyexs`
     - `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb3VrbmdrcHF2Zmt4ZXJwdm5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk1MTgwNiwiZXhwIjoyMDc0NTI3ODA2fQ.LTqFmy5ZDdiXe4QUQL0GhEVarW2fGfEUE_hOy1vfJBc`

2. **Redeploy**:
   ```bash
   vercel --prod
   ```

## 🎉 **You're All Set!**

Your Chords Finder application now has:
- ✅ **Real Database**: Supabase PostgreSQL
- ✅ **Authentication**: User signup/login
- ✅ **Sample Data**: Artists, songs, and resources
- ✅ **Security**: Row Level Security policies
- ✅ **Admin Features**: Content management

## 🔧 **Next Steps**

1. **Create an admin user**: Sign up, then manually change the role to 'admin' in Supabase
2. **Add your own content**: Use the admin dashboard to add songs and resources
3. **Customize**: Modify the application to fit your needs

Happy coding! 🎵
