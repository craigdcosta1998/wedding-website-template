// ABOUTME: User-supplied plans; private celebrations never enter a client-side event catalogue
import 'server-only';
import type { Celebration } from '@/types/celebrations';

export const CELEBRATIONS: readonly Celebration[] = [
  { key: 'roce', day: 1, date: '2027-09-12', title: 'The Roce', venue: 'Villa Mangiacane', audience: 'invitation-only' },
  { key: 'welcome-party', day: 2, date: '2027-09-13', title: 'The welcome party', venue: 'Serre Torrigiani', audience: 'all-guests' },
  { key: 'wedding', day: 3, date: '2027-09-14', title: 'The wedding', venue: 'Villa Corsini', audience: 'all-guests' },
  { key: 'pool-party', day: 4, date: '2027-09-15', title: 'The pool party', venue: 'Villa Mangiacane', audience: 'invitation-only' },
];
