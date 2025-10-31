"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslatedRoute } from "@/lib/url-translations";

interface Song {
  id: string | number;
  title: string;
  artist: string;
  key: string;
  difficulty: string;
  category: string;
  slug?: string;
}

const SongList = () => {
  const { t, language } = useLanguage();
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch 12 songs from Supabase
  useEffect(() => {
    async function fetchSongs() {
      console.log('🏠 Fetching songs for home page...');
      
      if (!supabase) {
        console.error('❌ Supabase client not initialized');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Optimized: Fetch songs with artists in a single query
        const { data: songsData, error: songsError } = await supabase
          .from('songs')
          .select(`
            id,
            title,
            artist_id,
            key_signature,
            genre,
            created_at,
            artists!inner (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(12); // Optimized: fetch only 12 songs for home page

        if (songsError) {
          console.error('❌ Error fetching songs:', songsError);
          setIsLoading(false);
          return;
        }

        if (songsData && songsData.length > 0) {
          const formattedSongs: Song[] = songsData.map((song: any) => ({
            id: song.id,
            title: song.title,
            artist: song.artists?.name || (Array.isArray(song.artists) ? song.artists[0]?.name : 'Unknown Artist'),
            key: song.key_signature || 'C',
            difficulty: 'Medium',
            category: song.genre || 'Gospel',
            slug: song.slug || song.id,
          }));

          console.log(`✅ Loaded ${formattedSongs.length} songs for home page`);
          setPopularSongs(formattedSongs);
        }
      } catch (error) {
        console.error('❌ Error fetching songs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSongs();
  }, []);

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

  const getDifficultyText = (difficulty: string) => {
    if (difficulty === 'Easy') return t('chord.easy');
    if (difficulty === 'Medium') return t('chord.medium');
    if (difficulty === 'Hard') return t('chord.hard');
    return difficulty;
  };

  return (
    <section className="pt-5 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl xs:text-4xl font-bold tracking-tight">
            {language === 'fr' ? 'Chansons Gospel Populaires' : 'Popular Gospel Songs'}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Explorez notre collection organisée de chansons gospel bien-aimées avec grilles d\'accords et ressources'
              : 'Explore our organized collection of beloved gospel songs with chord charts and resources'
            }
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">{t('song.loading')}</p>
          </div>
        ) : popularSongs.length === 0 ? (
          <div className="text-center py-20">
            <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('song.noSongs')}</h3>
            <p className="text-muted-foreground">{t('song.comeBack')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSongs.map((song) => (
            <Card key={song.id} className="group hover:shadow-lg transition-all duration-300">
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
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {song.key}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getDifficultyColor(song.difficulty)}>
                    {getDifficultyText(song.difficulty)}
                  </Badge>
                  <Badge variant="secondary">
                    {song.category}
                  </Badge>
                </div>
                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                  asChild
                >
                  <Link href={getTranslatedRoute(`/songs/${song.id}`, language)}>
                    <Music className="mr-2 h-4 w-4" />
                    {t('song.viewChords')}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {!isLoading && popularSongs.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" className="rounded-full" asChild>
              <Link href={getTranslatedRoute('/songs', language)}>
                {t('song.viewAll')}
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SongList;
