import { NextRequest, NextResponse } from 'next/server';
import { youtubeMetadataService } from '@/lib/youtube-metadata';
import denaMwanaChords from '@/lib/dena-mwana-chords.json';

export async function POST(request: NextRequest) {
  try {
    const { searchQuery, maxResults = 10, useDenaMwanaData = false } = await request.json();

    if (!searchQuery) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // If using Dena Mwana data, return the chord collection with YouTube integration
    if (useDenaMwanaData) {
      const denaMwanaSongs = denaMwanaChords.songs.map((song: any) => ({
        id: song.id,
        title: song.title,
        artist: 'Dena Mwana',
        key: song.key,
        difficulty: song.difficulty,
        category: 'Dena Mwana Collection',
        year: song.year?.toString() || '2016',
        tempo: `${song.bpm} BPM`,
        timeSignature: '4/4',
        genre: 'Gospel',
        chords: song.chords.piano.primary,
        chordProgression: song.chords.piano.progression,
        lyrics: '', // Would need separate processing
        chordChart: '', // Would need separate processing
        capo: song.chords.guitar.capo === 0 ? 'No capo needed' : `Capo: ${song.chords.guitar.capo}`,
        strummingPattern: 'Down, Down, Up, Down, Up, Down',
        tags: ['Dena Mwana', 'Gospel', 'Piano', 'Guitar'],
        downloads: 0,
        rating: 4.5,
        description: song.english_title ? `${song.title} (${song.english_title})` : song.title,
        // YouTube specific fields
        url: `https://www.youtube.com/watch?v=${song.youtube_id}`,
        thumbnail: `https://img.youtube.com/vi/${song.youtube_id}/hqdefault.jpg`,
        duration: '3:30', // Default duration
        published_at: new Date().toISOString(),
        quality: 'HD',
        language: 'en',
        captions_available: true,
        // Additional Dena Mwana specific fields
        english_title: song.english_title,
        album: song.album,
        bpm: song.bpm,
        slug: song.slug,
        piano_chords: song.chords.piano,
        guitar_chords: song.chords.guitar,
        song_structure: song.song_structure
      }));

      return NextResponse.json({ 
        success: true, 
        songs: denaMwanaSongs,
        totalResults: denaMwanaSongs.length,
        collection: 'Dena Mwana'
      });
    }

    // Regular YouTube search
    const searchResults = await youtubeMetadataService.searchVideos(searchQuery, maxResults);

    // Transform the data to match our Song interface
    const scrapedSongs = await Promise.all(searchResults.map(async (video, index) => {
      // Get detailed video information
      const videoDetails = await youtubeMetadataService.getVideoDetails(video.id);
      
      // Extract duration in a readable format
      let durationText = '3:30'; // Default
      if (videoDetails?.duration) {
        const durationSeconds = youtubeMetadataService.parseDuration(videoDetails.duration);
        durationText = youtubeMetadataService.formatDuration(durationSeconds);
      }

      // Determine quality based on available formats
      const quality = 'HD';

      return {
        id: Date.now() + index,
        title: video.title,
        artist: video.channelTitle,
        key: 'C Major', // Default - could be enhanced with music analysis
        difficulty: 'Medium', // Default - could be enhanced with analysis
        category: 'YouTube Scraped',
        year: new Date(video.publishedAt).getFullYear().toString(),
        tempo: '120 BPM', // Default
        timeSignature: '4/4', // Default
        genre: 'Gospel', // Default based on search context
        chords: ['C', 'G', 'Am', 'F'], // Default - could be enhanced
        chordProgression: 'C - G - Am - F', // Default
        lyrics: '', // Would need separate processing
        chordChart: '', // Would need separate processing
        capo: 'No capo needed', // Default
        strummingPattern: 'Down, Down, Up, Down, Up, Down', // Default
        tags: ['YouTube', 'Gospel'],
        downloads: 0,
        rating: 4.0, // Default
        description: video.description.substring(0, 200) + '...',
        // YouTube specific fields
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail: video.thumbnails.high?.url || video.thumbnails.medium?.url || video.thumbnails.default?.url,
        duration: durationText,
        published_at: video.publishedAt,
        quality: quality,
        language: 'en',
        captions_available: true
      };
    }));

    return NextResponse.json({ 
      success: true, 
      songs: scrapedSongs,
      totalResults: searchResults.length
    });

  } catch (error) {
    console.error('YouTube scraping error:', error);
    return NextResponse.json({ 
      error: 'Failed to scrape YouTube data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
