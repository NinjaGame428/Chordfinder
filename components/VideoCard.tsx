'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Play } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  description?: string;
  publishedAt?: string;
  channelTitle?: string;
  duration?: string;
  viewCount?: string;
}

interface VideoCardProps {
  video: VideoData;
  index?: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index = 0 }) => {
  const handleVideoClick = () => {
    window.open(video.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover rounded-t-lg"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-t-lg flex items-center justify-center">
            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            #{index + 1}
          </div>
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>
          
          {video.channelTitle && (
            <p className="text-xs text-muted-foreground mb-2">
              {video.channelTitle}
            </p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                YouTube Video
              </span>
              <span className="text-xs text-gray-500">
                ID: {video.id.slice(0, 8)}...
              </span>
            </div>
            <button
              onClick={handleVideoClick}
              className="w-full flex items-center justify-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-md"
              aria-label={`Open video: ${video.title}`}
            >
              <ExternalLink className="h-3 w-3" />
              Watch on YouTube
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
