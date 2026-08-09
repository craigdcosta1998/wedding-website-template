// ABOUTME: Events schedule page with watercolor venue illustrations
// ABOUTME: Fetches events from database and renders collapsible timeline
export const dynamic = 'force-dynamic';

import { EventTimeline } from "@/components/events/event-timeline";
import { WitnessContactCard } from "@/components/events/witness-contact-card";
import { createServiceClient } from "@/lib/supabase/server";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface EventsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function EventsPage({ params }: EventsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("events");
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("sort_order", { ascending: true });

  const events = data || [];

  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen watercolor-canvas paper-texture">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto">
            <h1 className="handwritten text-4xl sm:text-5xl text-primary mb-8 text-center">
              {t("title")}
            </h1>
            <EventTimeline events={events} locale={locale} />

            <div className="mt-12">
              <WitnessContactCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
