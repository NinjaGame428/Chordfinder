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
      console.error('Error fetching song:', error);
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    return NextResponse.json({ song });
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

    // Build update data using actual database columns
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // Core fields
    if (title) {
      updateData.title = title;
    }
    
    if (artist_id) {
      updateData.artist_id = artist_id;
    }
    
    // Lyrics - always save (can be empty string)
    updateData.lyrics = lyrics !== undefined ? lyrics : null;
    
    // Optional fields
    if (key_signature || key) {
      updateData.key_signature = key_signature || key;
    }
    
    if (tempo || bpm) {
      const tempoValue = tempo || bpm;
      updateData.tempo = tempoValue ? parseInt(tempoValue.toString()) : null;
    }
    
    // Auto-generate slug from title
    if (title) {
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    console.log('=== UPDATING SONG ===');
    console.log('Song ID:', resolvedParams.id);
    console.log('Update data:', JSON.stringify(updateData, null, 2));

    const { data: song, error } = await supabase
      .from('songs')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select(`
        *,
        artists (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('=== UPDATE FAILED ===');
      console.error('Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Update data was:', updateData);
      
      // Check for column not found error
      if (error.code === 'PGRST204' && error.message.includes('column')) {
        const columnMatch = error.message.match(/'([^']+)'/);
        const columnName = columnMatch ? columnMatch[1] : 'unknown';
        return NextResponse.json({ 
          error: 'Database schema error', 
          details: `Column '${columnName}' does not exist in songs table. Please check your database schema.`,
          code: error.code,
          column: columnName
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to update song', 
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    console.log('=== UPDATE SUCCESS ===');
    console.log('Updated song:', song.id, song.title);
    
    return NextResponse.json({ song, message: 'Song updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/songs/[id]:', error);
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
      console.error('Error deleting song:', error);
      return NextResponse.json({ 
        error: 'Failed to delete song',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/songs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
