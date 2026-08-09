// ABOUTME: The circular table diagram — positions seats around a hub, tracks neighbor hover
'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Seat } from './seat';
import type { SeatingGuestRow, SeatingSeatRow } from './types';

interface SeatRingProps {
  tableId: string;
  seats: SeatingSeatRow[];
  guestsById: Map<string, SeatingGuestRow>;
  labelFor: (guestId: string) => string;
  selectedGuestId: string | null;
  searchQuery: string;
  issueGuestIds: Set<string>;
  onActivateSeat: (seatId: string, guestId: string | null) => void;
  onNeighborCaption: (caption: string) => void;
}

export function SeatRing({
  tableId,
  seats,
  guestsById,
  labelFor,
  selectedGuestId,
  searchQuery,
  issueGuestIds,
  onActivateSeat,
  onNeighborCaption,
}: SeatRingProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `table:${tableId}`, data: { tableId } });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = seats.length;
  const query = searchQuery.trim().toLowerCase();

  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
    if (index === null || total < 2) {
      onNeighborCaption('');
      return;
    }
    const prevIdx = (index - 1 + total) % total;
    const nextIdx = (index + 1) % total;
    const nameAt = (i: number) => {
      const guestId = seats[i]?.guest_id;
      const g = guestId ? guestsById.get(guestId) : null;
      return g ? `${g.first_name} ${g.last_name}` : 'an empty seat';
    };
    const meGuestId = seats[index]?.guest_id;
    const me = meGuestId ? guestsById.get(meGuestId) : null;
    const meName = me ? `${me.first_name} ${me.last_name}` : 'This empty seat';
    onNeighborCaption(
      total === 2
        ? `${meName} sits next to ${nameAt(prevIdx)}`
        : `${meName} sits between ${nameAt(prevIdx)} and ${nameAt(nextIdx)}`
    );
  };

  return (
    <div className="flex justify-center py-1">
      <div
        ref={setNodeRef}
        className={cn(
          'relative aspect-square w-full max-w-[260px]',
          isOver && 'rounded-full outline outline-2 outline-primary/40'
        )}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 flex aspect-square w-[34%] flex-col items-center justify-center rounded-full border border-dashed p-1 text-center text-[10.5px] text-muted-foreground tabular-nums">
          {total > 0 ? (
            <>
              <span>{seats.filter((s) => s.guest_id).length}/{total}</span>
              <span>seated</span>
            </>
          ) : (
            'no seats'
          )}
        </div>
        {seats.map((seat, index) => {
          const guest = seat.guest_id ? guestsById.get(seat.guest_id) ?? null : null;
          const dimmed =
            !!query &&
            !!guest &&
            !`${guest.first_name} ${guest.last_name}`.toLowerCase().includes(query);
          const prevIdx = (index - 1 + total) % total;
          const nextIdx = (index + 1) % total;
          return (
            <Seat
              key={seat.id}
              seatId={seat.id}
              index={index}
              total={total}
              guest={guest}
              label={guest ? labelFor(guest.id) : null}
              selected={!!guest && guest.id === selectedGuestId}
              dimmed={dimmed}
              hasIssue={!!guest && issueGuestIds.has(guest.id)}
              isNeighbor={total > 1 && (hoveredIndex === prevIdx || hoveredIndex === nextIdx)}
              onActivate={() => onActivateSeat(seat.id, guest?.id ?? null)}
              onHover={handleHover}
            />
          );
        })}
      </div>
    </div>
  );
}
