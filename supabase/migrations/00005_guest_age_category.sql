-- ABOUTME: Adds age_category to guests to distinguish adults, children and toddlers
ALTER TABLE guests ADD COLUMN IF NOT EXISTS age_category TEXT NOT NULL DEFAULT 'adult'
    CHECK (age_category IN ('adult', 'child', 'toddler'));
