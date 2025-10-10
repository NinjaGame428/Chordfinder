import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    // Get a sample song to inspect the schema
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch songs', 
        details: error.message 
      }, { status: 500 });
    }

    if (!songs || songs.length === 0) {
      return NextResponse.json({ 
        message: 'No songs found',
        columns: []
      });
    }

    const song = songs[0];
    
    // Inspect the structure
    const schemaInfo = {
      columns: Object.keys(song),
      lyricsColumn: {
        exists: 'lyrics' in song,
        type: typeof song.lyrics,
        value: song.lyrics,
        isNull: song.lyrics === null,
        length: song.lyrics ? song.lyrics.length : 0
      },
      sampleSong: {
        id: song.id,
        title: song.title,
        hasLyrics: !!song.lyrics
      }
    };

    return NextResponse.json(schemaInfo);
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

