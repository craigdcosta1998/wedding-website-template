// ABOUTME: Main header component with navigation and language toggle
'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LanguageToggle } from './language-toggle';
import { WEDDING_CONFIG } from '@/config/wedding';

const logoInitials = `${WEDDING_CONFIG.coupleFirstNames.partner1[0]} & ${WEDDING_CONFIG.coupleFirstNames.partner2[0]}`;

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { href: string; label: string; disabled?: boolean }[] = [
    { href: '/', label: t('home') },
    { href: '/rsvp', label: t('rsvp') },
    { href: '/events', label: t('events') },
    { href: '/our-story', label: t('ourStory') },
    { href: '/gift', label: t('gift') },
    { href: '/hotels', label: t('accommodation') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transparent-header">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="handwritten text-2xl font-semibold text-primary">
          {logoInitials}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            item.disabled ? (
              <span
                key={item.label}
                className="text-sm font-medium text-muted-foreground/40 cursor-default relative group"
                title="Coming soon"
              >
                {item.label}
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Coming soon
                </span>
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
          <LanguageToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="min-h-[44px] min-w-[44px]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t md:hidden">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navItems.map((item) => (
              item.disabled ? (
                <span
                  key={item.label}
                  className="block py-2 text-base font-medium text-muted-foreground/40 min-h-[44px] flex items-center gap-2"
                >
                  {item.label}
                  <span className="text-[10px] text-muted-foreground/50">Coming soon</span>
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors min-h-[44px] flex items-center ${
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
