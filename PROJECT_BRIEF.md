# Talia & Craig Wedding Website

## Project

This is the wedding website for Talia and Craig.

Wedding:
- Florence, Italy
- Wedding day: September 14, 2027
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
- The Weekend
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

Approved homepage direction: **Italian Journal**, using a photography-led **Editorial Cover** composition. Warm ivory, muted terracotta, dusty olive, and oxblood; asymmetry and generous whitespace. The latest direction replaces the oversized names and separate Key info section with announcement/location typography integrated into the photograph's frame.

"We're getting married" starts above the photograph along the horizontal border. "Florence" starts vertically along its right border. As the visitor scrolls, both move beneath the photograph, with the announcement becoming a larger serif caption and Florence rotating to horizontal. The movement reverses on scroll up. When scrolling stops, settle both captions back to the frame before the halfway threshold or below the photo from halfway onward. Never leave the captions midway at rest or change the visitor's scroll position. "September 2027" is static beside RSVP, replacing the old venue/timing note. Reduced-motion users get static captions below the image. Keep the full couple names in the small site identity/footer and semantic page heading, not as a large hero wordmark. Do not display "KEY INFO" or the redundant "14/09". The confirmed September 14 wedding day remains in shared configuration for other pages and calendar exports.

The journal is an aesthetic reference, not a public title. Do not display "The Italian Journal" or "A wedding edition" as homepage branding.

See [DESIGN.md](DESIGN.md) for the hero specification and [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) for approved decisions, implementation status, and outstanding inputs. A labelled placeholder is used until a real couple photograph is supplied.

The homepage should be relatively minimal and cinematic.

It should communicate:

Talia & Craig
Florence, Italy
September 2027

The homepage is primarily an entrance into the rest of the website, not a page containing every piece of wedding information.

## Wedding weekend

The wedding consists of several events:

1. Welcome event
2. Roce
3. Catholic wedding ceremony + reception
4. Farewell brunch / pool event

Exact venues and timing may change.

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
