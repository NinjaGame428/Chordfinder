import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, User, ExternalLink, Clock, Star, Heart, Calendar, Tag } from "lucide-react";
import Link from "next/link";

const SongList = () => {
  const popularSongs = [
    {
      id: 1,
      title: "Amazing Grace",
      artist: "John Newton",
      key: "G Major",
      difficulty: "Easy",
      category: "Classic Hymn",
      year: "1779",
      tempo: "72 BPM",
      rating: 4.9,
      downloads: 15420,
      description: "One of the most beloved hymns of all time, written by John Newton after his conversion from slave trading to Christianity.",
      tags: ["Traditional", "Worship", "Popular"]
    },
    {
      id: 2,
      title: "How Great Thou Art",
      artist: "Stuart Hine",
      key: "C Major",
      difficulty: "Medium",
      category: "Classic Hymn",
      year: "1949",
      tempo: "68 BPM",
      rating: 4.8,
      downloads: 12300,
      description: "A powerful hymn celebrating God's creation and majesty, originally a Swedish folk song.",
      tags: ["Traditional", "Worship", "Majestic"]
    },
    {
      id: 3,
      title: "Great Is Thy Faithfulness",
      artist: "Thomas Chisholm",
      key: "F Major",
      difficulty: "Easy",
      category: "Classic Hymn",
      year: "1923",
      tempo: "76 BPM",
      rating: 4.7,
      downloads: 9800,
      description: "A timeless hymn about God's unchanging faithfulness and love.",
      tags: ["Traditional", "Faith", "Trust"]
    },
    {
      id: 4,
      title: "Blessed Be Your Name",
      artist: "Matt Redman",
      key: "G Major",
      difficulty: "Medium",
      category: "Contemporary",
      year: "2002",
      tempo: "120 BPM",
      rating: 4.6,
      downloads: 11200,
      description: "A modern worship song about praising God in all circumstances of life.",
      tags: ["Contemporary", "Worship", "Praise"]
    },
    {
      id: 5,
      title: "How Great Is Our God",
      artist: "Chris Tomlin",
      key: "C Major",
      difficulty: "Easy",
      category: "Contemporary",
      year: "2004",
      tempo: "140 BPM",
      rating: 4.9,
      downloads: 18700,
      description: "A powerful declaration of God's greatness and majesty in contemporary worship style.",
      tags: ["Contemporary", "Worship", "Majesty"]
    },
    {
      id: 6,
      title: "10,000 Reasons",
      artist: "Matt Redman",
      key: "D Major",
      difficulty: "Medium",
      category: "Contemporary",
      year: "2011",
      tempo: "132 BPM",
      rating: 4.8,
      downloads: 16500,
      description: "A beautiful song of gratitude and praise, encouraging believers to bless the Lord.",
      tags: ["Contemporary", "Gratitude", "Praise"]
    },
    {
      id: 7,
      title: "What A Beautiful Name",
      artist: "Hillsong Worship",
      key: "E Major",
      difficulty: "Medium",
      category: "Contemporary",
      year: "2016",
      tempo: "68 BPM",
      rating: 4.9,
      downloads: 22100,
      description: "A modern worship anthem celebrating the name and power of Jesus Christ.",
      tags: ["Contemporary", "Jesus", "Worship"]
    },
    {
      id: 8,
      title: "Good Good Father",
      artist: "Chris Tomlin",
      key: "G Major",
      difficulty: "Easy",
      category: "Contemporary",
      year: "2015",
      tempo: "76 BPM",
      rating: 4.7,
      downloads: 14300,
      description: "A heartfelt song about God's perfect fatherly love and care.",
      tags: ["Contemporary", "Father", "Love"]
    },
    {
      id: 9,
      title: "In Christ Alone",
      artist: "Keith Getty",
      key: "C Major",
      difficulty: "Medium",
      category: "Modern Hymn",
      year: "2001",
      tempo: "72 BPM",
      rating: 4.8,
      downloads: 12800,
      description: "A modern hymn celebrating the sufficiency and supremacy of Christ.",
      tags: ["Modern Hymn", "Christ", "Faith"]
    },
    {
      id: 10,
      title: "Cornerstone",
      artist: "Hillsong Worship",
      key: "G Major",
      difficulty: "Easy",
      category: "Contemporary",
      year: "2012",
      tempo: "80 BPM",
      rating: 4.6,
      downloads: 15200,
      description: "A contemporary worship song based on the hymn 'My Hope Is Built'.",
      tags: ["Contemporary", "Foundation", "Hope"]
    }
  ];

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
                >
                  <Music className="mr-2 h-4 w-4" />
                  View Chords
                  <ExternalLink className="ml-2 h-4 w-4" />
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
