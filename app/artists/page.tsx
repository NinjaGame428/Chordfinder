"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, User, Calendar, MapPin, ExternalLink, Grid3x3, List } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import EnhancedSearch from "@/components/enhanced-search";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslatedRoute } from "@/lib/url-translations";

interface Artist {
  id: string;
  name: string;
  country?: string;
  founded?: string;
  genre?: string;
  songs: number;
  bio?: string;
  image_url?: string;
  website?: string;
}

const ArtistsPage = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedArtists, setDisplayedArtists] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch artists from Supabase
  useEffect(() => {
    async function fetchArtists() {
      console.log('🔄 Fetching artists from Supabase...');
      
      if (!supabase) {
        console.error('❌ Supabase client not initialized');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch all artists
        const { data: artistsData, error: artistsError } = await supabase
          .from('artists')
          .select('*')
          .order('name', { ascending: true });

        if (artistsError) {
          console.error('❌ Error fetching artists:', artistsError);
          setIsLoading(false);
          return;
        }

        console.log(`✅ Retrieved ${artistsData?.length || 0} artists`);

        if (artistsData && artistsData.length > 0 && supabase) {
          // Optimize: Get all song counts in a single query instead of N+1 queries
          const artistIds = artistsData.map(a => a.id);
          const { data: songCounts, error: countsError } = await supabase
            .from('songs')
            .select('artist_id')
            .in('artist_id', artistIds);

          // Create a map of artist_id -> count
          const countMap = new Map<string, number>();
          if (songCounts && !countsError) {
            songCounts.forEach((song: any) => {
              const artistId = song.artist_id;
              countMap.set(artistId, (countMap.get(artistId) || 0) + 1);
            });
          }

          // Map artists with their counts
          const artistsWithCounts = artistsData.map((artist) => {
            // Clean up artist name - remove "Artist from YouTube channel" suffix if present
            const cleanName = artist.name?.replace(/\s*Artist from YouTube channel\s*/i, '').trim() || artist.name;
            
            return {
              id: artist.id,
              name: cleanName,
              bio: artist.bio || undefined,
              image_url: artist.image_url || undefined,
              website: artist.website || undefined,
              genre: artist.genre || 'Gospel',
              country: artist.country || undefined,
              founded: artist.founded || undefined,
              songs: countMap.get(artist.id) || 0,
            };
          });

          console.log(`✅ Formatted ${artistsWithCounts.length} artists with song counts`);
          setArtists(artistsWithCounts);
        }
      } catch (error) {
        console.error('❌ Error fetching artists:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArtists();
    
    // Listen for song updates and refresh artist counts
    const handleSongUpdate = (event: any) => {
      console.log('🔄 Song updated, refreshing artist counts...', event?.detail);
      // If artist was changed, refresh immediately to update counts
      if (event?.detail?.action === 'artistChanged') {
        console.log('🎨 Artist changed - refreshing counts for both old and new artists');
      }
      fetchArtists();
    };
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'songUpdated') {
        handleSongUpdate();
      }
    };
    
    window.addEventListener('songUpdated', handleSongUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh on window focus to get latest counts
    const handleFocus = () => {
      fetchArtists();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('songUpdated', handleSongUpdate);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Filter and search logic
  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (artist.genre && artist.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (artist.bio && artist.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const visibleArtists = filteredArtists.slice(0, displayedArtists);
  const hasMoreArtists = displayedArtists < filteredArtists.length;

  const handleLoadMore = () => {
    setDisplayedArtists(prev => Math.min(prev + 12, filteredArtists.length));
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-6 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              {t('artists.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              {t('artists.subtitle')}
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <EnhancedSearch
                placeholder={t('artists.searchPlaceholder')}
                onSearch={(query) => setSearchQuery(query)}
                onResultSelect={(result) => {
                  // Navigate to the selected artist
                  window.location.href = getTranslatedRoute(`/artists/${result.id}`, language);
                }}
                showFilters={true}
                showSort={true}
              />
            </div>

          </div>
        </section>

        {/* Artists Grid */}
        <section className="pt-12 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-4">
                {searchQuery ? `${t('artists.searchResults')} "${searchQuery}"` : t('artists.allArtists')}
              </h2>
              {isLoading ? (
                <p className="text-lg text-muted-foreground">{t('artists.loading')}</p>
              ) : (
                <p className="text-lg text-muted-foreground">
                  {filteredArtists.length} {filteredArtists.length !== 1 ? t('artists.artists') : t('common.artist')}
                </p>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('artists.viewMode')}:</span>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-full"
                >
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  {t('artists.gridView')}
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-full"
                >
                  <List className="h-4 w-4 mr-2" />
                  {t('artists.listView')}
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-4 text-muted-foreground">{t('artists.loadingDb')}</p>
              </div>
            ) : visibleArtists.length === 0 ? (
              <div className="text-center py-20">
                <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('artists.noArtists')}</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? t('artists.tryAdjusting') : t('artists.noArtistsDb')}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
                {visibleArtists.map((artist) => (
                <Card key={artist.id} className={`group hover:shadow-lg transition-all duration-300 ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
                  {viewMode === 'list' ? (
                    <>
                      <CardHeader className="pb-3 flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          {artist.image_url && (
                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                              <img 
                                src={artist.image_url} 
                                alt={artist.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                              {artist.name}
                            </CardTitle>
                            {artist.country && (
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {artist.country}
                              </div>
                            )}
                            {artist.founded && (
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('artists.founded')} {artist.founded}
                              </div>
                            )}
                          </div>
                        </div>
                        {artist.bio && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {artist.bio}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="pt-6 flex flex-col justify-between min-w-[200px]">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('artists.genre')}:</span>
                            <Badge variant="outline">{artist.genre}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('artists.songs')}:</span>
                            <span className="font-medium">{artist.songs}</span>
                          </div>
                          
                          {artist.website && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{t('common.website')}:</span>
                              <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          )}
                        </div>
                        <Button 
                          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          variant="outline"
                          asChild
                        >
                          <Link href={getTranslatedRoute(`/artists/${artist.id}`, language)}>
                            <Music className="mr-2 h-4 w-4" />
                            {t('artists.viewSongs')}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </>
                  ) : (
                    <>
                      <CardHeader className="pb-3">
                        <div className="flex flex-col items-center mb-4">
                          {artist.image_url && (
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                              <img 
                                src={artist.image_url} 
                                alt={artist.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 w-full text-center">
                            <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                              {artist.name}
                            </CardTitle>
                            {artist.country && (
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {artist.country}
                              </div>
                            )}
                            {artist.founded && (
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('artists.founded')} {artist.founded}
                              </div>
                            )}
                          </div>
                        </div>
                        {artist.bio && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {artist.bio}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('artists.genre')}:</span>
                            <Badge variant="outline">{artist.genre}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('artists.songs')}:</span>
                            <span className="font-medium">{artist.songs}</span>
                          </div>
                          
                          {artist.website && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{t('common.website')}:</span>
                              <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          )}
                          
                          <Button 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            variant="outline"
                            asChild
                          >
                            <Link href={getTranslatedRoute(`/artists/${artist.id}`, language)}>
                              <Music className="mr-2 h-4 w-4" />
                              {t('artists.viewSongs')}
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
                ))}
              </div>
            )}

            {!isLoading && hasMoreArtists && (
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  className="rounded-full"
                  onClick={handleLoadMore}
                >
                  {t('artists.loadMore')} ({filteredArtists.length - displayedArtists} {t('artists.remaining')})
                  <ExternalLink className="ml-2 h-5 w-5" />
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
