"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import LanguageSwitcher from "../language-switcher";
import { UserMenu } from "./user-menu";
import { NotificationsIcon } from "../notifications-icon";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import Link from "next/link";

const Navbar = () => {
  const { user, isLoading } = useAuth();

  return (
    <nav className="fixed z-10 top-6 inset-x-4 h-14 xs:h-16 bg-background/50 backdrop-blur-sm border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <NotificationsIcon />
          
          {isLoading ? (
            <div className="w-8 h-8 animate-pulse bg-muted rounded-full" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button variant="outline" className="hidden sm:inline-flex rounded-full" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="hidden xs:inline-flex rounded-full" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
