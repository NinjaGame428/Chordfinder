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

// Fetch recent activity from user_activities table
export const fetchRecentActivity = async (userId: string): Promise<RecentActivity[]> => {
  if (!supabase) {
    return [];
  }
  
  try {
    // Fetch from user_activities table (real activity tracking)
    const { data: userActivities, error: activitiesError } = await supabase
      .from('user_activities')
      .select(`
        id,
        activity_type,
        description,
        metadata,
        page,
        action,
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (activitiesError) {
      console.error('Error fetching user activities:', activitiesError);
      // Fallback to old method if table doesn't exist or error occurs
      return await fetchRecentActivityFallback(userId);
    }

    if (!userActivities || userActivities.length === 0) {
      // Fallback to old method if no activities found
      return await fetchRecentActivityFallback(userId);
    }

    // Map user_activities to RecentActivity format
    const activities: RecentActivity[] = userActivities.map((activity: any) => {
      const metadata = activity.metadata ? (typeof activity.metadata === 'string' ? JSON.parse(activity.metadata) : activity.metadata) : {};
      
      // Determine icon and type based on activity_type
      let icon = 'Clock';
      let type: 'favorite' | 'download' | 'rating' = 'favorite';
      
      if (activity.activity_type?.toLowerCase().includes('favorite')) {
        icon = 'Heart';
        type = 'favorite';
      } else if (activity.activity_type?.toLowerCase().includes('download')) {
        icon = 'Download';
        type = 'download';
      } else if (activity.activity_type?.toLowerCase().includes('rating') || activity.activity_type?.toLowerCase().includes('rate')) {
        icon = 'Star';
        type = 'rating';
      }

      return {
        id: activity.id,
        type,
        title: activity.description || activity.activity_type || 'Activity',
        description: activity.page || metadata?.title || '',
        timestamp: activity.created_at,
        icon
      };
    });

    return activities.slice(0, 20);

  } catch (error) {
    console.error('Error in fetchRecentActivity:', error);
    // Fallback to old method
    return await fetchRecentActivityFallback(userId);
  }
};

// Fallback method using old approach (favorites, downloads, ratings)
const fetchRecentActivityFallback = async (userId: string): Promise<RecentActivity[]> => {
  const activities: RecentActivity[] = [];

  // Get recent favorites
  try {
    if (!supabase) return [];
    
    const { data: recentFavorites } = await supabase
      .from('favorites')
      .select(`id, created_at, song_id`)
      .eq('user_id', userId)
      .not('song_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentFavorites) {
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
    // Silently ignore
  }

  // Get recent downloads
  try {
    if (!supabase) return activities;
    
    const { data: recentDownloads } = await supabase
      .from('downloads')
      .select(`id, created_at, resource_id`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentDownloads) {
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
    // Silently ignore
  }

  // Get recent ratings
  try {
    if (!supabase) return activities;
    
    const { data: recentRatings } = await supabase
      .from('ratings')
      .select(`id, rating, created_at, song_id`)
      .eq('user_id', userId)
      .not('song_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentRatings) {
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
    // Silently ignore
  }

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
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
