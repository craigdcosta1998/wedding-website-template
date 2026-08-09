-- ABOUTME: Initial database schema for wedding website with households, guests, and events

-- Create custom enum types
CREATE TYPE invitation_type AS ENUM ('ceremony_reception', 'reception_only', 'all_events');
CREATE TYPE rsvp_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE meal_choice AS ENUM ('beef', 'fish', 'vegetarian', 'vegan');
CREATE TYPE event_visibility AS ENUM ('all', 'ceremony_reception', 'all_events');

-- Households table
CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_code TEXT UNIQUE NOT NULL,
    primary_contact_name TEXT NOT NULL,
    primary_contact_email TEXT,
    invitation_type invitation_type NOT NULL DEFAULT 'ceremony_reception',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure household_code is exactly 6 characters
    CONSTRAINT household_code_length CHECK (LENGTH(household_code) = 6)
);

-- Guests table
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    rsvp_status rsvp_status NOT NULL DEFAULT 'pending',
    meal_choice meal_choice,
    dietary_restrictions TEXT,
    is_plus_one BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_de TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_de TEXT,
    description_en TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    location_name TEXT NOT NULL,
    location_address TEXT NOT NULL,
    maps_url TEXT,
    visibility event_visibility NOT NULL DEFAULT 'all',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_households_code ON households(household_code);
CREATE INDEX idx_guests_household_id ON guests(household_id);
CREATE INDEX idx_guests_rsvp_status ON guests(rsvp_status);
CREATE INDEX idx_events_visibility ON events(visibility);
CREATE INDEX idx_events_date ON events(event_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_households_updated_at
    BEFORE UPDATE ON households
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
    BEFORE UPDATE ON guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for households
-- Authenticated users (via household_code in JWT claims) can only see their own household
CREATE POLICY "Households are viewable by authenticated household members"
    ON households
    FOR SELECT
    USING (
        household_code = current_setting('request.jwt.claims', true)::json->>'household_code'
    );

-- Allow updates only to own household
CREATE POLICY "Households can be updated by authenticated household members"
    ON households
    FOR UPDATE
    USING (
        household_code = current_setting('request.jwt.claims', true)::json->>'household_code'
    );

-- RLS Policies for guests
-- Guests can view members of their own household
CREATE POLICY "Guests are viewable by household members"
    ON guests
    FOR SELECT
    USING (
        household_id IN (
            SELECT id FROM households
            WHERE household_code = current_setting('request.jwt.claims', true)::json->>'household_code'
        )
    );

-- Guests can update members of their own household
CREATE POLICY "Guests can be updated by household members"
    ON guests
    FOR UPDATE
    USING (
        household_id IN (
            SELECT id FROM households
            WHERE household_code = current_setting('request.jwt.claims', true)::json->>'household_code'
        )
    );

-- RLS Policies for events
-- Events are viewable based on invitation type
CREATE POLICY "Events are viewable based on invitation type"
    ON events
    FOR SELECT
    USING (
        visibility = 'all'
        OR visibility::text = (
            SELECT invitation_type::text FROM households
            WHERE household_code = current_setting('request.jwt.claims', true)::json->>'household_code'
        )
        OR (
            visibility = 'ceremony_reception' AND (
                SELECT invitation_type FROM households
                WHERE household_code = current_setting('request.jwt.claims', true)::json->>'household_code'
            ) IN ('ceremony_reception', 'all_events')
        )
    );

-- Service role bypass for admin operations
CREATE POLICY "Service role has full access to households"
    ON households
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role has full access to guests"
    ON guests
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role has full access to events"
    ON events
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- No events are seeded here — add your own via the Supabase Table Editor (see README.md)
-- or with your own INSERT statements once you know your venues and schedule.
