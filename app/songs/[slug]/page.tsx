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
import denaMwanaChords from '@/lib/dena-mwana-chords.json';

const SongDetailsPage = () => {
  const params = useParams();
  const songSlug = params.slug;
  const [song, setSong] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to create slug from title
  const createSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    // Find the song by slug
    const foundSong = denaMwanaChords.songs.find((s: any) => 
      createSlug(s.title) === songSlug
    );
    if (foundSong) {
      setSong(foundSong);
    } else {
      console.log('Song not found for slug:', songSlug);
      console.log('Available songs:', denaMwanaChords.songs.map((s: any) => ({ 
        id: s.id, 
        title: s.title, 
        slug: createSlug(s.title) 
      })));
    }
    setIsLoading(false);
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

  if (!song) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Song not found</h1>
            <p className="text-muted-foreground mb-4">Song slug: {songSlug}</p>
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
                      <p className="text-lg">{denaMwanaChords.artist}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Language</p>
                      <p className="text-lg">English</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                      <Badge className={getDifficultyColor(song.difficulty)}>
                        {song.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Key</p>
                      <Badge className={getKeyColor(song.key)}>
                        {song.key}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">BPM</p>
                      <p className="text-lg">{song.bpm}</p>
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

              {/* Chord Progressions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="h-5 w-5 mr-2" />
                    Chord Progressions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="piano" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="piano">Piano</TabsTrigger>
                      <TabsTrigger value="guitar">Guitar</TabsTrigger>
                    </TabsList>
                    <TabsContent value="piano" className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Primary Chords</p>
                        <div className="flex flex-wrap gap-2">
                          {song.chords.piano.primary.map((chord: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-sm">
                              {chord}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Progression</p>
                        <p className="text-lg font-mono bg-muted p-3 rounded">
                          {song.chords.piano.progression}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Variations</p>
                        <div className="flex flex-wrap gap-2">
                          {song.chords.piano.variations.map((chord: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              {chord}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="guitar" className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Primary Chords</p>
                        <div className="flex flex-wrap gap-2">
                          {song.chords.guitar.primary.map((chord: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-sm">
                              {chord}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Capo</p>
                        <p className="text-lg">
                          {song.chords.guitar.capo === 0 ? 'No capo needed' : `Capo: ${song.chords.guitar.capo}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Tuning</p>
                        <p className="text-lg">{song.chords.guitar.tuning}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Chord Diagrams</p>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(song.chords.guitar.chord_diagrams).map(([chord, diagram]) => (
                            <div key={chord} className="text-center">
                              <p className="font-medium">{chord}</p>
                              <p className="font-mono text-sm bg-muted p-2 rounded">{String(diagram)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Song Structure */}
              <Card>
                <CardHeader>
                  <CardTitle>Song Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(song.song_structure).map(([section, chords]) => (
                      <div key={section}>
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
                </CardContent>
              </Card>

              {/* Lyrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="h-5 w-5 mr-2" />
                    Lyrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {song.lyrics ? (
                    <div className="space-y-6">
                      {song.lyrics.map((verse: any, index: number) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <h4 className="font-semibold text-sm text-primary">{verse.section}</h4>
                          </div>
                          <div className="border-l-2 border-muted pl-4 space-y-2">
                            {verse.lines.map((line: any, lineIndex: number) => (
                              <div key={lineIndex} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-12">
                                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                                    {line.chord || ''}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm leading-relaxed">{line.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Lyrics not available for this song</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        We're working on adding lyrics to all songs in our collection.
                      </p>
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