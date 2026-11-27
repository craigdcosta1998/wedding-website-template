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
    { href: '/events', label: t('celebrations') },
    { href: '/hotels', label: t('stay') },
    { href: '/our-story', label: t('story') },
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
    <header className={`${styles.journal} ${styles.header} ${pathname === '/' ? styles.homeHeader : ''}`}>
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
            aria-controls="journal-navigation" aria-label={open ? t('close') : t('openMenu')} onClick={() => setOpen(!open)}>
            {open ? <CloseMenuIcon /> : <SpritzMenuIcon />}
          </button>
        </div>
      </div>
      <nav id="journal-navigation" className={styles.mobileNav} aria-label={t('navigation')} hidden={!open}>
        {nav.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
      </nav>
    </header>
  );
}

function SpritzMenuIcon() {
  return (
    <svg className={styles.spritzMenuIcon} viewBox="0 0 44 36" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 4h17l-2.6 13H6.6L4 4Z" fill="#F08A35" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 10h13l-1.4 7H7.4L6 10Z" fill="#E96E25" />
      <path d="M12.5 17v10m-5 3h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17.5" cy="5.5" r="3.5" fill="#F3D581" stroke="currentColor" strokeWidth="1.25" />
      <path d="M17.5 2v7m-3.3-5 6.6 3" stroke="#7A452D" strokeWidth=".9" />
      <path d="M25 9h15M25 17h15M25 25h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg className={styles.closeMenuIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function EditorialFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className={`${styles.journal} ${styles.footer} ${home ? styles.homeFooter : ''}`}>
      <p className={styles.signoff}><span lang="it">Con amore,</span><br />{WEDDING_CONFIG.coupleNames}</p>
    </footer>
  );
}
