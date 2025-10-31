import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const resolvedParams = await params;
    const { data: song, error } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name
        )
      `)
      .eq('id', resolvedParams.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    return NextResponse.json({ song });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    const body = await request.json();
    const resolvedParams = await params;
    
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
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Build update data - ONLY using confirmed database columns
    const updateData: any = {};
    
    // Title - required field
    if (title !== undefined && title !== null && title.trim() !== '') {
      updateData.title = title.trim();
    }
    
    // Artist ID - required field
    if (artist_id !== undefined && artist_id !== null && artist_id !== '' && artist_id.trim() !== '') {
      updateData.artist_id = artist_id.trim();
    }
    
    // Lyrics - critical field, always include (can be empty string or null)
    // Use !== undefined to allow empty strings to be saved
    if (lyrics !== undefined) {
      updateData.lyrics = lyrics || null;
    }
    
    // Key Signature - optional field
    if (key_signature !== undefined && key_signature !== null && key_signature !== '' && key_signature.trim() !== '') {
      updateData.key_signature = key_signature.trim();
    } else if (key !== undefined && key !== null && key !== '' && key.trim() !== '') {
      updateData.key_signature = key.trim();
    } else if (key_signature === '' || key === '' || key_signature === null || key === null) {
      // Explicitly set to null if empty string or null is provided
      updateData.key_signature = null;
    }
    
    // Tempo/BPM - optional field
    if (tempo !== undefined && tempo !== null && tempo !== '') {
      const tempoValue = parseInt(tempo.toString());
      if (!isNaN(tempoValue)) {
        updateData.tempo = tempoValue;
      }
    } else if (bpm !== undefined && bpm !== null && bpm !== '') {
      const bpmValue = parseInt(bpm.toString());
      if (!isNaN(bpmValue)) {
        updateData.tempo = bpmValue;
      }
    }
    
    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // Validate required fields before saving
    if (!updateData.title || !updateData.title.trim()) {
      console.error('❌ Validation failed: Title is required');
      return NextResponse.json({ 
        error: 'Title is required',
        details: 'The song title cannot be empty'
      }, { status: 400 });
    }
    
    if (!updateData.artist_id || !updateData.artist_id.trim()) {
      console.error('❌ Validation failed: Artist ID is required', {
        artist_id: updateData.artist_id,
        received: artist_id
      });
      return NextResponse.json({ 
        error: 'Artist ID is required',
        details: 'Please select a valid artist for this song'
      }, { status: 400 });
    }
    
    // Log what we're about to save for debugging
    console.log('💾 Saving song:', {
      id: resolvedParams.id,
      title: updateData.title,
      artist_id: updateData.artist_id,
      key_signature: updateData.key_signature,
      tempo: updateData.tempo,
      lyricsLength: updateData.lyrics?.length || 0,
      hasLyrics: !!updateData.lyrics,
      lyricsPreview: updateData.lyrics ? updateData.lyrics.substring(0, 100) + '...' : 'null'
    });
    
    console.log('📦 Full update payload:', JSON.stringify(updateData, null, 2));

    // First, update the song
    const { error: updateError } = await supabase
      .from('songs')
      .update(updateData)
      .eq('id', resolvedParams.id);

    if (updateError) {
      // Check for column not found error
      if (updateError.code === 'PGRST204' && updateError.message.includes('column')) {
        const columnMatch = updateError.message.match(/'([^']+)'/);
        const columnName = columnMatch ? columnMatch[1] : 'unknown';
        return NextResponse.json({ 
          error: 'Database schema error', 
          details: `Column '${columnName}' does not exist in songs table`,
          code: updateError.code,
          column: columnName
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to update song', 
        details: updateError.message,
        code: updateError.code
      }, { status: 500 });
    }

    console.log('✅ Update completed, now fetching updated song...');

    // Then, fetch the updated song separately to avoid .single() issues
    const { data: song, error } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name
        )
      `)
      .eq('id', resolvedParams.id)
      .single();

    if (error) {
      console.error('❌ Failed to fetch updated song:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch updated song', 
        details: error.message
      }, { status: 500 });
    }

    // Log successful save with detailed info including artist information
    console.log('✅ Song saved successfully:', {
      id: song.id,
      title: song.title,
      artist_id: song.artist_id,
      artist_name: song.artists?.name,
      lyricsLength: song.lyrics?.length || 0,
      lyricsType: typeof song.lyrics,
      lyricsPreview: song.lyrics ? song.lyrics.substring(0, 100) + '...' : 'null',
      hasLyrics: !!song.lyrics,
      updated_at: song.updated_at
    });
    
    return NextResponse.json({ 
      song, 
      message: 'Song updated successfully',
      artistUpdated: true,
      newArtistId: song.artist_id,
      newArtistName: song.artists?.name
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const resolvedParams = await params;
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to delete song',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ message: 'Song deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
