// ABOUTME: Italian Journal homepage with an asymmetrical Editorial Cover hero
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { WEDDING_CONFIG } from '@/config/wedding';
import type { Locale } from '@/i18n/config';
import { EditorialCover } from '@/components/editorial/editorial-cover';
import styles from '@/components/editorial/journal.module.css';
import coverStyles from '@/components/editorial/editorial-cover.module.css';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('journal');
  const chapters = [
    { href: '/our-story', title: t('story'), detail: t('storyDetail') },
    { href: '/events', title: t('celebrations'), detail: WEDDING_CONFIG.celebrationDateRange },
    { href: '/hotels', title: t('stay'), detail: t('stayDetail') },
  ];

  return (
    <div className={`${styles.journal} ${coverStyles.canvas}`}>
      <div className={styles.page}>
        <EditorialCover locale={locale as Locale} />
        <section className={styles.contents} aria-labelledby="contents-heading">
          <div className={styles.contentsIntro}>
            <h2 id="contents-heading" className={styles.eyebrow}>{t('contents')}</h2>
            <p>{t('welcome')}</p>
          </div>
          <div className={styles.chapters}>
            {chapters.map((chapter, index) => (
              <Link key={chapter.href} href={chapter.href} className={styles.chapter}>
                <span className={styles.chapterNumber}>0{index + 1}</span>
                <span className={styles.chapterCopy}><span className={styles.chapterTitle}>{chapter.title}</span><span className={styles.chapterDetail}>{chapter.detail}</span></span>
                <ArrowUpRight size={22} strokeWidth={1} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
