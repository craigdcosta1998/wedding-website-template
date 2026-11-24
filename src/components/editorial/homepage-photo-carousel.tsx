// ABOUTME: Local-only five-photo cover proof of concept with accessible manual controls
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { LOCAL_PHOTO_PREVIEW } from '@/config/local-photo-preview';
import styles from './editorial-cover.module.css';

const ROTATION_MS = 6500;

export function HomepagePhotoCarousel({ pendingLabel }: { pendingLabel: string }) {
  const [active, setActive] = useState(0);
  const [failedPhotoId, setFailedPhotoId] = useState<string | null>(null);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionOverride, setMotionOverride] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (manuallyPaused || pointerInside || (reducedMotion && !motionOverride)) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % LOCAL_PHOTO_PREVIEW.length), ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [manuallyPaused, pointerInside, reducedMotion, motionOverride]);

  const photo = LOCAL_PHOTO_PREVIEW[active]!;
  const move = (direction: -1 | 1) => {
    const next = (active + direction + LOCAL_PHOTO_PREVIEW.length) % LOCAL_PHOTO_PREVIEW.length;
    setActive(next);
    setAnnouncement(`Photograph ${next + 1} of ${LOCAL_PHOTO_PREVIEW.length}`);
  };
  const rotationPaused = manuallyPaused || (reducedMotion && !motionOverride);

  return <div
    className={styles.carousel}
    role="group"
    aria-label={`Personal photographs, ${active + 1} of ${LOCAL_PHOTO_PREVIEW.length}`}
    onPointerEnter={(event) => { if (event.pointerType === 'mouse') setPointerInside(true); }}
    onPointerLeave={(event) => { if (event.pointerType === 'mouse') setPointerInside(false); }}
    onFocusCapture={(event) => {
      if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) setManuallyPaused(true);
    }}
  >
    {failedPhotoId === photo.id ? (
      <div className={styles.pendingPortrait} role="img" aria-label={pendingLabel}>
        <span aria-hidden="true">{pendingLabel}</span>
      </div>
    ) : (
      <Image
        key={photo.id}
        src={`/api/local-photo/${photo.id}`}
        alt="A personal photograph from Talia and Craig's collection"
        fill
        priority
        unoptimized
        sizes="(max-width: 700px) 83vw, (max-width: 1100px) 53vw, 540px"
        className={styles.photo}
        onError={() => setFailedPhotoId(photo.id)}
      />
    )}
    <div className={styles.carouselControls} role="group" aria-label="Photo controls">
      <button type="button" onClick={() => move(-1)} aria-label="Previous photograph">
        <ArrowLeft size={17} aria-hidden="true" />
      </button>
      <span aria-hidden="true">{String(active + 1).padStart(2, '0')} / {String(LOCAL_PHOTO_PREVIEW.length).padStart(2, '0')}</span>
      <button type="button" onClick={() => move(1)} aria-label="Next photograph">
        <ArrowRight size={17} aria-hidden="true" />
      </button>
      <button type="button" aria-label={rotationPaused ? 'Play photograph rotation' : 'Pause photograph rotation'}
        onClick={() => {
          if (reducedMotion && !motionOverride) { setMotionOverride(true); setManuallyPaused(false); }
          else setManuallyPaused((paused) => !paused);
        }}>
        {rotationPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
      </button>
    </div>
    <span className={styles.srOnly} aria-live="polite" aria-atomic="true">{announcement}</span>
  </div>;
}
