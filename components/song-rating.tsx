"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

interface SongRatingProps {
  songId: number;
  songTitle: string;
  songArtist: string;
  className?: string;
}

interface Rating {
  id: string;
  songId: number;
  rating: number;
  comment: string;
  timestamp: string;
  userId: string;
}

const SongRating: React.FC<SongRatingProps> = ({ 
  songId, 
  songTitle, 
  songArtist, 
  className = '' 
}) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const { isSongFavorite, addSongToFavorites, removeSongFromFavorites } = useFavorites();

  // Load ratings from localStorage
  useEffect(() => {
    const savedRatings = localStorage.getItem(`song-ratings-${songId}`);
    if (savedRatings) {
      const parsedRatings = JSON.parse(savedRatings);
      setRatings(parsedRatings);
      
      // Calculate average rating
      if (parsedRatings.length > 0) {
        const sum = parsedRatings.reduce((acc: number, rating: Rating) => acc + rating.rating, 0);
        setAverageRating(sum / parsedRatings.length);
        setTotalRatings(parsedRatings.length);
      }
    }

    // Load user's previous rating
    const userRatingKey = `user-rating-${songId}`;
    const savedUserRating = localStorage.getItem(userRatingKey);
    if (savedUserRating) {
      setUserRating(parseInt(savedUserRating));
    }
  }, [songId]);

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
    
    // Save user rating
    localStorage.setItem(`user-rating-${songId}`, rating.toString());
    
    // Create new rating entry
    const newRating: Rating = {
      id: `rating-${Date.now()}`,
      songId,
      rating,
      comment: comment || '',
      timestamp: new Date().toISOString(),
      userId: 'user-' + Math.random().toString(36).substr(2, 9)
    };

    // Update ratings
    const updatedRatings = [...ratings.filter(r => r.userId !== newRating.userId), newRating];
    setRatings(updatedRatings);
    localStorage.setItem(`song-ratings-${songId}`, JSON.stringify(updatedRatings));
    
    // Recalculate average
    const sum = updatedRatings.reduce((acc, rating) => acc + rating.rating, 0);
    setAverageRating(sum / updatedRatings.length);
    setTotalRatings(updatedRatings.length);
    
    setComment('');
    setShowCommentForm(false);
  };

  const handleToggleFavorite = () => {
    if (isSongFavorite(songId)) {
      removeSongFromFavorites(songId);
    } else {
      addSongToFavorites({
        id: songId,
        title: songTitle,
        artist: songArtist,
        key: 'C', // Default key
        difficulty: 'Medium', // Default difficulty
        category: 'Gospel' // Default category
      });
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-yellow-500";
    if (rating >= 2) return "text-orange-500";
    return "text-red-500";
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Rate This Song
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Help other musicians by rating this song's chord progression and difficulty
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Rating Display */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer transition-colors ${
                    star <= (hoverRating || userRating)
                      ? 'fill-current text-yellow-500'
                      : 'text-gray-300'
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingClick(star)}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {userRating > 0 ? getRatingText(userRating) : 'Rate this song'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isSongFavorite(songId) ? 'fill-current text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Average Rating */}
        {totalRatings > 0 && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-current text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </div>
            <Badge variant="secondary">
              {totalRatings} rating{totalRatings !== 1 ? 's' : ''}
            </Badge>
          </div>
        )}

        {/* Comment Form */}
        {userRating > 0 && (
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {showCommentForm ? 'Hide Comment' : 'Add Comment'}
            </Button>
            
            {showCommentForm && (
              <div className="space-y-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this song's chord progression, difficulty, or any tips for other musicians..."
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRatingClick(userRating)}
                    className="rounded-full"
                  >
                    Save Comment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCommentForm(false)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Ratings */}
        {ratings.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Recent Ratings</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ratings.slice(-3).reverse().map((rating) => (
                <div key={rating.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rating.rating
                            ? 'fill-current text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{getRatingText(rating.rating)}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rating.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground">{rating.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SongRating;
