import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Music } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Music className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-4xl font-bold">404 - Page Not Found</CardTitle>
              <CardDescription className="text-xl">
                The page you're looking for doesn't exist or has been moved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Don't worry, even the best musicians hit a wrong note sometimes. 
                Let's get you back to the music!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/songs">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Songs
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-3">Popular Pages</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Link href="/songs" className="text-sm text-muted-foreground hover:text-primary">
                    Songs
                  </Link>
                  <Link href="/chords" className="text-sm text-muted-foreground hover:text-primary">
                    Chords
                  </Link>
                  <Link href="/artists" className="text-sm text-muted-foreground hover:text-primary">
                    Artists
                  </Link>
                  <Link href="/resources" className="text-sm text-muted-foreground hover:text-primary">
                    Resources
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
