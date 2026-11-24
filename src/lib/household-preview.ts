// ABOUTME: Fictional local planning data, imported by the server only and never used as authentication
import 'server-only';
import { CELEBRATIONS } from '@/config/celebrations';
import type { HouseholdRsvpData } from '@/types/household-rsvp';

export function getHouseholdPreview(scope: unknown): HouseholdRsvpData | null {
  if (process.env.NODE_ENV !== 'development') return null;
  const events = CELEBRATIONS.filter(e => e.audience === 'all-guests' || scope === 'both' ||
    (scope === 'roce' && e.key === 'roce') || (scope === 'pool' && e.key === 'pool-party'))
    .map(e => ({ id: `example-${e.key}`, name_en: e.title, event_date: e.date, location_name: e.venue }));
  const members = [{ id: 'example-alex', name: 'Alex Example' }, { id: 'example-sam', name: 'Sam Example' }];
  return { id: 'fictional-household', name: 'The Example household', members, events,
    reply: { guests: members.map(m => ({ id: m.id, dietaryRequirements: '', answers: events.map(e => ({ eventId: e.id, status: null })) })) } };
}
