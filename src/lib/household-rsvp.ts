// ABOUTME: Load persisted attendance only for current verified members and eligible event IDs
import 'server-only';
import { getVerifiedHousehold } from './household-access';
import { createServiceClient } from './supabase/server';
import type { HouseholdRsvpData } from '@/types/household-rsvp';

export async function getHouseholdRsvpData(verified?: Awaited<ReturnType<typeof getVerifiedHousehold>>): Promise<HouseholdRsvpData | null> {
  const context = verified === undefined ? await getVerifiedHousehold() : verified;
  if (!context) return null;
  try {
    const events = context.celebrations.map(e => ({ id: e.databaseEventId, name_en: e.title, event_date: e.date, location_name: e.venue }));
    const db = await createServiceClient();
    const saved = await db.from('guest_events').select('guest_id,event_id,status')
      .in('guest_id', context.members.map(m => m.id)).in('event_id', events.map(e => e.id));
    if (saved.error || !saved.data) return null;
    const members = context.members.map(m => ({ id: m.id, name: `${m.first_name} ${m.last_name}` }));
    return {
      id: context.household.id, name: context.household.primary_contact_name, members, events,
      reply: { guests: context.members.map(m => ({ id: m.id, dietaryRequirements: m.dietary_restrictions ?? '',
        answers: events.map(e => {
          const row = saved.data.find((r: { guest_id: string; event_id: string; status: string }) => r.guest_id === m.id && r.event_id === e.id);
          return { eventId: e.id, status: row?.status === 'accepted' || row?.status === 'declined' ? row.status : null };
        }),
      })) },
    };
  } catch { return null; }
}
