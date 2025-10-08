'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Save, Loader2, Plus, Search } from 'lucide-react';

interface SimpleSongEditorProps {
  songId: string;
}

interface SongData {
  title: string;
  artist_id: string;
  artist_name?: string;
  genre: string;
  key_signature: string;
  tempo: number | string;
  lyrics: string;
}

export const SimpleSongEditor: React.FC<SimpleSongEditorProps> = ({ songId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Array<{ id: string; name: string }>>([]);
  const [filteredArtists, setFilteredArtists] = useState<Array<{ id: string; name: string }>>([]);
  const [artistSearchQuery, setArtistSearchQuery] = useState('');
  const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
  const [newArtistName, setNewArtistName] = useState('');
  const [songData, setSongData] = useState<SongData>({
    title: '',
    artist_id: '',
    artist_name: '',
    genre: '',
    key_signature: '',
    tempo: '',
    lyrics: '',
  });

  // Load song data
  const loadSongData = async () => {
    if (!songId || songId === 'null' || songId === 'undefined' || songId === '{songId}') {
      setLoadError('Invalid song ID');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);

      const response = await fetch(`/api/songs/${songId}`);
      if (!response.ok) {
        throw new Error('Failed to load song');
      }

      const data = await response.json();
      const song = data.song || data;

      // Transform lyrics if it's JSON
      let lyricsText = song.lyrics || '';
      if (typeof song.lyrics === 'string' && song.lyrics.startsWith('[')) {
        try {
          const sections = JSON.parse(song.lyrics);
          if (Array.isArray(sections)) {
            lyricsText = sections
              .map((section: any) => `[${section.label || section.type}]\n${section.content}`)
              .join('\n\n');
          }
        } catch (e) {
          // Keep original lyrics if parsing fails
        }
      }

      setSongData({
        title: song.title || '',
        artist_id: song.artist_id || '',
        artist_name: song.artists?.name || song.artist || '',
        genre: song.genre || '',
        key_signature: song.key_signature || '',
        tempo: song.tempo || '',
        lyrics: lyricsText,
      });
    } catch (error) {
      console.error('Error loading song:', error);
      setLoadError('Failed to load song data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load artists
  const loadArtists = async () => {
    try {
      const response = await fetch('/api/artists');
      if (response.ok) {
        const data = await response.json();
        setArtists(data.artists || []);
        setFilteredArtists(data.artists || []);
      }
    } catch (error) {
      console.error('Error loading artists:', error);
    }
  };

  // Filter artists based on search
  useEffect(() => {
    if (artistSearchQuery) {
      const filtered = artists.filter(artist =>
        artist.name.toLowerCase().includes(artistSearchQuery.toLowerCase())
      );
      setFilteredArtists(filtered);
    } else {
      setFilteredArtists(artists);
    }
  }, [artistSearchQuery, artists]);

  // Add new artist
  const handleAddArtist = async () => {
    if (!newArtistName.trim()) {
      alert('Please enter an artist name');
      return;
    }

    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newArtistName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Artist added successfully!');
        setIsAddArtistModalOpen(false);
        setNewArtistName('');
        await loadArtists();
        // Auto-select the new artist
        if (data.artist) {
          setSongData({ ...songData, artist_id: data.artist.id });
        }
      } else {
        const error = await response.json();
        alert(`Failed to add artist: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding artist:', error);
      alert('Failed to add artist');
    }
  };

  // Save song
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch(`/api/songs/${songId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: songData.title,
          artist_id: songData.artist_id,
          genre: songData.genre,
          key_signature: songData.key_signature,
          tempo: songData.tempo ? parseInt(songData.tempo.toString()) : null,
          lyrics: songData.lyrics,
        }),
      });

      if (response.ok) {
        alert('Song saved successfully!');
      } else {
        alert('Failed to save song');
      }
    } catch (error) {
      console.error('Error saving song:', error);
      alert('Failed to save song');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadSongData();
    loadArtists();
  }, [songId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading song...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{loadError}</p>
          <Button onClick={() => router.push('/admin/songs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/songs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Song</h1>
            <p className="text-sm text-muted-foreground">
              {songData.title || 'Untitled Song'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Song Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Song Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={songData.title}
              onChange={(e) => setSongData({ ...songData, title: e.target.value })}
              placeholder="Song title"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="artist">Artist</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddArtistModalOpen(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add New
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search artists..."
                value={artistSearchQuery}
                onChange={(e) => setArtistSearchQuery(e.target.value)}
                className="pl-10 mb-2"
              />
            </div>
            <select
              id="artist"
              value={songData.artist_id}
              onChange={(e) => setSongData({ ...songData, artist_id: e.target.value })}
              className="px-3 py-2 border rounded-md bg-background max-h-40"
              size={5}
            >
              <option value="">Select an artist</option>
              {filteredArtists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
            {filteredArtists.length === 0 && artistSearchQuery && (
              <p className="text-sm text-muted-foreground">
                No artists found. Click "Add New" to create one.
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={songData.genre}
                onChange={(e) => setSongData({ ...songData, genre: e.target.value })}
                placeholder="e.g., Gospel"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={songData.key_signature}
                onChange={(e) => setSongData({ ...songData, key_signature: e.target.value })}
                placeholder="e.g., C"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tempo">Tempo (BPM)</Label>
              <Input
                id="tempo"
                type="number"
                value={songData.tempo}
                onChange={(e) => setSongData({ ...songData, tempo: e.target.value })}
                placeholder="e.g., 120"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lyrics Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Lyrics & Chords</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={songData.lyrics}
            onChange={(e) => setSongData({ ...songData, lyrics: e.target.value })}
            placeholder="Enter lyrics and chords here...&#10;&#10;Example:&#10;[Verse 1]&#10;C          G&#10;Amazing grace, how sweet the sound&#10;Am         F&#10;That saved a wretch like me"
            rows={20}
            className="font-mono text-base"
            style={{
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              lineHeight: '1.8',
              fontSize: '15px'
            }}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Use square brackets for sections (e.g., [Verse 1], [Chorus]) and write chords above lyrics.
          </p>
        </CardContent>
      </Card>

      {/* Save Button at Bottom */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Add Artist Modal */}
      <Dialog open={isAddArtistModalOpen} onOpenChange={setIsAddArtistModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Artist</DialogTitle>
            <DialogDescription>
              Enter the name of the artist you want to add
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-artist-name">Artist Name</Label>
              <Input
                id="new-artist-name"
                value={newArtistName}
                onChange={(e) => setNewArtistName(e.target.value)}
                placeholder="Enter artist name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddArtist();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddArtistModalOpen(false);
              setNewArtistName('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddArtist}>
              <Plus className="h-4 w-4 mr-2" />
              Add Artist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

