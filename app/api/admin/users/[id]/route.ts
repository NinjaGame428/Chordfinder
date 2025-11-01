import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    const user = await query(async (sql) => {
      const [result] = await sql`
        SELECT *
        FROM users
        WHERE id = ${userId}
      `;
      return result;
    });

    if (!user) {
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

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const body = await request.json();
    const { action, ...updates } = body;

    let updateData: any = {};

    if (action) {
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
    } else {
      updateData = updates;
    }

    updateData.updated_at = new Date().toISOString();

    await query(async (sql) => {
      const keys = Object.keys(updateData);
      const values = Object.values(updateData);
      
      if (keys.length === 0) {
        return;
      }

      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      await sql.unsafe(`
        UPDATE users
        SET ${setClause}
        WHERE id = $${keys.length + 1}
      `, [...values, userId]);
    });

    return NextResponse.json({
      success: true,
      message: action ? `User ${action} successfully` : 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    await query(async (sql) => {
      await sql`
        DELETE FROM users
        WHERE id = ${userId}
      `;
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
};
