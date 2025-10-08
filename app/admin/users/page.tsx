'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  RefreshCw, 
  Edit, 
  Eye, 
  Ban, 
  CheckCircle,
  MapPin,
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
  Activity,
  Clock,
  BarChart3
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  status?: string;
  created_at: string;
  last_sign_in_at?: string;
  last_activity_at?: string;
  is_banned?: boolean;
  ban_reason?: string;
  locationInfo?: {
    country: string;
    city: string;
    ipAddress: string;
  };
  deviceInfo?: {
    device: string;
    browser: string;
  };
  totalSessions?: number;
  isOnline?: boolean;
}

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  recentSignups: number;
  averageSessionsPerUser: number;
  usersByCountry: Array<{ country: string; count: number }>;
  usersByDevice: Array<{ device: string; count: number }>;
  usersByBrowser: Array<{ browser: string; count: number }>;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      console.log('Fetching users from /api/admin/users...');
      const response = await fetch('/api/admin/users');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Users data received:', data);
        setUsers(data.users || []);
        console.log(`Loaded ${data.users?.length || 0} users`);
        setError(null);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError(`Failed to fetch users: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/users/analytics');
      if (response.ok) {
        const data = await response.json();
        setUserAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserAnalytics();
  }, []);

  const handleCreateUser = () => {
    // TODO: Implement user creation modal
    console.log('Create user clicked');
  };

  const handleEditUser = (user: User) => {
    // TODO: Implement user editing modal
    console.log('Edit user:', user);
  };

  const handleBanUser = (userId: string) => {
    // TODO: Implement user banning
    console.log('Ban user:', userId);
  };

  const handleUnbanUser = (userId: string) => {
    // TODO: Implement user unbanning
    console.log('Unban user:', userId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions with detailed analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
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

      {/* Analytics Overview */}
      {userAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{userAnalytics.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{userAnalytics.activeUsers}</p>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{userAnalytics.recentSignups}</p>
                  <p className="text-sm text-muted-foreground">New This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{userAnalytics.averageSessionsPerUser.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Avg Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </div>
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/test-users');
                  const data = await response.json();
                  console.log('Test users result:', data);
                  alert(`Found ${data.usersCount} users in database. Check console for details.`);
                } catch (error) {
                  console.error('Test failed:', error);
                  alert('Test failed. Check console for details.');
                }
              }} 
              variant="outline" 
              size="sm"
            >
              Test DB
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg font-medium text-muted-foreground mb-2">No users found</p>
              <p className="text-sm text-muted-foreground mb-4">
                There are no users in the database yet. You can add users using the "Add User" button above.
              </p>
              <Button onClick={fetchUsers} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">User</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3">Device</th>
                    <th className="text-left p-3">Activity</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Joined</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{user.full_name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex space-x-1 mt-1">
                            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                              {user.role || 'user'}
                            </Badge>
                            {user.is_banned && (
                              <Badge variant="destructive">
                                Banned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {user.locationInfo?.city || 'Unknown'}, {user.locationInfo?.country || 'Unknown'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.locationInfo?.ipAddress || 'No IP'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          {user.deviceInfo?.device === 'Mobile' && <Smartphone className="h-4 w-4 text-muted-foreground" />}
                          {user.deviceInfo?.device === 'Desktop' && <Laptop className="h-4 w-4 text-muted-foreground" />}
                          {user.deviceInfo?.device === 'Tablet' && <Tablet className="h-4 w-4 text-muted-foreground" />}
                          <div>
                            <p className="text-sm font-medium">{user.deviceInfo?.device || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{user.deviceInfo?.browser || 'Unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm font-medium">{user.totalSessions || 0} sessions</p>
                          <p className="text-xs text-muted-foreground">
                            Last: {user.last_activity_at ? new Date(user.last_activity_at).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <Badge variant={user.isOnline ? 'default' : 'outline'}>
                            {user.isOnline ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.is_banned ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnbanUser(user.id)}
                              title="Unban User"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBanUser(user.id)}
                              title="Ban User"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
