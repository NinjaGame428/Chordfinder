import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const body = await request.json();
    const { name, bio } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Artist name is required' }, { status: 400 });
    }

    // Create artist data - only use columns that exist
    const artistData = {
      name: name.trim(),
      bio: bio || null,
    };

    const { data: artist, error } = await supabase
      .from('artists')
      .insert([artistData])
      .select()
      .single();

    if (error) {
      console.error('Error creating artist:', error);
      return NextResponse.json({ error: 'Failed to create artist' }, { status: 500 });
    }

    return NextResponse.json({ artist }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/artists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    // Fetch artists - simplified for speed
    const { data: artists, error } = await supabase
      .from('artists')
      .select('id, name, bio, created_at')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching artists:', error);
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
    }

    // Return artists without song counts for faster loading
    // Song counts can be added later if needed for specific pages
    const response = NextResponse.json({ artists: artists || [] });
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
  } catch (error) {
    console.error('Error in GET /api/artists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
