// ABOUTME: Tests for middleware password protection and admin auth routing logic
import { describe, it, expect } from 'vitest';
import { getLegacyLocaleRedirect, shouldCheckPassword, shouldCheckAdminAuth } from './middleware-utils';

describe('shouldCheckPassword', () => {
  it('skips password page', () => {
    expect(shouldCheckPassword('/password')).toBe(false);
    expect(shouldCheckPassword('/en/password')).toBe(false);
  });

  it('skips admin paths (admin has its own auth)', () => {
    expect(shouldCheckPassword('/admin')).toBe(false);
    expect(shouldCheckPassword('/en/admin/login')).toBe(false);
    expect(shouldCheckPassword('/en/admin/anything')).toBe(false);
  });

  it('requires password for regular pages', () => {
    expect(shouldCheckPassword('/')).toBe(true);
    expect(shouldCheckPassword('/en')).toBe(true);
    expect(shouldCheckPassword('/rsvp')).toBe(true);
    expect(shouldCheckPassword('/en/events')).toBe(true);
    expect(shouldCheckPassword('/en/travel')).toBe(true);
  });
});

describe('shouldCheckAdminAuth', () => {
  it('checks auth for admin pages', () => {
    expect(shouldCheckAdminAuth('/admin')).toBe(true);
    expect(shouldCheckAdminAuth('/en/admin')).toBe(true);
    expect(shouldCheckAdminAuth('/en/admin/something')).toBe(true);
  });

  it('skips admin login page', () => {
    expect(shouldCheckAdminAuth('/admin/login')).toBe(false);
    expect(shouldCheckAdminAuth('/en/admin/login')).toBe(false);
  });

  it('skips non-admin pages', () => {
    expect(shouldCheckAdminAuth('/')).toBe(false);
    expect(shouldCheckAdminAuth('/en/rsvp')).toBe(false);
    expect(shouldCheckAdminAuth('/password')).toBe(false);
  });
});

describe('getLegacyLocaleRedirect', () => {
  it.each([
    ['/de', '/en'],
    ['/de/', '/en/'],
    ['/de/our-story', '/en/our-story'],
    ['/de/rsvp', '/en/rsvp'],
    ['/de/admin/login', '/en/admin/login'],
    ['/de/admin/seating', '/en/admin/seating'],
  ])('redirects %s to the matching English page', (path, expected) => {
    expect(getLegacyLocaleRedirect(path)).toBe(expected);
  });

  it.each(['/', '/en', '/en/rsvp', '/design', '/deutsch', '/de-admin'])('leaves %s unchanged', (path) => {
    expect(getLegacyLocaleRedirect(path)).toBeNull();
  });
});
