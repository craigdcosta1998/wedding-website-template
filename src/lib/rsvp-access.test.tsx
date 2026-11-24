// ABOUTME: RSVP must expose only linked public choices and refuse incomplete or unauthorised access
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import messages from '@/messages/en.json';

const mocks = vi.hoisted(() => ({
  configured: vi.fn(), createServiceClient: vi.fn(), from: vi.fn(), select: vi.fn(),
  in: vi.fn(), cookie: vi.fn(),
}));
vi.mock('@/lib/supabase/server', () => ({
  hasSupabaseServiceConfig: mocks.configured, createServiceClient: mocks.createServiceClient,
}));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: mocks.cookie }) }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/i18n/routing', () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => <a href={href} {...props}>{children}</a>,
}));

import { CELEBRATIONS } from '@/config/celebrations';
import { generatePasswordToken } from '@/lib/password';
import { getOpenRsvpEvents } from './rsvp-access';
import RsvpPage from '@/app/[locale]/rsvp/page';
import { OpenRsvpForm } from '@/components/rsvp/open-rsvp-form';

function linkPublicEvents() {
  CELEBRATIONS.find(event => event.key === 'welcome-party')!.databaseEventId = 'welcome-id';
  CELEBRATIONS.find(event => event.key === 'wedding')!.databaseEventId = 'wedding-id';
  CELEBRATIONS.find(event => event.key === 'roce')!.databaseEventId = 'private-id';
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('SITE_PASSWORD', '');
  vi.stubEnv('RESEND_API_KEY', '');
  mocks.configured.mockReturnValue(true);
  mocks.cookie.mockReturnValue(undefined);
  mocks.createServiceClient.mockResolvedValue({ from: mocks.from });
  mocks.from.mockReturnValue({ select: mocks.select });
  mocks.select.mockReturnValue({ in: mocks.in });
  mocks.in.mockResolvedValue({ data: [{ id: 'welcome-id' }, { id: 'wedding-id' }], error: null });
});
afterEach(() => {
  for (const event of CELEBRATIONS) delete event.databaseEventId;
  vi.unstubAllEnvs();
});

describe('public RSVP access', () => {
  it('does not query until all public events have unique explicit links and service configuration', async () => {
    expect((await getOpenRsvpEvents()).available).toBe(false);
    CELEBRATIONS.find(event => event.key === 'wedding')!.databaseEventId = 'wedding-id';
    expect((await getOpenRsvpEvents()).available).toBe(false);
    CELEBRATIONS.find(event => event.key === 'welcome-party')!.databaseEventId = 'wedding-id';
    expect((await getOpenRsvpEvents()).available).toBe(false);
    linkPublicEvents();
    mocks.configured.mockReturnValue(false);
    expect((await getOpenRsvpEvents()).available).toBe(false);
    expect(mocks.createServiceClient).not.toHaveBeenCalled();
  });

  it('queries only public IDs and uses approved dates, names and venues even if extra rows are returned', async () => {
    linkPublicEvents();
    mocks.in.mockResolvedValue({ data: [
      { id: 'private-id', name_en: 'Private title' },
      { id: 'wedding-id', name_en: 'Wrong year and name' }, { id: 'welcome-id' },
    ], error: null });
    const result = await getOpenRsvpEvents();
    expect(mocks.select).toHaveBeenCalledWith('id');
    expect(mocks.in).toHaveBeenCalledWith('id', ['welcome-id', 'wedding-id']);
    expect(result).toEqual({ available: true, events: [
      { id: 'welcome-id', name_en: 'The welcome party', event_date: '2027-09-13', location_name: 'Serre Torrigiani' },
      { id: 'wedding-id', name_en: 'The wedding', event_date: '2027-09-14', location_name: 'Villa Corsini' },
    ] });
  });

  it.each([
    { data: [{ id: 'wedding-id' }], error: null },
    { data: null, error: { message: 'Unavailable' } },
  ])('refuses incomplete or failed event queries', async result => {
    linkPublicEvents();
    mocks.in.mockResolvedValue(result);
    expect(await getOpenRsvpEvents()).toEqual({ available: false, events: [] });
  });

  it('returns unavailable if the event source throws', async () => {
    linkPublicEvents();
    mocks.in.mockRejectedValue(new Error('Offline'));
    expect((await getOpenRsvpEvents()).available).toBe(false);
  });

  it('checks the site cookie before any service query', async () => {
    linkPublicEvents();
    vi.stubEnv('SITE_PASSWORD', 'test-password');
    expect((await getOpenRsvpEvents()).available).toBe(false);
    mocks.cookie.mockReturnValue({ value: 'forged' });
    expect((await getOpenRsvpEvents()).available).toBe(false);
    expect(mocks.createServiceClient).not.toHaveBeenCalled();
    mocks.cookie.mockReturnValue({ value: await generatePasswordToken('test-password') });
    expect((await getOpenRsvpEvents()).available).toBe(true);
  });

  it('renders an honest unavailable page without an empty decline-capable form or private event names', async () => {
    const html = renderToStaticMarkup(await RsvpPage({ params: Promise.resolve({ locale: 'en' }) }));
    expect(html).toContain('RSVP details are being finalised');
    expect(html).toContain('href="/events"');
    expect(html).not.toContain('<form');
    expect(html).not.toContain('Villa Mangiacane');
  });

  it('renders date-only public choices without invented midnight times', async () => {
    linkPublicEvents();
    const { events } = await getOpenRsvpEvents();
    const html = renderToStaticMarkup(<NextIntlClientProvider locale="en" messages={messages}>
      <OpenRsvpForm events={events} />
    </NextIntlClientProvider>);
    expect(html).toContain('The welcome party');
    expect(html).toContain('Villa Corsini');
    expect(html).toContain('2027');
    expect(html).not.toContain('00:00');
    expect(html).not.toContain('12:00');
    expect(html).not.toContain('Villa Mangiacane');
  });
});
