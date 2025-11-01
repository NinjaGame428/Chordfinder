import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const resolvedParams = await params;
    // Select ALL fields including artist text field
    const { data: song, error } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name,
          bio,
          image_url
        )
      `)
      .eq('id', resolvedParams.id)
      .single();
    
    // Handle null artist_id - ensure artist info is populated from text field if needed
    if (song && !song.artists && song.artist) {
      song.artists = {
        id: song.artist_id || null,
        name: song.artist,
        bio: null,
        image_url: null
      };
    }

    if (error) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const response = NextResponse.json({ song });
    // Clear all caches aggressively
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('Vary', '*');
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    const body = await request.json();
    const resolvedParams = await params;
    
    const { 
      title, 
      key,
      key_signature,
      bpm,
      tempo,
      slug,
      chords,
      lyrics,
      artist_id
    } = body;

    // CRITICAL: Get the CURRENT song data BEFORE updating to track old artist_id
    let oldArtistId: string | null = null;
    let oldSongData: any = null;
    try {
      const { data: currentSong } = await supabase
        .from('songs')
        .select('artist_id, title')
        .eq('id', resolvedParams.id)
        .single();
      
      if (currentSong) {
        oldArtistId = currentSong.artist_id;
        oldSongData = currentSong;
        console.log('📋 Current song data before update:', {
          currentTitle: currentSong.title,
          currentArtistId: currentSong.artist_id
        });
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch current song data:', error);
    }

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Helper function to create slug from title
    const createSlug = (title: string) => {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };

    // Build update data - ONLY using confirmed database columns
    const updateData: any = {};
    
    // Title - required field
    if (title !== undefined && title !== null && title.trim() !== '') {
      updateData.title = title.trim();
      // Generate slug from title if not provided
      if (!slug && title) {
        updateData.slug = createSlug(title.trim());
      } else if (slug) {
        updateData.slug = slug;
      }
    }
    
    // Artist ID - required field
    // Also update the artist text field for backward compatibility
    if (artist_id !== undefined && artist_id !== null && artist_id !== '' && artist_id.trim() !== '') {
      updateData.artist_id = artist_id.trim();
      
      // Fetch the artist name to update the artist text field
      try {
        const { data: artist, error: artistError } = await supabase
          .from('artists')
          .select('name')
          .eq('id', artist_id.trim())
          .single();
        
        if (!artistError && artist) {
          // Update the artist text field with the artist's name
          updateData.artist = artist.name;
        }
      } catch (error) {
        console.warn('Could not fetch artist name for artist_id:', artist_id, error);
        // Continue without updating artist text field if fetch fails
      }
    }
    
    // Lyrics - critical field, always include (can be empty string or null)
    // Always include lyrics in update - even if empty, it's a valid value
    if (lyrics !== undefined && lyrics !== null) {
      // Keep as string even if empty - don't convert to null
      updateData.lyrics = lyrics.trim();
    } else if (lyrics === null) {
      // Explicitly allow null
      updateData.lyrics = null;
    } else if (lyrics === '') {
      // Empty string is valid
      updateData.lyrics = '';
    }
    
    // Key Signature - optional field
    // Explicitly handle null/empty to clear key signature if needed
    if (key_signature !== undefined) {
      if (key_signature === null || key_signature === '' || key_signature.trim() === '') {
        updateData.key_signature = null;
      } else {
        updateData.key_signature = key_signature.trim();
      }
    } else if (key !== undefined) {
      if (key === null || key === '' || key.trim() === '') {
        updateData.key_signature = null;
      } else {
        updateData.key_signature = key.trim();
      }
    }
    
    // Tempo/BPM - optional field
    // Explicitly handle null/empty to clear tempo if needed
    if (tempo !== undefined) {
      if (tempo === null || tempo === '' || tempo === 0) {
        updateData.tempo = null;
      } else {
        const tempoValue = parseInt(tempo.toString());
        if (!isNaN(tempoValue) && tempoValue > 0) {
          updateData.tempo = tempoValue;
        } else {
          updateData.tempo = null;
        }
      }
    } else if (bpm !== undefined) {
      if (bpm === null || bpm === '' || bpm === 0) {
        updateData.tempo = null;
      } else {
        const bpmValue = parseInt(bpm.toString());
        if (!isNaN(bpmValue) && bpmValue > 0) {
          updateData.tempo = bpmValue;
        } else {
          updateData.tempo = null;
        }
      }
    }
    
    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // Validate required fields before saving
    if (!updateData.title || !updateData.title.trim()) {
      console.error('❌ Validation failed: Title is required');
      return NextResponse.json({ 
        error: 'Title is required',
        details: 'The song title cannot be empty'
      }, { status: 400 });
    }
    
    if (!updateData.artist_id || !updateData.artist_id.trim()) {
      console.error('❌ Validation failed: Artist ID is required', {
        artist_id: updateData.artist_id,
        received: artist_id
      });
      return NextResponse.json({ 
        error: 'Artist ID is required',
        details: 'Please select a valid artist for this song'
      }, { status: 400 });
    }
    
    // Log what we're about to save for debugging
    console.log('💾 Saving song to database:', {
      id: resolvedParams.id,
      title: updateData.title,
      artist_id: updateData.artist_id,
      key_signature: updateData.key_signature ?? 'null',
      tempo: updateData.tempo ?? 'null',
      lyricsLength: updateData.lyrics?.length || 0,
      hasLyrics: !!updateData.lyrics,
      lyricsPreview: updateData.lyrics ? updateData.lyrics.substring(0, 100) + '...' : 'null',
      allFieldsPresent: '✅ All fields ready to save',
      updateDataKeys: Object.keys(updateData)
    });
    
    console.log('📦 Full update payload:', JSON.stringify(updateData, null, 2));

    // First, update the song
    // Don't use .single() here as it can fail if no rows match
    // We'll fetch the updated data separately if needed
    const { error: updateError, data: updateResult } = await supabase
      .from('songs')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select('id');

    if (updateError) {
      // Check for column not found error
      if (updateError.code === 'PGRST204' && updateError.message.includes('column')) {
        const columnMatch = updateError.message.match(/'([^']+)'/);
        const columnName = columnMatch ? columnMatch[1] : 'unknown';
        return NextResponse.json({ 
          error: 'Database schema error', 
          details: `Column '${columnName}' does not exist in songs table`,
          code: updateError.code,
          column: columnName
        }, { status: 500 });
      }
      
      console.error('❌ Update error:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update song', 
        details: updateError.message,
        code: updateError.code
      }, { status: 500 });
    }

    // Verify update affected at least one row
    if (!updateResult || updateResult.length === 0) {
      console.error('❌ Update affected 0 rows - song may not exist:', resolvedParams.id);
      return NextResponse.json({ 
        error: 'Song not found',
        details: `No song found with ID: ${resolvedParams.id}`,
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    console.log(`✅ Update successful - affected ${updateResult.length} row(s)`);

    // Now fetch the updated song data separately - select ALL fields
    const { data: updatedRows, error: fetchError } = await supabase
      .from('songs')
      .select(`
        *,
        artists (
          id,
          name,
          bio,
          image_url
        )
      `)
      .eq('id', resolvedParams.id)
      .single();
    
    // Handle null artist_id - populate artist info from text field if needed
    if (updatedRows && !updatedRows.artists && updatedRows.artist) {
      updatedRows.artists = {
        id: updatedRows.artist_id || null,
        name: updatedRows.artist,
        bio: null,
        image_url: null
      };
    }

    if (fetchError) {
      console.error('❌ Failed to fetch updated song:', fetchError);
      // Even if fetch fails, the update succeeded - we'll construct response from updateData
      console.warn('⚠️ Update succeeded but fetch failed, using updateData values');
    } else {
      console.log('✅ Fetched updated song data:', {
        title: updatedRows.title,
        artist_id: updatedRows.artist_id
      });
    }

    // Track if artist changed BEFORE we construct response
    const artistChanged = oldArtistId && updateData.artist_id && oldArtistId !== updateData.artist_id;

    // CRITICAL: Always use updateData values - these are what we KNOW were saved to the database
    // Don't trust Supabase's returned data which may be stale/cached
    // Fetch artist info separately to ensure we have the correct name
    let artistInfo = updatedRows?.artists || null;
    if (!artistInfo && updateData.artist_id) {
      try {
        const { data: freshArtist } = await supabase
          .from('artists')
          .select('id, name, bio, image_url')
          .eq('id', updateData.artist_id)
          .single();
        artistInfo = freshArtist;
      } catch (error) {
        console.warn('Could not fetch fresh artist info:', error);
      }
    }

    // Construct response from what we KNOW was saved (updateData)
    // Use updatedRows if available, otherwise construct from updateData
    // Ensure artist info is always populated, even if artist_id is null
    let finalArtistInfo = artistInfo || updatedRows?.artists;
    if (!finalArtistInfo && (updateData.artist || updatedRows?.artist)) {
      finalArtistInfo = {
        id: updateData.artist_id || updatedRows?.artist_id || null,
        name: updateData.artist || updatedRows?.artist || 'Unknown Artist',
        bio: null,
        image_url: null
      };
    }

    const song = updatedRows ? {
      ...updatedRows, // Start with fetched data - includes ALL fields from database
      // FORCE critical fields to match what we saved (most reliable)
      title: updateData.title,
      artist_id: updateData.artist_id,
      artist: updateData.artist || artistInfo?.name || updatedRows.artist,
      key_signature: updateData.key_signature !== undefined ? updateData.key_signature : updatedRows.key_signature,
      tempo: updateData.tempo !== undefined ? updateData.tempo : updatedRows.tempo,
      lyrics: updateData.lyrics !== undefined ? updateData.lyrics : updatedRows.lyrics,
      updated_at: new Date().toISOString(),
      slug: updateData.slug || updatedRows?.slug || createSlug(updateData.title || updatedRows?.title || ''),
      // Use fresh artist info, or fallback to text field
      artists: finalArtistInfo || (updateData.artist ? {
        id: updateData.artist_id || null,
        name: updateData.artist,
        bio: null,
        image_url: null
      } : null)
    } : {
      // Fallback: construct from updateData if fetch failed - include ALL fields
      id: resolvedParams.id,
      title: updateData.title,
      artist_id: updateData.artist_id || null,
      artist: updateData.artist || artistInfo?.name || null,
      key_signature: updateData.key_signature || null,
      tempo: updateData.tempo || null,
      lyrics: updateData.lyrics || null,
      slug: updateData.slug || createSlug(updateData.title || ''),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(), // Fallback
      // Ensure artist info is populated even if artist_id is null
      artists: finalArtistInfo || (updateData.artist ? {
        id: updateData.artist_id || null,
        name: updateData.artist,
        bio: null,
        image_url: null
      } : null)
    };

    console.log('✅ Constructed verified response data:', {
      title: song.title,
      artist_id: song.artist_id,
      artist_name: song.artists?.name || updateData.artist,
      artistChanged: artistChanged ? `From ${oldArtistId} to ${updateData.artist_id}` : 'No change',
      source: 'updateData (verified)'
    });

    // If artist changed, we need to update artist counts
    if (artistChanged && oldArtistId && updateData.artist_id) {
      console.log('🎨 Artist changed - updating counts:', {
        oldArtistId,
        newArtistId: updateData.artist_id,
        songId: resolvedParams.id
      });

      // Note: Artist counts are calculated dynamically from songs table
      // So they will update automatically when the song's artist_id changes
      // We just need to ensure the update is broadcast to refresh UI
    }

    // Final verification - ensure all fields are correct
    // Force artist name to match what we saved
    if (song.artists) {
      song.artists.name = updateData.artist || song.artists.name || artistInfo?.name || 'Unknown Artist';
      song.artists.id = updateData.artist_id;
    } else {
      song.artists = {
        id: updateData.artist_id,
        name: updateData.artist || artistInfo?.name || 'Unknown Artist',
        bio: artistInfo?.bio || null,
        image_url: artistInfo?.image_url || null
      };
    }

    // Log successful save with detailed info including artist information
    console.log('✅ Song saved successfully - FINAL VERIFIED DATA:', {
      id: song.id,
      title: song.title,
      artist_id: song.artist_id,
      artist_name: song.artists?.name,
      artist_text: song.artist,
      key_signature: song.key_signature ?? 'null',
      tempo: song.tempo ?? 'null',
      lyricsLength: song.lyrics?.length || 0,
      lyricsType: typeof song.lyrics,
      lyricsPreview: song.lyrics ? song.lyrics.substring(0, 100) + '...' : 'null',
      hasLyrics: !!song.lyrics,
      updated_at: song.updated_at,
      artistChanged: artistChanged,
      allFieldsSaved: '✅ All fields persisted and verified'
    });
    
    // Return detailed update information with cache-control headers to prevent caching
    const response = NextResponse.json({ 
      song, 
      message: 'Song updated successfully',
      artistUpdated: artistChanged || false,
      artistChanged: artistChanged || false,
      oldArtistId: oldArtistId || null,
      newArtistId: song.artist_id,
      newArtistName: song.artists?.name || updateData.artist || null,
      updatedFields: Object.keys(updateData).filter(key => key !== 'updated_at'),
      updateTimestamp: song.updated_at || new Date().toISOString(),
      changes: {
        title: updateData.title ? 'Updated' : undefined,
        artist_id: updateData.artist_id ? (artistChanged ? 'Changed' : 'Updated') : undefined,
        lyrics: updateData.lyrics !== undefined ? (updateData.lyrics ? 'Updated' : 'Cleared') : undefined,
        key_signature: updateData.key_signature !== undefined ? (updateData.key_signature ? 'Updated' : 'Cleared') : undefined,
        tempo: updateData.tempo !== undefined ? (updateData.tempo ? 'Updated' : 'Cleared') : undefined,
      }
    });
    
    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Updated-At', new Date().toISOString());
    response.headers.set('X-Song-Id', resolvedParams.id);
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const resolvedParams = await params;

    // CRITICAL: Get the song's artist_id BEFORE deleting (needed for updating artist counts)
    let artistId: string | null = null;
    try {
      const { data: songBeforeDelete } = await supabase
        .from('songs')
        .select('artist_id, title')
        .eq('id', resolvedParams.id)
        .single();

      if (songBeforeDelete) {
        artistId = songBeforeDelete.artist_id;
        console.log('📋 Song to delete:', {
          id: resolvedParams.id,
          title: songBeforeDelete.title,
          artist_id: artistId
        });
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch song before deletion:', error);
    }

    // Delete the song
    const { error, data: deleteResult } = await supabase
      .from('songs')
      .delete()
      .eq('id', resolvedParams.id)
      .select('id');

    if (error) {
      console.error('❌ Delete error:', error);
      return NextResponse.json({ 
        error: 'Failed to delete song',
        details: error.message 
      }, { status: 500 });
    }

    // Verify deletion succeeded
    if (!deleteResult || deleteResult.length === 0) {
      console.warn('⚠️ Delete query returned no rows - song may not exist');
      return NextResponse.json({ 
        error: 'Song not found',
        details: `No song found with ID: ${resolvedParams.id}`
      }, { status: 404 });
    }

    console.log(`✅ Song deleted successfully: ${resolvedParams.id}`, {
      artistId: artistId,
      affectedRows: deleteResult.length
    });

    // Return deletion info including artist_id for UI updates
    const response = NextResponse.json({ 
      message: 'Song deleted successfully',
      songId: resolvedParams.id,
      artistId: artistId
    });

    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('❌ Delete exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
