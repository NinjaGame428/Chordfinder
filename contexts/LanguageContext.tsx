"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.songs': 'Songs',
    'nav.artists': 'Artists',
    'nav.tips': 'Tips',
    'nav.about': 'About',
    'nav.resources': 'Resources',
    'nav.request_song': 'Request Song',
    'nav.sign_in': 'Sign In',
    'nav.get_started': 'Get Started',
    
    // Homepage
    'home.title': 'Find Gospel Music Chords & Resources',
    'home.subtitle': 'Discover chord charts, lyrics, and resources for your worship ministry. Supporting gospel music enthusiasts with curated collections and easy-to-follow chord progressions.',
    'home.search_placeholder': 'Search for songs, artists, or chords...',
    'home.browse_songs': 'Browse Songs',
    'home.request_song': 'Request Song',
    'home.tips_resources': 'Tips & Resources',
    
    // Songs
    'songs.title': 'Gospel Songs Collection',
    'songs.subtitle': 'Discover thousands of gospel songs with chord charts, lyrics, and resources for your worship ministry',
    'songs.search_placeholder': 'Search for songs, artists, or chords...',
    'songs.all_songs': 'All Songs',
    'songs.classic_hymn': 'Classic Hymn',
    'songs.contemporary': 'Contemporary',
    'songs.modern_hymn': 'Modern Hymn',
    'songs.view_chords': 'View Chords',
    'songs.load_more': 'Load More Songs',
    'songs.no_results': 'No songs found',
    'songs.clear_filters': 'Clear Filters',
    
    // Artists
    'artists.title': 'Gospel Artists',
    'artists.subtitle': 'Discover gospel artists from around the world. Explore their music, learn about their journey, and find chord charts for their most popular songs.',
    'artists.search_placeholder': 'Search artists, genres, or countries...',
    'artists.view_songs': 'View Songs',
    'artists.no_results': 'No artists found',
    'artists.clear_search': 'Clear Search',
    
    // Request Song
    'request.title': 'Request a New Song',
    'request.subtitle': 'Can\'t find a gospel song you\'re looking for? Request it and we\'ll add it to our collection with chord charts and resources.',
    'request.song_title': 'Song Title',
    'request.artist': 'Artist',
    'request.key': 'Key',
    'request.difficulty': 'Difficulty',
    'request.category': 'Category',
    'request.description': 'Additional Notes',
    'request.your_name': 'Your Name',
    'request.email': 'Email',
    'request.submit': 'Submit Request',
    'request.submitting': 'Submitting Request...',
    'request.success_title': 'Request Submitted!',
    'request.success_message': 'Thank you for your song request. We\'ll review it and add it to our collection if it meets our criteria.',
    'request.submit_another': 'Submit Another Request',
    'request.back_home': 'Back to Home',
    
    // Common
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.easy': 'Easy',
    'common.medium': 'Medium',
    'common.hard': 'Hard',
    'common.free': 'Free',
    'common.download': 'Download',
    'common.view_more': 'View More',
    'common.close': 'Close',
  },
  fr: {
    // Navigation
    'nav.songs': 'Chansons',
    'nav.artists': 'Artistes',
    'nav.tips': 'Conseils',
    'nav.about': 'À propos',
    'nav.resources': 'Ressources',
    'nav.request_song': 'Demander une chanson',
    'nav.sign_in': 'Se connecter',
    'nav.get_started': 'Commencer',
    
    // Homepage
    'home.title': 'Trouvez des accords de musique gospel et des ressources',
    'home.subtitle': 'Découvrez des grilles d\'accords, des paroles et des ressources pour votre ministère de louange. Soutenir les passionnés de musique gospel avec des collections organisées et des progressions d\'accords faciles à suivre.',
    'home.search_placeholder': 'Rechercher des chansons, des artistes ou des accords...',
    'home.browse_songs': 'Parcourir les chansons',
    'home.request_song': 'Demander une chanson',
    'home.tips_resources': 'Conseils et ressources',
    
    // Songs
    'songs.title': 'Collection de chansons gospel',
    'songs.subtitle': 'Découvrez des milliers de chansons gospel avec des grilles d\'accords, des paroles et des ressources pour votre ministère de louange',
    'songs.search_placeholder': 'Rechercher des chansons, des artistes ou des accords...',
    'songs.all_songs': 'Toutes les chansons',
    'songs.classic_hymn': 'Hymne classique',
    'songs.contemporary': 'Contemporain',
    'songs.modern_hymn': 'Hymne moderne',
    'songs.view_chords': 'Voir les accords',
    'songs.load_more': 'Charger plus de chansons',
    'songs.no_results': 'Aucune chanson trouvée',
    'songs.clear_filters': 'Effacer les filtres',
    
    // Artists
    'artists.title': 'Artistes gospel',
    'artists.subtitle': 'Découvrez des artistes gospel du monde entier. Explorez leur musique, apprenez-en plus sur leur parcours et trouvez des grilles d\'accords pour leurs chansons les plus populaires.',
    'artists.search_placeholder': 'Rechercher des artistes, des genres ou des pays...',
    'artists.view_songs': 'Voir les chansons',
    'artists.no_results': 'Aucun artiste trouvé',
    'artists.clear_search': 'Effacer la recherche',
    
    // Request Song
    'request.title': 'Demander une nouvelle chanson',
    'request.subtitle': 'Vous ne trouvez pas une chanson gospel que vous cherchez ? Demandez-la et nous l\'ajouterons à notre collection avec des grilles d\'accords et des ressources.',
    'request.song_title': 'Titre de la chanson',
    'request.artist': 'Artiste',
    'request.key': 'Tonalité',
    'request.difficulty': 'Difficulté',
    'request.category': 'Catégorie',
    'request.description': 'Notes supplémentaires',
    'request.your_name': 'Votre nom',
    'request.email': 'Email',
    'request.submit': 'Soumettre la demande',
    'request.submitting': 'Soumission en cours...',
    'request.success_title': 'Demande soumise !',
    'request.success_message': 'Merci pour votre demande de chanson. Nous l\'examinerons et l\'ajouterons à notre collection si elle répond à nos critères.',
    'request.submit_another': 'Soumettre une autre demande',
    'request.back_home': 'Retour à l\'accueil',
    
    // Common
    'common.search': 'Rechercher',
    'common.loading': 'Chargement...',
    'common.easy': 'Facile',
    'common.medium': 'Moyen',
    'common.hard': 'Difficile',
    'common.free': 'Gratuit',
    'common.download': 'Télécharger',
    'common.view_more': 'Voir plus',
    'common.close': 'Fermer',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('chord-finder-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('chord-finder-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
