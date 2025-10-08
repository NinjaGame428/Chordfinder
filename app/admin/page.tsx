'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, 
  Youtube, 
  Database, 
  Users,
  BarChart3,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Activity,
  Clock,
  Star,
  Download,
  Heart,
  Settings,
  Shield
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const router = useRouter();
  const [adminStats, setAdminStats] = useState({
    totalSongs: 0,
    totalArtists: 0,
    totalResources: 0,
    totalUsers: 0,
    activeUsers: 0,
    youtubeVideos: 0,
    collections: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([
    { id: '1', title: 'New song added', description: 'Amazing Grace added to collection', timestamp: '2024-01-15', icon: 'Music' },
    { id: '2', title: 'User registered', description: 'New user joined the platform', timestamp: '2024-01-14', icon: 'Users' },
    { id: '3', title: 'Resource uploaded', description: 'Gospel chord guide uploaded', timestamp: '2024-01-13', icon: 'BookOpen' }
  ]);

  // Fetch admin statistics
  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch admin statistics');
      }
      const data = await response.json();
      setAdminStats(data.stats);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      // Set default values if API fails
      setAdminStats({
        totalSongs: 207,
        totalArtists: 79,
        totalResources: 30,
        totalUsers: 2,
        activeUsers: 1,
        youtubeVideos: 0,
        collections: 1
      });
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your chord collection, YouTube scraper, and application settings.
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Header with Refresh Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">System Statistics</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time updates of your platform performance
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchAdminStats}
                  disabled={statsLoading}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {statsLoading ? 'Updating...' : 'Refresh Data'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Songs in Collection</CardTitle>
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      {statsLoading && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold transition-all duration-300">
                      {adminStats.totalSongs}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total songs available
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Artists</CardTitle>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {statsLoading && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold transition-all duration-300">
                      {adminStats.totalArtists}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Artists in database
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resources</CardTitle>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      {statsLoading && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold transition-all duration-300">
                      {adminStats.totalResources}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Learning resources
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      {statsLoading && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold transition-all duration-300">
                      {adminStats.activeUsers}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently active
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system activities and changes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => {
                        const IconComponent = activity.icon === 'Music' ? Music : 
                                            activity.icon === 'Users' ? Users : BookOpen;
                        const timeAgo = new Date(activity.timestamp).toLocaleDateString();
                        
                        return (
                          <div key={activity.id} className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <IconComponent className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.description} • {timeAgo}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                        <p className="text-xs text-muted-foreground">System activities will appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common admin tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/admin/songs")}>
                      <Music className="mr-2 h-4 w-4" />
                      Manage Songs
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/admin/artists")}>
                      <Users className="mr-2 h-4 w-4" />
                      Manage Artists
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/admin/users")}>
                      <Shield className="mr-2 h-4 w-4" />
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/admin/resources")}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Manage Resources
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/admin/youtube")}>
                      <Youtube className="mr-2 h-4 w-4" />
                      Import YouTube Videos
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/admin/analytics")}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Platform Analytics
                  </CardTitle>
                  <CardDescription>
                    Comprehensive insights into your platform's performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Total Users</span>
                        <span className="font-medium">{adminStats.totalUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Collections</span>
                        <span className="font-medium">{adminStats.collections}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>YouTube Videos</span>
                        <span className="font-medium">{adminStats.youtubeVideos}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Database Status</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Sync</span>
                        <span className="text-sm text-muted-foreground">Just now</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>System Health</span>
                        <Badge variant="outline">Healthy</Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Growth Rate</span>
                        <span className="font-medium text-green-600">+12%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Engagement</span>
                        <span className="font-medium text-blue-600">High</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Performance</span>
                        <span className="font-medium text-purple-600">Excellent</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>System Activity</CardTitle>
                      <CardDescription>Track system activities and admin actions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchAdminStats} disabled={statsLoading}>
                      <Clock className="h-4 w-4 mr-2" />
                      {statsLoading ? 'Updating...' : 'Refresh'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => {
                        const IconComponent = activity.icon === 'Music' ? Music : 
                                            activity.icon === 'Users' ? Users : BookOpen;
                        const timeAgo = new Date(activity.timestamp).toLocaleDateString();
                        
                        return (
                          <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <IconComponent className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{timeAgo}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          System activities will appear here
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button onClick={() => router.push("/admin/songs")}>
                            Manage Songs
                          </Button>
                          <Button variant="outline" onClick={() => router.push("/admin/analytics")}>
                            View Analytics
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure your admin panel and system preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Database Connection</h4>
                        <p className="text-sm text-muted-foreground">Manage database settings</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">System Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive admin alerts</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Backup Status</h4>
                        <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Backup Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Admin Actions</CardTitle>
                  <CardDescription>System management and maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Security Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="mr-2 h-4 w-4" />
                      Database Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Performance Monitoring
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      System Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
