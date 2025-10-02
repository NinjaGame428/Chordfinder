// Utility to convert chord notation from English (C, D, E, F, G, A, B) to French (Do, Ré, Mi, Fa, Sol, La, Si)

export const noteMap: { [key: string]: string } = {
  'C': 'Do',
  'D': 'Ré',
  'E': 'Mi',
  'F': 'Fa',
  'G': 'Sol',
  'A': 'La',
  'B': 'Si',
  'C#': 'Do#',
  'D#': 'Ré#',
  'E#': 'Mi#',
  'F#': 'Fa#',
  'G#': 'Sol#',
  'A#': 'La#',
  'B#': 'Si#',
  'Cb': 'Dob',
  'Db': 'Réb',
  'Eb': 'Mib',
  'Fb': 'Fab',
  'Gb': 'Solb',
  'Ab': 'Lab',
  'Bb': 'Sib',
};

// Convert a single chord from English to French notation
export const convertChordToFrench = (chord: string): string => {
  if (!chord) return chord;
  
  // Handle special cases first
  let result = chord;
  
  // Replace note names (longest first to avoid partial matches)
  const sortedNotes = Object.keys(noteMap).sort((a, b) => b.length - a.length);
  
  for (const englishNote of sortedNotes) {
    const frenchNote = noteMap[englishNote];
    // Use word boundary to avoid replacing parts of words
    const regex = new RegExp(`^${englishNote}(?=[^a-zA-Z]|$)`, 'g');
    result = result.replace(regex, frenchNote);
  }
  
  return result;
};

// Convert an array of chords from English to French notation
export const convertChordsToFrench = (chords: string[]): string[] => {
  return chords.map(chord => convertChordToFrench(chord));
};

// Convert chord back from French to English (for database queries)
export const convertChordToEnglish = (chord: string): string => {
  if (!chord) return chord;
  
  let result = chord;
  
  // Reverse mapping
  const reverseMap: { [key: string]: string } = {};
  for (const [english, french] of Object.entries(noteMap)) {
    reverseMap[french] = english;
  }
  
  const sortedNotes = Object.keys(reverseMap).sort((a, b) => b.length - a.length);
  
  for (const frenchNote of sortedNotes) {
    const englishNote = reverseMap[frenchNote];
    const regex = new RegExp(`^${frenchNote}(?=[^a-zA-Zé]|$)`, 'g');
    result = result.replace(regex, englishNote);
  }
  
  return result;
};

// Get all French note names for filters
export const getFrenchNotes = (): string[] => {
  return ['Do', 'Ré', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
};

// Get all French note names including sharps and flats
export const getAllFrenchNotes = (): string[] => {
  return [
    'Do', 'Do#', 'Réb', 
    'Ré', 'Ré#', 'Mib',
    'Mi', 'Fa', 'Fa#', 'Solb',
    'Sol', 'Sol#', 'Lab',
    'La', 'La#', 'Sib',
    'Si'
  ];
};

