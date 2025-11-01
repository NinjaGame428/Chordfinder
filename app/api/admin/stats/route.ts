import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const stats = await query(async (sql) => {
      // Fetch all counts in parallel
      const [
        songsResult,
        artistsResult,
        usersResult,
        resourcesResult,
        collectionsResult
      ] = await Promise.all([
        sql`SELECT COUNT(*) as total FROM songs`,
        sql`SELECT COUNT(*) as total FROM artists`,
        sql`SELECT COUNT(*) as total FROM users`,
        sql`SELECT COUNT(*) as total FROM resources`,
        sql`
          SELECT COUNT(*) as total 
          FROM information_schema.tables 
          WHERE table_name = 'piano_chords'
        `.then(() => sql`SELECT COUNT(*) as total FROM piano_chords`)
          .catch(() => [{ total: 0 }])
      ]);

      return {
        totalSongs: parseInt(songsResult[0]?.total || '0'),
        totalArtists: parseInt(artistsResult[0]?.total || '0'),
        totalUsers: parseInt(usersResult[0]?.total || '0'),
        totalResources: parseInt(resourcesResult[0]?.total || '0'),
        collections: parseInt(collectionsResult[0]?.total || '0')
      };
    });

    const activeUsers = stats.totalUsers; // Placeholder for actual active user logic

    return NextResponse.json({ 
      stats: {
        ...stats,
        activeUsers
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 });
  }
}
