// ABOUTME: Configuration for internationalization with supported locales and default locale
export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
};
