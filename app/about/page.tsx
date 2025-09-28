import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Heart, Users, Award, Globe } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

const AboutPage = () => {
  const team = [
    {
      name: "Heavenkeys Ltd",
      role: "Music Ministry Solutions",
      description: "Dedicated to supporting gospel music ministries worldwide",
      image: "/team/heavenkeys.jpg"
    }
  ];

  const values = [
    {
      icon: <Music className="h-8 w-8" />,
      title: "Musical Excellence",
      description: "We believe in the power of music to connect people with God and inspire worship."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passionate Ministry",
      description: "Our mission is driven by a deep love for gospel music and worship ministry."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Support",
      description: "We're committed to building and supporting worship communities worldwide."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Resources",
      description: "We provide high-quality, accurate chord charts and worship resources."
    }
  ];

  const stats = [
    { number: "1000+", label: "Gospel Songs" },
    { number: "50+", label: "Countries Served" },
    { number: "10K+", label: "Worship Leaders" },
    { number: "5+", label: "Years Experience" }
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-0 px-6 bg-gradient-to-br from-background to-muted/20 mb-[-70px]">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              About Chord Finder
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Supporting gospel music ministries worldwide with comprehensive chord charts, 
              worship resources, and community-driven content for worship leaders and musicians.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full">
                <Music className="mr-2 h-5 w-5" />
                Explore Songs
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="pt-20 pb-0 px-6 bg-muted/30 mb-[-70px]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="pt-20 pb-0 px-6 mb-[-70px]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Chord Finder was created to support worship leaders, musicians, and gospel music 
                  enthusiasts by providing easy access to chord charts, lyrics, and worship resources. 
                  We believe that music is a powerful tool for worship and ministry.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Our platform connects worship communities worldwide, offering curated collections 
                  of gospel songs with accurate chord charts, difficulty ratings, and helpful tips 
                  for musicians of all skill levels.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full">
                    Get Started
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                  <Music className="h-32 w-32 text-primary/50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="pt-20 pb-0 px-6 bg-muted/30 mb-[-70px]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we do
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

        {/* Team Section */}
        <section className="pt-20 pb-0 px-6 mb-[-70px]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl xs:text-4xl font-bold tracking-tight mb-4">
                Powered by Heavenkeys Ltd
              </h2>
              <p className="text-lg text-muted-foreground">
                Our platform is developed and maintained by Heavenkeys Ltd, 
                a company dedicated to music ministry solutions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <Music className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground">{member.description}</p>
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
