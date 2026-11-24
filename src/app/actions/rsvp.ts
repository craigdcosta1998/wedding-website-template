// ABOUTME: Retired unsigned RSVP mutation; responses require a verified existing household
'use server';
import type { OpenRsvpData } from '@/lib/rsvp-validation';
export type { OpenRsvpData, OpenRsvpGuest } from '@/lib/rsvp-validation';
export interface RsvpResult { success: boolean; error?: string }
// Keep the legacy import contract without creating households from a public payload.
export async function submitOpenRsvp(_data: OpenRsvpData, _locale: 'de' | 'en' = 'en'): Promise<RsvpResult> {
  void _data;
  void _locale;
  return { success: false, error: 'Please use your household invitation code to reply.' };
}
