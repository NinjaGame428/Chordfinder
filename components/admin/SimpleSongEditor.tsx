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
import { ArrowLeft, Save, Loader2, Plus, Search, CheckCircle2, XCircle, ExternalLink, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);
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

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

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
      if (!response.ok) throw new Error('Failed to load song');

      const data = await response.json();
      const song = data.song || data;

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
          // Keep original
        }
      }

      console.log('📝 Admin: Loaded song data:', {
        id: song.id,
        title: song.title,
        lyricsLength: lyricsText.length,
        lyricsPreview: lyricsText.substring(0, 100) + '...',
        hasArtist: !!song.artist_id
      });

      setSongData({
        title: song.title || '',
        artist_id: song.artist_id || '',
        artist_name: song.artists?.name || song.artist_name || '',
        key_signature: song.key_signature || '',
        tempo: song.tempo || '',
        lyrics: lyricsText,
      });

      if (song.artists?.name) {
        setArtistSearchQuery(song.artists.name);
      }
    } catch (error) {
      console.error('Error loading song:', error);
      setLoadError('Failed to load song data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadArtists = async () => {
    try {
      const response = await fetch('/api/artists');
      if (response.ok) {
        const data = await response.json();
        const artistsList = data.artists || [];
        setArtists(artistsList);
        setFilteredArtists(artistsList);
        console.log('✅ Loaded artists:', artistsList.length);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to load artists:', response.status, errorData);
        showNotification('Failed to load artists from database', 'error');
      }
    } catch (error) {
      console.error('❌ Error loading artists:', error);
      showNotification('Failed to load artists from database', 'error');
    }
  };

  useEffect(() => {
    loadSongData();
    loadArtists();
  }, [songId]);

  useEffect(() => {
    if (artistSearchQuery.trim() === '') {
      // Show all artists when search is empty
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter((artist) =>
        artist.name.toLowerCase().includes(artistSearchQuery.toLowerCase())
      );
      setFilteredArtists(filtered);
    }
  }, [artistSearchQuery, artists]);

  // Initialize search query with artist name when song loads
  useEffect(() => {
    if (songData.artist_name && !artistSearchQuery) {
      setArtistSearchQuery(songData.artist_name);
    }
  }, [songData.artist_name]);

  const handleAddArtist = async () => {
    if (!newArtistName.trim()) return;

    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newArtistName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add artist');
      }

      const data = await response.json();
      const newArtist = data.artist;

      // Refresh artists list to ensure we have the latest data
      await loadArtists();
      
      setSongData({ ...songData, artist_id: newArtist.id, artist_name: newArtist.name });
      setArtistSearchQuery(newArtist.name);
      setNewArtistName('');
      setIsAddArtistModalOpen(false);
      showNotification('Artist added successfully!', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Failed to add artist', 'error');
    }
  };

  const handleSave = async () => {
    if (!songData.title.trim()) {
      showNotification('Please enter a song title', 'error');
      return;
    }

    if (!songData.artist_id) {
      showNotification('Please select an artist', 'error');
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        title: songData.title.trim(),
        artist_id: songData.artist_id,
        key_signature: songData.key_signature && songData.key_signature.trim() !== '' ? songData.key_signature.trim() : null,
        tempo: songData.tempo ? parseInt(songData.tempo.toString()) : null,
        lyrics: songData.lyrics.trim() || '',
      };

      console.log('💾 Admin: Saving song with payload:', {
        ...payload,
        lyricsLength: payload.lyrics.length,
        lyricsPreview: payload.lyrics.substring(0, 100) + '...',
        lyricsType: typeof payload.lyrics
      });

      const response = await fetch(`/api/songs/${songId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to save song');
      }

      const data = await response.json();
      console.log('✅ Admin: Song saved successfully, response:', {
        songId: data.song?.id,
        title: data.song?.title,
        lyricsLength: data.song?.lyrics?.length || 0,
        lyricsType: typeof data.song?.lyrics,
        hasLyrics: !!data.song?.lyrics
      });

      // Verify the saved data matches what we sent
      if (data.song) {
        console.log('✅ Verification - Saved song data:', {
          title: data.song.title,
          artist_id: data.song.artist_id,
          artist_name: data.song.artists?.name,
          key_signature: data.song.key_signature,
          tempo: data.song.tempo,
          lyricsLength: data.song.lyrics?.length || 0,
          updated_at: data.song.updated_at
        });
        
        // Verify critical fields were saved
        if (data.song.title !== payload.title.trim()) {
          console.warn('⚠️ Warning: Title mismatch!');
        }
        if (data.song.artist_id !== payload.artist_id) {
          console.warn('⚠️ Warning: Artist ID mismatch!');
        }
        if (data.song.lyrics !== payload.lyrics) {
          console.warn('⚠️ Warning: Lyrics mismatch!', {
            savedLength: data.song.lyrics?.length || 0,
            sentLength: payload.lyrics.length
          });
        }
      }

      const publicUrl = `${window.location.origin}/songs/${songId}`;
      console.log('🔗 Public page:', publicUrl);

      showNotification('Song saved successfully! Changes will be visible on the public page.', 'success');

      console.log('🔄 Reloading song data from database...');
      await loadSongData();
      
      // Notify other pages that a song was updated (so artist pages can refresh song counts)
      window.dispatchEvent(new CustomEvent('songUpdated', { 
        detail: { 
          artistId: data.song?.artist_id,
          songId: songId 
        } 
      }));
      
      // Also use localStorage for cross-tab communication
      localStorage.setItem('songUpdated', JSON.stringify({
        artistId: data.song?.artist_id,
        songId: songId,
        timestamp: Date.now()
      }));
      
      // Force a small delay to ensure database write is complete
      setTimeout(() => {
        console.log('✅ Song update complete. Changes should now be visible across the site.');
      }, 500);
    } catch (error: any) {
      console.error('❌ Save error:', error);
      showNotification(error.message || 'Failed to save song', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewPublicPage = () => {
    const publicUrl = `${window.location.origin}/songs/${songId}`;
    window.open(publicUrl, '_blank');
  };

  const lineCount = songData.lyrics.split('\n').length;
  const charCount = songData.lyrics.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Song</h2>
              <p className="text-muted-foreground mb-4">{loadError}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-4 z-50 animate-in slide-in-from-top-2">
          <Alert className={`${toastType === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2">
              {toastType === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <AlertDescription className={toastType === 'success' ? 'text-green-800' : 'text-red-800'}>
                {toastMessage}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Song</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreviewPublicPage}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview Public Page
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Song Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={songData.title}
                onChange={(e) => setSongData({ ...songData, title: e.target.value })}
                placeholder="Enter song title"
              />
            </div>

            {/* Artist */}
            <div>
              <Label htmlFor="artist">Artist *</Label>
              {songData.artist_id && songData.artist_name && (
                <p className="text-xs text-muted-foreground mb-2">
                  Selected: <span className="font-medium">{songData.artist_name}</span>
                </p>
              )}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="artist"
                    value={artistSearchQuery}
                    onChange={(e) => {
                      setArtistSearchQuery(e.target.value);
                      setShowArtistDropdown(true); // Show dropdown when typing
                    }}
                    onFocus={() => {
                      // Show dropdown when input is focused
                      setShowArtistDropdown(true);
                      if (artistSearchQuery.trim() === '' && artists.length > 0) {
                        setFilteredArtists(artists);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding dropdown to allow clicks
                      setTimeout(() => setShowArtistDropdown(false), 200);
                    }}
                    placeholder={songData.artist_name || "Search for an artist..."}
                    className="pl-9"
                  />
                  {showArtistDropdown && (filteredArtists.length > 0 || artists.length > 0) && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                      {(artistSearchQuery.trim() === '' ? artists : filteredArtists).map((artist) => (
                        <div
                          key={artist.id}
                          className={`px-4 py-2 hover:bg-muted cursor-pointer ${
                            songData.artist_id === artist.id ? 'bg-muted font-medium' : ''
                          }`}
                          onMouseDown={(e) => {
                            // Prevent input blur when clicking
                            e.preventDefault();
                          }}
                          onClick={() => {
                            setSongData({ ...songData, artist_id: artist.id, artist_name: artist.name });
                            setArtistSearchQuery(artist.name);
                            setFilteredArtists(artists); // Reset filtered list
                            setShowArtistDropdown(false); // Hide dropdown after selection
                          }}
                        >
                          {artist.name}
                          {songData.artist_id === artist.id && (
                            <span className="ml-2 text-xs text-muted-foreground">(selected)</span>
                          )}
                        </div>
                      ))}
                      {artistSearchQuery.trim() !== '' && filteredArtists.length === 0 && (
                        <div className="px-4 py-2 text-sm text-muted-foreground text-center">
                          No artists found matching "{artistSearchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                  {!showArtistDropdown && artists.length === 0 && !artistSearchQuery && (
                    <p className="text-xs text-muted-foreground mt-1">
                      No artists found. Click + to add one.
                    </p>
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddArtistModalOpen(true)}
                  title="Add new artist"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {!songData.artist_id && (
                <p className="text-xs text-destructive mt-1">Please select an artist from the dropdown</p>
              )}
            </div>

            {/* Key & Tempo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="key">Key Signature</Label>
                <Select
                  value={songData.key_signature && songData.key_signature.trim() !== '' ? songData.key_signature : '__none__'}
                  onValueChange={(value) => {
                    // Handle special "none" value
                    if (value === '__none__') {
                      setSongData({ ...songData, key_signature: '' });
                    } else {
                      setSongData({ ...songData, key_signature: value });
                    }
                  }}
                >
                  <SelectTrigger id="key">
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="C#">C#</SelectItem>
                    <SelectItem value="Db">Db</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="D#">D#</SelectItem>
                    <SelectItem value="Eb">Eb</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                    <SelectItem value="F#">F#</SelectItem>
                    <SelectItem value="Gb">Gb</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="G#">G#</SelectItem>
                    <SelectItem value="Ab">Ab</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="A#">A#</SelectItem>
                    <SelectItem value="Bb">Bb</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="Am">Am</SelectItem>
                    <SelectItem value="Bm">Bm</SelectItem>
                    <SelectItem value="Cm">Cm</SelectItem>
                    <SelectItem value="Dm">Dm</SelectItem>
                    <SelectItem value="Em">Em</SelectItem>
                    <SelectItem value="Fm">Fm</SelectItem>
                    <SelectItem value="Gm">Gm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
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
              <CardTitle>Lyrics & Chords</CardTitle>
              <div className="text-sm text-muted-foreground">
                {lineCount} lines • {charCount} characters
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formatting Guide */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Formatting Guide:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Use <code>[Section Name]</code> for sections (e.g., [Verse 1], [Chorus])</li>
                  <li>Write chords on their own line (e.g., C G Am F)</li>
                  <li>Use spaces to align chords with lyrics</li>
                  <li>Leave blank lines between sections for better readability</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Textarea
              value={songData.lyrics}
              onChange={(e) => setSongData({ ...songData, lyrics: e.target.value })}
              placeholder={`[Verse 1]\nC        G        Am       F\nAmazing grace, how sweet the sound\n\n[Chorus]\nC        G        Am       F\nHow great is our God`}
              rows={25}
              className="font-mono text-sm resize-y"
              style={{ minHeight: '400px' }}
            />

            <p className="text-xs text-muted-foreground">
              Changes will be visible on the public page after saving
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Artist Modal */}
      <Dialog open={isAddArtistModalOpen} onOpenChange={setIsAddArtistModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Artist</DialogTitle>
            <DialogDescription>Enter the name of the artist to add to the database.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newArtistName">Artist Name</Label>
            <Input
              id="newArtistName"
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddArtistModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddArtist} disabled={!newArtistName.trim()}>
              Add Artist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
