const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const noteMap = {
  'C': 'Do',
  'D': 'Ré',
  'E': 'Mi',
  'F': 'Fa',
  'G': 'Sol',
  'A': 'La',
  'B': 'Si',
  'C#': 'Do#',
  'D#': 'Ré#',
  'F#': 'Fa#',
  'G#': 'Sol#',
  'A#': 'La#',
  'Db': 'Réb',
  'Eb': 'Mib',
  'Gb': 'Solb',
  'Ab': 'Lab',
  'Bb': 'Sib',
};

const convertChordToFrench = (chord) => {
  if (!chord) return chord;
  
  let result = chord;
  const sortedNotes = Object.keys(noteMap).sort((a, b) => b.length - a.length);
  
  for (const englishNote of sortedNotes) {
    const frenchNote = noteMap[englishNote];
    const regex = new RegExp(`^${englishNote.replace(/[#b]/g, '\\$&')}(?=[^a-zA-Z]|$)`, 'g');
    result = result.replace(regex, frenchNote);
  }
  
  return result;
};

const updateSongsChords = async () => {
  console.log('🎵 Updating song chords to French notation...\n');
  
  try {
    // Get all songs
    const { data: songs, error } = await supabase
      .from('songs')
      .select('id, title, chords, key_signature');
    
    if (error) {
      console.error('❌ Error fetching songs:', error);
      return;
    }
    
    console.log(`Found ${songs.length} songs to update`);
    
    for (const song of songs) {
      const updates = {};
      let needsUpdate = false;
      
      // Convert chords array
      if (song.chords && Array.isArray(song.chords)) {
        const frenchChords = song.chords.map(chord => convertChordToFrench(chord));
        if (JSON.stringify(frenchChords) !== JSON.stringify(song.chords)) {
          updates.chords = frenchChords;
          needsUpdate = true;
        }
      }
      
      // Convert key_signature
      if (song.key_signature) {
        const frenchKey = convertChordToFrench(song.key_signature);
        if (frenchKey !== song.key_signature) {
          updates.key_signature = frenchKey;
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('songs')
          .update(updates)
          .eq('id', song.id);
        
        if (updateError) {
          console.error(`❌ Error updating song ${song.title}:`, updateError);
        } else {
          console.log(`✅ Updated: ${song.title}`);
        }
      }
    }
    
    console.log('\n✨ Songs updated successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
};

const updatePianoChords = async () => {
  console.log('\n🎹 Updating piano chords to French notation...\n');
  
  try {
    const { data: chords, error } = await supabase
      .from('piano_chords')
      .select('id, name, notes');
    
    if (error) {
      console.error('❌ Error fetching piano chords:', error);
      return;
    }
    
    console.log(`Found ${chords.length} piano chords to update`);
    
    for (const chord of chords) {
      const updates = {};
      let needsUpdate = false;
      
      // Convert chord name
      if (chord.name) {
        const frenchName = convertChordToFrench(chord.name);
        if (frenchName !== chord.name) {
          updates.name = frenchName;
          needsUpdate = true;
        }
      }
      
      // Convert notes array
      if (chord.notes && Array.isArray(chord.notes)) {
        const frenchNotes = chord.notes.map(note => convertChordToFrench(note));
        if (JSON.stringify(frenchNotes) !== JSON.stringify(chord.notes)) {
          updates.notes = frenchNotes;
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('piano_chords')
          .update(updates)
          .eq('id', chord.id);
        
        if (updateError) {
          console.error(`❌ Error updating chord ${chord.name}:`, updateError);
        } else {
          console.log(`✅ Updated: ${updates.name || chord.name}`);
        }
      }
    }
    
    console.log('\n✨ Piano chords updated successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
};

const updateGuitarChords = async () => {
  console.log('\n🎸 Updating guitar chords to French notation...\n');
  
  try {
    const { data: chords, error } = await supabase
      .from('guitar_chords')
      .select('id, name');
    
    if (error) {
      console.error('❌ Error fetching guitar chords:', error);
      return;
    }
    
    console.log(`Found ${chords.length} guitar chords to update`);
    
    for (const chord of chords) {
      if (chord.name) {
        const frenchName = convertChordToFrench(chord.name);
        
        if (frenchName !== chord.name) {
          const { error: updateError } = await supabase
            .from('guitar_chords')
            .update({ name: frenchName })
            .eq('id', chord.id);
          
          if (updateError) {
            console.error(`❌ Error updating chord ${chord.name}:`, updateError);
          } else {
            console.log(`✅ Updated: ${frenchName}`);
          }
        }
      }
    }
    
    console.log('\n✨ Guitar chords updated successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
};

const main = async () => {
  console.log('🎼 Starting French notation conversion...\n');
  console.log('=' .repeat(60));
  
  await updateSongsChords();
  await updatePianoChords();
  await updateGuitarChords();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 All conversions complete!');
  console.log('=' .repeat(60));
};

main();

