import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
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

    const session = await query(async (sql) => {
      const [result] = await sql`
        INSERT INTO user_sessions (
          user_id,
          session_token,
          device_type,
          browser,
          operating_system,
          screen_resolution,
          country,
          city,
          region,
          ip_address,
          timezone,
          user_agent,
          created_at,
          updated_at,
          expires_at,
          last_activity
        ) VALUES (
          ${userId},
          ${sessionId || crypto.randomUUID()},
          ${deviceType || null},
          ${browser || null},
          ${operatingSystem || null},
          ${screenResolution || null},
          ${country || null},
          ${city || null},
          ${region || null},
          ${ipAddress || null},
          ${timezone || null},
          ${userAgent || null},
          NOW(),
          NOW(),
          NOW() + INTERVAL '7 days',
          NOW()
        )
        RETURNING *
      `;
      return result;
    });

    return NextResponse.json({ session });
  } catch (error: any) {
    console.error('Error in POST /api/users/session:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
