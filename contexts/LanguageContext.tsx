"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.songs': 'Songs',
    'nav.chords': 'Chords',
    'nav.resources': 'Resources',
    'nav.about': 'About',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.clear': 'Clear',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.download': 'Download',
    'common.share': 'Share',
    'common.favorite': 'Favorite',
    'common.rating': 'Rating',
    'common.difficulty': 'Difficulty',
    'common.key': 'Key',
    'common.tempo': 'Tempo',
    'common.artist': 'Artist',
    'common.category': 'Category',
    'common.year': 'Year',
    'common.genre': 'Genre',
    'common.tags': 'Tags',
    'common.description': 'Description',
    'common.lyrics': 'Lyrics',
    'common.chords': 'Chords',
    'common.chordChart': 'Chord Chart',
    'common.chordProgression': 'Chord Progression',
    'common.transpose': 'Transpose',
    'common.originalKey': 'Original Key',
    'common.currentKey': 'Current Key',
    'common.capo': 'Capo',
    'common.strummingPattern': 'Strumming Pattern',
    'common.timeSignature': 'Time Signature',
    
    // Song related
    'song.rateThisSong': 'Rate this song',
    'song.youRatedThis': 'You rated this',
    'song.clickToRemoveRating': 'Click to remove rating',
    'song.addComment': 'Add Comment',
    'song.hideComment': 'Hide Comment',
    'song.comment': 'Comment',
    'song.submitComment': 'Submit Comment',
    'song.recentRatings': 'Recent Ratings',
    'song.averageRating': 'Average Rating',
    'song.totalRatings': 'Total Ratings',
    'song.favoriteSongs': 'Favorite Songs',
    'song.songsYouveSaved': 'Songs you\'ve saved',
    'song.downloads': 'Downloads',
    'song.resourcesDownloaded': 'Resources downloaded',
    'song.ratingsGiven': 'Ratings Given',
    'song.songsYouveRated': 'Songs you\'ve rated',
    'song.memberSince': 'Member Since',
    'song.daysAgo': 'days ago',
    
    // Chords
    'chord.guitar': 'Guitar',
    'chord.piano': 'Piano',
    'chord.bass': 'Bass',
    'chord.allKeys': 'All Keys',
    'chord.allLevels': 'All Levels',
    'chord.easy': 'Easy',
    'chord.medium': 'Medium',
    'chord.hard': 'Hard',
    'chord.commonUses': 'Common Uses',
    'chord.alsoKnownAs': 'Also Known As',
    'chord.handPositionGuide': 'Hand Position Guide',
    'chord.techniqueTips': 'Technique Tips',
    'chord.practice': 'Practice',
    'chord.finger': 'Finger',
    'chord.pianoTechnique': 'Keep your fingers curved, press keys firmly but not tensely, and maintain a relaxed wrist position.',
    
    // French chord names
    'chord.C': 'Do',
    'chord.C#': 'Do#',
    'chord.Db': 'Ré♭',
    'chord.D': 'Ré',
    'chord.D#': 'Ré#',
    'chord.Eb': 'Mi♭',
    'chord.E': 'Mi',
    'chord.F': 'Fa',
    'chord.F#': 'Fa#',
    'chord.Gb': 'Sol♭',
    'chord.G': 'Sol',
    'chord.G#': 'Sol#',
    'chord.Ab': 'La♭',
    'chord.A': 'La',
    'chord.A#': 'La#',
    'chord.Bb': 'Si♭',
    'chord.B': 'Si',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.songs': 'Chansons',
    'nav.chords': 'Accords',
    'nav.resources': 'Ressources',
    'nav.about': 'À propos',
    'nav.admin': 'Admin',
    'nav.login': 'Connexion',
    'nav.register': 'S\'inscrire',
    'nav.dashboard': 'Tableau de bord',
    'nav.logout': 'Déconnexion',
    
    // Common
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.clear': 'Effacer',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.view': 'Voir',
    'common.download': 'Télécharger',
    'common.share': 'Partager',
    'common.favorite': 'Favori',
    'common.rating': 'Note',
    'common.difficulty': 'Difficulté',
    'common.key': 'Tonalité',
    'common.tempo': 'Tempo',
    'common.artist': 'Artiste',
    'common.category': 'Catégorie',
    'common.year': 'Année',
    'common.genre': 'Genre',
    'common.tags': 'Étiquettes',
    'common.description': 'Description',
    'common.lyrics': 'Paroles',
    'common.chords': 'Accords',
    'common.chordChart': 'Grille d\'accords',
    'common.chordProgression': 'Progression d\'accords',
    'common.transpose': 'Transposer',
    'common.originalKey': 'Tonalité originale',
    'common.currentKey': 'Tonalité actuelle',
    'common.capo': 'Capodastre',
    'common.strummingPattern': 'Motif de grattage',
    'common.timeSignature': 'Signature rythmique',
    
    // Song related
    'song.rateThisSong': 'Noter cette chanson',
    'song.youRatedThis': 'Vous avez noté cette chanson',
    'song.clickToRemoveRating': 'Cliquez pour supprimer la note',
    'song.addComment': 'Ajouter un commentaire',
    'song.hideComment': 'Masquer le commentaire',
    'song.comment': 'Commentaire',
    'song.submitComment': 'Soumettre le commentaire',
    'song.recentRatings': 'Notes récentes',
    'song.averageRating': 'Note moyenne',
    'song.totalRatings': 'Total des notes',
    'song.favoriteSongs': 'Chansons favorites',
    'song.songsYouveSaved': 'Chansons que vous avez sauvegardées',
    'song.downloads': 'Téléchargements',
    'song.resourcesDownloaded': 'Ressources téléchargées',
    'song.ratingsGiven': 'Notes données',
    'song.songsYouveRated': 'Chansons que vous avez notées',
    'song.memberSince': 'Membre depuis',
    'song.daysAgo': 'jours',
    
    // Chords
    'chord.guitar': 'Guitare',
    'chord.piano': 'Piano',
    'chord.bass': 'Basse',
    'chord.allKeys': 'Toutes les tonalités',
    'chord.allLevels': 'Tous les niveaux',
    'chord.easy': 'Facile',
    'chord.medium': 'Moyen',
    'chord.hard': 'Difficile',
    'chord.commonUses': 'Utilisations courantes',
    'chord.alsoKnownAs': 'Aussi connu sous le nom de',
    'chord.handPositionGuide': 'Guide de position des mains',
    'chord.techniqueTips': 'Conseils techniques',
    'chord.practice': 'Pratique',
    'chord.finger': 'Doigt',
    'chord.pianoTechnique': 'Gardez vos doigts courbés, appuyez fermement mais sans tension, et maintenez une position de poignet détendue.',
    
    // French chord names
    'chord.C': 'Do',
    'chord.C#': 'Do#',
    'chord.Db': 'Ré♭',
    'chord.D': 'Ré',
    'chord.D#': 'Ré#',
    'chord.Eb': 'Mi♭',
    'chord.E': 'Mi',
    'chord.F': 'Fa',
    'chord.F#': 'Fa#',
    'chord.Gb': 'Sol♭',
    'chord.G': 'Sol',
    'chord.G#': 'Sol#',
    'chord.Ab': 'La♭',
    'chord.A': 'La',
    'chord.A#': 'La#',
    'chord.Bb': 'Si♭',
    'chord.B': 'Si',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as 'en' | 'fr';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}