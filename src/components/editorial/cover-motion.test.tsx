// ABOUTME: Cover motion regressions for scrolling, idle settlement, interruption, and accessibility
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CoverMotion } from './cover-motion';

const frames = new Map<number, FrameRequestCallback>();
let ticket = 0;
let landingShift = 0;
let preferenceChanged: (() => void) | undefined;
const media = {
  matches: false,
  addEventListener: vi.fn((_event: string, listener: () => void) => { preferenceChanged = listener; }),
  removeEventListener: vi.fn(),
};
const disconnect = vi.fn();

function box(left: number, top: number, width: number, height: number): DOMRect {
  return { left, right: left + width, top, bottom: top + height, x: left, y: top, width, height, toJSON: () => ({}) };
}

function mount() {
  return render(
    <CoverMotion names="Talia & Craig" announcement="We're getting married" location="Florence"
      intro={<p>A little Italian chapter.</p>}
      actions={<><time dateTime="2027-09">September 2027</time><button type="button">RSVP</button></>}>
      <div>Couple photograph</div>
    </CoverMotion>,
  );
}

function advanceFrame(timestamp = 0) {
  act(() => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach(callback => callback(timestamp));
  });
}

function scrollTo(top: number) {
  act(() => {
    window.scrollY = top;
    window.dispatchEvent(new Event('scroll'));
  });
  advanceFrame();
}

function finishSettlement() {
  act(() => { vi.advanceTimersByTime(150); });
  advanceFrame(0);
  advanceFrame(160);
  advanceFrame(320);
}

function pointer(type: string) {
  act(() => {
    window.dispatchEvent(Object.assign(new Event(type), { pointerId: 1 }));
  });
}

function rotation(element: HTMLElement) {
  return Number(/rotate\(([^d]+)deg\)/.exec(element.style.transform)![1]);
}

beforeEach(() => {
  frames.clear();
  ticket = 0;
  landingShift = 0;
  media.matches = false;
  preferenceChanged = undefined;
  vi.clearAllMocks();
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 });
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
    frames.set(++ticket, callback);
    return ticket;
  }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)));
  vi.stubGlobal('ResizeObserver', class {
    observe = vi.fn();
    disconnect = disconnect;
  });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const scroll = window.scrollY;
    if (this.hasAttribute('data-cover-scene')) return box(0, 100 - scroll, 1000, 900);
    if (this.hasAttribute('data-cover-image')) return box(250, 180 - scroll, 700, 500);
    switch (this.dataset.coverAnchor) {
      case 'announcement-start': return box(250, 114 - scroll, 200, 36);
      case 'location-start': return box(970, 180 - scroll, 15, 180);
      case 'announcement-end': return box(0, 710 + landingShift - scroll, 600, 100);
      case 'location-end': return box(0, 840 + landingShift - scroll, 220, 18);
      default: return box(0, 0, 0, 0);
    }
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('CoverMotion', () => {
  it('starts on the frame and lands both labels below the photo, reversing on scroll up', () => {
    const { container } = mount();
    const headline = container.querySelector<HTMLElement>('[data-cover-motion="announcement"]')!;
    const city = container.querySelector<HTMLElement>('[data-cover-motion="location"]')!;
    const initial = headline.style.transform;
    expect(initial).toContain('translate3d(250px, 14px, 0)');
    expect(headline).toHaveTextContent("We're getting married");
    expect(city).toHaveTextContent('Florence');
    expect(city.style.transform).toContain('rotate(90deg)');
    scrollTo(500);
    expect(headline.style.transform).toBe('translate3d(0px, 610px, 0) rotate(0deg) scale(1)');
    expect(city.style.transform).toBe('translate3d(0px, 740px, 0) rotate(0deg) scale(1)');
    scrollTo(0);
    expect(headline.style.transform).toBe(initial);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Talia & Craig');
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2027-09');
    expect(container.querySelector('time')).toHaveTextContent('September 2027');
    expect(container.querySelector('time')!.style.transform).toBe('');
  });

  it('interpolates between endpoints and batches rapid scroll events into one frame', () => {
    const { container } = mount();
    act(() => {
      window.scrollY = 162.5;
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
    });
    expect(frames.size).toBe(1);
    scrollTo(162.5);
    expect(container.querySelector<HTMLElement>('[data-cover-motion="announcement"]')!.style.transform).toContain('translate3d(125px, 312px, 0)');
    expect(container.querySelector<HTMLElement>('[data-cover-motion="location"]')!.style.transform).toContain('rotate(45deg)');
  });

  it.each([
    { scroll: 130, endpoint: 'border', expectedRotation: 90 },
    { scroll: 162.5, endpoint: 'bottom at the halfway threshold', expectedRotation: 0 },
    { scroll: 195, endpoint: 'bottom', expectedRotation: 0 },
  ])('settles to the $endpoint after scrolling stops', ({ scroll, expectedRotation }) => {
    const { container } = mount();
    const city = container.querySelector<HTMLElement>('[data-cover-motion="location"]')!;
    scrollTo(scroll);
    const intermediate = city.style.transform;
    act(() => { vi.advanceTimersByTime(149); });
    expect(frames.size).toBe(0);
    expect(city.style.transform).toBe(intermediate);
    act(() => { vi.advanceTimersByTime(1); });
    advanceFrame(0);
    advanceFrame(160);
    expect(city.style.transform).not.toBe(intermediate);
    expect(rotation(city)).not.toBe(expectedRotation);
    advanceFrame(320);
    expect(rotation(city)).toBe(expectedRotation);
    expect(frames.size).toBe(0);
    expect(window.scrollY).toBe(scroll);
    const headline = container.querySelector<HTMLElement>('[data-cover-motion="announcement"]')!;
    expect(headline.style.transform).toContain(expectedRotation === 90 ? 'translate3d(250px, 14px, 0)' : 'translate3d(0px, 610px, 0)');
  });

  it('waits for a pause instead of settling during continuous scrolling', () => {
    const { container } = mount();
    const city = container.querySelector<HTMLElement>('[data-cover-motion="location"]')!;
    scrollTo(100);
    for (const top of [120, 140, 160, 180, 200]) {
      act(() => { vi.advanceTimersByTime(100); });
      expect(frames.size).toBe(0);
      scrollTo(top);
      expect(rotation(city)).toBeGreaterThan(0);
      expect(rotation(city)).toBeLessThan(90);
    }
    finishSettlement();
    expect(rotation(city)).toBe(0);
  });

  it.each([
    { pausedAt: 130, resumeAt: 140, minimum: 85, maximum: 90, end: 325, finalRotation: 0 },
    { pausedAt: 195, resumeAt: 185, minimum: 0, maximum: 5, end: 0, finalRotation: 90 },
  ])('resumes smoothly from a settled caption at scroll $pausedAt', ({ pausedAt, resumeAt, minimum, maximum, end, finalRotation }) => {
    const { container } = mount();
    const city = container.querySelector<HTMLElement>('[data-cover-motion="location"]')!;
    scrollTo(pausedAt);
    finishSettlement();
    scrollTo(resumeAt);
    expect(rotation(city)).toBeGreaterThan(minimum);
    expect(rotation(city)).toBeLessThan(maximum);
    scrollTo(end);
    expect(rotation(city)).toBe(finalRotation);
  });

  it('lets new scrolling interrupt a settlement without jumping to the old scroll progress', () => {
    const { container } = mount();
    const city = container.querySelector<HTMLElement>('[data-cover-motion="location"]')!;
    scrollTo(195);
    act(() => { window.dispatchEvent(new Event('scrollend')); });
    advanceFrame(0);
    advanceFrame(160);
    const before = rotation(city);
    scrollTo(196);
    expect(Math.abs(rotation(city) - before)).toBeLessThan(2);
    finishSettlement();
    expect(rotation(city)).toBe(0);
  });

  it('keeps captions under scroll control while a touch or pointer is held', () => {
    const { container } = mount();
    const city = container.querySelector<HTMLElement>('[data-cover-motion="location"]')!;
    pointer('pointerdown');
    scrollTo(195);
    const intermediate = city.style.transform;
    act(() => {
      window.dispatchEvent(new Event('scrollend'));
      vi.advanceTimersByTime(1000);
    });
    expect(frames.size).toBe(0);
    expect(city.style.transform).toBe(intermediate);
    pointer('pointerup');
    finishSettlement();
    expect(rotation(city)).toBe(0);
  });

  it('also settles a page restored at an intermediate scroll position', () => {
    window.scrollY = 195;
    const { container } = mount();
    finishSettlement();
    expect(rotation(container.querySelector<HTMLElement>('[data-cover-motion="location"]')!)).toBe(0);
  });

  it('keeps the static captions when reduced motion is requested and responds to preference changes', () => {
    media.matches = true;
    const { container } = mount();
    const scene = container.querySelector('[data-cover-scene]')!;
    expect(scene).not.toHaveAttribute('data-motion-ready');
    expect(container.querySelector('time')).toHaveTextContent('September 2027');
    expect(container.querySelector('[data-cover-anchor="announcement-end"]')).toHaveTextContent("We're getting married");
    expect(container.querySelector('[data-cover-anchor="location-end"]')).toHaveTextContent('Florence');
    scrollTo(500);
    expect(frames.size).toBe(0);
    act(() => { media.matches = false; preferenceChanged?.(); });
    expect(scene).toHaveAttribute('data-motion-ready');
    act(() => { media.matches = true; preferenceChanged?.(); });
    expect(scene).not.toHaveAttribute('data-motion-ready');
  });

  it('remeasures after a layout change without moving the scroll position', () => {
    const { container } = mount();
    scrollTo(500);
    act(() => { landingShift = 100; window.dispatchEvent(new Event('resize')); });
    expect(container.querySelector<HTMLElement>('[data-cover-motion="announcement"]')!.style.transform).toContain('translate3d(0px, 710px, 0)');
    expect(window.scrollY).toBe(500);
  });

  it('cleans up pending animation work and its observer on unmount', () => {
    const { unmount } = mount();
    scrollTo(195);
    act(() => { vi.advanceTimersByTime(150); });
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    expect(disconnect).toHaveBeenCalledOnce();
    expect(media.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('cancels idle timers on unmount and animation if reduced motion is enabled mid-settlement', () => {
    const first = mount();
    scrollTo(130);
    expect(vi.getTimerCount()).toBe(1);
    first.unmount();
    expect(vi.getTimerCount()).toBe(0);
    const { container } = mount();
    scrollTo(195);
    act(() => { vi.advanceTimersByTime(150); });
    expect(frames.size).toBe(1);
    act(() => { media.matches = true; preferenceChanged?.(); });
    expect(frames.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    expect(container.querySelector('[data-cover-scene]')).not.toHaveAttribute('data-motion-ready');
  });
});
