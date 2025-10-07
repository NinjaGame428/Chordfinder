// User tracking utilities for collecting location and device data

export interface UserLocation {
  country: string;
  city: string;
  region: string;
  ipAddress: string;
  timezone: string;
}

export interface UserDevice {
  device: string;
  browser: string;
  operatingSystem: string;
  screenResolution: string;
  userAgent: string;
}

export interface UserSession {
  userId: string;
  location: UserLocation;
  device: UserDevice;
  sessionId: string;
}

// Detect device type
export function detectDevice(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
    if (/ipad|tablet/.test(userAgent)) {
      return 'Tablet';
    }
    return 'Mobile';
  }
  
  return 'Desktop';
}

// Detect browser
export function detectBrowser(): string {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  
  return 'Unknown';
}

// Detect operating system
export function detectOS(): string {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  
  return 'Unknown';
}

// Get screen resolution
export function getScreenResolution(): string {
  return `${screen.width}x${screen.height}`;
}

// Get user's location (requires user permission)
export async function getUserLocation(): Promise<UserLocation | null> {
  try {
    // Try to get location from IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      ipAddress: data.ip || 'Unknown',
      timezone: data.timezone || 'Unknown'
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

// Collect all user data
export async function collectUserData(userId: string): Promise<UserSession | null> {
  try {
    const location = await getUserLocation();
    const device = {
      device: detectDevice(),
      browser: detectBrowser(),
      operatingSystem: detectOS(),
      screenResolution: getScreenResolution(),
      userAgent: navigator.userAgent
    };

    if (!location) {
      console.warn('Could not get user location');
      return null;
    }

    return {
      userId,
      location,
      device,
      sessionId: generateSessionId()
    };
  } catch (error) {
    console.error('Error collecting user data:', error);
    return null;
  }
}

// Generate unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Save user session to database
export async function saveUserSession(sessionData: UserSession): Promise<boolean> {
  try {
    const response = await fetch('/api/users/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: sessionData.userId,
        deviceType: sessionData.device.device,
        browser: sessionData.device.browser,
        operatingSystem: sessionData.device.operatingSystem,
        screenResolution: sessionData.device.screenResolution,
        country: sessionData.location.country,
        city: sessionData.location.city,
        region: sessionData.location.region,
        ipAddress: sessionData.location.ipAddress,
        timezone: sessionData.location.timezone,
        userAgent: sessionData.device.userAgent,
        sessionId: sessionData.sessionId
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error saving user session:', error);
    return false;
  }
}

// Track user activity
export async function trackUserActivity(
  userId: string, 
  activityType: string, 
  description: string, 
  metadata?: any
): Promise<boolean> {
  try {
    const response = await fetch('/api/users/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        activityType,
        description,
        metadata,
        page: window.location.pathname,
        action: activityType
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error tracking user activity:', error);
    return false;
  }
}