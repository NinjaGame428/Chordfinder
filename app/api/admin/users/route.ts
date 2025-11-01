import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    const users = await query(async (sql) => {
      const results = await sql`
        SELECT *
        FROM users
        ORDER BY created_at DESC
      `;
      return results;
    });

    const transformedUsers = users?.map((user: any) => ({
      id: user.id,
      email: user.email || 'user@example.com',
      firstName: user.first_name || (user.full_name ? user.full_name.split(' ')[0] : 'User'),
      lastName: user.last_name || (user.full_name ? user.full_name.split(' ').slice(1).join(' ') : 'Name'),
      avatar: user.avatar_url || null,
      role: user.role || 'user',
      status: user.status || 'active',
      joinDate: user.created_at,
      lastLogin: user.last_login || user.created_at,
      loginCount: 0, // Calculate from sessions if needed
      location: {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        timezone: 'UTC',
        ip: '0.0.0.0',
      },
      device: {
        type: 'desktop',
        os: 'Unknown',
        browser: 'Unknown',
        version: '1.0',
      },
      analytics: {
        pageViews: 0,
        sessionDuration: 0,
        favoriteSongs: 0,
        downloads: 0,
      },
      preferences: user.preferences || {
        language: 'en',
        theme: 'system',
        notifications: true,
      },
    })) || [];

    return NextResponse.json({
      users: transformedUsers.length > 0 ? transformedUsers : [],
    });
  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { users: [] },
      { status: 200 }
    );
  }
};
