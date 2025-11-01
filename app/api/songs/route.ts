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
    
    // Select ALL fields including artist text field and handle null artist_ids
    // Use left join (artists) instead of inner join (!inner) to include songs with null artist_id
    const { data: songs, error, count } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name,
          bio,
          image_url
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + maxLimit - 1);

    if (error) {
      console.error('Error fetching songs:', error);
      return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
    }

    // Handle null artist_ids - populate artist info from text field if needed
    const processedSongs = songs ? songs.map((song: any) => {
      if (!song.artists && song.artist) {
        song.artists = {
          id: song.artist_id || null,
          name: song.artist,
          bio: null,
          image_url: null
        };
      }
      return song;
    }) : [];

    const response = NextResponse.json({ 
      songs: processedSongs, 
      pagination: {
        page,
        limit: maxLimit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / maxLimit)
      }
    });
    
    // Prevent caching to ensure fresh data after updates
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error in GET /api/songs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to create slug from title
const createSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

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
      slug,
      chords,
      lyrics,
      artist_id
    } = body;

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json({ 
        error: 'Title is required',
        details: 'Please provide a song title'
      }, { status: 400 });
    }
    
    if (!artist_id || !artist_id.trim()) {
      return NextResponse.json({ 
        error: 'Artist is required',
        details: 'Please select an artist for this song'
      }, { status: 400 });
    }

    const trimmedTitle = title.trim();
    const trimmedArtistId = artist_id.trim();

    // CRITICAL: Fetch artist name to set artist text field for data consistency
    let artistName: string | null = null;
    try {
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .select('name')
        .eq('id', trimmedArtistId)
        .single();
      
      if (!artistError && artist && artist.name) {
        artistName = artist.name.trim();
        console.log('✅ Fetched artist name for new song:', trimmedArtistId, '→', artistName);
      } else {
        console.warn('⚠️ Could not fetch artist name for artist_id:', trimmedArtistId, artistError);
      }
    } catch (error) {
      console.error('❌ Error fetching artist name for artist_id:', trimmedArtistId, error);
    }

    // Build song data with all fields properly formatted
    const songData: any = {
      title: trimmedTitle,
      artist_id: trimmedArtistId,
      // Set artist text field if we fetched the name
      artist: artistName || null,
      // Generate slug from title
      slug: slug && slug.trim() ? slug.trim() : createSlug(trimmedTitle),
      // Handle lyrics - preserve empty strings, don't convert to null
      lyrics: lyrics !== undefined && lyrics !== null ? (typeof lyrics === 'string' ? lyrics.trim() : String(lyrics).trim()) : null,
      // Key signature
      key_signature: (key_signature || key) && (key_signature || key).trim() !== '' 
        ? (key_signature || key).trim() 
        : null,
      // Tempo/BPM - convert to number
      tempo: (tempo || bpm) !== null && (tempo || bpm) !== undefined && (tempo || bpm) !== ''
        ? (parseInt(String(tempo || bpm)) || null)
        : null,
      // Chords - JSON stringify if provided
      chords: chords ? (typeof chords === 'string' ? chords : JSON.stringify(chords)) : null,
    };

    console.log('💾 Creating new song:', {
      title: songData.title,
      artist_id: songData.artist_id,
      artist_text: songData.artist || 'null',
      slug: songData.slug,
      lyricsLength: songData.lyrics?.length || 0,
      key_signature: songData.key_signature || 'null',
      tempo: songData.tempo || 'null'
    });

    // Insert the song
    const { data: song, error } = await supabase
      .from('songs')
      .insert([songData])
      .select(`
        *,
        artists (
          id,
          name,
          bio,
          image_url
        )
      `)
      .single();

    if (error) {
      console.error('❌ Supabase error creating song:', error);
      return NextResponse.json({ 
        error: 'Failed to create song', 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    if (!song) {
      console.error('❌ No song data returned after creation');
      return NextResponse.json({ 
        error: 'Failed to create song: No data returned',
        details: 'The song may have been created but the response was empty'
      }, { status: 500 });
    }

    // Handle null artist_id case - populate from text field if needed
    if (!song.artists && song.artist) {
      song.artists = {
        id: song.artist_id || null,
        name: song.artist,
        bio: null,
        image_url: null
      };
    }

    console.log('✅ Song created successfully:', {
      id: song.id,
      title: song.title,
      artist_id: song.artist_id,
      artist_text: song.artist,
      slug: song.slug
    });

    const response = NextResponse.json({ song }, { status: 201 });
    // Add cache control headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('❌ Internal error creating song:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
