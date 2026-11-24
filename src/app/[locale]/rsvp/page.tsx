// ABOUTME: Invitation-based household RSVP; fictional planning preview exists only in development
export const dynamic = 'force-dynamic';
import { setRequestLocale } from 'next-intl/server';
import { HouseholdJourney } from '@/components/rsvp/household-journey';
import { getHouseholdRsvpData } from '@/lib/household-rsvp';
import { getVerifiedHousehold, hasHouseholdAccessConfig } from '@/lib/household-access';
import { getHouseholdPreview } from '@/lib/household-preview';
import { WEDDING_CONFIG } from '@/config/wedding';
import journal from '@/components/editorial/journal.module.css';
import styles from '@/components/editorial/rsvp.module.css';
interface RsvpPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ preview?: string | string[]; audience?: string | string[] }>;
}
export default async function RsvpPage({ params, searchParams }: RsvpPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const previewData = query?.preview === 'planning' ? getHouseholdPreview(query.audience) : null;
  const context = previewData ? null : await getVerifiedHousehold();
  const data = context ? await getHouseholdRsvpData(context) : null;
  return <div className={journal.journal}><div className={journal.page}>
    <header className={styles.hero}><p className={styles.eyebrow}>{WEDDING_CONFIG.location} / September 2027</p>
      <h1 className={styles.title}>RSVP</h1>
      <p className={styles.intro}>We look forward to celebrating with you. Reply for each person on your household invitation.</p>
    </header>
    <div className={styles.body}><HouseholdJourney key={data?.id ?? 'entry'} initialData={data} previewData={previewData}
      ready={Boolean(previewData) || (hasHouseholdAccessConfig() && (!context || Boolean(data)))} /></div>
  </div></div>;
}
