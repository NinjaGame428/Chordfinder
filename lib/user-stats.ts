import { supabase } from './supabase';

export interface UserStats {
  favoriteSongs: number;
  downloadedResources: number;
  ratingsGiven: number;
  lastActive: string;
}

export interface RecentActivity {
  id: string;
  type: 'favorite' | 'download' | 'rating';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface FavoriteSong {
  id: string;
  title: string;
  artist: string;
  genre: string;
  key_signature: string;
  created_at: string;
}

export interface DownloadedResource {
  id: string;
  title: string;
  type: string;
  category: string;
  file_size: number;
  created_at: string;
}

// Fetch real user statistics
export const fetchUserStats = async (userId: string): Promise<UserStats> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }
  
  try {
    // Get favorite songs count
    const { count: favoriteSongs } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('song_id', 'is', null);

    // Get downloaded resources count
    const { count: downloadedResources } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('resource_id', 'is', null);

    // Get ratings count
    const { count: ratingsGiven } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      favoriteSongs: favoriteSongs || 0,
      downloadedResources: downloadedResources || 0,
      ratingsGiven: ratingsGiven || 0,
      lastActive: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      favoriteSongs: 0,
      downloadedResources: 0,
      ratingsGiven: 0,
      lastActive: new Date().toISOString()
    };
  }
};

// Fetch recent activity
export const fetchRecentActivity = async (userId: string): Promise<RecentActivity[]> => {
  if (!supabase) {
    return [];
  }
  
  try {
    const activities: RecentActivity[] = [];

    // Get recent favorites - silently fail if table doesn't exist
    try {
      const { data: recentFavorites, error: favError } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          song_id
        `)
        .eq('user_id', userId)
        .not('song_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!favError && recentFavorites) {
        recentFavorites.forEach((fav: any) => {
          activities.push({
            id: fav.id,
            type: 'favorite',
            title: `Added a song to favorites`,
            description: `Recently favorited`,
            timestamp: fav.created_at,
            icon: 'Heart'
          });
        });
      }
    } catch (err) {
      // Silently ignore if favorites table doesn't exist
    }

    // Get recent downloads - silently fail if table doesn't exist
    try {
      const { data: recentDownloads, error: downloadError } = await supabase
        .from('downloads')
        .select(`
          id,
          created_at,
          resource_id
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!downloadError && recentDownloads) {
        recentDownloads.forEach((download: any) => {
          activities.push({
            id: download.id,
            type: 'download',
            title: `Downloaded a resource`,
            description: `Recently downloaded`,
            timestamp: download.created_at,
            icon: 'Download'
          });
        });
      }
    } catch (err) {
      // Silently ignore if downloads table doesn't exist
    }

    // Get recent ratings - silently fail if table doesn't exist
    try {
      const { data: recentRatings, error: ratingError } = await supabase
        .from('ratings')
        .select(`
          id,
          rating,
          created_at,
          song_id
        `)
        .eq('user_id', userId)
        .not('song_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!ratingError && recentRatings) {
        recentRatings.forEach((rating: any) => {
          const ratingValue = rating.rating || 0;
          
          activities.push({
            id: rating.id,
            type: 'rating',
            title: `Rated a song ${ratingValue} stars`,
            description: `Recently rated`,
            timestamp: rating.created_at,
            icon: 'Star'
          });
        });
      }
    } catch (err) {
      // Silently ignore if ratings table doesn't exist
    }

    // Sort by timestamp and return latest 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

  } catch (error) {
    // Silently return empty array on any error
    return [];
  }
};

// Fetch user's favorite songs
export const fetchFavoriteSongs = async (userId: string): Promise<FavoriteSong[]> => {
  if (!supabase) {
    return [];
  }
  
  try {
    // First check if the favorites table exists
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        song_id
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      // If table doesn't exist or there's a schema error, return empty array silently
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Get song details for each favorite
    const songIds = data.map(fav => fav.song_id).filter(Boolean);
    
    if (songIds.length === 0) {
      return [];
    }

    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select(`
        id,
        title,
        artist_id,
        genre,
        key_signature
      `)
      .in('id', songIds);

    if (songsError) {
      // Could not fetch song details, return empty array
      return [];
    }

    // Map favorites with song details
    return data.map((fav: any) => {
      const song = songs?.find(s => s.id === fav.song_id);
      return {
        id: song?.id || fav.song_id || '',
        title: song?.title || 'Unknown Song',
        artist: 'Unknown Artist',
        genre: song?.genre || 'Unknown Genre',
        key_signature: song?.key_signature || 'Unknown Key',
        created_at: fav.created_at
      };
    }).filter(fav => fav.id);

  } catch (error) {
    // Silently return empty array on any error
    return [];
  }
};

// Fetch user's downloaded resources
export const fetchDownloadedResources = async (userId: string): Promise<DownloadedResource[]> => {
  if (!supabase) {
    return [];
  }
  
  try {
    // Check if downloads table exists
    const { data, error } = await supabase
      .from('downloads')
      .select(`
        id,
        created_at,
        resource_id
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      // Downloads table not available, return empty array silently
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Get resource details
    const resourceIds = data.map(d => d.resource_id).filter(Boolean);
    
    if (resourceIds.length === 0) {
      return [];
    }

    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select(`
        id,
        title,
        type,
        category,
        file_size
      `)
      .in('id', resourceIds);

    if (resourcesError) {
      // Could not fetch resource details, return empty array
      return [];
    }

    return data.map((download: any) => {
      const resource = resources?.find(r => r.id === download.resource_id);
      return {
        id: resource?.id || download.resource_id || '',
        title: resource?.title || 'Unknown Resource',
        type: resource?.type || 'Unknown Type',
        category: resource?.category || 'Unknown Category',
        file_size: resource?.file_size || 0,
        created_at: download.created_at
      };
    }).filter(d => d.id);

  } catch (error) {
    // Silently return empty array on any error
    return [];
  }
};

// Update user stats in database
export const updateUserStats = async (userId: string, stats: UserStats): Promise<boolean> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }
  
  try {
    const { error } = await supabase
      .from('users')
      .update({
        stats: {
          favoriteSongs: stats.favoriteSongs,
          downloadedResources: stats.downloadedResources,
          ratingsGiven: stats.ratingsGiven,
          lastActive: stats.lastActive
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user stats:', error);
    return false;
  }
};
