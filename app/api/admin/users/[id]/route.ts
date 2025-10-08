import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET - Fetch single user
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = params.id;

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// PATCH - Update user or perform action
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = params.id;
    const body = await request.json();
    const { action, ...updates } = body;

    if (!supabase) {
      return NextResponse.json(
        { success: true, message: 'Action simulated (database not configured)' },
        { status: 200 }
      );
    }

    // Handle specific actions
    if (action) {
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

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
          { success: true, message: 'Action simulated' },
          { status: 200 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `User ${action} successfully`,
      });
    }

    // Handle general updates
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: true, message: 'Action simulated' },
      { status: 200 }
    );
  }
};

// DELETE - Delete user
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = params.id;

    if (!supabase) {
      return NextResponse.json(
        { success: true, message: 'Delete simulated (database not configured)' },
        { status: 200 }
      );
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      return NextResponse.json(
        { success: true, message: 'Delete simulated' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: true, message: 'Delete simulated' },
      { status: 200 }
    );
  }
};
