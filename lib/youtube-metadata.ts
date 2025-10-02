/**
 * Enhanced YouTube Metadata Service
 * Integrates with Dena Mwana chord collection data
 */

export interface YouTubeVideoDetails {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  duration: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard: { url: string; width: number; height: number };
    maxres: { url: string; width: number; height: number };
  };
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: string;
  defaultLanguage?: string;
  localized: {
    title: string;
    description: string;
  };
}

export interface YouTubeSearchResult {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
}

export interface DenaMwanaSong {
  id: number;
  title: string;
  english_title?: string;
  album?: string;
  year?: number;
  key: string;
  bpm: number;
  difficulty: string;
  youtube_id: string;
  slug: string;
  chords: {
    piano: {
      primary: string[];
      progression: string;
      variations: string[];
    };
    guitar: {
      primary: string[];
      capo: number;
      tuning: string;
      chord_diagrams: Record<string, string>;
    };
  };
  song_structure: {
    intro: string[];
    verse: string[];
    chorus: string[];
    bridge: string[];
    outro: string[];
  };
}

class YouTubeMetadataService {
  private readonly YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';

  /**
   * Get video details by video ID
   */
  async getVideoDetails(videoId: string): Promise<YouTubeVideoDetails | null> {
    if (!this.YOUTUBE_API_KEY) {
      console.warn('YouTube API key not found. Using fallback data.');
      return this.getFallbackVideoDetails(videoId);
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return null;
      }

      const video = data.items[0];
      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        channelTitle: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        thumbnails: video.snippet.thumbnails,
        tags: video.snippet.tags || [],
        categoryId: video.snippet.categoryId,
        liveBroadcastContent: video.snippet.liveBroadcastContent,
        defaultLanguage: video.snippet.defaultLanguage,
        localized: video.snippet.localized
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      return this.getFallbackVideoDetails(videoId);
    }
  }

  /**
   * Search for videos with enhanced metadata
   */
  async searchVideos(query: string, maxResults: number = 10): Promise<YouTubeSearchResult[]> {
    if (!this.YOUTUBE_API_KEY) {
      console.warn('YouTube API key not found. Using fallback search.');
      return this.getFallbackSearchResults(query);
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${this.YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails
      }));
    } catch (error) {
      console.error('Error searching videos:', error);
      return this.getFallbackSearchResults(query);
    }
  }

  /**
   * Search for Dena Mwana songs specifically
   */
  async searchDenaMwanaSongs(query: string = "Dena Mwana gospel"): Promise<YouTubeSearchResult[]> {
    const searchQuery = `${query} gospel worship piano guitar chords`;
    return this.searchVideos(searchQuery, 20);
  }

  /**
   * Get fallback video details when API is not available
   */
  private getFallbackVideoDetails(videoId: string): YouTubeVideoDetails {
    return {
      id: videoId,
      title: 'Sample Video Title',
      description: 'This is a sample video description. YouTube API key is not configured.',
      channelTitle: 'Sample Channel',
      channelId: 'sample_channel_id',
      publishedAt: new Date().toISOString(),
      duration: 'PT3M33S',
      thumbnails: {
        default: { url: `https://img.youtube.com/vi/${videoId}/default.jpg`, width: 120, height: 90 },
        medium: { url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, width: 320, height: 180 },
        high: { url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, width: 480, height: 360 },
        standard: { url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, width: 640, height: 480 },
        maxres: { url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, width: 1280, height: 720 }
      },
      tags: ['sample', 'video'],
      categoryId: '10',
      liveBroadcastContent: 'none',
      localized: {
        title: 'Sample Video Title',
        description: 'This is a sample video description.'
      }
    };
  }

  /**
   * Get fallback search results when API is not available
   */
  private getFallbackSearchResults(query: string): YouTubeSearchResult[] {
    return [
      {
        id: 'dQw4w9WgXcQ',
        title: `Sample result for "${query}"`,
        description: 'This is a sample search result. YouTube API key is not configured.',
        channelTitle: 'Sample Channel',
        publishedAt: new Date().toISOString(),
        thumbnails: {
          default: { url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg', width: 120, height: 90 },
          medium: { url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg', width: 320, height: 180 },
          high: { url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', width: 480, height: 360 }
        }
      }
    ];
  }

  /**
   * Parse YouTube duration (PT3M33S format) to seconds
   */
  parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Format duration in seconds to readable format
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Get thumbnail URL with specific quality
   */
  getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string {
    const qualityMap = {
      default: 'default',
      medium: 'mqdefault',
      high: 'hqdefault',
      standard: 'sddefault',
      maxres: 'maxresdefault'
    };
    
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
  }

  /**
   * Validate YouTube video ID
   */
  isValidVideoId(videoId: string): boolean {
    return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
  }

  /**
   * Extract video ID from YouTube URL
   */
  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/user\/\w+\/?#\w\/\d+\/([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }
}

export const youtubeMetadataService = new YouTubeMetadataService();
export default youtubeMetadataService;
