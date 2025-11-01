import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const analytics = await request.json();

    await query(async (sql) => {
      await sql`
        INSERT INTO user_analytics (
          user_id,
          page,
          action,
          metadata,
          ip_address,
          user_agent,
          referrer,
          created_at
        ) VALUES (
          ${analytics.userId || null},
          ${analytics.page || null},
          ${analytics.action || null},
          ${analytics.metadata ? JSON.stringify(analytics.metadata) : null},
          ${analytics.ip || null},
          ${analytics.userAgent || null},
          ${analytics.referrer || null},
          NOW()
        )
        ON CONFLICT DO NOTHING
      `;
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error storing analytics:', error);
    return NextResponse.json({ 
      error: 'Failed to store analytics',
      details: error.message
    }, { status: 500 });
  }
}
