import { NextRequest, NextResponse } from 'next/server';
import { songs } from '@/lib/song-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredSongs = [...songs];

    // Filter by search query
    if (searchQuery) {
      filteredSongs = filteredSongs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (category && category !== 'All Songs') {
      filteredSongs = filteredSongs.filter(song => song.category === category);
    }

    // Limit results
    const limitedSongs = filteredSongs.slice(0, limit);

    return NextResponse.json({
      success: true,
      songs: limitedSongs,
      totalResults: filteredSongs.length,
      hasMore: limitedSongs.length < filteredSongs.length
    });

  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch songs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { songs: newSongs } = await request.json();

    if (!Array.isArray(newSongs)) {
      return NextResponse.json({ error: 'Songs must be an array' }, { status: 400 });
    }

    // Here you would typically save to a database
    // For now, we'll just return the processed songs
    return NextResponse.json({
      success: true,
      message: `${newSongs.length} songs processed successfully`,
      songs: newSongs
    });

  } catch (error) {
    console.error('Error processing songs:', error);
    return NextResponse.json({ 
      error: 'Failed to process songs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
