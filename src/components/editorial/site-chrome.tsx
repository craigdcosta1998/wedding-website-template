// ABOUTME: Shared editorial navigation and sign-off for redesigned public pages
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { WEDDING_CONFIG } from '@/config/wedding';
import styles from './journal.module.css';

export function EditorialHeader() {
  const t = useTranslations('journal');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const nav = [
    { href: '/our-story', label: t('story') },
    { href: '/events', label: t('celebrations') },
    { href: '/hotels', label: t('stay') },
    { href: '/gift', label: t('gifts') },
    { href: '/rsvp', label: t('rsvp') },
  ];

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open]);

  return (
    <header className={`${styles.journal} ${styles.header}`}>
      <a href="#main-content" className={styles.skipLink}>{t('skip')}</a>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.monogram} aria-label={`${WEDDING_CONFIG.coupleNames} — ${t('home')}`} onClick={() => setOpen(false)}>
          {WEDDING_CONFIG.coupleFirstNames.partner1[0]}<span>&amp;</span>{WEDDING_CONFIG.coupleFirstNames.partner2[0]}
        </Link>
        <nav className={styles.desktopNav} aria-label={t('navigation')}>
          {nav.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
        </nav>
        <div className={styles.headerControls}>
          <button ref={menuButton} type="button" className={styles.menuButton} aria-expanded={open}
            aria-controls="journal-navigation" onClick={() => setOpen(!open)}>{open ? t('close') : t('menu')}</button>
        </div>
      </div>
      <nav id="journal-navigation" className={styles.mobileNav} aria-label={t('navigation')} hidden={!open}>
        {nav.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
      </nav>
    </header>
  );
}

export function EditorialFooter() {
  return (
    <footer className={`${styles.journal} ${styles.footer}`}>
      <p className={styles.signoff}><span lang="it">Con amore,</span><br />{WEDDING_CONFIG.coupleNames}</p>
    </footer>
  );
}
