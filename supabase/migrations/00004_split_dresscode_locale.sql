-- ABOUTME: Migration to split single dresscode column into locale-specific dresscode_de and dresscode_en

-- Add locale-specific dresscode columns
ALTER TABLE events ADD COLUMN dresscode_de TEXT;
ALTER TABLE events ADD COLUMN dresscode_en TEXT;

-- Migrate existing data from the single dresscode column
UPDATE events SET dresscode_de = dresscode, dresscode_en = dresscode WHERE dresscode IS NOT NULL;

-- No events are seeded in this template, so this matches zero rows — harmless, kept for
-- migration-history continuity. Set your own dress codes via the Table Editor or app instead.
UPDATE events SET dresscode_de = 'Anzug', dresscode_en = 'Suit' WHERE name_en = 'Ceremony';

-- Drop the old column
ALTER TABLE events DROP COLUMN dresscode;
