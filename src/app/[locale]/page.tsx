// ABOUTME: Home page with full-bleed watercolor canvas design
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin } from 'lucide-react';
import { WEDDING_CONFIG } from '@/config/wedding';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const dateDisplay =
    locale === 'de' ? WEDDING_CONFIG.weddingDateDisplay.de : WEDDING_CONFIG.weddingDateDisplay.en;

  return (
    <div className="flex flex-col">
      {/* Hero Section - Full Bleed Watercolor Canvas. Add your own photo/illustration at
          /public/illustrations/hero.png and reintroduce an <Image> here if you'd like a
          full-bleed background — this template ships without one. */}
      <section className="relative min-h-[100vh] flex flex-col watercolor-canvas paper-texture">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />

        {/* Content floating over the watercolor */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-20">
          {/* Glass panel for main content */}
          <div className="glass-panel organic-panel px-6 py-8 sm:px-10 sm:py-10 text-center max-w-lg">
            {/* Names - style */}
            <h1 className="handwritten text-5xl sm:text-6xl text-primary mb-3">
              {WEDDING_CONFIG.coupleNames}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              {t('subtitle')}
            </p>

            {/* Date and Location */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6 mb-8">
              <div className="flex items-center gap-2 text-foreground">
                <CalendarDays className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">{dateDisplay}</span>
              </div>
              <div className="hidden sm:block h-5 w-px bg-primary/30" />
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">{WEDDING_CONFIG.location}</span>
              </div>
            </div>

            {/* RSVP Button - stamp-like style */}
            <Link href="/rsvp">
              <Button
                size="lg"
                className="min-h-[52px] min-w-[220px] text-base font-medium transition-transform duration-200 hover:scale-105 hover:-rotate-1"
              >
                {t('rsvpButton')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Quote Section - with organic panel styling */}
    </div>
  );
}
