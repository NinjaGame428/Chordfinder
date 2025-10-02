/**
 * YouTube Helper Utilities
 * This file contains utilities to help find and update YouTube video IDs
 */

export interface YouTubeVideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
}

export interface SongWithYouTube {
  id: number;
  title: string;
  english_title?: string;
  youtube_id?: string;
  youtube_url?: string;
  needs_update: boolean;
}

/**
 * Generate YouTube search URLs for each song
 * This helps you manually find the correct videos
 */
export const generateYouTubeSearchUrls = (songs: any[]): SongWithYouTube[] => {
  return songs.map(song => ({
    id: song.id,
    title: song.title,
    english_title: song.english_title,
    youtube_id: song.youtube_id,
    youtube_url: song.youtube_id ? `https://www.youtube.com/watch?v=${song.youtube_id}` : undefined,
    needs_update: !song.youtube_id || song.youtube_id.startsWith('Qw4w9WgXcQ') // Check if it's a placeholder
  }));
};

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Validate YouTube video ID format
 */
export const isValidYouTubeId = (id: string): boolean => {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
};

/**
 * Generate search suggestions for finding Dena Mwana videos
 */
export const generateSearchSuggestions = (song: any): string[] => {
  const suggestions = [
    `"Dena Mwana" "${song.title}"`,
    `"Dena Mwana" "${song.english_title || song.title}"`,
    `"Dena Mwana" "${song.title}" official`,
    `"Dena Mwana" "${song.title}" live`,
    `"Dena Mwana" "${song.title}" music video`
  ];
  
  if (song.album) {
    suggestions.push(`"Dena Mwana" "${song.title}" "${song.album}"`);
  }
  
  return suggestions;
};

/**
 * Create a YouTube search URL
 */
export const createYouTubeSearchUrl = (query: string): string => {
  const encodedQuery = encodeURIComponent(query);
  return `https://www.youtube.com/results?search_query=${encodedQuery}`;
};

/**
 * Generate piano chords based on song key and common progressions
 */
export const generatePianoChords = (song: any): string[] => {
  const key = song.key.toLowerCase();
  const commonProgressions: { [key: string]: string[] } = {
    'c major': ['C', 'Am', 'F', 'G'],
    'g major': ['G', 'Em', 'C', 'D'],
    'd major': ['D', 'Bm', 'G', 'A'],
    'a major': ['A', 'F#m', 'D', 'E'],
    'e major': ['E', 'C#m', 'A', 'B'],
    'b major': ['B', 'G#m', 'E', 'F#'],
    'f major': ['F', 'Dm', 'Bb', 'C'],
    'bb major': ['Bb', 'Gm', 'Eb', 'F'],
    'eb major': ['Eb', 'Cm', 'Ab', 'Bb'],
    'ab major': ['Ab', 'Fm', 'Db', 'Eb'],
    'db major': ['Db', 'Bbm', 'Gb', 'Ab'],
    'gb major': ['Gb', 'Ebm', 'Cb', 'Db']
  };
  
  return commonProgressions[key] || ['C', 'Am', 'F', 'G'];
};

/**
 * Generate chord progression variations
 */
export const generateChordVariations = (baseChords: string[]): string[] => {
  const variations = [...baseChords];
  
  // Add common variations
  if (baseChords.includes('C')) {
    variations.push('Am', 'F', 'G');
  }
  if (baseChords.includes('G')) {
    variations.push('Em', 'C', 'D');
  }
  if (baseChords.includes('D')) {
    variations.push('Bm', 'G', 'A');
  }
  
  return Array.from(new Set(variations)); // Remove duplicates
};
