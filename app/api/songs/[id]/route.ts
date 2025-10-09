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
    
    // Only include fields that are actually changing and exist in DB
    if (title !== undefined && title !== null) {
      updateData.title = title;
    }
    
    if (artist_id !== undefined && artist_id !== null && artist_id !== '') {
      updateData.artist_id = artist_id;
    }
    
    // Lyrics - critical field, always include (can be empty string or null)
    updateData.lyrics = lyrics || null;
    
    // Optional metadata fields
    if (key_signature !== undefined && key_signature !== null && key_signature !== '') {
      updateData.key_signature = key_signature;
    } else if (key !== undefined && key !== null && key !== '') {
      updateData.key_signature = key;
    }
    
    if (tempo !== undefined && tempo !== null && tempo !== '') {
      updateData.tempo = parseInt(tempo.toString());
    } else if (bpm !== undefined && bpm !== null && bpm !== '') {
      updateData.tempo = parseInt(bpm.toString());
    }

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
      return NextResponse.json({ 
        error: 'Failed to fetch updated song', 
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ song, message: 'Song updated successfully' });
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
