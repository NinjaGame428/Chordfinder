import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, Users, Music } from "lucide-react";

const TipsSection = () => {
  const tips = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Reading Chord Charts",
      description: "Learn how to read chord charts effectively. Start with basic major and minor chords, then progress to more complex progressions.",
      category: "Beginner"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Transposing Songs",
      description: "Master the art of transposing songs to different keys. Essential skill for adapting songs to your vocal range or instrument.",
      category: "Intermediate"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Leading Worship",
      description: "Tips for leading worship effectively. Learn about song flow, key changes, and engaging your congregation.",
      category: "Advanced"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Chord Progressions",
      description: "Understand common gospel chord progressions and how to create smooth transitions between songs in your set.",
      category: "Intermediate"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <section id="tips" className="pt-20 pb-0 px-6 bg-muted/30 mb-[-100px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl xs:text-4xl font-bold tracking-tight">
            Tips & Resources
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Enhance your worship ministry with our curated tips and resources for gospel music
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {tip.icon}
                  </div>
                  <Badge className={getCategoryColor(tip.category)}>
                    {tip.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tip.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            More resources coming soon from Heavenkeys Ltd.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
