// ABOUTME: Household writes must reject identity/roster/event tampering and report failed transactions honestly
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ access: vi.fn(), rpc: vi.fn(), create: vi.fn(), refresh: vi.fn(), from: vi.fn() }));
vi.mock('@/lib/household-access', () => ({ getVerifiedHousehold: mocks.access }));
vi.mock('@/lib/supabase/server', () => ({ createServiceClient: mocks.create }));
vi.mock('next/cache', () => ({ revalidatePath: mocks.refresh }));
import { submitHouseholdRsvp } from '@/app/actions/household-rsvp';
import { getHouseholdRsvpData } from './household-rsvp';
import { getHouseholdPreview } from './household-preview';
const members = [{ id: 'g1', first_name: 'Alex', last_name: 'Example', dietary_restrictions: null },
  { id: 'g2', first_name: 'Sam', last_name: 'Example', dietary_restrictions: 'Vegetarian' }];
const celebrations = [{ key: 'welcome-party', databaseEventId: 'e1', title: 'Welcome', date: '2027-09-13', venue: 'Approved venue' },
  { key: 'wedding', databaseEventId: 'e2', title: 'Wedding', date: '2027-09-14', venue: 'Approved venue' }];
const context = { household: { id: 'h1', auth_version: 'v1', primary_contact_name: 'Example household' }, members, celebrations };
const reply = () => ({ guests: [
  { id: 'g1', dietaryRequirements: 'Allergy', answers: [{ eventId: 'e1', status: 'accepted' }, { eventId: 'e2', status: 'declined' }] },
  { id: 'g2', dietaryRequirements: '', answers: [{ eventId: 'e1', status: 'declined' }, { eventId: 'e2', status: 'accepted' }] },
] });
beforeEach(() => {
  vi.clearAllMocks(); mocks.access.mockResolvedValue(context);
  mocks.rpc.mockResolvedValue({ data: true, error: null });
  mocks.create.mockResolvedValue({ rpc: mocks.rpc, from: mocks.from });
});
afterEach(() => vi.unstubAllEnvs());
describe('household RSVP transaction boundary', () => {
  it('refuses expired/missing identity before privileged writes', async () => {
    mocks.access.mockResolvedValue(null);
    expect((await submitHouseholdRsvp(reply())).success).toBe(false);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it.each(['foreign-member','missing-member','duplicate-member','private-event','duplicate-event','missing-answer','unanswered','invalid-status','oversized-diet'])('rejects %s before the transaction', async kind => {
    const data = reply();
    if (kind === 'foreign-member') data.guests[0]!.id = 'foreign';
    if (kind === 'missing-member') data.guests.pop();
    if (kind === 'duplicate-member') data.guests[1]!.id = 'g1';
    if (kind === 'private-event') data.guests[0]!.answers[0]!.eventId = 'private';
    if (kind === 'duplicate-event') data.guests[0]!.answers[1]!.eventId = 'e1';
    if (kind === 'missing-answer') data.guests[0]!.answers.pop();
    if (kind === 'unanswered') data.guests[0]!.answers[0]!.status = '';
    if (kind === 'invalid-status') data.guests[0]!.answers[0]!.status = 'pending';
    if (kind === 'oversized-diet') data.guests[0]!.dietaryRequirements = 'a'.repeat(501);
    expect((await submitHouseholdRsvp(data)).success).toBe(false);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it('passes each named member by stable ID, including independent attendance choices', async () => {
    const data = reply(); data.guests.reverse();
    expect(await submitHouseholdRsvp(data)).toEqual({ success: true });
    expect(mocks.rpc).toHaveBeenCalledWith('save_household_rsvp', {
      p_household_id: 'h1', p_auth_version: 'v1', p_answers: data.guests,
    });
    expect(mocks.refresh).toHaveBeenCalledWith('/en/rsvp');
  });
  it('reports revocation/membership changes or database failure without success', async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: new Error('Grant revoked during transaction') });
    expect((await submitHouseholdRsvp(reply())).success).toBe(false);
    expect(mocks.refresh).not.toHaveBeenCalled();
  });
});
describe('saved attendance and fictional preview', () => {
  it('queries attendance using both current member IDs and eligible event IDs', async () => {
    const filters: unknown[] = [];
    const query = { select: () => query, in: (key: string, values: string[]) => { filters.push([key, values]); return query; },
      then: (resolve: (r: unknown) => unknown) => Promise.resolve({ error: null, data: [
        { guest_id: 'g1', event_id: 'e1', status: 'accepted' }, { guest_id: 'foreign', event_id: 'e2', status: 'accepted' },
      ] }).then(resolve) };
    mocks.from.mockReturnValue(query);
    const data = await getHouseholdRsvpData();
    expect(filters).toEqual([['guest_id', ['g1','g2']], ['event_id', ['e1','e2']]]);
    expect(data?.reply.guests[0]?.answers).toEqual([{ eventId: 'e1', status: 'accepted' }, { eventId: 'e2', status: null }]);
    expect(data?.members.map(m => m.id)).toEqual(['g1','g2']);
  });
  it('does not substitute empty answers after a failed attendance query', async () => {
    const query = { select: () => query, in: () => query, then: (resolve: (r: unknown) => unknown) => Promise.resolve({ data: null, error: new Error('Offline') }).then(resolve) };
    mocks.from.mockReturnValue(query);
    expect(await getHouseholdRsvpData()).toBeNull();
  });
  it('refuses fictional preview in production and supports independent synthetic grants only in development', () => {
    vi.stubEnv('NODE_ENV', 'production'); expect(getHouseholdPreview('both')).toBeNull();
    vi.stubEnv('NODE_ENV', 'development');
    expect(getHouseholdPreview('roce')?.events.map(e => e.id)).toEqual(['example-roce','example-welcome-party','example-wedding']);
    expect(getHouseholdPreview('pool')?.events.map(e => e.id)).toEqual(['example-welcome-party','example-wedding','example-pool-party']);
  });
});
