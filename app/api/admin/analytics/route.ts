import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Initialize analytics with default values
    let analytics = {
      overview: {
        totalSongs: 0,
        totalArtists: 0,
        totalUsers: 0,
        totalResources: 0,
        activeUsers: 0,
        youtubeVideos: 0,
        collections: 1,
        totalSessions: 0,
        totalActivities: 0
      },
      userGrowth: {
        newUsersToday: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0,
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
        mostPopularSongs: [],
        mostPopularArtists: [],
        totalDownloads: 0,
        averageRating: 0
      },
      recentActivity: {
        recentSignups: [],
        recentSessions: [],
        recentActivities: []
      }
    };

    // Fetch basic counts
    try {
      // Total songs
      const { count: totalSongs } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });
      analytics.overview.totalSongs = totalSongs || 0;

      // Songs with YouTube videos
      const { count: youtubeVideos } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true })
        .not('youtube_id', 'is', null);
      analytics.overview.youtubeVideos = youtubeVideos || 0;

      // Total artists
      const { count: totalArtists } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true });
      analytics.overview.totalArtists = totalArtists || 0;

      // Total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      analytics.overview.totalUsers = totalUsers || 0;

      // Total resources
      const { count: totalResources } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true });
      analytics.overview.totalResources = totalResources || 0;

    } catch (error) {
      console.log('Error fetching basic counts:', error);
    }

    // Fetch user growth data
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // New users today
      const { count: newUsersToday } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
      analytics.userGrowth.newUsersToday = newUsersToday || 0;

      // New users this week
      const { count: newUsersThisWeek } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());
      analytics.userGrowth.newUsersThisWeek = newUsersThisWeek || 0;

      // New users this month
      const { count: newUsersThisMonth } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString());
      analytics.userGrowth.newUsersThisMonth = newUsersThisMonth || 0;

    } catch (error) {
      console.log('Error fetching user growth data:', error);
    }

    // Fetch active users
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_sign_in_at', thirtyDaysAgo.toISOString());
      analytics.overview.activeUsers = activeUsers || 0;

    } catch (error) {
      console.log('Error fetching active users:', error);
    }

    // Fetch sessions and activities
    try {
      const { count: totalSessions } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true });
      analytics.overview.totalSessions = totalSessions || 0;

      const { count: totalActivities } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true });
      analytics.overview.totalActivities = totalActivities || 0;

      // Calculate average sessions per user
      if (analytics.overview.totalUsers > 0) {
        analytics.engagement.averageSessionsPerUser = 
          analytics.overview.totalSessions / analytics.overview.totalUsers;
      }

    } catch (error) {
      console.log('Error fetching sessions and activities:', error);
    }

    // Fetch geographic data
    try {
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('country, city')
        .not('country', 'is', null);

      if (sessions) {
        // Users by country
        const countryCount: { [key: string]: number } = {};
        const cityCount: { [key: string]: number } = {};
        
        sessions.forEach(session => {
          if (session.country) {
            countryCount[session.country] = (countryCount[session.country] || 0) + 1;
          }
          if (session.city) {
            cityCount[session.city] = (cityCount[session.city] || 0) + 1;
          }
        });

        analytics.geographic.usersByCountry = Object.entries(countryCount)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        analytics.geographic.usersByCity = Object.entries(cityCount)
          .map(([city, count]) => ({ city, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        analytics.geographic.topCountries = analytics.geographic.usersByCountry.slice(0, 5);
      }

    } catch (error) {
      console.log('Error fetching geographic data:', error);
    }

    // Fetch device data
    try {
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('device_type, browser, operating_system')
        .not('device_type', 'is', null);

      if (sessions) {
        const deviceCount: { [key: string]: number } = {};
        const browserCount: { [key: string]: number } = {};
        const osCount: { [key: string]: number } = {};

        sessions.forEach(session => {
          if (session.device_type) {
            deviceCount[session.device_type] = (deviceCount[session.device_type] || 0) + 1;
          }
          if (session.browser) {
            browserCount[session.browser] = (browserCount[session.browser] || 0) + 1;
          }
          if (session.operating_system) {
            osCount[session.operating_system] = (osCount[session.operating_system] || 0) + 1;
          }
        });

        analytics.device.usersByDevice = Object.entries(deviceCount)
          .map(([device, count]) => ({ device, count }))
          .sort((a, b) => b.count - a.count);

        analytics.device.usersByBrowser = Object.entries(browserCount)
          .map(([browser, count]) => ({ browser, count }))
          .sort((a, b) => b.count - a.count);

        analytics.device.usersByOS = Object.entries(osCount)
          .map(([os, count]) => ({ os, count }))
          .sort((a, b) => b.count - a.count);
      }

    } catch (error) {
      console.log('Error fetching device data:', error);
    }

    // Fetch content analytics
    try {
      // Most popular songs (by downloads or rating)
      const { data: popularSongs } = await supabase
        .from('songs')
        .select('id, title, downloads, rating')
        .order('downloads', { ascending: false })
        .limit(10);

      if (popularSongs) {
        analytics.content.mostPopularSongs = popularSongs;
      }

      // Most popular artists
      const { data: popularArtists } = await supabase
        .from('artists')
        .select('id, name')
        .limit(10);

      if (popularArtists) {
        analytics.content.mostPopularArtists = popularArtists;
      }

      // Total downloads
      const { data: songs } = await supabase
        .from('songs')
        .select('downloads');

      if (songs) {
        analytics.content.totalDownloads = songs.reduce((sum, song) => sum + (song.downloads || 0), 0);
      }

    } catch (error) {
      console.log('Error fetching content analytics:', error);
    }

    // Fetch recent activity
    try {
      // Recent signups
      const { data: recentSignups } = await supabase
        .from('users')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentSignups) {
        analytics.recentActivity.recentSignups = recentSignups;
      }

      // Recent sessions
      const { data: recentSessions } = await supabase
        .from('user_sessions')
        .select('user_id, device_type, country, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentSessions) {
        analytics.recentActivity.recentSessions = recentSessions;
      }

      // Recent activities
      const { data: recentActivities } = await supabase
        .from('user_activities')
        .select('user_id, activity_type, description, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentActivities) {
        analytics.recentActivity.recentActivities = recentActivities;
      }

    } catch (error) {
      console.log('Error fetching recent activity:', error);
    }

    console.log('Analytics data fetched:', analytics);
    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error in GET /api/admin/analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
