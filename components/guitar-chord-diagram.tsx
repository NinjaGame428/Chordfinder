"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, Printer, Share2 } from "lucide-react";

interface GuitarChordDiagramProps {
  chordName: string;
  frets: number[];
  fingers: number[];
  barre?: number;
  capo?: number;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category?: string;
  commonUses?: string[];
  onPlay?: () => void;
  onStop?: () => void;
  isPlaying?: boolean;
}

const GuitarChordDiagram = ({
  chordName,
  frets,
  fingers,
  barre,
  capo,
  description,
  difficulty,
  category,
  commonUses = [],
  onPlay,
  onStop,
  isPlaying = false
}: GuitarChordDiagramProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];
  const fretNumbers = [1, 2, 3, 4];

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
              {difficulty}
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
        {/* String names */}
        <div className="flex justify-between w-48 mb-2">
          {stringNames.map((str, idx) => (
            <div key={idx} className="w-8 text-center text-xs font-semibold text-muted-foreground">
              {str}
            </div>
          ))}
        </div>

        {/* Open/Muted indicators */}
        <div className="flex justify-between w-48 mb-2">
          {stringNames.map((str, idx) => {
            const fret = frets[idx];
            const isMuted = fret === -1 || fret < 0;
            const isOpen = fret === 0;
            
            return (
              <div key={idx} className="w-8 text-center font-bold">
                {isMuted ? (
                  <span className="text-red-500 text-lg">✕</span>
                ) : isOpen ? (
                  <span className="text-green-500 text-lg">○</span>
                ) : (
                  <span className="text-transparent">○</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Fretboard */}
        <div className="bg-amber-100 rounded-lg p-4 border-4 border-amber-800">
          <svg width="192" height="160">
            {/* Nut (top border) */}
            <rect x="0" y="0" width="192" height="4" fill="#1a1a1a" rx="1" />

            {/* Frets */}
            {fretNumbers.map((fret, fretIdx) => (
              <rect
                key={fretIdx}
                x="0"
                y={fretIdx * 40 + 40}
                width="192"
                height="2"
                fill="#666"
              />
            ))}

            {/* Strings */}
            {stringNames.map((str, strIdx) => (
              <rect
                key={strIdx}
                x={strIdx * 32 + 16}
                y="0"
                width="2"
                height="160"
                fill="#333"
              />
            ))}

            {/* Finger positions */}
            {frets.map((fret, idx) => {
              if (fret <= 0 || fret > 4) return null;
              
              const x = idx * 32 + 16;
              const y = (fret - 0.5) * 40;
              const fingerNum = fingers[idx] || idx + 1;
              
              return (
                <g key={idx}>
                  <circle
                    cx={x + 1}
                    cy={y}
                    r="12"
                    fill="#1e40af"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                  />
                  <text
                    x={x + 1}
                    y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="white"
                  >
                    {fingerNum}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Fret numbers */}
        <div className="flex justify-between w-48 mt-2">
          <div className="w-8"></div>
          {fretNumbers.map((fret) => (
            <div key={fret} className="w-8 text-center text-xs text-muted-foreground">
              {fret}
            </div>
          ))}
        </div>

        {/* Barre indicator */}
        {barre && barre > 0 && (
          <div className="mt-4 p-2 bg-blue-100 rounded-lg border border-blue-200 w-48">
            <div className="text-xs font-medium text-blue-800">
              Barre: Use finger {barre} across multiple strings
            </div>
          </div>
        )}

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
              Save
            </Button>
            <Button size="sm" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuitarChordDiagram;
