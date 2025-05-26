import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { defaultLocale, locales, type Locale } from '@/config';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  // First, check if user has a preferred locale in cookies
  const preferredLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (preferredLocale && locales.includes(preferredLocale as Locale)) {
    return preferredLocale;
  }

  // Fall back to browser language detection
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    const locale = matchLocale(languages, locales, defaultLocale);
    return locale;
  } catch {
    return 'en'; // Fallback to English if detection fails
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request) || defaultLocale;
    const response = NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );

    // Set the locale cookie to remember user's choice
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  }

  // If we have a locale in the path, update the cookie to remember this choice
  const currentLocale = pathname.split('/')[1];
  if (locales.includes(currentLocale as Locale)) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', currentLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return response;
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
