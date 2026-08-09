// ABOUTME: RSVP page with open form for guests to submit their responses
export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';
import { OpenRsvpForm } from '@/components/rsvp/open-rsvp-form';
import { createServiceClient } from '@/lib/supabase/server';

interface RsvpPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RsvpPage({ params }: RsvpPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createServiceClient();
  const { data: events } = await supabase
    .from('events')
    .select('id, name_de, name_en, event_date, location_name')
    .order('sort_order', { ascending: true });

  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen watercolor-canvas paper-texture">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />

        <div className="relative z-10 container mx-auto px-4 py-12">
          <OpenRsvpForm events={events || []} />
        </div>
      </section>
    </div>
  );
}
