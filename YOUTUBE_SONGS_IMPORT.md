# YouTube Songs Import Guide

This document describes how 170+ gospel songs were imported from YouTube into your Chords Finder application.

## 📊 Import Summary

- **Total URLs Processed**: 180
- **Successfully Scraped**: 178 songs
- **Successfully Added to Database**: 170 songs
- **Unique Artists Created**: 79 artists
- **Failed/Invalid URLs**: 2

## 🎯 What Was Done

### 1. Created Import Script (`add-youtube-songs.js`)

A Node.js script that:
- Extracts video IDs from YouTube URLs
- Fetches video metadata using YouTube Data API v3
- Scrapes title, artist (channel name), description, duration, thumbnail, and publish date
- Creates artist records in Supabase
- Adds songs to the database with proper relationships

### 2. Database Schema

Songs are stored in two tables:

**Artists Table:**
- `id` (UUID, primary key)
- `name` (Text, artist/channel name)
- `bio` (Text)
- `image_url` (Text, YouTube thumbnail)
- `created_at`, `updated_at`

**Songs Table:**
- `id` (UUID, primary key)
- `title` (Text)
- `artist_id` (UUID, references artists)
- `genre` (Text, default: Gospel)
- `key_signature` (Text, null for YouTube imports)
- `tempo` (Integer, null for YouTube imports)
- `chords` (Array, null for YouTube imports)
- `lyrics` (Text, null for YouTube imports)
- `description` (Text, includes YouTube URL, duration, etc.)
- `year` (Integer, extracted from publish date)
- `rating`, `downloads`, `created_at`, `updated_at`

### 3. Frontend Updates (`app/songs/page.tsx`)

Modified the Songs page to:
- Fetch songs from Supabase on component mount
- Combine hardcoded songs with database songs
- Display loading state while fetching
- Show all songs in grid or list view
- Support filtering and search across all songs

## 🎵 Song Data Included

Each imported song contains:
- **Title**: Full video title
- **Artist**: YouTube channel name
- **Description**: First 500 characters of video description + metadata
- **Year**: Year from video publish date
- **Thumbnail**: High-quality YouTube thumbnail URL
- **YouTube URL**: Full link embedded in description
- **Duration**: Video length (e.g., "3:45")
- **Video ID**: For future reference

## 🔑 Environment Variables Required

```env
# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🚀 How to Use the Import Script

To add more YouTube songs in the future:

1. **Edit the URLs** in `add-youtube-songs.js`:
   ```javascript
   const youtubeUrls = [
     "https://youtu.be/VIDEO_ID_1",
     "https://youtu.be/VIDEO_ID_2",
     // ... add more URLs
   ];
   ```

2. **Run the script**:
   ```bash
   node add-youtube-songs.js
   ```

3. **Check the output**:
   - ✅ Successfully added songs
   - ⏭️ Skipped (duplicates)
   - ❌ Failed (with error messages)

## 📝 Notes

- **Duplicate Prevention**: The script checks for existing songs by title and artist before inserting
- **Artist Caching**: Artists are cached during import to avoid redundant database lookups
- **Batch Processing**: URLs are processed in batches of 10 with 2-second delays to respect rate limits
- **Error Handling**: Invalid URLs and API failures are logged but don't stop the import process

## 🎨 Artists Imported

79 unique artists/channels were created, including:
- Impact Gospel Choir
- Dena Mwana
- Hosanna Music
- SION
- Deborah Lukalu
- ICC Paris
- Derek-Jones
- Joseph Moussio
- And 71 more...

## 📱 Viewing Songs

Songs are displayed at `/songs` with:
- Grid and list view options
- Search by title, artist, or key
- Filter by category
- Load more pagination
- YouTube thumbnail integration
- Direct link to YouTube videos in descriptions

## 🔄 Future Enhancements

Potential improvements:
1. Add chord detection using music analysis APIs
2. Fetch lyrics from YouTube captions
3. Extract tempo and key using audio analysis
4. Add video player integration
5. Implement automated periodic imports
6. Add admin interface for manual song editing

## 📞 Support

For issues or questions:
1. Check Supabase dashboard for data verification
2. Review script output for error messages
3. Verify environment variables are set correctly
4. Check YouTube API quota limits

