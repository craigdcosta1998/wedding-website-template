-- ABOUTME: Household session revocation and independent invitations; no real guests/codes seeded
BEGIN;
ALTER TABLE public.households ADD COLUMN auth_version UUID NOT NULL DEFAULT gen_random_uuid();

CREATE FUNCTION public.rotate_household_auth_version() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.household_code IS DISTINCT FROM OLD.household_code THEN
    NEW.auth_version := gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.rotate_household_auth_version() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER rotate_household_auth_version BEFORE UPDATE ON public.households
FOR EACH ROW EXECUTE FUNCTION public.rotate_household_auth_version();

CREATE TABLE public.celebration_event_links (
  celebration_key TEXT PRIMARY KEY CHECK (celebration_key IN ('roce','welcome-party','wedding','pool-party')),
  event_id UUID NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE
);
CREATE TABLE public.household_event_invitations (
  household_id UUID NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  PRIMARY KEY (household_id, event_id)
);
ALTER TABLE public.celebration_event_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_event_invitations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.celebration_event_links, public.household_event_invitations FROM anon, authenticated;
GRANT ALL ON public.celebration_event_links, public.household_event_invitations TO service_role;

-- Household cookies are verified server-side, never promoted into browser JWT claims.
-- Close the legacy direct-API path, including broad event visibility tiers.
REVOKE ALL ON public.households, public.guests, public.events, public.guest_events FROM anon, authenticated;
COMMIT;
