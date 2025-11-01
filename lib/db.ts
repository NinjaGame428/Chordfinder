import postgres, { Sql } from 'postgres';

type PostgresClient = Sql<{}>;

// Function to create PostgreSQL client for Neon
const createDbClient = (): PostgresClient | null => {
  // Try NEON_DATABASE_URL first, then DATABASE_URL
  const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('Database URL not found. Please set NEON_DATABASE_URL or DATABASE_URL environment variable.');
    return null;
  }

  try {
    // Create connection with optimized settings for serverless
    const sql = postgres(databaseUrl, {
      max: 1, // Limit connections for serverless
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: 'require'
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
    throw new Error('Database connection not available. Please check your NEON_DATABASE_URL or DATABASE_URL environment variable.');
  }
  try {
    return await queryFn(db);
  } catch (error: any) {
    console.error('Database query error:', error);
    // Provide more helpful error messages
    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      throw new Error('Database table does not exist. Please run the migration script in Neon SQL Editor.');
    }
    if (error.message?.includes('connection')) {
      throw new Error('Database connection failed. Please check your connection string.');
    }
    throw error;
  }
};

// Export database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'moderator' | 'admin';
          created_at: string;
          updated_at: string;
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
      };
    };
  };
}

export { db };
export default db;
