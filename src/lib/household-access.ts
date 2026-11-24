// ABOUTME: Fresh server-only household membership and event grants; attendance never grants invitations
import 'server-only';
import { cookies } from 'next/headers';
import { CELEBRATIONS } from '@/config/celebrations';
import { getSession, hasHouseholdSessionConfig } from '@/lib/session';
import { createServiceClient, hasSupabaseServiceConfig } from '@/lib/supabase/server';
import { verifyPasswordToken } from '@/lib/password';

export interface HouseholdMember {
  id: string;
  first_name: string;
  last_name: string;
  dietary_restrictions: string | null;
}
export interface EventLink { celebration_key: string; event_id: string }

export async function hasSiteAccess() {
  const password = process.env.SITE_PASSWORD;
  if (!password) return true;
  const token = (await cookies()).get('site_access')?.value;
  return Boolean(token && await verifyPasswordToken(token, password));
}

export function hasHouseholdAccessConfig() {
  return hasHouseholdSessionConfig() && hasSupabaseServiceConfig();
}

export async function getVerifiedHousehold() {
  if (!hasHouseholdAccessConfig() || !await hasSiteAccess()) return null;
  const session = await getSession();
  if (!session) return null;
  try {
    const db = await createServiceClient();
    const household = await db.from('households')
      .select('id,auth_version,primary_contact_name,primary_contact_email')
      .eq('id', session.householdId).eq('auth_version', session.authVersion).maybeSingle();
    if (household.error || !household.data) return null;
    const members = await db.from('guests').select('id,first_name,last_name,dietary_restrictions')
      .eq('household_id', session.householdId).order('created_at').order('id');
    const grants = await db.from('household_event_invitations').select('event_id').eq('household_id', session.householdId);
    const links = await db.from('celebration_event_links').select('celebration_key,event_id');
    if (members.error || !members.data?.length || grants.error || !grants.data || links.error || !links.data) return null;
    const grantedIds = new Set(grants.data.map((g: { event_id: string }) => g.event_id));
    const eventLinks = links.data as EventLink[];
    const celebrations = CELEBRATIONS.flatMap(event => {
      const link = eventLinks.find(item => item.celebration_key === event.key);
      return link && (event.audience === 'all-guests' || grantedIds.has(link.event_id))
        ? [{ ...event, databaseEventId: link.event_id }] : [];
    });
    // Partial setup cannot silently omit a common celebration from RSVP.
    if (!CELEBRATIONS.filter(e => e.audience === 'all-guests').every(e => celebrations.some(c => c.key === e.key))) return null;
    return { household: household.data as { id: string; auth_version: string; primary_contact_name: string; primary_contact_email: string | null },
      members: members.data as HouseholdMember[], celebrations };
  } catch { return null; }
}
