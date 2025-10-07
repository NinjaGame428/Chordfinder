import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const { data: artists, error } = await supabase
      .from('artists')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching artists:', error);
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
    }

    return NextResponse.json({ artists });
  } catch (error) {
    console.error('Error in GET /api/artists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
