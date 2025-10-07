import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch users with detailed analytics
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        profiles:user_profiles(*),
        sessions:user_sessions(*),
        activities:user_activities(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users with analytics:', error);
      return NextResponse.json({ error: 'Failed to fetch user analytics' }, { status: 500 });
    }

    // Process user data with analytics
    const usersWithAnalytics = users?.map(user => {
      const sessions = user.sessions || [];
      const activities = user.activities || [];
      
      // Get last session info
      const lastSession = sessions.length > 0 ? sessions[0] : null;
      
      // Calculate user activity metrics
      const totalSessions = sessions.length;
      const totalActivities = activities.length;
      const lastActivity = activities.length > 0 ? activities[0] : null;
      
      // Get device and location info from last session
      const deviceInfo = lastSession ? {
        device: lastSession.device_type || 'Unknown',
        browser: lastSession.browser || 'Unknown',
        os: lastSession.operating_system || 'Unknown',
        screenResolution: lastSession.screen_resolution || 'Unknown'
      } : {
        device: 'Unknown',
        browser: 'Unknown',
        os: 'Unknown',
        screenResolution: 'Unknown'
      };

      const locationInfo = lastSession ? {
        country: lastSession.country || 'Unknown',
        city: lastSession.city || 'Unknown',
        region: lastSession.region || 'Unknown',
        ipAddress: lastSession.ip_address || 'Unknown',
        timezone: lastSession.timezone || 'Unknown'
      } : {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        ipAddress: 'Unknown',
        timezone: 'Unknown'
      };

      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role || 'user',
        status: user.status || 'active',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        last_activity_at: lastActivity?.created_at || user.last_sign_in_at,
        totalSessions,
        totalActivities,
        deviceInfo,
        locationInfo,
        isOnline: lastSession ? 
          (new Date().getTime() - new Date(lastSession.created_at).getTime()) < 5 * 60 * 1000 : false, // Online if last session was within 5 minutes
        profile: user.profiles?.[0] || null
      };
    }) || [];

    // Get analytics summary
    const analyticsSummary = {
      totalUsers: usersWithAnalytics.length,
      activeUsers: usersWithAnalytics.filter(u => u.isOnline).length,
      usersByCountry: getUsersByCountry(usersWithAnalytics),
      usersByDevice: getUsersByDevice(usersWithAnalytics),
      usersByBrowser: getUsersByBrowser(usersWithAnalytics),
      recentSignups: usersWithAnalytics.filter(u => {
        const signupDate = new Date(u.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return signupDate > weekAgo;
      }).length,
      averageSessionsPerUser: usersWithAnalytics.length > 0 ? 
        usersWithAnalytics.reduce((sum, u) => sum + u.totalSessions, 0) / usersWithAnalytics.length : 0
    };

    return NextResponse.json({ 
      users: usersWithAnalytics,
      analytics: analyticsSummary
    });
  } catch (error) {
    console.error('Error in GET /api/admin/users/analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getUsersByCountry(users: any[]) {
  const countryCount: { [key: string]: number } = {};
  users.forEach(user => {
    const country = user.locationInfo.country;
    if (country !== 'Unknown') {
      countryCount[country] = (countryCount[country] || 0) + 1;
    }
  });
  return Object.entries(countryCount)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}

function getUsersByDevice(users: any[]) {
  const deviceCount: { [key: string]: number } = {};
  users.forEach(user => {
    const device = user.deviceInfo.device;
    if (device !== 'Unknown') {
      deviceCount[device] = (deviceCount[device] || 0) + 1;
    }
  });
  return Object.entries(deviceCount)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);
}

function getUsersByBrowser(users: any[]) {
  const browserCount: { [key: string]: number } = {};
  users.forEach(user => {
    const browser = user.deviceInfo.browser;
    if (browser !== 'Unknown') {
      browserCount[browser] = (browserCount[browser] || 0) + 1;
    }
  });
  return Object.entries(browserCount)
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count);
}
