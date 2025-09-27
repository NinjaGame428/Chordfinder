import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chord Finder - Gospel Music Chords & Resources",
  description:
    "Find gospel music chords, lyrics, and resources for worship. Supporting gospel music enthusiasts with curated song collections and chord charts.",
  keywords: [
    "Gospel Music",
    "Chord Charts",
    "Worship Music",
    "Gospel Chords",
    "Christian Music",
    "Church Music",
    "Praise Songs",
    "Worship Songs",
    "Gospel Resources",
    "Music Ministry",
    "Heavenkeys Ltd",
    "Chord Finder",
  ],
  openGraph: {
    type: "website",
    siteName: "Chord Finder",
    locale: "en_US",
    url: "https://chord-finder.vercel.app",
    title: "Chord Finder - Gospel Music Chords & Resources",
    description:
      "Find gospel music chords, lyrics, and resources for worship. Supporting gospel music enthusiasts with curated song collections and chord charts.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Chord Finder Preview",
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
            <AuthProvider>
              <NotificationProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                      <TooltipProvider>
                        {children}
                      </TooltipProvider>
                    </ThemeProvider>
                  </NotificationProvider>
                </AuthProvider>
              </FavoritesProvider>
            </LanguageProvider>
      </body>
    </html>
  );
}
