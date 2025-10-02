'use client';

import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Music className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">10</p>
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
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Nalingi Yo</p>
                          <p className="text-sm text-muted-foreground">Dena Mwana</p>
                        </div>
                        <Badge variant="secondary">Published</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Je suis victorieux</p>
                          <p className="text-sm text-muted-foreground">Dena Mwana</p>
                        </div>
                        <Badge variant="secondary">Published</Badge>
                        </div>
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
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                          Add Song
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div>
                          <p className="font-medium">Nalingi Yo</p>
                          <p className="text-sm text-muted-foreground">Dena Mwana • C Major • Beginner</p>
                            </div>
                            </div>
                            <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                        <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">Je suis victorieux</p>
                          <p className="text-sm text-muted-foreground">Dena Mwana • D Major • Intermediate</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
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
    </>
  );
};

export default AdminPage;