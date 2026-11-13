// ABOUTME: Italian Journal homepage with an asymmetrical Editorial Cover hero
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { WEDDING_CONFIG } from '@/config/wedding';
import { HOMEPAGE_CONFIG } from '@/config/homepage';
import type { Locale } from '@/i18n/config';
import { CoverMotion } from '@/components/editorial/cover-motion';
import styles from '@/components/editorial/journal.module.css';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('journal');
  const photo = HOMEPAGE_CONFIG.heroPhoto;
  const chapters = [
    { href: '/our-story', title: t('story'), detail: t('storyDetail') },
    { href: '/events', title: t('celebrations'), detail: WEDDING_CONFIG.celebrationDateRange },
    { href: '/hotels', title: t('stay'), detail: t('stayDetail') },
  ];

  return (
    <div className={styles.journal}>
      <div className={styles.page}>
        <CoverMotion names={WEDDING_CONFIG.coupleNames} announcement={t('announcement')}
          location={WEDDING_CONFIG.locationDetails.city}
          intro={<>
            <p className={styles.invitation}>{t('invitation')}</p>
            <p className={styles.italian} lang="it">Ci vediamo<br />in Italia.</p>
            <ArrowDownRight size={28} strokeWidth={1} aria-hidden="true" />
          </>}
          actions={<>
            <time className={styles.coverNote} dateTime={WEDDING_CONFIG.weddingDate.slice(0, 7)}>{WEDDING_CONFIG.weddingMonthYear}</time>
            <Link href="/rsvp" className={styles.textLink}>{t('rsvp')}<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </>}>
          <div className={styles.portrait}>
            {photo ? (
              <Image src={photo.src} alt={photo.alt[locale as Locale]} fill priority
                sizes="(max-width: 700px) 90vw, (max-width: 1280px) 70vw, 880px"
                className={styles.photo} style={{ objectPosition: photo.objectPosition }} />
            ) : (
              <div className={styles.photoPlaceholder}>
                <span className={styles.placeholderIndex}>01 / {t('portrait')}</span>
                <div className={styles.placeholderCaption}>
                  <span className={styles.placeholderMark} aria-hidden="true">{WEDDING_CONFIG.coupleFirstNames.partner1[0]} / {WEDDING_CONFIG.coupleFirstNames.partner2[0]}</span>
                  <p>{t('photoPlaceholder')}</p>
                  <span>{t('photoPending')}</span>
                </div>
              </div>
            )}
          </div>
        </CoverMotion>
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
