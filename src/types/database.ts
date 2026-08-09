// ABOUTME: TypeScript types for Supabase database schema

export type InvitationType = 'ceremony_reception' | 'reception_only' | 'all_events';
export type RsvpStatus = 'pending' | 'accepted' | 'declined';
export type AgeCategory = 'adult' | 'child' | 'toddler';
export type MealChoice = 'beef' | 'fish' | 'vegetarian' | 'vegan';
export type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'other';
export type EventVisibility = 'all' | 'ceremony_reception' | 'all_events';

export interface Household {
  id: string;
  household_code: string;
  primary_contact_name: string;
  primary_contact_email: string | null;
  invitation_type: InvitationType;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  household_id: string;
  first_name: string;
  last_name: string;
  rsvp_status: RsvpStatus;
  age_category: AgeCategory;
  meal_choice: MealChoice | null;
  dietary_restrictions: string | null;
  is_plus_one: boolean;
  seat_with_guest_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name_de: string;
  name_en: string;
  description_de: string | null;
  description_en: string | null;
  event_date: string;
  location_name: string;
  location_address: string;
  maps_url: string | null;
  event_end_date: string | null;
  dresscode_de: string | null;
  dresscode_en: string | null;
  directions_de: string | null;
  directions_en: string | null;
  parking_de: string | null;
  parking_en: string | null;
  visibility: EventVisibility;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GuestEvent {
  id: string;
  guest_id: string;
  event_id: string;
  status: string;
  created_at: string;
}

export interface HouseholdWithGuests extends Household {
  guests: Guest[];
}

export interface SeatingTable {
  id: string;
  name: string;
  note: string | null;
  fixed: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SeatingSeat {
  id: string;
  table_id: string;
  seat_index: number;
  guest_id: string | null;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      households: {
        Row: Household;
        Insert: Omit<Household, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Household, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      guests: {
        Row: Guest;
        Insert: Omit<Guest, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Guest, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: 'guests_household_id_fkey';
            columns: ['household_id'];
            referencedRelation: 'households';
            referencedColumns: ['id'];
          }
        ];
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      guest_events: {
        Row: GuestEvent;
        Insert: Omit<GuestEvent, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GuestEvent, 'id' | 'created_at'>>;
        Relationships: [
          {
            foreignKeyName: 'guest_events_guest_id_fkey';
            columns: ['guest_id'];
            referencedRelation: 'guests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'guest_events_event_id_fkey';
            columns: ['event_id'];
            referencedRelation: 'events';
            referencedColumns: ['id'];
          }
        ];
      };
      seating_tables: {
        Row: SeatingTable;
        Insert: Omit<SeatingTable, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SeatingTable, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      seating_seats: {
        Row: SeatingSeat;
        Insert: Omit<SeatingSeat, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SeatingSeat, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: 'seating_seats_table_id_fkey';
            columns: ['table_id'];
            referencedRelation: 'seating_tables';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'seating_seats_guest_id_fkey';
            columns: ['guest_id'];
            referencedRelation: 'guests';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      place_guest: {
        Args: { p_guest_id: string; p_seat_id: string };
        Returns: void;
      };
      place_guest_in_table: {
        Args: { p_guest_id: string; p_table_id: string };
        Returns: string;
      };
      unseat_guest: {
        Args: { p_guest_id: string };
        Returns: void;
      };
    };
    Enums: {
      invitation_type: InvitationType;
      rsvp_status: RsvpStatus;
      meal_choice: MealChoice;
      event_visibility: EventVisibility;
    };
    CompositeTypes: Record<string, never>;
  };
};
