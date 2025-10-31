import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const resolvedParams = await params;
    const body = await request.json();
    const { name, bio, image_url, website } = body;

    // Build update data - only use columns that exist in the table
    // Based on schema: name, bio, image_url, website
    const updateData: any = {};
    
    if (name !== undefined && name !== null && name !== '') {
      updateData.name = name.trim();
    }
    
    if (bio !== undefined) {
      updateData.bio = bio || null;
    }

    if (image_url !== undefined) {
      updateData.image_url = image_url || null;
    }

    if (website !== undefined) {
      updateData.website = website || null;
    }

    // Update the artist
    const { error: updateError } = await supabase
      .from('artists')
      .update(updateData)
      .eq('id', resolvedParams.id);

    if (updateError) {
      console.error('Error updating artist:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update artist', 
        details: updateError.message 
      }, { status: 500 });
    }

    // Fetch the updated artist
    const { data: artist, error: fetchError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated artist:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to fetch updated artist', 
        details: fetchError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ artist, message: 'Artist updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/artists/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const resolvedParams = await params;
    
    const { data: artist, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ artist });
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
    
    // Delete the artist
    const { error: deleteError } = await supabase
      .from('artists')
      .delete()
      .eq('id', resolvedParams.id);

    if (deleteError) {
      console.error('Error deleting artist:', deleteError);
      return NextResponse.json({ 
        error: 'Failed to delete artist', 
        details: deleteError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/artists/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

