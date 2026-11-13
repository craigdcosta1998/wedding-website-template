// ABOUTME: Our Story content; empty paragraphs and null photographs intentionally stay pending
import type { EditorialPhotoSource } from '@/types/editorial';

interface StoryChapter {
  id: string;
  title: string;
  period: string | null;
  paragraphs: string[];
  photo: EditorialPhotoSource | null;
  caption: string | null;
  aspect: 'landscape' | 'portrait' | 'square';
  tone: 'clay' | 'olive' | 'paper';
}

export const STORY_CONTENT: {
  intro: string;
  portrait: EditorialPhotoSource | null;
  chapters: StoryChapter[];
} = {
  intro: 'The moments that brought us here.',
  portrait: null,
  // Add only user-provided history, dates, photographs, and captions. Add chapters as needed.
  chapters: [
    { id: 'the-beginning', title: 'How it all began', period: null, paragraphs: [], photo: null, caption: null, aspect: 'landscape', tone: 'clay' },
    { id: 'life-together', title: 'Life together', period: null, paragraphs: [], photo: null, caption: null, aspect: 'portrait', tone: 'olive' },
    { id: 'the-proposal', title: 'The proposal', period: null, paragraphs: [], photo: null, caption: null, aspect: 'square', tone: 'paper' },
  ],
};
