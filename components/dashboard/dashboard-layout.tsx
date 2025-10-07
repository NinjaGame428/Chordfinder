"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard,
  Heart, 
  Download, 
  Settings, 
  User,
  LogOut,
  Menu,
  X,
  Music,
  FileText,
  Clock,
  Star,
  BarChart3,
  Bell,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PageLoading } from "@/components/loading";

// Lazy load components for better performance
const Navbar = dynamic(() => import("@/components/navbar").then(mod => ({ default: mod.Navbar })), {
  ssr: false,
  loading: () => <div className="h-16 bg-background/50 backdrop-blur-sm border-b" />
});

const Footer = dynamic(() => import("@/components/footer"), {
  ssr: false,
  loading: () => <div className="h-32 bg-muted/20" />
});

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your dashboard overview"
  },
  {
    name: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
    description: "Your favorite songs"
  },
  {
    name: "Downloads",
    href: "/dashboard/downloads",
    icon: Download,
    description: "Downloaded resources"
  },
  {
    name: "Activity",
    href: "/dashboard/activity",
    icon: Clock,
    description: "Your activity history"
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "Manage your profile"
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account settings"
  }
];

const quickActions = [
  {
    name: "Browse Songs",
    href: "/songs",
    icon: Music,
    description: "Explore our song collection"
  },
  {
    name: "Resources",
    href: "/resources",
    icon: FileText,
    description: "Download resources"
  },
  {
    name: "Request Song",
    href: "/request-song",
    icon: Star,
    description: "Request a new song"
  }
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Navbar />
        
        <div className="flex">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="fixed inset-0 bg-black/50" />
            </div>
          )}

          {/* Sidebar */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Dashboard</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* User Info */}
                <div className="mt-4 flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>
                      {(user.firstName || 'U')[0]}{(user.lastName || 'U')[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <nav className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Navigation
                    </div>
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                            ${isActive 
                              ? 'bg-primary text-primary-foreground' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }
                          `}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  <Separator className="my-6" />

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Quick Actions
                    </div>
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      
                      return (
                        <Link
                          key={action.name}
                          href={action.href}
                          onClick={() => setSidebarOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{action.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <Separator className="my-6" />

                  {/* User Stats */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Your Stats
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Member since</span>
                        <Badge variant="secondary" className="text-xs">
                          {new Date(user.joinDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Account status</span>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            {/* Mobile header */}
            <div className="lg:hidden bg-background border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <div className="w-8" /> {/* Spacer for centering */}
              </div>
            </div>

            {/* Page Content */}
            <div className="min-h-screen">
              {children}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};
