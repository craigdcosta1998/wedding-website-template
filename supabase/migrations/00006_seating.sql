-- ABOUTME: Seating planner schema — tables, seats, and a manual "seat together" guest pin

CREATE TABLE seating_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    note TEXT,
    fixed BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE seating_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID NOT NULL REFERENCES seating_tables(id) ON DELETE CASCADE,
    seat_index INTEGER NOT NULL,
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- seat_index is the ring position within its table; gaps are fine, the client sorts by it
    CONSTRAINT seating_seats_unique_index UNIQUE (table_id, seat_index),
    -- a guest occupies at most one seat anywhere (multiple NULLs are allowed by Postgres)
    CONSTRAINT seating_seats_unique_guest UNIQUE (guest_id)
);

-- Manual "seat together" pin for pairs that aren't a two-person household (e.g. an engaged
-- couple who RSVP'd under two different households, or two guests within a larger household
-- who should be split off together). Two-person households are paired automatically instead —
-- see src/lib/seating.ts.
ALTER TABLE guests ADD COLUMN seat_with_guest_id UUID REFERENCES guests(id) ON DELETE SET NULL;

CREATE INDEX idx_seating_seats_table_id ON seating_seats(table_id);
CREATE INDEX idx_seating_seats_guest_id ON seating_seats(guest_id);

CREATE TRIGGER update_seating_tables_updated_at
    BEFORE UPDATE ON seating_tables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seating_seats_updated_at
    BEFORE UPDATE ON seating_seats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE seating_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE seating_seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to seating_tables"
    ON seating_tables
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role has full access to seating_seats"
    ON seating_seats
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Places a guest into a specific seat as one atomic operation. If the guest is already seated
-- elsewhere, that seat is vacated. If the target seat is occupied, the two guests swap places.
CREATE OR REPLACE FUNCTION place_guest(p_guest_id UUID, p_seat_id UUID)
RETURNS VOID AS $$
DECLARE
    v_origin_seat_id UUID;
    v_target_occupant UUID;
BEGIN
    SELECT id INTO v_origin_seat_id FROM seating_seats WHERE guest_id = p_guest_id;
    SELECT guest_id INTO v_target_occupant FROM seating_seats WHERE id = p_seat_id;

    IF v_origin_seat_id IS NOT NULL THEN
        UPDATE seating_seats SET guest_id = NULL WHERE id = v_origin_seat_id;
    END IF;

    UPDATE seating_seats SET guest_id = p_guest_id WHERE id = p_seat_id;

    IF v_target_occupant IS NOT NULL AND v_origin_seat_id IS NOT NULL THEN
        UPDATE seating_seats SET guest_id = v_target_occupant WHERE id = v_origin_seat_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Places a guest into the first empty seat of a table, growing the table by one seat if it's
-- already full. Mirrors dropping a guest onto a table (rather than a specific seat). Returns
-- the seat id used, so a caller that optimistically created a placeholder seat client-side can
-- reconcile it with the real row.
CREATE OR REPLACE FUNCTION place_guest_in_table(p_guest_id UUID, p_table_id UUID)
RETURNS UUID AS $$
DECLARE
    v_seat_id UUID;
    v_next_index INTEGER;
BEGIN
    SELECT id INTO v_seat_id FROM seating_seats
        WHERE table_id = p_table_id AND guest_id IS NULL
        ORDER BY seat_index LIMIT 1;

    IF v_seat_id IS NULL THEN
        SELECT COALESCE(MAX(seat_index) + 1, 0) INTO v_next_index
            FROM seating_seats WHERE table_id = p_table_id;
        INSERT INTO seating_seats (table_id, seat_index) VALUES (p_table_id, v_next_index)
            RETURNING id INTO v_seat_id;
    END IF;

    PERFORM place_guest(p_guest_id, v_seat_id);
    RETURN v_seat_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION unseat_guest(p_guest_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE seating_seats SET guest_id = NULL WHERE guest_id = p_guest_id;
END;
$$ LANGUAGE plpgsql;
