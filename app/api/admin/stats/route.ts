import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch total songs
    const { count: totalSongs } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    // Fetch total artists
    const { count: totalArtists } = await supabase
      .from('artists')
      .select('*', { count: 'exact', head: true });

    // Fetch total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Fetch total resources
    const { count: totalResources } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true });

    // Fetch active users (example: users logged in within the last 24 hours, or simply total users for now)
    const activeUsers = totalUsers; // Placeholder for actual active user logic

    // Fetch chord collections (piano chords only)
    let totalCollections = 0;
    try {
      const { count } = await supabase
        .from('piano_chords')
        .select('*', { count: 'exact', head: true });

      totalCollections = count || 0;
    } catch (error) {
      console.log('Chord table not found, using default collection count');
      totalCollections = 0; // Default to 0 if table is not found
    }

    const stats = {
      totalSongs: totalSongs || 0,
      totalArtists: totalArtists || 0,
      totalUsers: totalUsers || 0,
      totalResources: totalResources || 0,
      activeUsers: activeUsers || 0,
      collections: totalCollections
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 });
  }
}
