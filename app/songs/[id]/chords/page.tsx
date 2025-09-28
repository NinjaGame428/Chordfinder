"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Printer, 
  Music, 
  Clock, 
  User, 
  Star, 
  Heart,
  ChevronUp,
  ChevronDown,
  RotateCcw
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import AdvancedTransposeButton from "@/components/advanced-transpose-button";
import SongRating from "@/components/song-rating";
import { getSongBySlug } from "@/lib/song-data";

export default function ChordDisplayPage() {
  const params = useParams();
  const songSlug = params.id as string;
  const [currentKey, setCurrentKey] = useState("G Major");
  
  // Find the song by slug
  const song = getSongBySlug(songSlug);
  
  if (!song) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Song Not Found</h1>
            <p className="text-muted-foreground">The requested song could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const transposeChord = (chord: string, fromKey: string, toKey: string) => {
    const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const flatScale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    
    // Extract the base chord (without extensions)
    const chordMatch = chord.match(/^([A-G][b#]?)(.*)$/);
    if (!chordMatch) return chord;
    
    const [, baseChord, extensions] = chordMatch;
    
    // Find the index of the base chord
    let fromIndex = chromatic.indexOf(baseChord);
    if (fromIndex === -1) {
      fromIndex = flatScale.indexOf(baseChord);
    }
    if (fromIndex === -1) return chord;
    
    // Find the index of the target key
    let toIndex = chromatic.indexOf(toKey);
    if (toIndex === -1) {
      toIndex = flatScale.indexOf(toKey);
    }
    if (toIndex === -1) return chord;
    
    // Calculate the transposition interval
    const fromKeyIndex = chromatic.indexOf(fromKey);
    if (fromKeyIndex === -1) return chord;
    
    const semitones = (toIndex - fromKeyIndex + 12) % 12;
    const newChordIndex = (fromIndex + semitones) % 12;
    
    // Return the transposed chord with extensions
    return chromatic[newChordIndex] + extensions;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const renderChordChart = () => {
    // Transpose the chord chart based on current key
    let transposedChart = song.chordChart;
    
    // Simple chord transposition for the chart
    if (currentKey !== song.key) {
      // This is a simplified version - in a real app you'd want more sophisticated transposition
      transposedChart = song.chordChart.replace(/\[([^\]]+)\]/g, (match, chord) => {
        return `[${transposeChord(chord, song.key, currentKey)}]`;
      });
    }

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary">Chord Chart</h3>
          <div className="bg-muted p-6 rounded-lg">
            <pre className="text-sm font-mono whitespace-pre-wrap">{transposedChart}</pre>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary">Chord Progression</h3>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-lg font-mono">{song.chordProgression}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary">Chords Used</h3>
          <div className="flex flex-wrap gap-2">
            {song.chords.map((chord, index) => (
              <Badge key={index} variant="outline" className="text-lg px-3 py-1">
                {transposeChord(chord, song.key, currentKey)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading chord chart...");
  };

  const handlePrint = () => {
    // In a real app, this would open print dialog
    window.print();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Song Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">{song.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {song.artist}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Music className="h-3 w-3" />
                  {song.category}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {song.tempo}
                </Badge>
                <Badge className={`flex items-center gap-1 ${getDifficultyColor(song.difficulty)}`}>
                  <Star className="h-3 w-3" />
                  {song.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {song.year}
                </Badge>
              </div>
            </div>

            {/* Transpose Controls */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Transpose
                </CardTitle>
                <CardDescription>
                  Change the key of the song to match your vocal range or instrument
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedTransposeButton
                  currentKey={currentKey}
                  onKeyChange={setCurrentKey}
                  originalKey={song.key}
                />
              </CardContent>
            </Card>

            {/* Chord Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Chord Chart</CardTitle>
                <CardDescription>
                  Complete chord progression with lyrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderChordChart()}
              </CardContent>
            </Card>

            {/* Song Rating */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <SongRating songId={song.id} songTitle={song.title} songArtist={song.artist} />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>

            {/* Song Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Song Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Key:</span>
                    <span className="font-medium">{song.key}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Key:</span>
                    <span className="font-medium">{currentKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tempo:</span>
                    <span className="font-medium">{song.tempo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-medium">{song.difficulty}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{song.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}