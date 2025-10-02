"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TestDBPage() {
  const [status, setStatus] = useState<string>("Testing...");
  const [songsCount, setSongsCount] = useState<number>(0);
  const [artistsCount, setArtistsCount] = useState<number>(0);
  const [sampleSongs, setSampleSongs] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    console.log("🔍 Testing Supabase connection...");
    setStatus("Testing Supabase connection...");

    if (!supabase) {
      setError("❌ Supabase client is not initialized! Check your .env.local file.");
      setStatus("Failed");
      return;
    }

    try {
      // Test 1: Count songs
      const { data: songs, error: songsError, count } = await supabase
        .from('songs')
        .select('*', { count: 'exact' });

      if (songsError) {
        setError(`❌ Error fetching songs: ${songsError.message}`);
        console.error("Songs error:", songsError);
        setStatus("Failed");
        return;
      }

      setSongsCount(songs?.length || 0);
      console.log(`✅ Found ${songs?.length} songs`);

      // Test 2: Count artists
      const { data: artists, error: artistsError } = await supabase
        .from('artists')
        .select('*', { count: 'exact' });

      if (artistsError) {
        setError(`❌ Error fetching artists: ${artistsError.message}`);
        console.error("Artists error:", artistsError);
      } else {
        setArtistsCount(artists?.length || 0);
        console.log(`✅ Found ${artists?.length} artists`);
      }

      // Get sample songs with artists
      if (songs && songs.length > 0) {
        const sample = songs.slice(0, 5);
        const artistIds = [...new Set(sample.map((s: any) => s.artist_id))];
        
        const { data: artistsData } = await supabase
          .from('artists')
          .select('id, name')
          .in('id', artistIds);

        const artistMap = new Map(artistsData?.map((a: any) => [a.id, a.name]));
        
        const samplesWithArtists = sample.map((song: any) => ({
          ...song,
          artistName: artistMap.get(song.artist_id) || 'Unknown'
        }));

        setSampleSongs(samplesWithArtists);
      }

      setStatus("✅ Connection successful!");
    } catch (err: any) {
      setError(`❌ Unexpected error: ${err.message}`);
      console.error("Unexpected error:", err);
      setStatus("Failed");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Supabase Connection Test</h1>
        
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Status: {status}</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <strong>Songs in database:</strong> {songsCount}
            </div>
            <div>
              <strong>Artists in database:</strong> {artistsCount}
            </div>

            {sampleSongs.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Sample Songs:</h3>
                <div className="space-y-2">
                  {sampleSongs.map((song, i) => (
                    <div key={i} className="p-3 bg-gray-100 rounded">
                      <div><strong>Title:</strong> {song.title}</div>
                      <div><strong>Artist:</strong> {song.artistName}</div>
                      <div className="text-sm text-gray-600">ID: {song.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button onClick={testConnection} className="mt-6">
            Test Again
          </Button>
        </Card>

        <div className="text-sm text-gray-600">
          <p>Check the browser console (F12) for detailed logs.</p>
        </div>
      </div>
    </div>
  );
}

