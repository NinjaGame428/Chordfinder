"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Heart, Users, Award, Globe } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslatedRoute } from "@/lib/url-translations";

const AboutPage = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: <Music className="h-8 w-8" />,
      title: t('about.musicalExcellence'),
      description: t('about.musicalExcellenceDesc')
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: t('about.passionateMinistry'),
      description: t('about.passionateMinistryDesc')
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('about.communitySupport'),
      description: t('about.communitySupportDesc')
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: t('about.qualityResources'),
      description: t('about.qualityResourcesDesc')
    }
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-6 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              {t('about.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              {t('about.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full" asChild>
                <Link href={getTranslatedRoute('/songs', language)}>
                  <Music className="mr-2 h-5 w-5" />
                  {t('about.exploreSongs')}
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link href={getTranslatedRoute('/contact', language)}>
                  <Users className="mr-2 h-5 w-5" />
                  {t('about.joinCommunity')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="pt-12 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-6">
                  {t('about.missionTitle')}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {t('about.missionText1')}
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  {t('about.missionText2')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full" asChild>
                    <Link href={getTranslatedRoute('/register', language)}>
                      {t('about.getStarted')}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl overflow-hidden">
                  <Image
                    src="/bible.jpg"
                    alt="Bible"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="flex items-center justify-center h-full"><Music class="h-32 w-32 text-primary/50" /></div>';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="pt-12 pb-12 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-4">
                {t('about.valuesTitle')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('about.valuesSubtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
