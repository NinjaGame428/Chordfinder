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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ChordEditor } from '@/components/ui/chord-editor';
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

interface Chord {
  name: string;
  type: 'major' | 'minor' | 'diminished' | 'augmented' | 'suspended' | 'seventh' | 'major7' | 'minor7' | 'dim7' | 'aug7';
  root: string;
  bass?: string;
  capo?: number;
  fingering?: string;
  diagram?: string;
}

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
    piano: Chord[];
    guitar: Chord[];
  };
  song_structure: Record<string, string[]>;
  lyrics: string; // Rich text content
  lyrics_sections?: Array<{
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
      piano: [],
      guitar: []
    },
    song_structure: {
      intro: [],
      verse: [],
      chorus: [],
      bridge: [],
      outro: []
    },
    lyrics: '',
    lyrics_sections: []
  });

  const handleSave = () => {
    onSave(formData);
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
              <Tabs defaultValue="piano" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="piano">Piano Chords</TabsTrigger>
                  <TabsTrigger value="guitar">Guitar Chords</TabsTrigger>
                </TabsList>
                
                <TabsContent value="piano">
                  <ChordEditor
                    chords={formData.chords.piano}
                    onChordsChange={(chords) => setFormData(prev => ({
                      ...prev,
                      chords: { ...prev.chords, piano: chords }
                    }))}
                    instrument="piano"
                  />
                </TabsContent>
                
                <TabsContent value="guitar">
                  <ChordEditor
                    chords={formData.chords.guitar}
                    onChordsChange={(chords) => setFormData(prev => ({
                      ...prev,
                      chords: { ...prev.chords, guitar: chords }
                    }))}
                    instrument="guitar"
                  />
                </TabsContent>
              </Tabs>
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
                <div>
                  <Label htmlFor="lyrics">Song Lyrics</Label>
                  <RichTextEditor
                    content={formData.lyrics}
                    onChange={(content) => setFormData(prev => ({ ...prev, lyrics: content }))}
                    placeholder="Enter song lyrics with chords..."
                    className="mt-2"
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>💡 <strong>Tips:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Use the <strong>Music</strong> button to insert chord symbols like [C], [Am], [F#m7]</li>
                    <li>Format text with <strong>bold</strong>, <em>italic</em>, or <u>underline</u> for emphasis</li>
                    <li>Use alignment tools to center choruses or verses</li>
                    <li>Create lists for multiple verses or sections</li>
                  </ul>
                </div>
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
