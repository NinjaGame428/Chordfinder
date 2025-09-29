"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Volume2, RotateCcw, Info } from "lucide-react";

interface GuitarChordDiagramProps {
  chordName: string;
  frets: number[];
  fingers: number[];
  barre?: number;
  capo?: number;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
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
  onPlay,
  onStop,
  isPlaying = false
}: GuitarChordDiagramProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
  const maxFret = Math.max(...frets.filter(f => f > 0));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-primary">{chordName}</h3>
            <p className="text-muted-foreground mt-1">{description}</p>
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
                <Play className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Guitar Fretboard */}
        <div className="relative bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200">
          {/* Capo indicator */}
          {capo && capo > 0 && (
            <div className="absolute -top-2 left-0 right-0 h-1 bg-red-500 rounded-full z-10">
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">
                Capo {capo}
              </span>
            </div>
          )}

          {/* Fret numbers */}
          <div className="flex justify-between mb-2">
            <div className="w-6"></div> {/* Space for string names */}
            {Array.from({ length: maxFret + 1 }, (_, i) => (
              <div key={i} className="text-xs font-medium text-slate-600 w-8 text-center">
                {i}
              </div>
            ))}
          </div>

          {/* Strings and frets */}
          <div className="space-y-3">
            {strings.map((string, stringIndex) => {
              const fret = frets[stringIndex];
              const finger = fingers[stringIndex];
              const isOpen = fret === 0;
              const isMuted = fret === -1;

              return (
                <div key={string} className="relative flex items-center">
                  {/* String name */}
                  <div className="w-6 text-sm font-bold text-slate-700 text-center">
                    {string}
                  </div>

                  {/* String line */}
                  <div className="flex-1 relative">
                    <div className="h-0.5 bg-slate-400 relative">
                      {/* Frets - vertical lines */}
                      {Array.from({ length: maxFret + 1 }, (_, fretIndex) => (
                        <div
                          key={fretIndex}
                          className="absolute w-0.5 h-3 bg-slate-300 -top-1"
                          style={{ left: `${(fretIndex * 100) / maxFret}%` }}
                        />
                      ))}
                      
                      {/* Horizontal fret lines */}
                      {Array.from({ length: maxFret }, (_, fretIndex) => (
                        <div
                          key={`fret-${fretIndex}`}
                          className="absolute h-0.5 bg-slate-300 w-full"
                          style={{ left: `${(fretIndex * 100) / maxFret}%`, width: `${100 - (fretIndex * 100) / maxFret}%` }}
                        />
                      ))}

                      {/* Finger position */}
                      {!isMuted && (
                        <div
                          className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -top-2.5 transform -translate-x-1/2 ${
                            isOpen
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                          style={{ 
                            left: isOpen ? '5%' : `${(fret * 100) / maxFret}%`
                          }}
                        >
                          {isOpen ? 'O' : finger}
                        </div>
                      )}

                      {/* Muted string indicator */}
                      {isMuted && (
                        <div className="absolute w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold -top-2.5 transform -translate-x-1/2 left-1/2">
                          X
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barre indicator */}
          {barre && barre > 0 && (
            <div className="mt-4 p-2 bg-blue-100 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-800">
                Barre: Use your {barre === 1 ? 'index' : barre === 2 ? 'middle' : barre === 3 ? 'ring' : 'pinky'} finger across all strings
              </div>
            </div>
          )}
        </div>

        {/* Chord Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Frets</div>
            <div className="text-lg font-semibold">
              {frets.map((f, i) => f === -1 ? 'X' : f === 0 ? 'O' : f).join(' ')}
            </div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Fingers</div>
            <div className="text-lg font-semibold">{fingers.join(' ')}</div>
          </div>
        </div>

        {/* Technique Tips */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Technique Tips
          </h4>
          <p className="text-sm text-amber-800">
            {barre ? 
              `For this ${barre === 1 ? 'index finger' : 'multi-finger'} barre chord, press firmly across all strings and keep your thumb behind the neck for support.` :
              'Place your fingers just behind the frets for clean sound. Keep your thumb behind the neck and maintain a relaxed grip.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuitarChordDiagram;
