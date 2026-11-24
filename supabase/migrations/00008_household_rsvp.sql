-- ABOUTME: Complete named-household replies, checked and written in a single service-only transaction
BEGIN;
CREATE FUNCTION public.save_household_rsvp(p_household_id UUID, p_auth_version UUID, p_answers JSONB)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  version UUID;
  member_ids UUID[];
  event_ids UUID[];
  submitted_ids UUID[];
  answer_ids UUID[];
  person JSONB;
  answer JSONB;
  person_id UUID;
  attending BOOLEAN;
BEGIN
  SELECT auth_version INTO version FROM public.households WHERE id = p_household_id FOR UPDATE;
  IF version IS NULL OR version IS DISTINCT FROM p_auth_version THEN RAISE EXCEPTION 'Invitation expired'; END IF;

  PERFORM 1 FROM public.guests WHERE household_id = p_household_id ORDER BY id FOR UPDATE;
  PERFORM 1 FROM public.celebration_event_links ORDER BY celebration_key FOR SHARE;
  PERFORM 1 FROM public.household_event_invitations WHERE household_id = p_household_id ORDER BY event_id FOR SHARE;
  SELECT array_agg(id ORDER BY id) INTO member_ids FROM public.guests WHERE household_id = p_household_id;
  IF member_ids IS NULL OR cardinality(member_ids) > 20 THEN RAISE EXCEPTION 'Invitation unavailable'; END IF;
  IF (SELECT count(*) FROM public.celebration_event_links WHERE celebration_key IN ('welcome-party','wedding')) <> 2
    THEN RAISE EXCEPTION 'Celebrations unavailable'; END IF;
  SELECT array_agg(l.event_id ORDER BY l.event_id) INTO event_ids FROM public.celebration_event_links l
    WHERE l.celebration_key IN ('welcome-party','wedding') OR EXISTS (
      SELECT 1 FROM public.household_event_invitations i WHERE i.household_id = p_household_id AND i.event_id = l.event_id
    );

  IF jsonb_typeof(p_answers) IS DISTINCT FROM 'array' OR jsonb_array_length(p_answers) <> cardinality(member_ids)
    THEN RAISE EXCEPTION 'Invalid member set'; END IF;
  SELECT array_agg((p->>'id')::UUID ORDER BY (p->>'id')::UUID) INTO submitted_ids FROM jsonb_array_elements(p_answers) p;
  IF submitted_ids IS DISTINCT FROM member_ids THEN RAISE EXCEPTION 'Invalid member set'; END IF;

  FOR person IN SELECT * FROM jsonb_array_elements(p_answers) LOOP
    person_id := (person->>'id')::UUID;
    IF jsonb_typeof(person->'dietaryRequirements') IS DISTINCT FROM 'string' OR length(person->>'dietaryRequirements') > 500
      OR jsonb_typeof(person->'answers') IS DISTINCT FROM 'array'
      OR jsonb_array_length(person->'answers') <> cardinality(event_ids) THEN RAISE EXCEPTION 'Incomplete reply'; END IF;
    SELECT array_agg((a->>'eventId')::UUID ORDER BY (a->>'eventId')::UUID) INTO answer_ids FROM jsonb_array_elements(person->'answers') a;
    IF answer_ids IS DISTINCT FROM event_ids THEN RAISE EXCEPTION 'Invalid celebration set'; END IF;
    attending := FALSE;
    FOR answer IN SELECT * FROM jsonb_array_elements(person->'answers') LOOP
      IF answer->>'status' IS NULL OR answer->>'status' NOT IN ('accepted','declined') THEN RAISE EXCEPTION 'Invalid reply'; END IF;
      attending := attending OR answer->>'status' = 'accepted';
      INSERT INTO public.guest_events(guest_id,event_id,status) VALUES(person_id,(answer->>'eventId')::UUID,answer->>'status')
        ON CONFLICT (guest_id,event_id) DO UPDATE SET status = EXCLUDED.status;
    END LOOP;
    UPDATE public.guests SET rsvp_status = (CASE WHEN attending THEN 'accepted' ELSE 'declined' END)::public.rsvp_status,
      dietary_restrictions = CASE WHEN attending THEN nullif(btrim(person->>'dietaryRequirements'),'') ELSE NULL END
      WHERE id = person_id AND household_id = p_household_id;
  END LOOP;
  RETURN TRUE;
END;
$$;
REVOKE ALL ON FUNCTION public.save_household_rsvp(UUID,UUID,JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_household_rsvp(UUID,UUID,JSONB) TO service_role;
COMMIT;
