import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
    const songData = await query(async (sql) => {
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
        WHERE s.id = ${resolvedParams.id}
        LIMIT 1
      `;
      return songs[0] || null;
    });
    
    // Handle null artist_id - ensure artist info is populated from text field if needed
    if (songData && !songData.artists && songData.artist) {
      songData.artists = {
        id: songData.artist_id || null,
        name: songData.artist,
        bio: null,
        image_url: null
      };
    }

    if (!songData) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const response = NextResponse.json({ song: songData });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('Vary', '*');
    return response;
  } catch (error) {
    console.error('Error in GET /api/songs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const resolvedParams = await params;
    
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

    // Get current song data to track changes
    let oldArtistId: string | null = null;
    try {
      const currentSong = await query(async (sql) => {
        const [song] = await sql`
          SELECT artist_id, title
          FROM songs
          WHERE id = ${resolvedParams.id}
        `;
        return song;
      });
      
      if (currentSong) {
        oldArtistId = currentSong.artist_id;
      }
    } catch (error) {
      console.warn('Could not fetch current song data:', error);
    }

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Helper function to create slug from title
    const createSlug = (title: string) => {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };

    // Build update data
    const updateData: any = {
      title: title.trim(),
      updated_at: new Date().toISOString()
    };
    
    if (slug || title) {
      updateData.slug = slug || createSlug(title.trim());
    }
    
    if (artist_id !== undefined && artist_id !== null && artist_id !== '') {
      updateData.artist_id = artist_id.trim();
      
      // Fetch artist name to keep text field in sync
      try {
        const artist = await query(async (sql) => {
          const [a] = await sql`
            SELECT name
            FROM artists
            WHERE id = ${artist_id.trim()}
          `;
          return a;
        });
        
        if (artist && artist.name) {
          updateData.artist = artist.name.trim();
        }
      } catch (error) {
        console.warn('Could not fetch artist name:', error);
      }
    }
    
    if (lyrics !== undefined) {
      updateData.lyrics = lyrics === null ? null : (typeof lyrics === 'string' ? lyrics.trim() : String(lyrics).trim());
    }
    
    if (key_signature !== undefined) {
      updateData.key_signature = (key_signature === null || key_signature === '') ? null : key_signature.trim();
    } else if (key !== undefined) {
      updateData.key_signature = (key === null || key === '') ? null : key.trim();
    }
    
    if (tempo !== undefined) {
      const tempoValue = tempo === null || tempo === '' || tempo === 0 ? null : parseInt(tempo.toString());
      updateData.tempo = (!isNaN(tempoValue || 0) && (tempoValue || 0) > 0) ? tempoValue : null;
    } else if (bpm !== undefined) {
      const bpmValue = bpm === null || bpm === '' || bpm === 0 ? null : parseInt(bpm.toString());
      updateData.tempo = (!isNaN(bpmValue || 0) && (bpmValue || 0) > 0) ? bpmValue : null;
    }

    if (!updateData.title || !updateData.title.trim()) {
      return NextResponse.json({ 
        error: 'Title is required',
        details: 'The song title cannot be empty'
      }, { status: 400 });
    }
    
    if (!updateData.artist_id || !updateData.artist_id.trim()) {
      return NextResponse.json({ 
        error: 'Artist ID is required',
        details: 'Please select a valid artist for this song'
      }, { status: 400 });
    }

    const songData = await query(async (sql) => {
      // Update the song
      await sql`
        UPDATE songs
        SET 
          title = ${updateData.title},
          slug = ${updateData.slug},
          artist_id = ${updateData.artist_id},
          artist = ${updateData.artist || null},
          lyrics = ${updateData.lyrics !== undefined ? updateData.lyrics : sql`lyrics`},
          key_signature = ${updateData.key_signature !== undefined ? updateData.key_signature : sql`key_signature`},
          tempo = ${updateData.tempo !== undefined ? updateData.tempo : sql`tempo`},
          updated_at = NOW()
        WHERE id = ${resolvedParams.id}
      `;

      // Fetch updated song with artist info
      const [song] = await sql`
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
        WHERE s.id = ${resolvedParams.id}
      `;

      return song;
    });

    if (!songData) {
      return NextResponse.json({ 
        error: 'Song not found',
        details: `No song found with ID: ${resolvedParams.id}`
      }, { status: 404 });
    }

    // Handle null artist_id
    if (songData && !songData.artists && songData.artist) {
      songData.artists = {
        id: songData.artist_id || null,
        name: songData.artist,
        bio: null,
        image_url: null
      };
    }

    const artistChanged = oldArtistId && updateData.artist_id && oldArtistId !== updateData.artist_id;

    const response = NextResponse.json({ 
      song: songData,
      message: 'Song updated successfully',
      artistChanged: artistChanged || false,
      updatedFields: Object.keys(updateData).filter(key => key !== 'updated_at')
    });
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error in PUT /api/songs/[id]:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // Get the song's artist_id before deleting
    let artistId: string | null = null;
    try {
      const songBeforeDelete = await query(async (sql) => {
        const [song] = await sql`
          SELECT artist_id, title
          FROM songs
          WHERE id = ${resolvedParams.id}
        `;
        return song;
      });

      if (songBeforeDelete) {
        artistId = songBeforeDelete.artist_id;
      }
    } catch (error) {
      console.warn('Could not fetch song before deletion:', error);
    }

    // Delete the song
    await query(async (sql) => {
      await sql`
        DELETE FROM songs
        WHERE id = ${resolvedParams.id}
      `;
    });

    const response = NextResponse.json({ 
      message: 'Song deleted successfully',
      songId: resolvedParams.id,
      artistId: artistId
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error in DELETE /api/songs/[id]:', error);
    return NextResponse.json({ 
      error: 'Failed to delete song',
      details: error.message
    }, { status: 500 });
  }
}
