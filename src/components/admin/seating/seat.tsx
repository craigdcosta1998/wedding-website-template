// ABOUTME: A single seat around the table ring — draggable/droppable, selectable, and hoverable
'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import type { SeatingGuestRow } from './types';

interface SeatProps {
  seatId: string;
  index: number;
  total: number;
  guest: SeatingGuestRow | null;
  label: string | null;
  selected: boolean;
  dimmed: boolean;
  hasIssue: boolean;
  isNeighbor: boolean;
  onActivate: () => void;
  onHover: (index: number | null) => void;
}

export function Seat({
  seatId,
  index,
  total,
  guest,
  label,
  selected,
  dimmed,
  hasIssue,
  isNeighbor,
  onActivate,
  onHover,
}: SeatProps) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `seat:${seatId}`, data: { seatId } });
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: `seat:${seatId}:${guest?.id ?? ''}`,
    data: { guestId: guest?.id },
    disabled: !guest,
  });

  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const left = 50 + 37 * Math.cos(angle);
  const top = 50 + 37 * Math.sin(angle);

  const setRefs = (node: HTMLElement | null) => {
    setDropRef(node);
    setDragRef(node);
  };

  return (
    <div
      ref={setRefs}
      aria-label={
        guest
          ? `${guest.first_name} ${guest.last_name}, seat ${index + 1} of ${total}`
          : `Empty seat ${index + 1} of ${total}`
      }
      {...listeners}
      {...attributes}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      onMouseEnter={() => onHover(index)}
      onFocus={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onBlur={() => onHover(null)}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
      }}
      className={cn(
        '-translate-x-1/2 -translate-y-1/2 absolute flex min-h-10 w-[58px] flex-col items-center',
        'justify-center rounded-[10px] border bg-background px-1 py-0.5 text-center text-[10.5px]',
        'leading-tight select-none',
        guest ? 'cursor-grab' : 'cursor-pointer border-dashed text-muted-foreground text-base',
        (isOver || isDragging) && 'border-primary',
        selected && 'bg-primary text-primary-foreground border-primary',
        hasIssue && 'shadow-[inset_0_-2px_0_var(--destructive)]',
        isNeighbor && 'border-green-600 shadow-[0_0_0_2px_rgba(22,163,74,0.2)]',
        dimmed && 'opacity-30',
        isDragging && 'opacity-40'
      )}
    >
      {guest ? (
        <>
          <span>{label}</span>
          {guest.age_category !== 'adult' && (
            <span className="mt-0.5 rounded bg-amber-100 px-1 text-[8px] font-bold text-amber-800">
              {guest.age_category === 'child' ? 'CHILD' : 'TODDLER'}
            </span>
          )}
        </>
      ) : (
        '+'
      )}
    </div>
  );
}
