// ABOUTME: One seating table — editable name/note, seat controls, the ring, and issue warnings
'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SeatRing } from './seat-ring';
import type { SeatingGuestRow, SeatingSeatRow, SeatingTableRow } from './types';

interface TableCardProps {
  table: SeatingTableRow;
  seats: SeatingSeatRow[];
  guestsById: Map<string, SeatingGuestRow>;
  labelFor: (guestId: string) => string;
  selectedGuestId: string | null;
  selectedGuestLabel: string | null;
  searchQuery: string;
  issueMessages: string[];
  issueGuestIds: Set<string>;
  onActivateSeat: (seatId: string, guestId: string | null) => void;
  onRename: (name: string) => void;
  onNoteChange: (note: string) => void;
  onAddSeat: () => void;
  onRemoveSeat: () => void;
  onSeatHere: () => void;
  onDelete: () => void;
}

export function TableCard({
  table,
  seats,
  guestsById,
  labelFor,
  selectedGuestId,
  selectedGuestLabel,
  searchQuery,
  issueMessages,
  issueGuestIds,
  onActivateSeat,
  onRename,
  onNoteChange,
  onAddSeat,
  onRemoveSeat,
  onSeatHere,
  onDelete,
}: TableCardProps) {
  const [caption, setCaption] = useState('');
  const filled = seats.filter((s) => s.guest_id).length;
  const canRemoveSeat = seats.some((s) => !s.guest_id);
  const selectedIsHere = seats.some((s) => s.guest_id === selectedGuestId);

  const handleDelete = () => {
    const message =
      filled > 0
        ? `Delete "${table.name}"? ${filled} seated guest${filled === 1 ? '' : 's'} will become unseated.`
        : `Delete "${table.name}"?`;
    if (window.confirm(message)) onDelete();
  };

  return (
    <section
      className={cn(
        'flex flex-col gap-1.5 rounded-lg border bg-card p-4',
        issueMessages.length > 0 && 'border-destructive'
      )}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <input
          value={table.name}
          onChange={(e) => onRename(e.target.value)}
          className="min-w-0 flex-1 rounded font-serif text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {table.fixed ? (
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            fixed
          </Badge>
        ) : (
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6"
              disabled={!canRemoveSeat}
              onClick={onRemoveSeat}
              title="Remove an empty seat"
            >
              −
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={onAddSeat}
              title="Add a seat"
            >
              +
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={handleDelete}
              title="Delete table"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-bold tabular-nums',
            filled === seats.length && seats.length > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-primary/10 text-primary'
          )}
        >
          {filled} / {seats.length}
        </span>
      </div>

      <input
        value={table.note ?? ''}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Add a note…"
        className="rounded text-xs text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {issueMessages.length > 0 && (
        <p className="text-xs text-destructive">⚠ {issueMessages.join(' · ')}</p>
      )}

      <SeatRing
        tableId={table.id}
        seats={seats}
        guestsById={guestsById}
        labelFor={labelFor}
        selectedGuestId={selectedGuestId}
        searchQuery={searchQuery}
        issueGuestIds={issueGuestIds}
        onActivateSeat={onActivateSeat}
        onNeighborCaption={setCaption}
      />

      <p className="min-h-[15px] text-xs text-green-700">{caption}</p>

      {seats.length > 0 && (
        <ol className="columns-2 gap-3.5 pl-4 text-xs text-muted-foreground">
          {seats.map((seat) => {
            const g = seat.guest_id ? guestsById.get(seat.guest_id) : null;
            return (
              <li key={seat.id} className={cn(!g && 'text-muted-foreground/50 italic')}>
                {g ? `${g.first_name} ${g.last_name}` : '— empty —'}
              </li>
            );
          })}
        </ol>
      )}

      {selectedGuestId && !selectedIsHere && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="mt-1 self-start"
          onClick={onSeatHere}
        >
          Seat {selectedGuestLabel} here
        </Button>
      )}
    </section>
  );
}
