// ABOUTME: Server-only schedule filtering; credential identity is deliberately undecided
import 'server-only';
import { CELEBRATIONS } from '@/config/celebrations';
import { createServiceClient, hasSupabaseServiceConfig } from '@/lib/supabase/server';
import type { CelebrationDetails, CelebrationKey } from '@/types/celebrations';

export function selectInvitedCelebrations(invitedKeys: readonly CelebrationKey[]) {
  const invited = new Set(invitedKeys);
  return CELEBRATIONS.filter(event => event.audience === 'all-guests' || invited.has(event.key));
}

async function resolveVerifiedInvitations(): Promise<readonly CelebrationKey[]> {
  // User deferred guest-vs-couple credentials. Never infer grants from a name,
  // query string, shared site password, legacy invitation tier, or RSVP selections.
  // Connect this boundary to verified per-event permissions after that decision.
  // Until then, invitation-only sections remain absent from the guest response.
  return [];
}

export async function getCelebrationsPageData(previewRequested: boolean) {
  const isPlanningPreview = process.env.NODE_ENV === 'development' && previewRequested;
  const celebrations = isPlanningPreview
    ? CELEBRATIONS
    : selectInvitedCelebrations(await resolveVerifiedInvitations());
  let details: CelebrationDetails[] = [];
  // Link existing records once detailed plans are ready; never infer a match by name.
  const eventIds = celebrations.flatMap(event => event.databaseEventId ? [event.databaseEventId] : []);
  if (eventIds.length && hasSupabaseServiceConfig()) {
    try {
      const supabase = await createServiceClient();
      const result = await supabase.from('events')
        .select('id,event_date,event_end_date,description_en,location_address,maps_url,dresscode_en,directions_en,parking_en')
        .in('id', eventIds);
      if (!result.error) details = (result.data ?? []).filter((detail: CelebrationDetails) => eventIds.includes(detail.id));
    } catch { /* The supplied dates and venues remain available while detail is pending. */ }
  }
  return { celebrations, details, isPlanningPreview };
}
