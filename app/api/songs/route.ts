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
      return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
    }

    const response = NextResponse.json({ songs });
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return response;
  } catch (error) {
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
      key,
      key_signature,
      bpm,
      tempo,
      youtube_id, 
      slug,
      chords,
      lyrics,
      artist_id
    } = body;

    // Validate required fields
    if (!title || !artist_id) {
      return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 });
    }

    // Create song data - only use columns that exist in database
    const songData = {
      title,
      key_signature: key_signature || key || null,
      tempo: tempo || bpm || null,
      chords: chords ? JSON.stringify(chords) : null,
      lyrics: lyrics || null,
      artist_id,
      youtube_id: youtube_id || null,
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
      console.error('Supabase error creating song:', error);
      return NextResponse.json({ 
        error: 'Failed to create song', 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    if (!song) {
      return NextResponse.json({ error: 'Failed to create song: No data returned' }, { status: 500 });
    }

    return NextResponse.json({ song }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
