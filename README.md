# Wedding Website Template

A bilingual (German/English) wedding website: RSVP management, an event schedule, a gift/bank-details page, a couple's-story timeline, hotel recommendations, and an admin dashboard with a drag-and-drop seating planner.

This started as a real wedding website and was turned into a template afterward — the structure and features are all proven in production; what's missing is *your* content.

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
RESEND_API_KEY=your-resend-api-key   # optional — confirmation emails are skipped if unset
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up the database

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run every file in `supabase/migrations/` **in order**, `00001` through `00006`.
3. Create yourself an admin login: Supabase dashboard → Authentication → Users → Add User. That email/password is what you'll use to log into `/admin`.

### 4. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site is behind the `SITE_PASSWORD` you set above; `/admin` is behind the Supabase Auth user you just created.

## Make it yours

Start here, in this order:

1. **`src/config/wedding.ts`** — couple names, wedding date, contact email, bank details. Everything else on the site (page titles, the RSVP calendar download, confirmation emails, the gift page) reads from this one file.
2. **Content pages with placeholder text** — search for `[` in these files, each marks something to replace:
   - `src/app/[locale]/our-story/page.tsx` — your story, one section per chapter
   - `src/app/[locale]/hotels/page.tsx` + `src/messages/{de,en}.json`'s `accommodation.example` — add one card per hotel recommendation
   - `src/messages/{de,en}.json`'s `gift.honeymoon` / `gift.story` — your gift-registry message
   - `src/components/events/witness-contact-card.tsx` — your wedding party's contact details
3. **Your own events** — this template ships with no seeded events (the original had "Get Together", "Ceremony", "Dinner & Party" hardcoded — deliberately removed). Add yours via the Supabase dashboard's **Table Editor** → `events` table → Insert row. No SQL needed; fill in the form fields (name in both languages, date, venue, address, dress code, etc.).
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
├── components/         # React components (admin/, events/, gift/, rsvp/, ui/, layout/)
├── config/wedding.ts   # Your single source of truth — start customizing here
├── emails/             # React Email templates
├── i18n/                # next-intl routing config
├── lib/                # Utilities, Supabase clients, seating logic
├── messages/            # Translations (de.json, en.json)
└── types/               # TypeScript types, including the Supabase schema
supabase/
└── migrations/          # Run 00001–00006 in order against a fresh project
```

## Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation — read this first if you're using an AI coding agent to customize the site.

## License

Use this however you like for your own wedding.
