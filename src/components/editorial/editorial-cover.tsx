// ABOUTME: Portrait Editorial Cover with oversized names crossing the photograph's lower edge
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { WEDDING_CONFIG } from '@/config/wedding';
import Image from 'next/image';
import { LOCAL_PHOTO_PREVIEW } from '@/config/local-photo-preview';
import styles from './editorial-cover.module.css';

export async function EditorialCover() {
  const t = await getTranslations('journal');
  return (
    <section className={styles.hero} aria-labelledby="cover-heading">
      <div className={styles.portraitFrame}>
        <div className={styles.portrait}>
          {process.env.NODE_ENV === 'development' ? <Image
            src={`/api/local-photo/${LOCAL_PHOTO_PREVIEW[1].id}`}
            alt="A personal photograph from Talia and Craig's collection"
            width={1092}
            height={1365}
            priority
            unoptimized
            sizes="(max-width: 700px) 88vw, (max-width: 1100px) 53vw, 540px"
            className={styles.photo}
          /> : (
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
        <p className={styles.sentiment}>{t('sentiment')}</p>
        <p className={styles.date}>{WEDDING_CONFIG.location} · {WEDDING_CONFIG.weddingMonthYear}</p>
        <Link href="/rsvp" className={styles.rsvp}>{t('rsvp')}</Link>
      </div>
    </section>
  );
}
