"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Music, 
  Search, 
  Filter, 
  Download, 
  Printer,
  Guitar,
  Piano,
  Volume2,
  BookOpen,
  Star,
  Share2,
  Tag
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface ChordDiagram {
  name: string;
  frets: number[];
  fingers: number[];
  barre?: number;
  capo?: number;
  description: string;
}

interface Chord {
  name: string;
  key: string;
  difficulty: "Easy" | "Medium" | "Hard";
  diagrams: ChordDiagram[];
  description: string;
  commonUses: string[];
  alternativeNames: string[];
}

const ChordDisplayPage = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("All Keys");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [activeTab, setActiveTab] = useState("guitar");

  // Function to convert chord names to French
  const getChordName = (chordName: string) => {
    if (language === 'fr') {
      const chordMap: { [key: string]: string } = {
        'C': 'Do',
        'C#': 'Do#',
        'Db': 'Ré♭',
        'D': 'Ré',
        'D#': 'Ré#',
        'Eb': 'Mi♭',
        'E': 'Mi',
        'F': 'Fa',
        'F#': 'Fa#',
        'Gb': 'Sol♭',
        'G': 'Sol',
        'G#': 'Sol#',
        'Ab': 'La♭',
        'A': 'La',
        'A#': 'La#',
        'Bb': 'Si♭',
        'B': 'Si',
      };
      
      // Replace chord names in the chord name string
      let frenchChord = chordName;
      Object.entries(chordMap).forEach(([english, french]) => {
        frenchChord = frenchChord.replace(new RegExp(english, 'g'), french);
      });
      return frenchChord;
    }
    return chordName;
  };

  const keys = [
    "All Keys", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
  ];

  const difficulties = ["All Levels", "Easy", "Medium", "Hard"];

  const chords: Chord[] = [
    // C Major Chords
    {
      name: "C Major",
      key: "C",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open C",
          frets: [0, 1, 0, 2, 1, 0],
          fingers: [0, 1, 0, 3, 2, 0],
          description: "Basic open C chord"
        }
      ],
      description: "The C major chord is one of the most fundamental chords in music. It's bright, happy, and forms the foundation for many songs.",
      commonUses: ["I chord in C major", "V chord in F major", "IV chord in G major"],
      alternativeNames: ["C", "C Major", "C Maj"]
    },
    {
      name: "C Minor",
      key: "C",
      difficulty: "Medium",
      diagrams: [
        {
          name: "C Minor Barre",
          frets: [3, 3, 5, 5, 4, 3],
          fingers: [1, 1, 3, 4, 2, 1],
          barre: 1,
          description: "Barre chord version"
        }
      ],
      description: "The C minor chord has a more somber, introspective quality compared to its major counterpart.",
      commonUses: ["i chord in C minor", "ii chord in Bb major"],
      alternativeNames: ["Cm", "C Minor", "C Min"]
    },
    {
      name: "C7",
      key: "C",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open C7",
          frets: [0, 1, 0, 2, 1, 3],
          fingers: [0, 1, 0, 3, 2, 4],
          description: "Dominant 7th chord"
        }
      ],
      description: "The C7 chord adds tension and movement, commonly used in blues and jazz.",
      commonUses: ["V7 chord in F major", "I7 chord in C blues"],
      alternativeNames: ["C7", "C Dominant 7", "C Dom7"]
    },

    // D Major Chords
    {
      name: "D Major",
      key: "D",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open D",
          frets: [2, 0, 0, 2, 3, 2],
          fingers: [1, 0, 0, 2, 3, 1],
          description: "Basic open D chord"
        }
      ],
      description: "The D major chord is bright and uplifting, perfect for folk and country music.",
      commonUses: ["I chord in D major", "V chord in G major", "IV chord in A major"],
      alternativeNames: ["D", "D Major", "D Maj"]
    },
    {
      name: "D Minor",
      key: "D",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open Dm",
          frets: [1, 0, 0, 2, 3, 1],
          fingers: [1, 0, 0, 3, 4, 2],
          description: "Basic open D minor"
        }
      ],
      description: "The D minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in D minor", "ii chord in C major"],
      alternativeNames: ["Dm", "D Minor", "D Min"]
    },
    {
      name: "D7",
      key: "D",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open D7",
          frets: [2, 0, 0, 2, 1, 2],
          fingers: [2, 0, 0, 3, 1, 4],
          description: "Dominant 7th chord"
        }
      ],
      description: "The D7 chord creates tension and movement, essential for blues progressions.",
      commonUses: ["V7 chord in G major", "I7 chord in D blues"],
      alternativeNames: ["D7", "D Dominant 7", "D Dom7"]
    },

    // E Major Chords
    {
      name: "E Major",
      key: "E",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open E",
          frets: [0, 2, 2, 1, 0, 0],
          fingers: [0, 2, 3, 1, 0, 0],
          description: "Basic open E chord"
        }
      ],
      description: "The E major chord is powerful and resonant, perfect for rock and country.",
      commonUses: ["I chord in E major", "V chord in A major", "IV chord in B major"],
      alternativeNames: ["E", "E Major", "E Maj"]
    },
    {
      name: "E Minor",
      key: "E",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open Em",
          frets: [0, 2, 2, 0, 0, 0],
          fingers: [0, 2, 3, 0, 0, 0],
          description: "Basic open E minor"
        }
      ],
      description: "The E minor chord is one of the easiest chords to play and has a somber quality.",
      commonUses: ["i chord in E minor", "ii chord in D major"],
      alternativeNames: ["Em", "E Minor", "E Min"]
    },
    {
      name: "E7",
      key: "E",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open E7",
          frets: [0, 2, 0, 1, 0, 0],
          fingers: [0, 2, 0, 1, 0, 0],
          description: "Dominant 7th chord"
        }
      ],
      description: "The E7 chord is essential for blues and rock music.",
      commonUses: ["V7 chord in A major", "I7 chord in E blues"],
      alternativeNames: ["E7", "E Dominant 7", "E Dom7"]
    },

    // F Major Chords
    {
      name: "F Major",
      key: "F",
      difficulty: "Hard",
      diagrams: [
        {
          name: "F Barre",
          frets: [1, 3, 3, 2, 1, 1],
          fingers: [1, 3, 4, 2, 1, 1],
          barre: 1,
          description: "Barre chord version"
        }
      ],
      description: "The F major chord is challenging but essential for playing in many keys.",
      commonUses: ["I chord in F major", "V chord in Bb major", "IV chord in C major"],
      alternativeNames: ["F", "F Major", "F Maj"]
    },
    {
      name: "F Minor",
      key: "F",
      difficulty: "Hard",
      diagrams: [
        {
          name: "F Minor Barre",
          frets: [1, 3, 3, 1, 1, 1],
          fingers: [1, 3, 4, 1, 1, 1],
          barre: 1,
          description: "Barre chord version"
        }
      ],
      description: "The F minor chord requires barre technique but is essential for many progressions.",
      commonUses: ["i chord in F minor", "ii chord in Eb major"],
      alternativeNames: ["Fm", "F Minor", "F Min"]
    },

    // G Major Chords
    {
      name: "G Major",
      key: "G",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open G",
          frets: [3, 2, 0, 0, 3, 3],
          fingers: [2, 1, 0, 0, 3, 4],
          description: "Basic open G chord"
        }
      ],
      description: "The G major chord is bright and open, perfect for country and folk music.",
      commonUses: ["I chord in G major", "V chord in C major", "IV chord in D major"],
      alternativeNames: ["G", "G Major", "G Maj"]
    },
    {
      name: "G Minor",
      key: "G",
      difficulty: "Medium",
      diagrams: [
        {
          name: "G Minor Barre",
          frets: [3, 5, 5, 3, 3, 3],
          fingers: [1, 3, 4, 1, 1, 1],
          barre: 1,
          description: "Barre chord version"
        }
      ],
      description: "The G minor chord has a dark, emotional quality.",
      commonUses: ["i chord in G minor", "ii chord in F major"],
      alternativeNames: ["Gm", "G Minor", "G Min"]
    },
    {
      name: "G7",
      key: "G",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open G7",
          frets: [3, 2, 0, 0, 0, 1],
          fingers: [3, 2, 0, 0, 0, 1],
          description: "Dominant 7th chord"
        }
      ],
      description: "The G7 chord is essential for blues and country music.",
      commonUses: ["V7 chord in C major", "I7 chord in G blues"],
      alternativeNames: ["G7", "G Dominant 7", "G Dom7"]
    },

    // A Major Chords
    {
      name: "A Major",
      key: "A",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open A",
          frets: [0, 0, 2, 2, 2, 0],
          fingers: [0, 0, 1, 2, 3, 0],
          description: "Basic open A chord"
        }
      ],
      description: "The A major chord is bright and cheerful, perfect for pop and rock.",
      commonUses: ["I chord in A major", "V chord in D major", "IV chord in E major"],
      alternativeNames: ["A", "A Major", "A Maj"]
    },
    {
      name: "A Minor",
      key: "A",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open Am",
          frets: [0, 0, 2, 2, 1, 0],
          fingers: [0, 0, 2, 3, 1, 0],
          description: "Basic open A minor"
        }
      ],
      description: "The A minor chord is one of the most commonly used chords in music.",
      commonUses: ["i chord in A minor", "ii chord in G major"],
      alternativeNames: ["Am", "A Minor", "A Min"]
    },
    {
      name: "A7",
      key: "A",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Open A7",
          frets: [0, 0, 2, 0, 2, 0],
          fingers: [0, 0, 2, 0, 3, 0],
          description: "Dominant 7th chord"
        }
      ],
      description: "The A7 chord is essential for blues and rock progressions.",
      commonUses: ["V7 chord in D major", "I7 chord in A blues"],
      alternativeNames: ["A7", "A Dominant 7", "A Dom7"]
    },

    // B Major Chords
    {
      name: "B Major",
      key: "B",
      difficulty: "Hard",
      diagrams: [
        {
          name: "B Barre",
          frets: [2, 4, 4, 3, 2, 2],
          fingers: [1, 3, 4, 2, 1, 1],
          barre: 1,
          description: "Barre chord version"
        }
      ],
      description: "The B major chord is challenging but essential for playing in many keys.",
      commonUses: ["I chord in B major", "V chord in E major", "IV chord in F# major"],
      alternativeNames: ["B", "B Major", "B Maj"]
    },
    {
      name: "B Minor",
      key: "B",
      difficulty: "Hard",
      diagrams: [
        {
          name: "B Minor Barre",
          frets: [2, 3, 4, 2, 2, 2],
          fingers: [1, 2, 4, 1, 1, 1],
          barre: 1,
          description: "Barre chord version"
        }
      ],
      description: "The B minor chord requires barre technique but is essential for many progressions.",
      commonUses: ["i chord in B minor", "ii chord in A major"],
      alternativeNames: ["Bm", "B Minor", "B Min"]
    },
    {
      name: "B7",
      key: "B",
      difficulty: "Medium",
      diagrams: [
        {
          name: "B7 Barre",
          frets: [2, 1, 2, 0, 2, 0],
          fingers: [2, 1, 3, 0, 4, 0],
          description: "Barre chord version"
        }
      ],
      description: "The B7 chord is essential for blues and jazz progressions.",
      commonUses: ["V7 chord in E major", "I7 chord in B blues"],
      alternativeNames: ["B7", "B Dominant 7", "B Dom7"]
    }
  ];

  // Piano Chords Data - All Keys with Inversions
  const pianoChords: Chord[] = [
    // C Major Chords
    {
      name: "C Major",
      key: "C",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // C-E-G
          description: "C-E-G (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // E-G-C
          description: "E-G-C (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // G-C-E
          description: "G-C-E (Second inversion)"
        }
      ],
      description: "The C major chord is one of the most fundamental chords in music. It's bright, happy, and forms the foundation for many songs.",
      commonUses: ["I chord in C major", "V chord in F major", "IV chord in G major"],
      alternativeNames: ["C", "C Major", "C Maj"]
    },
    {
      name: "C Minor",
      key: "C",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // C-Eb-G
          description: "C-Eb-G (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // Eb-G-C
          description: "Eb-G-C (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // G-C-Eb
          description: "G-C-Eb (Second inversion)"
        }
      ],
      description: "The C minor chord has a more somber, introspective quality compared to its major counterpart.",
      commonUses: ["i chord in C minor", "ii chord in Bb major"],
      alternativeNames: ["Cm", "C Minor", "C Min"]
    },
    {
      name: "C7",
      key: "C",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 3, 5], // C-E-G-Bb
          description: "C-E-G-Bb (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 3, 5], // E-G-Bb-C
          description: "E-G-Bb-C (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 3, 5], // G-Bb-C-E
          description: "G-Bb-C-E (Second inversion)"
        }
      ],
      description: "The C7 chord adds tension and movement, commonly used in blues and jazz.",
      commonUses: ["V7 chord in F major", "I7 chord in C blues"],
      alternativeNames: ["C7", "C Dominant 7", "C Dom7"]
    },

    // C# Major Chords
    {
      name: "C# Major",
      key: "C#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // C#-F-G#
          description: "C#-F-G# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // F-G#-C#
          description: "F-G#-C# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // G#-C#-F
          description: "G#-C#-F (Second inversion)"
        }
      ],
      description: "The C# major chord is bright and uplifting, commonly used in jazz and contemporary music.",
      commonUses: ["I chord in C# major", "V chord in F# major", "IV chord in G# major"],
      alternativeNames: ["C#", "C# Major", "C# Maj", "Db Major"]
    },
    {
      name: "C# Minor",
      key: "C#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // C#-E-G#
          description: "C#-E-G# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // E-G#-C#
          description: "E-G#-C# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // G#-C#-E
          description: "G#-C#-E (Second inversion)"
        }
      ],
      description: "The C# minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in C# minor", "ii chord in B major"],
      alternativeNames: ["C#m", "C# Minor", "C# Min", "Db Minor"]
    },

    // D Major Chords
    {
      name: "D Major",
      key: "D",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // D-F#-A
          description: "D-F#-A (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // F#-A-D
          description: "F#-A-D (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // A-D-F#
          description: "A-D-F# (Second inversion)"
        }
      ],
      description: "The D major chord is bright and uplifting, perfect for folk and country music.",
      commonUses: ["I chord in D major", "V chord in G major", "IV chord in A major"],
      alternativeNames: ["D", "D Major", "D Maj"]
    },
    {
      name: "D Minor",
      key: "D",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // D-F-A
          description: "D-F-A (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // F-A-D
          description: "F-A-D (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // A-D-F
          description: "A-D-F (Second inversion)"
        }
      ],
      description: "The D minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in D minor", "ii chord in C major"],
      alternativeNames: ["Dm", "D Minor", "D Min"]
    },

    // D# Major Chords
    {
      name: "D# Major",
      key: "D#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // D#-G-A#
          description: "D#-G-A# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // G-A#-D#
          description: "G-A#-D# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // A#-D#-G
          description: "A#-D#-G (Second inversion)"
        }
      ],
      description: "The D# major chord is bright and uplifting, commonly used in jazz and contemporary music.",
      commonUses: ["I chord in D# major", "V chord in G# major", "IV chord in A# major"],
      alternativeNames: ["D#", "D# Major", "D# Maj", "Eb Major"]
    },
    {
      name: "D# Minor",
      key: "D#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // D#-F#-A#
          description: "D#-F#-A# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // F#-A#-D#
          description: "F#-A#-D# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // A#-D#-F#
          description: "A#-D#-F# (Second inversion)"
        }
      ],
      description: "The D# minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in D# minor", "ii chord in C# major"],
      alternativeNames: ["D#m", "D# Minor", "D# Min", "Eb Minor"]
    },

    // E Major Chords
    {
      name: "E Major",
      key: "E",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // E-G#-B
          description: "E-G#-B (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // G#-B-E
          description: "G#-B-E (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // B-E-G#
          description: "B-E-G# (Second inversion)"
        }
      ],
      description: "The E major chord is bright and uplifting, perfect for rock and pop music.",
      commonUses: ["I chord in E major", "V chord in A major", "IV chord in B major"],
      alternativeNames: ["E", "E Major", "E Maj"]
    },
    {
      name: "E Minor",
      key: "E",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // E-G-B
          description: "E-G-B (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // G-B-E
          description: "G-B-E (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // B-E-G
          description: "B-E-G (Second inversion)"
        }
      ],
      description: "The E minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in E minor", "ii chord in D major"],
      alternativeNames: ["Em", "E Minor", "E Min"]
    },

    // F Major Chords
    {
      name: "F Major",
      key: "F",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // F-A-C
          description: "F-A-C (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // A-C-F
          description: "A-C-F (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // C-F-A
          description: "C-F-A (Second inversion)"
        }
      ],
      description: "The F major chord is essential for many progressions and songs.",
      commonUses: ["I chord in F major", "IV chord in C major"],
      alternativeNames: ["F", "F Major", "F Maj"]
    },
    {
      name: "F Minor",
      key: "F",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // F-Ab-C
          description: "F-Ab-C (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // Ab-C-F
          description: "Ab-C-F (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // C-F-Ab
          description: "C-F-Ab (Second inversion)"
        }
      ],
      description: "The F minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in F minor", "ii chord in Eb major"],
      alternativeNames: ["Fm", "F Minor", "F Min"]
    },

    // F# Major Chords
    {
      name: "F# Major",
      key: "F#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // F#-A#-C#
          description: "F#-A#-C# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // A#-C#-F#
          description: "A#-C#-F# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // C#-F#-A#
          description: "C#-F#-A# (Second inversion)"
        }
      ],
      description: "The F# major chord is bright and uplifting, commonly used in jazz and contemporary music.",
      commonUses: ["I chord in F# major", "V chord in B major", "IV chord in C# major"],
      alternativeNames: ["F#", "F# Major", "F# Maj", "Gb Major"]
    },
    {
      name: "F# Minor",
      key: "F#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // F#-A-C#
          description: "F#-A-C# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // A-C#-F#
          description: "A-C#-F# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // C#-F#-A
          description: "C#-F#-A (Second inversion)"
        }
      ],
      description: "The F# minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in F# minor", "ii chord in E major"],
      alternativeNames: ["F#m", "F# Minor", "F# Min", "Gb Minor"]
    },

    // G Major Chords
    {
      name: "G Major",
      key: "G",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // G-B-D
          description: "G-B-D (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // B-D-G
          description: "B-D-G (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // D-G-B
          description: "D-G-B (Second inversion)"
        }
      ],
      description: "The G major chord is another essential chord, frequently paired with C and D.",
      commonUses: ["I chord in G major", "V chord in C major", "IV chord in D major"],
      alternativeNames: ["G", "G Major", "G Maj"]
    },
    {
      name: "G Minor",
      key: "G",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // G-Bb-D
          description: "G-Bb-D (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // Bb-D-G
          description: "Bb-D-G (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // D-G-Bb
          description: "D-G-Bb (Second inversion)"
        }
      ],
      description: "The G minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in G minor", "ii chord in F major"],
      alternativeNames: ["Gm", "G Minor", "G Min"]
    },

    // G# Major Chords
    {
      name: "G# Major",
      key: "G#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // G#-C-D#
          description: "G#-C-D# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // C-D#-G#
          description: "C-D#-G# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // D#-G#-C
          description: "D#-G#-C (Second inversion)"
        }
      ],
      description: "The G# major chord is bright and uplifting, commonly used in jazz and contemporary music.",
      commonUses: ["I chord in G# major", "V chord in C# major", "IV chord in D# major"],
      alternativeNames: ["G#", "G# Major", "G# Maj", "Ab Major"]
    },
    {
      name: "G# Minor",
      key: "G#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // G#-B-D#
          description: "G#-B-D# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // B-D#-G#
          description: "B-D#-G# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // D#-G#-B
          description: "D#-G#-B (Second inversion)"
        }
      ],
      description: "The G# minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in G# minor", "ii chord in F# major"],
      alternativeNames: ["G#m", "G# Minor", "G# Min", "Ab Minor"]
    },

    // A Major Chords
    {
      name: "A Major",
      key: "A",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // A-C#-E
          description: "A-C#-E (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // C#-E-A
          description: "C#-E-A (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // E-A-C#
          description: "E-A-C# (Second inversion)"
        }
      ],
      description: "The A major chord is bright and uplifting, perfect for folk and country music.",
      commonUses: ["I chord in A major", "V chord in D major", "IV chord in E major"],
      alternativeNames: ["A", "A Major", "A Maj"]
    },
    {
      name: "A Minor",
      key: "A",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // A-C-E
          description: "A-C-E (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // C-E-A
          description: "C-E-A (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // E-A-C
          description: "E-A-C (Second inversion)"
        }
      ],
      description: "The A minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in A minor", "ii chord in G major"],
      alternativeNames: ["Am", "A Minor", "A Min"]
    },

    // A# Major Chords
    {
      name: "A# Major",
      key: "A#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // A#-D-F
          description: "A#-D-F (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // D-F-A#
          description: "D-F-A# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // F-A#-D
          description: "F-A#-D (Second inversion)"
        }
      ],
      description: "The A# major chord is bright and uplifting, commonly used in jazz and contemporary music.",
      commonUses: ["I chord in A# major", "V chord in D# major", "IV chord in F major"],
      alternativeNames: ["A#", "A# Major", "A# Maj", "Bb Major"]
    },
    {
      name: "A# Minor",
      key: "A#",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // A#-C#-F
          description: "A#-C#-F (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // C#-F-A#
          description: "C#-F-A# (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // F-A#-C#
          description: "F-A#-C# (Second inversion)"
        }
      ],
      description: "The A# minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in A# minor", "ii chord in G# major"],
      alternativeNames: ["A#m", "A# Minor", "A# Min", "Bb Minor"]
    },

    // B Major Chords
    {
      name: "B Major",
      key: "B",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // B-D#-F#
          description: "B-D#-F# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // D#-F#-B
          description: "D#-F#-B (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // F#-B-D#
          description: "F#-B-D# (Second inversion)"
        }
      ],
      description: "The B major chord is bright and uplifting, commonly used in jazz and contemporary music.",
      commonUses: ["I chord in B major", "V chord in E major", "IV chord in F# major"],
      alternativeNames: ["B", "B Major", "B Maj"]
    },
    {
      name: "B Minor",
      key: "B",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // B-D-F#
          description: "B-D-F# (Root position)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 2, 5], // D-F#-B
          description: "D-F#-B (First inversion)"
        },
        {
          name: "Second Inversion",
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [1, 3, 5], // F#-B-D
          description: "F#-B-D (Second inversion)"
        }
      ],
      description: "The B minor chord has a melancholic, introspective quality.",
      commonUses: ["i chord in B minor", "ii chord in A major"],
      alternativeNames: ["Bm", "B Minor", "B Min"]
    }
  ];

  // Bass Guitar Chords Data

  // Get the appropriate chord array based on active tab
  const getCurrentChords = () => {
    switch (activeTab) {
      case "piano":
        return pianoChords;
      default:
        return chords; // guitar chords
    }
  };

  const filteredChords = getCurrentChords().filter(chord => {
    const matchesSearch = chord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chord.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chord.alternativeNames.some(name => 
                           name.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesKey = selectedKey === "All Keys" || chord.key === selectedKey;
    const matchesDifficulty = selectedDifficulty === "All Levels" || chord.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesKey && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const renderChordDiagram = (diagram: ChordDiagram) => {
    if (activeTab === "piano") {
      // Accurate 1-octave piano keyboard representation
      const pianoKeys = [
        { note: 'C', isBlack: false, position: 0 },
        { note: 'C#', isBlack: true, position: 0.5 },
        { note: 'D', isBlack: false, position: 1 },
        { note: 'D#', isBlack: true, position: 1.5 },
        { note: 'E', isBlack: false, position: 2 },
        { note: 'F', isBlack: false, position: 3 },
        { note: 'F#', isBlack: true, position: 3.5 },
        { note: 'G', isBlack: false, position: 4 },
        { note: 'G#', isBlack: true, position: 4.5 },
        { note: 'A', isBlack: false, position: 5 },
        { note: 'A#', isBlack: true, position: 5.5 },
        { note: 'B', isBlack: false, position: 6 },
        { note: 'C', isBlack: false, position: 7 } // Next octave C
      ];
      
      // Enhanced chord mapping with more comprehensive chord types
      const getChordNotes = (chordName: string) => {
        const chordMap: { [key: string]: string[] } = {
          // C Chords
          'C Major': ['C', 'E', 'G'],
          'C Minor': ['C', 'Eb', 'G'],
          'C7': ['C', 'E', 'G', 'Bb'],
          'Cmaj7': ['C', 'E', 'G', 'B'],
          'Cmin7': ['C', 'Eb', 'G', 'Bb'],
          'Cdim': ['C', 'Eb', 'Gb'],
          'Caug': ['C', 'E', 'G#'],
          'Csus2': ['C', 'D', 'G'],
          'Csus4': ['C', 'F', 'G'],
          
          // C# Chords
          'C# Major': ['C#', 'F', 'G#'],
          'C# Minor': ['C#', 'E', 'G#'],
          'C#7': ['C#', 'F', 'G#', 'B'],
          
          // D Chords
          'D Major': ['D', 'F#', 'A'],
          'D Minor': ['D', 'F', 'A'],
          'D7': ['D', 'F#', 'A', 'C'],
          'Dmaj7': ['D', 'F#', 'A', 'C#'],
          'Dmin7': ['D', 'F', 'A', 'C'],
          
          // D# Chords
          'D# Major': ['D#', 'G', 'A#'],
          'D# Minor': ['D#', 'F#', 'A#'],
          'D#7': ['D#', 'G', 'A#', 'C#'],
          
          // E Chords
          'E Major': ['E', 'G#', 'B'],
          'E Minor': ['E', 'G', 'B'],
          'E7': ['E', 'G#', 'B', 'D'],
          'Emaj7': ['E', 'G#', 'B', 'D#'],
          'Emin7': ['E', 'G', 'B', 'D'],
          
          // F Chords
          'F Major': ['F', 'A', 'C'],
          'F Minor': ['F', 'Ab', 'C'],
          'F7': ['F', 'A', 'C', 'Eb'],
          'Fmaj7': ['F', 'A', 'C', 'E'],
          'Fmin7': ['F', 'Ab', 'C', 'Eb'],
          
          // F# Chords
          'F# Major': ['F#', 'A#', 'C#'],
          'F# Minor': ['F#', 'A', 'C#'],
          'F#7': ['F#', 'A#', 'C#', 'E'],
          
          // G Chords
          'G Major': ['G', 'B', 'D'],
          'G Minor': ['G', 'Bb', 'D'],
          'G7': ['G', 'B', 'D', 'F'],
          'Gmaj7': ['G', 'B', 'D', 'F#'],
          'Gmin7': ['G', 'Bb', 'D', 'F'],
          
          // G# Chords
          'G# Major': ['G#', 'C', 'D#'],
          'G# Minor': ['G#', 'B', 'D#'],
          'G#7': ['G#', 'C', 'D#', 'F#'],
          
          // A Chords
          'A Major': ['A', 'C#', 'E'],
          'A Minor': ['A', 'C', 'E'],
          'A7': ['A', 'C#', 'E', 'G'],
          'Amaj7': ['A', 'C#', 'E', 'G#'],
          'Amin7': ['A', 'C', 'E', 'G'],
          
          // A# Chords
          'A# Major': ['A#', 'D', 'F'],
          'A# Minor': ['A#', 'C#', 'F'],
          'A#7': ['A#', 'D', 'F', 'G#'],
          
          // B Chords
          'B Major': ['B', 'D#', 'F#'],
          'B Minor': ['B', 'D', 'F#'],
          'B7': ['B', 'D#', 'F#', 'A'],
          'Bmaj7': ['B', 'D#', 'F#', 'A#'],
          'Bmin7': ['B', 'D', 'F#', 'A']
        };
        
        return chordMap[chordName] || ['C', 'E', 'G'];
      };
      
      const chordNotes = getChordNotes(diagram.name);
      const displayChordName = getChordName(diagram.name);
      
      return (
        <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-primary">{displayChordName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{diagram.description}</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {chordNotes.map(note => getChordName(note)).join(' - ')}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex justify-center mb-6">
              <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl shadow-2xl border-2 border-slate-200 dark:border-slate-700">
                {/* Piano Keys - Accurate 1-octave representation */}
                <div className="flex items-end h-32 relative">
                  {/* White Keys */}
                  {pianoKeys.filter(key => !key.isBlack).map((key, index) => {
                    const isPressed = chordNotes.includes(key.note);
                    const keyWidth = key.note === 'C' && index === 0 ? 'w-14' : 'w-12';
                    return (
                      <div
                        key={`white-${key.note}-${index}`}
                        className={`${keyWidth} h-28 border-2 border-slate-300 dark:border-slate-600 rounded-b-lg flex items-end justify-center pb-4 text-sm font-bold transition-all duration-300 cursor-pointer relative ${
                          isPressed 
                            ? 'bg-primary text-primary-foreground shadow-xl transform -translate-y-3 border-primary scale-105' 
                            : 'bg-white dark:bg-slate-100 text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-200 hover:shadow-lg'
                        }`}
                        style={{
                          zIndex: isPressed ? 20 : 1
                        }}
                      >
                        <span className="text-xs font-semibold">{getChordName(key.note)}</span>
                        {isPressed && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Black Keys - Positioned accurately */}
                  {pianoKeys.filter(key => key.isBlack).map((key, index) => {
                    const isPressed = chordNotes.includes(key.note);
                    const leftPosition = key.position * 48 + 24; // Position between white keys
                    return (
                      <div
                        key={`black-${key.note}-${index}`}
                        className={`absolute h-20 w-8 rounded-b-lg flex items-end justify-center pb-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                          isPressed 
                            ? 'bg-primary text-primary-foreground shadow-xl transform -translate-y-3 border-2 border-primary scale-110' 
                            : 'bg-slate-800 text-white hover:bg-slate-700 hover:shadow-lg'
                        }`}
                        style={{
                          left: `${leftPosition}px`,
                          zIndex: isPressed ? 25 : 15
                        }}
                      >
                        <span className="text-xs font-semibold">{getChordName(key.note)}</span>
                        {isPressed && (
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Octave indicator */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                  Octave 4
                </div>
              </div>
            </div>
            
            {/* Hand Position Guide */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                  <Piano className="h-4 w-4" />
                  {t('chord.handPositionGuide')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {diagram.fingers.map((finger, index) => (
                    <div key={index} className="flex items-center justify-center gap-2 bg-primary/10 rounded-lg p-2">
                      <Badge variant="outline" className="text-xs">
                        {t('chord.finger')} {finger}
                      </Badge>
                      <span className="text-sm font-medium">{getChordName(chordNotes[index] || 'Note')}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>{t('chord.techniqueTips')}:</strong> {t('chord.pianoTechnique')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      );
    } else {
      // Modern guitar fretboard with Shadcn UI components
      const strings = [6, 5, 4, 3, 2, 1]; // Guitar strings from low E to high E
      const frets = [0, 1, 2, 3, 4]; // First 5 frets
      const stringNames = ['E', 'A', 'D', 'G', 'B', 'e']; // String note names
      
      return (
        <Card className="overflow-hidden border-2 border-amber-200 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-amber-800">{diagram.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{diagram.description}</p>
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                <Guitar className="h-3 w-3 mr-1" />
                Guitar
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex justify-center mb-6">
              <div className="relative bg-gradient-to-b from-amber-50 to-amber-100 p-6 rounded-2xl shadow-inner border-2 border-amber-200">
                {/* Fretboard with modern design */}
                <div className="space-y-2">
                  {/* String lines */}
                  {strings.map((string, stringIndex) => (
                    <div key={string} className="relative">
                      {/* String line */}
                      <div className="h-1 bg-gradient-to-r from-amber-600 to-amber-700 w-full relative rounded-full">
                        {/* Fret markers on the line */}
                        {frets.map((fret, fretIndex) => (
                          <div
                            key={`fret-${fret}`}
                            className="absolute w-1 h-4 bg-amber-800 -top-1.5 rounded-full"
                            style={{ left: `${fret * 24}px` }}
                          />
                        ))}
                        
                        {/* Finger positions on the line */}
                        {diagram.frets[stringIndex] !== -1 && (
                          <div
                            className="absolute w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-lg transform -translate-y-3 border-2 border-background"
                            style={{ left: `${diagram.frets[stringIndex] * 24 - 14}px` }}
                          >
                            {diagram.fingers[stringIndex]}
                          </div>
                        )}
                      </div>
                      
                      {/* String name */}
                      <div className="absolute -left-10 top-0 text-sm font-bold text-amber-800 bg-amber-100 rounded-full w-6 h-6 flex items-center justify-center">
                        {stringNames[stringIndex]}
                      </div>
                    </div>
                  ))}
                  
                  {/* Fret numbers */}
                  <div className="flex justify-between mt-3">
                    {frets.map((fret) => (
                      <div key={fret} className="text-sm text-amber-700 font-medium w-6 text-center">
                        {fret}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Capo indicator */}
                {diagram.capo && (
                  <div className="absolute -top-10 left-0 right-0 text-center">
                    <Badge className="bg-primary text-primary-foreground shadow-md">
                      Capo {diagram.capo}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            {/* Hand Position Guide */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                  <Guitar className="h-4 w-4" />
                  Hand Position & Technique
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {diagram.fingers.map((finger, index) => {
                    if (finger === 0) return null;
                    return (
                      <div key={index} className="flex items-center justify-center gap-2 bg-amber-100 rounded-lg p-2">
                        <Badge variant="outline" className="text-xs">
                          Finger {finger}
                        </Badge>
                        <span className="text-sm font-medium">String {strings[index]}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Technique Tips:</strong> Keep your thumb behind the neck, press firmly behind the fret, and maintain a relaxed wrist position.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Practice:</strong> Start slowly and focus on clean finger placement. Use a metronome to develop consistent timing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Chord Diagrams
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              Master every chord with our comprehensive chord diagrams. Learn finger positions, 
              alternative voicings, and common uses for each chord across Guitar, Piano, and Bass.
            </p>
            
            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chords (e.g., C Major, Am, G7)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    {keys.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Instrument Tabs */}
            <div className="max-w-4xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="guitar" className="flex items-center gap-2">
                    <Guitar className="h-4 w-4" />
                    Guitar
                  </TabsTrigger>
                  <TabsTrigger value="piano" className="flex items-center gap-2">
                    <Piano className="h-4 w-4" />
                    Piano
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Chords Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-4">
                {filteredChords.length} Chords Found
              </h2>
              <p className="text-lg text-muted-foreground">
                Click on any chord to see detailed diagrams and learn how to play it
              </p>
            </div>

            {filteredChords.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredChords.map((chord, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                            {activeTab === "piano" ? <Piano className="h-5 w-5" /> : <Guitar className="h-5 w-5" />}
                            {chord.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Music className="h-3 w-3" />
                              {chord.key} Key
                            </Badge>
                            <Badge className={getDifficultyColor(chord.difficulty)}>
                              {chord.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {activeTab === "piano" ? "Piano" : "Guitar"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                        {chord.description}
                      </p>
                      
                      {/* Chord Diagrams */}
                      <div className="space-y-6 mb-6">
                        {chord.diagrams.map((diagram, diagramIndex) => (
                          <div key={diagramIndex}>
                            {renderChordDiagram(diagram)}
                          </div>
                        ))}
                      </div>
                      
                      {/* Common Uses */}
                      <Card className="mb-4">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Common Uses
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-2">
                            {chord.commonUses.map((use, useIndex) => (
                              <Badge key={useIndex} variant="secondary" className="text-xs">
                                {use}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Alternative Names */}
                      {chord.alternativeNames.length > 1 && (
                        <Card className="mb-4">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Also Known As
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-2">
                              {chord.alternativeNames.slice(1).map((name, nameIndex) => (
                                <Badge key={nameIndex} variant="outline" className="text-xs">
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No chords found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters.
                </p>
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedKey("All Keys");
                    setSelectedDifficulty("All Levels");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Quick Reference */}
        <section className="py-20 px-6 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Quick Reference
              </h2>
              <p className="text-lg text-muted-foreground">
                Essential chord progressions and common patterns
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Common Progressions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>C - Am - F - G</strong> (I - vi - IV - V)</div>
                    <div><strong>G - D - Em - C</strong> (I - V - vi - IV)</div>
                    <div><strong>Am - F - C - G</strong> (vi - IV - I - V)</div>
                    <div><strong>D - A - Bm - G</strong> (I - V - vi - IV)</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Guitar className="h-5 w-5" />
                    Blues Progressions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>A7 - D7 - A7</strong> (I7 - IV7 - I7)</div>
                    <div><strong>E7 - A7 - B7 - E7</strong> (I7 - IV7 - V7 - I7)</div>
                    <div><strong>G7 - C7 - G7 - D7</strong> (I7 - IV7 - I7 - V7)</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Piano className="h-5 w-5" />
                    Jazz Progressions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Am7 - D7 - Gmaj7</strong> (ii7 - V7 - I)</div>
                    <div><strong>Cmaj7 - Am7 - Dm7 - G7</strong> (I - vi - ii - V)</div>
                    <div><strong>Em7 - A7 - Dm7 - G7</strong> (iii7 - VI7 - ii7 - V7)</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ChordDisplayPage;
