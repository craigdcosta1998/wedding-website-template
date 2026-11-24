// ABOUTME: Server-only schedule filtering from verified household invitations
import 'server-only';
import { CELEBRATIONS } from '@/config/celebrations';
import { createServiceClient, hasSupabaseServiceConfig } from '@/lib/supabase/server';
import type { CelebrationDetails, CelebrationKey } from '@/types/celebrations';
import { getVerifiedHousehold } from '@/lib/household-access';

export function selectInvitedCelebrations(invitedKeys: readonly CelebrationKey[]) {
  const invited = new Set(invitedKeys);
  return CELEBRATIONS.filter(event => event.audience === 'all-guests' || invited.has(event.key));
}

export async function getCelebrationsPageData(previewRequested: boolean) {
  const isPlanningPreview = process.env.NODE_ENV === 'development' && previewRequested;
  const household = isPlanningPreview ? null : await getVerifiedHousehold();
  const celebrations = isPlanningPreview
    ? CELEBRATIONS
    : household?.celebrations ?? selectInvitedCelebrations([]);
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
