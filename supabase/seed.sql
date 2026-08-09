-- ABOUTME: Sample test data with 4 households and ~8 guests for development and testing

-- Household 1: Schmidt family - all_events, 2 guests (1 accepted, 1 pending)
INSERT INTO households (household_code, primary_contact_name, primary_contact_email, invitation_type)
VALUES ('TEST01', 'Anna Schmidt', 'anna.schmidt@example.com', 'all_events');

INSERT INTO guests (household_id, first_name, last_name, rsvp_status, meal_choice)
VALUES (
    (SELECT id FROM households WHERE household_code = 'TEST01'),
    'Anna', 'Schmidt', 'accepted', 'fish'
);

INSERT INTO guests (household_id, first_name, last_name, rsvp_status)
VALUES (
    (SELECT id FROM households WHERE household_code = 'TEST01'),
    'Markus', 'Schmidt', 'pending'
);

-- Household 2: Mueller family - ceremony_reception, 3 guests (all pending)
INSERT INTO households (household_code, primary_contact_name, primary_contact_email, invitation_type)
VALUES ('TEST02', 'Katrin Mueller', 'katrin.mueller@example.com', 'ceremony_reception');

INSERT INTO guests (household_id, first_name, last_name, rsvp_status)
VALUES
    ((SELECT id FROM households WHERE household_code = 'TEST02'), 'Katrin', 'Mueller', 'pending'),
    ((SELECT id FROM households WHERE household_code = 'TEST02'), 'Thomas', 'Mueller', 'pending'),
    ((SELECT id FROM households WHERE household_code = 'TEST02'), 'Lena', 'Mueller', 'pending');

-- Household 3: Johnson family - reception_only, 1 guest + plus-one (declined)
INSERT INTO households (household_code, primary_contact_name, primary_contact_email, invitation_type)
VALUES ('TEST03', 'Sarah Johnson', 'sarah.johnson@example.com', 'reception_only');

INSERT INTO guests (household_id, first_name, last_name, rsvp_status)
VALUES (
    (SELECT id FROM households WHERE household_code = 'TEST03'),
    'Sarah', 'Johnson', 'declined'
);

INSERT INTO guests (household_id, first_name, last_name, rsvp_status, is_plus_one)
VALUES (
    (SELECT id FROM households WHERE household_code = 'TEST03'),
    'Guest', 'Johnson', 'declined', TRUE
);

-- Household 4: Weber family - all_events, 2 guests (accepted, dietary restrictions)
INSERT INTO households (household_code, primary_contact_name, primary_contact_email, invitation_type)
VALUES ('TEST04', 'Julia Weber', 'julia.weber@example.com', 'all_events');

INSERT INTO guests (household_id, first_name, last_name, rsvp_status, meal_choice, dietary_restrictions)
VALUES (
    (SELECT id FROM households WHERE household_code = 'TEST04'),
    'Julia', 'Weber', 'accepted', 'vegetarian', 'Glutenfrei / Gluten-free'
);

INSERT INTO guests (household_id, first_name, last_name, rsvp_status, meal_choice, dietary_restrictions)
VALUES (
    (SELECT id FROM households WHERE household_code = 'TEST04'),
    'Felix', 'Weber', 'accepted', 'vegan', 'Nussallergie / Nut allergy'
);
