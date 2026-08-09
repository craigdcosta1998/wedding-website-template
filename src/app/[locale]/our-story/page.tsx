// ABOUTME: Our Story page with a chronological timeline of photos and stories
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { WEDDING_CONFIG } from '@/config/wedding';

interface OurStoryPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OurStoryPage({ params }: OurStoryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('ourStory');
  const isDe = locale === 'de';

  return (
    <div className="flex flex-col">
      {/* Hero Section with Watercolor Background */}
      <section className="relative py-20 px-4 watercolor-canvas">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/watercolor-hero.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />

        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <h1 className="handwritten text-5xl sm:text-6xl text-primary mb-4">
            {t('title')}
          </h1>
          <p className="handwritten text-2xl sm:text-3xl text-accent">
            {WEDDING_CONFIG.coupleNames}
          </p>
        </div>
      </section>

      {/* Story Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-accent/40 -translate-x-1/2 hidden md:block" />

          <div className="space-y-24">

          {/* Section 1: How you met — replace title, year, and text with your own story */}
          <StorySection
            title={isDe ? 'Wie alles begann' : 'How It All Began'}
            year={isDe ? '[Jahr]' : '[Year]'}
            imagePosition="right"
          >
            <p className="text-muted-foreground leading-relaxed">
              {isDe
                ? '[Erzählt hier, wie ihr euch kennengelernt habt — ersetzt diesen Platzhaltertext.]'
                : '[Tell the story of how you met here — replace this placeholder text.]'}
            </p>
          </StorySection>

          {/* Section 2 */}
          <StorySection
            title={isDe ? 'Die frühen Jahre' : 'The Early Years'}
            year={isDe ? '[Zeitraum]' : '[Time period]'}
            imagePosition="left"
          >
            <p className="text-muted-foreground leading-relaxed">
              {isDe
                ? '[Was ist in den ersten Jahren eurer Beziehung passiert? Ersetzt diesen Platzhaltertext.]'
                : '[What happened in the early years of your relationship? Replace this placeholder text.]'}
            </p>
          </StorySection>

          {/* Section 3 */}
          <StorySection
            title={isDe ? '[Ort oder Ereignis]' : '[Place or Milestone]'}
            year={isDe ? '[Zeitraum]' : '[Time period]'}
            imagePosition="right"
          >
            <p className="text-muted-foreground leading-relaxed">
              {isDe
                ? '[Ein weiteres Kapitel eurer Geschichte — ersetzt diesen Platzhaltertext.]'
                : '[Another chapter of your story — replace this placeholder text.]'}
            </p>
          </StorySection>

          {/* Section 4 */}
          <StorySection
            title={isDe ? '[Ort oder Ereignis]' : '[Place or Milestone]'}
            year={isDe ? '[Zeitraum]' : '[Time period]'}
            imagePosition="left"
          >
            <p className="text-muted-foreground leading-relaxed">
              {isDe
                ? '[Noch ein Kapitel — ersetzt diesen Platzhaltertext.]'
                : '[Another chapter — replace this placeholder text.]'}
            </p>
          </StorySection>

          {/* Section 5: The Proposal */}
          <StorySection
            title={isDe ? 'Der Antrag' : 'The Proposal'}
            year={isDe ? '[Jahr]' : '[Year]'}
            imagePosition="right"
          >
            <p className="text-muted-foreground leading-relaxed">
              {isDe
                ? '[Wie kam es zum Antrag? Ersetzt diesen Platzhaltertext.]'
                : '[How did the proposal happen? Replace this placeholder text.]'}
            </p>
          </StorySection>

          {/* Section 6 */}
          <StorySection
            title={isDe ? '[Ort oder Ereignis]' : '[Place or Milestone]'}
            year={isDe ? '[Zeitraum]' : '[Time period]'}
            imagePosition="left"
          >
            <p className="text-muted-foreground leading-relaxed">
              {isDe
                ? '[Noch ein Kapitel — ersetzt diesen Platzhaltertext.]'
                : '[Another chapter — replace this placeholder text.]'}
            </p>
          </StorySection>

          {/* Section 7: And now... */}
          <StorySection
            title={isDe ? 'Und jetzt…' : 'And Now…'}
            year={isDe ? '[Jahr]' : '[Year]'}
            imagePosition="right"
            highlight
          >
            <p className="text-muted-foreground leading-relaxed">
              {isDe
                ? '[Erzählt von eurer Hochzeit und ladet eure Gäste ein — ersetzt diesen Platzhaltertext.]'
                : '[Tell your guests about the wedding day and invite them along — replace this placeholder text.]'}
            </p>
          </StorySection>

          </div>
        </div>
        </div>
      </section>
    </div>
  );
}

interface StorySectionProps {
  title: string;
  year: string;
  children: React.ReactNode;
  imagePosition: 'left' | 'right';
  highlight?: boolean;
  imageSrc?: string;
  imageAlt?: string;
}

function StorySection({ title, year, children, imagePosition, highlight, imageSrc, imageAlt }: StorySectionProps) {
  return (
    <div className="relative">
      {/* Timeline dot */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 hidden md:flex items-center justify-center">
        <div className={`w-5 h-5 rounded-full border-4 shadow-md ${highlight ? 'bg-accent border-accent/30' : 'bg-primary border-primary/30'}`} />
      </div>

      <div className={`flex flex-col ${imagePosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
        {/* Text Content */}
        <div className="flex-1">
          <div className="glass-panel organic-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${highlight ? 'bg-accent text-accent-foreground' : 'bg-primary/10 text-primary'}`}>
                {year}
              </span>
            </div>
            <h2 className="handwritten text-2xl sm:text-3xl text-foreground mb-4">{title}</h2>
            {children}
          </div>
        </div>

        {/* Image — add your own photo at imageSrc to replace this placeholder */}
        <div className="flex-1 w-full">
          {imageSrc ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-primary/10 organic-panel shadow-sm">
              <Image
                src={imageSrc}
                alt={imageAlt ?? ''}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-secondary/30 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/20 organic-panel">
              <div className="text-center p-4">
                <p className="text-muted-foreground text-sm italic">
                  {title}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
