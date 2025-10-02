import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import YouTubeVideoFinder from '@/components/YouTubeVideoFinder';

const YouTubeFinderPage: React.FC = () => {
  const handleVideoIdUpdate = (songId: number, videoId: string) => {
    console.log(`Updating song ${songId} with video ID: ${videoId}`);
    // Here you would typically save to a database
    // For now, we'll just log the update
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">YouTube Video Finder</h1>
            <p className="text-lg text-muted-foreground">
              Find and update YouTube video IDs for Dena Mwana songs
            </p>
          </div>
          <YouTubeVideoFinder onVideoIdUpdate={handleVideoIdUpdate} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default YouTubeFinderPage;
