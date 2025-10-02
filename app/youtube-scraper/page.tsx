'use client';

import React, { useState } from 'react';
import { Search, Download, Play, Users, Zap, Shield, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import YouTubeVideoFinder from '@/components/YouTubeVideoFinder';
import VideoCard from '@/components/VideoCard';
import DownloadButton from '@/components/DownloadButton';

interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  channelTitle: string;
  duration: string;
  viewCount: string;
}

interface SearchResponse {
  videos: VideoData[];
  searchQuery: string;
  totalResults: number;
  message?: string;
  nextPageToken?: string;
}

export default function YouTubeScraperPage() {
  const [searchResults, setSearchResults] = useState<VideoData[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);
    setHasSearched(true);

    try {
      const response = await fetch('/api/youtube-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: query }),
      });

      const data: SearchResponse = await response.json();

      if (response.ok) {
        setSearchResults(data.videos);
        setTotalResults(data.totalResults);
        setError(null);
      } else {
        setError(data.message || 'An error occurred while searching');
        setSearchResults([]);
        setTotalResults(0);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // Download functionality will be implemented
    console.log('Download CSV functionality');
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              YouTube Scraper
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Professional YouTube data extraction with efficient CSV generation. 
              Built by Heavenkeys Ltd. for content creators and researchers.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <YouTubeVideoFinder onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need for professional YouTube data extraction
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Search className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Smart Search</CardTitle>
                  <CardDescription>
                    Advanced YouTube search with filtering and relevance scoring
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Download className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>CSV Export</CardTitle>
                  <CardDescription>
                    Stream-based CSV generation for optimal performance
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Play className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Video Preview</CardTitle>
                  <CardDescription>
                    Integrated video player with thumbnail previews
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Bulk Processing</CardTitle>
                  <CardDescription>
                    Process multiple videos and channels efficiently
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Fast Performance</CardTitle>
                  <CardDescription>
                    Optimized for speed with caching and parallel processing
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Secure & Reliable</CardTitle>
                  <CardDescription>
                    Built with security best practices and error handling
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Search Results */}
        {hasSearched && (
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">
                    Search Results
                  </h2>
                  <p className="text-muted-foreground">
                    {totalResults > 0 
                      ? `Found ${totalResults} videos for "${currentQuery}"`
                      : `No videos found for "${currentQuery}"`
                    }
                  </p>
                </div>
                
                {searchResults.length > 0 && (
                  <DownloadButton 
                    videos={searchResults}
                    filename={`youtube-search-${currentQuery.replace(/\s+/g, '-').toLowerCase()}`}
                  />
                )}
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-8">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-video bg-muted rounded-t-lg" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded mb-2" />
                        <div className="h-3 bg-muted rounded mb-2" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No videos found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or browse different categories.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
