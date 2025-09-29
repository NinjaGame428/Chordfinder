"use client";

import { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Only preload fonts if they're not already loaded
      const existingFontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
      if (existingFontLinks.length === 0) {
        const fontLinks = [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        ];
        
        fontLinks.forEach(href => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        });
      }
    };

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.loading) {
          img.loading = 'lazy';
        }
        if (!img.decoding) {
          img.decoding = 'async';
        }
      });
    };

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Run optimizations
    registerServiceWorker();
    preloadCriticalResources();
    optimizeImages();

    // Cleanup function
    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
};
