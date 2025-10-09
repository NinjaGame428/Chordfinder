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
import { ArrowLeft, Save, Loader2, Plus, Search, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

interface SimpleSongEditorProps {
  songId: string;
}

interface SongData {
  title: string;
  artist_id: string;
  artist_name?: string;
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [songData, setSongData] = useState<SongData>({
    title: '',
    artist_id: '',
    artist_name: '',
    key_signature: '',
    tempo: '',
    lyrics: '',
  });

  // Show toast notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

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

      console.log('📝 Admin: Loading song data:', {
        title: song.title,
        hasLyrics: !!lyricsText,
        lyricsLength: lyricsText?.length || 0,
        lyricsPreview: lyricsText?.substring(0, 100)
      });

      setSongData({
        title: song.title || '',
        artist_id: song.artist_id || '',
        artist_name: song.artists?.name || song.artist || '',
        key_signature: song.key_signature || '',
        tempo: song.tempo || '',
        lyrics: lyricsText,
      });
    } catch (error) {
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
      // Silent fail
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
      alert('Failed to add artist');
    }
  };

  // Save song
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const payload = {
        title: songData.title,
        artist_id: songData.artist_id,
        key_signature: songData.key_signature,
        tempo: songData.tempo ? parseInt(songData.tempo.toString()) : null,
        lyrics: songData.lyrics,
      };

      console.log('💾 Admin: Saving song:', {
        title: payload.title,
        hasLyrics: !!payload.lyrics,
        lyricsLength: payload.lyrics?.length || 0,
        lyricsPreview: payload.lyrics?.substring(0, 100)
      });

      const response = await fetch(`/api/songs/${songId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Admin: Song saved successfully:', result);
        showNotification('Song saved successfully! View it on the public page.', 'success');
        
        // Reload song data to confirm save
        await loadSongData();
        
        // Log the public URL for easy access
        console.log('🔗 Public page:', `${window.location.origin}/songs/${songId}`);
      } else {
        const errorData = await response.json();
        const errorMsg = errorData.details || errorData.error || 'Unknown error';
        showNotification(`Failed to save song: ${errorMsg}`, 'error');
      }
    } catch (error) {
      showNotification('Failed to save song', 'error');
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

          <div className="grid grid-cols-2 gap-4">
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lyrics & Chords</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Add lyrics and chords that will be displayed on the public song page
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/songs/${songId}`, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Preview Public Page
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">Formatting Guide:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">[Section Name]</code> for sections (e.g., [Verse 1], [Chorus])</li>
              <li>• Write chords on their own line above lyrics (e.g., C G Am F)</li>
              <li>• Use spaces to align chords with lyrics</li>
              <li>• Leave blank lines between sections for spacing</li>
            </ul>
          </div>

          {/* Editor */}
          <Textarea
            value={songData.lyrics}
            onChange={(e) => setSongData({ ...songData, lyrics: e.target.value })}
            placeholder="Enter lyrics and chords here...&#10;&#10;Example:&#10;[Verse 1]&#10;C          G&#10;Amazing grace, how sweet the sound&#10;Am         F&#10;That saved a wretch like me&#10;&#10;[Chorus]&#10;G          C&#10;How great thou art"
            rows={25}
            className="font-mono text-base resize-y"
            style={{
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              lineHeight: '1.8',
              fontSize: '15px',
              minHeight: '400px'
            }}
          />
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {songData.lyrics ? songData.lyrics.split('\n').length : 0} lines • {songData.lyrics ? songData.lyrics.length : 0} characters
            </span>
            <span className="text-xs">
              Changes will be visible on the public page after saving
            </span>
          </div>
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            toastType === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {toastType === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

