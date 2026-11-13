// ABOUTME: Pure utility functions for middleware routing decisions, extracted for testability

const LOCALE_PATTERN = /^\/en(?=\/|$)/;

export function getLegacyLocaleRedirect(pathname: string): string | null {
  return /^\/de(?=\/|$)/.test(pathname) ? pathname.replace(/^\/de/, '/en') : null;
}

function stripLocale(pathname: string): string {
  return pathname.replace(LOCALE_PATTERN, '') || '/';
}

export function shouldCheckPassword(pathname: string): boolean {
  const path = stripLocale(pathname);
  if (path === '/password' || path.startsWith('/password/')) return false;
  if (path === '/admin' || path.startsWith('/admin/') || path.startsWith('/admin')) return false;
  return true;
}

export function shouldCheckAdminAuth(pathname: string): boolean {
  const path = stripLocale(pathname);
  if (path === '/admin/login' || path.startsWith('/admin/login/')) return false;
  if (path === '/admin' || path.startsWith('/admin/')) return true;
  return false;
}
