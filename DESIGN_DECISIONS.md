# Design decisions

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
- Both independent final reviewers approved application candidate `d900fba84407f679cd3ebcc8d45801ba43d99b5bccde2fa023188795c2f95f57` on base `20737bc718d9f706421b3e08bf5e65cb66ca75ac`. The initial reviewer Chrome connection stalled, but the parent subsequently captured current 390×844, 768×1024, and 1440×1000 CSS viewport evidence in `../review/rsvp-mobile.png`, `../review/rsvp-tablet.png`, and `../review/rsvp-desktop-focus.png` (DPR 2). The design reviewer inspected these images and approved the focused unavailable-state change. The desktop file is layout evidence despite its filename: DevTools capture cleared the page focus indicator. Parent live Chrome checks separately verified the visible focus outline after Tab and Enter navigation to `/en/events`; the reviewer did not independently rerun those interactions. No horizontal overflow was observed. The existing template wrapper is intentionally retained for this behavior fix and is separate presentation work.
- Live Supabase/RSVP/admin/email integration is unverified: no service configuration is present. Existing database IDs still need explicit linking. Atomic persistence/idempotency remains required follow-up; these changes alone do not establish RSVP launch readiness. Invitation identity and selective guest lists remain undecided. Candidate photographs were found in the parent workspace, including several beach images; the approved homepage file still needs identification. The final-content-versus-pending-content and local-versus-Vercel completion decisions were requested from Craig. No deployment or new credential issuance was performed.

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

- Remove "A little Italian chapter. A lifetime together." and "Ci vediamo in Italia." from the homepage hero. Save the Italian phrase in the original ../feature_list.txt backlog as a nice-to-have with no current placement.
- Center the portrait on desktop, tablet, and mobile while retaining its existing sizes, aspect ratios, name overlap, labels, fine rules, palette, RSVP, and the rest of the page. Keep the desktop vertical date positioned beside the centered photo frame.
- Earlier review screenshots predate this refinement and show the previous offset photo/introduction. The selected beach photograph remains missing.
- Verification: production build, explicit TypeScript, all 176 existing tests, and diff checks passed. Lint retains the existing RSVP unused-import warning. Homepage returned HTTP 200 and contains neither removed passage. Centering and the adjacent date positioning were checked in desktop/tablet/mobile source rules; no new browser screenshots were taken for this small refinement.

## Portrait Editorial Cover iteration — 2026-11-12

- User requested one focused hero iteration with the selected beach portrait, portrait orientation, oversized overlapping names, intentional desktop/mobile compositions, and the exact palette above. Navigation, other homepage sections, verified dates/logistics, and backend functionality are retained.
- Asset inspection found no beach portrait. public/watercolor-hero.jpg is an unrelated venue illustration; the other public assets are template SVGs. Keep heroPhoto null and explicitly label the pending portrait. The exact photograph is the remaining input; do not substitute another image.
- Desktop uses a 4:5 portrait frame offset right and single-line serif names crossing the lower edge into the left ivory margin. Small left-side introduction, fine rules, labels, and a vertical month/date support the composition. Mobile uses a 3:4 frame, two-line names, horizontal date/RSVP, and the smaller introduction underneath. Tablet retains asymmetry with a wider relative image and smaller note.
- Preserve the entire supplied image via object-fit: contain. Face clearance and final image placement cannot be verified until the selected beach photograph is available. This iteration replaces the active scroll hero with static typography; the prior motion implementation remains in checkpoint 44a6228 and its existing component.
- Verification: production build, explicit TypeScript, all 176 existing tests, and git diff checks passed. Lint has only the pre-existing unused RSVP import warning. Desktop (1440×1000 viewport) and mobile (390×844 viewport) were visually reviewed in a separate Edge responsive preview; full-page screenshots are ../review/hero-desktop.png and ../review/hero-mobile.png. Chrome was not controlled. Screenshots show the labelled pending frame; this is layout verification, not photograph/crop approval.
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

- The user's feature queue is ../feature_list.txt in the project parent directory. An accidentally created duplicate inside the repository was removed.
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
