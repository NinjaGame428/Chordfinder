import { Music } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Logo = () => (
  <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg overflow-hidden">
      <Image 
        src="/android-chrome-192x192.png" 
        alt="PhinAccords Logo" 
        width={32} 
        height={32}
        className="w-full h-full object-cover"
      />
    </div>
    <span className="text-xl font-bold hidden sm:block">PhinAccords</span>
    <span className="text-lg font-bold sm:hidden">PA</span>
  </Link>
);
