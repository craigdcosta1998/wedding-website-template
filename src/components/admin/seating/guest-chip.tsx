// ABOUTME: A single selectable, draggable guest chip used in the unseated-guests sidebar
'use client';

import { useDraggable } from '@dnd-kit/core';
import { Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SeatingGuestRow } from './types';

interface GuestChipProps {
  guest: SeatingGuestRow;
  selected: boolean;
  dimmed: boolean;
  hasIssue: boolean;
  onSelect: () => void;
  onPinClick?: () => void;
}

export function GuestChip({ guest, selected, dimmed, hasIssue, onSelect, onPinClick }: GuestChipProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pool:${guest.id}`,
    data: { guestId: guest.id },
  });

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border pl-3 pr-1.5 py-1 text-sm',
        dimmed && 'opacity-25',
        isDragging && 'opacity-50'
      )}
    >
      <button
        ref={setNodeRef}
        type="button"
        onClick={onSelect}
        {...listeners}
        {...attributes}
        className={cn(
          'flex cursor-grab items-center gap-1.5 select-none',
          selected && 'font-semibold text-primary',
          hasIssue && 'text-destructive'
        )}
      >
        {guest.first_name} {guest.last_name}
        {guest.age_category !== 'adult' && (
          <span className="rounded bg-amber-100 px-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
            {guest.age_category}
          </span>
        )}
      </button>
      {onPinClick && (
        <button
          type="button"
          onClick={onPinClick}
          title="Pin to sit with…"
          className="text-muted-foreground hover:text-primary"
        >
          <Link2 className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
