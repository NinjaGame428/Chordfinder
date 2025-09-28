"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, User, ExternalLink, Filter, BookOpen, Zap, Star, Heart } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import EnhancedSearch from "@/components/enhanced-search";
import LazyLoad from "@/components/lazy-load";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { songs, Song } from "@/lib/song-data";

const SongsPage = () => {
  const { t } = useLanguage();
  const { addSongToFavorites, removeSongFromFavorites, isSongFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Songs");
  const [displayedSongs, setDisplayedSongs] = useState(12);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  const allSongs: Song[] = songs;

  const categories = [
    { name: "All Songs", icon: Music },
    { name: "Classic Hymn", icon: BookOpen },
    { name: "Contemporary", icon: Zap },
    { name: "Modern Hymn", icon: Star }
  ];

  // Filter songs based on search query and category
  useEffect(() => {
    let filtered = allSongs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All Songs") {
      filtered = filtered.filter(song => song.category === selectedCategory);
    }

    setFilteredSongs(filtered);
    setDisplayedSongs(12); // Reset displayed songs when filters change
  }, [searchQuery, selectedCategory]);

  const handleLoadMore = () => {
    setDisplayedSongs(prev => Math.min(prev + 12, filteredSongs.length));
  };

  const handleToggleFavorite = (song: any) => {
    if (isSongFavorite(song.id)) {
      removeSongFromFavorites(song.id);
    } else {
      addSongToFavorites({
        id: song.id,
        title: song.title,
        artist: song.artist,
        key: song.key,
        difficulty: song.difficulty,
        category: song.category
      });
    }
  };

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

  const visibleSongs = filteredSongs.slice(0, displayedSongs);
  const hasMoreSongs = displayedSongs < filteredSongs.length;

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-0 px-6 bg-gradient-to-br from-background to-muted/20 mb-[-50px]">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              {t('songs.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              {t('songs.subtitle')}
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <EnhancedSearch
                placeholder="Search for songs, artists, chords, or lyrics..."
                onSearch={(query) => setSearchQuery(query)}
                onResultSelect={(result) => {
                  // Navigate to the selected song
                  window.location.href = `/songs/${result.id}`;
                }}
                showFilters={true}
                showSort={true}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Songs Grid */}
        <section className="pt-20 pb-0 px-6 mb-[-50px]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-4">
                {searchQuery || selectedCategory !== "All Songs" 
                  ? `Search Results (${filteredSongs.length} songs found)` 
                  : "All Gospel Songs"
                }
              </h2>
              <p className="text-lg text-muted-foreground">
                Browse our complete collection of gospel songs with chord charts and resources
              </p>
            </div>

            {visibleSongs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleSongs.map((song) => (
                    <LazyLoad key={song.id}>
                      <Card className="group hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {song.title}
                              </CardTitle>
                              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                <User className="h-4 w-4 mr-1" />
                                {song.artist}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {song.year}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge variant="outline" className="ml-2">
                                {song.key}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full"
                                onClick={() => handleToggleFavorite(song)}
                              >
                                <Heart className={`h-4 w-4 ${isSongFavorite(song.id) ? 'fill-current text-red-500' : ''}`} />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between mb-4">
                            <Badge className={getDifficultyColor(song.difficulty)}>
                              {song.difficulty}
                            </Badge>
                            <Badge variant="secondary">
                              {song.category}
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            <Button 
                              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                              variant="outline"
                              asChild
                            >
                               <Link href={`/songs/${song.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                                <Music className="mr-2 h-4 w-4" />
                                View Chords
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </LazyLoad>
                  ))}
                </div>

                {hasMoreSongs && (
                  <div className="text-center mt-12">
                    <Button 
                      size="lg" 
                      className="rounded-full"
                      onClick={handleLoadMore}
                    >
                      Load More Songs ({filteredSongs.length - displayedSongs} remaining)
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No songs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or browse all songs.
                </p>
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Songs");
                  }}
                >
                  Clear Filters
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

export default SongsPage;