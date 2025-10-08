import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const analytics = await request.json();

    // Store analytics data
    const { error } = await supabase
      .from('user_analytics')
      .upsert({
        user_id: analytics.userId,
        session_id: analytics.sessionId,
        page: analytics.page,
        timestamp: analytics.timestamp,
        user_agent: analytics.userAgent,
        language: analytics.language,
        timezone: analytics.timezone,
        screen_resolution: analytics.screenResolution,
        color_depth: analytics.colorDepth,
        referrer: analytics.referrer,
        ip_address: analytics.ip,
        last_location: analytics.location,
        device_info: analytics.device,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing analytics:', error);
      return NextResponse.json({ error: 'Failed to store analytics' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 });
  }
}
