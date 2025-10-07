import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCachedSongs, setCachedSongs } from '@/lib/song-cache';

// Ultra-fast API with advanced optimizations
export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || 'All Songs';
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50); // Cap at 50
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Generate cache key
    const cacheKey = `${query}-${category}-${limit}-${offset}-${sortBy}-${sortOrder}`;
    
    // Check cache first (ultra-fast)
    const cachedSongs = getCachedSongs(query, category, limit, offset);
    if (cachedSongs) {
      const endTime = performance.now();
      return NextResponse.json({
        songs: cachedSongs,
        total: cachedSongs.length,
        hasMore: cachedSongs.length === limit,
        cached: true,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      });
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Optimized query with only essential fields
    let dbQuery = supabase
      .from('songs')
      .select(`
        id,
        title,
        artist_id,
        genre,
        key_signature,
        year,
        tempo,
        chords,
        downloads,
        rating,
        slug,
        created_at,
        artists!inner(
          id,
          name
        )
      `, { count: 'exact' });

    // Apply filters with optimized conditions
    if (query) {
      // Use full-text search if available, otherwise fallback to ILIKE
      dbQuery = dbQuery.or(`title.ilike.%${query}%,artists.name.ilike.%${query}%`);
    }

    if (category !== 'All Songs') {
      dbQuery = dbQuery.eq('genre', category);
    }

    // Apply sorting with index optimization
    const sortColumn = sortBy === 'title' ? 'title' : 
                     sortBy === 'artist' ? 'artists.name' :
                     sortBy === 'year' ? 'year' :
                     sortBy === 'rating' ? 'rating' :
                     'created_at';

    dbQuery = dbQuery.order(sortColumn, { ascending: sortOrder === 'asc' });

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    // Execute query
    const { data: songsData, error: songsError, count } = await dbQuery;

    if (songsError) {
      console.error('Database error:', songsError);
      return NextResponse.json(
        { error: 'Failed to fetch songs' },
        { status: 500 }
      );
    }

    // Fast formatting with minimal processing
    const formattedSongs = songsData?.map((song: any) => ({
      id: song.id,
      title: song.title,
      artist: song.artists?.name || 'Unknown Artist',
      key: song.key_signature || 'C',
      difficulty: 'Medium',
      category: song.genre || 'Gospel',
      year: song.year?.toString() || new Date().getFullYear().toString(),
      tempo: song.tempo ? `${song.tempo} BPM` : '120 BPM',
      timeSignature: '4/4',
      genre: song.genre || 'Gospel',
      chords: song.chords || ['C', 'G', 'Am', 'F'],
      chordProgression: song.chords?.join(' - ') || 'C - G - Am - F',
      lyrics: '',
      chordChart: '',
      capo: 'No capo needed',
      strummingPattern: 'Down, Down, Up, Down, Up, Down',
      tags: ['Gospel', song.genre || 'Worship'],
      downloads: song.downloads || 0,
      rating: song.rating || 0,
      description: '',
      slug: song.slug,
      language: 'en',
      captions_available: false
    })) || [];

    // Cache the results with longer TTL for ultra-fast responses
    setCachedSongs(query, category, limit, offset, formattedSongs);

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    return NextResponse.json({
      songs: formattedSongs,
      total: count || formattedSongs.length,
      hasMore: formattedSongs.length === limit,
      cached: false,
      responseTime: `${responseTime.toFixed(2)}ms`,
      performance: {
        queryTime: responseTime,
        optimization: 'ultra-fast',
        cacheHit: false
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Preflight OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
