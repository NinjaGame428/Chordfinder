import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // Default 50, max 200
    const maxLimit = Math.min(limit, 200);
    const offset = (page - 1) * maxLimit;
    
    // Optimized: Only select fields we actually need (exclude lyrics for list views)
    // Lyrics can be fetched separately on detail pages where needed
    const { data: songs, error, count } = await supabase
      .from('songs')
      .select(`
        id,
        title,
        artist_id,
        key_signature,
        tempo,
        genre,
        downloads,
        rating,
        created_at,
        updated_at,
        slug,
        artists!inner (
          id,
          name
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + maxLimit - 1);

    if (error) {
      console.error('Error fetching songs:', error);
      return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
    }

    const response = NextResponse.json({ 
      songs: songs || [], 
      pagination: {
        page,
        limit: maxLimit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / maxLimit)
      }
    });
    
    // Aggressive caching for public data
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
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
