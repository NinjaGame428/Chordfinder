import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET - Fetch all users
export const GET = async (request: NextRequest) => {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Fetch users from auth.users table
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      // Return mock data if database is not set up
      return NextResponse.json({
        users: generateMockUsers(),
      });
    }

    // Transform data to match frontend interface
    const transformedUsers = users?.map(user => ({
      id: user.id,
      email: user.email || 'user@example.com',
      firstName: user.first_name || 'User',
      lastName: user.last_name || 'Name',
      avatar: user.avatar_url || null,
      role: user.role || 'user',
      status: user.status || 'active',
      joinDate: user.created_at,
      lastLogin: user.last_login || user.created_at,
      loginCount: user.login_count || 0,
      location: {
        country: user.country || 'Unknown',
        city: user.city || 'Unknown',
        region: user.region || 'Unknown',
        timezone: user.timezone || 'UTC',
        ip: user.last_ip || '0.0.0.0',
      },
      device: {
        type: user.device_type || 'desktop',
        os: user.os || 'Unknown',
        browser: user.browser || 'Unknown',
        version: user.browser_version || '1.0',
      },
      analytics: {
        pageViews: user.page_views || 0,
        sessionDuration: user.session_duration || 0,
        favoriteSongs: user.favorite_songs_count || 0,
        downloads: user.downloads_count || 0,
      },
      preferences: {
        language: user.language || 'en',
        theme: user.theme || 'system',
        notifications: user.notifications_enabled !== false,
      },
    })) || [];

    return NextResponse.json({
      users: transformedUsers.length > 0 ? transformedUsers : generateMockUsers(),
    });

  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { users: generateMockUsers() },
      { status: 200 }
    );
  }
};

// Helper function to generate mock users for demo
const generateMockUsers = () => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Brazil', 'Mexico'];
  const cities = ['New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Paris', 'Madrid', 'Rome', 'São Paulo', 'Mexico City'];
  const roles = ['user', 'user', 'user', 'user', 'moderator', 'user', 'user', 'user', 'user', 'admin'];
  const statuses = ['active', 'active', 'active', 'active', 'inactive', 'active', 'active', 'banned', 'active', 'pending'];
  const devices = ['desktop', 'mobile', 'tablet', 'desktop', 'mobile'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];

  return Array.from({ length: 25 }, (_, i) => ({
    id: `user-${i + 1}`,
    email: `${firstNames[i % 10].toLowerCase()}.${lastNames[i % 10].toLowerCase()}@example.com`,
    firstName: firstNames[i % 10],
    lastName: lastNames[i % 10],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    role: roles[i % 10] as 'admin' | 'user' | 'moderator',
    status: statuses[i % 10] as 'active' | 'inactive' | 'banned' | 'pending',
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    loginCount: Math.floor(Math.random() * 500) + 1,
    location: {
      country: countries[i % 10],
      city: cities[i % 10],
      region: 'Region ' + (i % 5 + 1),
      timezone: 'UTC' + (Math.floor(Math.random() * 24) - 12),
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    },
    device: {
      type: devices[i % 5] as 'desktop' | 'mobile' | 'tablet',
      os: i % 2 === 0 ? 'Windows' : i % 3 === 0 ? 'macOS' : 'Linux',
      browser: browsers[i % 5],
      version: `${Math.floor(Math.random() * 100) + 1}.0`,
    },
    analytics: {
      pageViews: Math.floor(Math.random() * 10000) + 100,
      sessionDuration: Math.floor(Math.random() * 3600) + 300,
      favoriteSongs: Math.floor(Math.random() * 100),
      downloads: Math.floor(Math.random() * 50),
    },
    preferences: {
      language: i % 3 === 0 ? 'es' : i % 5 === 0 ? 'fr' : 'en',
      theme: (i % 3 === 0 ? 'dark' : i % 2 === 0 ? 'light' : 'system') as 'light' | 'dark' | 'system',
      notifications: i % 4 !== 0,
    },
  }));
};