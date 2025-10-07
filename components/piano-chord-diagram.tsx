"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, Printer, Share2 } from "lucide-react";

interface PianoChordDiagramProps {
  chordName: string;
  notes: string[];
  fingers: number[];
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category?: string;
  commonUses?: string[];
  onPlay?: () => void;
  onStop?: () => void;
  isPlaying?: boolean;
}

const PianoChordDiagram = ({
  chordName,
  notes,
  fingers,
  description,
  difficulty,
  category,
  commonUses = [],
  onPlay,
  onStop,
  isPlaying = false
}: PianoChordDiagramProps) => {
  // Full octave from C to B, including sharps/flats - French notation
  const octaveNotes = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
  
  // Normalize note names (handle enharmonic equivalents) - French notation
  const normalizeNote = (note: string): string => {
    const enharmonic: { [key: string]: string } = {
      'Db': 'Do#', 'Eb': 'Ré#', 'Gb': 'Fa#', 'Ab': 'Sol#', 'Bb': 'La#',
      'E#': 'Fa', 'B#': 'Do', 'Fb': 'Mi', 'Cb': 'Si',
      'F##': 'Sol', 'C##': 'Ré', 'G##': 'La', 'D##': 'Mi', 'A##': 'Si',
      // French equivalents
      'C': 'Do', 'D': 'Ré', 'E': 'Mi', 'F': 'Fa', 'G': 'Sol', 'A': 'La', 'B': 'Si',
      'C#': 'Do#', 'D#': 'Ré#', 'F#': 'Fa#', 'G#': 'Sol#', 'A#': 'La#'
    };
    return enharmonic[note] || note;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'Facile';
      case 'Medium': return 'Moyen';
      case 'Hard': return 'Difficile';
      default: return difficulty;
    }
  };

  const isKeyPressed = (note: string) => {
    const normalized = normalizeNote(note);
    return notes.some(n => normalizeNote(n) === normalized);
  };

  const blackKeyPositions: { [key: string]: number } = {
    'C#': 35,
    'D#': 85,
    'F#': 185,
    'G#': 235,
    'A#': 285
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-center">{chordName}</CardTitle>
            <CardDescription className="text-center mt-1">{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(difficulty)}>
              {getDifficultyText(difficulty)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={isPlaying ? onStop : onPlay}
              className="rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Notes Badge Display */}
        <div className="mb-3 flex gap-2">
          {notes.map(note => (
            <Badge key={note} variant="secondary" className="text-sm px-3 py-1">
              {note}
            </Badge>
          ))}
        </div>

        {/* Piano Keyboard SVG */}
        <div className="relative inline-block">
          <svg width="400" height="180" className="bg-card rounded-lg border">
            {/* Draw white keys */}
            {octaveNotes.filter(n => !n.includes('#')).map((note, idx) => {
              const x = idx * 50;
              const isHighlighted = isKeyPressed(note);
              return (
                <g key={note}>
                  <rect
                    x={x}
                    y="20"
                    width="48"
                    height="140"
                    fill={isHighlighted ? '#991b1b' : 'hsl(var(--background))'}
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    rx="4"
                    ry="4"
                  />
                  <text
                    x={x + 24}
                    y="150"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill={isHighlighted ? 'white' : 'hsl(var(--foreground))'}
                  >
                    {note}
                  </text>
                </g>
              );
            })}
            
            {/* Draw black keys */}
            {octaveNotes.filter(n => n.includes('#')).map((note) => {
              const x = blackKeyPositions[note];
              const isHighlighted = isKeyPressed(note);
              return (
                <g key={note}>
                  <rect
                    x={x}
                    y="20"
                    width="30"
                    height="90"
                    fill={isHighlighted ? '#7f1d1d' : 'hsl(var(--foreground))'}
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    rx="3"
                    ry="3"
                  />
                  {isHighlighted && (
                    <text
                      x={x + 15}
                      y="95"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="white"
                    >
                      {note}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Chord Details */}
        <div className="w-full mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{chordName}</h3>
            {category && <Badge variant="outline">{category}</Badge>}
          </div>
          
          <p className="text-muted-foreground text-sm">{description}</p>
          
          {commonUses && commonUses.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-sm">Common Uses:</h4>
              <div className="flex flex-wrap gap-2">
                {commonUses.map((use, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">{use}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button size="sm" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PianoChordDiagram;
