"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Music, User, ExternalLink, Search, Star, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const ArtistPage = () => {
  const params = useParams();
  const artistId = parseInt(params.id as string);
  const [searchQuery, setSearchQuery] = useState("");

  const artists = {
    1: {
      id: 1,
      name: "Hillsong Worship",
      country: "Australia",
      founded: "1992",
      genre: "Contemporary Worship",
      songs: 45,
      rating: 4.8,
      description: "One of the world's most influential worship bands, known for songs like 'What A Beautiful Name' and 'Cornerstone'.",
      popularSongs: ["What A Beautiful Name", "Cornerstone", "Oceans", "Who You Say I Am"],
      image: "/artists/hillsong.jpg"
    },
    2: {
      id: 2,
      name: "Bethel Music",
      country: "USA",
      founded: "2001",
      genre: "Contemporary Worship",
      songs: 38,
      rating: 4.7,
      description: "A worship movement from Bethel Church in Redding, California, known for powerful worship songs.",
      popularSongs: ["Goodness of God", "Raise a Hallelujah", "No Longer Slaves", "King of My Heart"],
      image: "/artists/bethel.jpg"
    },
    3: {
      id: 3,
      name: "Elevation Worship",
      country: "USA",
      founded: "2007",
      genre: "Contemporary Worship",
      songs: 42,
      rating: 4.6,
      description: "From Elevation Church in Charlotte, North Carolina, known for energetic and powerful worship music.",
      popularSongs: ["Graves Into Gardens", "Do It Again", "Here As In Heaven", "O Come to the Altar"],
      image: "/artists/elevation.jpg"
    },
    4: {
      id: 4,
      name: "Sinach",
      country: "Nigeria",
      founded: "2005",
      genre: "Gospel",
      songs: 28,
      rating: 4.9,
      description: "Nigerian gospel singer and songwriter, known for powerful worship songs that have gained international recognition.",
      popularSongs: ["Way Maker", "I Know Who I Am", "The Name of Jesus", "Great Are You Lord"],
      image: "/artists/sinach.jpg"
    },
    5: {
      id: 5,
      name: "Chris Tomlin",
      country: "USA",
      founded: "1998",
      genre: "Contemporary Christian",
      songs: 52,
      rating: 4.8,
      description: "Grammy-winning worship leader and songwriter, known for songs that have become modern worship standards.",
      popularSongs: ["How Great Is Our God", "Amazing Grace (My Chains Are Gone)", "Good Good Father", "Our God"],
      image: "/artists/chris-tomlin.jpg"
    }
  };

  const artist = artists[artistId as keyof typeof artists];

  if (!artist) {
    return (
      <>
        <Navbar />
        <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
          <div className="py-20 px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Artist Not Found</h1>
            <p className="text-muted-foreground mb-8">The artist you're looking for doesn't exist.</p>
            <Button asChild className="rounded-full">
              <Link href="/artists">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Artists
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const artistSongs = [
    {
      id: 1,
      title: "What A Beautiful Name",
      key: "E Major",
      difficulty: "Medium",
      year: "2016",
      tempo: "75 BPM",
      chords: ["E", "C#m", "A", "B"],
      lyrics: "You were the Word at the beginning...",
      href: "/songs/1"
    },
    {
      id: 2,
      title: "Cornerstone",
      key: "G Major",
      difficulty: "Easy",
      year: "2012",
      tempo: "80 BPM",
      chords: ["G", "C", "D", "Em"],
      lyrics: "My hope is built on nothing less...",
      href: "/songs/2"
    },
    {
      id: 3,
      title: "Oceans (Where Feet May Fail)",
      key: "D Major",
      difficulty: "Medium",
      year: "2013",
      tempo: "70 BPM",
      chords: ["D", "A", "Bm", "G"],
      lyrics: "You call me out upon the waters...",
      href: "/songs/3"
    },
    {
      id: 4,
      title: "Who You Say I Am",
      key: "C Major",
      difficulty: "Easy",
      year: "2018",
      tempo: "85 BPM",
      chords: ["C", "Am", "F", "G"],
      lyrics: "Who the Son sets free...",
      href: "/songs/4"
    },
    {
      id: 5,
      title: "King of Kings",
      key: "G Major",
      difficulty: "Medium",
      year: "2019",
      tempo: "78 BPM",
      chords: ["G", "C", "D", "Em"],
      lyrics: "In the darkness we were waiting...",
      href: "/songs/5"
    }
  ];

  const filteredSongs = artistSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Artist Header */}
        <section className="py-20 px-6 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-8">
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/artists">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Artists
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2">
                <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
                  {artist.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg">{artist.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg">Founded {artist.founded}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-lg font-semibold">{artist.rating}</span>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  {artist.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {artist.genre}
                  </Badge>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {artist.songs} Songs
                  </Badge>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <div className="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <Music className="h-24 w-24 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Songs Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-4">
                Songs by {artist.name}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Explore all songs from this artist with chord charts and resources
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search songs by title or key..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSongs.map((song) => (
                <Card key={song.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {song.title}
                        </CardTitle>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Music className="h-4 w-4 mr-1" />
                          {song.year} • {song.tempo}
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {song.key}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(song.difficulty)}>
                          {song.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {song.chords.join(" • ")}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {song.lyrics}
                      </p>
                      
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                        asChild
                      >
                        <Link href={song.href}>
                          <Music className="mr-2 h-4 w-4" />
                          View Full Song
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSongs.length === 0 && (
              <div className="text-center py-12">
                <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No songs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ArtistPage;
