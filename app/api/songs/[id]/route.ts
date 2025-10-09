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
      english_title, 
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
      artist_id
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Update song data - only use columns that exist
    const updateData: any = {
      title,
      english_title: english_title || null,
      year: year || null,
      key_signature: key_signature || key || null,
      tempo: tempo || bpm || null,
      lyrics: lyrics || null,
      updated_at: new Date().toISOString()
    };

    // Add chords if provided
    if (chords) {
      updateData.chords = typeof chords === 'string' ? chords : JSON.stringify(chords);
    }

    // Add artist_id if provided
    if (artist_id) {
      updateData.artist_id = artist_id;
    }

    // Add slug if provided or generate from title
    if (slug) {
      updateData.slug = slug;
    } else if (title) {
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    console.log('Updating song with data:', updateData);

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
      console.error('Error updating song:', error);
      return NextResponse.json({ 
        error: 'Failed to update song', 
        details: error.message 
      }, { status: 500 });
    }

    console.log('Song updated successfully:', song);
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
    console.log('Deleting song with ID:', resolvedParams.id);

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

    console.log('Song deleted successfully from database');
    return NextResponse.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/songs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
