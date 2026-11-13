// ABOUTME: Replaceable homepage portrait; null deliberately renders a labelled placeholder
import type { Locale } from '@/i18n/config';

interface HeroPhoto {
  src: string;
  alt: Record<Locale, string>;
  objectPosition: string;
}

export const HOMEPAGE_CONFIG: { heroPhoto: HeroPhoto | null } = {
  // Add the approved couple photograph under public/ and set src, English alt text, and crop here.
  heroPhoto: null,
};
