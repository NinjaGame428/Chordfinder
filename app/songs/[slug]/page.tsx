'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, Music, Guitar, Piano, ExternalLink, Heart } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import YouTubePlayer from '@/components/youtube-player';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const SongDetailsPage = () => {
  const params = useParams();
  const songSlug = params.slug;
  const [song, setSong] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to create slug from title
  const createSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!supabase) {
          throw new Error('Database connection not available');
        }

        console.log('🔍 Fetching song with slug:', songSlug);

        // Try to fetch song by ID if slug looks like a UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(songSlug as string);
        
        let songsData = null;
        let songsError = null;

        if (isUUID) {
          // Fetch by ID directly (fastest)
          const result = await supabase
            .from('songs')
            .select(`
              *,
              artists (
                id,
                name
              )
            `)
            .eq('id', songSlug)
            .single();
          
          songsData = result.data ? [result.data] : null;
          songsError = result.error;
          console.log('📌 Fetched by ID');
        } else {
          // Try slug column first
          const result = await supabase
            .from('songs')
            .select(`
              *,
              artists (
                id,
                name
              )
            `)
            .eq('slug', songSlug);
          
          songsData = result.data;
          songsError = result.error;

          // If slug column doesn't exist or no results, try title matching with ILIKE (case-insensitive)
          if ((songsError && songsError.message.includes('column songs.slug does not exist')) || 
              (!songsData || songsData.length === 0)) {
            console.log('🔄 Trying title match...');
            
            // Convert slug back to title format for matching
            const titleFromSlug = (songSlug as string)
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            const titleResult = await supabase
              .from('songs')
              .select(`
                *,
                artists (
                  id,
                  name
                )
              `)
              .ilike('title', `%${titleFromSlug}%`)
              .limit(1);
            
            songsData = titleResult.data;
            songsError = titleResult.error;
          }
        }

        if (songsError && !songsError.message.includes('column songs.slug does not exist')) {
          throw new Error(`Database error: ${songsError.message}`);
        }

        if (songsData && songsData.length > 0) {
          const foundSong = songsData[0];
          console.log('✅ Song loaded:', {
            id: foundSong.id,
            title: foundSong.title,
            hasLyrics: !!foundSong.lyrics,
            lyricsLength: foundSong.lyrics?.length || 0
          });
          setSong(foundSong);
        } else {
          console.error('❌ Song not found for slug:', songSlug);
          setError(`Song not found`);
        }
      } catch (err) {
        console.error('❌ Error fetching song:', err);
        setError(err instanceof Error ? err.message : 'Failed to load song');
      } finally {
        setIsLoading(false);
      }
    };

    if (songSlug) {
      fetchSong();
    }
  }, [songSlug]);

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

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading song details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!song && !isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Song not found</h1>
            <p className="text-muted-foreground mb-4">Song slug: {songSlug}</p>
            {error && (
              <p className="text-red-500 mb-4">Error: {error}</p>
            )}
            <Link href="/songs">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Songs
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/songs">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Songs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Song Info - Moved to Top Left */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-3xl mb-2">{song.title}</CardTitle>
                      {song.english_title && (
                        <CardDescription className="text-lg">{song.english_title}</CardDescription>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Artist</p>
                      <p className="text-lg">{song.artists?.name || song.artist || 'Unknown Artist'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Language</p>
                      <p className="text-lg">English</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                      <Badge className={getDifficultyColor(song.difficulty || 'Medium')}>
                        {song.difficulty || 'Medium'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Key</p>
                      <Badge className={getKeyColor(song.key_signature || song.key || 'C')}>
                        {song.key_signature || song.key || 'C'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">BPM</p>
                      <p className="text-lg">{song.tempo || song.bpm || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Year</p>
                      <p className="text-lg">{song.year || 'N/A'}</p>
                    </div>
                  </div>

                  {song.album && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground">Album</p>
                      <p className="text-lg">{song.album}</p>
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* Lyrics & Chords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Guitar className="h-5 w-5 mr-2" />
                      Lyrics & Chords
                    </div>
                    {song.key_signature && (
                      <Badge variant="outline" className="text-sm">
                        Key: {song.key_signature}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Follow along with the chords and lyrics below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {song.lyrics && song.lyrics.trim().length > 0 ? (
                    <div className="space-y-6">
                      {/* Info banner */}
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                        <p className="flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          <span>Lyrics and chords added by admin • {song.lyrics.split('\n').length} lines</span>
                        </p>
                      </div>
                      
                      {/* Render lyrics with proper formatting */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="font-mono text-base leading-loose whitespace-pre-wrap">
                          {song.lyrics.split('\n').map((line: string, index: number) => {
                            // Check if line is a section header (e.g., [Verse 1], [Chorus])
                            const isSectionHeader = line.trim().match(/^\[.*\]$/);
                            // Check if line contains chords (typically uppercase letters and symbols)
                            const isChordLine = line.trim().match(/^[A-G#b/\s]+$/) && line.trim().length > 0 && !isSectionHeader;
                            
                            if (isSectionHeader) {
                              return (
                                <div key={index} className="mt-6 mb-3 first:mt-0">
                                  <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-md font-semibold text-sm">
                                    {line.trim().replace(/[\[\]]/g, '')}
                                  </span>
                                </div>
                              );
                            } else if (isChordLine) {
                              return (
                                <div key={index} className="text-blue-600 dark:text-blue-400 font-bold tracking-wide">
                                  {line}
                                </div>
                              );
                            } else if (line.trim() === '') {
                              return <div key={index} className="h-4" />;
                            } else {
                              return (
                                <div key={index} className="text-slate-700 dark:text-slate-300">
                                  {line}
                                </div>
                              );
                            }
                          })}
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="flex flex-wrap gap-4 pt-4 border-t">
                        {song.tempo && (
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Tempo: <span className="font-semibold text-foreground">{song.tempo} BPM</span>
                            </span>
                          </div>
                        )}
                        {song.key_signature && (
                          <div className="flex items-center gap-2">
                            <Piano className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Key: <span className="font-semibold text-foreground">{song.key_signature}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
                      <Guitar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium text-muted-foreground mb-2">
                        No lyrics added yet
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        An admin needs to add lyrics and chords for this song in the admin dashboard.
                      </p>
                      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                        <Music className="h-3 w-3" />
                        <span>Admin Dashboard → Songs → Edit → Add Lyrics</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sticky YouTube Video Player - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                {song.youtube_id ? (
                  <YouTubePlayer 
                    videoId={song.youtube_id}
                    title={song.title}
                    onTimeUpdate={(time) => {
                      // This can be used to highlight current lyrics section
                      console.log('Current time:', time);
                    }}
                  />
                ) : (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Play className="h-5 w-5 mr-2" />
                        Play Along
                      </CardTitle>
                      <CardDescription>
                        No video available for this song
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">No video available</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SongDetailsPage;