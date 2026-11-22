// ABOUTME: Approved accommodation recommendations; unknown hotels and booking arrangements stay pending
export type StayArea = 'florence' | 'countryside';

export interface StayRecommendation {
  id: string;
  area: StayArea;
  name: string;
  description: string;
  bookingUrl?: string;
}

export const STAY_AREAS: readonly { key: StayArea; title: string; pending: string }[] = [
  { key: 'florence', title: 'In Florence', pending: 'Our Florence recommendations are being gathered. We’ll share them here once confirmed.' },
  { key: 'countryside', title: 'In the countryside', pending: 'Countryside recommendations are still to come. We’ll share the details here once confirmed.' },
];

export const STAY_CONTENT: { recommendations: readonly StayRecommendation[] } = {
  // Add only approved names, descriptions and official booking links. Do not invent prices or ratings.
  recommendations: [],
};
