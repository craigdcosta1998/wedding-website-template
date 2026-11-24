// ABOUTME: Every named person must explicitly answer every eligible event exactly once
import { z } from 'zod';
import type { HouseholdRsvpData } from '@/types/household-rsvp';

const schema = z.object({ guests: z.array(z.object({
  id: z.string().min(1).max(128),
  answers: z.array(z.object({ eventId: z.string().min(1).max(128), status: z.enum(['accepted', 'declined']) })).min(1).max(4),
  dietaryRequirements: z.string().trim().max(500),
})).min(1).max(20) });

export function validateHouseholdReply(value: unknown, context: Pick<HouseholdRsvpData, 'members' | 'events'>) {
  const result = schema.safeParse(value);
  if (!result.success) return { valid: false as const, error: 'Please answer every celebration for each person. Dietary notes must be 500 characters or fewer.' };
  const { guests } = result.data;
  const ids = new Set(guests.map(g => g.id));
  if (ids.size !== guests.length || ids.size !== context.members.length || context.members.some(m => !ids.has(m.id))) {
    return { valid: false as const, error: 'Your invitation has changed. Please reload it before replying.' };
  }
  const eventIds = new Set(context.events.map(e => e.id));
  if (guests.some(g => g.answers.length !== eventIds.size || new Set(g.answers.map(a => a.eventId)).size !== eventIds.size || g.answers.some(a => !eventIds.has(a.eventId)))) {
    return { valid: false as const, error: 'Your celebrations have changed. Please reload your invitation before replying.' };
  }
  return { valid: true as const, data: result.data };
}
