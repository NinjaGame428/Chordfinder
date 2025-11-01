import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Helper function to create slug from title
const createSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = decodeURIComponent(resolvedParams.slug);
    
    const songData = await query(async (sql) => {
      // First try to find by slug column
      let songs = await sql`
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
        WHERE s.slug = ${slug}
        LIMIT 1
      `;

      if (songs.length === 0) {
        // Try to match by title (for songs without slug or with different slug format)
        const titleFromSlug = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        songs = await sql`
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
          WHERE s.title ILIKE ${`%${titleFromSlug}%`}
          LIMIT 1
        `;
      }

      // If still not found, check if slug is actually a UUID (backward compatibility)
      if (songs.length === 0) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        if (isUUID) {
          songs = await sql`
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
            WHERE s.id = ${slug}
            LIMIT 1
          `;
        }
      }

      return songs[0] || null;
    });

    if (!songData) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    // Handle null artist_id - ensure artist info is populated from text field if needed
    if (songData && !songData.artists && songData.artist) {
      songData.artists = {
        id: songData.artist_id || null,
        name: songData.artist,
        bio: null,
        image_url: null
      };
    }

    const response = NextResponse.json({ song: songData });
    // Add headers to prevent stale caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('Error in GET /api/songs/slug/[slug]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
