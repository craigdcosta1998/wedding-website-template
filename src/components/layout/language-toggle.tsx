// ABOUTME: Language toggle button that switches between German and English
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Locale, localeNames } from '@/i18n/config';
import { useEffect } from 'react';

const LOCALE_STORAGE_KEY = 'preferred-locale';

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'de' ? 'en' : 'de';
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    router.replace(pathname, { locale: newLocale });
  };

  const otherLocale: Locale = locale === 'de' ? 'en' : 'de';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="min-h-[44px] min-w-[44px] text-sm font-medium"
      aria-label={`Switch to ${localeNames[otherLocale]}`}
    >
      {localeNames[otherLocale]}
    </Button>
  );
}
