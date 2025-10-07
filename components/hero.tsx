"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Plus, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex flex-col items-center pt-16 pb-8 px-6">
      <div className="flex items-center justify-center">
        <div className="text-center max-w-4xl">
          <Badge className="bg-primary rounded-full py-1 border-none">
            Ressources de Musique Gospel 🎵
          </Badge>
          <h1 className="mt-6 max-w-[30ch] text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
            Trouvez les Accords de Musique Gospel & Ressources
          </h1>
          <p className="mt-6 max-w-[70ch] xs:text-lg text-muted-foreground">
            Découvrez les grilles d'accords, paroles et ressources pour votre ministère d'adoration. 
            Soutenir les passionnés de musique gospel avec des collections organisées et des progressions d'accords faciles à suivre.
          </p>
          
              {/* Simple Search Bar */}
              <div className="mt-8 max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher des chansons, artistes, accords ou paroles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-base"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full text-base"
                  asChild
                >
                  <Link href="/register">
                    <Music className="mr-2 h-5 w-5" /> Parcourir les Chansons
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full text-base shadow-none"
                  asChild
                >
                  <Link href="/request-song">
                    <Plus className="mr-2 h-5 w-5" /> Demander une Chanson
                  </Link>
                </Button>
              </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
