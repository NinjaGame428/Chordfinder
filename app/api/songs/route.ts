import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const { data: songs, error } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching songs:', error);
      return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
    }

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Error in GET /api/songs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    const body = await request.json();
    
    const { 
      title, 
      english_title, 
      album, 
      year, 
      key,
      key_signature,
      bpm,
      tempo,
      difficulty, 
      youtube_id, 
      slug,
      chords,
      lyrics,
      artist_id,
      genre
    } = body;

    // Validate required fields
    if (!title || !artist_id) {
      return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 });
    }

    // Create song data
    const songData = {
      title,
      english_title: english_title || null,
      album: album || null,
      year: year || null,
      key_signature: key_signature || key || null,
      tempo: tempo || bpm || null,
      chords: chords ? JSON.stringify(chords) : null,
      lyrics: lyrics || null,
      artist_id,
      genre: genre || null,
      // Generate slug if not provided
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    const { data: song, error } = await supabase
      .from('songs')
      .insert([songData])
      .select(`
        *,
        artists (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('Error creating song:', error);
      return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
    }

    return NextResponse.json({ song }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/songs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
