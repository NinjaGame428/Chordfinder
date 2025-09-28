import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, User, ExternalLink, Clock, Star, Heart, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { songs } from "@/lib/song-data";

const SongList = () => {
  // Get the first 10 songs for the homepage
  const popularSongs = songs.slice(0, 10);

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
    <section className="pt-2 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl xs:text-4xl font-bold tracking-tight">
            Popular Gospel Songs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of beloved gospel songs with chord charts and resources
          </p>
        </div>

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
                    {song.difficulty}
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
                  <Link href={`/songs/${song.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                    <Music className="mr-2 h-4 w-4" />
                    View Chords
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="rounded-full">
            View All Songs
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SongList;
