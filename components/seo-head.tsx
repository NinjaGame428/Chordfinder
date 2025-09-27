"use client";

import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'music.song' | 'music.album';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  structuredData?: any;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Chord Finder - Gospel Music Resources',
  description = 'Discover gospel music chords, lyrics, and resources. Find chord charts for your favorite worship songs and learn to play gospel music.',
  keywords = ['gospel music', 'chord charts', 'worship songs', 'guitar chords', 'piano chords', 'music resources'],
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Heavenkeys Ltd.',
  section,
  tags = [],
  structuredData
}) => {
  const fullTitle = title.includes('Chord Finder') ? title : `${title} | Chord Finder`;
  const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'music.song' ? 'MusicComposition' : 'WebSite',
    "name": title,
    "description": description,
    "url": url,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Heavenkeys Ltd.",
      "url": "https://heavenkeys.ca"
    },
    ...(type === 'music.song' && {
      "@type": "MusicComposition",
      "genre": "Gospel",
      "inLanguage": "en"
    })
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Chord Finder" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@chordfinder" />
      <meta name="twitter:creator" content="@heavenkeys" />
      
      {/* Additional Meta Tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.length > 0 && <meta property="article:tag" content={tags.join(', ')} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />
    </Head>
  );
};

export default SEOHead;
