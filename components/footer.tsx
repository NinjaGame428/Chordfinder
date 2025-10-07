import React from 'react';
import { Music, Github, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Music className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PhinAccords</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Découvrez les accords de musique gospel, paroles et ressources pour l'adoration.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/songs" className="text-muted-foreground hover:text-primary transition-colors">Chansons</Link></li>
              <li><Link href="/chords" className="text-muted-foreground hover:text-primary transition-colors">Accords</Link></li>
              <li><Link href="/artists" className="text-muted-foreground hover:text-primary transition-colors">Artistes</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">À Propos</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources" className="text-muted-foreground hover:text-primary transition-colors">Toutes les Ressources</Link></li>
              <li><Link href="/learning" className="text-muted-foreground hover:text-primary transition-colors">Apprentissage</Link></li>
              <li><Link href="/community" className="text-muted-foreground hover:text-primary transition-colors">Communauté</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">business@heavenkeys.ca</span>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Heavenkeys Ltd.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Heavenkeys Ltd. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;