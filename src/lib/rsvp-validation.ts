// ABOUTME: Validation logic for open RSVP form submissions
import type { DietaryPreference } from '@/types/database';

export interface OpenRsvpGuest {
  firstName: string;
  lastName: string;
  selectedEventIds: string[];
  dietaryPreference: DietaryPreference;
  dietaryOther: string;
}

export interface OpenRsvpData {
  contactName: string;
  contactEmail: string;
  guests: OpenRsvpGuest[];
}

const MAX_CONTACT_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 100;
const MAX_DIETARY_LENGTH = 500;
const MAX_GUESTS = 20;
const MAX_EVENT_CHOICES = 4;
const MAX_EVENT_ID_LENGTH = 128;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateRsvpSubmission(data: unknown): { valid: boolean; error?: string } {
  if (!isRecord(data) || typeof data.contactName !== 'string' ||
      typeof data.contactEmail !== 'string' || !Array.isArray(data.guests)) {
    return { valid: false, error: 'Invalid RSVP details' };
  }
  if (!data.contactName.trim()) return { valid: false, error: 'Contact name is required' };
  if (data.contactName.trim().length > MAX_CONTACT_NAME_LENGTH) return { valid: false, error: 'Contact name is too long' };
  if (!data.contactEmail.trim()) return { valid: false, error: 'Contact email is required' };
  if (data.contactEmail.trim().length > MAX_EMAIL_LENGTH) return { valid: false, error: 'Email address is too long' };
  if (!EMAIL_REGEX.test(data.contactEmail.trim())) return { valid: false, error: 'Invalid email address' };
  if (data.guests.length === 0) return { valid: false, error: 'At least one guest is required' };
  if (data.guests.length > MAX_GUESTS) return { valid: false, error: `Maximum ${MAX_GUESTS} guests per submission` };

  for (const guest of data.guests) {
    if (!isRecord(guest) || typeof guest.firstName !== 'string' || typeof guest.lastName !== 'string' ||
        !Array.isArray(guest.selectedEventIds) || typeof guest.dietaryPreference !== 'string' ||
        typeof guest.dietaryOther !== 'string') {
      return { valid: false, error: 'Invalid guest details' };
    }
    if (!['none', 'vegetarian', 'vegan', 'other'].includes(guest.dietaryPreference)) {
      return { valid: false, error: 'Invalid dietary preference' };
    }
    if (guest.selectedEventIds.length > MAX_EVENT_CHOICES ||
        guest.selectedEventIds.some(id => typeof id !== 'string' || !id.trim() || id.length > MAX_EVENT_ID_LENGTH) ||
        new Set(guest.selectedEventIds).size !== guest.selectedEventIds.length) {
      return { valid: false, error: 'Invalid event selection' };
    }
    if (!guest.firstName.trim()) return { valid: false, error: 'Guest first name is required' };
    if (guest.firstName.trim().length > MAX_NAME_LENGTH) return { valid: false, error: 'Guest first name is too long' };
    if (!guest.lastName.trim()) return { valid: false, error: 'Guest last name is required' };
    if (guest.lastName.trim().length > MAX_NAME_LENGTH) return { valid: false, error: 'Guest last name is too long' };
    if (guest.selectedEventIds.length > 0 && guest.dietaryPreference === 'other' && !guest.dietaryOther.trim()) {
      return { valid: false, error: 'Please specify your dietary requirements' };
    }
    if (guest.dietaryOther && guest.dietaryOther.trim().length > MAX_DIETARY_LENGTH) {
      return { valid: false, error: 'Dietary requirements text is too long' };
    }
  }

  return { valid: true };
}
