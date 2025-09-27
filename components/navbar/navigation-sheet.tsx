import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center py-4 border-b">
            <Logo />
          </div>
          <div className="flex-1 py-6">
            <NavMenu orientation="vertical" className="space-y-2" />
          </div>
          
          <div className="mt-auto pt-4 border-t space-y-4">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
            <Button className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
