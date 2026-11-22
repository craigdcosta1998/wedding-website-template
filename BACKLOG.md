# Wedding website backlog

Use this file with the current code and [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) when reviewing project status or pending work. It records decisions, required follow-up, and optional ideas. The implementation queue is `feature_list.txt` in the project root.

Keep resolved items checked with a short outcome; update this file when scope or priorities change. Do not store guest lists, invitation codes, passwords, or other private guest information here.

## Decisions and work to address

- [x] **Independent reviews:** add separate design and technical reviewers, with preflight before substantive implementation and final reviews after every significant website change, including local/uncommitted work regardless of deployment. Complete both reviews before marking a change complete or starting unrelated significant work. Requested and clarified November 21, 2026; see [REVIEW_WORKFLOW.md](REVIEW_WORKFLOW.md). This is a local agent workflow; remote deployment enforcement is not configured.
- [ ] **Credential unit:** decide whether an invitation code belongs to an individual guest or to a couple/household. Explicitly deferred by Craig on November 13, 2026. Do not choose a model or issue new credentials yet.
- [ ] **Selective invitations:** finalize who is invited to the Roce on September 12 and the pool party on September 15. Keep permissions independent so someone may be invited to either, both, or neither. Final lists belong in protected storage, not this repository.
- [ ] **Personalized event access:** connect verified credentials to the server-side event filter after the credential decision. Filter the complete response, including details and navigation, and enforce the same permissions in RSVP pages/actions and direct data access. Attendance responses must not grant invitations. Define revocation and expired/invalid credential behavior. The guest page shows the welcome party and wedding until this is connected; the local planning preview shows all four days. The per-event filtering foundation is implemented, but credential matching is not active.
- [ ] **Invitation session signing:** before enabling personalized access, replace the dormant household session's use of the shared site password with a server-only signing secret and server-checked expiry. Do not treat the existing shared password or legacy `all_events` RSVP value as an event permission.
- [ ] **Event details:** confirm timings, dress codes, addresses, transport, parking, and event-specific copy. The supplied venues are current plans; do not imply bookings or invent logistics.
- [ ] **Beach portrait:** add the exact selected photograph of Talia and Craig and check face clearance beneath the overlapping names on desktop and mobile.
- [ ] **Live integration:** configure and verify Supabase/RSVP/admin behavior before launch. Existing database event records can be linked to the celebrations catalogue when ready.
- [ ] **RSVP public-event links:** explicitly link both public celebrations to existing database IDs in `src/config/celebrations.ts`. The public RSVP page and action now require the complete, unique set of links and records; missing configuration shows an unavailable state and accepts neither attendance nor declines. Private/unmapped events cannot be selected through open RSVP. The boundary fix passed automated checks and both independent final reviews. Current Chrome evidence covers mobile/tablet/desktop and keyboard link navigation; live configured submission still requires service access and event links.
- [ ] **Atomic RSVP persistence and retries:** replace separate household/guest/attendance writes with a transaction and an idempotent submission boundary. Do not associate returned guest rows by array position. Required before treating RSVP as launch-ready; the current boundary fix does not address partial writes or duplicate retries.
- [ ] **Remaining public pages:** the editorial Stay page is implemented and awaiting final responsive reviews; approved hotel recommendations are still needed in `src/config/stay.ts`. Remove dummy gift/payment content; complete Gifts/RSVP/entrance presentation and add Travel, Florence, and FAQ routes. Use approved facts and explicit pending content until final inputs arrive.
- [ ] **Completion inputs:** confirm household-versus-individual invitation codes, whether unconfirmed content may remain pending in this version, the approved homepage portrait filename, and local completion versus Vercel launch. Candidate photographs are in the local pictures_to_use folder and ignored by Git; the approved choice is not yet identified. No local service credentials are configured. Supabase and Vercel integrations were discovered but are not confirmed installed/connected. Do not invent these decisions or mark the whole project complete without the required verification.

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
