"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Music, 
  Download, 
  Star, 
  Settings, 
  BarChart3,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationToast } from "@/components/notification-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock data for admin dashboard
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2024-01-15",
    status: "active",
    role: "user",
    favoriteSongs: 12,
    downloads: 8,
    lastActive: "2024-01-20"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    joinDate: "2024-01-10",
    status: "active",
    role: "user",
    favoriteSongs: 25,
    downloads: 15,
    lastActive: "2024-01-19"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    joinDate: "2024-01-05",
    status: "inactive",
    role: "user",
    favoriteSongs: 5,
    downloads: 3,
    lastActive: "2024-01-15"
  }
];

const mockSongs = [
  {
    id: "1",
    title: "Amazing Grace",
    artist: "John Newton",
    category: "Classic Hymn",
    views: 1250,
    favorites: 89,
    downloads: 45,
    status: "published",
    createdDate: "2024-01-10"
  },
  {
    id: "2",
    title: "How Great Thou Art",
    artist: "Stuart Hine",
    category: "Classic Hymn",
    views: 980,
    favorites: 67,
    downloads: 32,
    status: "published",
    createdDate: "2024-01-08"
  },
  {
    id: "3",
    title: "Oceans",
    artist: "Hillsong United",
    category: "Contemporary",
    views: 2100,
    favorites: 145,
    downloads: 78,
    status: "published",
    createdDate: "2024-01-05"
  }
];

const mockResources = [
  {
    id: "1",
    title: "Gospel Chord Theory Guide",
    type: "PDF Guide",
    downloads: 234,
    category: "Educational",
    status: "published",
    createdDate: "2024-01-12"
  },
  {
    id: "2",
    title: "Worship Leading Masterclass",
    type: "Video Course",
    downloads: 156,
    category: "Training",
    status: "published",
    createdDate: "2024-01-10"
  },
  {
    id: "3",
    title: "Guitar Techniques for Worship",
    type: "Video Tutorial",
    downloads: 89,
    category: "Technical",
    status: "draft",
    createdDate: "2024-01-15"
  }
];

// Mock user requested songs data
const mockUserRequests = [
  {
    id: "1",
    songTitle: "Great Is Thy Faithfulness",
    artist: "Thomas Chisholm",
    requestedBy: "john@example.com",
    requestDate: "2024-01-20",
    status: "pending",
    priority: "high",
    message: "This is a classic hymn that many churches would benefit from having chord charts for."
  },
  {
    id: "2",
    songTitle: "In Christ Alone",
    artist: "Keith Getty",
    requestedBy: "jane@example.com",
    requestDate: "2024-01-19",
    status: "in_progress",
    priority: "medium",
    message: "Modern hymn that's very popular in contemporary worship services."
  },
  {
    id: "3",
    songTitle: "How Deep the Father's Love",
    artist: "Stuart Townend",
    requestedBy: "mike@example.com",
    requestDate: "2024-01-18",
    status: "completed",
    priority: "low",
    message: "Beautiful song for communion services."
  }
];

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [users, setUsers] = useState(mockUsers);
  const [songs, setSongs] = useState(mockSongs);
  const [resources, setResources] = useState(mockResources);
  const [userRequests, setUserRequests] = useState(mockUserRequests);
  const [showAddSongDialog, setShowAddSongDialog] = useState(false);
  const [showEditSongDialog, setShowEditSongDialog] = useState(false);
  const [showAddResourceDialog, setShowAddResourceDialog] = useState(false);
  const [showEditResourceDialog, setShowEditResourceDialog] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // User management functions
  const handleUserUpdate = (userId: string, updates: any) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
    addNotification({
      type: 'success',
      title: 'User Updated',
      message: 'User information has been updated successfully.'
    });
  };

  const handleUserDelete = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    addNotification({
      type: 'warning',
      title: 'User Deleted',
      message: 'User has been removed from the system.'
    });
  };

  const handleSongUpdate = (songId: string, updates: any) => {
    setSongs(prevSongs => 
      prevSongs.map(song => 
        song.id === songId ? { ...song, ...updates } : song
      )
    );
    addNotification({
      type: 'success',
      title: 'Song Updated',
      message: 'Song information has been updated successfully.'
    });
  };

  const handleSongDelete = (songId: string) => {
    setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
    addNotification({
      type: 'warning',
      title: 'Song Deleted',
      message: 'Song has been removed from the system.'
    });
  };

  const handleResourceUpdate = (resourceId: string, updates: any) => {
    setResources(prevResources => 
      prevResources.map(resource => 
        resource.id === resourceId ? { ...resource, ...updates } : resource
      )
    );
    addNotification({
      type: 'success',
      title: 'Resource Updated',
      message: 'Resource information has been updated successfully.'
    });
  };

  const handleResourceDelete = (resourceId: string) => {
    setResources(prevResources => prevResources.filter(resource => resource.id !== resourceId));
    addNotification({
      type: 'warning',
      title: 'Resource Deleted',
      message: 'Resource has been removed from the system.'
    });
  };

  const handleUserRequestUpdate = (requestId: string, updates: any) => {
    setUserRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId ? { ...request, ...updates } : request
      )
    );
    addNotification({
      type: 'success',
      title: 'Request Updated',
      message: 'User request status has been updated successfully.'
    });
  };

  const handleUserRequestDelete = (requestId: string) => {
    setUserRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    addNotification({
      type: 'info',
      title: 'Request Deleted',
      message: 'User request has been removed from the system.'
    });
  };

  // Real data calculations
  const totalUsers = users.length;
  const totalSongs = songs.length;
  const totalResources = resources.length;
  const totalDownloads = songs.reduce((sum, song) => sum + song.downloads, 0) + 
                        resources.reduce((sum, resource) => sum + resource.downloads, 0);
  const pendingRequests = userRequests.filter(req => req.status === 'pending').length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 mt-[100px]">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage users, content, and application settings.
              </p>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="songs">Songs</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalUsers}</div>
                      <p className="text-xs text-muted-foreground">
                        Active users in system
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
                      <Music className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalSongs}</div>
                      <p className="text-xs text-muted-foreground">
                        Songs in database
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Resources</CardTitle>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalResources}</div>
                      <p className="text-xs text-muted-foreground">
                        Available resources
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalDownloads}</div>
                      <p className="text-xs text-muted-foreground">
                        Total downloads across all content
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest user activities and system events</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-muted-foreground">john@example.com - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Music className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New song added</p>
                          <p className="text-xs text-muted-foreground">"Amazing Grace" - 4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Download className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Resource downloaded</p>
                          <p className="text-xs text-muted-foreground">"Gospel Chord Theory Guide" - 6 hours ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full justify-start"
                        onClick={() => {
                          setShowAddSongDialog(true);
                          setSelectedTab("songs");
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Song
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          setShowAddResourceDialog(true);
                          setSelectedTab("resources");
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Resource
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setSelectedTab("users")}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setSelectedTab("settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        System Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage user accounts and permissions</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-64"
                          />
                        </div>
                        <Button variant="outline">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredUsers.map((userItem) => (
                        <div key={userItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{userItem.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{userItem.name}</p>
                              <p className="text-sm text-muted-foreground">{userItem.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={userItem.status === 'active' ? 'default' : 'secondary'}>
                                  {userItem.status}
                                </Badge>
                                <Badge variant={userItem.role === 'admin' ? 'destructive' : userItem.role === 'moderator' ? 'default' : 'outline'}>
                                  {userItem.role}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{userItem.favoriteSongs} favorites</p>
                              <p className="text-xs text-muted-foreground">{userItem.downloads} downloads</p>
                              <p className="text-xs text-muted-foreground">
                                Joined: {new Date(userItem.joinDate).toLocaleDateString()}
                              </p>
                            </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>User Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{userItem.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{userItem.name}</h3>
                              <p className="text-sm text-muted-foreground">{userItem.email}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Role:</span>
                              <span className="ml-2 capitalize">{userItem.role}</span>
                            </div>
                            <div>
                              <span className="font-medium">Status:</span>
                              <span className="ml-2 capitalize">{userItem.status}</span>
                            </div>
                            <div>
                              <span className="font-medium">Favorites:</span>
                              <span className="ml-2">{userItem.favoriteSongs}</span>
                            </div>
                            <div>
                              <span className="font-medium">Downloads:</span>
                              <span className="ml-2">{userItem.downloads}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Joined:</span>
                              <span className="ml-2">{new Date(userItem.joinDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <select
                      value={userItem.role}
                      onChange={(e) => handleUserUpdate(userItem.id, { role: e.target.value })}
                      className="px-2 py-1 border rounded-md text-sm bg-background"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const newStatus = userItem.status === 'active' ? 'inactive' : 'active';
                                  handleUserUpdate(userItem.id, { status: newStatus });
                                }}
                              >
                                {userItem.status === 'active' ? 'Suspend' : 'Activate'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${userItem.name}?`)) {
                                    handleUserDelete(userItem.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Songs Tab */}
              <TabsContent value="songs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Song Management</CardTitle>
                        <CardDescription>Manage songs and chord charts</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search songs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-64"
                          />
                        </div>
                        <Button onClick={() => setShowAddSongDialog(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Song
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredSongs.map((song) => (
                        <div key={song.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Music className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{song.title}</p>
                              <p className="text-sm text-muted-foreground">by {song.artist}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-muted-foreground">{song.category}</span>
                                <Badge variant={song.status === 'published' ? 'default' : 'secondary'}>
                                  {song.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{song.views} views</p>
                              <p className="text-xs text-muted-foreground">{song.favorites} favorites</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Song Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Music className="h-8 w-8 text-primary" />
                                      </div>
                                      <div>
                                        <h3 className="text-xl font-semibold">{song.title}</h3>
                                        <p className="text-muted-foreground">by {song.artist}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">Category:</span>
                                        <span className="ml-2">{song.category}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Difficulty:</span>
                                        <span className="ml-2">{song.difficulty}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Year:</span>
                                        <span className="ml-2">{song.year}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Status:</span>
                                        <span className="ml-2 capitalize">{song.status}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Views:</span>
                                        <span className="ml-2">{song.views}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Favorites:</span>
                                        <span className="ml-2">{song.favorites}</span>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setEditingSong(song);
                                  setShowEditSongDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${song.title}"?`)) {
                                    handleSongDelete(song.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Resource Management</CardTitle>
                        <CardDescription>Manage downloadable resources and guides</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-64"
                          />
                        </div>
                        <Button onClick={() => setShowAddResourceDialog(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Resource
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredResources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Download className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground">{resource.type}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-muted-foreground">{resource.category}</span>
                                <Badge variant={resource.status === 'published' ? 'default' : 'secondary'}>
                                  {resource.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{resource.downloads} downloads</p>
                              <p className="text-xs text-muted-foreground">Created {resource.createdDate}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Resource Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                        {resource.icon}
                                      </div>
                                      <div>
                                        <h3 className="text-xl font-semibold">{resource.title}</h3>
                                        <p className="text-muted-foreground">{resource.type}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">Category:</span>
                                        <span className="ml-2">{resource.category}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Type:</span>
                                        <span className="ml-2">{resource.type}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Size:</span>
                                        <span className="ml-2">{resource.size}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Status:</span>
                                        <span className="ml-2 capitalize">{resource.status}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Downloads:</span>
                                        <span className="ml-2">{resource.downloads}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Created:</span>
                                        <span className="ml-2">{resource.createdDate}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-medium">Description:</span>
                                      <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setEditingResource(resource);
                                  setShowEditResourceDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
                                    handleResourceDelete(resource.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* User Requests Tab */}
              <TabsContent value="requests" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>User Song Requests</CardTitle>
                        <CardDescription>Manage user-requested songs and track progress</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{pendingRequests} Pending</Badge>
                        <Button variant="outline">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Music className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{request.songTitle}</p>
                              <p className="text-sm text-muted-foreground">by {request.artist}</p>
                              <p className="text-xs text-muted-foreground">Requested by: {request.requestedBy}</p>
                              <p className="text-xs text-muted-foreground mt-1">{request.message}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={request.status === 'completed' ? 'default' : request.status === 'in_progress' ? 'secondary' : 'outline'}>
                                  {request.status}
                                </Badge>
                                <Badge variant={request.priority === 'high' ? 'destructive' : request.priority === 'medium' ? 'default' : 'secondary'}>
                                  {request.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{new Date(request.requestDate).toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">Request Date</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <select
                                value={request.status}
                                onChange={(e) => handleUserRequestUpdate(request.id, { status: e.target.value })}
                                className="px-3 py-1 border rounded-md text-sm bg-background"
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete this request for "${request.songTitle}"?`)) {
                                    handleUserRequestDelete(request.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Settings</CardTitle>
                      <CardDescription>Configure application-wide settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input id="siteName" defaultValue="Chord Finder" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="siteDescription">Site Description</Label>
                        <Input id="siteDescription" defaultValue="Gospel Music Chords & Resources" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                        <Input id="maxUploadSize" type="number" defaultValue="10" />
                      </div>
                      <Button className="w-full">Save Settings</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Configure user-related settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Allow User Registration</Label>
                          <p className="text-sm text-muted-foreground">Allow new users to register</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Verification</Label>
                          <p className="text-sm text-muted-foreground">Require email verification</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-approve Songs</Label>
                          <p className="text-sm text-muted-foreground">Automatically approve song submissions</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4" />
                      </div>
                      <Button className="w-full">Save Settings</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Footer />
        <NotificationToast />

        {/* Add Song Dialog */}
        <Dialog open={showAddSongDialog} onOpenChange={setShowAddSongDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Song</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="song-title">Song Title</Label>
                  <Input id="song-title" placeholder="Enter song title" />
                </div>
                <div>
                  <Label htmlFor="song-artist">Artist</Label>
                  <Input id="song-artist" placeholder="Enter artist name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="song-category">Category</Label>
                  <select id="song-category" className="w-full p-2 border rounded-md">
                    <option value="Classic Hymn">Classic Hymn</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Modern Hymn">Modern Hymn</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="song-difficulty">Difficulty</Label>
                  <select id="song-difficulty" className="w-full p-2 border rounded-md">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="song-year">Year</Label>
                  <Input id="song-year" placeholder="Enter year" />
                </div>
                <div>
                  <Label htmlFor="song-status">Status</Label>
                  <select id="song-status" className="w-full p-2 border rounded-md">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddSongDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  addNotification({
                    type: 'success',
                    title: 'Song Added',
                    message: 'New song has been added successfully.'
                  });
                  setShowAddSongDialog(false);
                }}>
                  Add Song
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Song Dialog */}
        <Dialog open={showEditSongDialog} onOpenChange={setShowEditSongDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Song</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-song-title">Song Title</Label>
                  <Input id="edit-song-title" defaultValue={editingSong?.title} />
                </div>
                <div>
                  <Label htmlFor="edit-song-artist">Artist</Label>
                  <Input id="edit-song-artist" defaultValue={editingSong?.artist} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-song-category">Category</Label>
                  <select id="edit-song-category" className="w-full p-2 border rounded-md" defaultValue={editingSong?.category}>
                    <option value="Classic Hymn">Classic Hymn</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Modern Hymn">Modern Hymn</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-song-difficulty">Difficulty</Label>
                  <select id="edit-song-difficulty" className="w-full p-2 border rounded-md" defaultValue={editingSong?.difficulty}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-song-year">Year</Label>
                  <Input id="edit-song-year" defaultValue={editingSong?.year} />
                </div>
                <div>
                  <Label htmlFor="edit-song-status">Status</Label>
                  <select id="edit-song-status" className="w-full p-2 border rounded-md" defaultValue={editingSong?.status}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditSongDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  addNotification({
                    type: 'success',
                    title: 'Song Updated',
                    message: 'Song has been updated successfully.'
                  });
                  setShowEditSongDialog(false);
                }}>
                  Update Song
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Resource Dialog */}
        <Dialog open={showAddResourceDialog} onOpenChange={setShowAddResourceDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="resource-title">Resource Title</Label>
                <Input id="resource-title" placeholder="Enter resource title" />
              </div>
              <div>
                <Label htmlFor="resource-description">Description</Label>
                <Textarea id="resource-description" placeholder="Enter resource description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resource-type">Type</Label>
                  <Input id="resource-type" placeholder="e.g., PDF Guide, Video Tutorial" />
                </div>
                <div>
                  <Label htmlFor="resource-category">Category</Label>
                  <select id="resource-category" className="w-full p-2 border rounded-md">
                    <option value="Theory">Theory</option>
                    <option value="Scales">Scales</option>
                    <option value="Chords">Chords</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resource-size">Size</Label>
                  <Input id="resource-size" placeholder="e.g., 2.3 MB" />
                </div>
                <div>
                  <Label htmlFor="resource-status">Status</Label>
                  <select id="resource-status" className="w-full p-2 border rounded-md">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddResourceDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  addNotification({
                    type: 'success',
                    title: 'Resource Added',
                    message: 'New resource has been added successfully.'
                  });
                  setShowAddResourceDialog(false);
                }}>
                  Add Resource
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Resource Dialog */}
        <Dialog open={showEditResourceDialog} onOpenChange={setShowEditResourceDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-resource-title">Resource Title</Label>
                <Input id="edit-resource-title" defaultValue={editingResource?.title} />
              </div>
              <div>
                <Label htmlFor="edit-resource-description">Description</Label>
                <Textarea id="edit-resource-description" defaultValue={editingResource?.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-resource-type">Type</Label>
                  <Input id="edit-resource-type" defaultValue={editingResource?.type} />
                </div>
                <div>
                  <Label htmlFor="edit-resource-category">Category</Label>
                  <select id="edit-resource-category" className="w-full p-2 border rounded-md" defaultValue={editingResource?.category}>
                    <option value="Theory">Theory</option>
                    <option value="Scales">Scales</option>
                    <option value="Chords">Chords</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-resource-size">Size</Label>
                  <Input id="edit-resource-size" defaultValue={editingResource?.size} />
                </div>
                <div>
                  <Label htmlFor="edit-resource-status">Status</Label>
                  <select id="edit-resource-status" className="w-full p-2 border rounded-md" defaultValue={editingResource?.status}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditResourceDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  addNotification({
                    type: 'success',
                    title: 'Resource Updated',
                    message: 'Resource has been updated successfully.'
                  });
                  setShowEditResourceDialog(false);
                }}>
                  Update Resource
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
