// ABOUTME: Our Story as a photography-led editorial page with structured, user-supplied content
import { setRequestLocale } from 'next-intl/server';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { WEDDING_CONFIG } from '@/config/wedding';
import { STORY_CONTENT } from '@/config/story';
import { EditorialPhoto } from '@/components/editorial/editorial-photo';
import journal from '@/components/editorial/journal.module.css';
import styles from '@/components/editorial/our-story.module.css';

export default async function OurStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { chapters } = STORY_CONTENT;
  const firstChapter = chapters[0];
  const hasPendingContent = !STORY_CONTENT.portrait || chapters.some(chapter => !chapter.photo || chapter.paragraphs.length === 0);

  return (
    <div className={journal.journal}>
      <div className={journal.page}>
        <section className={styles.hero} aria-labelledby="story-title">
          <div className={styles.heroCopy}>
            <p className={styles.overline}>{WEDDING_CONFIG.coupleNames}</p>
            <h1 id="story-title" className={styles.title}>Our <span>story.</span></h1>
            <p className={styles.intro}>{STORY_CONTENT.intro}</p>
            {firstChapter && <a href={`#${firstChapter.id}`} className={journal.textLink}>Start at the beginning <ArrowDown size={16} strokeWidth={1} aria-hidden="true" /></a>}
            {hasPendingContent && <p className={styles.draftNote}>Story text and photographs to follow.</p>}
          </div>
          <EditorialPhoto photo={STORY_CONTENT.portrait} aspect="portrait" tone="olive"
            placeholderLabel="Couple portrait to follow" caption={WEDDING_CONFIG.coupleNames}
            className={styles.heroPhoto} priority sizes="(max-width: 700px) 77vw, (max-width: 1400px) 43vw, 620px" />
        </section>

        {chapters.length > 0 && <nav className={styles.chapterIndex} aria-label="Story chapters">
          {chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{chapter.title}
          </a>)}
        </nav>}

        <div>
          {chapters.map((chapter, index) => {
            const number = String(index + 1).padStart(2, '0');
            return (
              <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-title`}
                className={`${styles.chapter} ${index % 2 === 1 ? styles.chapterReverse : ''}`}>
                <div className={styles.chapterCopy}>
                  <p className={styles.overline}>Chapter {number}</p>
                  <h2 id={`${chapter.id}-title`} className={styles.chapterTitle}>{chapter.title}</h2>
                  {chapter.period && <p className={styles.period}>{chapter.period}</p>}
                  {chapter.paragraphs.length > 0
                    ? chapter.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex} className={styles.paragraph}>{paragraph}</p>)
                    : <p className={styles.pending}>Story to follow.</p>}
                </div>
                <EditorialPhoto photo={chapter.photo} aspect={chapter.aspect} tone={chapter.tone}
                  caption={chapter.caption} index={number} className={styles.chapterPhoto} />
              </section>
            );
          })}
        </div>

        <section className={styles.closing} aria-labelledby="next-chapter-title">
          <p className={styles.overline}>The next chapter</p>
          <div>
            <h2 id="next-chapter-title" className={styles.closingTitle}>To be continued,<br /><span>in {WEDDING_CONFIG.locationDetails.city}.</span></h2>
            <time dateTime={WEDDING_CONFIG.weddingDate} className={styles.closingDate}>{WEDDING_CONFIG.weddingDateDisplay.en} / {WEDDING_CONFIG.locationDetails.country}</time>
            <Link href="/events" className={journal.textLink}>The wedding weekend <ArrowUpRight size={17} strokeWidth={1} aria-hidden="true" /></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
