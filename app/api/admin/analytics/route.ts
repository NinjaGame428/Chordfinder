import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch overview statistics
    const [songsResult, artistsResult, usersResult, resourcesResult] = await Promise.all([
      supabase.from('songs').select('*', { count: 'exact', head: true }),
      supabase.from('artists').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('resources').select('*', { count: 'exact', head: true })
    ]);

    const totalSongs = songsResult.count || 0;
    const totalArtists = artistsResult.count || 0;
    const totalUsers = usersResult.count || 0;
    const totalResources = resourcesResult.count || 0;

    // Fetch most popular songs (mock data for now)
    const mostPopularSongs = [
      { title: "Amazing Grace", artist: "Various", views: 150 },
      { title: "How Great Thou Art", artist: "Various", views: 120 },
      { title: "Great Is Thy Faithfulness", artist: "Various", views: 100 },
      { title: "Blessed Assurance", artist: "Various", views: 95 },
      { title: "It Is Well", artist: "Various", views: 90 }
    ];

    // Fetch most popular artists (mock data for now)
    const mostPopularArtists = [
      { name: "Kirk Franklin", songCount: 25 },
      { name: "CeCe Winans", songCount: 18 },
      { name: "Fred Hammond", songCount: 22 },
      { name: "Yolanda Adams", songCount: 15 },
      { name: "Donnie McClurkin", songCount: 20 }
    ];

    // Fetch recent signups
    const { data: recentSignups } = await supabase
      .from('users')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const analytics = {
      overview: {
        totalSongs,
        totalArtists,
        totalUsers,
        totalResources,
        activeUsers: totalUsers, // Placeholder
        youtubeVideos: 0,
        collections: 1,
        totalSessions: 0,
        totalActivities: 0
      },
      userGrowth: {
        newUsersToday: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: totalUsers,
        userGrowthRate: 0
      },
      engagement: {
        averageSessionsPerUser: 0,
        totalPageViews: 0,
        averageSessionDuration: 0,
        bounceRate: 0
      },
      geographic: {
        usersByCountry: [],
        usersByCity: [],
        topCountries: []
      },
      device: {
        usersByDevice: [],
        usersByBrowser: [],
        usersByOS: []
      },
      content: {
        mostPopularSongs,
        mostPopularArtists,
        totalDownloads: 0,
        averageRating: 0
      },
      recentActivity: {
        recentSignups: recentSignups || [],
        recentSessions: [],
        recentActivities: []
      }
    };

    console.log('Analytics data fetched:', analytics);

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
