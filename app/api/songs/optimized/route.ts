import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCachedSongs, setCachedSongs } from '@/lib/song-cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || 'All Songs';
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Check cache first
    const cachedSongs = getCachedSongs(query, category, limit, offset);
    if (cachedSongs) {
      return NextResponse.json({
        songs: cachedSongs,
        total: cachedSongs.length,
        hasMore: cachedSongs.length === limit,
        cached: true
      });
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // Build query
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
        description,
        slug,
        created_at,
        artists!inner(
          id,
          name
        )
      `);

    // Apply filters
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,artists.name.ilike.%${query}%`);
    }

    if (category !== 'All Songs') {
      dbQuery = dbQuery.eq('genre', category);
    }

    // Apply sorting
    const sortColumn = sortBy === 'title' ? 'title' : 
                     sortBy === 'artist' ? 'artists.name' :
                     sortBy === 'year' ? 'year' :
                     sortBy === 'rating' ? 'rating' :
                     'created_at';

    dbQuery = dbQuery.order(sortColumn, { ascending: sortOrder === 'asc' });

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data: songsData, error: songsError, count } = await dbQuery;

    if (songsError) {
      console.error('Database error:', songsError);
      return NextResponse.json(
        { error: 'Failed to fetch songs' },
        { status: 500 }
      );
    }

    // Format songs
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
      description: song.description || '',
      slug: song.slug,
      language: 'en',
      captions_available: false
    })) || [];

    // Cache the results
    setCachedSongs(query, category, limit, offset, formattedSongs);

    return NextResponse.json({
      songs: formattedSongs,
      total: count || formattedSongs.length,
      hasMore: formattedSongs.length === limit,
      cached: false
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
