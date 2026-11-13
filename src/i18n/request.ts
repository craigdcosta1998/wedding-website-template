// ABOUTME: Server-side request configuration for next-intl message loading
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, Locale, locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import('../messages/en.json')).default,
  };
});
