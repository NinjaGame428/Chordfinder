const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// All resources from the resources page
const resources = [
  {
    title: "Gospel Chord Theory Guide",
    description: "Master the fundamentals of gospel chord theory with this comprehensive guide. Learn chord construction, progressions, and gospel music theory essentials. Covers major and minor chords, suspended chords, extended chords, chord inversions, and essential worship chord progressions. Includes practical applications for guitar, piano, and vocalists with real-world examples and exercises.",
    type: "PDF Guide",
    size: "2.3 MB",
    downloads: 1234,
    category: "Theory",
    author: "Heavenkeys Music Academy",
    rating: 4.8,
    totalRatings: 156
  },
  {
    title: "Complete Scales Reference",
    description: "The ultimate scales reference for worship musicians. Covers all major scales, natural minor scales, harmonic minor scales, all seven modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian), major and minor pentatonic scales, major and minor blues scales, diminished scales, whole tone scales, and chromatic scales. Includes fingerings for guitar and piano, interval patterns, and practical applications for worship music.",
    type: "PDF Guide",
    size: "3.1 MB",
    downloads: 2156,
    category: "Scales",
    author: "Heavenkeys Music Academy",
    rating: 4.6,
    totalRatings: 89
  },
  {
    title: "Complete Chords Dictionary",
    description: "The definitive chord reference for worship musicians. Covers all chord types including triads (major, minor, diminished, augmented), seventh chords (dominant 7th, major 7th, minor 7th, half-diminished), chord extensions (9th, 11th, 13th), altered chords, suspended chords, and slash chords. Includes fingerings for guitar and piano, chord symbols, and practical applications for worship music.",
    type: "PDF Guide",
    size: "4.2 MB",
    downloads: 3289,
    category: "Chords",
    author: "Heavenkeys Music Academy",
    rating: 4.9,
    totalRatings: 234
  },
  {
    title: "Worship Leading Masterclass",
    description: "Master the art of worship leading with this comprehensive video series. Learn advanced worship leading techniques, song flow management, and team leadership skills. Create seamless transitions between songs, master dynamics for emotional peaks and valleys, implement key transitions and tonic pads, manage tempo changes, and lead gospel-centered worship sets. Includes practical tips for team communication, skill development, and digital resource management.",
    type: "Video Series",
    size: "Online",
    downloads: 987,
    category: "Training",
    author: "Heavenkeys Music Academy",
    rating: 4.7,
    totalRatings: 123
  },
  {
    title: "Guitar Chord Voicings for Worship",
    description: "Master advanced guitar voicings and strumming patterns for contemporary gospel and worship music. Learn essential contemporary chord voicings including C Major, G Major, E Minor, and E Major. Master fingerings for popular worship progressions, understand chord construction, and develop techniques for creating emotional connections through familiar chord progressions. Includes practical applications for modern worship music.",
    type: "PDF Guide",
    size: "1.8 MB",
    downloads: 765,
    category: "Practice",
    author: "Heavenkeys Music Academy",
    rating: 4.5,
    totalRatings: 98
  },
  {
    title: "Piano Accompaniment Techniques",
    description: "Master piano accompaniment for worship, gospel, and contemporary styles. Learn common chord progressions like 1-5-6-4 (Axis) and I-V-vi-iii-IV-I-IV-V (Pachelbel's Canon). Master chord extensions (add2, sus4), inversions, syncopated rhythms, and left-hand techniques including open fifths, arpeggios, and step-wise bass movement. Create smooth transitions with common tones and 'floating chord islands' for a heavenly worship atmosphere.",
    type: "Video Tutorial",
    size: "Online",
    downloads: 543,
    category: "Piano",
    author: "Heavenkeys Music Academy",
    rating: 4.6,
    totalRatings: 87
  },
  {
    title: "Vocal Harmony Guide",
    description: "Master vocal harmonies for worship teams with this comprehensive guide. Learn ear training techniques, basic harmony principles (thirds, fifths), four-part harmony structure (soprano, alto, tenor, bass), and gospel/contemporary style techniques including belting and improvisation. Includes practical exercises for singing with recordings, interval practice, chord practice, and team development strategies for worship ministry.",
    type: "PDF Guide",
    size: "1.1 MB",
    downloads: 432,
    category: "Vocals",
    author: "Heavenkeys Music Academy",
    rating: 4.4,
    totalRatings: 76
  },
  {
    title: "Worship Team Communication Template",
    description: "Professional templates for effective communication and scheduling within your worship team. Includes email templates, scheduling forms, rehearsal planning sheets, and team communication protocols. Streamline your worship team management with proven communication strategies and organizational tools.",
    type: "Document",
    size: "0.5 MB",
    downloads: 654,
    category: "Team",
    author: "Heavenkeys Music Academy",
    rating: 4.3,
    totalRatings: 54
  },
  {
    title: "Audio Mixing Basics for Live Sound",
    description: "Master the fundamentals of live sound mixing for church services and worship events. Learn essential mixing techniques, equipment setup, sound system optimization, and troubleshooting. Perfect for worship teams, sound engineers, and church technical volunteers who want to improve their live sound mixing skills.",
    type: "Video Tutorial",
    size: "Online",
    downloads: 321,
    category: "Tech",
    author: "Heavenkeys Music Academy",
    rating: 4.7,
    totalRatings: 92
  },
  {
    title: "Gospel Music History & Culture",
    description: "Explore the rich history and cultural significance of gospel music. Learn about the origins, evolution, and impact of gospel music on worship and contemporary Christian music. Discover the stories behind legendary gospel artists, influential songs, and the cultural movements that shaped gospel music into what it is today.",
    type: "PDF Guide",
    size: "5.2 MB",
    downloads: 876,
    category: "History",
    author: "Heavenkeys Music Academy",
    rating: 4.8,
    totalRatings: 145
  },
  {
    title: "Advanced Chord Substitutions",
    description: "Master sophisticated chord substitution techniques for gospel and worship music. Learn advanced harmonic concepts, tritone substitutions, secondary dominants, and complex chord progressions. Develop your harmonic vocabulary and create more interesting and sophisticated worship arrangements.",
    type: "PDF Guide",
    size: "2.8 MB",
    downloads: 543,
    category: "Theory",
    author: "Heavenkeys Music Academy",
    rating: 4.6,
    totalRatings: 78
  },
  {
    title: "Contemporary Gospel Arranging",
    description: "Master the art of arranging gospel songs for different ensemble sizes and worship contexts. Learn professional arranging techniques, instrumentation choices, vocal arrangements, and how to adapt gospel songs for various worship settings. Perfect for worship leaders, music directors, and gospel musicians.",
    type: "Video Course",
    size: "Online",
    downloads: 432,
    category: "Training",
    author: "Heavenkeys Music Academy",
    rating: 4.7,
    totalRatings: 103
  },
  {
    title: "Fingerpicking Patterns for Gospel",
    description: "Master essential fingerpicking patterns and techniques for acoustic gospel guitar. Learn traditional gospel fingerpicking styles, contemporary worship applications, and how to create beautiful acoustic arrangements for worship songs. Perfect for acoustic guitarists in worship teams.",
    type: "PDF Guide",
    size: "1.5 MB",
    downloads: 389,
    category: "Practice",
    author: "Heavenkeys Music Academy",
    rating: 4.5,
    totalRatings: 67
  },
  {
    title: "Gospel Piano Styles Collection",
    description: "Master comprehensive gospel piano styles and techniques with this extensive video series. Learn traditional gospel piano styles, contemporary worship applications, and how to create authentic gospel piano arrangements. Perfect for pianists in worship teams and gospel musicians.",
    type: "Video Series",
    size: "Online",
    downloads: 567,
    category: "Piano",
    author: "Heavenkeys Music Academy",
    rating: 4.8,
    totalRatings: 134
  },
  {
    title: "Vocal Warm-up Exercises",
    description: "Master professional vocal warm-up routines for worship singers. Learn essential vocal exercises, breathing techniques, and warm-up routines used by professional worship vocalists. Perfect for worship team vocalists, soloists, and gospel singers.",
    type: "Audio Guide",
    size: "25 min",
    downloads: 432,
    category: "Vocals",
    author: "Heavenkeys Music Academy",
    rating: 4.4,
    totalRatings: 89
  },
  {
    title: "Worship Team Leadership Guide",
    description: "Master the art of leading and managing worship teams effectively. Learn essential leadership skills, team management techniques, and how to build strong worship teams. Perfect for worship leaders, music directors, and church leaders.",
    type: "PDF Guide",
    size: "3.4 MB",
    downloads: 678,
    category: "Team",
    author: "Heavenkeys Music Academy",
    rating: 4.6,
    totalRatings: 98
  },
  {
    title: "Sound System Setup Guide",
    description: "Master the art of setting up sound systems for church services. Learn essential audio engineering skills, sound system configuration, and how to achieve professional sound quality in worship settings. Perfect for sound engineers, worship leaders, and church technical teams.",
    type: "PDF Guide",
    size: "2.1 MB",
    downloads: 345,
    category: "Tech",
    author: "Heavenkeys Music Academy",
    rating: 4.5,
    totalRatings: 76
  },
  {
    title: "Song Copyright Guidelines",
    description: "Master the art of understanding copyright laws and licensing for worship music. Learn essential legal knowledge, copyright compliance, and how to navigate the complex world of music licensing in worship settings. Perfect for worship leaders, church administrators, and music directors.",
    type: "Document",
    size: "0.8 MB",
    downloads: 234,
    category: "Resources",
    author: "Heavenkeys Music Academy",
    rating: 4.3,
    totalRatings: 45
  },
  {
    title: "Worship Ministry Certification",
    description: "Master the art of worship ministry leadership with our comprehensive certification program. Learn essential worship ministry skills, leadership techniques, and how to build strong worship ministries. Perfect for worship leaders, music directors, and church leaders.",
    type: "Course",
    size: "Online",
    downloads: 456,
    category: "Training",
    author: "Heavenkeys Music Academy",
    rating: 4.9,
    totalRatings: 167
  },
  {
    title: "Gospel Drum Patterns",
    description: "Master essential drum patterns and techniques for gospel and worship music. Learn traditional gospel drum grooves, contemporary worship applications, and how to play dynamically for worship settings. Perfect for drummers in worship teams.",
    type: "Video Tutorial",
    size: "Online",
    downloads: 289,
    category: "Practice",
    author: "Heavenkeys Music Academy",
    rating: 4.6,
    totalRatings: 72
  }
];

async function pushResourcesToSupabase() {
  console.log('🚀 Starting to push resources to Supabase...\n');

  try {
    // First, delete existing sample resources to avoid duplicates
    console.log('🗑️  Clearing existing resources...');
    const { error: deleteError } = await supabase
      .from('resources')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('⚠️  Warning while clearing resources:', deleteError.message);
    } else {
      console.log('✅ Existing resources cleared\n');
    }

    // Insert resources one by one
    let successCount = 0;
    let errorCount = 0;

    for (const resource of resources) {
      // Convert size to a number (in KB) if possible
      let fileSizeKb = null;
      if (resource.size && resource.size !== 'Online') {
        const match = resource.size.match(/(\d+\.?\d*)\s*(MB|KB|min)/i);
        if (match) {
          const value = parseFloat(match[1]);
          const unit = match[2].toUpperCase();
          if (unit === 'MB') {
            fileSizeKb = Math.round(value * 1024);
          } else if (unit === 'KB') {
            fileSizeKb = Math.round(value);
          }
        }
      }

      // Map types to simpler values
      let simpleType = resource.type;
      if (resource.type.includes('PDF')) simpleType = 'PDF';
      else if (resource.type.includes('Video')) simpleType = 'Video';
      else if (resource.type.includes('Document')) simpleType = 'Document';
      else if (resource.type.includes('Course')) simpleType = 'Course';
      else if (resource.type.includes('Audio')) simpleType = 'Audio';
      else simpleType = 'Document';

      const resourceData = {
        title: resource.title,
        description: resource.description,
        type: simpleType,
        category: resource.category,
        author: resource.author,
        downloads: resource.downloads || 0,
        rating: resource.rating || 0,
        file_size: fileSizeKb
      };

      const { data, error } = await supabase
        .from('resources')
        .insert([resourceData])
        .select();

      if (error) {
        console.error(`❌ Error adding "${resource.title}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Added: ${resource.title}`);
        successCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully added: ${successCount} resources`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed: ${errorCount} resources`);
    }
    console.log(`\n🎉 Resources push completed!`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

pushResourcesToSupabase();

