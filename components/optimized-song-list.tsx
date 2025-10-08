"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, User, ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import { Song } from "@/lib/song-data";
import { performanceOptimizer, PerformanceMonitor } from "@/lib/performance-optimizer";
import LazyLoad from "@/components/lazy-load";

interface OptimizedSongListProps {
  songs: Song[];
  onToggleFavorite: (song: Song) => void;
  isFavorite: (id: number) => boolean;
  viewMode: 'grid' | 'list';
  getDifficultyColor: (difficulty: string) => string;
}

const OptimizedSongList: React.FC<OptimizedSongListProps> = ({
  songs,
  onToggleFavorite,
  isFavorite,
  viewMode,
  getDifficultyColor
}) => {
  const [visibleSongs, setVisibleSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const ITEMS_PER_PAGE = 12;
  const VIRTUAL_SCROLL_THRESHOLD = 100;

  // Memoized song processing
  const processedSongs = useMemo(() => {
    PerformanceMonitor.startTiming('song-processing');
    
    const processed = songs.map(song => ({
      ...song,
      displayTitle: song.title.length > 50 ? `${song.title.substring(0, 50)}...` : song.title,
      isFav: isFavorite(song.id)
    }));
    
    PerformanceMonitor.endTiming('song-processing');
    return processed;
  }, [songs, isFavorite]);

  // Debounced search
  const debouncedLoadMore = useCallback(
    performanceOptimizer.debounce(
      'load-more',
      async () => {
        if (isLoading || !hasMore) return;
        
        PerformanceMonitor.startTiming('load-more');
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const newSongs = processedSongs.slice(startIndex, endIndex);
        
        setVisibleSongs(prev => [...prev, ...newSongs]);
        setPage(prev => prev + 1);
        setHasMore(endIndex < processedSongs.length);
        setIsLoading(false);
        
        PerformanceMonitor.endTiming('load-more');
      },
      300
    ),
    [processedSongs, page, isLoading, hasMore]
  );

  // Load initial songs
  useEffect(() => {
    PerformanceMonitor.startTiming('initial-load');
    
    const initialSongs = processedSongs.slice(0, ITEMS_PER_PAGE);
    setVisibleSongs(initialSongs);
    setPage(2);
    setHasMore(processedSongs.length > ITEMS_PER_PAGE);
    
    PerformanceMonitor.endTiming('initial-load');
  }, [processedSongs]);

  // Optimized scroll handler
  const handleScroll = useCallback(
    performanceOptimizer.optimizeScroll(() => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage > 0.8 && hasMore && !isLoading) {
        debouncedLoadMore();
      }
    }),
    [debouncedLoadMore, hasMore, isLoading]
  );

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Memoized song card component
  const SongCard = React.memo(({ song }: { song: Song & { displayTitle: string; isFav: boolean } }) => (
    <LazyLoad>
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {song.displayTitle}
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
                onClick={() => onToggleFavorite(song)}
              >
                <Heart className={`h-4 w-4 ${song.isFav ? 'fill-current text-red-500' : ''}`} />
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
              <Link href={`/songs/${song.slug || song.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                <Music className="mr-2 h-4 w-4" />
                View Chords
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </LazyLoad>
  ));

  SongCard.displayName = 'SongCard';

  // Virtual scrolling for large lists
  const shouldUseVirtualScroll = processedSongs.length > VIRTUAL_SCROLL_THRESHOLD;
  
  if (shouldUseVirtualScroll) {
    // Implement virtual scrolling here if needed
    console.log('Large dataset detected, virtual scrolling would be implemented here');
  }

  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleSongs.map((song) => (
            <SongCard key={song.id} song={song as any} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleSongs.map((song) => (
            <SongCard key={song.id} song={song as any} />
          ))}
        </div>
      )}
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading more songs...</p>
        </div>
      )}
      
      {!hasMore && visibleSongs.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You've reached the end of the list</p>
        </div>
      )}
    </div>
  );
};

export default OptimizedSongList;
