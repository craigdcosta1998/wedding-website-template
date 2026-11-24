# Design decisions

## Local review access and verification follow-up - 2026-11-22

- Restarted the development server at `http://127.0.0.1:3000/en` and supplied Craig the Home, `/en/events?preview=planning`, and `/en/rsvp?preview=planning&audience=both` links for review with Talia. The fictional RSVP preview saves nothing. These loopback links require this computer and the running development server.
- No application files changed in this follow-up. Fresh lint, explicit TypeScript, all 264 tests across 18 files, and `git diff --check` pass. Development HTTP checks return 200 for Home, public/planning Events, and public/planning RSVP. Public Events omits Villa Mangiacane; the explicit planning view includes it. Home includes the local-photo endpoint. Only the existing template illustration is tracked; no personal photo or review capture is staged.
- Independent technical final review APPROVED the local pending-content candidate on base `a055a6fbdf002702e817c740067504b49f9a5749`, bound to application manifest SHA256 `e5d84f75ae90e29903b84f7a8fbc1adea32098b70e9892f5d6eda4fd86cf1195`. Manifest: sorted unique modified/untracked paths under `src`, `supabase`, package/config files, and `.env.local.example`; each line is `path raw-file-sha256` or `path DELETED`, joined with LF as UTF-8. This excludes project records and ignored images. Prior production-build evidence applies to the unchanged application; live service limits remain as above.
- Independent design final remains BLOCKED only on fresh complete responsive/interaction evidence. Native Chrome displayed the current Home and its photos, and DevTools showed 390x844, but this is partial observation, not verification of all five slides or the full required matrix. Browser access host was unavailable; native access recovered, then Computer Use reported a physical Escape stop. No further browser input was issued in that turn. Preserve Chrome for Craig and Talia's review until access is available again; do not mark the carousel or local-phase goal complete.

## Home, Events, and household RSVP checkpoint - 2026-11-22

- Craig's current focus is the Home landing page, Events, and household RSVP. Our Story content is deferred. The local five-photo carousel uses ignored personal photos behind a development-only loopback endpoint; production keeps the labelled pending-portrait placeholder. The Canva page 35 palette was reviewed earlier; this change keeps the documented palette, with contrast-focused text usage, and does not replace or claim to verify exact Canva swatch values.
- The fictional RSVP planning journey is `/en/rsvp?preview=planning&audience=both` in development only (use `roce` or `pool` to narrow it). `DEMO01` opens fictional household members and per-person event/dietary responses; preview submissions never save or email. Production ignores the preview. Real codes, guest grants, database event links, and live Supabase/transaction behavior remain pending.
- Technical reviewer final: APPROVED for base `a055a6f` plus working-tree candidate snapshot `6a9c376d2fd7a7d2d63fa6478035bf18d69069606de95ed8f98ed0932a5f6f8a`. The reviewer found no blockers, confirmed production refusal and photo privacy, and did not independently repeat browser interactions. Design reviewer final: BLOCKED pending fresh current-candidate responsive Chrome evidence and interaction checks. Required: Home, all five images and name/control clearance, keyboard/pause/restart/reduced motion; Events four-day preview; RSVP entry, four-event form, validation/success, per-person choices, and change-invitation navigation, at 390x844, 768x1024, and 1440x1000.
- Verification: lint passed cleanly; explicit TypeScript passed; all 264 tests passed; production build passed with the existing Next.js middleware-convention deprecation notice; `git diff --check` passed. Local production HTTP checks returned 200 for Home, Events, and RSVP; production omitted fictional/private planning data and returned 404 for the local-photo route. Live database behavior remains unverified. Current rendered evidence could not be captured in this session: the CUA Chrome connection stopped on URL-policy detection, and a headless Chrome launch also failed. Do not treat older review captures as verification of this candidate.
- Personal originals in `pictures_to_use/` and screenshots in `review/` remain ignored; no personal image is staged or tracked. The existing template illustration remains tracked. The reviewed branch base is `a055a6f`. No palette replacement or deployment was performed.

## Household decision and access foundation - 2026-11-22

- Craig chose one invitation code per household, with independent RSVP/event/dietary responses for every named person. This phase targets a verified local site with explicit pending content, without deployment or issuing real credentials.
- Batch A on base a055a6f: dedicated SESSION_SECRET signing, signed seven-day expiry, UUID identity/auth-version validation, database-checked session revocation, and code-change auth-version rotation migration. New server-only household access reads current members and independent event grants. It is not yet wired into the guest journey or schedule. The old unsigned mutation unconditionally refuses submissions. No real guest data, invitation codes, secrets, remote database changes, or personal images were added.
- Technical final APPROVED; design final NOT_APPLICABLE. Reviewed files: src/lib/session.ts, household-access.ts and their tests; src/app/actions/auth.ts, rsvp.ts, rsvp-security.test.ts; .env.local.example; supabase/migrations/00007_household_invitations.sql; and decision records. All 224 tests across 13 files, lint, explicit TypeScript, production build and diff checks passed. /en/rsvp returned HTTP 200 with its unchanged pending state and no household data. SQL source was reviewed but has not been executed: no local PostgreSQL/Supabase or configured service exists. Live integration remains pending and must not be described as verified.

## Resumed goal and Stay final review - 2026-11-22

- Craig explicitly resumed the completion goal. He supplied the Canva link and requested palette review; Chrome confirmed viewer page 35 of 40 is titled “color palettes”. The current palette values remain recorded in DESIGN.md; no alternate combination was selected. Craig chose one household invitation code with independent responses per member and confirmed a verified local site with pending content as the phase target.
- Closed the pending Stay presentation review on base a055a6fbdf002702e817c740067504b49f9a5749 plus the working-tree changes in src/components/editorial/stay.module.css. Both independent reviewers approved the candidate. Scope: overline uses existing oxblood; area links and content links retain oxblood on hover with selectors that outrank the shared terracotta rule. No shared palette or layout redesign.
- Current Chrome full-page evidence is stored locally in review/stay-desktop.png, review/stay-tablet.png, and review/stay-mobile.png at 1440x1000, 768x1024, and 390x844 CSS viewports (DPR 2). Parent verified menu opening, Escape dismissal, visible Tab focus on area/programme links, both area anchors, and Enter navigation to the public celebrations page. The design reviewer inspected all three captures; interactions were reported by the parent. Hover specificity was inspected in source, not separately measured in computed styles.
- All 217 tests pass. Lint and explicit TypeScript pass, including reruns after the CSS correction; production build passes with the existing middleware-convention deprecation notice. Local production preview is running from the flattened project root on 127.0.0.1:3000. This completes the pending-content Stay presentation only; hotel recommendations, Canva direction, portrait selection, live services, invitation decisions, and overall launch work remain open.

## User-requested work-in-progress checkpoint — 2026-11-21

- Craig requested that development pause and the current work be committed and pushed as a Git snapshot to conserve quota. The completion goal is paused; this is a work-in-progress backup, not a release or a claim that the whole website is finished.
- The RSVP boundary fix has both independent final approvals. Stay has technical checkpoint approval and no design-source blocker, but its final design approval remains blocked pending current responsive Chrome and interaction evidence. Resume with that review before starting unrelated significant changes.
- The current application passed all 217 tests, clean lint, explicit TypeScript, and the production build. Supabase/email/admin integration, invitation decisions, approved photo/content, and the local-versus-Vercel finish line remain open as recorded in BACKLOG.md. No separate production deployment was requested for this checkpoint.

## Where to stay presentation — 2026-11-21

- Replace the /hotels template's fabricated rating/review count, price, distance, example booking link, and bracketed authoring copy with a restrained editorial guide. Reuse the existing editorial header/footer on this route without changing other page compositions.
- Store approved recommendations in typed `src/config/stay.ts`, grouped into Florence and countryside sections. Both are explicitly pending until approved content arrives. No hotels, prices, proximity, booking arrangements, or transfers are inferred. Future hotel links accept only HTTP(S) URLs without embedded credentials; names/descriptions render as ordinary text.
- Use generous spacing, serif hierarchy, fine rules, readable 16px body/14px area navigation, stacked mobile sections, and keyboard focus styling inherited from the editorial system. No card grid, glass treatment, decorative image placeholders, or substitute photography.
- All 217 tests, lint, explicit TypeScript, production build, and diff checks passed. Independent technical review approved the user-requested WIP snapshot; design source review found no blocker to that snapshot. Rendered responsive and interaction review has not been performed and final design approval remains pending. Development is paused at Craig's request. Approved recommendation content remains a separate user input; finishing this presentation does not establish that hotel recommendations are final.

## RSVP access boundary — 2026-11-21

- The complete-project audit found that RSVP loaded the full event table independently of the celebrations filter and trusted submitted event IDs. The page and action now share a server-only public-event loader, require complete unique database links for eligible public celebrations, and use approved catalogue names/date-only dates/venues. Private or unknown selections are rejected before writes; configured site-password access is checked within this boundary.
- Missing configuration or records now produce an honest unavailable state without a decline-capable form. The optional email client is constructed only when configured. Runtime validation rejects malformed payloads, unsupported dietary values, duplicate/oversized event lists, and unsupported action locales.
- Automated verification: all 217 tests, lint with no warnings, explicit TypeScript, production build, and diff checks passed. Local production HTTP checks returned 200 for Home, Events, RSVP, and the legacy German RSVP redirect; RSVP renders the unavailable state and no form. The checked public responses contain no private venue name. The build retains Next.js's existing middleware-convention deprecation notice.
- Both independent final reviewers approved application candidate `d900fba84407f679cd3ebcc8d45801ba43d99b5bccde2fa023188795c2f95f57` on base `20737bc718d9f706421b3e08bf5e65cb66ca75ac`. The initial reviewer Chrome connection stalled, but the parent subsequently captured current 390×844, 768×1024, and 1440×1000 CSS viewport evidence in `review/rsvp-mobile.png`, `review/rsvp-tablet.png`, and `review/rsvp-desktop-focus.png` (DPR 2). The design reviewer inspected these images and approved the focused unavailable-state change. The desktop file is layout evidence despite its filename: DevTools capture cleared the page focus indicator. Parent live Chrome checks separately verified the visible focus outline after Tab and Enter navigation to `/en/events`; the reviewer did not independently rerun those interactions. No horizontal overflow was observed. The existing template wrapper is intentionally retained for this behavior fix and is separate presentation work.
- Live Supabase/RSVP/admin/email integration is unverified: no service configuration is present. Existing database IDs still need explicit linking. Atomic persistence/idempotency remains required follow-up; these changes alone do not establish RSVP launch readiness. Invitation identity and selective guest lists remain undecided. Candidate photographs are in the local pictures_to_use folder and ignored by Git, including several beach images; the approved homepage file still needs identification. The final-content-versus-pending-content and local-versus-Vercel completion decisions were requested from Craig. No deployment or new credential issuance was performed.

## Approved by the user

- This Codex session is the primary implementation workspace; ChatGPT may be used separately for creative exploration.
- Repository project files are the source of truth for requirements and decisions.
- Italian Journal editorial aesthetic.
- Current homepage palette: ivory #F5F0E6, terracotta #B66E55, dusty olive #777D5C, oxblood #6F3038, espresso #332B27.
- Photograph-led Editorial Cover. Latest direction: selected beach portrait in a dominant portrait frame, with oversized expressive "Talia & Craig" overlapping its lower edge into the ivory margins. This supersedes the scroll-linked announcement/location hero below.
- Asymmetry and generous whitespace.
- Preserve a genuine multipage Next.js website and existing backend functionality.
- English only; no German translation or language controls.
- Journal aesthetics are implicit. Remove the public journal/edition title.
- Browser tabs use the coffee emoji as the favicon and the short title "T & C". Page headings retain the full couple names.
- Wedding date: September 14, 2027 (the user corrected an initial 2026 typo). Public location: "Florence, Italy", replacing "Florence / Tuscany, Italy".
- Celebrations run September 12–15, 2027: Roce at Villa Mangiacane on the 12th; welcome party at Serre Torrigiani on the 13th; wedding at Villa Corsini on the 14th; pool party at Villa Mangiacane on the 15th. Venue bookings, times, and finer logistics are not asserted. Roce/pool-party guest lists and credential identity are pending.
- Latest hero: centered portrait, static oversized names, small announcement/location labels, vertical "September 2027" beside the desktop frame and a horizontal date on mobile. No introductory paragraph or Italian sign-off.

## Celebrations page and project backlog — 2026-11-13

- Build /events as an editorial programme using the four dates and venues supplied by Craig. Keep timings, addresses, dress codes, transport, and other unknown details pending. Extend the existing editorial navigation/footer to this route; retain the homepage work.
- Store the schedule in server-only src/config/celebrations.ts. Provisionally treat Roce and pool party as invitation-only, with independent per-event filtering. Render only the selected events and links, rather than hiding private content with CSS. The default guest page currently contains the welcome party and wedding.
- Craig explicitly deferred individual-versus-couple/household credentials. No credential model, login form, invitation assignments, or database access migration was introduced. resolveVerifiedInvitations remains an unconnected server boundary that grants no private events. Credential integration and matching RSVP/database enforcement are required follow-up, not a completed authentication feature.
- /en/events?preview=planning shows all four events only when NODE_ENV is development. It is ignored in production and never grants RSVP access. Existing database records may be linked by an explicit databaseEventId to supply confirmed details; unlinked records are retained and the page works without Supabase configuration. The old event/contact components remain available, but the placeholder witness name/phone is not displayed on the new page.
- Add BACKLOG.md inside the repository for required decisions and optional ideas, including the Italian phrase. AGENTS.md and README.md point to it and instruct future status reviews to reconcile the actual code, verification notes, backlog, and original external feature queue. Do not store guest lists or issued credentials in these documents.
- Verification: all 189 tests passed, including 13 new tests for independent event selection, omission of private titles/venues/anchors from guest HTML, production preview refusal, explicit development preview, restricted detail queries/payloads, and unavailable data sources. Production build, explicit TypeScript, and diff checks passed. Lint retains the existing unused RSVP import warning. Both local guest and planning URLs returned HTTP 200; only the planning response contained Villa Mangiacane, Roce, and pool-party sections. Desktop/tablet/mobile layout rules were reviewed in source; no new browser screenshots were captured. Live credential matching and Supabase integration remain pending, as requested and recorded in BACKLOG.md.

## Centered portrait refinement — 2026-11-13

- Remove "A little Italian chapter. A lifetime together." and "Ci vediamo in Italia." from the homepage hero. Save the Italian phrase in the original feature_list.txt backlog as a nice-to-have with no current placement.
- Center the portrait on desktop, tablet, and mobile while retaining its existing sizes, aspect ratios, name overlap, labels, fine rules, palette, RSVP, and the rest of the page. Keep the desktop vertical date positioned beside the centered photo frame.
- Earlier review screenshots predate this refinement and show the previous offset photo/introduction. The selected beach photograph remains missing.
- Verification: production build, explicit TypeScript, all 176 existing tests, and diff checks passed. Lint retains the existing RSVP unused-import warning. Homepage returned HTTP 200 and contains neither removed passage. Centering and the adjacent date positioning were checked in desktop/tablet/mobile source rules; no new browser screenshots were taken for this small refinement.

## Portrait Editorial Cover iteration — 2026-11-12

- User requested one focused hero iteration with the selected beach portrait, portrait orientation, oversized overlapping names, intentional desktop/mobile compositions, and the exact palette above. Navigation, other homepage sections, verified dates/logistics, and backend functionality are retained.
- Asset inspection found no beach portrait. public/watercolor-hero.jpg is an unrelated venue illustration; the other public assets are template SVGs. Keep heroPhoto null and explicitly label the pending portrait. The exact photograph is the remaining input; do not substitute another image.
- Desktop uses a 4:5 portrait frame offset right and single-line serif names crossing the lower edge into the left ivory margin. Small left-side introduction, fine rules, labels, and a vertical month/date support the composition. Mobile uses a 3:4 frame, two-line names, horizontal date/RSVP, and the smaller introduction underneath. Tablet retains asymmetry with a wider relative image and smaller note.
- Preserve the entire supplied image via object-fit: contain. Face clearance and final image placement cannot be verified until the selected beach photograph is available. This iteration replaces the active scroll hero with static typography; the prior motion implementation remains in checkpoint 44a6228 and its existing component.
- Verification: production build, explicit TypeScript, all 176 existing tests, and git diff checks passed. Lint has only the pre-existing unused RSVP import warning. Desktop (1440×1000 viewport) and mobile (390×844 viewport) were visually reviewed in a separate Edge responsive preview; full-page screenshots are review/hero-desktop.png and review/hero-mobile.png. Chrome was not controlled. Screenshots show the labelled pending frame; this is layout verification, not photograph/crop approval.
- Earlier work was committed as 44a6228; the subsequent Celebrations rename/date-range change was committed separately as 04e153d. This hero iteration remains available for review in the working tree.

## Homepage captions and idle settlement — 2026-11-12

- Move "We're getting married" from the left margin to the top photo border and large landing caption. Replace the rotating full date with "Florence". Show "September 2027" as a static semantic month beside RSVP in place of "Venue and timings to follow". Keep the confirmed wedding date and calendar behavior in shared configuration.
- Continue following scroll position while scrolling. After 150ms idle, or native scrollend, ease both captions to the frame below 50% progress or below the photograph from 50% onward, over 320ms. Defer settlement while a pointer/touch is held. Rebase resumed scrolling at the displayed pose to avoid a jump back to the middle. Do not change the visitor's scroll position.
- Keep reduced-motion/no-JavaScript static captions and responsive type sizes. Retain the multipage navigation, Our Story work, and existing backend functionality.
- Verification: all 176 tests passed, including 15 cover-motion tests for movement, threshold behavior, continuous scrolling, pointer holds, resumed/interrupted settlement, restored scroll position, reduced motion, resizing, and cleanup. Production build and explicit TypeScript passed; lint has only the existing RSVP unused-import warning. HTTP checks returned 200 and confirmed the new captions/static month and removal of the old note/moving date. Browser visual review was not performed; the user asked to stop controlling Chrome.

## Celebrations naming — 2026-11-12

- The user confirmed celebrations from September 12 to September 15, 2027, so "The Weekend" no longer fits. Rename the editorial navigation, homepage listing, Our Story closing link, standard navigation, and events page heading to "The Celebrations". Keep the existing /events route.
- Store the date range in shared wedding configuration and derive its display text for the homepage listing. Keep "September 2027" static beside RSVP as requested. Individual events still use their existing database-backed schedule.
- Verification: production build and explicit TypeScript passed; lint retains the existing RSVP unused-import warning. Home, Our Story, and Hotels returned HTTP 200, showed "The Celebrations", and contained no "weekend" wording. The homepage listing showed the derived date range. Browser visual review remains pending.

Matching-date refinement verified on 2026-11-09: all 166 tests, production build, and explicit TypeScript passed. Lint has only the existing RSVP unused-import warning. HTTP/CSS checks confirmed the location and date share the same font family, size, and colour rule in the served stylesheet. The right gutter and caption flow reserve space for the larger date. Browser visual review remains pending.

Smaller-date revision verified on 2026-11-09: all 166 tests and production build (including TypeScript) passed. Lint retains its existing RSVP unused-import warning. HTTP/CSS checks confirmed the served date caption uses the smaller 20px desktop rule. The date retains its serif font, oxblood colour, and animation; the equal-size experiment above is historical. Visual browser review remains pending.

Tab update verified on 2026-11-09: production HTML title is "T & C" and its linked SVG serves the coffee emoji with HTTP 200. Build, TypeScript, and all 161 tests passed; lint retains its existing RSVP unused-import warning. Native browser rendering remains unverified because no browser is connected.

## First implementation — 2026-11-09

- Implement the homepage only, with route-specific editorial header and footer.
- Initially retained German and English; superseded by the user's English-only request below.
- Use existing routes for navigation and contents; planned Travel, Florence, FAQ, and wedding subpages remain unimplemented.
- Use a clearly marked portrait placeholder until a real couple photograph is supplied.
- Palette hex values, homepage wording, and responsive proportions are first-pass implementation choices, pending visual feedback.
- Update the shared names, month/year, and regional location from the approved brief. Do not invent exact dates or logistics.

## Feature-list revision — 2026-11-09

- The user's feature queue is feature_list.txt in the project root. An accidentally created duplicate inside the repository was removed.
- Remove the homepage footer's Florence/"Together is a beautiful place to be" line and its duplicate Gifts link. Gifts remains in the main navigation.
- Replace the single-line location/date details with a Key info section: Where, When, the approved regional location and month/year, and an explicit note that exact dates/times are pending. Use editorial serif type and fine rules rather than cards.

Verification: all 161 existing tests passed; lint passed with the existing RSVP unused-import warning; production build and explicit TypeScript check passed. HTTP/HTML checks confirmed the Key info heading and Where/When fields, removal of the footer quote and footer link, and preservation of the navigation Gifts link. Visual browser review is still pending. The three items are marked complete in the user's original feature list.

## Editorial Key info refinement — 2026-11-09

- User feedback: the labelled Where/When layout did not feel editorial enough. Replace it with a standalone spread, large city/italic country typography, an offset date folio, and a small title in the margin. Keep a compact two-column composition on mobile.
- Confirmed wedding date is September 14, 2027; the user corrected an initial 2026 typo. Public location is Florence, Italy.
- The shared date config derives display parts and calendar dates from 2027-09-14. The RSVP calendar export is now an all-day hold for that date, with an exclusive September 15 end; no ceremony time is assumed. Venue and timings still await confirmation.
- Build, explicit TypeScript, and all 161 tests passed. Lint retains its existing RSVP unused-import warning. Config checks confirmed the exact date, location, and all-day calendar range. HTTP/HTML checks confirmed the new section, semantic date, removed old location/details layout, and preserved T & C tab title. Visual browser review remains pending because no browser is connected.

## Scroll-linked cover revision — 2026-11-09

- User feedback: the separate date/location spread felt random, and the large couple names were unnecessary. Remove the visible Key info heading, separate spread, oversized name wordmark, duplicate top date, and redundant numeric date.
- Florence, Italy starts just above the image's horizontal frame; the full date starts along its right vertical frame. As the visitor scrolls, the text moves below the photograph into the former name area. The date rotates to horizontal. The same movement reverses on scroll up.
- Keep the small T & C header identity and full names in the footer/semantic heading. Preserve the approved date/location and existing multipage functionality.
- Reduced-motion preferences and no JavaScript show static captions below the photo. Motion uses measured frame/landing anchors with resize/font-load updates and a passive scroll listener; it never changes the scroll position.
- Added five interaction regression tests covering endpoints/reversal, intermediate movement and frame batching, reduced-motion changes, resize, and cleanup. All 166 tests passed using `npm run test:run -- --configLoader runner`. This environment's default esbuild config bundler cannot read a parent directory, so Vitest aliases now use import.meta.url instead of __dirname to support its runner loader. No permission expansion or dependency changes were needed.
- Production build passed. Lint retains the pre-existing RSVP unused-import warning. Browser visual review is still pending because the session has no connected browser; the interaction tests use controlled geometry and do not establish pixel-level appearance.
- Explicit TypeScript and production HTTP checks also passed. The served homepage includes both moving labels and a semantic September 14, 2027 date; the visible Key info section, oversized names, and numeric date are absent. The native scroll preview is at http://127.0.0.1:3000/en.

## Remaining inputs and limitations

- Approved couple photograph and crop selection.
- Venues, individual event dates/times within September 12–15, contact details, hotel recommendations, and final guest-facing copy.
- The calendar download holds September 14, 2027 as an all-day date with an exclusive September 15 end. Event times remain unconfirmed.
- Existing database-backed pages require Supabase configuration and live verification. Admin pages/seating additionally require the server-only ADMIN_USER_IDS allowlist.
- Admin authorization work predates this homepage pass and remains in the working tree. Do not overwrite it or assume it has been committed.

## English-only revision — 2026-11-09

- English is the only supported locale and the default; browser language and old locale preferences do not select German.
- Keep /en URLs. Redirect old /de URLs to their matching /en path, preserving query parameters. Password and admin authorization still apply at the destination.
- Remove the German message file and language-switch components/links.
- Remove "The Italian Journal · A wedding edition" from the homepage. Rename the contents label to "Explore" so the aesthetic stays implicit.
- The existing database schema, bilingual database columns, and dormant legacy content helpers remain for backend compatibility; no database migration is needed. Guest-facing routes use English.

Verified against this revision:

- 161 tests passed across 6 files, including legacy-link redirect coverage.
- Production build and explicit TypeScript check passed. The build generates English pages only.
- Lint passed with the existing unused CardDescription import warning in the RSVP form. The existing middleware deprecation warning remains.
- HTTP checks: / redirects to /en even with a German browser preference and an old German locale cookie. Old /de links redirect with status 308 to the matching English path and preserve query parameters, including an admin-path redirect checked without following it into the unconfigured backend.
- Homepage, Our Story, Hotels, Gifts, Password, and Admin Login returned 200 in English. Returned HTML contains neither language-switch labels nor the removed journal/edition title.
- Production preview restarted at http://127.0.0.1:3000/en. Browser visual/interaction and live backend checks remain unavailable/unverified as described below.

## First homepage verification (historical)

Checked on 2026-11-09 against the homepage working tree:

| Check | Result |
| --- | --- |
| npm run test:run | 149 tests passed across 6 files; existing suite, no new homepage interaction tests |
| npm run lint -- --no-cache | Passed with one existing unused CardDescription import warning in the RSVP form |
| npm run build | Passed after final homepage adjustments; existing middleware-convention deprecation warning remains |
| tsc --noEmit --incremental false | Passed after the final build |
| git diff --check | Passed |
| Production HTTP checks | 200 for /en and /de, plus Our Story, Hotels, Gifts, Password, and Admin Login in both languages |
| Homepage HTML and CSS | Both locales contain approved names, labelled photo placeholder, menu controls, and links to existing routes; stylesheet serves successfully with journal palette and responsive breakpoints |
| Browser visual/interaction checks | Not performed: browser inventory is empty and opening the in-app browser reports it unavailable. Desktop/tablet/mobile layouts reviewed in source only; rendered crop, overflow, menu interaction, focus, and client navigation still need browser verification |
| Live RSVP/admin/seating | Not verified; development backend configuration remains absent |

Local production preview: http://127.0.0.1:3000/en, started with npm run start -- --hostname 127.0.0.1 --port 3000. This URL requires the local server process to remain running. No deployment or commit was performed.

Next review: supply the real couple photograph, verify its desktop/mobile crops and the rendered cover composition, then refine proportions and copy from that visual review before extending the design to another page.
# Design-led MVP and current hero handoff — 2026-11-23

- Craig confirmed a focused priority order: Homepage, Celebrations / Events, RSVP. Our Story, Florence, Travel, and Stay are lower priority for now.
- DESIGN.md is now the single visual-system reference. Confirmed palette roles are warm ivory `#F5F0E6` as the primary canvas, oxblood `#6F3038` as signature typography, muted terracotta `#B66E55` and dusty olive `#777D5C` as restrained supporting accents, and espresso `#332B27` for readable body text. Colours support the photography and composition; they should not be added arbitrarily to interface elements.
- The immediate first implementation task is limited to the existing homepage hero: refine colour integration and photograph presentation, and assess static imagery versus quiet carousel controls outside the image. Preserve the asymmetrical cover, oversized overlapping names, whitespace, date treatment, page navigation and established functionality. No visual change was made in this documentation pass.
- Source inspection for the handoff: `editorial-cover.tsx` currently renders one fixed personal photo from the local development preview and a labelled placeholder in production. The separate carousel component exists but the cover does not currently render it. Personal photos remain local and ignored; no hero image or publication permission is confirmed.
- Reusable components and technical boundaries, open questions, and the sequential implementation/review gates are recorded in DESIGN.md. Each major page task must receive independent preflight and final design/technical review, current desktop/tablet/mobile evidence, and relevant checks before the next page begins.
- Verification status remains separate from the documentation decision: the earlier Home/Events/RSVP Chrome matrix and final design approval are still pending as recorded above. This pass did not claim those UI changes verified and did not modify application code.

## Homepage hero refinement — 2026-11-23

- Refined the homepage cover only. The hierarchy is ivory canvas and Home header, oxblood names and vertical date, one naturally proportioned photograph, then quiet RSVP and contents links. The existing asymmetrical cover, oversized overlapping names, whitespace, and responsive layout remain.
- Removed decorative photo rules and fixed-ratio framing that could letterbox the image. The cover remains static: the carousel was not present in this hero, and a single photograph gives the composition more focus. Its component/data/tests remain available for later use elsewhere. No autoplay, motion, or hero controls are rendered.
- Scoped the ivory/oxblood header and footer treatment to Home. The shared footer styling on other editorial routes remains unchanged by this refinement. No RSVP backend, admin, or unrelated page work was included in this change.
- Independent final design and technical reviews: APPROVED for the scoped candidate. Design review confirms the photo-to-name overlap and palette at all three viewports. Technical review confirms route-specific styling and unchanged production placeholder/local development photo behavior. The technical reviewer separately identified unrelated pre-existing hunks in `src/components/layout/footer.tsx`; those are outside this change's review scope and are not represented as approved here.
- Rendered evidence: `review/hero-refined-desktop.png` (1440×1000), `review/hero-refined-tablet.png` (768×1024), and `review/hero-refined-mobile.png` (390×844). Captures show the Next.js development badge over part of the contents section on tablet/mobile; the hero itself is unobscured. The screenshots use the current local preview portrait. Final portrait selection and permission to publish a personal photo remain open.
- Checks: ESLint passed; 264 tests passed across 18 files; TypeScript passed; production build passed; `git diff --check` passed. Build retains the existing Next.js middleware-convention deprecation warning. Local preview returned HTTP 200 at `http://127.0.0.1:3000/en`.
- The homepage hero refinement is complete. The broader Home/Events/RSVP interaction matrix and visual review of Events and RSVP remain queued; they are separate from this focused hero task. Because the selected hero is static, carousel keyboard and reduced-motion behavior do not apply to it.
