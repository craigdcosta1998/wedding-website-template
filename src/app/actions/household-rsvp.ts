// ABOUTME: Authenticated complete-household replies use a single database transaction
'use server';
import { revalidatePath } from 'next/cache';
import { getVerifiedHousehold } from '@/lib/household-access';
import { validateHouseholdReply } from '@/lib/household-rsvp-validation';
import { createServiceClient } from '@/lib/supabase/server';
import type { RsvpResult } from './rsvp';

export async function submitHouseholdRsvp(value: unknown): Promise<RsvpResult> {
  try {
    const context = await getVerifiedHousehold();
    if (!context) return { success: false, error: 'Please reopen your invitation using your household code.' };
    const validation = validateHouseholdReply(value, {
      members: context.members.map(m => ({ id: m.id, name: `${m.first_name} ${m.last_name}` })),
      events: context.celebrations.map(e => ({ id: e.databaseEventId, name_en: e.title, event_date: e.date, location_name: e.venue })),
    });
    if (!validation.valid) return { success: false, error: validation.error };
    const db = await createServiceClient();
    const result = await db.rpc('save_household_rsvp', {
      p_household_id: context.household.id,
      p_auth_version: context.household.auth_version,
      p_answers: validation.data.guests,
    });
    if (result.error || result.data !== true) return { success: false, error: 'Your responses could not be saved. Keep your choices here and try again, or reload your invitation if its details have changed.' };
    revalidatePath('/en/rsvp');
    revalidatePath('/en/events');
    return { success: true };
  } catch { return { success: false, error: 'Your responses could not be saved. Please try again.' }; }
}
