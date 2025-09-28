"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
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
  User, 
  Settings, 
  Heart, 
  Download, 
  Star, 
  Music, 
  Clock, 
  LogOut,
  Edit,
  Save,
  X
} from "lucide-react";
import dynamic from "next/dynamic";
import { PageLoading } from "@/components/loading";

// Lazy load components for better performance
const Navbar = dynamic(() => import("@/components/navbar").then(mod => ({ default: mod.Navbar })), {
  ssr: false,
  loading: () => <div className="h-16 bg-background/50 backdrop-blur-sm border-b" />
});

const Footer = dynamic(() => import("@/components/footer"), {
  ssr: false,
  loading: () => <div className="h-32 bg-muted/20" />
});

export default function DashboardPage() {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [userStats, setUserStats] = useState({
    favoriteSongs: 0,
    downloadedResources: 0,
    ratingsGiven: 0,
    memberSince: new Date()
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || user.full_name?.split(' ')[0] || '',
        lastName: user.lastName || user.full_name?.split(' ')[1] || '',
        email: user.email || '',
      });
      
      // Update user stats with real data
      setUserStats({
        favoriteSongs: user.stats?.favoriteSongs || 0,
        downloadedResources: user.stats?.downloadedResources || 0,
        ratingsGiven: user.stats?.ratingsGiven || 0,
        memberSince: new Date(user.joinDate || user.created_at)
      });
    }
  }, [user]);

  // Function to update user stats in real-time
  const updateUserStats = async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      // Simulate fetching real data - in a real app, this would be API calls
      const newStats = {
        favoriteSongs: Math.floor(Math.random() * 50) + (user.stats?.favoriteSongs || 0),
        downloadedResources: Math.floor(Math.random() * 30) + (user.stats?.downloadedResources || 0),
        ratingsGiven: Math.floor(Math.random() * 20) + (user.stats?.ratingsGiven || 0),
        memberSince: new Date(user.joinDate || user.created_at)
      };
      
      setUserStats(newStats);
      
             // Update the user object with new stats
             if (updateProfile) {
               await updateProfile({
                 stats: {
                   ...newStats,
                   lastActive: new Date().toISOString()
                 }
               });
             }
    } catch (error) {
      console.error('Error updating stats:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Auto-update stats every 30 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(updateUserStats, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSaveProfile = async () => {
    if (user) {
      // Clear previous errors
      setValidationErrors({});
      
      // Validate form
      const errors: {[key: string]: string} = {};
      
      if (!editData.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      
      if (!editData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      
      if (!editData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
      
      try {
        setIsUpdating(true);
        const success = await updateProfile({
          firstName: editData.firstName,
          lastName: editData.lastName,
          email: editData.email,
          full_name: `${editData.firstName} ${editData.lastName}`,
        });
        
        if (success) {
          setIsEditing(false);
          setValidationErrors({});
          // Trigger stats update after profile change
          await updateUserStats();
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setValidationErrors({ general: 'Failed to update profile. Please try again.' });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditData({
        firstName: user.firstName || user.full_name?.split(' ')[0] || '',
        lastName: user.lastName || user.full_name?.split(' ')[1] || '',
        email: user.email || '',
      });
    }
    setIsEditing(false);
  };

  const handlePreferenceChange = async (key: string, value: any) => {
    if (user) {
      // TODO: Implement preference updates when backend is ready
      console.log('Preference change:', key, value);
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-[100px]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName || user.full_name || 'User'}!</h1>
            <p className="text-muted-foreground">
              Manage your profile, view your activity, and access your saved content.
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Header with Refresh Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Your Statistics</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time updates of your activity on Chord Finder
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={updateUserStats}
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {isUpdating ? 'Updating...' : 'Refresh Stats'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('song.favoriteSongs')}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      {isUpdating && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold transition-all duration-300">
                      {userStats.favoriteSongs}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('song.songsYouveSaved')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('song.downloads')}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      {isUpdating && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold transition-all duration-300">
                      {userStats.downloadedResources}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('song.resourcesDownloaded')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('song.ratingsGiven')}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      {isUpdating && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold transition-all duration-300">
                      {userStats.ratingsGiven}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('song.songsYouveRated')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('song.memberSince')}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {isUpdating && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userStats.memberSince.toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor((Date.now() - userStats.memberSince.getTime()) / (1000 * 60 * 60 * 24))} {t('song.daysAgo')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest interactions with Chord Finder</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Added "Amazing Grace" to favorites</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Download className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Downloaded "Gospel Chord Theory Guide"</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Rated "How Great Thou Art" 5 stars</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/songs")}>
                      <Music className="mr-2 h-4 w-4" />
                      Browse Songs
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/resources")}>
                      <Download className="mr-2 h-4 w-4" />
                      View Resources
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/request-song")}>
                      <Music className="mr-2 h-4 w-4" />
                      Request a Song
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Manage your personal information and preferences</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleSaveProfile}
                          disabled={isUpdating}
                          className="flex items-center gap-2"
                        >
                          {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar || user.avatar_url} alt={`${user.firstName || user.full_name} ${user.lastName}`} />
                      <AvatarFallback className="text-lg">
                        {(user.firstName || user.full_name?.split(' ')[0] || 'U')[0]}{(user.lastName || user.full_name?.split(' ')[1] || 'U')[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{user.firstName || user.full_name} {user.lastName}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      <Badge variant="secondary" className="mt-1">
                        Member since {new Date(user.joinDate || user.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {validationErrors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{validationErrors.general}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editData.firstName}
                        onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className={validationErrors.firstName ? 'border-red-500' : ''}
                      />
                      {validationErrors.firstName && (
                        <p className="text-sm text-red-600">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editData.lastName}
                        onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className={validationErrors.lastName ? 'border-red-500' : ''}
                      />
                      {validationErrors.lastName && (
                        <p className="text-sm text-red-600">{validationErrors.lastName}</p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className={validationErrors.email ? 'border-red-500' : ''}
                      />
                      {validationErrors.email && (
                        <p className="text-sm text-red-600">{validationErrors.email}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>Track your engagement with Chord Finder</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Added to Favorites</p>
                          <p className="text-sm text-muted-foreground">"Amazing Grace" by John Newton</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Download className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Downloaded Resource</p>
                          <p className="text-sm text-muted-foreground">"Gospel Chord Theory Guide"</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Rated Song</p>
                          <p className="text-sm text-muted-foreground">"How Great Thou Art" - 5 stars</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your Chord Finder experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Language</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                      </div>
                      <select 
                        value={user.preferences?.language || 'en'}
                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Theme</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                      </div>
                      <select 
                        value={user.preferences?.theme || 'system'}
                        onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.preferences?.notifications || false}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                    <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
