"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Music, User, Filter, X, SortAsc, SortDesc } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  artist_id: string;
  key_signature: string;
  genre: string;
  difficulty?: string;
  chords: string[];
  description?: string;
  slug?: string;
  year?: number;
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
  showFilters?: boolean;
  showSort?: boolean;
}

const EnhancedSearch = ({
  placeholder = "Search for songs, artists, chords, or lyrics...",
  onSearch,
  onResultSelect,
  className,
  showFilters = true,
  showSort = true,
}: EnhancedSearchProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    genre: "",
    key: "",
  });
  const [sortBy, setSortBy] = useState<"relevance" | "alphabetical">("relevance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const genres = ["All", "Gospel", "Worship", "Contemporary", "Traditional", "Hymn"];
  const keys = ["All", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

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

    const searchDatabase = async () => {
      setIsLoading(true);
      const supabase = createBrowserClient();
      
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        // Build the query
        let queryBuilder = supabase
          .from('songs')
          .select(`
            id,
            title,
            artist_id,
            key_signature,
            genre,
            chords,
            description,
            slug,
            year,
            artists (
              name
            )
          `);

        // Search in title, artist name, or description
        const searchTerm = `%${query}%`;
        queryBuilder = queryBuilder.or(
          `title.ilike.${searchTerm},description.ilike.${searchTerm},artists.name.ilike.${searchTerm}`
        );

        // Apply filters
        if (selectedFilters.genre && selectedFilters.genre !== "All") {
          queryBuilder = queryBuilder.eq('genre', selectedFilters.genre);
        }
        if (selectedFilters.key && selectedFilters.key !== "All") {
          queryBuilder = queryBuilder.eq('key_signature', selectedFilters.key);
        }

        // Apply sorting
        if (sortBy === "alphabetical") {
          queryBuilder = queryBuilder.order('title', { ascending: sortOrder === "asc" });
        } else {
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
        }

        // Limit results
        queryBuilder = queryBuilder.limit(20);

        const { data, error } = await queryBuilder;

        if (error) {
          console.error('Search error:', error);
          setResults([]);
        } else if (data) {
          // Transform the data to match SearchResult interface
          const formattedResults: SearchResult[] = data.map((song: any) => ({
            id: song.id,
            title: song.title,
            artist: song.artists?.name || 'Unknown Artist',
            artist_id: song.artist_id,
            key_signature: song.key_signature || 'C',
            genre: song.genre || 'Gospel',
            chords: song.chords || [],
            description: song.description,
            slug: song.slug,
            year: song.year,
          }));
          
          setResults(formattedResults);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchDatabase, 300);
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
    
    // Navigate to song page if slug exists
    if (result.slug) {
      router.push(`/songs/${result.slug}`);
    } else {
      router.push(`/songs`);
    }
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
                            {result.key_signature}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <User className="h-3 w-3" />
                          {result.artist}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          {result.chords && result.chords.length > 0 && (
                            <span>Chords: {result.chords.slice(0, 4).join(' - ')}</span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {result.genre}
                          </Badge>
                          {result.year && (
                            <Badge variant="outline" className="text-xs">
                              {result.year}
                            </Badge>
                          )}
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
