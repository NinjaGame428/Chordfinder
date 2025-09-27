import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have valid environment variables
export const supabase = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'moderator' | 'admin'
  created_at: string
  updated_at: string
}

export interface Song {
  id: string
  title: string
  artist: string
  genre: string
  key: string
  tempo: number
  chords: string[]
  lyrics: string
  description?: string
  year?: number
  rating?: number
  downloads: number
  created_at: string
  updated_at: string
}

export interface Artist {
  id: string
  name: string
  bio?: string
  image_url?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: string
  category: string
  file_url?: string
  file_size?: number
  downloads: number
  rating?: number
  author: string
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  song_id?: string
  resource_id?: string
  created_at: string
}

export interface Rating {
  id: string
  user_id: string
  song_id?: string
  resource_id?: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
}
