import { supabase } from './supabase'
import type { User, Song, Artist, Resource, Favorite, Rating } from './supabase'

// User operations
export const userService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(updates: Partial<User>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}

// Song operations
export const songService = {
  async getAllSongs() {
    const { data, error } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name,
          image_url
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getSongById(id: string) {
    const { data, error } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name,
          image_url,
          bio
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async searchSongs(query: string) {
    const { data, error } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name,
          image_url
        )
      `)
      .or(`title.ilike.%${query}%,lyrics.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createSong(song: Omit<Song, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('songs')
      .insert(song)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateSong(id: string, updates: Partial<Song>) {
    const { data, error } = await supabase
      .from('songs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteSong(id: string) {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Artist operations
export const artistService = {
  async getAllArtists() {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async getArtistById(id: string) {
    const { data, error } = await supabase
      .from('artists')
      .select(`
        *,
        songs (
          id,
          title,
          genre,
          rating,
          downloads
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async searchArtists(query: string) {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')

    if (error) throw error
    return data
  }
}

// Resource operations
export const resourceService = {
  async getAllResources() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getResourceById(id: string) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async searchResources(query: string) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// Favorite operations
export const favoriteService = {
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        songs (
          id,
          title,
          artist_id,
          artists (
            name
          )
        ),
        resources (
          id,
          title,
          type,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async addFavorite(userId: string, songId?: string, resourceId?: string) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        song_id: songId,
        resource_id: resourceId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeFavorite(userId: string, songId?: string, resourceId?: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('song_id', songId)
      .eq('resource_id', resourceId)

    if (error) throw error
  }
}

// Rating operations
export const ratingService = {
  async getRatings(songId?: string, resourceId?: string) {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        users (
          full_name,
          avatar_url
        )
      `)
      .eq('song_id', songId)
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async addRating(userId: string, rating: number, comment: string, songId?: string, resourceId?: string) {
    const { data, error } = await supabase
      .from('ratings')
      .upsert({
        user_id: userId,
        song_id: songId,
        resource_id: resourceId,
        rating,
        comment,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}
