// ABOUTME: Verify manual carousel controls and motion preference behavior
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ImgHTMLAttributes } from 'react';
import { HomepagePhotoCarousel } from './homepage-photo-carousel';

// eslint-disable-next-line @next/next/no-img-element -- Test-only mock for exercising the Next Image error callback.
vi.mock('next/image', () => ({ default: ({ src, alt, onError }: ImgHTMLAttributes<HTMLImageElement>) => <img src={String(src)} alt={alt} data-src={src} onError={onError} /> }));

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('HomepagePhotoCarousel', () => {
  it('changes photos with manual controls and provides a pause control', () => {
    render(<HomepagePhotoCarousel pendingLabel="Selected beach portrait to follow" />);
    expect(screen.getByRole('img').getAttribute('data-src')).toBe('/api/local-photo/portrait-01');
    fireEvent.click(screen.getByRole('button', { name: 'Next photograph' }));
    expect(screen.getByRole('img').getAttribute('data-src')).toBe('/api/local-photo/portrait-02');
    fireEvent.click(screen.getByRole('button', { name: 'Previous photograph' }));
    expect(screen.getByRole('img').getAttribute('data-src')).toBe('/api/local-photo/portrait-01');
    fireEvent.click(screen.getByRole('button', { name: 'Pause photograph rotation' }));
    expect(screen.getByRole('button', { name: 'Play photograph rotation' })).toBeVisible();
  });

  it('does not rotate automatically when reduced motion is requested', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(<HomepagePhotoCarousel pendingLabel="Selected beach portrait to follow" />);
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByRole('img').getAttribute('data-src')).toBe('/api/local-photo/portrait-01');
    fireEvent.click(screen.getByRole('button', { name: 'Play photograph rotation' }));
    act(() => vi.advanceTimersByTime(6500));
    expect(screen.getByRole('img').getAttribute('data-src')).toBe('/api/local-photo/portrait-02');
  });

  it('shows the labelled pending portrait when a local image cannot load', () => {
    render(<HomepagePhotoCarousel pendingLabel="Selected beach portrait to follow" />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByRole('img', { name: 'Selected beach portrait to follow' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Next photograph' }));
    expect(screen.getByRole('img').getAttribute('data-src')).toBe('/api/local-photo/portrait-02');
  });
});
