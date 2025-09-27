"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  joinDate: string;
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
  };
  stats: {
    favoriteSongs: number;
    downloadedResources: number;
    ratingsGiven: number;
    lastActive: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<boolean>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('chordfinder_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('chordfinder_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call - in real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in real app, validate against backend
      if (email && password) {
        // Check for admin login
        const isAdmin = email === 'admin@chordfinder.com' && password === 'admin123';
        const isModerator = email === 'mod@chordfinder.com' && password === 'mod123';
        
        const mockUser: User = {
          id: '1',
          firstName: isAdmin ? 'Admin' : isModerator ? 'Moderator' : 'John',
          lastName: isAdmin ? 'User' : isModerator ? 'User' : 'Doe',
          email: email,
          role: isAdmin ? 'admin' : isModerator ? 'moderator' : 'user',
          avatar: '/avatars/default-avatar.jpg',
          joinDate: new Date().toISOString(),
          preferences: {
            language: 'en',
            theme: 'light',
            notifications: true
          },
          stats: {
            favoriteSongs: 12,
            downloadedResources: 8,
            ratingsGiven: 15,
            lastActive: new Date().toISOString()
          }
        };
        
        setUser(mockUser);
        localStorage.setItem('chordfinder_user', JSON.stringify(mockUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (userData.email && userData.password && userData.firstName && userData.lastName) {
        const newUser: User = {
          id: Date.now().toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: 'user', // Default role for new registrations
          avatar: '/avatars/default-avatar.jpg',
          joinDate: new Date().toISOString(),
          preferences: {
            language: 'en',
            theme: 'light',
            notifications: true
          },
          stats: {
            favoriteSongs: 0,
            downloadedResources: 0,
            ratingsGiven: 0,
            lastActive: new Date().toISOString()
          }
        };
        
        setUser(newUser);
        localStorage.setItem('chordfinder_user', JSON.stringify(newUser));
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chordfinder_user');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('chordfinder_user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const updatePreferences = async (preferences: Partial<User['preferences']>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      };
      setUser(updatedUser);
      localStorage.setItem('chordfinder_user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Preferences update error:', error);
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
    updatePreferences
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
