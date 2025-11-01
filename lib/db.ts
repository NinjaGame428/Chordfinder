import postgres, { Sql } from 'postgres';

type PostgresClient = Sql<{}>;

// Function to create PostgreSQL client for Neon
const createDbClient = (): PostgresClient | null => {
  const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn('Neon database URL not found');
    return null;
  }

  try {
    // Create connection with optimized settings for serverless
    const sql = postgres(databaseUrl, {
      max: 1, // Limit connections for serverless
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    return sql;
  } catch (error) {
    console.error('Failed to create Neon database client:', error);
    return null;
  }
};

// Create the client
const db = createDbClient();

// Helper function to safely execute queries
export const query = async <T = any>(queryFn: (sql: PostgresClient) => Promise<T>): Promise<T> => {
  if (!db) {
    throw new Error('Database connection not available');
  }
  return queryFn(db);
};

// Database types (same as before, but now compatible with Neon)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'moderator' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'moderator' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'moderator' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      artists: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          image_url: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio?: string | null;
          image_url?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string | null;
          image_url?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      songs: {
        Row: {
          id: string;
          title: string;
          artist_id: string;
          genre: string | null;
          key_signature: string | null;
          tempo: number | null;
          chords: string[] | null;
          lyrics: string | null;
          description: string | null;
          year: number | null;
          rating: number;
          downloads: number;
          created_at: string;
          updated_at: string;
          slug?: string | null;
          artist?: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          artist_id: string;
          genre?: string | null;
          key_signature?: string | null;
          tempo?: number | null;
          chords?: string[] | null;
          lyrics?: string | null;
          description?: string | null;
          year?: number | null;
          rating?: number;
          downloads?: number;
          created_at?: string;
          updated_at?: string;
          slug?: string | null;
          artist?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          artist_id?: string;
          genre?: string | null;
          key_signature?: string | null;
          tempo?: number | null;
          chords?: string[] | null;
          lyrics?: string | null;
          description?: string | null;
          year?: number | null;
          rating?: number;
          downloads?: number;
          created_at?: string;
          updated_at?: string;
          slug?: string | null;
          artist?: string | null;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: 'pdf' | 'video' | 'audio' | 'image' | 'document' | null;
          category: string | null;
          file_url: string | null;
          file_size: number | null;
          downloads: number;
          rating: number;
          author: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type?: 'pdf' | 'video' | 'audio' | 'image' | 'document' | null;
          category?: string | null;
          file_url?: string | null;
          file_size?: number | null;
          downloads?: number;
          rating?: number;
          author?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          type?: 'pdf' | 'video' | 'audio' | 'image' | 'document' | null;
          category?: string | null;
          file_url?: string | null;
          file_size?: number | null;
          downloads?: number;
          rating?: number;
          author?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          song_id: string | null;
          resource_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          song_id?: string | null;
          resource_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          song_id?: string | null;
          resource_id?: string | null;
          created_at?: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          song_id: string | null;
          resource_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          song_id?: string | null;
          resource_id?: string | null;
          rating: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          song_id?: string | null;
          resource_id?: string | null;
          rating?: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      song_requests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          artist: string | null;
          genre: string | null;
          message: string | null;
          status: 'pending' | 'in_progress' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          artist?: string | null;
          genre?: string | null;
          message?: string | null;
          status?: 'pending' | 'in_progress' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          artist?: string | null;
          genre?: string | null;
          message?: string | null;
          status?: 'pending' | 'in_progress' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export { db };
export default db;

