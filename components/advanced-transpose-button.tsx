"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Music, RotateCcw, Plus, Minus, ChevronDown } from "lucide-react";

interface AdvancedTransposeButtonProps {
  originalKey: string;
  currentKey: string;
  onKeyChange: (newKey: string) => void;
  className?: string;
}

const AdvancedTransposeButton: React.FC<AdvancedTransposeButtonProps> = ({ 
  originalKey, 
  currentKey, 
  onKeyChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(currentKey);

  const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatScale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  useEffect(() => {
    setSelectedKey(currentKey);
  }, [currentKey]);

  const transposeChord = (chord: string, fromKey: string, toKey: string): string => {
    if (!chord || chord === '') return chord;
    
    // Extract the base chord (without extensions)
    const chordMatch = chord.match(/^([A-G][b#]?)(.*)$/);
    if (!chordMatch) return chord;
    
    const [, baseChord, extensions] = chordMatch;
    
    // Find the index of the base chord in the chromatic scale
    let fromIndex = chromaticScale.indexOf(baseChord);
    if (fromIndex === -1) {
      fromIndex = flatScale.indexOf(baseChord);
    }
    if (fromIndex === -1) return chord;
    
    // Find the index of the target key
    let toIndex = chromaticScale.indexOf(toKey);
    if (toIndex === -1) {
      toIndex = flatScale.indexOf(toKey);
    }
    if (toIndex === -1) return chord;
    
    // Calculate the transposition interval
    const fromKeyIndex = chromaticScale.indexOf(fromKey);
    if (fromKeyIndex === -1) return chord;
    
    const semitones = (toIndex - fromKeyIndex + 12) % 12;
    const newChordIndex = (fromIndex + semitones) % 12;
    
    // Return the transposed chord with extensions
    return chromaticScale[newChordIndex] + extensions;
  };

  const transposeUp = () => {
    const currentIndex = chromaticScale.indexOf(currentKey);
    if (currentIndex === -1) return;
    
    const newIndex = (currentIndex + 1) % 12;
    const newKey = chromaticScale[newIndex];
    setSelectedKey(newKey);
    onKeyChange(newKey);
  };

  const transposeDown = () => {
    const currentIndex = chromaticScale.indexOf(currentKey);
    if (currentIndex === -1) return;
    
    const newIndex = (currentIndex - 1 + 12) % 12;
    const newKey = chromaticScale[newIndex];
    setSelectedKey(newKey);
    onKeyChange(newKey);
  };

  const handleKeySelect = (newKey: string) => {
    setSelectedKey(newKey);
    onKeyChange(newKey);
    setIsOpen(false);
  };

  const resetToOriginal = () => {
    setSelectedKey(originalKey);
    onKeyChange(originalKey);
    setIsOpen(false);
  };

  const getKeyColor = (key: string) => {
    const isMinor = key.includes('m');
    return isMinor 
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  };

  const isTransposed = currentKey !== originalKey;

  return (
    <TooltipProvider>
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={transposeDown}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full min-w-[120px]"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Music className="h-4 w-4 mr-2" />
                {currentKey}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change the key of this song</p>
            </TooltipContent>
          </Tooltip>
          
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={transposeUp}
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          {isTransposed && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={resetToOriginal}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isOpen && (
          <Card className="absolute top-full left-0 mt-2 z-50 w-80 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Music className="h-5 w-5" />
                Transpose Song
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select a new key for this song. All chords will be automatically transposed.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium">Original Key:</span>
                <Badge className={getKeyColor(originalKey)}>
                  {originalKey}
                </Badge>
                <span className="text-sm font-medium">Current Key:</span>
                <Badge className={getKeyColor(currentKey)}>
                  {currentKey}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Select New Key</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {chromaticScale.map((key) => (
                      <Button
                        key={key}
                        variant={selectedKey === key ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() => handleKeySelect(key)}
                      >
                        {key}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Transposing to: <strong>{selectedKey}</strong>
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleKeySelect(selectedKey)}
                      className="rounded-full"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AdvancedTransposeButton;
