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
  TrendingUp,
  Clock,
  Globe,
  Smartphone,
  MapPin,
  Monitor,
  Laptop,
  Tablet
} from 'lucide-react';

interface AdminStats {
  totalSongs: number;
  youtubeVideos: number;
  totalArtists: number;
  totalUsers: number;
  totalResources: number;
  activeUsers: number;
  collections: number;
}

interface RecentUser {
    id: string;
  email: string;
  full_name?: string;
  created_at: string;
  last_sign_in_at?: string;
  isOnline?: boolean;
  locationInfo?: {
    country: string;
    city: string;
  };
  deviceInfo?: {
    device: string;
    browser: string;
  };
}

export default function AdminOverview() {
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalSongs: 0,
    youtubeVideos: 0,
    totalArtists: 0,
    totalUsers: 0,
    totalResources: 0,
    activeUsers: 0,
    collections: 1
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setAdminStats(data.stats);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch stats: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        // Get the 5 most recent users
        const recent = (data.users || []).slice(0, 5);
        setRecentUsers(recent);
      } else {
        console.error('Failed to fetch recent users');
      }
    } catch (error) {
      console.error('Error fetching recent users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
    fetchRecentUsers();
  }, []);

  return (
    <div className="space-y-6">
            {/* Header */}
      <div className="flex justify-between items-center">
                <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                  <p className="text-muted-foreground">
            Welcome to your admin dashboard. Monitor your application's performance and manage your content.
                  </p>
                </div>
        <Button 
          variant="outline" 
          onClick={() => {
            fetchAdminStats();
            fetchRecentUsers();
          }}
          disabled={statsLoading || usersLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${(statsLoading || usersLoading) ? 'animate-spin' : ''}`} />
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                      {statsLoading ? '...' : adminStats.totalSongs}
            </div>
            <p className="text-xs text-muted-foreground">
              Songs in your collection
                    </p>
                    </CardContent>
                  </Card>

                  <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YouTube Videos</CardTitle>
            <Youtube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                      {statsLoading ? '...' : adminStats.youtubeVideos}
            </div>
            <p className="text-xs text-muted-foreground">
              Songs with YouTube links
                    </p>
                    </CardContent>
                  </Card>

                  <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                      {statsLoading ? '...' : adminStats.collections}
            </div>
            <p className="text-xs text-muted-foreground">
              Total collections
                    </p>
                    </CardContent>
                  </Card>

                  <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                      {statsLoading ? '...' : adminStats.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Users active now
                    </p>
                    </CardContent>
                  </Card>
                </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Total Users
                    </CardTitle>
                    </CardHeader>
                  <CardContent>
            <div className="text-3xl font-bold">
              {statsLoading ? '...' : adminStats.totalUsers}
                            </div>
            <p className="text-sm text-muted-foreground">
              Registered users
            </p>
                  </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
            <div className="text-3xl font-bold">
              {statsLoading ? '...' : adminStats.totalResources}
                      </div>
                                <p className="text-sm text-muted-foreground">
              Available resources
            </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Artists
            </CardTitle>
                  </CardHeader>
                  <CardContent>
            <div className="text-3xl font-bold">
              {statsLoading ? '...' : adminStats.totalArtists}
                        </div>
            <p className="text-sm text-muted-foreground">
              Total artists
            </p>
                  </CardContent>
                </Card>
              </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Recent Users
          </CardTitle>
          <CardDescription>
            Latest registered users and their activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="text-center py-8">Loading recent users...</div>
          ) : recentUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No users found</p>
              <p className="text-sm text-muted-foreground">
                No users have registered yet. Users will appear here once they sign up.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{user.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {user.locationInfo && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {user.locationInfo.city}, {user.locationInfo.country}
                            </span>
                          </div>
                        )}
                        {user.deviceInfo && (
                          <div className="flex items-center space-x-1">
                            {user.deviceInfo.device === 'Mobile' && <Smartphone className="h-3 w-3 text-muted-foreground" />}
                            {user.deviceInfo.device === 'Desktop' && <Laptop className="h-3 w-3 text-muted-foreground" />}
                            {user.deviceInfo.device === 'Tablet' && <Tablet className="h-3 w-3 text-muted-foreground" />}
                            <span className="text-xs text-muted-foreground">{user.deviceInfo.device}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-muted-foreground">
                          {user.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <Badge variant={user.isOnline ? 'default' : 'outline'}>
                      {user.isOnline ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-2" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Music className="h-6 w-6 mb-2" />
              <span>Add Songs</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Activity className="h-6 w-6 mb-2" />
              <span>System Status</span>
            </Button>
          </div>
        </CardContent>
      </Card>
          </div>
  );
}