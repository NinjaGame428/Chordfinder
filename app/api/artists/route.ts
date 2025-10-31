import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const body = await request.json();
    const { name, bio, image_url, website } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Artist name is required' }, { status: 400 });
    }

    // Create artist data - only use columns that exist in the table
    // Based on schema: name, bio, image_url, website
    const artistData: any = {
      name: name.trim(),
      bio: bio || null,
      image_url: image_url || null,
      website: website || null,
    };

    const { data: artist, error } = await supabase
      .from('artists')
      .insert([artistData])
      .select('id, name, bio, image_url, website, created_at, updated_at')
      .single();

    if (error) {
      console.error('Supabase error creating artist:', error);
      return NextResponse.json({ 
        error: 'Failed to create artist', 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    if (!artist) {
      return NextResponse.json({ error: 'Failed to create artist: No data returned' }, { status: 500 });
    }

    return NextResponse.json({ artist }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100'); // Default 100, max 500
    const maxLimit = Math.min(limit, 500);
    const offset = (page - 1) * maxLimit;
    
    // Optimized: Only select needed columns (exclude long bio text if not needed)
    // Bio can be fetched separately on detail pages
    const { data: artists, error, count } = await supabase
      .from('artists')
      .select('id, name, image_url, website, created_at, updated_at', { count: 'exact' })
      .order('name', { ascending: true })
      .range(offset, offset + maxLimit - 1);

    if (error) {
      console.error('Error fetching artists:', error);
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
    }

    const response = NextResponse.json({ 
      artists: artists || [],
      pagination: {
        page,
        limit: maxLimit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / maxLimit)
      }
    });
    
    // Aggressive caching - artists change less frequently
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('Error in GET /api/artists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
