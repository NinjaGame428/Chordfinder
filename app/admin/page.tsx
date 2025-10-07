'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Music, 
  Youtube, 
  Database, 
  Edit,
  Plus, 
  Trash2,
  Save,
  Upload,
  Download,
  Users,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import { AdminSongEditor } from '@/components/AdminSongEditor';
import Link from 'next/link';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSongEditor, setShowSongEditor] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch songs from database
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/songs');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      setSongs(data.songs || []);
      setError(null);
      setSuccessMessage(null);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleSaveSong = async (song: any) => {
    try {
      const url = editingSong ? `/api/songs/${editingSong.id}` : '/api/songs';
      const method = editingSong ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      });

      if (!response.ok) {
        throw new Error('Failed to save song');
      }

      const result = await response.json();
      console.log('Song saved successfully:', result);
      
      setShowSongEditor(false);
      setEditingSong(null);
      setSuccessMessage(editingSong ? 'Song updated successfully!' : 'Song created successfully!');
      
      // Refresh the songs list
      await fetchSongs();
    } catch (error) {
      console.error('Error saving song:', error);
      setError('Failed to save song. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setShowSongEditor(false);
    setEditingSong(null);
  };

  const handleEditSong = (song: any) => {
    setEditingSong(song);
    setShowSongEditor(true);
  };

  const handleAddSong = () => {
    setEditingSong(null);
    setShowSongEditor(true);
  };

  const handleDeleteSong = async (songId: string) => {
    if (!confirm('Are you sure you want to delete this song?')) {
      return;
    }

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete song');
      }

      setSuccessMessage('Song deleted successfully!');
      
      // Refresh the songs list
      await fetchSongs();
    } catch (error) {
      console.error('Error deleting song:', error);
      setError('Failed to delete song. Please try again.');
    }
  };

  return (
    <>
        <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
              Manage your chord collection, YouTube scraper, and application settings
              </p>
            </div>

            {/* Notifications */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{successMessage}</p>
                <button 
                  onClick={() => setSuccessMessage(null)}
                  className="mt-2 text-sm text-green-600 hover:text-green-800"
                >
                  Dismiss
                </button>
              </div>
            )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Music className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{songs.length}</p>
                    <p className="text-sm text-muted-foreground">Songs in Collection</p>
                  </div>
                </div>
                    </CardContent>
                  </Card>
                  <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Youtube className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">YouTube Videos</p>
                  </div>
                </div>
                    </CardContent>
                  </Card>
                  <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Database className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm text-muted-foreground">Collections</p>
                  </div>
                </div>
                    </CardContent>
                  </Card>
                  <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                </div>
                    </CardContent>
                  </Card>
                </div>

          {/* Admin Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="songs">Songs</TabsTrigger>
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
              <TabsTrigger value="scraper">Scraper</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center">
                      <Music className="h-5 w-5 mr-2" />
                      Recent Songs
                    </CardTitle>
                    </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {loading ? (
                        <div className="text-center py-4 text-muted-foreground">Loading...</div>
                      ) : songs.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">No songs yet</div>
                      ) : (
                        songs.slice(0, 3).map((song) => (
                          <div key={song.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{song.title}</p>
                              <p className="text-sm text-muted-foreground">{song.artists?.name || 'Unknown Artist'}</p>
                            </div>
                            <Badge variant="secondary">Published</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center">
                      <Youtube className="h-5 w-5 mr-2" />
                      YouTube Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>API Status</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                              </div>
                      <div className="flex items-center justify-between">
                        <span>Videos Scraped</span>
                        <span className="font-medium">8</span>
                            </div>
                      <div className="flex items-center justify-between">
                        <span>Last Update</span>
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
                          </div>
                      <Button className="w-full" variant="outline">
                        <Youtube className="h-4 w-4 mr-2" />
                        Manage YouTube
                              </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              </TabsContent>

              {/* Songs Tab */}
              <TabsContent value="songs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Song Management</CardTitle>
                      <CardDescription>
                        Edit, add, or remove songs from your collection
                      </CardDescription>
                      </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddSong}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Song
                      </Button>
                      <Button variant="outline" onClick={fetchSongs} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground">Loading songs...</div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-red-500">{error}</div>
                      </div>
                    ) : songs.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground">No songs found. Add your first song!</div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {songs.map((song) => (
                          <div key={song.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium">{song.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {song.artists?.name || 'Unknown Artist'} • {song.key_signature || 'No Key'} • {song.tempo ? `${song.tempo} BPM` : 'No BPM'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleEditSong(song)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDeleteSong(song.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
              </Card>
            </TabsContent>

            {/* YouTube Tab */}
            <TabsContent value="youtube" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>YouTube Management</CardTitle>
                  <CardDescription>
                    Manage YouTube video IDs and video information
                  </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20">
                        <div className="text-center">
                          <Youtube className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm">Update Video IDs</p>
                            </div>
                      </Button>
                      <Button variant="outline" className="h-20">
                        <div className="text-center">
                          <Upload className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm">Bulk Import</p>
                            </div>
                                  </Button>
                      <Button variant="outline" className="h-20">
                        <div className="text-center">
                          <Download className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm">Export Data</p>
                                  </div>
                              </Button>
                      <Button variant="outline" className="h-20">
                        <div className="text-center">
                          <Settings className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm">API Settings</p>
                        </div>
                      </Button>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            {/* Scraper Tab */}
            <TabsContent value="scraper" className="space-y-6">
                <Card>
                  <CardHeader>
                  <CardTitle>YouTube Scraper</CardTitle>
                  <CardDescription>
                    Configure and manage the YouTube scraper functionality
                  </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                    <Link href="/youtube-scraper">
                      <Button className="w-full">
                        <Youtube className="h-4 w-4 mr-2" />
                        Open YouTube Scraper
                      </Button>
                    </Link>
                    <Link href="/admin/youtube-finder">
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        YouTube Finder Settings
                              </Button>
                    </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Settings</CardTitle>
                  <CardDescription>
                    Configure application-wide settings and preferences
                  </CardDescription>
                    </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20">
                        <div className="text-center">
                          <Database className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm">Database Settings</p>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-20">
                        <div className="text-center">
                          <Users className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm">User Management</p>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-20">
                        <div className="text-center">
                          <Settings className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm">General Settings</p>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-20">
                        <div className="text-center">
                          <Save className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm">Backup & Restore</p>
                      </div>
                      </Button>
                      </div>
                      </div>
                    </CardContent>
                  </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
                  <Card>
                    <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    View usage statistics and performance metrics
                  </CardDescription>
                    </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">1,234</p>
                        <p className="text-sm text-muted-foreground">Total Views</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Music className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <p className="text-2xl font-bold">567</p>
                        <p className="text-sm text-muted-foreground">Songs Played</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold">89</p>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                    </div>
                  </div>
                    </CardContent>
                  </Card>
              </TabsContent>
            </Tabs>
        </div>
      </main>
        <Footer />
        
        {/* Song Editor Modal */}
        {showSongEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <AdminSongEditor
                song={editingSong || undefined}
                onSave={handleSaveSong}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
        )}
    </>
  );
};

export default AdminPage;