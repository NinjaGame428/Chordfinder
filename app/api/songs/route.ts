import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // Default 50, max 200
    const maxLimit = Math.min(limit, 200);
    const offset = (page - 1) * maxLimit;
    
    const songsData = await query(async (sql) => {
      // Get total count
      const countResult = await sql`
        SELECT COUNT(*) as total
        FROM songs
      `;
      const total = parseInt(countResult[0]?.total || '0');

      // Fetch songs with artist info using LEFT JOIN
      const songs = await sql`
        SELECT 
          s.*,
          json_build_object(
            'id', a.id,
            'name', a.name,
            'bio', a.bio,
            'image_url', a.image_url
          ) as artists
        FROM songs s
        LEFT JOIN artists a ON s.artist_id = a.id
        ORDER BY s.created_at DESC
        LIMIT ${maxLimit}
        OFFSET ${offset}
      `;

      return { songs, total };
    });

    // Handle null artist_ids - populate artist info from text field if needed
    const processedSongs = songsData.songs.map((song: any) => {
      if (!song.artists && song.artist) {
        song.artists = {
          id: song.artist_id || null,
          name: song.artist,
          bio: null,
          image_url: null
        };
      }
      return song;
    });

    const response = NextResponse.json({ 
      songs: processedSongs || [], 
      pagination: {
        page,
        limit: maxLimit,
        total: songsData.total || 0,
        totalPages: Math.ceil((songsData.total || 0) / maxLimit)
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

export async function POST(request: NextRequest) {
  try {
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
    if (!title || !artist_id) {
      return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 });
    }

    // Generate slug if not provided
    const songSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const songData = await query(async (sql) => {
      // Insert song
      const [song] = await sql`
        INSERT INTO songs (
          title,
          key_signature,
          tempo,
          chords,
          lyrics,
          artist_id,
          slug,
          rating,
          downloads,
          created_at,
          updated_at
        ) VALUES (
          ${title},
          ${key_signature || key || null},
          ${tempo || bpm || null},
          ${chords ? JSON.stringify(chords) : null},
          ${lyrics || null},
          ${artist_id},
          ${songSlug},
          0,
          0,
          NOW(),
          NOW()
        )
        RETURNING *
      `;

      // Fetch artist info
      const [artist] = await sql`
        SELECT id, name
        FROM artists
        WHERE id = ${artist_id}
      `;

      return {
        ...song,
        artists: artist || null
      };
    });

    if (!songData) {
      return NextResponse.json({ error: 'Failed to create song: No data returned' }, { status: 500 });
    }

    return NextResponse.json({ song: songData }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating song:', error);
    return NextResponse.json({ 
      error: 'Failed to create song', 
      details: error.message
    }, { status: 500 });
  }
}
