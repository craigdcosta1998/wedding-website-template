// ABOUTME: Configuration for internationalization with supported locales and default locale
export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
