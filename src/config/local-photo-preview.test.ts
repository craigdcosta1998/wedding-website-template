// ABOUTME: Keep local photo preview identifiers closed and traversal-safe
import { describe, expect, it } from 'vitest';
import { getLocalPhotoFilename, isLoopbackHost, LOCAL_HERO_PHOTO, LOCAL_PHOTO_PREVIEW } from './local-photo-preview';

describe('local photo preview allowlist', () => {
  it('contains exactly five fixed JPEGs with no filesystem paths', () => {
    expect(LOCAL_PHOTO_PREVIEW).toHaveLength(5);
    for (const photo of LOCAL_PHOTO_PREVIEW) {
      expect(getLocalPhotoFilename(photo.id)).toBe(photo.file);
      expect(photo.file).not.toMatch(/[\\/]/);
    }
  });

  it('keeps the hero photograph separate from the five-photo carousel', () => {
    expect(getLocalPhotoFilename(LOCAL_HERO_PHOTO.id)).toBe('beach_proposal_standing.JPG');
    expect(LOCAL_HERO_PHOTO.file).not.toMatch(/[\\/]/);
  });

  it.each(['..', '../.env.local', 'portrait-01/../../.env.local', 'unknown'])('rejects unknown identifier %s', (id) => {
    expect(getLocalPhotoFilename(id)).toBeNull();
  });

  it.each(['localhost:3000', '127.0.0.1:3000', '[::1]:3000'])('accepts loopback host %s', (host) => {
    expect(isLoopbackHost(host)).toBe(true);
  });

  it.each(['example.com', '192.168.1.4:3000', 'localhost.example.com', null])('rejects non-loopback host %s', (host) => {
    expect(isLoopbackHost(host)).toBe(false);
  });
});
