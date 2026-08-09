// ABOUTME: Tests for seating-planner pure logic — pairing, warnings, name shortening, export
import { describe, it, expect } from 'vitest';
import {
  buildKeepTogetherPairs,
  computeIssues,
  countFirstNames,
  shortName,
  layoutText,
  type SeatingGuest,
} from './seating';

function guest(overrides: Partial<SeatingGuest> & Pick<SeatingGuest, 'id' | 'householdId'>): SeatingGuest {
  return {
    firstName: 'First',
    lastName: 'Last',
    seatWithGuestId: null,
    ...overrides,
  };
}

describe('buildKeepTogetherPairs', () => {
  it('pairs guests in a two-person household', () => {
    const guests = [
      guest({ id: 'a', householdId: 'h1', firstName: 'Anna' }),
      guest({ id: 'b', householdId: 'h1', firstName: 'Ben' }),
    ];
    expect(buildKeepTogetherPairs(guests)).toEqual([['a', 'b']]);
  });

  it('does not auto-pair households with three or more members', () => {
    const guests = [
      guest({ id: 'a', householdId: 'h1' }),
      guest({ id: 'b', householdId: 'h1' }),
      guest({ id: 'c', householdId: 'h1' }),
    ];
    expect(buildKeepTogetherPairs(guests)).toEqual([]);
  });

  it('does not pair a household of one', () => {
    const guests = [guest({ id: 'a', householdId: 'h1' })];
    expect(buildKeepTogetherPairs(guests)).toEqual([]);
  });

  it('adds a manual seat-with pin across two different households', () => {
    const guests = [
      guest({ id: 'a', householdId: 'h1' }),
      guest({ id: 'b', householdId: 'h2', seatWithGuestId: 'a' }),
    ];
    expect(buildKeepTogetherPairs(guests)).toEqual([['a', 'b']]);
  });

  it('adds a manual pin between two members of a larger household', () => {
    const guests = [
      guest({ id: 'a', householdId: 'h1' }),
      guest({ id: 'b', householdId: 'h1' }),
      guest({ id: 'c', householdId: 'h1', seatWithGuestId: 'a' }),
    ];
    expect(buildKeepTogetherPairs(guests)).toEqual([['a', 'c']]);
  });

  it('does not duplicate a pair already covered by the household rule', () => {
    const guests = [
      guest({ id: 'a', householdId: 'h1', seatWithGuestId: 'b' }),
      guest({ id: 'b', householdId: 'h1' }),
    ];
    expect(buildKeepTogetherPairs(guests)).toEqual([['a', 'b']]);
  });

  it('ignores a seat-with pin that points at a nonexistent guest', () => {
    const guests = [guest({ id: 'a', householdId: 'h1', seatWithGuestId: 'ghost' })];
    expect(buildKeepTogetherPairs(guests)).toEqual([]);
  });

  it('ignores a seat-with pin pointing at itself', () => {
    const guests = [guest({ id: 'a', householdId: 'h1', seatWithGuestId: 'a' })];
    expect(buildKeepTogetherPairs(guests)).toEqual([]);
  });
});

describe('computeIssues', () => {
  it('flags a pair seated at two different tables', () => {
    const pairs: [string, string][] = [['a', 'b']];
    const guestTableMap = new Map([['a', 't1'], ['b', 't2']]);
    expect(computeIssues(pairs, guestTableMap)).toEqual([
      { guestIdA: 'a', guestIdB: 'b', tableIdA: 't1', tableIdB: 't2' },
    ]);
  });

  it('does not flag a pair at the same table', () => {
    const pairs: [string, string][] = [['a', 'b']];
    const guestTableMap = new Map([['a', 't1'], ['b', 't1']]);
    expect(computeIssues(pairs, guestTableMap)).toEqual([]);
  });

  it('does not flag a pair where one guest is unseated', () => {
    const pairs: [string, string][] = [['a', 'b']];
    const guestTableMap = new Map([['a', 't1']]);
    expect(computeIssues(pairs, guestTableMap)).toEqual([]);
  });

  it('does not flag a pair where both guests are unseated', () => {
    const pairs: [string, string][] = [['a', 'b']];
    expect(computeIssues(pairs, new Map())).toEqual([]);
  });
});

describe('countFirstNames', () => {
  it('counts occurrences of each first name', () => {
    const counts = countFirstNames([
      { firstName: 'Laura' },
      { firstName: 'Laura' },
      { firstName: 'Ben' },
    ]);
    expect(counts.get('Laura')).toBe(2);
    expect(counts.get('Ben')).toBe(1);
  });
});

describe('shortName', () => {
  it('returns just the first name when it is unique', () => {
    const counts = countFirstNames([{ firstName: 'Ben' }]);
    expect(shortName('Ben', 'Hills', counts)).toBe('Ben');
  });

  it('appends the last initial when the first name is shared', () => {
    const counts = countFirstNames([{ firstName: 'Laura' }, { firstName: 'Laura' }]);
    expect(shortName('Laura', 'Mohn', counts)).toBe('Laura M.');
  });

  it('falls back to the first name if last name is empty', () => {
    const counts = countFirstNames([{ firstName: 'Laura' }, { firstName: 'Laura' }]);
    expect(shortName('Laura', '', counts)).toBe('Laura');
  });
});

describe('layoutText', () => {
  it('renders tables with seat numbers and empty markers', () => {
    const text = layoutText(
      [
        {
          name: 'Head table',
          seats: [{ firstName: 'Alex', lastName: '' }, null],
        },
      ],
      '2026-08-09'
    );
    expect(text).toBe(
      [
        'Seating (2026-08-09)',
        '',
        'Head table (1/2):',
        '  1. Alex',
        '  2. — empty —',
      ].join('\n')
    );
  });

  it('renders multiple tables separated by a blank line', () => {
    const text = layoutText(
      [
        { name: 'A', seats: [{ firstName: 'X', lastName: 'Y' }] },
        { name: 'B', seats: [null] },
      ],
      '2026-08-09'
    );
    expect(text).toContain('A (1/1):\n  1. X Y\n\nB (0/1):\n  1. — empty —');
  });
});
