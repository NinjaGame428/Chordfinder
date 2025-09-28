// Simple authentication test utility
import { supabase } from './supabase'

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    
    if (!supabase) {
      console.error('Supabase client not initialized')
      return { success: false, error: 'Supabase client not initialized' }
    }

    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }

    console.log('Supabase connection successful')
    return { success: true, data }
  } catch (error) {
    console.error('Supabase test error:', error)
    return { success: false, error: String(error) }
  }
}

export const testAuthFlow = async () => {
  try {
    console.log('Testing auth flow...')
    
    if (!supabase) {
      console.error('Supabase client not initialized')
      return { success: false, error: 'Supabase client not initialized' }
    }

    // Test getting current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return { success: false, error: sessionError.message }
    }

    console.log('Session check successful:', !!session)
    return { success: true, hasSession: !!session }
  } catch (error) {
    console.error('Auth flow test error:', error)
    return { success: false, error: String(error) }
  }
}
