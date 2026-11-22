// ABOUTME: Privileged RSVP writes must reject unavailable, forged or private event selections first
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OpenRsvpData } from '@/lib/rsvp-validation';

const mocks = vi.hoisted(() => ({ catalogue: vi.fn(), createServiceClient: vi.fn(), from: vi.fn(), send: vi.fn() }));
vi.mock('@/lib/rsvp-access', () => ({ getOpenRsvpEvents: mocks.catalogue }));
vi.mock('@/lib/supabase/server', () => ({ createServiceClient: mocks.createServiceClient }));
vi.mock('@/lib/email', () => ({ sendRsvpConfirmation: mocks.send }));
import { submitOpenRsvp } from './rsvp';

function submission(selectedEventIds = ['wedding-id']): OpenRsvpData {
  return {
    contactName: 'Test Guest', contactEmail: 'test@example.com',
    guests: [{ firstName: 'Test', lastName: 'Guest', selectedEventIds, dietaryPreference: 'none', dietaryOther: '' }],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.catalogue.mockResolvedValue({ available: true, events: [
    { id: 'wedding-id', name_en: 'The wedding', event_date: '2027-09-14', location_name: 'Villa Corsini' },
  ] });
  mocks.createServiceClient.mockResolvedValue({ from: mocks.from });
  mocks.from.mockImplementation((table: string) => {
    if (table === 'households') return { insert: () => ({ select: () => ({ single: async () => ({ data: { id: 'household-id' }, error: null }) }) }) };
    if (table === 'guests') return { insert: () => ({ select: async () => ({ data: [{ id: 'guest-id' }], error: null }) }) };
    return { insert: async () => ({ error: null }) };
  });
  mocks.send.mockResolvedValue({ success: true });
});

describe('RSVP submission boundaries', () => {
  it.each(['private-id', 'unknown-id'])('rejects %s before any privileged write', async id => {
    expect((await submitOpenRsvp(submission([id]))).success).toBe(false);
    expect(mocks.createServiceClient).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it.each([{ ids: ['wedding-id'] }, { ids: [] }])('refuses responses when the catalogue is unavailable, including declines: $ids', async ({ ids }) => {
    mocks.catalogue.mockResolvedValue({ available: false, events: [] });
    expect((await submitOpenRsvp(submission(ids))).success).toBe(false);
    expect(mocks.createServiceClient).not.toHaveBeenCalled();
  });

  it('rejects malformed action payloads and unsupported locales without throwing or writing', async () => {
    expect((await submitOpenRsvp(null as unknown as OpenRsvpData)).success).toBe(false);
    expect((await submitOpenRsvp(submission(), 'de')).success).toBe(false);
    expect(mocks.createServiceClient).not.toHaveBeenCalled();
  });

  it.each([{ ids: ['wedding-id'] }, { ids: [] }])('preserves eligible attendance and decline submissions: $ids', async ({ ids }) => {
    expect(await submitOpenRsvp(submission(ids))).toEqual({ success: true });
    expect(mocks.from).toHaveBeenCalledWith('households');
    expect(mocks.from).toHaveBeenCalledWith('guests');
    if (ids.length) expect(mocks.from).toHaveBeenCalledWith('guest_events');
    else expect(mocks.from).not.toHaveBeenCalledWith('guest_events');
    expect(mocks.send).toHaveBeenCalledWith(expect.objectContaining({
      locale: 'en', guests: [expect.objectContaining({ eventNames: ids.length ? ['The wedding'] : [] })],
    }));
  });
});
