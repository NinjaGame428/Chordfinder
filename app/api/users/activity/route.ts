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
      activityType,
      description,
      metadata,
      page,
      action
    } = body;

    if (!userId || !activityType) {
      return NextResponse.json({ error: 'User ID and activity type are required' }, { status: 400 });
    }

    // Insert user activity
    const { data: activity, error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
        page,
        action,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving user activity:', error);
      return NextResponse.json({ error: 'Failed to save user activity' }, { status: 500 });
    }

    return NextResponse.json({ activity });
  } catch (error) {
    console.error('Error in POST /api/users/activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}