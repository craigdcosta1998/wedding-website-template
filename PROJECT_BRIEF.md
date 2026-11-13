# Talia & Craig Wedding Website

## Project

This is the wedding website for Talia and Craig.

Wedding:
- Florence, Italy
- Wedding day: September 14, 2027
- Celebrations: September 12–15, 2027
- Approximately 150–200 guests
- Multi-day destination wedding

The website should feel like a high-end editorial travel and wedding publication rather than a conventional wedding template.

## Core design direction

Keywords:
- editorial
- romantic
- elegant
- Italian
- understated
- warm
- timeless
- fashion-magazine inspired
- photography-led
- sophisticated rather than flashy

Avoid:
- generic wedding website aesthetics
- excessive cursive/script fonts
- cheesy wedding graphics
- hearts
- floral clipart
- excessive animations
- glassmorphism
- generic SaaS UI
- excessive rounded cards
- overly beige "Pinterest wedding" styling

Use:
- large editorial typography
- strong serif typography paired with a restrained sans serif
- full-bleed photography
- asymmetric image layouts
- generous whitespace
- strong art direction
- subtle transitions
- interesting typography/image relationships

The visual experience should feel closer to a boutique hotel, fashion editorial, or luxury travel publication than The Knot or a normal wedding website.

## Site architecture

This is a true multi-page website.

The website is English-only. Do not add German translation or a language switcher. Existing /en URLs are retained; old /de links redirect to their English equivalents.

Preferred navigation:

Home

Our Story

The Wedding
- The Celebrations
- Welcome
- Roce
- Ceremony & Reception
- Farewell / Pool Day

Travel
- Getting to Florence
- Getting Around
- Transfers

Stay
- Recommended Hotels
- Florence
- Countryside

Florence
- Eat
- Drink
- See
- Our Recommendations

FAQ

RSVP

Some sections may eventually be consolidated depending on content volume, but do not turn the site into one long scrolling page.

## Homepage

Approved homepage direction: **Italian Journal**, using a photography-led **Editorial Cover** composition. Warm ivory, terracotta, dusty olive, oxblood, and espresso; asymmetry and generous whitespace. The latest direction restores oversized "Talia & Craig" typography overlapping the lower edge of a dominant portrait photograph. It supersedes the earlier scroll-linked announcement/location hero.

Use the selected beach portrait of Talia and Craig only; it is not currently in the repository. Keep a clearly labelled empty portrait frame until the exact image is provided. Desktop: a large centered 4:5 portrait, oversized single-line serif names crossing the lower edge into the ivory margins, fine rules and labels, and a vertical "September 2027" date beside the frame. Mobile: a centered 3:4 portrait, two-line names crossing the lower edge, and horizontal date/RSVP below. Remove "A little Italian chapter. A lifetime together." and "Ci vediamo in Italia." from the hero. Save the Italian phrase in the existing feature backlog as a nice-to-have with no current placement. Keep faces clear; final placement requires the real photograph. No invented dates, logistics, substitute image, or changes to navigation, other homepage sections, or backend functionality in this hero iteration. The verified September 14 wedding day and September 12–15 celebrations remain in shared configuration.

The journal is an aesthetic reference, not a public title. Do not display "The Italian Journal" or "A wedding edition" as homepage branding.

See [DESIGN.md](DESIGN.md) for the hero specification and [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) for approved decisions, implementation status, and outstanding inputs. A labelled placeholder is used until a real couple photograph is supplied.

The homepage should be relatively minimal and cinematic.

It should communicate:

Talia & Craig
Florence, Italy
September 2027

The homepage is primarily an entrance into the rest of the website, not a page containing every piece of wedding information.

## Wedding celebrations

The celebrations run September 12–15, 2027 and consist of several events:

1. September 12 — The Roce at Villa Mangiacane; selective guest list pending.
2. September 13 — Welcome party at Serre Torrigiani.
3. September 14 — Wedding at Villa Corsini.
4. September 15 — Pool party at Villa Mangiacane; selective guest list pending.

These are the user-supplied current venue plans, not a statement that bookings or logistics are final. Times, dress codes, addresses, transport, and other details remain pending.

Use a responsive editorial programme on /events, with date margins, large serif event names, venue typography, fine rules, and only the permitted entries in both the schedule and its navigation. The Roce and pool party are provisionally invitation-only and independently grantable. The credential unit (guest versus couple/household) is explicitly deferred; do not choose it or issue credentials yet. Keep private sections out of the guest response while matching is unimplemented. A development-only /en/events?preview=planning view shows all four days for local review and is ignored in production. Preserve existing database/RSVP/admin functions; link existing database event IDs explicitly for additional confirmed event details when ready.

Open decisions and optional ideas belong in [BACKLOG.md](BACKLOG.md). Future project-status reviews should reconcile that file and ../feature_list.txt with the current code and verification notes.

Therefore wedding information should be data-driven wherever practical rather than hard-coded repeatedly in components.

## RSVP

Keep the existing RSVP/backend functionality where practical.

Guest information may eventually include:
- named invitees
- party/group association
- attendance by event
- dietary restrictions
- meal selection
- transportation requirements
- accommodation information

Do not expose private guest data client-side.

## Technical direction

Preserve useful existing functionality from the template.

Preferred approach:
- Next.js
- TypeScript
- Tailwind
- Supabase where currently used
- Vercel deployment

Favor reusable components.

Content that is likely to change should live in structured data/config files where reasonable rather than being scattered through components.

## Development philosophy

We are redesigning the experience, not merely recoloring the existing template.

The existing repository is primarily useful for:
- routing
- backend architecture
- RSVP logic
- database integration
- authentication
- existing functional components

The public-facing visual system can be substantially rebuilt.

Prioritize:
1. excellent responsive design
2. maintainable code
3. accessibility
4. performance
5. visual quality

Desktop and mobile should both feel intentionally designed.
