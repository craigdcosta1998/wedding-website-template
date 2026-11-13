// ABOUTME: Scroll-linked cover captions move from the photograph's frame to the space below it
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './journal.module.css';

interface CoverMotionProps {
  names: string;
  announcement: string;
  location: string;
  intro: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}

interface Pose { x: number; y: number; scale: number; rotation: number }
interface Journey { from: Pose; to: Pose }
interface ScrollAnchor { scroll: number; progress: number }

const IDLE_DELAY = 150;
const SETTLE_DURATION = 320;
const SETTLE_THRESHOLD = .5;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

function interpolate(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function paint(element: HTMLElement, journey: Journey, progress: number) {
  const { from, to } = journey;
  element.style.transform = `translate3d(${interpolate(from.x, to.x, progress)}px, ${interpolate(from.y, to.y, progress)}px, 0) rotate(${interpolate(from.rotation, to.rotation, progress)}deg) scale(${interpolate(from.scale, to.scale, progress)})`;
}

export function CoverMotion({ names, announcement, location, intro, actions, children }: CoverMotionProps) {
  const scene = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const announcementStart = useRef<HTMLSpanElement>(null);
  const locationStart = useRef<HTMLSpanElement>(null);
  const announcementEnd = useRef<HTMLSpanElement>(null);
  const locationEnd = useRef<HTMLSpanElement>(null);
  const movingAnnouncement = useRef<HTMLSpanElement>(null);
  const movingLocation = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = scene.current;
    const frame = photo.current;
    const headline = movingAnnouncement.current;
    const city = movingLocation.current;
    if (!root || !frame || !headline || !city) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let announcementJourney: Journey | null = null;
    let locationJourney: Journey | null = null;
    let startScroll = 0;
    let distance = 300;
    let animationFrame = 0;
    let idleTimer = 0;
    let progress = 0;
    let lastScroll = window.scrollY;
    let anchor: ScrollAnchor | null = null;
    let settling = false;
    let disposed = false;
    const heldPointers = new Set<number>();

    const draw = (nextProgress: number) => {
      if (motion.matches || !announcementJourney || !locationJourney) return;
      progress = clamp(nextProgress);
      const eased = progress * progress * (3 - 2 * progress);
      paint(headline, announcementJourney, eased);
      paint(city, locationJourney, eased);
    };

    // Rebase after a settlement so the next small scroll never jumps back midway.
    const rebase = () => {
      anchor = { scroll: Math.max(startScroll, Math.min(startScroll + distance, lastScroll)), progress };
    };

    const render = () => {
      const scroll = window.scrollY;
      if (!anchor) {
        draw((scroll - startScroll) / distance);
      } else if (scroll >= anchor.scroll) {
        draw(anchor.progress + (1 - anchor.progress) * clamp((scroll - anchor.scroll) / Math.max(1, startScroll + distance - anchor.scroll)));
      } else {
        draw(anchor.progress * (1 - clamp((anchor.scroll - scroll) / Math.max(1, anchor.scroll - startScroll))));
      }
      lastScroll = scroll;
    };

    const stopAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      if (settling) rebase();
      settling = false;
    };

    const settle = () => {
      window.clearTimeout(idleTimer);
      if (disposed || motion.matches || heldPointers.size || settling || !announcementJourney || !locationJourney) return;
      stopAnimation();
      render();
      const target = progress >= SETTLE_THRESHOLD ? 1 : 0;
      if (progress === target) return;
      const from = progress;
      let started: number | undefined;
      settling = true;
      const step = (timestamp: number) => {
        animationFrame = 0;
        started ??= timestamp;
        const elapsed = clamp((timestamp - started) / SETTLE_DURATION);
        draw(interpolate(from, target, 1 - (1 - elapsed) ** 3));
        if (elapsed < 1) {
          animationFrame = window.requestAnimationFrame(step);
        } else {
          settling = false;
          rebase();
        }
      };
      animationFrame = window.requestAnimationFrame(step);
    };

    const scheduleSettlement = () => {
      window.clearTimeout(idleTimer);
      if (!motion.matches && !heldPointers.size) idleTimer = window.setTimeout(settle, IDLE_DELAY);
    };

    const measure = () => {
      if (disposed) return;
      stopAnimation();
      window.clearTimeout(idleTimer);
      if (motion.matches) {
        root.removeAttribute('data-motion-ready');
        anchor = null;
        return;
      }
      const bounds = root.getBoundingClientRect();
      const image = frame.getBoundingClientRect();
      const journey = (start: HTMLElement | null, end: HTMLElement | null, rotated: boolean): Journey | null => {
        if (!start || !end) return null;
        const a = start.getBoundingClientRect();
        const b = end.getBoundingClientRect();
        if (b.width <= 0) return null;
        return {
          from: {
            x: (rotated ? a.right : a.left) - bounds.left,
            y: a.top - bounds.top,
            scale: (rotated ? a.height : a.width) / b.width,
            rotation: rotated ? 90 : 0,
          },
          to: { x: b.left - bounds.left, y: b.top - bounds.top, scale: 1, rotation: 0 },
        };
      };
      announcementJourney = journey(announcementStart.current, announcementEnd.current, false);
      locationJourney = journey(locationStart.current, locationEnd.current, true);
      startScroll = Math.max(0, bounds.top + window.scrollY - 120);
      distance = Math.max(220, Math.min(420, image.height * .65));
      if (anchor) rebase();
      render();
      if (announcementJourney && locationJourney) root.setAttribute('data-motion-ready', '');
      if (progress > 0 && progress < 1) scheduleSettlement();
    };

    const onScroll = () => {
      if (motion.matches) return;
      if (settling) stopAnimation();
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(() => {
          animationFrame = 0;
          render();
        });
      }
      scheduleSettlement();
    };

    const onPointerDown = (event: PointerEvent) => {
      heldPointers.add(event.pointerId);
      window.clearTimeout(idleTimer);
      if (settling) stopAnimation();
    };
    const onPointerUp = (event: PointerEvent) => {
      heldPointers.delete(event.pointerId);
      scheduleSettlement();
    };
    const onBlur = () => {
      heldPointers.clear();
      scheduleSettlement();
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', settle);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    window.addEventListener('blur', onBlur);
    window.addEventListener('resize', measure);
    motion.addEventListener('change', measure);
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    document.fonts?.ready.then(measure);

    return () => {
      disposed = true;
      stopAnimation();
      window.clearTimeout(idleTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', settle);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('resize', measure);
      motion.removeEventListener('change', measure);
      observer.disconnect();
    };
  }, [announcement, location]);

  return (
    <section ref={scene} className={styles.cover} aria-labelledby="cover-heading" data-cover-scene>
      <h1 id="cover-heading" className="sr-only">{names}</h1>
      <div className={styles.marginNote}>{intro}</div>
      <div ref={photo} className={styles.coverFrame} data-cover-image>
        <span ref={announcementStart} className={`${styles.announcementText} ${styles.announcementStart}`} aria-hidden="true" data-cover-anchor="announcement-start">{announcement}</span>
        <span ref={locationStart} className={`${styles.locationText} ${styles.locationStart}`} aria-hidden="true" data-cover-anchor="location-start">{location}</span>
        {children}
      </div>
      <p className={styles.announcementLanding}>
        <span ref={announcementEnd} className={styles.announcementText} data-cover-anchor="announcement-end">{announcement}</span>
      </p>
      <div className={styles.coverCaption}>
        <span ref={locationEnd} className={styles.locationText} data-cover-anchor="location-end">{location}</span>
        <div className={styles.coverActions}>{actions}</div>
      </div>
      <span ref={movingAnnouncement} className={`${styles.announcementText} ${styles.movingAnnouncement}`} aria-hidden="true" data-cover-motion="announcement">{announcement}</span>
      <span ref={movingLocation} className={`${styles.locationText} ${styles.movingLocation}`} aria-hidden="true" data-cover-motion="location">{location}</span>
    </section>
  );
}
