import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch one song to see what columns exist
    const { data: song, error } = await supabase
      .from('songs')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch song', 
        details: error.message 
      }, { status: 500 });
    }

    // Return the column names
    const columns = song ? Object.keys(song) : [];
    
    return NextResponse.json({ 
      columns,
      sampleData: song
    });
  } catch (error) {
    console.error('Error in GET /api/test-schema:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

