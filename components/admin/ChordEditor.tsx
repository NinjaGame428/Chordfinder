"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  Music, 
  Eye, 
  Edit3, 
  Save, 
  Undo, 
  Redo, 
  Download, 
  Upload, 
  Plus, 
  Minus, 
  RotateCcw,
  Copy,
  Scissors,
  FileText,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Types
interface ChordPosition {
  start: number;
  end: number;
  chord: string;
  key: string;
}

interface SongSection {
  type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro';
  title: string;
  content: string;
  chords: ChordPosition[];
}

interface EditorState {
  content: string;
  chords: ChordPosition[];
  sections: SongSection[];
  mode: 'edit' | 'preview';
  history: string[];
  historyIndex: number;
}

// Chord data and utilities
const CHORD_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHORD_TYPES = ['', 'm', '7', 'm7', 'maj7', 'sus2', 'sus4', 'add9', 'dim', 'aug'];
const COMMON_CHORDS = [
  'C', 'D', 'E', 'F', 'G', 'A', 'B',
  'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm',
  'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7',
  'Cm7', 'Dm7', 'Em7', 'Fm7', 'Gm7', 'Am7', 'Bm7',
  'Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7',
  'Csus2', 'Dsus2', 'Esus2', 'Fsus2', 'Gsus2', 'Asus2', 'Bsus2',
  'Csus4', 'Dsus4', 'Esus4', 'Fsus4', 'Gsus4', 'Asus4', 'Bsus4'
];

const ChordEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    content: '',
    chords: [],
    sections: [],
    mode: 'edit',
    history: [''],
    historyIndex: 0
  });
  
  const [selectedChord, setSelectedChord] = useState<string>('');
  const [showChordLibrary, setShowChordLibrary] = useState(false);
  const [transposeAmount, setTransposeAmount] = useState(0);
  const [chordSuggestions, setChordSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && editorState.content) {
      const interval = setInterval(() => {
        saveToLocalStorage();
        setLastSaved(new Date());
      }, 30000); // Auto-save every 30 seconds

      return () => clearInterval(interval);
    }
  }, [editorState, autoSaveEnabled]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chord-editor-content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEditorState(parsed);
      } catch (error) {
        console.error('Error loading saved content:', error);
      }
    }
  }, []);

  const saveToLocalStorage = useCallback(() => {
    localStorage.setItem('chord-editor-content', JSON.stringify(editorState));
  }, [editorState]);

  const saveToHistory = useCallback((newState: Partial<EditorState>) => {
    setEditorState(prev => {
      const newHistory = [...prev.history.slice(0, prev.historyIndex + 1), JSON.stringify(newState)];
      return {
        ...prev,
        ...newState,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, []);

  // Chord validation
  const validateChord = useCallback((chord: string): { valid: boolean; suggestion?: string } => {
    const cleanChord = chord.trim();
    if (!cleanChord) return { valid: false };
    
    // Check if chord exists in common chords
    if (COMMON_CHORDS.includes(cleanChord)) {
      return { valid: true };
    }
    
    // Check for similar chords
    const similar = COMMON_CHORDS.find(c => 
      c.toLowerCase().includes(cleanChord.toLowerCase()) ||
      cleanChord.toLowerCase().includes(c.toLowerCase())
    );
    
    return { 
      valid: false, 
      suggestion: similar 
    };
  }, []);

  // Chord transposition
  const transposeChord = useCallback((chord: string, semitones: number): string => {
    if (!chord) return chord;
    
    const noteIndex = CHORD_NOTES.findIndex(note => chord.startsWith(note));
    if (noteIndex === -1) return chord;
    
    const newIndex = (noteIndex + semitones + 12) % 12;
    const newNote = CHORD_NOTES[newIndex];
    const suffix = chord.substring(1);
    
    return newNote + suffix;
  }, []);

  const transposeAllChords = useCallback((semitones: number) => {
    setEditorState(prev => ({
      ...prev,
      chords: prev.chords.map(chord => ({
        ...chord,
        chord: transposeChord(chord.chord, semitones)
      }))
    }));
    setTransposeAmount(prev => prev + semitones);
  }, [transposeChord]);

  // Chord insertion
  const insertChord = useCallback((chord: string, position: number) => {
    const validation = validateChord(chord);
    if (!validation.valid) {
      alert(`Invalid chord: ${chord}${validation.suggestion ? `. Did you mean ${validation.suggestion}?` : ''}`);
      return;
    }

    const newChord: ChordPosition = {
      start: position,
      end: position,
      chord: chord,
      key: `chord-${Date.now()}-${Math.random()}`
    };

    setEditorState(prev => ({
      ...prev,
      chords: [...prev.chords, newChord].sort((a, b) => a.start - b.start)
    }));
  }, [validateChord]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const position = range.startOffset;
            const chord = prompt('Enter chord:');
            if (chord) insertChord(chord, position);
          }
          break;
        case 't':
          e.preventDefault();
          setShowChordLibrary(true);
          break;
        case 'z':
          e.preventDefault();
          undo();
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
        case 's':
          e.preventDefault();
          saveToLocalStorage();
          setLastSaved(new Date());
          break;
      }
    }
  }, [insertChord]);

  // Undo/Redo
  const undo = useCallback(() => {
    setEditorState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        const state = JSON.parse(prev.history[newIndex]);
        return { ...state, history: prev.history, historyIndex: newIndex };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setEditorState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        const state = JSON.parse(prev.history[newIndex]);
        return { ...state, history: prev.history, historyIndex: newIndex };
      }
      return prev;
    });
  }, []);

  // Chord autocomplete
  const handleChordInput = useCallback((input: string) => {
    if (input.length < 1) {
      setShowSuggestions(false);
      return;
    }

    const suggestions = COMMON_CHORDS.filter(chord => 
      chord.toLowerCase().startsWith(input.toLowerCase())
    ).slice(0, 8);

    setChordSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
    setSuggestionIndex(0);
  }, []);

  // Export functionality
  const exportToText = useCallback(() => {
    let text = editorState.content;
    
    // Add chords above lyrics
    editorState.chords.forEach(chord => {
      const beforeChord = text.substring(0, chord.start);
      const afterChord = text.substring(chord.start);
      text = beforeChord + `[${chord.chord}]` + afterChord;
    });
    
    return text;
  }, [editorState]);

  const exportToJSON = useCallback(() => {
    return JSON.stringify({
      content: editorState.content,
      chords: editorState.chords,
      sections: editorState.sections,
      metadata: {
        lastModified: new Date().toISOString(),
        version: '1.0'
      }
    }, null, 2);
  }, [editorState]);

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Render chord markers
  const renderChordMarkers = useCallback(() => {
    return editorState.chords.map(chord => (
      <span
        key={chord.key}
        className="chord-marker"
        style={{
          position: 'absolute',
          top: '-20px',
          left: `${chord.start * 8}px`,
          background: '#3b82f6',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        {chord.chord}
      </span>
    ));
  }, [editorState.chords]);

  // Render preview mode
  const renderPreview = useCallback(() => {
    let content = editorState.content;
    
    // Insert chord markers
    editorState.chords
      .sort((a, b) => b.start - a.start) // Sort in reverse order to maintain positions
      .forEach(chord => {
        const before = content.substring(0, chord.start);
        const after = content.substring(chord.start);
        content = before + `[${chord.chord}]` + after;
      });

    return (
      <div className="preview-content p-4 bg-gray-50 rounded-lg">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {content}
        </pre>
      </div>
    );
  }, [editorState]);

  return (
    <div className="chord-editor-container h-full flex flex-col">
      {/* Toolbar */}
      <div className="toolbar border-b p-4 bg-white">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Mode Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={editorState.mode === 'edit' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditorState(prev => ({ ...prev, mode: 'edit' }))}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant={editorState.mode === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditorState(prev => ({ ...prev, mode: 'preview' }))}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Formatting Tools */}
          <Button variant="ghost" size="sm">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Underline className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-8" />

          {/* Undo/Redo */}
          <Button variant="ghost" size="sm" onClick={undo} disabled={editorState.historyIndex === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={editorState.historyIndex === editorState.history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-8" />

          {/* Transpose Controls */}
          <div className="flex items-center gap-2">
            <Label className="text-sm">Transpose:</Label>
            <Button variant="ghost" size="sm" onClick={() => transposeAllChords(-1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <Badge variant="outline">{transposeAmount > 0 ? `+${transposeAmount}` : transposeAmount}</Badge>
            <Button variant="ghost" size="sm" onClick={() => transposeAllChords(1)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setTransposeAmount(0); }}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Chord Library */}
          <Dialog open={showChordLibrary} onOpenChange={setShowChordLibrary}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Music className="h-4 w-4 mr-2" />
                Chord Library
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Chord Library</DialogTitle>
                <DialogDescription>
                  Click on a chord to insert it at the cursor position
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {COMMON_CHORDS.map(chord => (
                  <Button
                    key={chord}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const selection = window.getSelection();
                      if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const position = range.startOffset;
                        insertChord(chord, position);
                      }
                      setShowChordLibrary(false);
                    }}
                  >
                    {chord}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Separator orientation="vertical" className="h-8" />

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => downloadFile(exportToText(), 'song.txt', 'text/plain')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadFile(exportToJSON(), 'song.json', 'application/json')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Save */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              saveToLocalStorage();
              setLastSaved(new Date());
            }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Words: {editorState.content.split(' ').length}</span>
            <span>Chords: {editorState.chords.length}</span>
            <span>Characters: {editorState.content.length}</span>
          </div>
          <div className="flex items-center gap-2">
            {isMobile && <Smartphone className="h-4 w-4" />}
            {!isMobile && <Monitor className="h-4 w-4" />}
            {lastSaved && (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 relative">
          {editorState.mode === 'edit' ? (
            <div className="h-full">
              <div
                ref={editorRef}
                contentEditable
                className="w-full h-full p-4 border-none outline-none resize-none overflow-y-auto"
                style={{ minHeight: '400px' }}
                onInput={(e) => {
                  const content = e.currentTarget.textContent || '';
                  saveToHistory({ content });
                }}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning
              >
                {editorState.content}
              </div>
              
              {/* Chord Markers Overlay */}
              <div className="absolute top-0 left-0 pointer-events-none">
                {renderChordMarkers()}
              </div>
            </div>
          ) : (
            renderPreview()
          )}
        </div>

        {/* Chord Input Panel (Mobile) */}
        {isMobile && (
          <div className="w-80 border-l bg-gray-50 p-4">
            <h3 className="font-semibold mb-4">Quick Chord Insert</h3>
            <div className="space-y-4">
              <div>
                <Label>Chord Name</Label>
                <Input
                  placeholder="Enter chord (e.g., C, Am, F#m7)"
                  value={selectedChord}
                  onChange={(e) => {
                    setSelectedChord(e.target.value);
                    handleChordInput(e.target.value);
                  }}
                />
                {showSuggestions && (
                  <div className="mt-2 border rounded-lg bg-white shadow-lg max-h-40 overflow-y-auto">
                    {chordSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                          index === suggestionIndex ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => {
                          setSelectedChord(suggestion);
                          setShowSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  if (selectedChord) {
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0);
                      const position = range.startOffset;
                      insertChord(selectedChord, position);
                      setSelectedChord('');
                    }
                  }
                }}
              >
                Insert Chord
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordEditor;
