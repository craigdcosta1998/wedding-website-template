-- ABOUTME: Migration to add dresscode, directions, parking, and end time fields to events table

-- Add new columns for event details
ALTER TABLE events ADD COLUMN event_end_date TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN dresscode TEXT;
ALTER TABLE events ADD COLUMN directions_de TEXT;
ALTER TABLE events ADD COLUMN directions_en TEXT;
ALTER TABLE events ADD COLUMN parking_de TEXT;
ALTER TABLE events ADD COLUMN parking_en TEXT;
