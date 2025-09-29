import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "./user-menu";
import LanguageSwitcher from "../language-switcher";
import Link from "next/link";

export const NavigationSheet = () => {
  const { user, isLoading } = useAuth();

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
            <div className="flex justify-center mb-4">
              <LanguageSwitcher />
            </div>
            
            {isLoading ? (
              <div className="w-full h-10 animate-pulse bg-muted rounded-full" />
            ) : user ? (
              <div className="space-y-2">
                <div className="text-center py-2">
                  <span className="text-sm text-muted-foreground">Welcome back, {user.firstName || user.email}</span>
                </div>
                <UserMenu user={user} />
              </div>
            ) : (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
