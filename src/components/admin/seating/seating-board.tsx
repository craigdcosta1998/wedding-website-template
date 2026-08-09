// ABOUTME: Client orchestrator for the seating planner — state, drag-and-drop, and server sync
'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  buildKeepTogetherPairs,
  computeIssues,
  countFirstNames,
  shortName,
  layoutText,
} from '@/lib/seating';
import {
  createTable,
  renameTable as renameTableAction,
  updateTableNote,
  deleteTable as deleteTableAction,
  addSeat as addSeatAction,
  removeSeat as removeSeatAction,
  placeGuest,
  placeGuestInTable,
  unseatGuest,
  setSeatPreference,
} from '@/app/actions/seating';
import { TableCard } from './table-card';
import { UnseatedPool } from './unseated-pool';
import type { SeatingGuestRow, SeatingSeatRow, SeatingTableRow } from './types';

interface SeatingBoardProps {
  guests: SeatingGuestRow[];
  tables: SeatingTableRow[];
  seats: SeatingSeatRow[];
}

export function SeatingBoard({ guests: initialGuests, tables: initialTables, seats: initialSeats }: SeatingBoardProps) {
  const [guests, setGuests] = useState(initialGuests);
  const [tables, setTables] = useState(initialTables);
  const [seats, setSeats] = useState(initialSeats);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pinDialogGuestId, setPinDialogGuestId] = useState<string | null>(null);
  const [pinSearch, setPinSearch] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const guestsById = useMemo(() => new Map(guests.map((g) => [g.id, g])), [guests]);

  const guestTableMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const seat of seats) {
      if (seat.guest_id) map.set(seat.guest_id, seat.table_id);
    }
    return map;
  }, [seats]);

  const unseatedGuests = useMemo(
    () => guests.filter((g) => !guestTableMap.has(g.id)),
    [guests, guestTableMap]
  );

  const pairs = useMemo(
    () =>
      buildKeepTogetherPairs(
        guests.map((g) => ({
          id: g.id,
          firstName: g.first_name,
          lastName: g.last_name,
          householdId: g.household_id,
          seatWithGuestId: g.seat_with_guest_id,
        }))
      ),
    [guests]
  );

  const issues = useMemo(() => computeIssues(pairs, guestTableMap), [pairs, guestTableMap]);

  const issueGuestIds = useMemo(() => {
    const set = new Set<string>();
    for (const issue of issues) {
      set.add(issue.guestIdA);
      set.add(issue.guestIdB);
    }
    return set;
  }, [issues]);

  const issueMessagesByTable = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const issue of issues) {
      const a = guestsById.get(issue.guestIdA);
      const b = guestsById.get(issue.guestIdB);
      if (!a || !b) continue;
      const message = `${a.first_name} ${a.last_name} is split from ${b.first_name} ${b.last_name}`;
      for (const tableId of [issue.tableIdA, issue.tableIdB]) {
        const list = map.get(tableId) ?? [];
        list.push(message);
        map.set(tableId, list);
      }
    }
    return map;
  }, [issues, guestsById]);

  const firstNameCounts = useMemo(
    () => countFirstNames(guests.map((g) => ({ firstName: g.first_name }))),
    [guests]
  );
  const labelFor = (guestId: string) => {
    const g = guestsById.get(guestId);
    if (!g) return '';
    return shortName(g.first_name, g.last_name, firstNameCounts);
  };

  const seatsByTable = useMemo(() => {
    const map = new Map<string, SeatingSeatRow[]>();
    for (const table of tables) map.set(table.id, []);
    for (const seat of seats) {
      const list = map.get(seat.table_id) ?? [];
      list.push(seat);
      map.set(seat.table_id, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.seat_index - b.seat_index);
    return map;
  }, [tables, seats]);

  const totalSeated = seats.filter((s) => s.guest_id).length;

  // --- Placement -----------------------------------------------------------

  function place(guestId: string, target: { seatId: string } | { tableId: string } | { pool: true }) {
    const previousSeats = seats;
    let optimistic = seats.map((s) => (s.guest_id === guestId ? { ...s, guest_id: null } : s));
    let tempSeatId: string | null = null;

    if ('pool' in target) {
      setSeats(optimistic);
    } else if ('seatId' in target) {
      const targetSeat = optimistic.find((s) => s.id === target.seatId);
      const occupant = targetSeat?.guest_id ?? null;
      optimistic = optimistic.map((s) => {
        if (s.id === target.seatId) return { ...s, guest_id: guestId };
        if (occupant && s.guest_id === guestId) return { ...s, guest_id: occupant };
        return s;
      });
      // If the guest displaced someone, that person needs the original seat back.
      const originalSeatId = previousSeats.find((s) => s.guest_id === guestId)?.id;
      if (occupant && originalSeatId) {
        optimistic = optimistic.map((s) => (s.id === originalSeatId ? { ...s, guest_id: occupant } : s));
      }
      setSeats(optimistic);
    } else {
      const tableSeats = optimistic
        .filter((s) => s.table_id === target.tableId)
        .sort((a, b) => a.seat_index - b.seat_index);
      const emptySeat = tableSeats.find((s) => !s.guest_id);
      if (emptySeat) {
        optimistic = optimistic.map((s) => (s.id === emptySeat.id ? { ...s, guest_id: guestId } : s));
        setSeats(optimistic);
      } else {
        const nextIndex = (tableSeats.at(-1)?.seat_index ?? -1) + 1;
        tempSeatId = `temp-${crypto.randomUUID()}`;
        const tempSeat: SeatingSeatRow = {
          id: tempSeatId,
          table_id: target.tableId,
          seat_index: nextIndex,
          guest_id: guestId,
        };
        setSeats([...optimistic, tempSeat]);
      }
    }
    setSelectedGuestId(null);

    (async () => {
      if ('pool' in target) {
        const result = await unseatGuest(guestId);
        if (!result.success) {
          setSeats(previousSeats);
          toast.error(result.error ?? 'Failed to update seating');
        }
        return;
      }
      if ('seatId' in target) {
        const result = await placeGuest(guestId, target.seatId);
        if (!result.success) {
          setSeats(previousSeats);
          toast.error(result.error ?? 'Failed to update seating');
        }
        return;
      }
      const result = await placeGuestInTable(guestId, target.tableId);
      if (!result.success) {
        setSeats(previousSeats);
        toast.error(result.error ?? 'Failed to update seating');
        return;
      }
      // A table-drop may have created a new seat server-side (grown the table) rather than
      // reusing an existing empty one — reconcile our optimistic placeholder id with the real one.
      if (tempSeatId && result.seatId) {
        const realSeatId = result.seatId;
        setSeats((prev) => prev.map((s) => (s.id === tempSeatId ? { ...s, id: realSeatId } : s)));
      }
    })();
  }

  function activateSeat(seatId: string, occupantId: string | null) {
    if (selectedGuestId && selectedGuestId !== occupantId) {
      place(selectedGuestId, { seatId });
    } else {
      setSelectedGuestId((prev) => (prev === occupantId ? null : occupantId));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const guestId = event.active.data.current?.guestId as string | undefined;
    const overId = event.over?.id;
    if (!guestId || !overId) return;
    const id = String(overId);
    if (id === 'pool') place(guestId, { pool: true });
    else if (id.startsWith('seat:')) place(guestId, { seatId: id.slice('seat:'.length) });
    else if (id.startsWith('table:')) place(guestId, { tableId: id.slice('table:'.length) });
  }

  // --- Table/seat management ------------------------------------------------

  async function handleAddTable() {
    const sortOrder = tables.length ? Math.max(...tables.map((t) => t.sort_order)) + 1 : 0;
    const result = await createTable('New table', sortOrder);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to create table');
      return;
    }
    location.reload();
  }

  async function handleRenameTable(tableId: string, name: string) {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, name } : t)));
    const result = await renameTableAction(tableId, name);
    if (!result.success) toast.error(result.error ?? 'Failed to rename table');
  }

  async function handleNoteChange(tableId: string, note: string) {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, note } : t)));
    const result = await updateTableNote(tableId, note);
    if (!result.success) toast.error(result.error ?? 'Failed to update note');
  }

  async function handleDeleteTable(tableId: string) {
    const previousTables = tables;
    const previousSeats = seats;
    setTables((prev) => prev.filter((t) => t.id !== tableId));
    setSeats((prev) => prev.filter((s) => s.table_id !== tableId));
    const result = await deleteTableAction(tableId);
    if (!result.success) {
      setTables(previousTables);
      setSeats(previousSeats);
      toast.error(result.error ?? 'Failed to delete table');
    }
  }

  async function handleAddSeat(tableId: string) {
    const tableSeats = seatsByTable.get(tableId) ?? [];
    const nextIndex = (tableSeats.at(-1)?.seat_index ?? -1) + 1;
    const tempSeat: SeatingSeatRow = {
      id: `temp-${crypto.randomUUID()}`,
      table_id: tableId,
      seat_index: nextIndex,
      guest_id: null,
    };
    setSeats((prev) => [...prev, tempSeat]);
    const result = await addSeatAction(tableId);
    if (!result.success) {
      setSeats((prev) => prev.filter((s) => s.id !== tempSeat.id));
      toast.error(result.error ?? 'Failed to add seat');
    }
  }

  async function handleRemoveSeat(tableId: string) {
    const tableSeats = seatsByTable.get(tableId) ?? [];
    const lastEmpty = [...tableSeats].reverse().find((s) => !s.guest_id);
    if (!lastEmpty) return;
    const previous = seats;
    setSeats((prev) => prev.filter((s) => s.id !== lastEmpty.id));
    const result = await removeSeatAction(tableId);
    if (!result.success) {
      setSeats(previous);
      toast.error(result.error ?? 'Failed to remove seat');
    }
  }

  // --- Seat-together pin -----------------------------------------------------

  const pinDialogGuest = pinDialogGuestId ? guestsById.get(pinDialogGuestId) : null;
  const pinnedPartner = pinDialogGuest?.seat_with_guest_id
    ? guestsById.get(pinDialogGuest.seat_with_guest_id)
    : null;
  const pinCandidates = guests
    .filter((g) => g.id !== pinDialogGuestId)
    .filter((g) => `${g.first_name} ${g.last_name}`.toLowerCase().includes(pinSearch.toLowerCase()))
    .sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`, 'de'));

  async function choosePin(otherGuestId: string | null) {
    if (!pinDialogGuestId) return;
    setGuests((prev) =>
      prev.map((g) => (g.id === pinDialogGuestId ? { ...g, seat_with_guest_id: otherGuestId } : g))
    );
    setPinDialogGuestId(null);
    setPinSearch('');
    const result = await setSeatPreference(pinDialogGuestId, otherGuestId);
    if (!result.success) toast.error(result.error ?? 'Failed to update seating preference');
  }

  // --- Export -----------------------------------------------------------

  async function handleCopyLayout() {
    const text = layoutText(
      tables.map((t) => ({
        name: t.name,
        seats: (seatsByTable.get(t.id) ?? []).map((s) => {
          const g = s.guest_id ? guestsById.get(s.guest_id) : null;
          return g ? { firstName: g.first_name, lastName: g.last_name } : null;
        }),
      })),
      new Date().toISOString().slice(0, 10)
    );
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Layout copied to clipboard');
    } catch {
      window.prompt('Copy the layout below:', text);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {totalSeated} seated
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${unseatedGuests.length ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-800'}`}
        >
          {unseatedGuests.length} unseated
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${issues.length ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-800'}`}
        >
          {issues.length ? `${issues.length} warnings` : 'no warnings'}
        </span>
        <div className="ml-auto flex gap-2">
          <Button type="button" variant="outline" onClick={handleAddTable}>
            + Add table
          </Button>
          <Button type="button" variant="outline" onClick={handleCopyLayout}>
            Copy layout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <UnseatedPool
          guests={unseatedGuests}
          selectedGuestId={selectedGuestId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          issueGuestIds={issueGuestIds}
          onSelect={(id) => setSelectedGuestId((prev) => (prev === id ? null : id))}
          onPinClick={(id) => {
            setPinDialogGuestId(id);
            setPinSearch('');
          }}
          onUnseatHere={() => selectedGuestId && place(selectedGuestId, { pool: true })}
          showUnseatButton={!!selectedGuestId && guestTableMap.has(selectedGuestId)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tables
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((table) => (
              <TableCard
                key={table.id}
                table={table}
                seats={seatsByTable.get(table.id) ?? []}
                guestsById={guestsById}
                labelFor={labelFor}
                selectedGuestId={selectedGuestId}
                selectedGuestLabel={selectedGuestId ? labelFor(selectedGuestId) : null}
                searchQuery={searchQuery}
                issueMessages={issueMessagesByTable.get(table.id) ?? []}
                issueGuestIds={issueGuestIds}
                onActivateSeat={activateSeat}
                onRename={(name) => handleRenameTable(table.id, name)}
                onNoteChange={(note) => handleNoteChange(table.id, note)}
                onAddSeat={() => handleAddSeat(table.id)}
                onRemoveSeat={() => handleRemoveSeat(table.id)}
                onSeatHere={() => selectedGuestId && place(selectedGuestId, { tableId: table.id })}
                onDelete={() => handleDeleteTable(table.id)}
              />
            ))}
        </div>
      </div>

      <Dialog open={!!pinDialogGuestId} onOpenChange={(open) => !open && setPinDialogGuestId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Pin {pinDialogGuest ? `${pinDialogGuest.first_name} ${pinDialogGuest.last_name}` : ''} to sit with…
            </DialogTitle>
          </DialogHeader>
          {pinnedPartner && (
            <div className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span>
                Currently pinned to {pinnedPartner.first_name} {pinnedPartner.last_name}
              </span>
              <Button type="button" size="sm" variant="ghost" onClick={() => choosePin(null)}>
                Clear
              </Button>
            </div>
          )}
          <Input
            value={pinSearch}
            onChange={(e) => setPinSearch(e.target.value)}
            placeholder="Find a guest…"
          />
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {pinCandidates.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => choosePin(g.id)}
                className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                {g.first_name} {g.last_name}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
