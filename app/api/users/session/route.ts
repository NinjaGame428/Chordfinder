import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const body = await request.json();
    const {
      userId,
      deviceType,
      browser,
      operatingSystem,
      screenResolution,
      country,
      city,
      region,
      ipAddress,
      timezone,
      userAgent,
      sessionId
    } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Insert user session
    const { data: session, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        device_type: deviceType,
        browser,
        operating_system: operatingSystem,
        screen_resolution: screenResolution,
        country,
        city,
        region,
        ip_address: ipAddress,
        timezone,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving user session:', error);
      return NextResponse.json({ error: 'Failed to save user session' }, { status: 500 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error in POST /api/users/session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}