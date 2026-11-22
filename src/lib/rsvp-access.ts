// ABOUTME: Fail-closed public RSVP catalogue shared by the page and submission action
import 'server-only';
import { cookies } from 'next/headers';
import { selectInvitedCelebrations } from '@/lib/celebration-access';
import { verifyPasswordToken } from '@/lib/password';
import { createServiceClient, hasSupabaseServiceConfig } from '@/lib/supabase/server';
import type { RsvpEvent } from '@/types/rsvp';

export async function getOpenRsvpEvents(): Promise<{ available: boolean; events: RsvpEvent[] }> {
  const unavailable = { available: false, events: [] };
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword) {
    const token = (await cookies()).get('site_access')?.value;
    if (!token || !(await verifyPasswordToken(token, sitePassword))) return unavailable;
  }

  // Open RSVP never grants selective invitations or uses the planning preview.
  const celebrations = selectInvitedCelebrations([]);
  const eventIds = celebrations.flatMap(event => event.databaseEventId ? [event.databaseEventId] : []);
  if (!celebrations.length || eventIds.length !== celebrations.length ||
      new Set(eventIds).size !== celebrations.length || !hasSupabaseServiceConfig()) {
    return unavailable;
  }

  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from('events').select('id').in('id', eventIds);
    if (error || !data) return unavailable;
    const foundIds = new Set(data.map((event: { id: string }) => event.id));
    if (!eventIds.every(id => foundIds.has(id))) return unavailable;

    // Database IDs connect persistence only; legacy labels/times cannot replace approved plans.
    return {
      available: true,
      events: celebrations.map(event => ({
        id: event.databaseEventId!, name_en: event.title,
        event_date: event.date, location_name: event.venue,
      })),
    };
  } catch {
    return unavailable;
  }
}
