'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, Music, Guitar, Piano, BarChart3, ExternalLink, Grid3X3, List, Eye, Play } from 'lucide-react';
import Link from 'next/link';

interface ChordCollectionProps {
  collectionData: any;
}

const ChordCollectionManager: React.FC<ChordCollectionProps> = ({ collectionData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedKey, setSelectedKey] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSong, setSelectedSong] = useState<any>(null);

  const filteredSongs = useMemo(() => {
    let songs = collectionData.songs || [];

    // Search filter
    if (searchQuery) {
      songs = songs.filter((song: any) => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.english_title && song.english_title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      songs = songs.filter((song: any) => song.difficulty === selectedDifficulty);
    }

    // Key filter
    if (selectedKey !== 'all') {
      songs = songs.filter((song: any) => song.key === selectedKey);
    }

    // Sort
    songs.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'bpm':
          return a.bpm - b.bpm;
        case 'difficulty':
          const difficultyOrder: { [key: string]: number } = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
          return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
        case 'year':
          return (b.year || 0) - (a.year || 0);
        default:
          return 0;
      }
    });

    return songs;
  }, [searchQuery, selectedDifficulty, selectedKey, sortBy, collectionData]);

  const statistics = useMemo(() => {
    const songs = collectionData.songs || [];
    const difficulties = songs.reduce((acc: any, song: any) => {
      acc[song.difficulty] = (acc[song.difficulty] || 0) + 1;
      return acc;
    }, {});
    
    const keys = songs.reduce((acc: any, song: any) => {
      acc[song.key] = (acc[song.key] || 0) + 1;
      return acc;
    }, {});

    return {
      totalSongs: songs.length,
      difficulties,
      keys,
      averageBPM: songs.reduce((sum: number, song: any) => sum + song.bpm, 0) / songs.length
    };
  }, [collectionData]);

  const handleExportCSV = () => {
    const csvContent = [
      ['Title', 'English Title', 'Key', 'BPM', 'Difficulty', 'Album', 'Year', 'YouTube ID'],
      ...filteredSongs.map((song: any) => [
        song.title,
        song.english_title || '',
        song.key,
        song.bpm,
        song.difficulty,
        song.album || '',
        song.year || '',
        song.youtube_id || ''
      ])
    ].map(row => row.map((cell: any) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collectionData.artist}_chord_collection.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const getKeyColor = (key: string) => {
    const majorKeys = ['C', 'G', 'D', 'A', 'E', 'F'];
    const minorKeys = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'Dm'];
    
    if (majorKeys.some(k => key.includes(k))) return 'bg-blue-100 text-blue-800';
    if (minorKeys.some(k => key.includes(k))) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{collectionData.artist} Collection</h2>
          <p className="text-muted-foreground">{collectionData.description}</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Songs</p>
                <p className="text-2xl font-bold">{statistics.totalSongs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Avg BPM</p>
                <p className="text-2xl font-bold">{Math.round(statistics.averageBPM)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Piano className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Piano Songs</p>
                <p className="text-2xl font-bold">{statistics.totalSongs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Guitar className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Guitar Songs</p>
                <p className="text-2xl font-bold">{statistics.totalSongs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search songs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Key</label>
              <Select value={selectedKey} onValueChange={setSelectedKey}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Keys</SelectItem>
                  {Object.keys(statistics.keys).map(key => (
                    <SelectItem key={key} value={key}>{key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="bpm">BPM</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Songs ({filteredSongs.length})</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Songs Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSongs.map((song: any) => (
          <Card key={song.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedSong(song)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{song.title}</CardTitle>
                  {song.english_title && (
                    <CardDescription className="mt-1">{song.english_title}</CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getDifficultyColor(song.difficulty)}>
                    {song.difficulty}
                  </Badge>
                  <Badge className={getKeyColor(song.key)}>
                    {song.key}
                  </Badge>
                  <Badge variant="outline">
                    {song.bpm} BPM
                  </Badge>
                </div>
                
                {song.album && (
                  <p className="text-sm text-muted-foreground">Album: {song.album}</p>
                )}
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Piano Chords:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {song.chords.piano.primary.slice(0, 4).map((chord: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {chord}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Guitar Chords:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {song.chords.guitar.primary.slice(0, 4).map((chord: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {chord}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSong(song);
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Chords Quick View
                  </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to song details page
                        console.log('Redirecting to song ID:', song.id);
                        window.location.href = `/songs/${song.id}`;
                      }}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play Along
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      ) : (
        <div className="space-y-4">
          {filteredSongs.map((song: any) => (
            <Card key={song.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="font-semibold text-lg">{song.title}</h3>
                      {song.english_title && (
                        <span className="text-muted-foreground">({song.english_title})</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center space-x-1">
                        <span className="font-medium">Artist:</span>
                        <span>{collectionData.artist}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="font-medium">Language:</span>
                        <span>en</span>
                      </span>
                      <Badge className={getDifficultyColor(song.difficulty)}>
                        {song.difficulty}
                      </Badge>
                      <Badge className={getKeyColor(song.key)}>
                        {song.key}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Chords:</span>
                        <div className="flex space-x-1">
                          {song.chords.piano.primary.slice(0, 4).map((chord: string, index: number) => (
                            <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                              {chord}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSong(song)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Chords Quick View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        console.log('Redirecting to song ID:', song.id);
                        window.location.href = `/songs/${song.id}`;
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play Along
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chords Progression Quick View Modal */}
      {selectedSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50"
             onClick={() => setSelectedSong(null)}>
          <Card className="max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl animate-in slide-in-from-right duration-300"
                onClick={(e) => e.stopPropagation()}>
            {/* Header with close button */}
            <CardHeader className="sticky top-0 bg-background border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Chord Progressions</CardTitle>
                  <CardDescription className="text-sm">{selectedSong.title}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedSong(null)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Piano Chords */}
              <div>
                <div className="flex items-center mb-3">
                  <Piano className="h-4 w-4 mr-2" />
                  <h4 className="font-semibold">Piano Chords</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Primary Chords</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSong.chords.piano.primary.map((chord: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {chord}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Progression</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="font-mono text-sm">{selectedSong.chords.piano.progression}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Variations</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSong.chords.piano.variations.map((chord: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {chord}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guitar Chords */}
              <div>
                <div className="flex items-center mb-3">
                  <Guitar className="h-4 w-4 mr-2" />
                  <h4 className="font-semibold">Guitar Chords</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Primary Chords</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSong.chords.guitar.primary.map((chord: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {chord}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Capo</p>
                      <p className="text-sm">
                        {selectedSong.chords.guitar.capo === 0 ? 'No capo needed' : `Capo: ${selectedSong.chords.guitar.capo}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Tuning</p>
                      <p className="text-sm">{selectedSong.chords.guitar.tuning}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Chord Diagrams</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedSong.chords.guitar.chord_diagrams).map(([chord, diagram]) => (
                        <div key={chord} className="text-center p-2 bg-muted rounded">
                          <p className="font-medium text-sm">{chord}</p>
                          <p className="font-mono text-xs">{String(diagram)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Song Structure */}
              <div>
                <div className="flex items-center mb-3">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <h4 className="font-semibold">Song Structure</h4>
                </div>
                <div className="space-y-2">
                  {Object.entries(selectedSong.song_structure).map(([section, chords]) => (
                    <div key={section} className="border-l-2 border-muted pl-3">
                      <p className="text-sm font-medium capitalize mb-1">{section}</p>
                      <div className="flex flex-wrap gap-1">
                        {(chords as string[]).map((chord: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {chord}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export { ChordCollectionManager };
