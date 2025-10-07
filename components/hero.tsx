"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Plus, MessageCircle } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import EnhancedSearch from "./enhanced-search";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center pt-[70px] pb-16 px-6">
      <div className="md:mt-6 flex items-center justify-center">
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
          
              {/* Enhanced Search Bar */}
              <div className="mt-12 max-w-2xl mx-auto">
                <EnhancedSearch
                  placeholder="Rechercher des chansons, artistes, accords ou paroles..."
                  onSearch={(query) => setSearchQuery(query)}
                  onResultSelect={(result) => {
                    console.log("Selected result:", result);
                    // Handle result selection - could navigate to song page
                  }}
                  showFilters={true}
                  showSort={true}
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
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
