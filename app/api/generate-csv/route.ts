import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { videos, filename } = await request.json();

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json(
        { error: 'No videos provided' },
        { status: 400 }
      );
    }

    // Create CSV headers
    const headers = [
      'Title',
      'YouTube ID',
      'URL',
      'Thumbnail',
      'Channel',
      'Published Date',
      'Description'
    ];

    // Convert videos to CSV rows
    const csvRows = videos.map(video => [
      `"${(video.title || '').replace(/"/g, '""')}"`, // Escape quotes in title
      video.id || '',
      video.url || '',
      video.thumbnail || '',
      `"${(video.channelTitle || '').replace(/"/g, '""')}"`, // Escape quotes in channel
      video.publishedAt || '',
      `"${(video.description || '').replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '')}"` // Escape quotes and remove line breaks
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename || 'youtube_search_results'}_${timestamp}.csv`;

    // Return CSV as response
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${finalFilename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('CSV Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV file' },
      { status: 500 }
    );
  }
}