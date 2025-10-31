"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  onTimeUpdate?: (time: number) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId, 
  title,
  onTimeUpdate 
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">{title || 'Video Player'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={title || 'YouTube video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="border-0"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubePlayer;

