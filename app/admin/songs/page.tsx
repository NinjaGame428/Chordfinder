'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  RefreshCw,
  Youtube,
  Download,
  Star,
  Calendar
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  tempo: number;
  time_signature: string;
  genre: string;
  difficulty: string;
  youtube_id?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [error, setError] = useState<string | null>(null);

  const genres = ['Gospel', 'Worship', 'Contemporary', 'Traditional', 'Hymn', 'Other'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/songs');
      if (response.ok) {
        const data = await response.json();
        setSongs(data.songs || []);
        setFilteredSongs(data.songs || []);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch songs: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Filter songs based on search and filters
  useEffect(() => {
    let filtered = songs;

    if (searchTerm) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(song => song.genre === selectedGenre);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(song => song.difficulty === selectedDifficulty);
    }

    setFilteredSongs(filtered);
  }, [songs, searchTerm, selectedGenre, selectedDifficulty]);

  const handleEditSong = (song: Song) => {
    // TODO: Implement song editing
    console.log('Edit song:', song);
  };

  const handleDeleteSong = (songId: string) => {
    // TODO: Implement song deletion
    console.log('Delete song:', songId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Song Management</h1>
          <p className="text-muted-foreground">
            Manage your chord collection, add new songs, and organize your music library
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Song
          </Button>
          <Button onClick={fetchSongs} variant="outline">
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter songs by title, artist, genre, or difficulty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('');
                setSelectedDifficulty('');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Songs Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Songs ({filteredSongs.length})</CardTitle>
              <CardDescription>
                Your complete song collection
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading songs...</div>
          ) : filteredSongs.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No songs found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {songs.length === 0 
                  ? "You haven't added any songs yet. Click 'Add Song' to get started."
                  : "No songs match your current filters. Try adjusting your search criteria."
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Song
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Song</th>
                    <th className="text-left p-3">Artist</th>
                    <th className="text-left p-3">Key</th>
                    <th className="text-left p-3">Genre</th>
                    <th className="text-left p-3">Difficulty</th>
                    <th className="text-left p-3">YouTube</th>
                    <th className="text-left p-3">Created</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSongs.map((song) => (
                    <tr key={song.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{song.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{song.tempo} BPM</Badge>
                            <Badge variant="outline">{song.time_signature}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-medium">{song.artist}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">{song.key}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{song.genre}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getDifficultyColor(song.difficulty)}>
                          {song.difficulty}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {song.youtube_id ? (
                          <div className="flex items-center space-x-1">
                            <Youtube className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-green-600">Available</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No video</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(song.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSong(song)}
                            title="Edit Song"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSong(song.id)}
                            title="Delete Song"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
