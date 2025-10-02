import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PerformanceOptimizer } from "@/components/performance-optimizer";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhinAccords - Accords de Musique Gospel et Ressources",
  description:
    "Trouvez des accords de musique gospel, des paroles et des ressources pour le culte. Soutenir les passionnés de musique gospel avec des collections de chansons et des grilles d'accords.",
  keywords: [
    "Musique Gospel",
    "Grilles d'Accords",
    "Musique de Louange",
    "Accords Gospel",
    "Musique Chrétienne",
    "Musique d'Église",
    "Chants de Louange",
    "Chansons de Culte",
    "Ressources Gospel",
    "Ministère Musical",
    "PhinAccords",
  ],
  openGraph: {
    type: "website",
    siteName: "PhinAccords",
    locale: "fr_FR",
    url: "https://heavenkeys-chords-finder-ofisx6lin-jackmichaels-projects.vercel.app",
    title: "PhinAccords - Accords de Musique Gospel et Ressources",
    description:
      "Trouvez des accords de musique gospel, des paroles et des ressources pour le culte. Soutenir les passionnés de musique gospel avec des collections de chansons et des grilles d'accords.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PhinAccords Preview",
      },
    ],
  },
  authors: [
    {
      name: "Heavenkeys Ltd",
      url: "https://heavenkeys.ca",
    },
  ],
  creator: "Heavenkeys Ltd",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-16x16.png",
      sizes: "16x16",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
    },
  ],
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <LanguageProvider>
          <FavoritesProvider>
            <NotificationProvider>
              <AuthProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                  <TooltipProvider>
                    <PerformanceOptimizer />
                    {children}
                  </TooltipProvider>
                </ThemeProvider>
              </AuthProvider>
            </NotificationProvider>
          </FavoritesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
