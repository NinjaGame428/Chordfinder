"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Music, User, Filter, X, SortAsc, SortDesc } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  key: string;
  genre: string;
  difficulty: string;
  chordPreview: string;
  lyrics: string;
  popularity: number;
  thumbnail?: string;
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
  showFilters?: boolean;
  showSort?: boolean;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Amazing Grace",
    artist: "John Newton",
    key: "G",
    genre: "Traditional",
    difficulty: "Easy",
    chordPreview: "G - C - G - D",
    lyrics: "Amazing grace, how sweet the sound, That saved a wretch like me. I once was lost, but now am found, Was blind, but now I see.",
    popularity: 95,
  },
  {
    id: "2",
    title: "What a Beautiful Name",
    artist: "Hillsong Worship",
    key: "D",
    genre: "Contemporary",
    difficulty: "Medium",
    chordPreview: "D - A - Bm - G",
    lyrics: "You were the Word at the beginning, One with God the Lord Most High. Your hidden glory in creation, Now revealed in You our Christ. What a beautiful Name it is, What a beautiful Name it is, The Name of Jesus Christ my King.",
    popularity: 88,
  },
  {
    id: "3",
    title: "I Smile",
    artist: "Kirk Franklin",
    key: "Bb",
    genre: "Gospel",
    difficulty: "Medium",
    chordPreview: "Bb - F - Gm - Eb",
    lyrics: "Today's a new day, but there is no sunshine. Nothing but clouds, and it's dark in my heart. And it feels like a cold night. Today's a new day, where are my blue skies? Where is the love and the joy that you promised me? You told me it would be alright.",
    popularity: 82,
  },
  {
    id: "4",
    title: "Cornerstone",
    artist: "Hillsong Worship",
    key: "G",
    genre: "Contemporary",
    difficulty: "Easy",
    chordPreview: "G - C - D - Em",
    lyrics: "My hope is built on nothing less, Than Jesus' blood and righteousness. I dare not trust the sweetest frame, But wholly trust in Jesus' name. Christ alone, Cornerstone, Weak made strong in the Savior's love.",
    popularity: 90,
  },
  {
    id: "5",
    title: "Oceans",
    artist: "Hillsong United",
    key: "D",
    genre: "Contemporary",
    difficulty: "Medium",
    chordPreview: "D - A - Bm - G",
    lyrics: "You call me out upon the waters, The great unknown where feet may fail. And there I find You in the mystery, In oceans deep my faith will stand. And I will call upon Your name, And keep my eyes above the waves.",
    popularity: 85,
  },
];

const EnhancedSearch = ({
  placeholder = "Search for songs, artists, chords, or lyrics...",
  onSearch,
  onResultSelect,
  className,
  showFilters = true,
  showSort = true,
}: EnhancedSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    genre: "",
    difficulty: "",
    key: "",
  });
  const [sortBy, setSortBy] = useState<"relevance" | "popularity" | "alphabetical">("relevance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const genres = ["All", "Contemporary", "Traditional", "Gospel", "Worship", "Hymn"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const keys = ["All", "C", "D", "E", "F", "G", "A", "B"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const filtered = mockResults.filter(result => {
        const matchesQuery = 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.artist.toLowerCase().includes(query.toLowerCase()) ||
          result.chordPreview.toLowerCase().includes(query.toLowerCase()) ||
          result.lyrics.toLowerCase().includes(query.toLowerCase());
        
        const matchesGenre = !selectedFilters.genre || selectedFilters.genre === "All" || result.genre === selectedFilters.genre;
        const matchesDifficulty = !selectedFilters.difficulty || selectedFilters.difficulty === "All" || result.difficulty === selectedFilters.difficulty;
        const matchesKey = !selectedFilters.key || selectedFilters.key === "All" || result.key === selectedFilters.key;
        
        return matchesQuery && matchesGenre && matchesDifficulty && matchesKey;
      });

      // Sort results
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "popularity":
            return sortOrder === "desc" ? b.popularity - a.popularity : a.popularity - b.popularity;
          case "alphabetical":
            return sortOrder === "desc" 
              ? b.title.localeCompare(a.title)
              : a.title.localeCompare(b.title);
          default: // relevance
            return b.popularity - a.popularity;
        }
      });

      setResults(sorted);
      setIsOpen(true);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedFilters, sortBy, sortOrder]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(`${result.title} - ${result.artist}`);
    setIsOpen(false);
    onResultSelect?.(result);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      genre: "",
      difficulty: "",
      key: "",
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-hidden">
          <CardContent className="p-0">
            {/* Filters and Sort */}
            {(showFilters || showSort) && (
              <div className="p-4 border-b bg-muted/50">
                <div className="flex flex-wrap gap-4 items-center">
                  {showFilters && (
                    <>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <select
                          value={selectedFilters.genre}
                          onChange={(e) => handleFilterChange("genre", e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                        <select
                          value={selectedFilters.difficulty}
                          onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          {difficulties.map(difficulty => (
                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                          ))}
                        </select>
                        <select
                          value={selectedFilters.key}
                          onChange={(e) => handleFilterChange("key", e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          {keys.map(key => (
                            <option key={key} value={key}>{key}</option>
                          ))}
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-xs"
                        >
                          Clear
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {showSort && (
                    <div className="flex items-center gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="popularity">Popularity</option>
                        <option value="alphabetical">Alphabetical</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSortOrder}
                        className="p-1"
                      >
                        {sortOrder === "asc" ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Results */}
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Music className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm truncate">{result.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {result.key}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <User className="h-3 w-3" />
                          {result.artist}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Chords: {result.chordPreview}</span>
                          <Badge variant="outline" className="text-xs">
                            {result.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {result.genre}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : query.length >= 2 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No songs found matching your search.</p>
                  <p className="text-xs">Try different keywords or check your spelling.</p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearch;
