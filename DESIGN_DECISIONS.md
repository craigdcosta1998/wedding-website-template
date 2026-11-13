# Design decisions

## Approved by the user

- This Codex session is the primary implementation workspace; ChatGPT may be used separately for creative exploration.
- Repository project files are the source of truth for requirements and decisions.
- Italian Journal editorial aesthetic.
- Warm ivory, muted terracotta, dusty olive, and oxblood palette.
- Photograph-led Editorial Cover. The latest hero uses moving announcement/location captions around the photograph's frame; this supersedes the earlier oversized-name and location/date treatments.
- Asymmetry and generous whitespace.
- Preserve a genuine multipage Next.js website and existing backend functionality.
- English only; no German translation or language controls.
- Journal aesthetics are implicit. Remove the public journal/edition title.
- Browser tabs use the coffee emoji as the favicon and the short title "T & C". Page headings retain the full couple names.
- Wedding date: September 14, 2027 (the user corrected an initial 2026 typo). Public location: "Florence, Italy", replacing "Florence / Tuscany, Italy".
- Latest hero copy: "We're getting married" moves from the top frame to the large caption below. "Florence" replaces the moving date, retaining its smaller serif/oxblood typography and rotation. "September 2027" stays static beside RSVP. At rest, captions settle to an endpoint using a halfway threshold.

## Homepage captions and idle settlement — 2026-11-12

- Move "We're getting married" from the left margin to the top photo border and large landing caption. Replace the rotating full date with "Florence". Show "September 2027" as a static semantic month beside RSVP in place of "Venue and timings to follow". Keep the confirmed wedding date and calendar behavior in shared configuration.
- Continue following scroll position while scrolling. After 150ms idle, or native scrollend, ease both captions to the frame below 50% progress or below the photograph from 50% onward, over 320ms. Defer settlement while a pointer/touch is held. Rebase resumed scrolling at the displayed pose to avoid a jump back to the middle. Do not change the visitor's scroll position.
- Keep reduced-motion/no-JavaScript static captions and responsive type sizes. Retain the multipage navigation, Our Story work, and existing backend functionality.
- Verification: all 176 tests passed, including 15 cover-motion tests for movement, threshold behavior, continuous scrolling, pointer holds, resumed/interrupted settlement, restored scroll position, reduced motion, resizing, and cleanup. Production build and explicit TypeScript passed; lint has only the existing RSVP unused-import warning. HTTP checks returned 200 and confirmed the new captions/static month and removal of the old note/moving date. Browser visual review was not performed; the user asked to stop controlling Chrome.

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
- Venues, event timings, dates for the other weekend events, contact details, hotel recommendations, and final guest-facing copy.
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
