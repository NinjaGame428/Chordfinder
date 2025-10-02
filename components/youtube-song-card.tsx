"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, User, ExternalLink, Heart, Play, Eye, Clock, Globe, Captions } from "lucide-react";
import { Song } from "@/lib/song-data";
import { useFavorites } from "@/contexts/FavoritesContext";
import Link from "next/link";
import Image from "next/image";

interface YouTubeSongCardProps {
  song: Song;
  viewMode: 'grid' | 'list';
  onToggleFavorite: (song: Song) => void;
  isFavorite: boolean;
}

export const YouTubeSongCard = ({ song, viewMode, onToggleFavorite, isFavorite }: YouTubeSongCardProps) => {
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

  const formatDuration = (duration: string) => {
    if (!duration) return '';
    return duration;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (viewMode === 'list') {
    return (
      <div className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        {/* Thumbnail */}
        {song.thumbnail && (
          <div className="flex-shrink-0">
            <Image
              src={song.thumbnail}
              alt={song.title}
              width={120}
              height={90}
              className="rounded-lg object-cover"
            />
          </div>
        )}
        
        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {song.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {song.artist}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(song.duration || '')}
                </span>
                <span className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {song.language || 'en'}
                </span>
                {song.captions_available && (
                  <span className="flex items-center">
                    <Captions className="h-4 w-4 mr-1" />
                    Captions
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={getDifficultyColor(song.difficulty)}>
                {song.difficulty}
              </Badge>
              <Badge variant="outline">
                {song.key}
              </Badge>
            </div>
          </div>
          
          {/* Chords */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {song.chords.slice(0, 4).map((chord, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {chord}
                </Badge>
              ))}
              {song.chords.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{song.chords.length - 4}
                </Badge>
              )}
            </div>
            {/* Show chord progression for Dena Mwana songs */}
            {song.category === 'Dena Mwana Collection' && song.chordProgression && (
              <div className="mt-1 text-xs text-muted-foreground">
                Progression: {song.chordProgression}
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(song)}
            className="rounded-full"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/songs/${song.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
          {song.url && (
            <Button size="sm" asChild>
              <a href={song.url} target="_blank" rel="noopener noreferrer">
                <Play className="h-4 w-4 mr-1" />
                Play
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {song.title}
            </CardTitle>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-1" />
              {song.artist}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatDate(song.published_at || '')}
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
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Thumbnail */}
      {song.thumbnail && (
        <div className="px-6 pb-3">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={song.thumbnail}
              alt={song.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {song.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {formatDuration(song.duration)}
              </div>
            )}
          </div>
        </div>
      )}
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <Badge className={getDifficultyColor(song.difficulty)}>
            {song.difficulty}
          </Badge>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {song.category}
            </Badge>
            {song.quality && (
              <Badge variant="outline" className="text-xs">
                {song.quality}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Chords */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {song.chords.slice(0, 6).map((chord, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {chord}
              </Badge>
            ))}
            {song.chords.length > 6 && (
              <Badge variant="secondary" className="text-xs">
                +{song.chords.length - 6}
              </Badge>
            )}
          </div>
          {/* Show chord progression for Dena Mwana songs */}
          {song.category === 'Dena Mwana Collection' && song.chordProgression && (
            <div className="mt-2 text-xs text-muted-foreground">
              Progression: {song.chordProgression}
            </div>
          )}
        </div>
        
        {/* Video Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-3">
            {song.language && (
              <span className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                {song.language}
              </span>
            )}
            {song.captions_available && (
              <span className="flex items-center">
                <Captions className="h-3 w-3 mr-1" />
                Captions
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
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
          {song.url && (
            <Button 
              className="w-full"
              asChild
            >
              <a href={song.url} target="_blank" rel="noopener noreferrer">
                <Play className="mr-2 h-4 w-4" />
                Play on YouTube
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
