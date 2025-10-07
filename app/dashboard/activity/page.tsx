"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  Heart,
  Download,
  Star,
  Music,
  FileText,
  BarChart3
} from "lucide-react";
import { fetchRecentActivity, type RecentActivity } from "@/lib/user-stats";

export default function ActivityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecentActivity();
    }
  }, [user]);

  const loadRecentActivity = async () => {
    if (!user) return;
    
    try {
      setIsLoadingData(true);
      const activity = await fetchRecentActivity(user.id);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case 'Heart':
        return Heart;
      case 'Download':
        return Download;
      case 'Star':
        return Star;
      default:
        return Clock;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Activity</h1>
            <p className="text-muted-foreground">
              Track your engagement with Chord Finder
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{recentActivity.length}</p>
                    <p className="text-sm text-muted-foreground">Total Activities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {recentActivity.filter(a => a.icon === 'Heart').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {recentActivity.filter(a => a.icon === 'Download').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {recentActivity.filter(a => a.icon === 'Star').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Ratings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Your recent interactions with Chord Finder</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadRecentActivity} disabled={isLoadingData}>
                  <Clock className="h-4 w-4 mr-2" />
                  {isLoadingData ? 'Loading...' : 'Refresh'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading your activity...</p>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const IconComponent = getActivityIcon(activity.icon);
                    
                    return (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {formatTimeAgo(activity.timestamp)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring to see your activity here
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => router.push("/songs")}>
                      Browse Songs
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/resources")}>
                      View Resources
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
