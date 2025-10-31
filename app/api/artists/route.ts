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

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    // Fetch artists - only select columns that exist in the table
    // Based on schema: id, name, bio, image_url, website, created_at, updated_at
    const { data: artists, error } = await supabase
      .from('artists')
      .select('id, name, bio, image_url, website, created_at, updated_at')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
    }

    const response = NextResponse.json({ artists: artists || [] });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
