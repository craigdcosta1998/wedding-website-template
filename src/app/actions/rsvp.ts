// ABOUTME: Server action for open RSVP form submission — creates household, guests, and guest_events
'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { sendRsvpConfirmation } from '@/lib/email';
import { validateRsvpSubmission } from '@/lib/rsvp-validation';
import type { OpenRsvpData } from '@/lib/rsvp-validation';

export type { OpenRsvpData, OpenRsvpGuest } from '@/lib/rsvp-validation';

export interface RsvpResult {
  success: boolean;
  error?: string;
}

function generateHouseholdCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randomBytes = new Uint8Array(6);
  crypto.getRandomValues(randomBytes);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[randomBytes[i]! % chars.length];
  }
  return code;
}

function buildDietaryString(preference: string, other: string): string | null {
  if (preference === 'none') return null;
  if (preference === 'other') return other.trim() || null;
  return preference;
}

export async function submitOpenRsvp(
  data: OpenRsvpData,
  locale: 'de' | 'en' = 'de'
): Promise<RsvpResult> {
  const validation = validateRsvpSubmission(data);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const supabase = await createServiceClient();

    const { data: household, error: householdError } = await supabase
      .from('households')
      .insert({
        household_code: generateHouseholdCode(),
        primary_contact_name: data.contactName.trim(),
        primary_contact_email: data.contactEmail.trim(),
        invitation_type: 'all_events',
      })
      .select()
      .single();

    if (householdError || !household) {
      throw householdError || new Error('Failed to create household');
    }

    const guestInserts = data.guests.map((guest) => ({
      household_id: household.id,
      first_name: guest.firstName.trim(),
      last_name: guest.lastName.trim(),
      rsvp_status: guest.selectedEventIds.length > 0 ? 'accepted' as const : 'declined' as const,
      meal_choice: null,
      dietary_restrictions: guest.selectedEventIds.length > 0
        ? buildDietaryString(guest.dietaryPreference, guest.dietaryOther)
        : null,
      is_plus_one: false,
    }));

    const { data: insertedGuests, error: guestsError } = await supabase
      .from('guests')
      .insert(guestInserts)
      .select('id');

    if (guestsError || !insertedGuests) {
      throw guestsError || new Error('Failed to create guests');
    }

    // Build guest_events rows: for each guest, insert a row per selected event
    const guestEventInserts = insertedGuests.flatMap((insertedGuest, index) => {
      const guest = data.guests[index];
      if (!guest) return [];
      return guest.selectedEventIds.map((eventId) => ({
        guest_id: insertedGuest.id,
        event_id: eventId,
        status: 'accepted',
      }));
    });

    if (guestEventInserts.length > 0) {
      const { error: guestEventsError } = await supabase
        .from('guest_events')
        .insert(guestEventInserts);

      if (guestEventsError) {
        throw guestEventsError;
      }
    }

    // Fetch event names for the confirmation email
    const allSelectedEventIds = [...new Set(data.guests.flatMap((g) => g.selectedEventIds))];
    let eventNameMap: Record<string, string> = {};

    if (allSelectedEventIds.length > 0) {
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, name_de, name_en')
        .in('id', allSelectedEventIds);

      if (eventsData) {
        eventNameMap = Object.fromEntries(
          eventsData.map((e) => [e.id, locale === 'de' ? e.name_de : e.name_en])
        );
      }
    }

    if (data.contactEmail.trim()) {
      await sendRsvpConfirmation({
        to: data.contactEmail.trim(),
        householdName: data.contactName.trim(),
        guests: data.guests.map((g) => ({
          name: `${g.firstName} ${g.lastName}`,
          status: g.selectedEventIds.length > 0 ? 'accepted' as const : 'declined' as const,
          mealChoice: null,
          dietaryRestrictions: g.selectedEventIds.length > 0
            ? buildDietaryString(g.dietaryPreference, g.dietaryOther)
            : null,
          eventNames: g.selectedEventIds.map((id) => eventNameMap[id] || id),
        })),
        locale,
      });
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to submit RSVP' };
  }
}
