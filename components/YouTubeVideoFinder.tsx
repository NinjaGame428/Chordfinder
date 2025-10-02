'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Search, Music, Youtube, CheckCircle, AlertCircle } from 'lucide-react';
import { generateSearchSuggestions, createYouTubeSearchUrl, extractYouTubeId, isValidYouTubeId } from '@/lib/youtube-helper';
import denaMwanaChords from '@/lib/dena-mwana-chords.json';

interface YouTubeVideoFinderProps {
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  onVideoIdUpdate?: (songId: number, videoId: string) => void;
}

const YouTubeVideoFinder: React.FC<YouTubeVideoFinderProps> = ({ 
  onSearch, 
  isLoading = false, 
  onVideoIdUpdate 
}) => {
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [videoId, setVideoId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleVideoIdChange = (value: string) => {
    setVideoId(value);
    const extractedId = extractYouTubeId(value) || value;
    const valid = isValidYouTubeId(extractedId);
    setIsValid(valid);
  };

  const handleSearch = (suggestion: string) => {
    setSearchQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      const searchUrl = createYouTubeSearchUrl(suggestion);
      window.open(searchUrl, '_blank');
    }
  };

  const handleUpdateVideoId = () => {
    if (selectedSong && videoId && isValid) {
      const extractedId = extractYouTubeId(videoId) || videoId;
      onVideoIdUpdate?.(selectedSong.id, extractedId);
      setVideoId('');
      setIsValid(null);
    }
  };

  const getStatusIcon = () => {
    if (isValid === null) return null;
    return isValid ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusText = () => {
    if (isValid === null) return '';
    return isValid ? 'Valid YouTube ID' : 'Invalid YouTube ID';
  };

  // If this is being used for general search (not song-specific)
  if (onSearch && !onVideoIdUpdate) {
    return (
      <div className="flex space-x-2">
        <Input
          placeholder="Search for gospel songs, worship music, or specific artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          className="flex-1"
        />
        <Button 
          onClick={() => handleSearch(searchQuery)} 
          disabled={!searchQuery.trim() || isLoading}
          className="px-6"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            YouTube Video Finder
          </CardTitle>
          <CardDescription>
            Find and update YouTube video IDs for each song
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Song Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Song</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {denaMwanaChords.songs.map((song: any) => (
                <Button
                  key={song.id}
                  variant={selectedSong?.id === song.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSong(song)}
                  className="justify-start text-left"
                >
                  <Music className="h-4 w-4 mr-2" />
                  {song.title}
                  {song.youtube_id && (
                    <Badge variant="secondary" className="ml-2">
                      Has Video
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {selectedSong && (
            <>
              {/* Search Suggestions */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search Suggestions</label>
                <div className="flex flex-wrap gap-2">
                  {generateSearchSuggestions(selectedSong).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(suggestion)}
                      className="flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      {suggestion}
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Video ID Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">YouTube Video ID or URL</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter YouTube video ID or URL"
                    value={videoId}
                    onChange={(e) => handleVideoIdChange(e.target.value)}
                    className="flex-1"
                  />
                  {getStatusIcon()}
                </div>
                {videoId && (
                  <p className={`text-sm mt-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {getStatusText()}
                  </p>
                )}
              </div>

              {/* Current Video Preview */}
              {selectedSong.youtube_id && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Video</label>
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedSong.youtube_id}`}
                      title={selectedSong.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Update Button */}
              <Button
                onClick={handleUpdateVideoId}
                disabled={!videoId || !isValid}
                className="w-full"
              >
                Update Video ID
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Find YouTube Videos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold">Step 1: Search for the Song</h4>
            <p className="text-sm text-muted-foreground">
              Click on any search suggestion to open YouTube in a new tab. Look for official Dena Mwana videos.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Step 2: Copy the Video ID</h4>
            <p className="text-sm text-muted-foreground">
              From the YouTube URL, copy either the full URL or just the video ID (the part after "v=").
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Step 3: Paste and Update</h4>
            <p className="text-sm text-muted-foreground">
              Paste the URL or video ID into the input field and click "Update Video ID".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeVideoFinder;
