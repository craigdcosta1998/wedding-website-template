// ABOUTME: Legacy public action must never bypass household authentication
import { expect, it, vi } from 'vitest';
const create = vi.hoisted(() => vi.fn());
vi.mock('@/lib/supabase/server', () => ({ createServiceClient: create }));
import { submitOpenRsvp } from './rsvp';
import type { OpenRsvpData } from '@/lib/rsvp-validation';
it.each([null, { guests: [] }, { contactName: 'Example', contactEmail: 'example@example.test', guests: [{ selectedEventIds: ['private'] }] }])('refuses all legacy unsigned submissions without writes', async payload => {
  expect(await submitOpenRsvp(payload as unknown as OpenRsvpData)).toEqual({ success: false, error: 'Please use your household invitation code to reply.' });
  expect(create).not.toHaveBeenCalled();
});
