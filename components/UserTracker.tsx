'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserAnalytics {
  userId: string;
  sessionId: string;
  page: string;
  timestamp: string;
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  referrer: string;
  ip?: string;
  location?: {
    country: string;
    city: string;
    region: string;
    timezone: string;
  };
  device?: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    version: string;
  };
}

export const UserTracker = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const trackUser = async () => {
      try {
        // Get user information
        const userAgent = navigator.userAgent;
        const language = navigator.language;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const screenResolution = `${screen.width}x${screen.height}`;
        const colorDepth = screen.colorDepth;
        const referrer = document.referrer;

        // Detect device type
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android(?=.*Mobile)/i.test(userAgent);
        const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

        // Detect OS
        let os = 'Unknown';
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS')) os = 'iOS';

        // Detect browser
        let browser = 'Unknown';
        let version = 'Unknown';
        if (userAgent.includes('Chrome')) {
          browser = 'Chrome';
          const match = userAgent.match(/Chrome\/(\d+)/);
          version = match ? match[1] : 'Unknown';
        } else if (userAgent.includes('Firefox')) {
          browser = 'Firefox';
          const match = userAgent.match(/Firefox\/(\d+)/);
          version = match ? match[1] : 'Unknown';
        } else if (userAgent.includes('Safari')) {
          browser = 'Safari';
          const match = userAgent.match(/Version\/(\d+)/);
          version = match ? match[1] : 'Unknown';
        } else if (userAgent.includes('Edge')) {
          browser = 'Edge';
          const match = userAgent.match(/Edge\/(\d+)/);
          version = match ? match[1] : 'Unknown';
        }

        // Get IP and location (using a free service)
        let ip = 'Unknown';
        let location = null;
        
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ip = ipData.ip;

          // Get location from IP
          const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
          const locationData = await locationResponse.json();
          
          if (locationData.country) {
            location = {
              country: locationData.country_name || 'Unknown',
              city: locationData.city || 'Unknown',
              region: locationData.region || 'Unknown',
              timezone: locationData.timezone || timezone
            };
          }
        } catch (error) {
          console.log('Could not fetch location data:', error);
        }

        const analytics: UserAnalytics = {
          userId: user.id,
          sessionId: sessionStorage.getItem('sessionId') || Date.now().toString(),
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
          userAgent,
          language,
          timezone,
          screenResolution,
          colorDepth,
          referrer,
          ip,
          location,
          device: {
            type: deviceType,
            os,
            browser,
            version
          }
        };

        // Store session ID
        if (!sessionStorage.getItem('sessionId')) {
          sessionStorage.setItem('sessionId', analytics.sessionId);
        }

        // Send analytics data
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analytics)
        });

      } catch (error) {
        console.error('Error tracking user:', error);
      }
    };

    // Track on page load
    trackUser();

    // Track page changes
    const handleRouteChange = () => {
      trackUser();
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [user]);

  return null; // This component doesn't render anything
};
