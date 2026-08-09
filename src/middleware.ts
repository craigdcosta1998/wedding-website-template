// ABOUTME: Middleware for site-wide password protection, admin auth, and locale routing
import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { shouldCheckPassword, shouldCheckAdminAuth } from './middleware-utils';
import { verifyPasswordToken } from './lib/password';
import { createMiddlewareSupabaseClient } from './lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

function getLocaleFromPath(pathname: string): string {
  const match = pathname.match(/^\/(de|en)/);
  return match ? match[1]! : 'de';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check admin auth for /admin/* paths (except /admin/login)
  if (shouldCheckAdminAuth(pathname)) {
    const { supabase, response } = createMiddlewareSupabaseClient(request);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const locale = getLocaleFromPath(pathname);
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // Check site password for all regular pages
  if (shouldCheckPassword(pathname)) {
    const sitePassword = process.env.SITE_PASSWORD;

    if (sitePassword) {
      const token = request.cookies.get('site_access')?.value;

      if (!token || !(await verifyPasswordToken(token, sitePassword))) {
        const locale = getLocaleFromPath(pathname);
        const passwordUrl = new URL(`/${locale}/password`, request.url);
        return NextResponse.redirect(passwordUrl);
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
