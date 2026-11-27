# Wedding website backlog

Use this file with the current code and [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) when reviewing project status or pending work. It records decisions, required follow-up, and optional ideas. The implementation queue is `feature_list.txt` in the project root.

Keep resolved items checked with a short outcome; update this file when scope or priorities change. Do not store guest lists, invitation codes, passwords, or other private guest information here.

## Decisions and work to address

Current development focus (November 23, 2026): the design-led MVP order is Homepage, Celebrations / Events, then RSVP. Our Story, Florence, Travel, and Stay are lower priority. DESIGN.md is the single source of truth for the approved visual system, open design questions, reusable page components/dependencies, and sequential review plan. The supplied Canva moodboard was opened in Chrome; the latest explicit palette roles and composition principles are documented in DESIGN.md.

- [x] **Homepage hero refinement (November 23, 2026):** completed with a static naturally proportioned photo, no colored bands/decorative photo rules, and restrained Home-only ivory/oxblood header/footer. Independent design and technical final reviews approved the scoped change. Desktop/tablet/mobile screenshots and checks are recorded in DESIGN_DECISIONS.md. Final portrait choice and publication permission remain open.

- [x] **Homepage hero follow-up (November 27, 2026):** implemented the approved names-led variant with the requested local beach proposal preview, full-width 3:2 photo, smaller names, cursive typography, revised sentiment, unnumbered ordered links, and spritz mobile menu. Both final reviewers approved after 1440×1000, 768×1024, and 390×844 rendered review and mobile menu interaction. Lint, TypeScript, 265 tests, build, and diff checks passed. See DESIGN_DECISIONS.md. The photo remains a local preview; production stays on the labelled placeholder until publication permission is separately decided.

- [ ] **Remaining local visual/interaction review:** the homepage hero is rendered at 390×844, 768×1024, and 1440×1000 and has final design/technical approval. The chosen hero is static, so carousel keyboard/reduced-motion behavior does not apply. Still review Events and RSVP entry/form/validation/success responsively and complete their applicable interaction checks before moving to the next major design task. See DESIGN_DECISIONS.md.

- [x] **Independent reviews:** add separate design and technical reviewers, with preflight before substantive implementation and final reviews after every significant website change, including local/uncommitted work regardless of deployment. Complete both reviews before marking a change complete or starting unrelated significant work. Requested and clarified November 21, 2026; see [REVIEW_WORKFLOW.md](REVIEW_WORKFLOW.md). This is a local agent workflow; remote deployment enforcement is not configured.
- [x] **Credential unit:** Craig chose one invitation code per household on November 22, 2026, with a separate RSVP/event/dietary response for every named household member. Real guest lists and issued codes remain outside this local phase.
- [ ] **Selective invitations:** finalize who is invited to the Roce on September 12 and the pool party on September 15. Keep permissions independent so someone may be invited to either, both, or neither. Final lists belong in protected storage, not this repository.
- [ ] **Personalized event access setup:** server-side household session verification and independent event-grant filtering are implemented in Events and RSVP. Configure the protected household/grant records and explicit event-to-database links only after selective guest lists are finalized; then verify live event details, revocation, and expired/invalid credential behavior. Attendance responses do not grant invitations. The local planning preview shows all four days and production ignores it.
- [x] **Invitation session signing:** household sessions use a server-only signing secret, signed expiry, database-checked revocation, and auth-version rotation on code change (migration `00007`). Do not treat the shared site password or legacy `all_events` RSVP value as an event permission. Live migration/service behavior remains unverified.
- [ ] **Event details:** confirm timings, dress codes, addresses, transport, parking, and event-specific copy. The supplied venues are current plans; do not imply bookings or invent logistics.
- [ ] **Final hero portrait:** the local five-photo carousel is a development-only proof of concept using ignored personal photos; it does not select an approved portrait. Choose the final image and separately decide if it may be published. Production keeps the labelled placeholder until then; personal photos remain outside Git and `public/`.
- [ ] **Live integration:** configure and verify Supabase/RSVP/admin behavior before launch. Existing database event records can be linked to the celebrations catalogue when ready.
- [ ] **RSVP live links and configured submissions:** explicitly map the two public celebrations to existing database IDs using `celebration_event_links` after the records and guest permissions are ready. Household invitation codes resolve against `households.household_code`; `household_event_invitations` stores independent grants. The public RSVP page/action refuse attendance updates when the required public event links/records are unavailable. Private/unmapped events remain excluded from an unauthenticated guest view. Unit coverage exists; local/remote migration execution, configured repeat submission, rollback, and live service integration are unverified.
- [ ] **Atomic RSVP runtime verification:** the household action calls `save_household_rsvp` in migration `00008`, which validates and writes all member/event answers inside one PostgreSQL transaction and upserts by guest/event. Code and unit coverage exist, but the migration has not run against a local or remote database; verify transaction rollback and repeated submissions against Supabase before launch.
- [ ] **Remaining public pages:** the editorial Stay pending-content presentation passed both final reviews on November 22, 2026; approved hotel recommendations are still needed in `src/config/stay.ts`. Other page content remains lower priority while Home, Events, and RSVP are the active focus; Our Story is explicitly deferred. The Canva references are accessible via the supplied link and were inspected in Chrome; use the current approved palette in `DESIGN.md` unless Craig chooses a different combination.
- [ ] **Completion inputs:** Craig confirmed household codes and a verified local site with pending content on November 22, 2026. Keep the approved homepage portrait filename pending. Five ignored personal photos are used only for the local development carousel; the final portrait is not identified and publication requires a separate decision. No local service credentials are configured. Supabase and Vercel integrations were discovered but are not confirmed installed/connected. Do not invent these decisions or mark the whole project complete without the required verification.

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
