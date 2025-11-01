import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to create slug from title
const createSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const resolvedParams = await params;
    const slug = decodeURIComponent(resolvedParams.slug);
    
    // First try to find by slug column
    let { data: song, error } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name,
          bio,
          image_url
        )
      `)
      .eq('slug', slug)
      .single();

    // If not found by slug and slug looks like it was generated from title, try title matching
    if (error || !song) {
      // Try to match by title (for songs without slug or with different slug format)
      const titleFromSlug = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const { data: titleMatch } = await supabase
        .from('songs')
        .select(`
          *,
          artists (
            id,
            name,
            bio,
            image_url
          )
        `)
        .ilike('title', `%${titleFromSlug}%`)
        .limit(1)
        .single();
      
      if (titleMatch) {
        song = titleMatch;
        error = null;
      }
    }

    // If still not found, check if slug is actually a UUID (backward compatibility)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if ((error || !song) && isUUID) {
      const { data: idMatch } = await supabase
        .from('songs')
        .select(`
          *,
          artists (
            id,
            name,
            bio,
            image_url
          )
        `)
        .eq('id', slug)
        .single();
      
      if (idMatch) {
        song = idMatch;
        error = null;
      }
    }

    if (error || !song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const response = NextResponse.json({ song });
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

