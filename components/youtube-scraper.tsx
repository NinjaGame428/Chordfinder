"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2, Youtube, Music } from "lucide-react";
import { Song } from "@/lib/song-data";

interface YouTubeScraperProps {
  onSongsScraped: (songs: Song[]) => void;
  isLoading: boolean;
}

export const YouTubeScraper = ({ onSongsScraped, isLoading }: YouTubeScraperProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [useDenaMwanaData, setUseDenaMwanaData] = useState(false);

  const handleScrape = async () => {
    if (!searchQuery.trim() && !useDenaMwanaData) return;

    try {
      const response = await fetch('/api/youtube/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery: searchQuery.trim() || "Dena Mwana gospel",
          maxResults: maxResults,
          useDenaMwanaData: useDenaMwanaData
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSongsScraped(data.songs);
      } else {
        console.error('Scraping failed:', data.error);
      }
    } catch (error) {
      console.error('Error scraping YouTube:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Youtube className="h-5 w-5 mr-2 text-red-500" />
          YouTube Song Scraper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Search for gospel songs on YouTube..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScrape()}
            />
          </div>
          <Button 
            onClick={handleScrape} 
            disabled={!searchQuery.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Max Results:</label>
          <select
            value={maxResults}
            onChange={(e) => setMaxResults(parseInt(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useDenaMwanaData}
              onChange={(e) => setUseDenaMwanaData(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Use Dena Mwana Collection</span>
          </label>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <Music className="h-4 w-4 inline mr-1" />
          Search for gospel songs, worship music, or specific artists to scrape chord information from YouTube videos.
        </div>
      </CardContent>
    </Card>
  );
};
