// ABOUTME: Italian Journal homepage with an asymmetrical Editorial Cover hero
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { EditorialCover } from '@/components/editorial/editorial-cover';
import styles from '@/components/editorial/journal.module.css';
import coverStyles from '@/components/editorial/editorial-cover.module.css';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('journal');
  const chapters = [
    { href: '/events', title: t('celebrations') },
    { href: '/hotels', title: t('stay') },
    { href: '/our-story', title: t('story') },
  ];

  return (
    <div className={`${styles.journal} ${coverStyles.canvas}`}>
      <div className={styles.page}>
        <EditorialCover />
        <section className={`${styles.contents} ${styles.homeContents}`} aria-label={t('contents')}>
          <div className={styles.chapters}>
            {chapters.map((chapter, index) => (
              <Link key={chapter.href} href={chapter.href} className={styles.chapter}>
                <span className={styles.chapterNumber}>0{index + 1}</span>
                <span className={styles.chapterCopy}><span className={styles.chapterTitle}>{chapter.title}</span></span>
                <ArrowUpRight size={22} strokeWidth={1} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
