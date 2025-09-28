"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { userService } from '@/lib/supabase-service';
import type { User } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('Auth state changed:', { user: !!user, isLoading, userId: user?.id });
  }, [user, isLoading]);

  // Check for existing session on mount
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // 10 second timeout

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          try {
            const userData = await userService.getCurrentUser();
            if (userData) {
              setUser(userData);
            } else {
              // If user data is null, set basic user info
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || '',
                role: 'user',
                created_at: session.user.created_at,
                updated_at: session.user.updated_at || session.user.created_at,
              });
            }
          } catch (userError) {
            console.error('Error fetching user data:', userError);
            // If user data fetch fails, still set basic user info
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || '',
              role: 'user',
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at,
            });
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Set a timeout for auth state changes too
        const authTimeoutId = setTimeout(() => {
          setIsLoading(false);
        }, 5000); // 5 second timeout for auth changes

        try {
          if (session?.user) {
            try {
              const userData = await userService.getCurrentUser();
              if (userData) {
                setUser(userData);
              } else {
                // If user data is null, set basic user info
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  full_name: session.user.user_metadata?.full_name || '',
                  role: 'user',
                  created_at: session.user.created_at,
                  updated_at: session.user.updated_at || session.user.created_at,
                });
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              // Fallback to basic user info
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || '',
                role: 'user',
                created_at: session.user.created_at,
                updated_at: session.user.updated_at || session.user.created_at,
              });
            }
          } else {
            setUser(null);
          }
        } finally {
          clearTimeout(authTimeoutId);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      console.error('Supabase not configured');
      return { success: false, error: 'Authentication service not configured' };
    }

    try {
      console.log('Attempting login for:', email);
      setIsLoading(true);
      
      const { data, error } = await userService.signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        
        // Provide specific error messages
        let errorMessage = 'Login failed. Please try again.';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        }
        
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        console.log('Login successful, fetching user data...');
        try {
          const userData = await userService.getCurrentUser();
          if (userData) {
            console.log('User data fetched:', userData);
            setUser(userData);
          } else {
            console.log('No user data, using session data');
            // Use session data as fallback
            setUser({
              id: data.user.id,
              email: data.user.email || '',
              full_name: data.user.user_metadata?.full_name || '',
              role: 'user',
              created_at: data.user.created_at,
              updated_at: data.user.updated_at || data.user.created_at,
            });
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          // Use session data as fallback
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || '',
            role: 'user',
            created_at: data.user.created_at,
            updated_at: data.user.updated_at || data.user.created_at,
          });
        }
        return { success: true };
      }
      
      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    if (!supabase) {
      console.error('Supabase not configured');
      return false;
    }

    try {
      console.log('Attempting registration for:', userData.email);
      setIsLoading(true);
      
      const { data, error } = await userService.signUp(
        userData.email,
        userData.password,
        userData.fullName
      );

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      if (data.user) {
        console.log('Registration successful, user created:', data.user.id);
        // Set user immediately with session data
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || '',
          role: 'user',
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (!supabase) {
      console.error('Supabase not configured');
      return;
    }

    try {
      await userService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!supabase) {
      console.error('Supabase not configured');
      return false;
    }

    try {
      if (!user) return false;
      
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
