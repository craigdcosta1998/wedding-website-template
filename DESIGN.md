# Italian Journal

Read PROJECT_BRIEF.md for requirements and DESIGN_DECISIONS.md for approved choices and remaining inputs. These project documents supersede the template's visual guidance in CLAUDE.md.

## Approved direction

An editorial Italian travel and wedding publication for Talia & Craig, Florence, Italy, September 14, 2027. Photography-led, asymmetric, restrained, and spacious. Remain a genuine multipage Next.js website.

English only. The journal reference should be expressed through composition, type, and imagery, not literal journal branding or edition labels in the public interface.

## Palette

The user specified these exact values for the current homepage cover:

| Role | Colour | Value |
| --- | --- | --- |
| Paper | Warm ivory | #F5F0E6 |
| Accent | Terracotta | #B66E55 |
| Secondary text | Dusty olive | #777D5C |
| Names and principal links | Oxblood | #6F3038 |
| Body text | Espresso | #332B27 |

The current homepage palette overrides live in src/components/editorial/editorial-cover.module.css; the other editorial pages retain their existing journal.module.css tokens. Use the existing Crimson Text serif for display type and a restrained system sans serif for navigation and small labels. No new font download is required by this pass.

## Homepage hero: Editorial Cover

- This iteration supersedes the scroll-linked announcement/location hero. Keep it static and focused on the portrait and names; the prior motion component remains available in the repository/checkpoint.
- Desktop: centered 4:5 portrait capped at 540px wide, with generous ivory space. Oversized expressive serif "Talia & Craig" crosses the lower photo edge into the margins. The vertical date stays beside the centered frame.
- Use the selected beach portrait only. The source is missing, so the current frame says "Selected beach portrait to follow". Do not substitute the unrelated watercolor asset, stock photography, or generated people.
- Preserve the full image with object-fit: contain. Names overlap the lower edge; verify face clearance against the actual photograph once supplied. The missing photograph prevents final crop/face approval.
- Fine rules and small "We're getting married" / "Florence, Italy" labels frame the portrait. "September 2027" is a restrained vertical date on desktop, horizontal below the photo on mobile. Preserve the verified wedding day and celebration range in shared configuration.
- Mobile: centered, near-full-width 3:4 portrait, offset left frame rule, two-line "Talia &" / "Craig" across its lower edge, and horizontal date/RSVP. Avoid horizontal scrolling.
- Tablet: retain the wider relative portrait, centered within the page. Keep names within the page width.
- Remove the introduction and Italian sign-off from the hero. "Ci vediamo in Italia." is saved in ../feature_list.txt under ideas without a home; it has no current placement.
- This is a single hero iteration: navigation, contents, other pages, and backend behavior are not redesigned.
- Homepage navigation includes Our Story, The Celebrations (/events), Where to Stay (/hotels), Gifts, and RSVP. Show the confirmed September 12–15, 2027 range in the homepage celebrations listing. Do not create dead links to planned routes.
- Mobile navigation is a disclosure with expanded state, Escape-to-close, and a visible keyboard focus treatment. Include a skip-to-content link.

## Celebrations programme

- Extend the editorial header/footer to /events. Preserve the homepage and other pages' compositions.
- Large serif page heading, a restrained date range, fine rules, a simple event index, and spacious date/title/venue rows. No card grid, glass panels, stock venue images, or invented event descriptions/logistics.
- Display the supplied September 12–15 schedule and venues in the local planning preview. The guest response contains only the welcome party and wedding until credential matching is decided and implemented; private sections and their index links must be omitted server-side.
- Retain independent permissions for Roce and pool party. The choice of guest versus couple/household credentials remains open in BACKLOG.md. Do not activate a credential model or assign guest lists.
- Desktop uses a separate date margin and side-by-side event/venue text. Tablet stacks venue text; mobile has a compact date rail and stacked titles/venues with a vertical index.
- Dates are date-only; any confirmed linked database timings use Europe/Rome. Pending times, dress codes, addresses, and transport are not fabricated. Existing records can be linked via databaseEventId in src/config/celebrations.ts.

## Photograph handoff

The selected beach portrait does not exist in the repository. The only raster asset, public/watercolor-hero.jpg, is an unrelated venue illustration. Render a clearly labelled, solid-colour portrait frame until the exact photograph is supplied. Do not substitute stock people or generated portraits.

Add the selected image under public/ and configure heroPhoto in src/config/homepage.ts with its public URL, meaningful English alt text, and objectPosition. The hero supports next/image with responsive sizes, priority loading, and full-image fitting. Check subject placement and name overlap in both portrait compositions before accepting the photograph.

## Scope and validation

This pass changes the homepage and its route-specific navigation/footer. Existing RSVP, event loading, authentication, admin, seating, locale routes, and other page layouts must remain intact. Wedding identity is shared through src/config/wedding.ts.

Verify English pages, legacy German-link redirects, desktop, tablet, mobile, navigation, keyboard access, type checking, lint, tests, and production build. Record unavailable checks honestly. A successful build does not establish live Supabase readiness or visual quality.
