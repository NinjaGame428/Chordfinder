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

    // Fetch songs with YouTube videos
    const { count: youtubeVideos } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true })
      .not('youtube_id', 'is', null);

    // Fetch total artists
    const { count: totalArtists } = await supabase
      .from('artists')
      .select('*', { count: 'exact', head: true });

    // Fetch total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Fetch total resources (assuming you have a resources table)
    const { count: totalResources } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true });

    // Fetch active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', thirtyDaysAgo.toISOString());

    const stats = {
      totalSongs: totalSongs || 0,
      youtubeVideos: youtubeVideos || 0,
      totalArtists: totalArtists || 0,
      totalUsers: totalUsers || 0,
      totalResources: totalResources || 0,
      activeUsers: activeUsers || 0,
      collections: 1 // Assuming you have 1 main collection for now
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}