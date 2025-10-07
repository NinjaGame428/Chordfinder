import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, Users, Music } from "lucide-react";

const TipsSection = () => {
  const tips = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Lire les Grilles d'Accords",
      description: "Apprenez à lire les grilles d'accords efficacement. Commencez par les accords majeurs et mineurs de base, puis progressez vers des progressions plus complexes.",
      category: "Débutant"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Transposer les Chansons",
      description: "Maîtrisez l'art de transposer les chansons dans différentes tonalités. Compétence essentielle pour adapter les chansons à votre tessiture ou instrument.",
      category: "Intermédiaire"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Diriger l'Adoration",
      description: "Conseils pour diriger l'adoration efficacement. Apprenez sur le flux des chansons, les changements de tonalité et l'engagement de votre congrégation.",
      category: "Avancé"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Progressions d'Accords",
      description: "Comprenez les progressions d'accords gospel communes et comment créer des transitions fluides entre les chansons de votre set.",
      category: "Intermédiaire"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Débutant":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermédiaire":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Avancé":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <section id="tips" className="pt-20 pb-16 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl xs:text-4xl font-bold tracking-tight">
            Conseils & Ressources
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Améliorez votre ministère d'adoration avec nos conseils et ressources organisés pour la musique gospel
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
