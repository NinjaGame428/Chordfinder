import { Music } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
      <Music className="h-5 w-5 text-primary-foreground" />
    </div>
    <span className="text-xl font-bold hidden sm:block">Chords Finder</span>
    <span className="text-lg font-bold sm:hidden">CF</span>
  </Link>
);
