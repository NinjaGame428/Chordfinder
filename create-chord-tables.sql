-- Create piano_chords table
CREATE TABLE IF NOT EXISTS public.piano_chords (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chord_name TEXT NOT NULL,
  chord_type TEXT NOT NULL,
  root_note TEXT NOT NULL,
  notes TEXT[] NOT NULL,
  intervals TEXT NOT NULL,
  alternate_name TEXT,
  difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  description TEXT,
  fingering TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guitar_chords table
CREATE TABLE IF NOT EXISTS public.guitar_chords (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chord_name TEXT NOT NULL,
  chord_type TEXT NOT NULL,
  root_note TEXT NOT NULL,
  notes TEXT[] NOT NULL,
  intervals TEXT NOT NULL,
  alternate_name TEXT,
  frets INTEGER[],
  fingers INTEGER[],
  difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_piano_chords_type ON public.piano_chords(chord_type);
CREATE INDEX IF NOT EXISTS idx_piano_chords_root ON public.piano_chords(root_note);
CREATE INDEX IF NOT EXISTS idx_guitar_chords_type ON public.guitar_chords(chord_type);
CREATE INDEX IF NOT EXISTS idx_guitar_chords_root ON public.guitar_chords(root_note);

-- Enable Row Level Security
ALTER TABLE public.piano_chords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guitar_chords ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (anyone can read)
CREATE POLICY "Anyone can view piano chords" ON public.piano_chords
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view guitar chords" ON public.guitar_chords
  FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT ON public.piano_chords TO anon, authenticated;
GRANT SELECT ON public.guitar_chords TO anon, authenticated;

