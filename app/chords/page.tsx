"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  Tag,
  Play,
  Pause,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/contexts/LanguageContext";
import PianoChordDiagram from "@/components/piano-chord-diagram";
import GuitarChordDiagram from "@/components/guitar-chord-diagram";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ChordDiagram {
  name: string;
  frets: number[];
  fingers: number[];
  barre?: number;
  capo?: number;
  description: string;
}

interface PianoChord {
  name: string;
  notes: string[];
  fingers: number[];
  description: string;
}

interface Chord {
  name: string;
  key: string;
  difficulty: "Easy" | "Medium" | "Hard";
  guitarDiagrams: ChordDiagram[];
  pianoChords: PianoChord[];
  description: string;
  commonUses: string[];
  alternativeNames: string[];
  category: string;
}

const ChordDisplayPage = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("All Keys");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [activeTab, setActiveTab] = useState("guitar");
  const [playingChord, setPlayingChord] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [chords, setChords] = useState<Chord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    "Toutes les Tonalités", "Do", "Do#", "Ré", "Ré#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"
  ];

  const difficulties = ["Tous les Niveaux", "Facile", "Moyen", "Difficile"];

  // Fetch chords from Supabase
  useEffect(() => {
    const fetchChords = async () => {
      console.log('🎸🎹 Fetching chords from Supabase...');
      setIsLoading(true);

      if (!supabase) {
        console.error('❌ Supabase client not initialized');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch both piano and guitar chords
        const [pianoData, guitarData] = await Promise.all([
          supabase.from('piano_chords').select('*'),
          supabase.from('guitar_chords').select('*')
        ]);

        if (pianoData.error || guitarData.error) {
          console.error('❌ Error fetching chords:', pianoData.error || guitarData.error);
          setIsLoading(false);
          return;
        }

        console.log(`✅ Loaded ${pianoData.data?.length} piano chords, ${guitarData.data?.length} guitar chords`);

        // Group chords by name to combine piano and guitar data
        const chordMap = new Map<string, Chord>();

        // Process piano chords
        pianoData.data?.forEach((pianoChord: any) => {
          const chordName = pianoChord.chord_name;
          if (!chordMap.has(chordName)) {
            chordMap.set(chordName, {
              name: chordName,
              key: pianoChord.root_note,
              difficulty: pianoChord.difficulty as "Easy" | "Medium" | "Hard",
              guitarDiagrams: [],
              pianoChords: [],
              description: pianoChord.description || '',
              commonUses: [],
              alternativeNames: pianoChord.alternate_name ? [pianoChord.alternate_name] : [],
              category: pianoChord.chord_type
            });
          }

          const chord = chordMap.get(chordName)!;
          chord.pianoChords.push({
            name: 'Root Position',
            notes: pianoChord.notes,
            fingers: pianoChord.fingering?.split('-').map((f: string) => parseInt(f)) || [1, 3, 5],
            description: pianoChord.intervals
          });
        });

        // Process guitar chords
        guitarData.data?.forEach((guitarChord: any) => {
          const chordName = guitarChord.chord_name;
          if (!chordMap.has(chordName)) {
            chordMap.set(chordName, {
              name: chordName,
              key: guitarChord.root_note,
              difficulty: guitarChord.difficulty as "Easy" | "Medium" | "Hard",
              guitarDiagrams: [],
              pianoChords: [],
              description: guitarChord.description || '',
              commonUses: [],
              alternativeNames: guitarChord.alternate_name ? [guitarChord.alternate_name] : [],
              category: guitarChord.chord_type
            });
          }

          const chord = chordMap.get(chordName)!;
          if (guitarChord.frets && guitarChord.fingers) {
            chord.guitarDiagrams.push({
              name: `${chordName} Position`,
              frets: guitarChord.frets,
              fingers: guitarChord.fingers,
              description: guitarChord.intervals
            });
          }
        });

        // Sort chords in musical order: C, D, E, F, G, A, B
        const musicalOrder = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
        const chordsArray = Array.from(chordMap.values()).sort((a, b) => {
          const aRoot = a.key;
          const bRoot = b.key;
          const aIndex = musicalOrder.indexOf(aRoot);
          const bIndex = musicalOrder.indexOf(bRoot);
          
          // If both roots are in the order array, sort by position
          if (aIndex !== -1 && bIndex !== -1) {
            if (aIndex !== bIndex) return aIndex - bIndex;
          }
          
          // If same root, sort by chord type
          return a.name.localeCompare(b.name);
        });
        
        console.log(`✅ Processed ${chordsArray.length} total chords in musical order`);
        setChords(chordsArray);
      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChords();
  }, []);

  // Fallback hardcoded chords for reference
  const hardcodedChords: Chord[] = [
    // C Major Chords
    {
      name: "C Major",
      key: "C",
      difficulty: "Easy",
      category: "Major",
      guitarDiagrams: [
        {
          name: "C Major Open",
          frets: [0, 3, 2, 0, 1, 0],
          fingers: [0, 3, 2, 0, 1, 0],
          description: "Open position C major chord"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["C", "E", "G"],
          fingers: [1, 3, 5],
          description: "C-E-G (Root position)"
        },
        {
          name: "First Inversion",
          notes: ["E", "G", "C"],
          fingers: [1, 2, 5],
          description: "E-G-C (First inversion)"
        },
        {
          name: "Second Inversion",
          notes: ["G", "C", "E"],
          fingers: [1, 3, 5],
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
      difficulty: "Medium",
      category: "Minor",
      guitarDiagrams: [
        {
          name: "C Minor Barre",
          frets: [3, 3, 5, 5, 4, 3],
          fingers: [1, 1, 3, 4, 2, 1],
          barre: 1,
          description: "Barre chord version"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["C", "Eb", "G"],
          fingers: [1, 3, 5],
          description: "C-Eb-G (Root position)"
        },
        {
          name: "First Inversion",
          notes: ["Eb", "G", "C"],
          fingers: [1, 2, 5],
          description: "Eb-G-C (First inversion)"
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
      category: "Dominant 7th",
      guitarDiagrams: [
        {
          name: "Open C7",
          frets: [0, 1, 0, 2, 1, 3],
          fingers: [0, 1, 0, 3, 2, 4],
          description: "Dominant 7th chord"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["C", "E", "G", "Bb"],
          fingers: [1, 2, 3, 5],
          description: "C-E-G-Bb (Root position)"
        }
      ],
      description: "The C7 chord is a dominant seventh chord, creating tension that typically resolves to an F major chord.",
      commonUses: ["V7 chord in F major", "I7 chord in C blues"],
      alternativeNames: ["C7", "C Dominant 7", "C Dom7"]
    },
    // G Major Chords
    {
      name: "G Major",
      key: "G",
      difficulty: "Easy",
      category: "Major",
      guitarDiagrams: [
        {
          name: "G Major Open",
          frets: [3, 2, 0, 0, 0, 3],
          fingers: [3, 2, 0, 0, 0, 4],
          description: "Open position G major chord"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["G", "B", "D"],
          fingers: [1, 3, 5],
          description: "G-B-D (Root position)"
        },
        {
          name: "First Inversion",
          notes: ["B", "D", "G"],
          fingers: [1, 2, 5],
          description: "B-D-G (First inversion)"
        }
      ],
      description: "The G major chord is a very common and versatile chord, often used in rock, folk, and country music.",
      commonUses: ["I chord in G major", "IV chord in D major", "V chord in C major"],
      alternativeNames: ["G", "G Major", "G Maj"]
    },
    {
      name: "G Minor",
      key: "G",
      difficulty: "Medium",
      category: "Minor",
      guitarDiagrams: [
        {
          name: "G Minor Barre",
          frets: [3, 3, 3, 3, 3, 3],
          fingers: [1, 1, 1, 1, 1, 1],
          barre: 1,
          description: "Barre chord version"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["G", "Bb", "D"],
          fingers: [1, 3, 5],
          description: "G-Bb-D (Root position)"
        }
      ],
      description: "The G minor chord has a melancholic and smooth sound, commonly found in jazz and soul music.",
      commonUses: ["i chord in G minor", "ii chord in F major"],
      alternativeNames: ["Gm", "G Minor", "G Min"]
    },
    // D Major Chords
    {
      name: "D Major",
      key: "D",
      difficulty: "Easy",
      category: "Major",
      guitarDiagrams: [
        {
          name: "D Major Open",
          frets: [0, 0, 0, 2, 3, 2],
          fingers: [0, 0, 0, 1, 3, 2],
          description: "Open position D major chord"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["D", "F#", "A"],
          fingers: [1, 3, 5],
          description: "D-F#-A (Root position)"
        }
      ],
      description: "The D major chord is a bright and cheerful chord, frequently used in many genres.",
      commonUses: ["I chord in D major", "V chord in G major", "IV chord in A major"],
      alternativeNames: ["D", "D Major", "D Maj"]
    },
    {
      name: "D Minor",
      key: "D",
      difficulty: "Easy",
      category: "Minor",
      guitarDiagrams: [
        {
          name: "D Minor Open",
          frets: [0, 0, 0, 2, 3, 1],
          fingers: [0, 0, 0, 1, 3, 2],
          description: "Open position D minor chord"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["D", "F", "A"],
          fingers: [1, 3, 5],
          description: "D-F-A (Root position)"
        }
      ],
      description: "The D minor chord has a melancholic and gentle sound, common in ballads and classical pieces.",
      commonUses: ["i chord in D minor", "ii chord in C major"],
      alternativeNames: ["Dm", "D Minor", "D Min"]
    },
    // E Major Chords
    {
      name: "E Major",
      key: "E",
      difficulty: "Easy",
      category: "Major",
      guitarDiagrams: [
        {
          name: "E Major Open",
          frets: [0, 2, 2, 1, 0, 0],
          fingers: [0, 2, 3, 1, 0, 0],
          description: "Open position E major chord"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["E", "G#", "B"],
          fingers: [1, 3, 5],
          description: "E-G#-B (Root position)"
        }
      ],
      description: "The E major chord is a powerful and resonant chord, often used in rock and blues.",
      commonUses: ["I chord in E major", "IV chord in B major", "V chord in A major"],
      alternativeNames: ["E", "E Major", "E Maj"]
    },
    {
      name: "E Minor",
      key: "E",
      difficulty: "Easy",
      category: "Minor",
      guitarDiagrams: [
        {
          name: "E Minor Open",
          frets: [0, 2, 2, 0, 0, 0],
          fingers: [0, 2, 3, 0, 0, 0],
          description: "Open position E minor chord"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["E", "G", "B"],
          fingers: [1, 3, 5],
          description: "E-G-B (Root position)"
        }
      ],
      description: "The E minor chord has a somber and reflective quality, common in folk and classical music.",
      commonUses: ["i chord in E minor", "ii chord in D major"],
      alternativeNames: ["Em", "E Minor", "E Min"]
    },
    // A Major Chords
    {
      name: "A Major",
      key: "A",
      difficulty: "Easy",
      category: "Major",
      guitarDiagrams: [
        {
          name: "A Major Open",
          frets: [0, 0, 2, 2, 2, 0],
          fingers: [0, 0, 1, 2, 3, 0],
          description: "Open position A major chord"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["A", "C#", "E"],
          fingers: [1, 3, 5],
          description: "A-C#-E (Root position)"
        }
      ],
      description: "The A major chord is a fundamental chord, widely used across various music styles.",
      commonUses: ["I chord in A major", "IV chord in E major", "V chord in D major"],
      alternativeNames: ["A", "A Major", "A Maj"]
    },
    {
      name: "A Minor",
      key: "A",
      difficulty: "Easy",
      category: "Minor",
      guitarDiagrams: [
        {
          name: "A Minor Open",
          frets: [0, 0, 2, 2, 1, 0],
          fingers: [0, 0, 2, 3, 1, 0],
          description: "Open position A minor chord"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["A", "C", "E"],
          fingers: [1, 3, 5],
          description: "A-C-E (Root position)"
        }
      ],
      description: "The A minor chord is one of the most common minor chords, used extensively in popular music.",
      commonUses: ["i chord in A minor", "vi chord in C major"],
      alternativeNames: ["Am", "A Minor", "A Min"]
    },
    // F Major Chords
    {
      name: "F Major",
      key: "F",
      difficulty: "Medium",
      category: "Major",
      guitarDiagrams: [
        {
          name: "F Major Barre",
          frets: [1, 3, 3, 2, 1, 1],
          fingers: [1, 3, 4, 2, 1, 1],
          barre: 1,
          description: "Barre chord version"
        }
      ],
      pianoChords: [
        {
          name: "Root Position",
          notes: ["F", "A", "C"],
          fingers: [1, 3, 5],
          description: "F-A-C (Root position)"
        }
      ],
      description: "The F major chord is often played as a barre chord, which can be challenging for beginners.",
      commonUses: ["I chord in F major", "IV chord in C major", "V chord in Bb major"],
      alternativeNames: ["F", "F Major", "F Maj"]
    }
  ];

  // Filter chords based on search and filters
  const filteredChords = chords.filter(chord => {
    const matchesSearch = chord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chord.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chord.commonUses.some(use => use.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesKey = selectedKey === "All Keys" || chord.key === selectedKey;
    const matchesDifficulty = selectedDifficulty === "All Levels" || chord.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesKey && matchesDifficulty;
  });

  const handlePlayChord = (chordName: string) => {
    setPlayingChord(playingChord === chordName ? null : chordName);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Tous les Accords Gospel
            </h1>
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Maîtrisez chaque accord avec des diagrammes interactifs, positions des doigts et guides audio. 
            Parfait pour les guitaristes et pianistes de tous niveaux.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Guitar className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{chords.length}</div>
                  <div className="text-sm text-muted-foreground">Accords de Guitare</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Piano className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{chords.length}</div>
                  <div className="text-sm text-muted-foreground">Accords de Piano</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">Interactive</div>
                  <div className="text-sm text-muted-foreground">Learning Experience</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <Select value={selectedKey} onValueChange={setSelectedKey}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by Key" />
                  </SelectTrigger>
                  <SelectContent>
                    {keys.map(key => (
                      <SelectItem key={key} value={key}>{key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Advanced
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="seventh">7th Chords</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Instrument</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Both" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="guitar">Guitar Only</SelectItem>
                        <SelectItem value="piano">Piano Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="difficulty">Difficulty</SelectItem>
                        <SelectItem value="key">Key</SelectItem>
                        <SelectItem value="popularity">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Chord Display */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="guitar" className="flex items-center gap-2">
                <Guitar className="h-4 w-4" />
                Guitare
              </TabsTrigger>
              <TabsTrigger value="piano" className="flex items-center gap-2">
                <Piano className="h-4 w-4" />
                Piano
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guitar" className="space-y-8">
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Chargement des accords de guitare...</p>
                </div>
              ) : filteredChords.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredChords.map((chord) => (
                    <div key={chord.name} className="space-y-4">
                      {chord.guitarDiagrams.map((diagram, index) => (
                        <GuitarChordDiagram
                          key={`${chord.name}-${index}`}
                          chordName={getChordName(chord.name)}
                          frets={diagram.frets}
                          fingers={diagram.fingers}
                          barre={diagram.barre}
                          capo={diagram.capo}
                          description={chord.description}
                          difficulty={chord.difficulty}
                          category={chord.category}
                          commonUses={chord.commonUses}
                          onPlay={() => handlePlayChord(`${chord.name}-guitar-${index}`)}
                          onStop={() => setPlayingChord(null)}
                          isPlaying={playingChord === `${chord.name}-guitar-${index}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No chords found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
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
            </TabsContent>

            <TabsContent value="piano" className="space-y-8">
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Chargement des accords de piano...</p>
                </div>
              ) : filteredChords.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredChords.map((chord) => (
                    <div key={chord.name} className="space-y-6">
                      {chord.pianoChords.map((pianoChord, index) => (
                        <PianoChordDiagram
                          key={`${chord.name}-piano-${index}`}
                          chordName={getChordName(chord.name)}
                          notes={pianoChord.notes}
                          fingers={pianoChord.fingers}
                          description={chord.description}
                          difficulty={chord.difficulty}
                          category={chord.category}
                          commonUses={chord.commonUses}
                          onPlay={() => handlePlayChord(`${chord.name}-piano-${index}`)}
                          onStop={() => setPlayingChord(null)}
                          isPlaying={playingChord === `${chord.name}-piano-${index}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No chords found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
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
            </TabsContent>
          </Tabs>
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

      <Footer />
    </div>
  );
};

export default ChordDisplayPage;