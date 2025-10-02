import { createClient } from '@supabase/supabase-js'

// Function to create Supabase client safely
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if we have valid environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found')
    return null
  }

  // Validate URL format
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    console.warn('Invalid Supabase URL format')
    return null
  }

  // Validate key length
  if (supabaseAnonKey.length < 20) {
    console.warn('Invalid Supabase anon key')
    return null
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}

// Create the client
const supabase = createSupabaseClient()

export { supabase }

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'moderator' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'moderator' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'moderator' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      artists: {
        Row: {
          id: string
          name: string
          bio: string | null
          image_url: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          bio?: string | null
          image_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          image_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      songs: {
        Row: {
          id: string
          title: string
          artist_id: string
          genre: string | null
          key_signature: string | null
          tempo: number | null
          chords: string[] | null
          lyrics: string | null
          description: string | null
          year: number | null
          rating: number
          downloads: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          artist_id: string
          genre?: string | null
          key_signature?: string | null
          tempo?: number | null
          chords?: string[] | null
          lyrics?: string | null
          description?: string | null
          year?: number | null
          rating?: number
          downloads?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist_id?: string
          genre?: string | null
          key_signature?: string | null
          tempo?: number | null
          chords?: string[] | null
          lyrics?: string | null
          description?: string | null
          year?: number | null
          rating?: number
          downloads?: number
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'pdf' | 'video' | 'audio' | 'image' | 'document' | null
          category: string | null
          file_url: string | null
          file_size: number | null
          downloads: number
          rating: number
          author: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type?: 'pdf' | 'video' | 'audio' | 'image' | 'document' | null
          category?: string | null
          file_url?: string | null
          file_size?: number | null
          downloads?: number
          rating?: number
          author?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'pdf' | 'video' | 'audio' | 'image' | 'document' | null
          category?: string | null
          file_url?: string | null
          file_size?: number | null
          downloads?: number
          rating?: number
          author?: string
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          song_id: string | null
          resource_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          song_id?: string | null
          resource_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          song_id?: string | null
          resource_id?: string | null
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          user_id: string
          song_id: string | null
          resource_id: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          song_id?: string | null
          resource_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          song_id?: string | null
          resource_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      song_requests: {
        Row: {
          id: string
          user_id: string
          title: string
          artist: string | null
          genre: string | null
          message: string | null
          status: 'pending' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          artist?: string | null
          genre?: string | null
          message?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          artist?: string | null
          genre?: string | null
          message?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
