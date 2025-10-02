import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { searchQuery } = await request.json();

    if (!searchQuery || typeof searchQuery !== 'string') {
      return NextResponse.json(
        { message: 'Search query is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    // YouTube Data API v3 search endpoint
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      return NextResponse.json(
        { message: 'Failed to search YouTube videos', error: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform the YouTube API response to match our expected format
    const videos = data.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      duration: 'Unknown', // Duration requires additional API call
      viewCount: 'Unknown' // View count requires additional API call
    })) || [];

    return NextResponse.json({
      videos,
      searchQuery,
      totalResults: data.pageInfo?.totalResults || videos.length,
      nextPageToken: data.nextPageToken
    });

  } catch (error) {
    console.error('YouTube Search Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
