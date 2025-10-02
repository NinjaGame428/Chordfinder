'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, CheckCircle } from 'lucide-react';

interface DownloadButtonProps {
  videos: any[];
  filename?: string;
  disabled?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  videos, 
  filename = 'youtube_search_results',
  disabled = false 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async () => {
    if (!videos || videos.length === 0) {
      return;
    }

    setIsDownloading(true);
    setDownloadSuccess(false);
    setDownloadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch('/api/generate-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videos,
          filename,
        }),
      });

      clearInterval(progressInterval);
      setDownloadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate CSV');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      let finalFilename = `${filename}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          finalFilename = filenameMatch[1];
        }
      }
      
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        setDownloadProgress(0);
      }, 3000);

    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download CSV file. Please try again.');
      setDownloadProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleDownload}
        disabled={disabled || isDownloading || videos.length === 0}
        className="w-full sm:w-auto"
        variant="outline"
      >
        {isDownloading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating CSV... {downloadProgress > 0 && `${downloadProgress}%`}
          </>
        ) : downloadSuccess ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Downloaded!
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download CSV ({videos.length} videos)
          </>
        )}
      </Button>
      
      {isDownloading && downloadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${downloadProgress}%` }}
          ></div>
        </div>
      )}
      
      {videos.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          CSV will include: Title, Link, Thumbnail for {videos.length} videos
        </p>
      )}
    </div>
  );
};

export default DownloadButton;
