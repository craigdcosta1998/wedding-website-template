// ABOUTME: Stable event keys keep invitations separate from attendance responses
export type CelebrationKey = 'roce' | 'welcome-party' | 'wedding' | 'pool-party';

export interface Celebration {
  key: CelebrationKey;
  day: number;
  date: string;
  title: string;
  venue: string;
  audience: 'all-guests' | 'invitation-only';
  databaseEventId?: string;
}

export interface CelebrationDetails {
  id: string;
  event_date: string;
  event_end_date: string | null;
  description_en: string | null;
  location_address: string;
  maps_url: string | null;
  dresscode_en: string | null;
  directions_en: string | null;
  parking_en: string | null;
}
