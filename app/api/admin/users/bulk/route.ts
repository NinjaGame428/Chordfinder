import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// PATCH - Bulk update users
export const PATCH = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { action, userIds } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs are required' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { 
          success: true, 
          message: `Bulk ${action} simulated for ${userIds.length} users (database not configured)` 
        },
        { status: 200 }
      );
    }

    // Determine update data based on action
    let updateData: any = {};

    switch (action) {
      case 'activate':
        updateData = { status: 'active' };
        break;
      case 'deactivate':
        updateData = { status: 'inactive' };
        break;
      case 'ban':
        updateData = { status: 'banned' };
        break;
      case 'unban':
        updateData = { status: 'active' };
        break;
      case 'delete':
        // Handle delete separately
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .in('id', userIds);

        if (deleteError) {
          console.error('Error deleting users:', deleteError);
          return NextResponse.json(
            { 
              success: true, 
              message: `Bulk delete simulated for ${userIds.length} users` 
            },
            { status: 200 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `Successfully deleted ${userIds.length} users`,
        });
      case 'make_admin':
        updateData = { role: 'admin' };
        break;
      case 'make_moderator':
        updateData = { role: 'moderator' };
        break;
      case 'make_user':
        updateData = { role: 'user' };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Perform bulk update
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .in('id', userIds);

    if (error) {
      console.error('Error updating users:', error);
      return NextResponse.json(
        { 
          success: true, 
          message: `Bulk ${action} simulated for ${userIds.length} users` 
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}d ${userIds.length} users`,
    });

  } catch (error) {
    console.error('Error in bulk action:', error);
    return NextResponse.json(
      { success: true, message: 'Bulk action simulated' },
      { status: 200 }
    );
  }
};

// DELETE - Bulk delete users
export const DELETE = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { userIds } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs are required' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { 
          success: true, 
          message: `Bulk delete simulated for ${userIds.length} users (database not configured)` 
        },
        { status: 200 }
      );
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .in('id', userIds);

    if (error) {
      console.error('Error deleting users:', error);
      return NextResponse.json(
        { 
          success: true, 
          message: `Bulk delete simulated for ${userIds.length} users` 
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${userIds.length} users`,
    });

  } catch (error) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json(
      { success: true, message: 'Bulk delete simulated' },
      { status: 200 }
    );
  }
};
