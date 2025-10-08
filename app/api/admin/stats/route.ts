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

    // Fetch songs with YouTube videos (checking for youtube_id field or description containing YouTube)
    let youtubeVideos = 0;
    try {
      const { count } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true })
        .or('youtube_id.not.is.null,description.ilike.%YouTube%');
      youtubeVideos = count || 0;
    } catch (error) {
      console.log('Error fetching YouTube videos count:', error);
      // Fallback: count songs with YouTube in description
      try {
        const { count } = await supabase
          .from('songs')
          .select('*', { count: 'exact', head: true })
          .ilike('description', '%YouTube%');
        youtubeVideos = count || 0;
      } catch (fallbackError) {
        console.log('Fallback YouTube count also failed');
        youtubeVideos = 0;
      }
    }

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

    // Fetch active users (users who have been active within last 30 days)
    // Since we don't have last_sign_in_at, we'll use created_at as a proxy
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Fetch chord collections (piano + guitar chords)
    let totalCollections = 0;
    try {
      const [pianoChords, guitarChords] = await Promise.all([
        supabase.from('piano_chords').select('*', { count: 'exact', head: true }),
        supabase.from('guitar_chords').select('*', { count: 'exact', head: true })
      ]);

      totalCollections = (pianoChords.count || 0) + (guitarChords.count || 0);
    } catch (error) {
      console.log('Chord tables not found, using default collection count');
      totalCollections = 1; // Default to 1 collection if tables don't exist
    }

    const stats = {
      totalSongs: totalSongs || 0,
      youtubeVideos: youtubeVideos,
      totalArtists: totalArtists || 0,
      totalUsers: totalUsers || 0,
      totalResources: totalResources || 0,
      activeUsers: activeUsers || 0,
      collections: totalCollections
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}