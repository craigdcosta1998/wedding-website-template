# Wedding website backlog

Use this file with the current code and [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) when reviewing project status or pending work. It records decisions, required follow-up, and optional ideas. The implementation queue remains in `../feature_list.txt`.

Keep resolved items checked with a short outcome; update this file when scope or priorities change. Do not store guest lists, invitation codes, passwords, or other private guest information here.

## Decisions and work to address

- [ ] **Credential unit:** decide whether an invitation code belongs to an individual guest or to a couple/household. Explicitly deferred by Craig on November 13, 2026. Do not choose a model or issue new credentials yet.
- [ ] **Selective invitations:** finalize who is invited to the Roce on September 12 and the pool party on September 15. Keep permissions independent so someone may be invited to either, both, or neither. Final lists belong in protected storage, not this repository.
- [ ] **Personalized event access:** connect verified credentials to the server-side event filter after the credential decision. Filter the complete response, including details and navigation, and enforce the same permissions in RSVP pages/actions and direct data access. Attendance responses must not grant invitations. Define revocation and expired/invalid credential behavior. The guest page shows the welcome party and wedding until this is connected; the local planning preview shows all four days. The per-event filtering foundation is implemented, but credential matching is not active.
- [ ] **Invitation session signing:** before enabling personalized access, replace the dormant household session's use of the shared site password with a server-only signing secret and server-checked expiry. Do not treat the existing shared password or legacy `all_events` RSVP value as an event permission.
- [ ] **Event details:** confirm timings, dress codes, addresses, transport, parking, and event-specific copy. The supplied venues are current plans; do not imply bookings or invent logistics.
- [ ] **Beach portrait:** add the exact selected photograph of Talia and Craig and check face clearance beneath the overlapping names on desktop and mobile.
- [ ] **Live integration:** configure and verify Supabase/RSVP/admin behavior before launch. Existing database event records can be linked to the celebrations catalogue when ready.

## Nice-to-have ideas — no home yet

- [ ] **“Ci vediamo in Italia.”** Save this wording for a possible future placement. It was removed from the homepage hero; do not put it back there by default.

## Current celebrations plan

| Day | Date | Celebration | Venue | Planned audience |
| --- | --- | --- | --- | --- |
| 1 | September 12, 2027 | The Roce | Villa Mangiacane | Invitation list pending |
| 2 | September 13, 2027 | Welcome party | Serre Torrigiani | All wedding guests |
| 3 | September 14, 2027 | Wedding | Villa Corsini | All wedding guests |
| 4 | September 15, 2027 | Pool party | Villa Mangiacane | Invitation list pending |

Dates and venues were supplied by Craig on November 13, 2026. Roce/pool-party access is provisionally invitation-only until the guest lists are decided.
