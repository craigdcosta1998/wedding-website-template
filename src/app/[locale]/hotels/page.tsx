// ABOUTME: Hotels page with recommended accommodations near your wedding venues
// ABOUTME: Renders a card per hotel with description, price, distance, and a booking link
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { MapPin, Star, ExternalLink } from 'lucide-react';

interface HotelsPageProps {
  params: Promise<{ locale: string }>;
}

// Add your own hotel recommendations here — one entry per card, same shape as the example.
const hotels = [
  {
    key: 'example',
    rating: 4.5,
    reviewCount: 500,
    url: 'https://example.com',
  },
];

export default async function HotelsPage({ params }: HotelsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('accommodation');

  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen watercolor-canvas paper-texture">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="handwritten text-4xl sm:text-5xl text-primary text-center">
              {t('title')}
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed text-center">
              {t('subtitle')}
            </p>

            <div className="space-y-6">
              {hotels.map((hotel) => (
                <div key={hotel.key} className="glass-panel organic-panel p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="handwritten text-2xl sm:text-3xl text-foreground">
                      {t(`${hotel.key}.name`)}
                    </h2>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                      {hotel.reviewCount && (
                        <span className="text-xs text-muted-foreground">
                          ({hotel.reviewCount.toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${hotel.key}.description`)}
                  </p>

                  <p className="text-sm font-medium">{t(`${hotel.key}.price`)}</p>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <p>{t(`${hotel.key}.distance`)}</p>
                  </div>

                  <a
                    href={hotel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {hotel.url.replace('https://', '')}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
