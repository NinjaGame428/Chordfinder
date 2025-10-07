'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Users, 
  Youtube, 
  Activity, 
  BarChart3, 
  RefreshCw,
  MapPin,
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  TrendingUp,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalSongs: number;
    totalUsers: number;
    youtubeVideos: number;
    activeUsers: number;
    totalSessions: number;
    totalActivities: number;
  };
  userGrowth: {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
  };
  geographic: {
    usersByCountry: Array<{ country: string; count: number }>;
    usersByCity: Array<{ city: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
  };
  device: {
    usersByDevice: Array<{ device: string; count: number }>;
    usersByBrowser: Array<{ browser: string; count: number }>;
    usersByOS: Array<{ os: string; count: number }>;
  };
  content: {
    mostPopularSongs: Array<{ title: string; downloads: number; rating: number }>;
    mostPopularArtists: Array<{ name: string }>;
    totalDownloads: number;
    averageRating: number;
  };
  recentActivity: {
    recentSignups: Array<{ full_name: string; email: string; created_at: string }>;
    recentSessions: Array<{ device_type: string; country: string; created_at: string }>;
    recentActivities: Array<{ activity_type: string; description: string; created_at: string }>;
  };
}

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.analytics);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch analytics: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights into your application's performance
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchAnalyticsData}
          disabled={analyticsLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${analyticsLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Music className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {analyticsLoading ? '...' : analyticsData?.overview?.totalSongs || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Songs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {analyticsLoading ? '...' : analyticsData?.overview?.totalUsers || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Youtube className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {analyticsLoading ? '...' : analyticsData?.overview?.youtubeVideos || 0}
                </p>
                <p className="text-sm text-muted-foreground">YouTube Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {analyticsLoading ? '...' : analyticsData?.overview?.activeUsers || 0}
                </p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth */}
      {analyticsData?.userGrowth && (
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              Track user acquisition and growth metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData.userGrowth.newUsersToday}
                </p>
                <p className="text-sm text-muted-foreground">New Today</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {analyticsData.userGrowth.newUsersThisWeek}
                </p>
                <p className="text-sm text-muted-foreground">New This Week</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {analyticsData.userGrowth.newUsersThisMonth}
                </p>
                <p className="text-sm text-muted-foreground">New This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Geographic Analytics */}
      {analyticsData?.geographic && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.geographic.topCountries?.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{item.country}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((item.count / (analyticsData.geographic.topCountries[0]?.count || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Device Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.device?.usersByDevice?.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {item.device === 'Mobile' && <Smartphone className="h-4 w-4" />}
                      {item.device === 'Desktop' && <Laptop className="h-4 w-4" />}
                      {item.device === 'Tablet' && <Tablet className="h-4 w-4" />}
                      <span className="text-sm">{item.device}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((item.count / (analyticsData.device.usersByDevice[0]?.count || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Analytics */}
      {analyticsData?.content && (
        <Card>
          <CardHeader>
            <CardTitle>Content Analytics</CardTitle>
            <CardDescription>
              Popular songs and content performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Most Popular Songs</h4>
                <div className="space-y-2">
                  {analyticsData.content.mostPopularSongs?.slice(0, 5).map((song, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm font-medium">{song.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{song.downloads || 0} downloads</span>
                        <Badge variant="outline">{song.rating || 0}★</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Downloads</span>
                    <span className="font-medium">{analyticsData.content.totalDownloads || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Sessions</span>
                    <span className="font-medium">{analyticsData.overview?.totalSessions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Activities</span>
                    <span className="font-medium">{analyticsData.overview?.totalActivities || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {analyticsData?.recentActivity && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest user signups and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Recent Signups</h4>
                <div className="space-y-2">
                  {analyticsData.recentActivity.recentSignups?.slice(0, 3).map((user, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{user.full_name || 'Unknown'}</p>
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recent Sessions</h4>
                <div className="space-y-2">
                  {analyticsData.recentActivity.recentSessions?.slice(0, 3).map((session, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{session.device_type}</p>
                      <p className="text-muted-foreground">{session.country}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recent Activities</h4>
                <div className="space-y-2">
                  {analyticsData.recentActivity.recentActivities?.slice(0, 3).map((activity, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{activity.activity_type}</p>
                      <p className="text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
