// ABOUTME: Shared prop/state shapes for the admin seating planner components
import type { AgeCategory } from '@/types/database';

export interface SeatingGuestRow {
  id: string;
  first_name: string;
  last_name: string;
  household_id: string;
  age_category: AgeCategory;
  seat_with_guest_id: string | null;
}

export interface SeatingTableRow {
  id: string;
  name: string;
  note: string | null;
  fixed: boolean;
  sort_order: number;
}

export interface SeatingSeatRow {
  id: string;
  table_id: string;
  seat_index: number;
  guest_id: string | null;
}
