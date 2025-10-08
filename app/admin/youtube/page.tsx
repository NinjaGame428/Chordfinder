'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Youtube, 
  Search,
  Plus,
  Play,
  Download,
  Trash2,
  ExternalLink,
  RefreshCw,
  Filter,
  TrendingUp
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: number;
  thumbnail: string;
  description?: string;
  added_at?: string;
  status: 'pending' | 'processed' | 'failed';
}

const YouTubePage = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch YouTube videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/youtube');
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube videos');
      }
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      // Set mock data for demonstration
      setVideos([
        {
          id: '1',
          title: 'Amazing Grace - Gospel Piano Tutorial',
          channel: 'Gospel Music Academy',
          duration: '15:30',
          views: 1250,
          thumbnail: '/api/placeholder/300/200',
          description: 'Learn to play Amazing Grace on piano with chord progressions',
          added_at: '2024-01-15',
          status: 'processed'
        },
        {
          id: '2',
          title: 'How Great Thou Art - Guitar Chords',
          channel: 'Worship Music',
          duration: '12:45',
          views: 890,
          thumbnail: '/api/placeholder/300/200',
          description: 'Complete guitar tutorial for How Great Thou Art',
          added_at: '2024-01-20',
          status: 'processed'
        },
        {
          id: '3',
          title: 'Great Is Thy Faithfulness - Piano Cover',
          channel: 'Gospel Covers',
          duration: '8:20',
          views: 2100,
          thumbnail: '/api/placeholder/300/200',
          description: 'Beautiful piano arrangement of Great Is Thy Faithfulness',
          added_at: '2024-02-01',
          status: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filter videos based on search and status
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || video.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statuses = ['all', 'pending', 'processed', 'failed'];

  return (
    <AdminLayout>
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">YouTube Management</h1>
                <p className="text-muted-foreground">
                  Import and manage YouTube videos for your chord collection
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchVideos}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Import Video
                </Button>
              </div>
            </div>
          </div>

          {/* Import Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Youtube className="h-5 w-5 mr-2" />
                Import YouTube Video
              </CardTitle>
              <CardDescription>
                Add new videos to your collection by pasting YouTube URLs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Paste YouTube URL here..."
                  className="flex-1"
                />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Videos Grid */}
          <div className="grid gap-4 mb-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredVideos.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No videos found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start by importing your first YouTube video'
                    }
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Import First Video
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={getStatusColor(video.status)}>
                            {video.status}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{video.channel}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>{video.views.toLocaleString()} views</span>
                          <span>{new Date(video.added_at || '').toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Youtube className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{videos.length}</p>
                    <p className="text-sm text-muted-foreground">Total Videos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Filter className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {videos.filter(v => v.status === 'processed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Processed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Download className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {videos.filter(v => v.status === 'pending').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default YouTubePage;
