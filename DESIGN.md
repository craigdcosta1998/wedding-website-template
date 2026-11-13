# Italian Journal

Read PROJECT_BRIEF.md for requirements and DESIGN_DECISIONS.md for approved choices and remaining inputs. These project documents supersede the template's visual guidance in CLAUDE.md.

## Approved direction

An editorial Italian travel and wedding publication for Talia & Craig, Florence, Italy, September 14, 2027. Photography-led, asymmetric, restrained, and spacious. Remain a genuine multipage Next.js website.

English only. The journal reference should be expressed through composition, type, and imagery, not literal journal branding or edition labels in the public interface.

## Palette

The colour families are approved; these initial implementation values can be refined during visual review:

| Role | Colour | Value |
| --- | --- | --- |
| Paper | Warm ivory | #F6F2E9 |
| Accent | Muted terracotta | #A75E48 |
| Secondary text | Dusty olive | #62664E |
| Names and principal links | Oxblood | #582B35 |
| Body text | Warm charcoal | #302E28 |

Homepage tokens live in src/components/editorial/journal.module.css. Keep them scoped while other pages retain the template UI. Use the existing Crimson Text serif for display type and a restrained system sans serif for navigation and small labels. No new font download is required by this pass.

## Homepage hero: Editorial Cover

- Desktop: large portrait area offset to the right, with a narrow editorial margin on the left.
- Full couple names no longer appear as oversized hero typography. Keep the T & C masthead, small footer sign-off, and accessible page heading.
- The hero shows "We're getting married", "Florence", and the static month "September 2027" beside RSVP. The confirmed September 14 wedding day remains in shared configuration for other pages/calendar exports. Venue and event timings are still unconfirmed.
- A compact RSVP link and a numbered contents index lead into separate existing pages.
- Integrate the essential details into the photograph's frame: "We're getting married" along the top horizontal rule, and "Florence" vertically along the right rule. As the visitor scrolls, smoothly translate/scale the announcement into a large serif caption beneath the photograph and rotate/translate Florence into a horizontal caption below it. Reverse the movement on scroll up. No duplicate announcement in the left margin, Key info heading, separate details panel, duplicate date, or numeric 14/09 label.
- Motion follows scrolling. After a 150ms pause (or native scrollend), ease to the frame below 50% progress or to the bottom from 50% onward, over 320ms. Wait while a pointer/touch is held. Resume from the displayed pose without jumping back to raw scroll progress. Never intercept scrolling or move the page itself. Measure the frame/caption anchors again on resize and after fonts load. Use transform-only updates batched with requestAnimationFrame. The normal document flow reserves the caption area so animation does not shift the contents below.
- Florence shares the announcement's Crimson Text and oxblood colour, but stays smaller: 18px at the border and 20px beneath the photo on desktop, 16px on mobile. Keep natural title case, the vertical-to-horizontal animation, and a clear visual hierarchy beneath the large announcement caption. Size the longer announcement to fit mobile, tablet, and desktop widths.
- Reduced motion and no JavaScript: readable static announcement/location captions beneath the photograph. Moving duplicates are hidden from assistive technology; the static month and heading remain available. These fallbacks are part of the design.
- Mobile: portrait-oriented crop, compact introduction, reserved right gutter for vertical Florence, smaller border labels and final caption, and stacked contents links. Avoid horizontal scrolling.
- Tablet: preserve the asymmetry with a smaller margin and stack chapter descriptions as needed.
- Homepage navigation includes Our Story, The Celebrations (/events), Where to Stay (/hotels), Gifts, and RSVP. Show the confirmed September 12–15, 2027 range in the homepage celebrations listing. Do not create dead links to planned routes.
- Mobile navigation is a disclosure with expanded state, Escape-to-close, and a visible keyboard focus treatment. Include a skip-to-content link.

## Photograph handoff

No approved couple photograph exists in the repository. Render a clearly labelled, solid-colour placeholder until supplied. Do not substitute stock people or generated portraits.

Add the approved image under public/ and configure heroPhoto in src/config/homepage.ts with its public URL, meaningful English alt text, and objectPosition. The hero already supports next/image with responsive sizes and priority loading. Check subject placement in both the desktop landscape and mobile portrait crops before accepting the photograph.

## Scope and validation

This pass changes the homepage and its route-specific navigation/footer. Existing RSVP, event loading, authentication, admin, seating, locale routes, and other page layouts must remain intact. Wedding identity is shared through src/config/wedding.ts.

Verify English pages, legacy German-link redirects, desktop, tablet, mobile, navigation, keyboard access, type checking, lint, tests, and production build. Record unavailable checks honestly. A successful build does not establish live Supabase readiness or visual quality.
