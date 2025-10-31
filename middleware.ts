import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getEnglishRoute } from './lib/url-translations';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and Next.js internals
  // This MUST come first to prevent blocking CSS, JS, images, fonts, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    // Exclude file extensions (CSS, JS, images, fonts, etc.)
    /\.(css|js|jsx|ts|tsx|json|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|otf|mp4|webm|pdf)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Handle language-prefixed URLs (/en/... or /fr/...)
  const pathParts = pathname.split('/').filter(Boolean);
  const langPrefix = pathParts[0];
  
  if (langPrefix === 'fr' || langPrefix === 'en') {
    // Remove language prefix to get the route
    const routeWithoutLang = '/' + pathParts.slice(1).join('/') || '/';
    
    // If French, translate French routes to English routes
    let englishRoute = routeWithoutLang;
    if (langPrefix === 'fr') {
      englishRoute = getEnglishRoute(pathname);
    }
    
    // Rewrite to the actual route (internal routes are in English)
    const url = request.nextUrl.clone();
    url.pathname = englishRoute;
    
    // Set language cookie
    const response = NextResponse.rewrite(url);
    response.cookies.set('language', langPrefix, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // 1 year
    
    // Also set query param for client-side access
    url.searchParams.set('lang', langPrefix);
    
    return response;
  }

  // For non-prefixed routes, detect language and redirect to prefixed version
  // Get language from cookie or default to 'en'
  const language = request.cookies.get('language')?.value || 'en';
  
  // Get the translated route for the redirect
  const routeTranslations: { [key: string]: { en: string; fr: string } } = {
    '/login': { en: '/login', fr: '/connexion' },
    '/register': { en: '/register', fr: '/inscription' },
    '/songs': { en: '/songs', fr: '/chansons' },
    '/piano-chords': { en: '/piano-chords', fr: '/accords-piano' },
    '/artists': { en: '/artists', fr: '/artistes' },
    '/about': { en: '/about', fr: '/a-propos' },
    '/resources': { en: '/resources', fr: '/ressources' },
    '/contact': { en: '/contact', fr: '/contact' },
    '/dashboard': { en: '/dashboard', fr: '/tableau-de-bord' },
  };
  
  // Handle dynamic routes
  if (pathname.startsWith('/songs/')) {
    const slug = pathname.replace('/songs/', '');
    const translated = language === 'fr' ? `/chansons/${slug}` : `/songs/${slug}`;
    const url = request.nextUrl.clone();
    url.pathname = `/${language}${translated}`;
    const response = NextResponse.redirect(url);
    response.cookies.set('language', language, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }
  
  if (pathname.startsWith('/artists/')) {
    const id = pathname.replace('/artists/', '');
    const translated = language === 'fr' ? `/artistes/${id}` : `/artists/${id}`;
    const url = request.nextUrl.clone();
    url.pathname = `/${language}${translated}`;
    const response = NextResponse.redirect(url);
    response.cookies.set('language', language, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }
  
  // Check if we need to translate the route
  let translatedPath = pathname;
  if (language === 'fr' && routeTranslations[pathname]) {
    translatedPath = routeTranslations[pathname].fr;
  }
  
  // Redirect to language-prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${language}${translatedPath === '/' ? '' : translatedPath}`;
  
  // Set language cookie
  const response = NextResponse.redirect(url);
  response.cookies.set('language', language, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes)
     * - dashboard (dashboard routes)
     * - Files with extensions (css, js, images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin|dashboard|.*\\.css|.*\\.js|.*\\.jsx|.*\\.ts|.*\\.tsx|.*\\.json|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.woff|.*\\.woff2|.*\\.ttf|.*\\.eot|.*\\.otf|.*\\.mp4|.*\\.webm|.*\\.pdf).*)',
  ],
};
