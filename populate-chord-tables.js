const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// All chord data organized by type
const chordData = {
  major: [
    { name: 'C', notes: ['C', 'E', 'G'], root: 'C' },
    { name: 'C#', notes: ['C#', 'E#', 'G#'], root: 'C#', alt: 'Db' },
    { name: 'Db', notes: ['Db', 'F', 'Ab'], root: 'Db', alt: 'C#' },
    { name: 'D', notes: ['D', 'F#', 'A'], root: 'D' },
    { name: 'D#', notes: ['D#', 'F##', 'A#'], root: 'D#', alt: 'Eb' },
    { name: 'Eb', notes: ['Eb', 'G', 'Bb'], root: 'Eb', alt: 'D#' },
    { name: 'E', notes: ['E', 'G#', 'B'], root: 'E' },
    { name: 'F', notes: ['F', 'A', 'C'], root: 'F' },
    { name: 'F#', notes: ['F#', 'A#', 'C#'], root: 'F#', alt: 'Gb' },
    { name: 'Gb', notes: ['Gb', 'Bb', 'Db'], root: 'Gb', alt: 'F#' },
    { name: 'G', notes: ['G', 'B', 'D'], root: 'G' },
    { name: 'G#', notes: ['G#', 'B#', 'D#'], root: 'G#', alt: 'Ab' },
    { name: 'Ab', notes: ['Ab', 'C', 'Eb'], root: 'Ab', alt: 'G#' },
    { name: 'A', notes: ['A', 'C#', 'E'], root: 'A' },
    { name: 'A#', notes: ['A#', 'C##', 'E#'], root: 'A#', alt: 'Bb' },
    { name: 'Bb', notes: ['Bb', 'D', 'F'], root: 'Bb', alt: 'A#' },
    { name: 'B', notes: ['B', 'D#', 'F#'], root: 'B' }
  ],
  minor: [
    { name: 'Cm', notes: ['C', 'Eb', 'G'], root: 'C' },
    { name: 'C#m', notes: ['C#', 'E', 'G#'], root: 'C#', alt: 'Dbm' },
    { name: 'Dbm', notes: ['Db', 'Fb', 'Ab'], root: 'Db', alt: 'C#m' },
    { name: 'Dm', notes: ['D', 'F', 'A'], root: 'D' },
    { name: 'D#m', notes: ['D#', 'F#', 'A#'], root: 'D#', alt: 'Ebm' },
    { name: 'Ebm', notes: ['Eb', 'Gb', 'Bb'], root: 'Eb', alt: 'D#m' },
    { name: 'Em', notes: ['E', 'G', 'B'], root: 'E' },
    { name: 'Fm', notes: ['F', 'Ab', 'C'], root: 'F' },
    { name: 'F#m', notes: ['F#', 'A', 'C#'], root: 'F#', alt: 'Gbm' },
    { name: 'Gbm', notes: ['Gb', 'Bbb', 'Db'], root: 'Gb', alt: 'F#m' },
    { name: 'Gm', notes: ['G', 'Bb', 'D'], root: 'G' },
    { name: 'G#m', notes: ['G#', 'B', 'D#'], root: 'G#', alt: 'Abm' },
    { name: 'Abm', notes: ['Ab', 'Cb', 'Eb'], root: 'Ab', alt: 'G#m' },
    { name: 'Am', notes: ['A', 'C', 'E'], root: 'A' },
    { name: 'A#m', notes: ['A#', 'C#', 'E#'], root: 'A#', alt: 'Bbm' },
    { name: 'Bbm', notes: ['Bb', 'Db', 'F'], root: 'Bb', alt: 'A#m' },
    { name: 'Bm', notes: ['B', 'D', 'F#'], root: 'B' }
  ],
  diminished: [
    { name: 'Cdim', notes: ['C', 'Eb', 'Gb'], root: 'C' },
    { name: 'C#dim', notes: ['C#', 'E', 'G'], root: 'C#' },
    { name: 'Ddim', notes: ['D', 'F', 'Ab'], root: 'D' },
    { name: 'D#dim', notes: ['D#', 'F#', 'A'], root: 'D#' },
    { name: 'Edim', notes: ['E', 'G', 'Bb'], root: 'E' },
    { name: 'Fdim', notes: ['F', 'Ab', 'Cb'], root: 'F' },
    { name: 'F#dim', notes: ['F#', 'A', 'C'], root: 'F#' },
    { name: 'Gdim', notes: ['G', 'Bb', 'Db'], root: 'G' },
    { name: 'G#dim', notes: ['G#', 'B', 'D'], root: 'G#' },
    { name: 'Adim', notes: ['A', 'C', 'Eb'], root: 'A' },
    { name: 'A#dim', notes: ['A#', 'C#', 'E'], root: 'A#' },
    { name: 'Bdim', notes: ['B', 'D', 'F'], root: 'B' }
  ],
  augmented: [
    { name: 'Caug', notes: ['C', 'E', 'G#'], root: 'C' },
    { name: 'C#aug', notes: ['C#', 'E#', 'G##'], root: 'C#' },
    { name: 'Daug', notes: ['D', 'F#', 'A#'], root: 'D' },
    { name: 'D#aug', notes: ['D#', 'F##', 'A##'], root: 'D#' },
    { name: 'Eaug', notes: ['E', 'G#', 'B#'], root: 'E' },
    { name: 'Faug', notes: ['F', 'A', 'C#'], root: 'F' },
    { name: 'F#aug', notes: ['F#', 'A#', 'C##'], root: 'F#' },
    { name: 'Gaug', notes: ['G', 'B', 'D#'], root: 'G' },
    { name: 'G#aug', notes: ['G#', 'B#', 'D##'], root: 'G#' },
    { name: 'Aaug', notes: ['A', 'C#', 'E#'], root: 'A' },
    { name: 'A#aug', notes: ['A#', 'C##', 'E##'], root: 'A#' },
    { name: 'Baug', notes: ['B', 'D#', 'F##'], root: 'B' }
  ],
  dominant7: [
    { name: 'C7', notes: ['C', 'E', 'G', 'Bb'], root: 'C' },
    { name: 'D7', notes: ['D', 'F#', 'A', 'C'], root: 'D' },
    { name: 'E7', notes: ['E', 'G#', 'B', 'D'], root: 'E' },
    { name: 'F7', notes: ['F', 'A', 'C', 'Eb'], root: 'F' },
    { name: 'G7', notes: ['G', 'B', 'D', 'F'], root: 'G' },
    { name: 'A7', notes: ['A', 'C#', 'E', 'G'], root: 'A' },
    { name: 'B7', notes: ['B', 'D#', 'F#', 'A'], root: 'B' }
  ],
  major7: [
    { name: 'Cmaj7', notes: ['C', 'E', 'G', 'B'], root: 'C' },
    { name: 'Dmaj7', notes: ['D', 'F#', 'A', 'C#'], root: 'D' },
    { name: 'Emaj7', notes: ['E', 'G#', 'B', 'D#'], root: 'E' },
    { name: 'Fmaj7', notes: ['F', 'A', 'C', 'E'], root: 'F' },
    { name: 'Gmaj7', notes: ['G', 'B', 'D', 'F#'], root: 'G' },
    { name: 'Amaj7', notes: ['A', 'C#', 'E', 'G#'], root: 'A' },
    { name: 'Bmaj7', notes: ['B', 'D#', 'F#', 'A#'], root: 'B' }
  ],
  minor7: [
    { name: 'Cm7', notes: ['C', 'Eb', 'G', 'Bb'], root: 'C' },
    { name: 'Dm7', notes: ['D', 'F', 'A', 'C'], root: 'D' },
    { name: 'Em7', notes: ['E', 'G', 'B', 'D'], root: 'E' },
    { name: 'Fm7', notes: ['F', 'Ab', 'C', 'Eb'], root: 'F' },
    { name: 'Gm7', notes: ['G', 'Bb', 'D', 'F'], root: 'G' },
    { name: 'Am7', notes: ['A', 'C', 'E', 'G'], root: 'A' },
    { name: 'Bm7', notes: ['B', 'D', 'F#', 'A'], root: 'B' }
  ],
  minorMajor7: [
    { name: 'Cm(maj7)', notes: ['C', 'Eb', 'G', 'B'], root: 'C' },
    { name: 'Dm(maj7)', notes: ['D', 'F', 'A', 'C#'], root: 'D' },
    { name: 'Em(maj7)', notes: ['E', 'G', 'B', 'D#'], root: 'E' }
  ],
  halfDiminished7: [
    { name: 'Cm7b5', notes: ['C', 'Eb', 'Gb', 'Bb'], root: 'C' },
    { name: 'Dm7b5', notes: ['D', 'F', 'Ab', 'C'], root: 'D' },
    { name: 'Em7b5', notes: ['E', 'G', 'Bb', 'D'], root: 'E' }
  ],
  diminished7: [
    { name: 'Cdim7', notes: ['C', 'Eb', 'Gb', 'A'], root: 'C' },
    { name: 'C#dim7', notes: ['C#', 'E', 'G', 'Bb'], root: 'C#' },
    { name: 'Ddim7', notes: ['D', 'F', 'Ab', 'B'], root: 'D' }
  ],
  suspended: [
    { name: 'Csus2', notes: ['C', 'D', 'G'], root: 'C' },
    { name: 'Csus4', notes: ['C', 'F', 'G'], root: 'C' }
  ],
  added: [
    { name: 'Cadd9', notes: ['C', 'E', 'G', 'D'], root: 'C' },
    { name: 'Cadd11', notes: ['C', 'E', 'G', 'F'], root: 'C' }
  ]
};

// Guitar chord fingerings for common chords
const guitarFingerings = {
  'C': { frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], difficulty: 'Easy' },
  'D': { frets: [0, 0, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], difficulty: 'Easy' },
  'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], difficulty: 'Easy' },
  'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4], difficulty: 'Easy' },
  'A': { frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], difficulty: 'Easy' },
  'Am': { frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], difficulty: 'Easy' },
  'Dm': { frets: [0, 0, 0, 2, 3, 1], fingers: [0, 0, 0, 1, 3, 2], difficulty: 'Easy' },
  'Em': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], difficulty: 'Easy' },
  'F': { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'Medium' },
  'B': { frets: [2, 2, 4, 4, 4, 2], fingers: [1, 1, 2, 3, 4, 1], difficulty: 'Medium' }
};

const intervalPatterns = {
  major: 'Root - Major 3rd - Perfect 5th',
  minor: 'Root - Minor 3rd - Perfect 5th',
  diminished: 'Root - Minor 3rd - Diminished 5th',
  augmented: 'Root - Major 3rd - Augmented 5th',
  dominant7: 'Root - Major 3rd - Perfect 5th - Minor 7th',
  major7: 'Root - Major 3rd - Perfect 5th - Major 7th',
  minor7: 'Root - Minor 3rd - Perfect 5th - Minor 7th',
  minorMajor7: 'Root - Minor 3rd - Perfect 5th - Major 7th',
  halfDiminished7: 'Root - Minor 3rd - Diminished 5th - Minor 7th',
  diminished7: 'Root - Minor 3rd - Diminished 5th - Diminished 7th',
  suspended: 'Root - 2nd/4th - Perfect 5th',
  added: 'Root - Major 3rd - Perfect 5th - Added tone'
};

const descriptions = {
  major: 'Bright, happy sound. Foundation of Western music.',
  minor: 'Darker, melancholic sound. Emotional depth.',
  diminished: 'Tense, unstable sound. Creates tension.',
  augmented: 'Dreamy, suspenseful sound. Raises tension.',
  dominant7: 'Jazzy, bluesy sound with tension that resolves.',
  major7: 'Smooth, sophisticated jazz sound.',
  minor7: 'Mellow, jazzy minor sound.',
  minorMajor7: 'Haunting, mysterious sound.',
  halfDiminished7: 'Dark, jazzy tension.',
  diminished7: 'Maximum tension, very unstable.',
  suspended: 'Neutral, creates anticipation.',
  added: 'Adds color and richness to major chords.'
};

async function populateChordTables() {
  console.log('🎸🎹 Populating piano and guitar chord tables...\n');

  let pianoSuccess = 0;
  let pianoError = 0;
  let guitarSuccess = 0;
  let guitarError = 0;

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing chord data...');
    await supabase.from('piano_chords').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('guitar_chords').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleared existing data\n');

    // Insert piano chords
    console.log('🎹 Inserting piano chords...');
    for (const [type, chords] of Object.entries(chordData)) {
      for (const chord of chords) {
        const pianoChord = {
          chord_name: chord.name,
          chord_type: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1').trim(),
          root_note: chord.root,
          notes: chord.notes,
          intervals: intervalPatterns[type] || 'Custom intervals',
          alternate_name: chord.alt || null,
          difficulty: chord.notes.length <= 3 ? 'Easy' : chord.notes.length === 4 ? 'Medium' : 'Hard',
          description: descriptions[type] || 'Musical chord',
          fingering: '1-3-5' + (chord.notes.length > 3 ? '-7' : '')
        };

        const { error } = await supabase
          .from('piano_chords')
          .insert([pianoChord]);

        if (error) {
          console.error(`❌ Error adding piano chord "${chord.name}":`, error.message);
          pianoError++;
        } else {
          pianoSuccess++;
        }
      }
    }
    console.log(`✅ Piano chords: ${pianoSuccess} added\n`);

    // Insert guitar chords
    console.log('🎸 Inserting guitar chords...');
    for (const [type, chords] of Object.entries(chordData)) {
      for (const chord of chords) {
        const fingering = guitarFingerings[chord.name] || { 
          frets: null, 
          fingers: null, 
          difficulty: 'Medium' 
        };

        const guitarChord = {
          chord_name: chord.name,
          chord_type: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1').trim(),
          root_note: chord.root,
          notes: chord.notes,
          intervals: intervalPatterns[type] || 'Custom intervals',
          alternate_name: chord.alt || null,
          frets: fingering.frets,
          fingers: fingering.fingers,
          difficulty: fingering.difficulty,
          description: descriptions[type] || 'Musical chord'
        };

        const { error } = await supabase
          .from('guitar_chords')
          .insert([guitarChord]);

        if (error) {
          console.error(`❌ Error adding guitar chord "${chord.name}":`, error.message);
          guitarError++;
        } else {
          guitarSuccess++;
        }
      }
    }
    console.log(`✅ Guitar chords: ${guitarSuccess} added\n`);

    console.log('📊 Summary:');
    console.log(`   🎹 Piano Chords: ${pianoSuccess} successful, ${pianoError} failed`);
    console.log(`   🎸 Guitar Chords: ${guitarSuccess} successful, ${guitarError} failed`);
    console.log('\n🎉 Chord tables populated successfully!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

populateChordTables();

