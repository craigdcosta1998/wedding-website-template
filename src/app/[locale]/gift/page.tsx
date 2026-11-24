// ABOUTME: Editorial gift-information page with an honest pending state
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { WEDDING_CONFIG } from '@/config/wedding';
import journal from '@/components/editorial/journal.module.css';
import styles from '@/components/editorial/gift.module.css';

interface GiftPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GiftPage({ params }: GiftPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('gift');

  return (
    <div className={`${journal.journal} ${styles.shell}`}>
      <div className={`${journal.page} ${styles.page}`}>
        <header className={styles.heading}>
          <p className={styles.overline}>{WEDDING_CONFIG.location}</p>
          <h1>{t('title')}</h1>
        </header>
        <section className={styles.note} aria-labelledby="gift-pending-title">
          <p className={styles.index}>A NOTE / TO FOLLOW</p>
          <div>
            <h2 id="gift-pending-title">{t('pendingTitle')}</h2>
            <p>{t('pending')}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
