import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

    let updateData: any = { updated_at: new Date().toISOString() };

    switch (action) {
      case 'activate':
        updateData.status = 'active';
        break;
      case 'deactivate':
        updateData.status = 'inactive';
        break;
      case 'ban':
        updateData.status = 'banned';
        break;
      case 'unban':
        updateData.status = 'active';
        break;
      case 'delete':
        await query(async (sql) => {
          await sql`
            DELETE FROM users
            WHERE id = ANY(${userIds})
          `;
        });

        return NextResponse.json({
          success: true,
          message: `Successfully deleted ${userIds.length} users`,
        });
      case 'make_admin':
        updateData.role = 'admin';
        break;
      case 'make_moderator':
        updateData.role = 'moderator';
        break;
      case 'make_user':
        updateData.role = 'user';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

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
        WHERE id = ANY($${keys.length + 1}::uuid[])
      `, [...values, userIds]);
    });

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}d ${userIds.length} users`,
    });
  } catch (error) {
    console.error('Error in bulk action:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
};

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

    await query(async (sql) => {
      await sql`
        DELETE FROM users
        WHERE id = ANY(${userIds})
      `;
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${userIds.length} users`,
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json(
      { error: 'Failed to delete users' },
      { status: 500 }
    );
  }
};
