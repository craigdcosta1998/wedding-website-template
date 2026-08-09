-- ABOUTME: Migration to create guest_events bridge table for per-event RSVP

CREATE TABLE guest_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'accepted',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT guest_events_unique UNIQUE (guest_id, event_id)
);

CREATE INDEX idx_guest_events_guest_id ON guest_events(guest_id);
CREATE INDEX idx_guest_events_event_id ON guest_events(event_id);

-- RLS
ALTER TABLE guest_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to guest_events"
    ON guest_events
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
