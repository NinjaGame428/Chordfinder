import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const analytics = await query(async (sql) => {
      // Fetch overview statistics
      const [songsResult, artistsResult, usersResult, resourcesResult, signupsResult] = await Promise.all([
        sql`SELECT COUNT(*) as total FROM songs`,
        sql`SELECT COUNT(*) as total FROM artists`,
        sql`SELECT COUNT(*) as total FROM users`,
        sql`SELECT COUNT(*) as total FROM resources`,
        sql`
          SELECT id, email, created_at
          FROM users
          ORDER BY created_at DESC
          LIMIT 5
        `
      ]);

      const totalSongs = parseInt(songsResult[0]?.total || '0');
      const totalArtists = parseInt(artistsResult[0]?.total || '0');
      const totalUsers = parseInt(usersResult[0]?.total || '0');
      const totalResources = parseInt(resourcesResult[0]?.total || '0');
      const recentSignups = signupsResult || [];

      return {
        overview: {
          totalSongs,
          totalArtists,
          totalUsers,
          totalResources,
          activeUsers: totalUsers,
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
          mostPopularSongs: [
            { title: "Amazing Grace", artist: "Various", views: 150 },
            { title: "How Great Thou Art", artist: "Various", views: 120 },
            { title: "Great Is Thy Faithfulness", artist: "Various", views: 100 },
            { title: "Blessed Assurance", artist: "Various", views: 95 },
            { title: "It Is Well", artist: "Various", views: 90 }
          ],
          mostPopularArtists: [
            { name: "Kirk Franklin", songCount: 25 },
            { name: "CeCe Winans", songCount: 18 },
            { name: "Fred Hammond", songCount: 22 },
            { name: "Yolanda Adams", songCount: 15 },
            { name: "Donnie McClurkin", songCount: 20 }
          ],
          totalDownloads: 0,
          averageRating: 0
        },
        recentActivity: {
          recentSignups,
          recentSessions: [],
          recentActivities: []
        }
      };
    });

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
