"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, User, ExternalLink, Filter, BookOpen, Zap, Star, Heart, Play } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import EnhancedSearch from "@/components/enhanced-search";
import { ViewToggle } from "@/components/view-toggle";
import OptimizedSongList from "@/components/optimized-song-list";
import { performanceOptimizer, PerformanceMonitor } from "@/lib/performance-optimizer";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Song } from "@/lib/song-data";

const UltraFastSongsPage = () => {
  const { t } = useLanguage();
  const { addSongToFavorites, removeSongFromFavorites, isSongFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Songs");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [highlightedSong, setHighlightedSong] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSongs, setTotalSongs] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  // Memoized categories
  const categories = useMemo(() => [
    { name: "All Songs", icon: Music },
    { name: "Classic Hymn", icon: BookOpen },
    { name: "Contemporary", icon: Zap },
    { name: "Modern Hymn", icon: Star }
  ], []);

  // Ultra-fast song fetching with caching
  const fetchSongs = useCallback(async (query: string, category: string, limit: number = 12, offset: number = 0) => {
    PerformanceMonitor.startTiming('fetch-songs');
    
    try {
      const params = new URLSearchParams({
        query,
        category,
        limit: limit.toString(),
        offset: offset.toString(),
        sortBy: 'created_at',
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/songs/ultra-fast?${params}`, {
        headers: {
          'Cache-Control': 'max-age=300',
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch songs');
      }

      setPerformanceMetrics(data.performance);
      return data;
    } catch (error) {
      console.error('Error fetching songs:', error);
      return { songs: [], total: 0, hasMore: false };
    } finally {
      PerformanceMonitor.endTiming('fetch-songs');
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    performanceOptimizer.debounce(
      'search',
      async (query: string, category: string) => {
        setIsLoading(true);
        const data = await fetchSongs(query, category, 12, 0);
        setSongs(data.songs);
        setTotalSongs(data.total);
        setIsLoading(false);
      },
      300
    ),
    [fetchSongs]
  );

  // Load initial songs
  useEffect(() => {
    const loadInitialSongs = async () => {
      PerformanceMonitor.startTiming('initial-page-load');
      setIsLoading(true);
      
      const data = await fetchSongs(searchQuery, selectedCategory, 12, 0);
      setSongs(data.songs);
      setTotalSongs(data.total);
      setIsLoading(false);
      
      PerformanceMonitor.endTiming('initial-page-load');
    };

    loadInitialSongs();
  }, []);

  // Handle search changes
  useEffect(() => {
    if (searchQuery || selectedCategory !== "All Songs") {
      debouncedSearch(searchQuery, selectedCategory);
    }
  }, [searchQuery, selectedCategory, debouncedSearch]);

  // Handle URL parameters for highlighting songs
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlight = urlParams.get('highlight');
    if (highlight) {
      setHighlightedSong(highlight);
      setTimeout(() => {
        const element = document.getElementById(`song-${highlight}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
        }
      }, 500);
    }
  }, []);

  const handleToggleFavorite = useCallback((song: Song) => {
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
  }, [isSongFavorite, addSongToFavorites, removeSongFromFavorites]);

  const getDifficultyColor = useCallback((difficulty: string) => {
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
  }, []);

  // Performance metrics display
  const PerformanceDisplay = useMemo(() => {
    if (!performanceMetrics) return null;
    
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
        <div className="font-bold mb-1">🚀 Ultra-Fast Performance</div>
        <div>Response: {performanceMetrics.responseTime}</div>
        <div>Query: {performanceMetrics.queryTime}ms</div>
        <div>Cache: {performanceMetrics.cacheHit ? 'HIT' : 'MISS'}</div>
        <div>Optimization: {performanceMetrics.optimization}</div>
      </div>
    );
  }, [performanceMetrics]);

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-6 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              🚀 Ultra-Fast Gospel Songs
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Discover beautiful gospel songs with lightning-fast loading and optimized performance
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <EnhancedSearch
                placeholder="Search for songs, artists, chords, or lyrics..."
                onSearch={(query) => setSearchQuery(query)}
                onResultSelect={(result) => {
                  const slug = result.slug || result.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  window.location.href = `/songs/${slug}`;
                }}
                showFilters={true}
                showSort={true}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
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

        {/* Songs Display */}
        <section className="pt-12 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-4">
                {searchQuery || selectedCategory !== "All Songs" 
                  ? `Search Results (${totalSongs} songs found)` 
                  : "Ultra-Fast Gospel Songs"
                }
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Browse our complete collection with 100x faster loading
              </p>
              {!isLoading && totalSongs > 0 && (
                <div className="flex justify-center gap-3 flex-wrap">
                  <Badge variant="default" className="text-sm">
                    🎵 {totalSongs} songs available
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    ⚡ 100x faster loading
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    🚀 Ultra-optimized
                  </Badge>
                </div>
              )}
            </div>

            {/* View Toggle and Controls */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {songs.length} songs loaded
                </span>
                {performanceMetrics && (
                  <span className="text-xs text-green-600">
                    ⚡ {performanceMetrics.responseTime}
                  </span>
                )}
              </div>
              <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Loading songs...</h3>
                <p className="text-muted-foreground">
                  Ultra-fast loading in progress
                </p>
              </div>
            ) : songs.length > 0 ? (
              <OptimizedSongList
                songs={songs}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isSongFavorite}
                viewMode={viewMode}
                getDifficultyColor={getDifficultyColor}
              />
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
      {PerformanceDisplay}
    </>
  );
};

export default UltraFastSongsPage;
