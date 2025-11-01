import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { name, bio, image_url, website } = body;

    const artistData = await query(async (sql) => {
      // Update the artist using conditional SQL
      await sql`
        UPDATE artists
        SET 
          name = COALESCE(${name || null}, name),
          bio = ${bio !== undefined ? bio : sql`bio`},
          image_url = ${image_url !== undefined ? image_url : sql`image_url`},
          website = ${website !== undefined ? website : sql`website`},
          updated_at = NOW()
        WHERE id = ${resolvedParams.id}
      `;

      // Fetch the updated artist
      const [artist] = await sql`
        SELECT *
        FROM artists
        WHERE id = ${resolvedParams.id}
      `;

      return artist;
    });

    if (!artistData) {
      return NextResponse.json({ 
        error: 'Failed to update artist or artist not found'
      }, { status: 500 });
    }

    return NextResponse.json({ artist: artistData, message: 'Artist updated successfully' });
  } catch (error: any) {
    console.error('Error in PUT /api/artists/[id]:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
    const artistData = await query(async (sql) => {
      const [artist] = await sql`
        SELECT *
        FROM artists
        WHERE id = ${resolvedParams.id}
      `;
      return artist;
    });

    if (!artistData) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ artist: artistData });
  } catch (error) {
    console.error('Error in GET /api/artists/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
    await query(async (sql) => {
      await sql`
        DELETE FROM artists
        WHERE id = ${resolvedParams.id}
      `;
    });

    return NextResponse.json({ message: 'Artist deleted successfully' });
  } catch (error: any) {
    console.error('Error in DELETE /api/artists/[id]:', error);
    return NextResponse.json({ 
      error: 'Failed to delete artist',
      details: error.message
    }, { status: 500 });
  }
}
