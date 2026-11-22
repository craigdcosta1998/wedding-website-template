// ABOUTME: RSVP page with open form for guests to submit their responses
export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';
import { OpenRsvpForm } from '@/components/rsvp/open-rsvp-form';
import { getOpenRsvpEvents } from '@/lib/rsvp-access';
import { Link } from '@/i18n/routing';

interface RsvpPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RsvpPage({ params }: RsvpPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { available, events } = await getOpenRsvpEvents();

  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen watercolor-canvas paper-texture">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />

        <div className="relative z-10 container mx-auto px-4 py-12">
          {available ? <OpenRsvpForm events={events} /> : (
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h1 className="font-serif text-4xl sm:text-5xl text-primary">RSVP</h1>
              <p role="status">RSVP details are being finalised. Please check back soon.</p>
              <Link href="/events" className="inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
                The celebrations
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
