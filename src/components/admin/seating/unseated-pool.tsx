// ABOUTME: Sidebar listing accepted guests who don't have a seat yet, with search
'use client';

import { useDroppable } from '@dnd-kit/core';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GuestChip } from './guest-chip';
import type { SeatingGuestRow } from './types';

interface UnseatedPoolProps {
  guests: SeatingGuestRow[];
  selectedGuestId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  issueGuestIds: Set<string>;
  onSelect: (guestId: string) => void;
  onPinClick: (guestId: string) => void;
  onUnseatHere: () => void;
  showUnseatButton: boolean;
}

export function UnseatedPool({
  guests,
  selectedGuestId,
  searchQuery,
  onSearchChange,
  issueGuestIds,
  onSelect,
  onPinClick,
  onUnseatHere,
  showUnseatButton,
}: UnseatedPoolProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'pool' });
  const query = searchQuery.trim().toLowerCase();
  const sorted = [...guests].sort((a, b) =>
    `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`, 'de')
  );

  return (
    <div className="sticky top-20 rounded-lg border bg-card p-4">
      <h2 className="mb-1 text-sm font-medium text-muted-foreground">Unseated ({guests.length})</h2>
      <p className="mb-2 text-xs text-muted-foreground">
        Drag a guest onto an empty seat, or onto a filled one to swap. Tap a guest, then tap any
        seat to place them there.
      </p>
      <Input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Find a guest…"
        className="mb-3"
      />
      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[34px] flex-wrap gap-1.5 rounded-md',
          isOver && 'outline outline-2 outline-primary/40'
        )}
      >
        {sorted.map((guest) => (
          <GuestChip
            key={guest.id}
            guest={guest}
            selected={guest.id === selectedGuestId}
            dimmed={!!query && !`${guest.first_name} ${guest.last_name}`.toLowerCase().includes(query)}
            hasIssue={issueGuestIds.has(guest.id)}
            onSelect={() => onSelect(guest.id)}
            onPinClick={() => onPinClick(guest.id)}
          />
        ))}
      </div>
      {showUnseatButton && (
        <Button type="button" size="sm" variant="secondary" className="mt-2" onClick={onUnseatHere}>
          ⬅ Unseat here
        </Button>
      )}
    </div>
  );
}
