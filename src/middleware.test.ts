// ABOUTME: Tests for middleware password protection and admin auth routing logic
import { describe, it, expect } from 'vitest';
import { shouldCheckPassword, shouldCheckAdminAuth } from './middleware-utils';

describe('shouldCheckPassword', () => {
  it('skips password page', () => {
    expect(shouldCheckPassword('/de/password')).toBe(false);
    expect(shouldCheckPassword('/en/password')).toBe(false);
  });

  it('skips admin paths (admin has its own auth)', () => {
    expect(shouldCheckPassword('/de/admin')).toBe(false);
    expect(shouldCheckPassword('/en/admin/login')).toBe(false);
    expect(shouldCheckPassword('/de/admin/anything')).toBe(false);
  });

  it('requires password for regular pages', () => {
    expect(shouldCheckPassword('/de')).toBe(true);
    expect(shouldCheckPassword('/en')).toBe(true);
    expect(shouldCheckPassword('/de/rsvp')).toBe(true);
    expect(shouldCheckPassword('/en/events')).toBe(true);
    expect(shouldCheckPassword('/de/travel')).toBe(true);
  });
});

describe('shouldCheckAdminAuth', () => {
  it('checks auth for admin pages', () => {
    expect(shouldCheckAdminAuth('/de/admin')).toBe(true);
    expect(shouldCheckAdminAuth('/en/admin')).toBe(true);
    expect(shouldCheckAdminAuth('/de/admin/something')).toBe(true);
  });

  it('skips admin login page', () => {
    expect(shouldCheckAdminAuth('/de/admin/login')).toBe(false);
    expect(shouldCheckAdminAuth('/en/admin/login')).toBe(false);
  });

  it('skips non-admin pages', () => {
    expect(shouldCheckAdminAuth('/de')).toBe(false);
    expect(shouldCheckAdminAuth('/en/rsvp')).toBe(false);
    expect(shouldCheckAdminAuth('/de/password')).toBe(false);
  });
});
