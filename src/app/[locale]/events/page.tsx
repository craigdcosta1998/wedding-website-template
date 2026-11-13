// ABOUTME: Editorial celebrations programme; invitation-only entries are filtered before rendering
export const dynamic = 'force-dynamic';

import { ArrowUpRight } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { WEDDING_CONFIG } from '@/config/wedding';
import { getCelebrationsPageData } from '@/lib/celebration-access';
import { CelebrationsSchedule } from '@/components/editorial/celebrations-schedule';
import journal from '@/components/editorial/journal.module.css';
import styles from '@/components/editorial/celebrations.module.css';

interface EventsPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ preview?: string | string[] }>;
}

export default async function EventsPage({ params, searchParams }: EventsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const { celebrations, details, isPlanningPreview } = await getCelebrationsPageData(query?.preview === 'planning');

  return (
    <div className={`${journal.journal} ${styles.celebrations}`}>
      <div className={journal.page}>
        {isPlanningPreview && <aside className={styles.preview} aria-label="Planning preview">
          <p>Planning preview · All four days</p>
          <Link href="/events">View guest page</Link>
        </aside>}
        <section className={styles.hero} aria-labelledby="celebrations-heading">
          <p className={styles.overline}>{WEDDING_CONFIG.coupleNames} / {WEDDING_CONFIG.location}</p>
          <h1 id="celebrations-heading" className={styles.title}>The <span>celebrations.</span></h1>
          <div className={styles.heroBottom}>
            <p className={styles.dateRange}>{WEDDING_CONFIG.celebrationDateRange}</p>
            <p className={styles.introduction}>The plans so far.<br />Timings and finer details to follow.</p>
          </div>
        </section>
        <nav className={styles.index} aria-label="Celebrations">
          {celebrations.map(event => <a key={event.key} href={`#${event.key}`}>
            {event.title}<span>{event.date.slice(-2)} September</span>
          </a>)}
        </nav>
        <CelebrationsSchedule celebrations={celebrations} details={details} />
        <div className={styles.closing}>
          <p>We look forward to celebrating with you.</p>
          <Link href="/rsvp" className={journal.textLink}>RSVP <ArrowUpRight size={17} strokeWidth={1} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  );
}
