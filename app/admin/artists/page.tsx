'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search,
  Plus,
  Edit,
  Trash2,
  Music,
  TrendingUp,
  Star
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

interface Artist {
  id: string;
  name: string;
  bio?: string;
  genre?: string;
  created_at?: string;
  updated_at?: string;
  song_count?: number;
}

const ArtistsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch artists
  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/artists');
      if (!response.ok) {
        throw new Error('Failed to fetch artists');
      }
      const data = await response.json();
      setArtists(data.artists || []);
    } catch (err) {
      console.error('Error fetching artists:', err);
      // Set mock data for demonstration
      setArtists([
        { id: '1', name: 'Kirk Franklin', genre: 'Gospel', song_count: 25, created_at: '2024-01-15' },
        { id: '2', name: 'CeCe Winans', genre: 'Gospel', song_count: 18, created_at: '2024-01-20' },
        { id: '3', name: 'Fred Hammond', genre: 'Gospel', song_count: 22, created_at: '2024-02-01' },
        { id: '4', name: 'Yolanda Adams', genre: 'Gospel', song_count: 15, created_at: '2024-02-10' },
        { id: '5', name: 'Donnie McClurkin', genre: 'Gospel', song_count: 20, created_at: '2024-02-15' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // Filter artists based on search
  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artist.genre && artist.genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const genres = Array.from(new Set(artists.map(artist => artist.genre).filter(Boolean)));

  return (
    <AdminLayout>
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Artist Management</h1>
                <p className="text-muted-foreground">
                  Manage artists, their profiles, and associated songs
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Artist
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Artists Grid */}
          <div className="grid gap-6 mb-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredArtists.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No artists found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search criteria'
                      : 'Start by adding your first artist to the collection'
                    }
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Artist
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.map((artist) => (
                  <Card key={artist.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{artist.name}</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {artist.genre && (
                        <Badge variant="secondary">{artist.genre}</Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Songs</span>
                          <span className="font-medium">{artist.song_count || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Added</span>
                          <span className="font-medium">
                            {new Date(artist.created_at || '').toLocaleDateString()}
                          </span>
                        </div>
                        {artist.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {artist.bio}
                          </p>
                        )}
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
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{artists.length}</p>
                    <p className="text-sm text-muted-foreground">Total Artists</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Music className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {artists.reduce((sum, artist) => sum + (artist.song_count || 0), 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Songs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{genres.length}</p>
                    <p className="text-sm text-muted-foreground">Genres</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Star className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(artists.reduce((sum, artist) => sum + (artist.song_count || 0), 0) / artists.length) || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Songs/Artist</p>
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

export default ArtistsPage;
