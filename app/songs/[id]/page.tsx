"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, User, Clock, Key, ArrowLeft, Download, Share2, Heart, Play, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import AdvancedTransposeButton from "@/components/advanced-transpose-button";
import SongRating from "@/components/song-rating";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { getSongBySlug } from "@/lib/song-data";

const SongPage = () => {
  const params = useParams();
  const songSlug = params.id as string;
  const [activeTab, setActiveTab] = useState("lyrics");
  const [currentKey, setCurrentKey] = useState("");

  // Find song by title slug
  const song = getSongBySlug(songSlug);

  // Transpose chord function
  const transposeChord = (chord: string, fromKey: string, toKey: string) => {
    const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const flatScale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    
    // Extract the base chord (without extensions)
    const chordMatch = chord.match(/^([A-G][b#]?)(.*)$/);
    if (!chordMatch) return chord;
    
    const [, baseChord, extensions] = chordMatch;
    
    // Find the index of the base chord
    let fromIndex = chromatic.indexOf(baseChord);
    if (fromIndex === -1) {
      fromIndex = flatScale.indexOf(baseChord);
    }
    if (fromIndex === -1) return chord;
    
    // Find the index of the target key
    let toIndex = chromatic.indexOf(toKey);
    if (toIndex === -1) {
      toIndex = flatScale.indexOf(toKey);
    }
    if (toIndex === -1) return chord;
    
    // Calculate the transposition interval
    const fromKeyIndex = chromatic.indexOf(fromKey);
    if (fromKeyIndex === -1) return chord;
    
    const semitones = (toIndex - fromKeyIndex + 12) % 12;
    const newChordIndex = (fromIndex + semitones) % 12;
    
    // Return the transposed chord with extensions
    return chromatic[newChordIndex] + extensions;
  };

  // Transpose chord chart
  const getTransposedChordChart = () => {
    if (!currentKey || currentKey === song?.key) {
      return song?.chordChart || '';
    }
    
    // Simple chord transposition for the chart
    return song?.chordChart.replace(/\[([^\]]+)\]/g, (match, chord) => {
      return `[${transposeChord(chord, song.key, currentKey)}]`;
    }) || '';
  };

  // Transpose chord progression
  const getTransposedChordProgression = () => {
    if (!currentKey || currentKey === song?.key) {
      return song?.chordProgression || '';
    }
    
    return song?.chordProgression.split(' - ').map(chord => 
      transposeChord(chord.trim(), song.key, currentKey)
    ).join(' - ') || '';
  };

  // Transpose chords array
  const getTransposedChords = () => {
    if (!currentKey || currentKey === song?.key) {
      return song?.chords || [];
    }
    
    return song?.chords.map(chord => 
      transposeChord(chord, song.key, currentKey)
    ) || [];
  };

  if (!song) {
    return (
      <>
        <Navbar />
        <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
          <div className="py-20 px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Song Not Found</h1>
            <p className="text-muted-foreground mb-8">The song you're looking for doesn't exist.</p>
            <Button asChild className="rounded-full">
              <Link href="/songs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Songs
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
        {/* Song Header */}
        <section className="py-20 px-6 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-8">
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/songs">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Songs
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
                  {song.title}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg">{song.artist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg">{song.tempo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg">{song.key}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <Badge className={getDifficultyColor(song.difficulty)}>
                    {song.difficulty}
                  </Badge>
                  <Badge variant="outline">{song.genre}</Badge>
                  <Badge variant="outline">{song.year}</Badge>
                  <Badge variant="outline">{song.timeSignature}</Badge>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button className="rounded-full">
                    <Play className="mr-2 h-4 w-4" />
                    Play Song
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorite
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <Music className="mr-2 h-4 w-4" />
                    Transpose
                  </Button>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <div className="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <Music className="h-24 w-24 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{song.downloads.toLocaleString()} downloads</p>
                  <p>Rating: {song.rating}/5</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Song Content */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chords">Chord Chart</TabsTrigger>
                <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
                <TabsTrigger value="info">Song Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chords" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Chord Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Chord Progression</h4>
                          <p className="text-lg font-mono bg-muted p-3 rounded">{song.chordProgression}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Chords Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {song.chords.map((chord, index) => (
                              <Badge key={index} variant="outline" className="text-lg px-3 py-1">
                                {chord}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Chord Chart</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="text-sm font-mono whitespace-pre-wrap">{song.chordChart}</pre>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Capo</h4>
                          <p>{song.capo}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Strumming Pattern</h4>
                          <p>{song.strummingPattern}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="lyrics" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Lyrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-6 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-mono">{song.lyrics}</pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="info" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Song Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Artist:</span>
                        <span>{song.artist}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span>{song.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Genre:</span>
                        <span>{song.genre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Key:</span>
                        <span>{song.key}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tempo:</span>
                        <span>{song.tempo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Signature:</span>
                        <span>{song.timeSignature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <Badge className={getDifficultyColor(song.difficulty)}>
                          {song.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {song.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Song Rating */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <SongRating 
            songId={song.id}
            songTitle={song.title}
            songArtist={song.artist}
          />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SongPage;
