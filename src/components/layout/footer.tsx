// ABOUTME: Footer component with contact info and copyright
'use client';

import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { WEDDING_CONFIG } from '@/config/wedding';
import { usePathname } from '@/i18n/routing';
import { EditorialFooter } from '@/components/editorial/site-chrome';

export function Footer() {
  const t = useTranslations('footer');
  const pathname = usePathname();

  if (pathname === '/' || pathname === '/our-story' || pathname === '/events' || pathname === '/hotels') return <EditorialFooter />;

  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
          <p>
            {t('questions')}{' '}
            <a
              href={`mailto:${WEDDING_CONFIG.contactEmail}`}
              className="text-primary hover:underline"
            >
              {WEDDING_CONFIG.contactEmail}
            </a>
          </p>
          <p className="flex items-center gap-1">
            {t('madeWith')} <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
