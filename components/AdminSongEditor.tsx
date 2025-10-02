'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Music, 
  Youtube, 
  Guitar, 
  Piano,
  Upload
} from 'lucide-react';

interface SongData {
  id: number;
  title: string;
  english_title?: string;
  album?: string;
  year?: number;
  key: string;
  bpm: number;
  difficulty: string;
  youtube_id?: string;
  slug: string;
  chords: {
    piano: {
      primary: string[];
      progression: string;
      variations: string[];
    };
    guitar: {
      primary: string[];
      capo: number;
      tuning: string;
      chord_diagrams: Record<string, string>;
    };
  };
  song_structure: Record<string, string[]>;
  lyrics?: Array<{
    section: string;
    lines: Array<{
      chord: string;
      text: string;
    }>;
  }>;
}

interface AdminSongEditorProps {
  song?: SongData;
  onSave: (song: SongData) => void;
  onCancel: () => void;
}

export const AdminSongEditor: React.FC<AdminSongEditorProps> = ({ 
  song, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<SongData>(song || {
    id: Date.now(),
    title: '',
    english_title: '',
    album: '',
    year: new Date().getFullYear(),
    key: 'C Major',
    bpm: 120,
    difficulty: 'Beginner',
    youtube_id: '',
    slug: '',
    chords: {
      piano: {
        primary: [],
        progression: '',
        variations: []
      },
      guitar: {
        primary: [],
        capo: 0,
        tuning: 'Standard (EADGBE)',
        chord_diagrams: {}
      }
    },
    song_structure: {
      intro: [],
      verse: [],
      chorus: [],
      bridge: [],
      outro: []
    },
    lyrics: []
  });

  const [newChord, setNewChord] = useState('');
  const [newLyricSection, setNewLyricSection] = useState('');
  const [newLyricLine, setNewLyricLine] = useState({ chord: '', text: '' });

  const handleSave = () => {
    onSave(formData);
  };

  const addPianoChord = () => {
    if (newChord.trim()) {
      setFormData(prev => ({
        ...prev,
        chords: {
          ...prev.chords,
          piano: {
            ...prev.chords.piano,
            primary: [...prev.chords.piano.primary, newChord.trim()]
          }
        }
      }));
      setNewChord('');
    }
  };

  const removePianoChord = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chords: {
        ...prev.chords,
        piano: {
          ...prev.chords.piano,
          primary: prev.chords.piano.primary.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const addGuitarChord = () => {
    if (newChord.trim()) {
      setFormData(prev => ({
        ...prev,
        chords: {
          ...prev.chords,
          guitar: {
            ...prev.chords.guitar,
            primary: [...prev.chords.guitar.primary, newChord.trim()]
          }
        }
      }));
      setNewChord('');
    }
  };

  const removeGuitarChord = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chords: {
        ...prev.chords,
        guitar: {
          ...prev.chords.guitar,
          primary: prev.chords.guitar.primary.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const addLyricSection = () => {
    if (newLyricSection.trim()) {
      setFormData(prev => ({
        ...prev,
        lyrics: [
          ...(prev.lyrics || []),
          {
            section: newLyricSection.trim(),
            lines: []
          }
        ]
      }));
      setNewLyricSection('');
    }
  };

  const addLyricLine = (sectionIndex: number) => {
    if (newLyricLine.text.trim()) {
      setFormData(prev => ({
        ...prev,
        lyrics: prev.lyrics?.map((section, index) => 
          index === sectionIndex 
            ? { ...section, lines: [...section.lines, { ...newLyricLine }] }
            : section
        ) || []
      }));
      setNewLyricLine({ chord: '', text: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{song ? 'Edit Song' : 'Add New Song'}</CardTitle>
              <CardDescription>
                {song ? 'Update song information and chords' : 'Create a new song entry'}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="chords">Chords</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Song Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter song title"
                  />
                </div>
                <div>
                  <Label htmlFor="english_title">English Title</Label>
                  <Input
                    id="english_title"
                    value={formData.english_title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, english_title: e.target.value }))}
                    placeholder="Enter English translation"
                  />
                </div>
                <div>
                  <Label htmlFor="album">Album</Label>
                  <Input
                    id="album"
                    value={formData.album || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                    placeholder="Enter album name"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    placeholder="Enter year"
                  />
                </div>
                <div>
                  <Label htmlFor="key">Key</Label>
                  <Select value={formData.key} onValueChange={(value) => setFormData(prev => ({ ...prev, key: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C Major">C Major</SelectItem>
                      <SelectItem value="G Major">G Major</SelectItem>
                      <SelectItem value="D Major">D Major</SelectItem>
                      <SelectItem value="A Major">A Major</SelectItem>
                      <SelectItem value="E Major">E Major</SelectItem>
                      <SelectItem value="F Major">F Major</SelectItem>
                      <SelectItem value="Am">Am</SelectItem>
                      <SelectItem value="Em">Em</SelectItem>
                      <SelectItem value="Bm">Bm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bpm">BPM</Label>
                  <Input
                    id="bpm"
                    type="number"
                    value={formData.bpm}
                    onChange={(e) => setFormData(prev => ({ ...prev, bpm: parseInt(e.target.value) }))}
                    placeholder="Enter BPM"
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="Enter URL slug"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Chords */}
            <TabsContent value="chords" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Piano Chords */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Piano className="h-5 w-5 mr-2" />
                      Piano Chords
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Primary Chords</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newChord}
                          onChange={(e) => setNewChord(e.target.value)}
                          placeholder="Add chord (e.g., C, G, Am)"
                        />
                        <Button onClick={addPianoChord} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.chords.piano.primary.map((chord, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            {chord}
                            <button onClick={() => removePianoChord(index)}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="piano_progression">Progression</Label>
                      <Input
                        id="piano_progression"
                        value={formData.chords.piano.progression}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chords: {
                            ...prev.chords,
                            piano: { ...prev.chords.piano, progression: e.target.value }
                          }
                        }))}
                        placeholder="C - G - Am - F"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Guitar Chords */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Guitar className="h-5 w-5 mr-2" />
                      Guitar Chords
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Primary Chords</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newChord}
                          onChange={(e) => setNewChord(e.target.value)}
                          placeholder="Add chord (e.g., C, G, Am)"
                        />
                        <Button onClick={addGuitarChord} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.chords.guitar.primary.map((chord, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            {chord}
                            <button onClick={() => removeGuitarChord(index)}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="capo">Capo</Label>
                        <Input
                          id="capo"
                          type="number"
                          value={formData.chords.guitar.capo}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            chords: {
                              ...prev.chords,
                              guitar: { ...prev.chords.guitar, capo: parseInt(e.target.value) }
                            }
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tuning">Tuning</Label>
                        <Input
                          id="tuning"
                          value={formData.chords.guitar.tuning}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            chords: {
                              ...prev.chords,
                              guitar: { ...prev.chords.guitar, tuning: e.target.value }
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Song Structure */}
            <TabsContent value="structure" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.song_structure).map(([section, chords]) => (
                  <div key={section}>
                    <Label className="capitalize">{section}</Label>
                    <Input
                      value={chords.join(' - ')}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        song_structure: {
                          ...prev.song_structure,
                          [section]: e.target.value.split(' - ').filter(Boolean)
                        }
                      }))}
                      placeholder="C - G - Am - F"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Lyrics */}
            <TabsContent value="lyrics" className="space-y-4">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newLyricSection}
                    onChange={(e) => setNewLyricSection(e.target.value)}
                    placeholder="Section name (e.g., Verse 1, Chorus)"
                  />
                  <Button onClick={addLyricSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
                
                {formData.lyrics?.map((section, sectionIndex) => (
                  <Card key={sectionIndex}>
                    <CardHeader>
                      <CardTitle className="text-lg">{section.section}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {section.lines.map((line, lineIndex) => (
                        <div key={lineIndex} className="flex items-center space-x-2">
                          <Input
                            value={line.chord}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              lyrics: prev.lyrics?.map((s, sIndex) => 
                                sIndex === sectionIndex 
                                  ? { ...s, lines: s.lines.map((l, lIndex) => 
                                      lIndex === lineIndex ? { ...l, chord: e.target.value } : l
                                    )}
                                  : s
                              ) || []
                            }))}
                            placeholder="Chord"
                            className="w-20"
                          />
                          <Input
                            value={line.text}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              lyrics: prev.lyrics?.map((s, sIndex) => 
                                sIndex === sectionIndex 
                                  ? { ...s, lines: s.lines.map((l, lIndex) => 
                                      lIndex === lineIndex ? { ...l, text: e.target.value } : l
                                    )}
                                  : s
                              ) || []
                            }))}
                            placeholder="Lyrics"
                            className="flex-1"
                          />
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Input
                          value={newLyricLine.chord}
                          onChange={(e) => setNewLyricLine(prev => ({ ...prev, chord: e.target.value }))}
                          placeholder="Chord"
                          className="w-20"
                        />
                        <Input
                          value={newLyricLine.text}
                          onChange={(e) => setNewLyricLine(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Add new line"
                          className="flex-1"
                        />
                        <Button onClick={() => addLyricLine(sectionIndex)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Media */}
            <TabsContent value="media" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="youtube_id">YouTube Video ID</Label>
                  <Input
                    id="youtube_id"
                    value={formData.youtube_id || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_id: e.target.value }))}
                    placeholder="Enter YouTube video ID"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Just the video ID, not the full URL
                  </p>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Thumbnail
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
