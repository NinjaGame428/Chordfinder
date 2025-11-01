import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      activityType,
      description,
      metadata,
      page,
      action
    } = body;

    if (!userId || !activityType) {
      return NextResponse.json({ error: 'User ID and activity type are required' }, { status: 400 });
    }

    const activity = await query(async (sql) => {
      const [result] = await sql`
        INSERT INTO user_activities (
          user_id,
          activity_type,
          description,
          metadata,
          page,
          action,
          created_at
        ) VALUES (
          ${userId},
          ${activityType},
          ${description || null},
          ${metadata ? JSON.stringify(metadata) : null},
          ${page || null},
          ${action || null},
          NOW()
        )
        RETURNING *
      `;
      return result;
    });

    return NextResponse.json({ activity });
  } catch (error: any) {
    console.error('Error in POST /api/users/activity:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
