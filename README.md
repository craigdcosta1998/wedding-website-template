# Wedding Website Template

An English-only wedding website for Talia and Craig: household RSVP, an event schedule, pending gift information, a couple's-story timeline, hotel recommendations, and an admin dashboard with a drag-and-drop seating planner. English pages use /en; old /de links redirect to the matching English page. See PROJECT_BRIEF.md, DESIGN.md, and DESIGN_DECISIONS.md for the current requirements.

This project started from a wedding website template. Current development is local; use the status sources below for implemented features, verification limits, and remaining work.

## Project status and pending work

- [BACKLOG.md](BACKLOG.md) tracks open decisions, required inputs, unfinished integrations, and optional ideas without a current home.
- [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) records the accepted design and verification results; [PROJECT_BRIEF.md](PROJECT_BRIEF.md) and [DESIGN.md](DESIGN.md) describe current requirements.
- `feature_list.txt` is the implementation queue in the project root. [AGENTS.md](AGENTS.md) instructs future sessions to review these sources alongside the actual code when answering status or pending-work questions.

Craig chose household invitation codes with independent responses for each named person on November 22, 2026. The completion target is local verification with pending content. Selective-event guest lists remain pending. Do not store guest lists or issued credentials in these documents.

The celebrations programme is at `/en/events`. During local development, `/en/events?preview=planning` shows all four planned days; production ignores this preview parameter. Use `/en/rsvp?preview=planning&audience=both` for the fictional local household RSVP journey (`audience=roce` or `pool` narrows the preview); it cannot submit or send email. Household codes resolve against `households.household_code`; `celebration_event_links` maps canonical events to database records, and `household_event_invitations` supplies independent household grants. Selective guest lists, real codes, explicit event links, and live database verification remain pending. Schedule content lives in `src/config/celebrations.ts`; link confirmed database records explicitly without seeding or guessing event times.

## Review every significant change

[REVIEW_WORKFLOW.md](REVIEW_WORKFLOW.md) defines the required independent design and technical reviews: both check the proposed approach before implementation and the result after every significant website change, including local work with no deployment planned. Both final reviews are required before marking the change complete or starting unrelated significant work. The project-scoped reviewer definitions are in `.codex/agents/`; [AGENTS.md](AGENTS.md) makes this workflow part of future project work. Before a later push or deployment, verify the contents still match the reviewed candidate.

This local workflow does not configure GitHub/Vercel deployment enforcement. No hosting settings are changed by installing the reviewers.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4 + shadcn/ui
- Supabase (database + auth)
- Resend (email, optional)
- next-intl (i18n)
- @dnd-kit (drag-and-drop seating planner)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SITE_PASSWORD=pick-a-password-for-your-invitation-cards
SESSION_SECRET=
RESEND_API_KEY=your-resend-api-key   # optional — confirmation emails are skipped if unset
RESEND_FROM_EMAIL=                   # verified sender address required when email is enabled
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
```

Set `SESSION_SECRET` to a private random value of at least 32 characters. Do not use the example file's blank value, the shared site password, or a Supabase key.

### 3. Set up the database

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run every file in `supabase/migrations/` **in order**, `00001` through `00008`.
3. Create yourself an admin login: Supabase dashboard → Authentication → Users → Add User. That email/password is what you'll use to log into `/admin`.
4. Copy that user's Auth UUID into the server-only `ADMIN_USER_IDS` environment variable. For multiple admins, separate UUIDs with commas. An empty or unset allowlist denies all admin data pages and seating actions; signing in alone does not grant admin access. Restart the server after changing the allowlist.

### 4. Run it

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The development server binds to loopback so the local photo preview cannot be served over the network. The site is behind the `SITE_PASSWORD` you set above; `/admin` is behind the Supabase Auth user you just created.

## Make it yours

Start here, in this order:

1. **`src/config/wedding.ts`** — approved couple names, wedding date, and location. Optional email delivery requires a private `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL` in the environment.
2. **Content pages with placeholder text** — search for `[` in these files, each marks something to replace:
   - `src/app/[locale]/our-story/page.tsx` — your story, one section per chapter
   - `src/config/stay.ts` — add approved Florence/countryside hotel recommendations and official booking links. Empty areas show an honest pending state; no example ratings, prices, or booking arrangements are published. `src/messages/en.json`'s `accommodation` holds the page introduction.
   - `src/messages/en.json`'s `gift.pendingTitle` / `gift.pending` — update the pending note when gift information is confirmed
   - `src/components/events/witness-contact-card.tsx` — your wedding party's contact details
3. **Your own events** — this template ships with no seeded events (the original had "Get Together", "Ceremony", "Dinner & Party" hardcoded — deliberately removed). Add yours via the Supabase dashboard's **Table Editor** → `events` table → Insert row. No SQL needed; fill in the English event fields, date, venue, address, and dress code; legacy German columns remain in the schema.
4. **Photos** — this template ships with no images beyond a couple of generic decorative textures and icons. Add your own under `public/` and reference them from the pages above (e.g. a hero image on the home page, photos per chapter of your story).

## Using Claude Code to customize this

If you're using [Claude Code](https://claude.com/claude-code) to do this customization pass, point it at `CLAUDE.md` first — it documents the architecture, conventions, and exactly which files a customization pass should touch. A good opening prompt:

> Read CLAUDE.md, then help me customize this wedding website template. My partner's name is ___, my name is ___, and we're getting married on ___ in ___. Start with src/config/wedding.ts, then walk me through the rest of the placeholder content.

Every remaining placeholder in the content pages is wrapped in `[square brackets]`, so `grep -rn "\[" src/app/\[locale\] src/messages src/components/events/witness-contact-card.tsx` finds all of them at once if you want to see everything in one pass.

## The seating planner

`/admin/seating` is a drag-and-drop table planner: round tables with individually addressable seats, swap-on-drop, hover a seat to see who's on either side, and a "pin to sit with…" option for guests who should sit together but aren't RSVP'd under the same household. It's backed by Supabase (`seating_tables` / `seating_seats`, added in migration `00006`), so it's shared and durable across every admin and device — not stuck in one browser's local storage.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com).
3. Add the same environment variables as `.env.local`, with `NEXT_PUBLIC_SITE_URL` set to your real domain.
4. Deploy.

The default Vercel region in `vercel.json` is `fra1` (Frankfurt) — change it if you're not hosting for a European audience.

## Project structure

```
src/
├── app/[locale]/       # Pages — home, rsvp, events, hotels, our-story, gift, admin
├── components/         # React components (admin/, editorial/, events/, rsvp/, ui/, layout/)
├── config/wedding.ts   # Your single source of truth — start customizing here
├── emails/             # React Email templates
├── i18n/                # next-intl routing config
├── lib/                # Utilities, Supabase clients, seating logic
├── messages/            # English messages (en.json)
└── types/               # TypeScript types, including the Supabase schema
supabase/
└── migrations/          # Run 00001–00008 in order against a fresh project
```

## Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation — read this first if you're using an AI coding agent to customize the site.

## License

Use this however you like for your own wedding.
