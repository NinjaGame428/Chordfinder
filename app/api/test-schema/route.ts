import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch a sample song to see its structure
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch songs', 
        details: error.message 
      }, { status: 500 });
    }

    // Get column names from the first song
    const columns = songs && songs.length > 0 ? Object.keys(songs[0]) : [];

    return NextResponse.json({ 
      columns,
      sampleSong: songs?.[0] || null,
      message: 'These are the actual columns in your songs table'
    });
  } catch (error) {
    console.error('Error in GET /api/test-schema:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
