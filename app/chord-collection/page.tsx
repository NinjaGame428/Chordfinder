import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';
import { ChordCollectionManager } from '@/components/ChordCollectionManager';
import denaMwanaChords from '@/lib/dena-mwana-chords.json';

const ChordCollectionPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Dena Mwana Chord Collection</h1>
            <p className="text-lg text-muted-foreground">
              Complete collection of piano and guitar chord progressions for Dena Mwana songs
            </p>
          </div>
          <ChordCollectionManager collectionData={denaMwanaChords} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ChordCollectionPage;
