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
  Star
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

interface ChordDiagram {
  name: string;
  frets: number[];
  fingers: number[];
  barre?: number;
  capo?: number;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("All Keys");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [activeTab, setActiveTab] = useState("guitar");

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
  const bassChords: Chord[] = [
    {
      name: "C Major",
      key: "C",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [3, 2, 0, 1], // C-E-G-C (4-string bass)
          fingers: [3, 2, 0, 1],
          description: "C-E-G-C (Root position on 4-string bass)"
        },
        {
          name: "First Inversion",
          frets: [0, 0, 0, 1], // E-G-C-E
          fingers: [0, 0, 0, 1],
          description: "E-G-C-E (First inversion)"
        }
      ],
      description: "The C major chord on bass provides a solid foundation with the root note in the bass.",
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
          frets: [3, 1, 0, 1], // C-Eb-G-C
          fingers: [3, 1, 0, 1],
          description: "C-Eb-G-C (Root position)"
        }
      ],
      description: "The C minor chord on bass has a darker, more introspective quality.",
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
          frets: [3, 2, 0, 1], // C-E-G-Bb
          fingers: [3, 2, 0, 1],
          description: "C-E-G-Bb (Dominant 7th)"
        }
      ],
      description: "The C7 chord on bass adds tension and movement, commonly used in blues and jazz.",
      commonUses: ["V7 chord in F major", "I7 chord in C blues"],
      alternativeNames: ["C7", "C Dominant 7", "C Dom7"]
    },
    {
      name: "D Major",
      key: "D",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [0, 0, 0, 0], // D-F#-A-D
          fingers: [1, 2, 3, 4],
          description: "D-F#-A-D (Root position)"
        }
      ],
      description: "The D major chord on bass is bright and uplifting, perfect for folk and country music.",
      commonUses: ["I chord in D major", "V chord in G major", "IV chord in A major"],
      alternativeNames: ["D", "D Major", "D Maj"]
    },
    {
      name: "F Major",
      key: "F",
      difficulty: "Medium",
      diagrams: [
        {
          name: "Root Position",
          frets: [1, 0, 0, 1], // F-A-C-F
          fingers: [1, 0, 0, 1],
          description: "F-A-C-F (Root position)"
        }
      ],
      description: "The F major chord on bass is essential for many progressions and songs.",
      commonUses: ["I chord in F major", "IV chord in C major"],
      alternativeNames: ["F", "F Major", "F Maj"]
    },
    {
      name: "G Major",
      key: "G",
      difficulty: "Easy",
      diagrams: [
        {
          name: "Root Position",
          frets: [3, 0, 0, 0], // G-B-D-G
          fingers: [3, 0, 0, 0],
          description: "G-B-D-G (Root position)"
        }
      ],
      description: "The G major chord on bass is another essential chord, frequently paired with C and D.",
      commonUses: ["I chord in G major", "V chord in C major", "IV chord in D major"],
      alternativeNames: ["G", "G Major", "G Maj"]
    }
  ];

  // Get the appropriate chord array based on active tab
  const getCurrentChords = () => {
    switch (activeTab) {
      case "piano":
        return pianoChords;
      case "bass":
        return bassChords;
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
      // Piano octave layout: C-D-E-F-G-A-B-C (next octave)
      const pianoKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'];
      const isBlackKey = (key: string) => key.includes('#');
      
      return (
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-center mb-2">
            <h4 className="font-semibold">{diagram.name}</h4>
            <p className="text-sm text-muted-foreground">{diagram.description}</p>
          </div>
          
          <div className="flex justify-center">
            <div className="relative w-96 h-24 bg-white border border-gray-300 rounded-md">
              {/* Piano Keys Representation */}
              <div className="flex items-center h-full">
                {pianoKeys.map((key, index) => (
                  <div
                    key={index}
                    className={`h-20 flex items-center justify-center text-xs font-bold border-r border-gray-300 ${
                      isBlackKey(key) 
                        ? 'bg-gray-800 text-white w-6 -ml-3 z-10 relative' 
                        : 'bg-white text-gray-800 w-8'
                    }`}
                    style={{
                      marginLeft: isBlackKey(key) ? '-12px' : '0',
                      zIndex: isBlackKey(key) ? 10 : 1
                    }}
                  >
                    {key}
                  </div>
                ))}
              </div>
              
              {/* Highlighted Keys for Chord */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center">
                {diagram.fingers.map((finger, index) => {
                  if (finger === 0) return null;
                  
                  // Map finger positions to piano keys (simplified mapping)
                  const keyIndex = Math.min(index * 2, pianoKeys.length - 1);
                  const key = pianoKeys[keyIndex];
                  const isBlack = isBlackKey(key);
                  
                  return (
                    <div
                      key={index}
                      className={`absolute h-16 w-6 bg-blue-500 text-white rounded-sm flex items-center justify-center text-xs font-bold ${
                        isBlack ? 'bg-blue-600' : 'bg-blue-500'
                      }`}
                      style={{
                        left: `${(keyIndex * 32) - (isBlack ? 12 : 0)}px`,
                        zIndex: 20
                      }}
                    >
                      {finger}
                    </div>
                  );
                })}
              </div>
              
              <div className="absolute bottom-1 left-2 text-xs text-gray-500">
                Piano Octave
              </div>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === "bass") {
      const strings = [4, 3, 2, 1]; // Bass strings from low E to high G
      const frets = [0, 1, 2, 3, 4]; // First 5 frets
      
      return (
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-center mb-2">
            <h4 className="font-semibold">{diagram.name}</h4>
            <p className="text-sm text-muted-foreground">{diagram.description}</p>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              {/* Bass Fretboard */}
              <div className="grid grid-cols-4 gap-1">
                {strings.map((string, stringIndex) => (
                  <div key={string} className="flex flex-col">
                    {/* String number */}
                    <div className="text-xs text-center mb-1 font-mono">
                      {string}
                    </div>
                    
                    {/* Frets */}
                    {frets.map((fret, fretIndex) => (
                      <div
                        key={`${string}-${fret}`}
                        className={`w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-xs font-bold ${
                          diagram.frets[stringIndex] === fret
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background'
                        }`}
                      >
                        {diagram.frets[stringIndex] === fret && diagram.fingers[stringIndex] > 0
                          ? diagram.fingers[stringIndex]
                          : ''
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Guitar chords (original logic)
      const strings = [6, 5, 4, 3, 2, 1]; // Guitar strings from low E to high E
      const frets = [0, 1, 2, 3, 4]; // First 5 frets
      
      return (
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-center mb-2">
            <h4 className="font-semibold">{diagram.name}</h4>
            <p className="text-sm text-muted-foreground">{diagram.description}</p>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              {/* Fretboard */}
              <div className="grid grid-cols-6 gap-1">
                {strings.map((string, stringIndex) => (
                  <div key={string} className="flex flex-col">
                    {/* String number */}
                    <div className="text-xs text-center mb-1 font-mono">
                      {string}
                    </div>
                    
                    {/* Frets */}
                    {frets.map((fret, fretIndex) => (
                      <div
                        key={`${string}-${fret}`}
                        className={`w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-xs font-bold ${
                          diagram.frets[stringIndex] === fret
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background'
                        }`}
                      >
                        {diagram.frets[stringIndex] === fret && diagram.fingers[stringIndex] > 0
                          ? diagram.fingers[stringIndex]
                          : ''
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              {/* Capo indicator */}
              {diagram.capo && (
                <div className="absolute -top-6 left-0 right-0 text-center">
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Capo {diagram.capo}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
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
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="guitar" className="flex items-center gap-2">
                    <Guitar className="h-4 w-4" />
                    Guitar
                  </TabsTrigger>
                  <TabsTrigger value="piano" className="flex items-center gap-2">
                    <Piano className="h-4 w-4" />
                    Piano
                  </TabsTrigger>
                  <TabsTrigger value="bass" className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Bass
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredChords.map((chord, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                            {chord.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Music className="h-3 w-3" />
                              {chord.key} Key
                            </Badge>
                            <Badge className={getDifficultyColor(chord.difficulty)}>
                              {chord.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-4">
                        {chord.description}
                      </p>
                      
                      {/* Chord Diagrams */}
                      <div className="space-y-4 mb-4">
                        {chord.diagrams.map((diagram, diagramIndex) => (
                          <div key={diagramIndex}>
                            {renderChordDiagram(diagram)}
                          </div>
                        ))}
                      </div>
                      
                      {/* Common Uses */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Common Uses:</h4>
                        <div className="flex flex-wrap gap-1">
                          {chord.commonUses.map((use, useIndex) => (
                            <Badge key={useIndex} variant="secondary" className="text-xs">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Alternative Names */}
                      {chord.alternativeNames.length > 1 && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2 text-sm">Also Known As:</h4>
                          <div className="flex flex-wrap gap-1">
                            {chord.alternativeNames.slice(1).map((name, nameIndex) => (
                              <Badge key={nameIndex} variant="outline" className="text-xs">
                                {name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Printer className="mr-2 h-4 w-4" />
                          Print
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
