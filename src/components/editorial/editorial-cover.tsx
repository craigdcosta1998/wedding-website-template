// ABOUTME: Portrait Editorial Cover with oversized names crossing the photograph's lower edge
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';
import { HOMEPAGE_CONFIG } from '@/config/homepage';
import { WEDDING_CONFIG } from '@/config/wedding';
import journal from './journal.module.css';
import styles from './editorial-cover.module.css';

export async function EditorialCover({ locale }: { locale: Locale }) {
  const t = await getTranslations('journal');
  const photo = HOMEPAGE_CONFIG.heroPhoto;

  return (
    <section className={styles.hero} aria-labelledby="cover-heading">
      <div className={styles.portraitFrame}>
        <div className={styles.labels}>
          <p>{t('announcement')}</p>
          <p>{WEDDING_CONFIG.location}</p>
        </div>
        <div className={styles.portrait}>
          {photo ? (
            <Image src={photo.src} alt={photo.alt[locale]} fill priority
              sizes="(max-width: 700px) 83vw, (max-width: 1100px) 53vw, 540px"
              className={styles.photo} style={{ objectPosition: photo.objectPosition }} />
          ) : (
            <div className={styles.pendingPortrait} role="img" aria-label={t('beachPortraitPending')}>
              <span aria-hidden="true">{t('beachPortraitPending')}</span>
            </div>
          )}
        </div>
      </div>

      <h1 id="cover-heading" className={styles.names} aria-label={WEDDING_CONFIG.coupleNames}>
        <span>{WEDDING_CONFIG.coupleFirstNames.partner1}</span>
        <span className={styles.ampersand}>&amp;</span>
        <span className={styles.lastName}>{WEDDING_CONFIG.coupleFirstNames.partner2}</span>
      </h1>

      <div className={styles.details}>
        <time className={styles.date} dateTime={WEDDING_CONFIG.weddingDate.slice(0, 7)}>{WEDDING_CONFIG.weddingMonthYear}</time>
        <Link href="/rsvp" className={journal.textLink}>{t('rsvp')}<ArrowUpRight size={17} strokeWidth={1} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
