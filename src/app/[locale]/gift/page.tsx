// ABOUTME: Gift page with honeymoon message and animated bank details tile
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { FloatingBankDetails } from '@/components/gift/floating-bank-details';

interface GiftPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GiftPage({ params }: GiftPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('gift');

  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen watercolor-canvas paper-texture">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h1 className="handwritten text-4xl sm:text-5xl text-primary">
              {t('title')}
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed">
              {t('intro')}
            </p>

            <p className="text-muted-foreground text-base leading-relaxed">
              {t('honeymoon')}
            </p>

            <p className="text-muted-foreground text-base leading-relaxed">
              {t('story')}
            </p>
          </div>

          <FloatingBankDetails />
        </div>
      </section>
    </div>
  );
}
