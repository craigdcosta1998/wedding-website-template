// ABOUTME: Tests for utility functions
import { describe, it, expect, vi, afterEach } from 'vitest';
import { cn, getSiteUrl } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
});

describe('getSiteUrl', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllEnvs();
  });

  it('returns NEXT_PUBLIC_SITE_URL when set', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://wedding.example.com');
    vi.stubEnv('VERCEL_URL', '');
    expect(getSiteUrl()).toBe('https://wedding.example.com');
  });

  it('falls back to VERCEL_URL with https', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_URL', 'my-app.vercel.app');
    expect(getSiteUrl()).toBe('https://my-app.vercel.app');
  });

  it('falls back to localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_URL', '');
    expect(getSiteUrl()).toBe('http://localhost:3000');
  });
});
