"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, User, Calendar, MapPin, ExternalLink, Star } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import EnhancedSearch from "@/components/enhanced-search";
import Link from "next/link";
import React, { useState } from "react";

const ArtistsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedArtists, setDisplayedArtists] = useState(12);

  const artists = [
    {
      id: 1,
      name: "Hillsong Worship",
      country: "Australia",
      founded: "1992",
      genre: "Contemporary Worship",
      songs: 45,
      rating: 4.8,
      description: "One of the world's most influential worship bands, known for songs like 'What A Beautiful Name' and 'Cornerstone'.",
      popularSongs: [
        { id: 1, title: "What A Beautiful Name", category: "Contemporary" },
        { id: 2, title: "Cornerstone", category: "Contemporary" },
        { id: 3, title: "Oceans", category: "Contemporary" },
        { id: 4, title: "Who You Say I Am", category: "Contemporary" }
      ],
      image: "/artists/hillsong.jpg"
    },
    {
      id: 2,
      name: "Bethel Music",
      country: "USA",
      founded: "2001",
      genre: "Contemporary Worship",
      songs: 38,
      rating: 4.7,
      description: "A worship movement from Bethel Church in Redding, California, known for powerful worship songs.",
      popularSongs: [
        { id: 5, title: "Goodness of God", category: "Contemporary" },
        { id: 6, title: "Raise a Hallelujah", category: "Contemporary" },
        { id: 7, title: "No Longer Slaves", category: "Contemporary" },
        { id: 8, title: "King of My Heart", category: "Contemporary" }
      ],
      image: "/artists/bethel.jpg"
    },
    {
      id: 3,
      name: "Elevation Worship",
      country: "USA",
      founded: "2007",
      genre: "Contemporary Worship",
      songs: 42,
      rating: 4.6,
      description: "From Elevation Church in Charlotte, North Carolina, known for energetic and powerful worship music.",
      popularSongs: [
        { id: 9, title: "Graves Into Gardens", category: "Contemporary" },
        { id: 10, title: "Do It Again", category: "Contemporary" },
        { id: 11, title: "Here As In Heaven", category: "Contemporary" },
        { id: 12, title: "O Come to the Altar", category: "Contemporary" }
      ],
      image: "/artists/elevation.jpg"
    },
    {
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
    {
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
    },
    {
      id: 6,
      name: "Matt Redman",
      country: "UK",
      founded: "1995",
      genre: "Contemporary Worship",
      songs: 35,
      rating: 4.7,
      description: "British worship leader and songwriter, known for songs like '10,000 Reasons' and 'Blessed Be Your Name'.",
      popularSongs: ["10,000 Reasons", "Blessed Be Your Name", "The Heart of Worship", "You Never Let Go"],
      image: "/artists/matt-redman.jpg"
    },
    {
      id: 7,
      name: "Kari Jobe",
      country: "USA",
      founded: "2004",
      genre: "Contemporary Worship",
      songs: 31,
      rating: 4.6,
      description: "American contemporary Christian music singer and songwriter, known for her powerful vocals and worship songs.",
      popularSongs: ["The Blessing", "Forever", "Revelation Song", "I Am Not Alone"],
      image: "/artists/kari-jobe.jpg"
    },
    {
      id: 8,
      name: "Phil Wickham",
      country: "USA",
      founded: "2003",
      genre: "Contemporary Worship",
      songs: 29,
      rating: 4.5,
      description: "American contemporary Christian music singer and songwriter, known for his worship anthems.",
      popularSongs: ["This Is Amazing Grace", "Living Hope", "At Your Name", "Your Love Awakens Me"],
      image: "/artists/phil-wickham.jpg"
    },
    {
      id: 9,
      name: "Cody Carnes",
      country: "USA",
      founded: "2015",
      genre: "Contemporary Worship",
      songs: 18,
      rating: 4.4,
      description: "American worship leader and songwriter, known for his collaboration with Kari Jobe on 'The Blessing'.",
      popularSongs: ["The Blessing", "Nothing Else", "Run to the Father", "God Is Good"],
      image: "/artists/cody-carnes.jpg"
    },
    {
      id: 10,
      name: "Tasha Cobbs Leonard",
      country: "USA",
      founded: "2010",
      genre: "Gospel",
      songs: 24,
      rating: 4.8,
      description: "American gospel singer and songwriter, known for her powerful vocals and contemporary gospel music.",
      popularSongs: ["Break Every Chain", "For Your Glory", "Your Spirit", "Gracefully Broken"],
      image: "/artists/tasha-cobbs.jpg"
    },
    {
      id: 11,
      name: "Travis Greene",
      country: "USA",
      founded: "2007",
      genre: "Gospel",
      songs: 22,
      rating: 4.7,
      description: "American gospel singer, songwriter, and pastor, known for his contemporary gospel sound.",
      popularSongs: ["Made a Way", "Intentional", "You Waited", "Won't He Do It"],
      image: "/artists/travis-greene.jpg"
    },
    {
      id: 12,
      name: "Kirk Franklin",
      country: "USA",
      founded: "1993",
      genre: "Gospel",
      songs: 67,
      rating: 4.9,
      description: "American gospel musician, choir director, and author, known for contemporary gospel music.",
      popularSongs: ["I Smile", "Wanna Be Happy?", "Love Theory", "Brighter Day"],
      image: "/artists/kirk-franklin.jpg"
    }
  ];

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleArtists = filteredArtists.slice(0, displayedArtists);
  const hasMoreArtists = displayedArtists < filteredArtists.length;

  const handleLoadMore = () => {
    setDisplayedArtists(prev => Math.min(prev + 12, filteredArtists.length));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (rating >= 4.0) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (rating >= 3.5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-0 px-6 bg-gradient-to-br from-background to-muted/20 mb-[-50px]">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Gospel Artists
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Discover gospel artists from around the world. Explore their music, learn about their journey, 
              and find chord charts for their most popular songs.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <EnhancedSearch
                placeholder="Search artists, genres, or countries..."
                onSearch={(query) => setSearchQuery(query)}
                onResultSelect={(result) => {
                  // Navigate to the selected artist
                  window.location.href = `/artists/${result.id}`;
                }}
                showFilters={true}
                showSort={true}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{artists.length}</div>
                <div className="text-sm text-muted-foreground">Artists</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">400+</div>
                <div className="text-sm text-muted-foreground">Songs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.7</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Artists Grid */}
        <section className="pt-20 pb-0 px-6 mb-[-50px]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-4">
                {searchQuery ? `Search Results for "${searchQuery}"` : "All Artists"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleArtists.map((artist) => (
                <Card key={artist.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {artist.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {artist.country}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Founded {artist.founded}
                        </div>
                      </div>
                      <Badge className={getRatingColor(artist.rating)}>
                        <Star className="h-3 w-3 mr-1" />
                        {artist.rating}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {artist.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Genre:</span>
                        <Badge variant="outline">{artist.genre}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Songs:</span>
                        <span className="font-medium">{artist.songs}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Popular Songs:</p>
                        <div className="flex flex-wrap gap-1">
                          {artist.popularSongs.slice(0, 3).map((song, index) => (
                            <Link key={index} href={`/songs/${typeof song === 'string' ? index + 1 : song.id}`}>
                              <Badge variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
                                {typeof song === 'string' ? song : song.title}
                              </Badge>
                            </Link>
                          ))}
                          {artist.popularSongs.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{artist.popularSongs.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                        onClick={() => window.location.href = `/artists/${artist.id}`}
                      >
                        <Music className="mr-2 h-4 w-4" />
                        View Songs
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMoreArtists && (
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  className="rounded-full"
                  onClick={handleLoadMore}
                >
                  Load More Artists ({filteredArtists.length - displayedArtists} remaining)
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {filteredArtists.length === 0 && (
              <div className="text-center py-12">
                <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No artists found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse all artists.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 rounded-full"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ArtistsPage;
