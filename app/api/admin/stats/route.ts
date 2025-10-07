import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    // Initialize stats with default values
    let stats = {
      totalSongs: 0,
      youtubeVideos: 0,
      totalArtists: 0,
      totalUsers: 0,
      totalResources: 0,
      activeUsers: 0,
      collections: 0,
      totalSessions: 0,
      totalActivities: 0
    };

    // Fetch total songs
    try {
      const { count: totalSongs, error: songsError } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });
      
      if (!songsError) {
        stats.totalSongs = totalSongs || 0;
      }
    } catch (error) {
      console.log('Songs table not found or empty');
    }

    // Fetch songs with YouTube videos
    try {
      const { count: youtubeVideos, error: youtubeError } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true })
        .not('youtube_id', 'is', null);
      
      if (!youtubeError) {
        stats.youtubeVideos = youtubeVideos || 0;
      }
    } catch (error) {
      console.log('YouTube videos count not available');
    }

    // Fetch total artists
    try {
      const { count: totalArtists, error: artistsError } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true });
      
      if (!artistsError) {
        stats.totalArtists = totalArtists || 0;
      }
    } catch (error) {
      console.log('Artists table not found or empty');
    }

    // Fetch total users
    try {
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (!usersError) {
        stats.totalUsers = totalUsers || 0;
      }
    } catch (error) {
      console.log('Users table not found or empty');
    }

    // Fetch total resources
    try {
      const { count: totalResources, error: resourcesError } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true });
      
      if (!resourcesError) {
        stats.totalResources = totalResources || 0;
      }
    } catch (error) {
      console.log('Resources table not found or empty');
    }

    // Fetch active users (users who logged in within last 30 days)
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsers, error: activeUsersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_sign_in_at', thirtyDaysAgo.toISOString());
      
      if (!activeUsersError) {
        stats.activeUsers = activeUsers || 0;
      }
    } catch (error) {
      console.log('Active users count not available');
    }

    // Fetch total sessions
    try {
      const { count: totalSessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true });
      
      if (!sessionsError) {
        stats.totalSessions = totalSessions || 0;
      }
    } catch (error) {
      console.log('User sessions table not found or empty');
    }

    // Fetch total activities
    try {
      const { count: totalActivities, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true });
      
      if (!activitiesError) {
        stats.totalActivities = totalActivities || 0;
      }
    } catch (error) {
      console.log('User activities table not found or empty');
    }

    // Calculate collections (assuming 1 main collection for now)
    stats.collections = 1;

    console.log('Admin stats fetched:', stats);
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}