# Wedding Website Template

Current project overrides: this is Talia & Craig's English-only wedding website. Read AGENTS.md, PROJECT_BRIEF.md, DESIGN.md, and DESIGN_DECISIONS.md before working. Their current requirements supersede the historical bilingual template guidance below. English routes use /en; legacy /de links redirect to English. Do not reintroduce German translations or language controls.

A bilingual (German/English) wedding website built with Next.js 16, featuring RSVP management, event scheduling, an admin dashboard, and a drag-and-drop seating planner.

## Customizing this template

If you're an AI agent customizing a fresh copy of this template for someone's actual wedding, work through these in order:

1. **`src/config/wedding.ts`** — couple names, wedding date, contact email, bank details. This is the single source of truth; most of the app reads from it instead of hardcoding these values.
2. **Content pages with placeholder text** — anything wrapped in `[square brackets]` in `src/app/[locale]/our-story/page.tsx`, `src/app/[locale]/hotels/page.tsx`, `src/messages/{de,en}.json` (`gift.honeymoon`, `gift.story`, `accommodation.example`), and `src/components/events/witness-contact-card.tsx`. Run `grep -rn "\[" src/app/\[locale\] src/messages src/components/events/witness-contact-card.tsx` to find every remaining one.
3. **Events**: this template ships with no seeded events — the couple adds their own via the Supabase Table Editor (no migration needed for that; see README.md).
4. **Photos**: no personal images ship with this template. Add real ones under `public/` and wire them into the pages above.

Don't invent new pages/routes/features unless asked — the goal of a customization pass is filling in the placeholders above, not redesigning the site.

## Project Overview

- **Default Language**: German (`/de`)
- **Supported Languages**: German, English
- Wedding-specific facts (date, couple names, location) live in `src/config/wedding.ts`, not in this file.

## Architecture

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode, `noUncheckedIndexedAccess`)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend + React Email
- **Internationalization**: next-intl
- **Drag-and-drop**: @dnd-kit (seating planner)

### Project Structure

```
src/
├── app/
│   ├── [locale]/            # Locale-specific pages
│   │   ├── page.tsx         # Home page
│   │   ├── rsvp/            # RSVP flow
│   │   ├── events/          # Event schedule
│   │   ├── hotels/          # Hotel recommendations
│   │   ├── our-story/       # Couple's story
│   │   ├── gift/            # Gift/bank-details page
│   │   └── admin/           # Admin dashboard, incl. admin/seating/
│   ├── actions/             # Server actions
│   ├── config/wedding.ts    # Couple names, date, contact, bank details
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/               # Header, Footer, LanguageToggle
│   ├── rsvp/                 # RSVP form components
│   ├── events/               # Event timeline, witness contact card
│   ├── gift/                 # Bank details tile/popup
│   └── admin/
│       └── seating/          # Seating planner: board, table card, seat ring, etc.
├── emails/                   # React Email templates
├── i18n/                     # Internationalization config
├── lib/
│   ├── supabase/              # Supabase clients (server, browser, middleware)
│   ├── seating.ts             # Pure seating logic (pairing, warnings, export)
│   ├── session.ts             # Cookie-based session
│   ├── email.ts               # Email sending
│   └── utils.ts                # General utilities
├── messages/                  # Translation files (de.json, en.json)
└── types/database.ts          # Supabase schema types
```

## Database Schema

### Tables

#### households
Primary table for invitation groups.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| household_code | text | 6-character unique code |
| primary_contact_name | text | Main contact name |
| primary_contact_email | text | Email for confirmations |
| invitation_type | enum | ceremony_reception, reception_only, all_events |

#### guests
Individual guests linked to households.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| household_id | uuid | Foreign key to households |
| first_name | text | Guest first name |
| last_name | text | Guest last name |
| rsvp_status | enum | pending, accepted, declined |
| age_category | text | adult, child, or toddler |
| meal_choice | enum | unused (kept for schema compatibility) |
| dietary_restrictions | text | Dietary preference (vegetarian, vegan, or free text) |
| is_plus_one | boolean | Whether guest is a +1 |
| seat_with_guest_id | uuid | Manual "seat together" pin — see seating below |

#### events
Wedding events with visibility controls. **No rows are seeded** — add your own via the Table Editor.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name_de / name_en | text | Event name per locale |
| description_de / description_en | text | Description per locale |
| event_date | timestamptz | Event date/time |
| location_name / location_address | text | Venue |
| maps_url | text | Google Maps link |
| dresscode_de / dresscode_en | text | Dress code per locale |
| directions_de / directions_en, parking_de / parking_en | text | Getting there |
| visibility | enum | all, ceremony_reception, all_events |

#### guest_events
Per-event RSVP — a guest can accept some events and decline others.

| Column | Type | Description |
|--------|------|-------------|
| guest_id, event_id | uuid | Composite reference |
| status | text | accepted, declined |

#### seating_tables / seating_seats
Backs the `/admin/seating` planner. A table has N seats (`seating_seats.seat_index`, gaps allowed — the client sorts by it for the round-table layout); a seat optionally references a guest. Placement/swap/unseat all go through Postgres functions (`place_guest`, `place_guest_in_table`, `unseat_guest`) so a swap is one atomic operation, not racy sequential updates. See `supabase/migrations/00006_seating.sql`.

### Relationships

```
households 1--* guests (household_id)
guests *--* events (via guest_events)
seating_tables 1--* seating_seats (table_id)
seating_seats *--1 guests (guest_id, nullable — empty seat)
```

### Row Level Security

- Guests authenticate with household_code stored in session cookie
- Households can only view/update their own data
- Events visible based on household's invitation_type
- `seating_tables` / `seating_seats` have **no anon-facing policy at all** — service-role only, same as `guest_events`. Verify this if you ever add a new table: default to service-role-only unless guests genuinely need direct access.
- Admin uses service_role key for full access

## Component Patterns

### Naming Conventions

- **Pages**: `page.tsx` in route folders
- **Components**: PascalCase (`RsvpForm.tsx`)
- **Utilities**: camelCase (`createClient.ts`)
- **Types**: PascalCase interfaces (`Household`, `Guest`)

### Component Structure

```tsx
// ABOUTME: Brief description of component purpose
'use client'; // Only if client-side interactivity needed

import { ... } from 'libraries';
import { ... } from '@/components';
import { ... } from '@/lib';

interface ComponentProps {
  // Props interface
}

export function Component({ props }: ComponentProps) {
  // Implementation
}
```

### Server vs Client Components

- **Server Components** (default): Pages, data fetching, static content
- **Client Components**: Forms, interactivity, hooks usage

Mark client components with `'use client'` directive.

### Admin data fetching

Server components query Supabase directly via `createServiceClient()` and pass plain arrays as props to a `'use client'` component — no API routes for admin data. See `src/app/[locale]/admin/page.tsx` and `src/app/[locale]/admin/seating/page.tsx`.

## State Management

### Authentication

Two auth layers managed by middleware:

1. **Site-wide password**: HMAC-signed `site_access` cookie (30-day expiry). Set via `/api/password` route.
2. **Admin auth**: Supabase Auth (email/password) for `/admin` paths — automatically covers any new route added under `src/app/[locale]/admin/**`, no extra wiring needed.

### Form State

Local React state with `useState` for the RSVP form. The seating planner uses optimistic client-side state (instant UI update, server action fired in the background, rollback + toast on failure) — no global state library.

## Error Handling

### Server Actions

```typescript
export async function serverAction(): Promise<Result> {
  try {
    // Action logic
    return { success: true };
  } catch {
    return { success: false, error: 'Error message' };
  }
}
```

### Client Error Handling

```typescript
try {
  const result = await serverAction();
  if (!result.success) {
    setError(result.error);
  }
} catch {
  setError('Unexpected error');
}
```

### Loading States

All async operations show loading indicators:
- Button spinners with `Loader2` icon
- Disabled form inputs during submission
- Optimistic UI updates where appropriate

## Internationalization

### Adding Translations

1. Add keys to `src/messages/de.json` and `src/messages/en.json`
2. Use nested structure: `{ "section": { "key": "value" } }`

### Using Translations

```typescript
// Server components
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('section');

// Client components
import { useTranslations } from 'next-intl';
const t = useTranslations('section');

// Usage
t('key')
t('key', { param: value })
```

## Testing Strategy

### Unit Tests
- Utility functions (`src/lib/*.test.ts`), including seating logic (`src/lib/seating.test.ts`)
- Form validation logic
- Middleware routing decisions

### Integration Tests
- Server actions with mocked Supabase

### Manual/E2E
- Complete RSVP flow
- Admin dashboard operations, including the seating planner (place, swap, reload to confirm persistence)
- Language switching

## Deployment

### Environment Variables

Required in production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_PASSWORD` — shared password printed on invitation cards
- `NEXT_PUBLIC_SITE_URL`

Optional:
- `RESEND_API_KEY` — email sending (gracefully skipped if not set)

### Vercel Deployment

Use `vercel --prod` to deploy, or connect the GitHub repo in the Vercel dashboard for automatic deploys on push.

### Database Setup

1. Create a Supabase project.
2. Run every migration in `supabase/migrations/` in order (`00001` through `00006`), either via CLI (`SUPABASE_ACCESS_TOKEN=... npx supabase db push`) or by pasting each file into the Supabase SQL Editor.
3. Add your events via the Table Editor (no seed data ships with this template).

### Checklist

- [ ] `src/config/wedding.ts` filled in with real values
- [ ] Environment variables configured (including `SITE_PASSWORD`)
- [ ] Database migrations 00001–00006 run
- [ ] Events added via Table Editor
- [ ] Admin user created in Supabase dashboard (Auth → Users → Add User)
- [ ] Test: visit site → password page shown
- [ ] Test: enter password → can browse
- [ ] Test: RSVP insert end-to-end
- [ ] Test: admin login at `/admin/login`
- [ ] Test: seating planner — place a guest, reload, confirm it persisted
- [ ] Custom domain configured

## Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Type checking
npm run build

# Linting
npm run lint
```

## Key Files

| File | Purpose |
|------|---------|
| `src/config/wedding.ts` | Couple names, date, contact, bank details — start here for customization |
| `src/middleware.ts` | Password protection + admin auth + locale routing |
| `src/middleware-utils.ts` | Pure routing decision functions (testable) |
| `src/lib/password.ts` | HMAC token generation/verification (Web Crypto API) |
| `src/lib/supabase/server.ts` | Server-side Supabase clients (`createClient` = anon/cookie-scoped, `createServiceClient` = service-role) |
| `src/lib/seating.ts` | Pure seating logic: keep-together pairing, split warnings, name shortening, text export |
| `src/i18n/routing.ts` | i18n navigation helpers |
| `src/app/api/password/route.ts` | Password verification + cookie setting |
| `src/app/actions/admin-auth.ts` | Admin logout |
| `src/app/actions/rsvp.ts` | Open RSVP submission (creates household + guests) |
| `src/app/actions/seating.ts` | Table/seat CRUD, guest placement, seat-together pins |
| `src/components/rsvp/open-rsvp-form.tsx` | RSVP form with dietary preferences |
| `src/lib/rsvp-validation.ts` | RSVP form validation logic |
| `src/components/admin/seating/seating-board.tsx` | Seating planner orchestrator (state, drag-and-drop, server sync) |
| `supabase/migrations/00006_seating.sql` | Seating schema + RPC functions |

## Important Notes

1. **Touch Targets**: All interactive elements have minimum 44×44px touch targets
2. **Mobile First**: Design prioritizes mobile experience
3. **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
4. **No Mocks**: Always use real data and APIs, never mock implementations
5. **Comments**: Start files with `// ABOUTME:` description
