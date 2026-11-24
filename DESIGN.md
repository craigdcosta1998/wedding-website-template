# Approved visual system and MVP

This is the single source of truth for the approved visual direction and the design-led implementation sequence. Wedding facts and unresolved content remain governed by [PROJECT_BRIEF.md](PROJECT_BRIEF.md), [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md), and [BACKLOG.md](BACKLOG.md). When historical implementation notes conflict with this document or the latest user direction, follow the latest approved user direction and record the outcome in DESIGN_DECISIONS.md.

## Confirmed visual decisions

- **Italian Journal:** an editorial, romantic, warm, elegant and photography-led aesthetic for a Florence destination wedding. The journal is a visual reference, not a public title or edition label.
- **Composition:** expressive typography, generous whitespace, asymmetry and restrained editorial details. Photography should lead; colour and interface elements should support the composition rather than compete with it.
- **Palette and roles:**

  | Role | Colour | Value | Use |
  | --- | --- | --- | --- |
  | Primary canvas | Warm ivory | `#F5F0E6` | Main page surface and breathing room |
  | Signature type | Oxblood | `#6F3038` | Names, principal headings and considered links |
  | Warm accent | Muted terracotta | `#B66E55` | Occasional small accents, supported by imagery |
  | Natural accent | Dusty olive | `#777D5C` | Occasional secondary detail, supported by imagery |
  | Main text | Espresso | `#332B27` | Body copy and readable supporting text |

- Use ivory as the main canvas. Do not force every palette colour into every section. Prefer fine rules, tonal variation, type and natural photographic colour over solid decorative blocks.
- **Typography:** retain the existing display serif and restrained sans serif for navigation and small labels. Avoid excessive script, ornamental wedding graphics and conspicuous interface chrome.
- **Responsive design:** desktop, tablet and mobile should each have intentional editorial composition and readable hierarchy. Prevent horizontal overflow; preserve keyboard access, visible focus, semantic structure and reduced-motion preferences.
- Keep a true multipage Next.js site. The aesthetic must not turn Events or RSVP into generic card grids.

## Confirmed homepage direction

- Preserve the existing asymmetric Editorial Cover: oversized expressive oxblood names overlap the photograph, generous ivory whitespace, a vertical date on desktop and understated editorial labels.
- Refine the existing hero rather than replacing its composition. The image should occupy a frame appropriate to its aspect ratio, without coloured letterboxing or decorative borders. Let whitespace outside the photograph provide separation.
- Evaluate a single static hero photograph against quiet, minimal carousel controls placed outside the image. Preserve the remaining local photos for suitable later homepage use. The final portrait is not selected, and public use of a personal photo requires a separate user decision.
- Keep the five-photo personal-photo preview local and development-only. Do not copy personal photos to `public/`, commit them, or deploy them. Production keeps the clearly labelled pending-portrait presentation until the portrait and publication decision are confirmed.
- Preserve established navigation, page content, RSVP and admin behavior while making a focused hero change.

## Three-page MVP priorities

1. **Homepage:** first priority. Refine the hero's colour integration, photograph presentation and carousel treatment; then verify the full homepage experience.
2. **Celebrations / Events:** second priority. Refine the editorial event programme and responsive presentation while preserving server-side visibility and invitation rules.
3. **RSVP:** third priority. Refine the guest-facing household invitation and response experience while preserving authentication, validation, per-person answers, dietary notes, persistence and admin workflows.

Our Story, Florence, Travel and Stay are lower priority. Do not redesign them as part of these tasks. Preserve their routes and working behavior.

## Existing reusable components and dependencies

| Area | Existing implementation | Dependencies and preservation boundary |
| --- | --- | --- |
| Shared journal shell | `src/components/editorial/site-chrome.tsx`; `journal.module.css` | Shared navigation and footer; locale routing, disclosure menu, Escape handling, skip link and focus styling. Treat shared CSS carefully because it reaches multiple routes. |
| Homepage cover | `src/components/editorial/editorial-cover.tsx`; `editorial-cover.module.css` | Shared wedding facts from `src/config/wedding.ts`; Next Image; currently local development photo preview and production placeholder. |
| Carousel | `src/components/editorial/homepage-photo-carousel.tsx` and its test; `src/config/local-photo-preview.ts` | Five fixed local photo IDs; development-only loopback endpoint at `src/app/api/local-photo/[photoId]/route.ts`. Component currently exists independently of the cover's direct static image rendering. |
| Events | `src/app/[locale]/events/`, `celebrations-schedule.tsx`, `celebrations.module.css`, `src/config/celebrations.ts` | Server-only event catalogue and household-grant filtering in `src/lib/celebration-access.ts`; invitation access and database mappings must remain server-enforced. |
| RSVP | `src/app/[locale]/rsvp/`, `src/components/rsvp/household-journey.tsx`, `rsvp.module.css` | Auth actions, household session/access, validation, server action and persistence in `src/lib/household-*`, `src/app/actions/household-rsvp.ts`, Supabase migrations `00007` and `00008`. Preserve admin/auth/database behavior. |

## Sequential implementation and review plan

Each step is a separate, narrow candidate. Complete its checks and independent design and technical reviews before proceeding to the next major step, as required by [REVIEW_WORKFLOW.md](REVIEW_WORKFLOW.md). Reviewers inspect and report; they do not implement. The current process/documentation task does not authorize visual implementation.

| Order | Task | Scope | Review gate |
| --- | --- | --- | --- |
| 0 | **Approve this design/process record** | Documentation only. Confirm the visual system, open questions and three-page sequence. | Check project records and links for consistency; no application build or screenshots needed. |
| 1 | **Homepage hero refinement** | Hero palette roles, image aspect-ratio presentation, and static-versus-quiet-controls decision. No other page redesign or backend edits. | Preflight both reviewers; lint, type check and relevant tests; review Home at 1440×1000, 768×1024 and 390×844, including keyboard and reduced-motion behavior; obtain both final reviews. |
| 2 | **Celebrations / Events** | A separately proposed editorial refinement after Step 1 is reviewed. Preserve event privacy, invitation filtering and planning-preview production refusal. | New preflight and final reviews; desktop, tablet and mobile rendered evidence; relevant access and route checks. |
| 3 | **RSVP** | A separately proposed guest-flow refinement after Step 2 is reviewed. Preserve household authentication, per-person event and dietary answers, validation, persistence, and admin boundaries. | New preflight and final reviews; desktop, tablet and mobile rendered evidence; entry, validation, success, keyboard and relevant persistence checks. |

For each implementation task, inspect the affected code first, state the narrow approach and preservation boundaries, then wait for preflight reviews before substantive edits. After implementation, run lint, explicit TypeScript, relevant tests, production build when application code changes, and `git diff --check`. Capture current desktop and mobile evidence (plus tablet where required); record unavailable evidence plainly. Do not proceed to the next page while a required review or check is blocked. Keep `feature_list.txt` as the single task queue and reconcile status with BACKLOG.md and DESIGN_DECISIONS.md.

## Open questions

- Which of the local photographs, if any, should be the final homepage hero, and may it be published? Until decided, keep the production pending-portrait presentation.
- Should the homepage use one static hero image or retain a carousel? The first implementation task will assess the composition; if controls remain, their placement and interaction should stay quiet, accessible and outside the photograph.
- The exact way terracotta and dusty olive appear in supporting photography and page details should follow the composition. Their presence in every section is not a requirement.
- Event times, dress codes, addresses, transport details and selective invitation lists remain unconfirmed. Keep placeholders or omit details; do not invent them.
- RSVP live service readiness, event database mappings, credentials and migration execution remain tracked in BACKLOG.md; visual work must not assume they are resolved.
