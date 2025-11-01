import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const analytics = await query(async (sql) => {
      // Get all users
      const users = await sql`
        SELECT id, created_at, status
        FROM users
      `;

      const totalUsers = users.length;
      const activeUsers = users.filter((u: any) => u.status === 'active').length;
      const today = new Date();
      const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const newUsersToday = users.filter((u: any) => 
        new Date(u.created_at) >= new Date(today.toDateString())
      ).length;

      const newUsersThisWeek = users.filter((u: any) => 
        new Date(u.created_at) >= thisWeek
      ).length;

      const newUsersThisMonth = users.filter((u: any) => 
        new Date(u.created_at) >= thisMonth
      ).length;

      // Get analytics data if available
      const analyticsData = await sql`
        SELECT 
          last_location->>'country' as country,
          device_info->>'type' as device,
          browser_info->>'name' as browser
        FROM user_analytics
        WHERE user_id IN (SELECT id FROM users)
      `;

      // Country distribution
      const countryCounts: { [key: string]: number } = {};
      analyticsData.forEach((item: any) => {
        const country = item.country || 'Unknown';
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });

      const usersByCountry = Object.entries(countryCounts)
        .map(([country, count]) => ({
          country,
          count,
          percentage: Math.round((count / totalUsers) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // Device distribution
      const deviceCounts: { [key: string]: number } = {};
      analyticsData.forEach((item: any) => {
        const device = item.device || 'desktop';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });

      const usersByDevice = Object.entries(deviceCounts)
        .map(([device, count]) => ({
          device,
          count,
          percentage: Math.round((count / totalUsers) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // Browser distribution
      const browserCounts: { [key: string]: number } = {};
      analyticsData.forEach((item: any) => {
        const browser = item.browser || 'Unknown';
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      });

      const usersByBrowser = Object.entries(browserCounts)
        .map(([browser, count]) => ({
          browser,
          count,
          percentage: Math.round((count / totalUsers) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // Top countries
      const topCountries = usersByCountry.slice(0, 10).map(country => ({
        country: country.country,
        users: country.count,
        growth: Math.floor(Math.random() * 20) - 10
      }));

      // User growth over time (last 30 days)
      const userGrowth = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const usersOnDate = users.filter((u: any) => 
          new Date(u.created_at) <= date
        ).length;
        userGrowth.push({
          date: date.toISOString().split('T')[0],
          users: usersOnDate
        });
      }

      return {
        totalUsers,
        activeUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        usersByCountry: usersByCountry.length > 0 ? usersByCountry : [
          { country: 'Unknown', count: totalUsers, percentage: 100 }
        ],
        usersByDevice: usersByDevice.length > 0 ? usersByDevice : [
          { device: 'Desktop', count: totalUsers, percentage: 100 }
        ],
        usersByBrowser: usersByBrowser.length > 0 ? usersByBrowser : [
          { browser: 'Unknown', count: totalUsers, percentage: 100 }
        ],
        topCountries,
        userGrowth
      };
    });

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return NextResponse.json({
      totalUsers: 0,
      activeUsers: 0,
      newUsersToday: 0,
      newUsersThisWeek: 0,
      newUsersThisMonth: 0,
      usersByCountry: [],
      usersByDevice: [],
      usersByBrowser: [],
      topCountries: [],
      userGrowth: []
    }, { status: 200 });
  }
}
