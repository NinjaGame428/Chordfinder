'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { collectUserData, saveUserSession, trackUserActivity } from '@/lib/user-tracking';

interface UserTrackingContextType {
  isTracking: boolean;
  startTracking: (userId: string) => void;
  stopTracking: () => void;
  trackActivity: (activityType: string, description: string, metadata?: any) => void;
}

const UserTrackingContext = createContext<UserTrackingContextType | undefined>(undefined);

export function UserTrackingProvider({ children }: { children: React.ReactNode }) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const startTracking = async (userId: string) => {
    try {
      setCurrentUserId(userId);
      setIsTracking(true);

      // Collect user data
      const userData = await collectUserData(userId);
      if (userData) {
        // Save session data
        await saveUserSession(userData);
        
        // Track initial activity
        await trackUserActivity(userId, 'session_start', 'User started session', {
          location: userData.location,
          device: userData.device
        });
      }
    } catch (error) {
      console.error('Error starting user tracking:', error);
    }
  };

  const stopTracking = async () => {
    if (currentUserId) {
      try {
        await trackUserActivity(currentUserId, 'session_end', 'User ended session');
      } catch (error) {
        console.error('Error stopping user tracking:', error);
      }
    }
    setIsTracking(false);
    setCurrentUserId(null);
  };

  const trackActivity = async (activityType: string, description: string, metadata?: any) => {
    if (currentUserId && isTracking) {
      try {
        await trackUserActivity(currentUserId, activityType, description, metadata);
      } catch (error) {
        console.error('Error tracking activity:', error);
      }
    }
  };

  // Track page views
  useEffect(() => {
    if (currentUserId && isTracking) {
      const trackPageView = () => {
        trackActivity('page_view', `Viewed ${window.location.pathname}`, {
          pathname: window.location.pathname,
          search: window.location.search,
          timestamp: new Date().toISOString()
        });
      };

      // Track initial page view
      trackPageView();

      // Track navigation
      const handlePopState = () => trackPageView();
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [currentUserId, isTracking]);

  // Track user interactions
  useEffect(() => {
    if (currentUserId && isTracking) {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target) {
          trackActivity('click', `Clicked on ${target.tagName}`, {
            tagName: target.tagName,
            className: target.className,
            id: target.id,
            text: target.textContent?.substring(0, 100)
          });
        }
      };

      const handleScroll = () => {
        trackActivity('scroll', 'User scrolled page', {
          scrollY: window.scrollY,
          scrollX: window.scrollX
        });
      };

      // Throttle scroll events
      let scrollTimeout: NodeJS.Timeout;
      const throttledScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 1000);
      };

      document.addEventListener('click', handleClick);
      window.addEventListener('scroll', throttledScroll);

      return () => {
        document.removeEventListener('click', handleClick);
        window.removeEventListener('scroll', throttledScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, [currentUserId, isTracking]);

  return (
    <UserTrackingContext.Provider value={{
      isTracking,
      startTracking,
      stopTracking,
      trackActivity
    }}>
      {children}
    </UserTrackingContext.Provider>
  );
}

export function useUserTracking() {
  const context = useContext(UserTrackingContext);
  if (context === undefined) {
    throw new Error('useUserTracking must be used within a UserTrackingProvider');
  }
  return context;
}