// ABOUTME: Minimal verified-household form data; no invitation codes or signing metadata reach clients
import type { RsvpEvent } from './rsvp';
export type AttendanceAnswer = 'accepted' | 'declined';
export interface HouseholdReply {
  guests: { id: string; answers: { eventId: string; status: AttendanceAnswer | null }[]; dietaryRequirements: string }[];
}
export interface HouseholdRsvpData {
  id: string;
  name: string;
  members: { id: string; name: string }[];
  events: RsvpEvent[];
  reply: HouseholdReply;
}
