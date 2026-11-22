// ABOUTME: Editorial accommodation guide containing only approved recommendations and honest pending states
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { STAY_AREAS, STAY_CONTENT } from '@/config/stay';
import { WEDDING_CONFIG } from '@/config/wedding';
import journal from '@/components/editorial/journal.module.css';
import styles from '@/components/editorial/stay.module.css';

interface HotelsPageProps {
  params: Promise<{ locale: string }>;
}

function getBookingUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export default async function HotelsPage({ params }: HotelsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('accommodation');

  return (
    <div className={journal.journal}>
      <div className={journal.page}>
        <header className={styles.hero}>
          <div>
            <p className={styles.overline}>{WEDDING_CONFIG.location}</p>
            <h1 className={styles.title}>{t('title')}</h1>
          </div>
          <div className={styles.introduction}>
            <p className={styles.invitation}>A place to settle in, between the celebrations.</p>
            <p>{t('subtitle')}</p>
          </div>
        </header>

        <nav className={styles.index} aria-label="Accommodation areas">
          {STAY_AREAS.map(area => <a key={area.key} href={`#${area.key}`}>{area.title}</a>)}
        </nav>

        {STAY_AREAS.map(area => {
          const recommendations = STAY_CONTENT.recommendations.filter(hotel => hotel.area === area.key);
          return (
            <section key={area.key} id={area.key} className={styles.area} aria-labelledby={`${area.key}-title`}>
              <h2 id={`${area.key}-title`}>{area.title}</h2>
              <div className={styles.areaBody}>
                {recommendations.length ? recommendations.map(hotel => {
                  const bookingUrl = getBookingUrl(hotel.bookingUrl);
                  return (
                    <article key={hotel.id} className={styles.recommendation}>
                      <h3>{hotel.name}</h3>
                      <p>{hotel.description}</p>
                      {bookingUrl && <a className={styles.link} href={bookingUrl} target="_blank" rel="noopener noreferrer">Visit hotel website</a>}
                    </article>
                  );
                }) : <p className={styles.pending}>{area.pending}</p>}
              </div>
            </section>
          );
        })}

        <aside className={styles.closing}>
          <p>The current programme, with our dates and venues, is on the celebrations page.</p>
          <Link className={styles.link} href="/events">The celebrations</Link>
        </aside>
      </div>
    </div>
  );
}
