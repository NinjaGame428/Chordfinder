'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Music, 
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

interface Song {
  id: string;
  title: string;
  artist?: string;
  genre?: string;
  key_signature?: string;
  created_at?: string;
  updated_at?: string;
}

const SongsPage = () => {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');

  // Fetch songs
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/songs');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      setSongs(data.songs || []);
    } catch (err) {
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Filter songs based on search and genre
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = filterGenre === 'all' || song.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = ['all', ...Array.from(new Set(songs.map(song => song.genre).filter(Boolean)))];

  return (
    <AdminLayout>
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Song Management</h1>
                <p className="text-muted-foreground">
                  Manage your song collection, edit details, and organize content
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Song
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>
          </div>

          {/* Songs List */}
          <div className="grid gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredSongs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No songs found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterGenre !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start by adding your first song to the collection'
                    }
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Song
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredSongs.map((song) => (
                <Card key={song.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{song.title}</h3>
                          {song.genre && (
                            <Badge variant="secondary">{song.genre}</Badge>
                          )}
                          {song.key_signature && (
                            <Badge variant="outline">{song.key_signature}</Badge>
                          )}
                        </div>
                        {song.artist && (
                          <p className="text-muted-foreground">by {song.artist}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Created: {new Date(song.created_at || '').toLocaleDateString()}</span>
                          <span>Updated: {new Date(song.updated_at || '').toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/songs/${song.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Music className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{songs.length}</p>
                    <p className="text-sm text-muted-foreground">Total Songs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Filter className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{genres.length - 1}</p>
                    <p className="text-sm text-muted-foreground">Genres</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Search className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{filteredSongs.length}</p>
                    <p className="text-sm text-muted-foreground">Filtered Results</p>
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

export default SongsPage;
