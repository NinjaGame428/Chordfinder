const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 10 new chord-related resources
const chordResources = [
  {
    title: "Jazz Chord Voicings for Worship",
    description: "Explore sophisticated jazz chord voicings adapted for contemporary worship. Learn extended chords, altered dominants, and upper structure triads that add color and depth to worship music. Perfect for advanced pianists and guitarists looking to expand their harmonic vocabulary.",
    type: "PDF",
    category: "Chords",
    author: "Heavenkeys Music Academy",
    downloads: 542,
    rating: 4.7,
    file_size: 3072 // 3 MB in KB
  },
  {
    title: "Movable Chord Shapes for Guitar",
    description: "Master movable chord shapes that work in any key. Learn barre chords, CAGED system applications, and how to transpose any chord progression instantly. Essential for worship guitarists who need to adapt to different singers and song keys.",
    type: "Video",
    category: "Chords",
    author: "Heavenkeys Music Academy",
    downloads: 678,
    rating: 4.8,
    file_size: null // Online
  },
  {
    title: "Chord Melody Techniques for Solo Guitar",
    description: "Learn to play chords and melody simultaneously on guitar. Perfect for acoustic worship settings, solo performances, and creating full arrangements on a single instrument. Includes examples from popular worship songs and hymns.",
    type: "PDF",
    category: "Chords",
    author: "Heavenkeys Music Academy",
    downloads: 423,
    rating: 4.6,
    file_size: 2560 // 2.5 MB
  },
  {
    title: "Secondary Dominants Masterclass",
    description: "Master the art of secondary dominant chords to add harmonic interest to worship progressions. Learn V/V, V/vi, and other secondary dominants with practical applications in gospel and contemporary worship music.",
    type: "Video",
    category: "Theory",
    author: "Heavenkeys Music Academy",
    downloads: 389,
    rating: 4.9,
    file_size: null // Online
  },
  {
    title: "Drop 2 Chord Voicings for Piano",
    description: "Learn professional drop 2 voicings used by top gospel and jazz pianists. These voicings create smooth voice leading and professional-sounding chord progressions. Includes exercises and worship song applications.",
    type: "PDF",
    category: "Chords",
    author: "Heavenkeys Music Academy",
    downloads: 512,
    rating: 4.8,
    file_size: 2048 // 2 MB
  },
  {
    title: "Chord Inversions Practice Pack",
    description: "Comprehensive practice exercises for mastering chord inversions on piano and guitar. Learn root position, first inversion, and second inversion chords in all keys. Includes downloadable practice tracks and exercises.",
    type: "Audio",
    category: "Practice",
    author: "Heavenkeys Music Academy",
    downloads: 634,
    rating: 4.5,
    file_size: 1536 // 1.5 MB
  },
  {
    title: "Suspended Chords in Worship",
    description: "Master the use of sus2 and sus4 chords to create tension and release in worship music. Learn when and how to use suspended chords for maximum emotional impact. Includes analysis of popular worship songs.",
    type: "PDF",
    category: "Chords",
    author: "Heavenkeys Music Academy",
    downloads: 456,
    rating: 4.7,
    file_size: 1792 // 1.75 MB
  },
  {
    title: "Power Chords and Rock Worship",
    description: "Learn effective use of power chords in energetic worship settings. Perfect for electric guitar players in contemporary worship bands. Includes palm muting techniques, dynamics, and amp settings.",
    type: "Video",
    category: "Chords",
    author: "Heavenkeys Music Academy",
    downloads: 587,
    rating: 4.6,
    file_size: null // Online
  },
  {
    title: "Diminished and Augmented Chord Applications",
    description: "Explore the use of diminished and augmented chords in gospel and worship music. Learn passing diminished chords, augmented chord resolutions, and how these unique sounds can enhance your arrangements.",
    type: "PDF",
    category: "Theory",
    author: "Heavenkeys Music Academy",
    downloads: 398,
    rating: 4.8,
    file_size: 2304 // 2.25 MB
  },
  {
    title: "Chord Chart Reading for Beginners",
    description: "Learn to read and interpret chord charts, Nashville numbers, and lead sheets. Essential for any musician joining a worship team. Includes practice charts from popular worship songs and step-by-step tutorials.",
    type: "PDF",
    category: "Chords",
    author: "Heavenkeys Music Academy",
    downloads: 892,
    rating: 4.9,
    file_size: 1024 // 1 MB
  }
];

async function addChordResources() {
  console.log('🎸 Adding 10 chord-related resources to Supabase...\n');

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const resource of chordResources) {
      const { data, error } = await supabase
        .from('resources')
        .insert([resource])
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
    console.log(`   ✅ Successfully added: ${successCount} chord resources`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed: ${errorCount} resources`);
    }
    console.log(`\n🎉 Chord resources added successfully!`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

addChordResources();

