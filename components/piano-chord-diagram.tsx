"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, RotateCcw, Info } from "lucide-react";

interface PianoChordDiagramProps {
  chordName: string;
  notes: string[];
  fingers: number[];
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
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
  onPlay,
  onStop,
  isPlaying = false
}: PianoChordDiagramProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Piano key layout - 1 octave (C to C) with proper spacing
  const pianoKeys = [
    { note: 'C', isBlack: false, position: 0, width: 1 },
    { note: 'C#', isBlack: true, position: 0.7, width: 0.6 },
    { note: 'D', isBlack: false, position: 1, width: 1 },
    { note: 'D#', isBlack: true, position: 1.7, width: 0.6 },
    { note: 'E', isBlack: false, position: 2, width: 1 },
    { note: 'F', isBlack: false, position: 3, width: 1 },
    { note: 'F#', isBlack: true, position: 3.7, width: 0.6 },
    { note: 'G', isBlack: false, position: 4, width: 1 },
    { note: 'G#', isBlack: true, position: 4.7, width: 0.6 },
    { note: 'A', isBlack: false, position: 5, width: 1 },
    { note: 'A#', isBlack: true, position: 5.7, width: 0.6 },
    { note: 'B', isBlack: false, position: 6, width: 1 },
    { note: 'C', isBlack: false, position: 7, width: 1 }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isKeyPressed = (note: string) => {
    return notes.includes(note);
  };

  const getFingerForNote = (note: string) => {
    const noteIndex = notes.indexOf(note);
    return noteIndex >= 0 ? fingers[noteIndex] : null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
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
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Piano Keyboard */}
        <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg p-4 border-2 border-slate-200">
          <div className="relative h-32">
            {/* White Keys */}
            <div className="absolute inset-0 flex">
              {pianoKeys.filter(key => !key.isBlack).map((key, index) => {
                const isPressed = isKeyPressed(key.note);
                const finger = getFingerForNote(key.note);
                
                return (
                  <div
                    key={`white-${key.note}-${index}`}
                    className={`relative border-r border-slate-300 rounded-b-lg transition-all duration-200 ${
                      isPressed 
                        ? 'bg-blue-200 shadow-inner border-blue-300' 
                        : 'bg-white hover:bg-blue-50'
                    }`}
                    style={{ 
                      zIndex: 1,
                      flex: key.width,
                      minWidth: `${(key.width * 100) / 7}%`
                    }}
                  >
                    {/* Key Label */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-slate-600">
                      {key.note}
                    </div>
                    
                    {/* Finger Number */}
                    {finger && (
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {finger}
                      </div>
                    )}
                    
                    {/* Pressed Effect */}
                    {isPressed && (
                      <div className="absolute inset-0 bg-blue-300/30 rounded-b-lg animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Black Keys */}
            <div className="absolute inset-0 flex">
              {pianoKeys.filter(key => key.isBlack).map((key, index) => {
                const isPressed = isKeyPressed(key.note);
                const finger = getFingerForNote(key.note);
                
                return (
                  <div
                    key={`black-${key.note}-${index}`}
                    className={`relative w-8 h-20 -ml-4 rounded-b-lg transition-all duration-200 ${
                      isPressed 
                        ? 'bg-blue-800 shadow-inner' 
                        : 'bg-slate-800 hover:bg-blue-900'
                    }`}
                    style={{ 
                      zIndex: 2,
                      left: `${(key.position * 100) / 7}%`
                    }}
                  >
                    {/* Finger Number for Black Keys */}
                    {finger && (
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {finger}
                      </div>
                    )}
                    
                    {/* Pressed Effect */}
                    {isPressed && (
                      <div className="absolute inset-0 bg-blue-400/50 rounded-b-lg animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chord Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Notes</div>
            <div className="text-lg font-semibold">{notes.join(' - ')}</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Fingers</div>
            <div className="text-lg font-semibold">{fingers.join(' - ')}</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Type</div>
            <div className="text-lg font-semibold">{chordName.split(' ')[1] || 'Major'}</div>
          </div>
        </div>

        {/* Hand Position Guide */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Hand Position Guide
          </h4>
          <p className="text-sm text-blue-800">
            Keep your fingers curved, press keys firmly but not tensely, and maintain a relaxed wrist position. 
            Use the finger numbers as a guide for proper fingering technique.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PianoChordDiagram;
