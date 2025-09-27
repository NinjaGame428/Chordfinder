"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, User, Clock, Key, ArrowLeft, Download, Share2, Heart, Play } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import AdvancedTransposeButton from "@/components/advanced-transpose-button";
import SongRating from "@/components/song-rating";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const SongPage = () => {
  const params = useParams();
  const songSlug = params.id as string;
  const [activeTab, setActiveTab] = useState("chords");
  const [currentKey, setCurrentKey] = useState("");

  const songs = {
    1: {
      id: 1,
      title: "What A Beautiful Name",
      artist: "Hillsong Worship",
      key: "E Major",
      difficulty: "Medium",
      year: "2016",
      tempo: "75 BPM",
      timeSignature: "4/4",
      genre: "Contemporary Worship",
      chords: ["E", "C#m", "A", "B"],
      chordProgression: "E - C#m - A - B",
      lyrics: `You were the Word at the beginning
One with God the Lord Most High
Your hidden glory in creation
Now revealed in You our Christ

What a beautiful Name it is
What a beautiful Name it is
The Name of Jesus Christ my King

What a beautiful Name it is
Nothing compares to this
What a beautiful Name it is
The Name of Jesus

You didn't want heaven without us
So Jesus You brought heaven down
My sin was great, Your love was greater
What could separate us now

What a wonderful Name it is
What a wonderful Name it is
The Name of Jesus Christ my King

What a wonderful Name it is
Nothing compares to this
What a wonderful Name it is
The Name of Jesus

Death could not hold You
The veil tore before You
You silenced the boast of sin and grave
The heavens are roaring
The praise of Your glory
For You are raised to life again

You have no rival
You have no equal
Now and forever God You reign
Yours is the Kingdom
Yours is the glory
Yours is the Name above all names

What a powerful Name it is
What a powerful Name it is
The Name of Jesus Christ my King

What a powerful Name it is
Nothing can stand against
What a powerful Name it is
The Name of Jesus`,
      chordChart: `E           C#m         A           B
You were the Word at the beginning
E           C#m         A           B
One with God the Lord Most High
E           C#m         A           B
Your hidden glory in creation
E           C#m         A           B
Now revealed in You our Christ

E           C#m         A           B
What a beautiful Name it is
E           C#m         A           B
What a beautiful Name it is
E           C#m         A           B
The Name of Jesus Christ my King`,
      capo: "No capo needed",
      strummingPattern: "Down, Down, Up, Down, Up, Down",
      tags: ["Worship", "Contemporary", "Popular"],
      downloads: 15420,
      rating: 4.8
    },
    2: {
      id: 2,
      title: "Cornerstone",
      artist: "Hillsong Worship",
      key: "G Major",
      difficulty: "Easy",
      year: "2012",
      tempo: "80 BPM",
      timeSignature: "4/4",
      genre: "Contemporary Worship",
      chords: ["G", "C", "D", "Em"],
      chordProgression: "G - C - D - Em",
      lyrics: `My hope is built on nothing less
Than Jesus' blood and righteousness
I dare not trust the sweetest frame
But wholly trust in Jesus' name

Christ alone, cornerstone
Weak made strong in the Savior's love
Through the storm, He is Lord
Lord of all

When darkness seems to hide His face
I rest on His unchanging grace
In every high and stormy gale
My anchor holds within the veil
My anchor holds within the veil

Christ alone, cornerstone
Weak made strong in the Savior's love
Through the storm, He is Lord
Lord of all

When He shall come with trumpet sound
Oh, may I then in Him be found
Dressed in His righteousness alone
Faultless stand before the throne

Christ alone, cornerstone
Weak made strong in the Savior's love
Through the storm, He is Lord
Lord of all`,
      chordChart: `G           C           D           Em
My hope is built on nothing less
G           C           D           Em
Than Jesus' blood and righteousness
G           C           D           Em
I dare not trust the sweetest frame
G           C           D           Em
But wholly trust in Jesus' name

G           C           D           Em
Christ alone, cornerstone
G           C           D           Em
Weak made strong in the Savior's love
G           C           D           Em
Through the storm, He is Lord
G           C           D           Em
Lord of all`,
      capo: "No capo needed",
      strummingPattern: "Down, Down, Up, Down, Up, Down",
      tags: ["Worship", "Contemporary", "Classic"],
      downloads: 12350,
      rating: 4.7
    }
  };

  // Find song by title slug
  const song = Object.values(songs).find(s => 
    s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === songSlug
  );

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
