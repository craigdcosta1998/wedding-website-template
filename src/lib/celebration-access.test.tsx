// ABOUTME: Invitation-only celebrations must not leak through guest HTML or detail payloads
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CelebrationDetails, CelebrationKey } from '@/types/celebrations';

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  createServiceClient: vi.fn(),
  from: vi.fn(),
  select: vi.fn(),
  in: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  hasSupabaseServiceConfig: mocks.configured,
  createServiceClient: mocks.createServiceClient,
}));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('@/i18n/routing', () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));

import { CELEBRATIONS } from '@/config/celebrations';
import { getCelebrationsPageData, selectInvitedCelebrations } from './celebration-access';
import EventsPage from '@/app/[locale]/events/page';
import { CelebrationsSchedule } from '@/components/editorial/celebrations-schedule';

async function page(preview?: string | string[]) {
  return renderToStaticMarkup(await EventsPage({
    params: Promise.resolve({ locale: 'en' }), searchParams: Promise.resolve({ preview }),
  }));
}

function detail(id: string): CelebrationDetails {
  return {
    id, event_date: '2027-09-14T14:00:00Z', event_end_date: null,
    description_en: 'Confirmed details', location_address: 'Confirmed address', maps_url: null,
    dresscode_en: null, directions_en: null, parking_en: null,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NODE_ENV', 'test');
  mocks.configured.mockReturnValue(false);
  mocks.createServiceClient.mockResolvedValue({ from: mocks.from });
  mocks.from.mockReturnValue({ select: mocks.select });
  mocks.select.mockReturnValue({ in: mocks.in });
  mocks.in.mockResolvedValue({ data: [], error: null });
});

afterEach(() => {
  for (const event of CELEBRATIONS) delete event.databaseEventId;
  vi.unstubAllEnvs();
});

describe('celebration invitation filtering', () => {
  it('shows only the common celebrations without verified invitations', () => {
    expect(selectInvitedCelebrations([]).map(event => [event.date, event.title, event.venue])).toEqual([
      ['2027-09-13', 'The welcome party', 'Serre Torrigiani'],
      ['2027-09-14', 'The wedding', 'Villa Corsini'],
    ]);
  });

  it.each([
    { grants: ['roce'], keys: ['roce', 'welcome-party', 'wedding'] },
    { grants: ['pool-party'], keys: ['welcome-party', 'wedding', 'pool-party'] },
    { grants: ['roce', 'pool-party'], keys: ['roce', 'welcome-party', 'wedding', 'pool-party'] },
  ])('supports independent invitations for $grants without assigning any guests', ({ grants, keys }) => {
    expect(selectInvitedCelebrations(grants as CelebrationKey[]).map(event => event.key)).toEqual(keys);
  });

  it('does not treat the legacy all_events RSVP tier as a grant', () => {
    expect(selectInvitedCelebrations(['all_events'] as unknown as CelebrationKey[])).toHaveLength(2);
  });

  it('omits private titles, venues, sections, and index links from the guest HTML', async () => {
    const html = await page();
    expect(html).toContain('Serre Torrigiani');
    expect(html).toContain('Villa Corsini');
    expect(html).toMatch(/Monday,? 13 September 2027/);
    expect(html).toMatch(/Tuesday,? 14 September 2027/);
    for (const privateText of ['Villa Mangiacane', 'The Roce', 'The pool party', 'id="roce"', '#pool-party']) {
      expect(html).not.toContain(privateText);
    }
    expect(html).not.toContain('Planning preview');
    expect(mocks.createServiceClient).not.toHaveBeenCalled();
  });

  it('refuses the planning query in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const html = await page('planning');
    expect(html).not.toContain('Villa Mangiacane');
    expect(html).not.toContain('Planning preview');
    expect(html).toContain('Serre Torrigiani');
  });

  it('shows all four supplied days only in the explicit development planning preview', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(await page()).not.toContain('Villa Mangiacane');
    const html = await page('planning');
    expect(html).toContain('Planning preview');
    expect(html).toContain('The Roce');
    expect(html).toMatch(/Sunday,? 12 September 2027/);
    expect(html).toMatch(/Wednesday,? 15 September 2027/);
    expect(html).toContain('The pool party');
    expect(html.match(/aria-labelledby="(?:roce|welcome-party|wedding|pool-party)-title"/g)).toHaveLength(4);
  });

  it('does not accept duplicate or different preview parameters as an access grant', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(await page(['planning', 'planning'])).not.toContain('Villa Mangiacane');
    expect(await page('all_events')).not.toContain('Villa Mangiacane');
  });

  it('works without database access until existing event records are deliberately linked', async () => {
    mocks.configured.mockReturnValue(true);
    const result = await getCelebrationsPageData(false);
    expect(result.celebrations).toHaveLength(2);
    expect(result.details).toEqual([]);
    expect(mocks.createServiceClient).not.toHaveBeenCalled();
  });

  it('requests details only for permitted records and removes unexpected records from the payload', async () => {
    mocks.configured.mockReturnValue(true);
    CELEBRATIONS.find(event => event.key === 'roce')!.databaseEventId = 'private-record';
    CELEBRATIONS.find(event => event.key === 'wedding')!.databaseEventId = 'wedding-record';
    mocks.in.mockResolvedValue({ data: [detail('private-record'), detail('wedding-record')], error: null });
    const result = await getCelebrationsPageData(false);
    expect(mocks.in).toHaveBeenCalledWith('id', ['wedding-record']);
    expect(result.details.map(record => record.id)).toEqual(['wedding-record']);
  });

  it('keeps private sections absent if the detail source fails', async () => {
    mocks.configured.mockReturnValue(true);
    CELEBRATIONS.find(event => event.key === 'wedding')!.databaseEventId = 'wedding-record';
    mocks.in.mockRejectedValue(new Error('Unavailable'));
    const html = await page();
    expect(html).toContain('Villa Corsini');
    expect(html).not.toContain('Villa Mangiacane');
    expect(html).not.toContain('Event details');
  });

  it('renders only confirmed linked details and rejects executable map URLs', () => {
    const wedding = { ...CELEBRATIONS.find(event => event.key === 'wedding')!, databaseEventId: 'wedding-record' };
    const record = { ...detail('wedding-record'), maps_url: 'javascript:alert(1)' };
    const unsafeHtml = renderToStaticMarkup(<CelebrationsSchedule celebrations={[wedding]} details={[record]} />);
    expect(unsafeHtml).toContain('Confirmed address');
    expect(unsafeHtml).toContain('16:00');
    expect(unsafeHtml).not.toContain('javascript:');
    expect(unsafeHtml).not.toContain('View map');
    record.maps_url = 'https://example.com/map';
    const safeHtml = renderToStaticMarkup(<CelebrationsSchedule celebrations={[wedding]} details={[record]} />);
    expect(safeHtml).toContain('href="https://example.com/map"');
  });
});
