import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    // Fetch artists with all their data
    const { data: artists, error } = await supabase
      .from('artists')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching artists:', error);
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
    }

    // Get song count for each artist
    const artistsWithCounts = await Promise.all(
      (artists || []).map(async (artist) => {
        const { count } = await supabase
          .from('songs')
          .select('*', { count: 'exact', head: true })
          .eq('artist_id', artist.id);
        
        return {
          ...artist,
          song_count: count || 0
        };
      })
    );

    return NextResponse.json({ artists: artistsWithCounts });
  } catch (error) {
    console.error('Error in GET /api/artists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
