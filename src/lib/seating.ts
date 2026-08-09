// ABOUTME: Pure seating-planner logic — keep-together pairing, split warnings, name display, export

export interface SeatingGuest {
  id: string;
  firstName: string;
  lastName: string;
  householdId: string;
  seatWithGuestId: string | null;
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

/**
 * Guests who should sit at the same table: any two-person household (reliably a couple,
 * given how households are modeled here), plus explicit `seatWithGuestId` pins for anything
 * else — an engaged couple who RSVP'd under separate households, or two guests within a
 * larger household who should be split off together. Households of 3+ get no automatic
 * pairing since they often split across tables intentionally.
 */
export function buildKeepTogetherPairs(guests: SeatingGuest[]): [string, string][] {
  const pairs: [string, string][] = [];
  const seen = new Set<string>();

  const byHousehold = new Map<string, SeatingGuest[]>();
  for (const g of guests) {
    const list = byHousehold.get(g.householdId) ?? [];
    list.push(g);
    byHousehold.set(g.householdId, list);
  }
  for (const members of byHousehold.values()) {
    const [first, second] = members;
    if (members.length === 2 && first && second) {
      const key = pairKey(first.id, second.id);
      seen.add(key);
      pairs.push([first.id, second.id]);
    }
  }

  const byId = new Map(guests.map((g) => [g.id, g]));
  for (const g of guests) {
    if (g.seatWithGuestId && g.seatWithGuestId !== g.id && byId.has(g.seatWithGuestId)) {
      const key = pairKey(g.id, g.seatWithGuestId);
      if (!seen.has(key)) {
        seen.add(key);
        const sorted = [g.id, g.seatWithGuestId].sort() as [string, string];
        pairs.push(sorted);
      }
    }
  }

  return pairs;
}

export interface SeatingIssue {
  guestIdA: string;
  guestIdB: string;
  tableIdA: string;
  tableIdB: string;
}

/** Which keep-together pairs ended up seated at two different tables. */
export function computeIssues(
  pairs: [string, string][],
  guestTableMap: Map<string, string>
): SeatingIssue[] {
  const issues: SeatingIssue[] = [];
  for (const [a, b] of pairs) {
    const tableA = guestTableMap.get(a);
    const tableB = guestTableMap.get(b);
    if (tableA && tableB && tableA !== tableB) {
      issues.push({ guestIdA: a, guestIdB: b, tableIdA: tableA, tableIdB: tableB });
    }
  }
  return issues;
}

export function countFirstNames(guests: { firstName: string }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const g of guests) {
    counts.set(g.firstName, (counts.get(g.firstName) ?? 0) + 1);
  }
  return counts;
}

/** First name alone, or "First L." when the first name is shared by another guest. */
export function shortName(
  firstName: string,
  lastName: string,
  firstNameCounts: Map<string, number>
): string {
  const count = firstNameCounts.get(firstName) ?? 0;
  if (count > 1 && lastName) {
    return `${firstName} ${lastName[0]}.`;
  }
  return firstName;
}

export interface SeatingTableExport {
  name: string;
  seats: Array<{ firstName: string; lastName: string } | null>;
}

/** Plain-text seat-by-seat export, e.g. for copy/paste or printing place cards. */
export function layoutText(tables: SeatingTableExport[], dateLabel: string): string {
  const lines = [`Seating (${dateLabel})`, ''];
  for (const t of tables) {
    const filled = t.seats.filter(Boolean).length;
    lines.push(`${t.name} (${filled}/${t.seats.length}):`);
    t.seats.forEach((g, i) => {
      lines.push(`  ${i + 1}. ${g ? `${g.firstName} ${g.lastName}`.trim() : '— empty —'}`);
    });
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}
