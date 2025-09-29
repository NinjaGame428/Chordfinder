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
  try {
    const activities: RecentActivity[] = [];

    // Get recent favorites
    const { data: recentFavorites } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        songs!inner(title, artist)
      `)
      .eq('user_id', userId)
      .not('song_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentFavorites) {
      recentFavorites.forEach((fav: any) => {
        activities.push({
          id: fav.id,
          type: 'favorite',
          title: `Added "${fav.songs.title}" to favorites`,
          description: `by ${fav.songs.artist}`,
          timestamp: fav.created_at,
          icon: 'Heart'
        });
      });
    }

    // Get recent downloads
    const { data: recentDownloads } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        resources!inner(title, type)
      `)
      .eq('user_id', userId)
      .not('resource_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentDownloads) {
      recentDownloads.forEach((download: any) => {
        activities.push({
          id: download.id,
          type: 'download',
          title: `Downloaded "${download.resources.title}"`,
          description: `${download.resources.type} resource`,
          timestamp: download.created_at,
          icon: 'Download'
        });
      });
    }

    // Get recent ratings
    const { data: recentRatings } = await supabase
      .from('ratings')
      .select(`
        id,
        rating,
        created_at,
        songs!inner(title, artist)
      `)
      .eq('user_id', userId)
      .not('song_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentRatings) {
      recentRatings.forEach((rating: any) => {
        activities.push({
          id: rating.id,
          type: 'rating',
          title: `Rated "${rating.songs.title}" ${rating.rating} stars`,
          description: `by ${rating.songs.artist}`,
          timestamp: rating.created_at,
          icon: 'Star'
        });
      });
    }

    // Sort by timestamp and return latest 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

// Fetch user's favorite songs
export const fetchFavoriteSongs = async (userId: string): Promise<FavoriteSong[]> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        songs!inner(
          id,
          title,
          artist,
          genre,
          key_signature
        )
      `)
      .eq('user_id', userId)
      .not('song_id', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map((fav: any) => ({
      id: fav.songs.id,
      title: fav.songs.title,
      artist: fav.songs.artist,
      genre: fav.songs.genre,
      key_signature: fav.songs.key_signature,
      created_at: fav.created_at
    })) || [];

  } catch (error) {
    console.error('Error fetching favorite songs:', error);
    return [];
  }
};

// Fetch user's downloaded resources
export const fetchDownloadedResources = async (userId: string): Promise<DownloadedResource[]> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        resources!inner(
          id,
          title,
          type,
          category,
          file_size
        )
      `)
      .eq('user_id', userId)
      .not('resource_id', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map((download: any) => ({
      id: download.resources.id,
      title: download.resources.title,
      type: download.resources.type,
      category: download.resources.category,
      file_size: download.resources.file_size,
      created_at: download.created_at
    })) || [];

  } catch (error) {
    console.error('Error fetching downloaded resources:', error);
    return [];
  }
};

// Update user stats in database
export const updateUserStats = async (userId: string, stats: UserStats): Promise<boolean> => {
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
