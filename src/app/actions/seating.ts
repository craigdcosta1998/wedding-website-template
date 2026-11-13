// ABOUTME: Server actions for the seating planner — tables, seats, guest placement, and pins
'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export interface SeatingActionResult {
  success: boolean;
  error?: string;
}

export interface PlaceInTableResult extends SeatingActionResult {
  seatId?: string;
}

const DEFAULT_SEAT_COUNT = 8;

export async function createTable(name: string, sortOrder: number): Promise<SeatingActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { data: table, error } = await supabase
      .from('seating_tables')
      .insert({ name, sort_order: sortOrder, fixed: false })
      .select()
      .single();
    if (error || !table) throw error || new Error('Failed to create table');

    const { error: seatsError } = await supabase.from('seating_seats').insert(
      Array.from({ length: DEFAULT_SEAT_COUNT }, (_, i) => ({
        table_id: table.id,
        seat_index: i,
      }))
    );
    if (seatsError) throw seatsError;

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to create table' };
  }
}

export async function renameTable(tableId: string, name: string): Promise<SeatingActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { error } = await supabase.from('seating_tables').update({ name }).eq('id', tableId);
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to rename table' };
  }
}

export async function updateTableNote(tableId: string, note: string): Promise<SeatingActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { error } = await supabase
      .from('seating_tables')
      .update({ note: note || null })
      .eq('id', tableId);
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update table note' };
  }
}

export async function deleteTable(tableId: string): Promise<SeatingActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { error } = await supabase.from('seating_tables').delete().eq('id', tableId);
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete table' };
  }
}

export async function addSeat(tableId: string): Promise<SeatingActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { data: seats, error: fetchError } = await supabase
      .from('seating_seats')
      .select('seat_index')
      .eq('table_id', tableId)
      .order('seat_index', { ascending: false })
      .limit(1);
    if (fetchError) throw fetchError;

    const nextIndex = seats && seats[0] ? seats[0].seat_index + 1 : 0;
    const { error } = await supabase
      .from('seating_seats')
      .insert({ table_id: tableId, seat_index: nextIndex });
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to add seat' };
  }
}

/** Removes the last empty seat in the table. Errors if every seat is occupied. */
export async function removeSeat(tableId: string): Promise<SeatingActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { data: emptySeats, error: fetchError } = await supabase
      .from('seating_seats')
      .select('id')
      .eq('table_id', tableId)
      .is('guest_id', null)
      .order('seat_index', { ascending: false })
      .limit(1);
    if (fetchError) throw fetchError;
    const targetSeat = emptySeats?.[0];
    if (!targetSeat) {
      return { success: false, error: 'No empty seat to remove — unseat someone first' };
    }

    const { error } = await supabase.from('seating_seats').delete().eq('id', targetSeat.id);
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to remove seat' };
  }
}

export async function placeGuest(guestId: string, seatId: string): Promise<SeatingActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { error } = await supabase.rpc('place_guest', { p_guest_id: guestId, p_seat_id: seatId });
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to seat guest' };
  }
}

export async function placeGuestInTable(guestId: string, tableId: string): Promise<PlaceInTableResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { data, error } = await supabase.rpc('place_guest_in_table', {
      p_guest_id: guestId,
      p_table_id: tableId,
    });
    if (error) throw error;
    return { success: true, seatId: data ?? undefined };
  } catch {
    return { success: false, error: 'Failed to seat guest' };
  }
}

export async function unseatGuest(guestId: string): Promise<SeatingActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { error } = await supabase.rpc('unseat_guest', { p_guest_id: guestId });
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to unseat guest' };
  }
}

export async function setSeatPreference(
  guestId: string,
  otherGuestId: string | null
): Promise<SeatingActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServiceClient();
    const { error } = await supabase
      .from('guests')
      .update({ seat_with_guest_id: otherGuestId })
      .eq('id', guestId);
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update seating preference' };
  }
}
