# PHRONESIS — Luxury Car Atelier

A modern, conversion-focused car rental website for an elite luxury car rental shop in Al Ain, UAE. Built with Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, and Prisma.

![PHRONESIS](public/logo.svg)

## Features

### Public Site
- **Booking widget hero** — pickup location, dates, car type, search (like Hertz/Sixt/Turo)
- **Featured fleet** — 3-column grid with tilt-on-hover 3D cards, price overlays, star ratings
- **Brand marquee** — infinite scrolling brand names
- **Why Choose Us** — 4 cards with animated icon micro-interactions
- **How It Works** — 4-step process with animated arrows
- **Testimonials** — client quotes with 5-star ratings
- **Final CTA** — full-bleed blue section with WhatsApp + Browse buttons
- **Floating WhatsApp button** — pulsing, appears on scroll
- **Back-to-top button** + **scroll progress bar**
- **Speeding car intro animation** — plays once per session
- **4 languages** — English, Arabic (RTL), Hindi, Malayalam (literary translations)
- **Mobile-first responsive** — works perfectly on 390px to 1440px+

### Pages
- `/` — Home (booking widget + featured fleet + sections)
- `/#/fleet` — Filterable fleet grid (category, brand, price, sort, search)
- `/#/car/:slug` — Car detail (gallery, specs, price calculator, booking form, WhatsApp)
- `/#/about` — Atelier story, principles, process, trust badges
- `/#/contact` — WhatsApp CTA, contact channels, FAQ accordion, enquiry form
- `/#/admin` — Admin console (login required, hidden from public)

### Admin Console (`/#/admin` — password: `phronesis2024`)
- **Dashboard** — stats, recent bookings, quick actions
- **Fleet Manager** — full CRUD with **file upload from device** (no URLs)
- **Bookings** — view/update booking status (pending → confirmed → completed → cancelled)
- **Settings** — edit brand name, tagline, hero copy, contact info, admin password

### Tech Stack
- **Framework:** Next.js 16 (App Router) + TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (New York style)
- **Database:** Prisma ORM + SQLite
- **Animations:** Framer Motion
- **Fonts:** Playfair Display (serif), Inter (sans), Noto Sans Arabic / Devanagari / Malayalam
- **Icons:** Lucide React

## Getting Started (Local Development)

```bash
# Install dependencies
bun install

# Set up your database (PostgreSQL required — get a free one from Neon, Supabase, or Vercel Postgres)
# 1. Copy .env.example to .env
# 2. Fill in your DATABASE_URL

# Push the schema to your database
bun run db:push

# Seed with sample elite fleet (Lamborghini, Rolls-Royce, Bentley, Ferrari, McLaren, etc.)
bun run scripts/seed.ts

# Start dev server
bun run dev
```

Visit `http://localhost:3000` for the public site.
Visit `http://localhost:3000/#/admin` for the admin console (password: `phronesis2024`).

## Deploy to Vercel

This project is configured for one-click Vercel deployment:

1. **Fork/clone** this repo to your GitHub.
2. **Create a PostgreSQL database** (recommended: [Neon](https://neon.tech) free tier — takes 30 seconds).
3. **Import the project on Vercel** at https://vercel.com/new — select the GitHub repo.
4. **Add environment variable** in Vercel project settings:
   - `DATABASE_URL` = your PostgreSQL connection string
5. **Deploy.** Vercel will run `bun install` (which triggers `postinstall: prisma generate`) then `next build`.
6. **After the first deploy**, run these once to set up the database:
   ```bash
   # Set DATABASE_URL locally (copy from Vercel project settings)
   bun run db:push
   bun run scripts/seed.ts
   ```

Your site will be live at `https://your-project.vercel.app`.

### Notes on Vercel deployment
- **Database:** SQLite is NOT used in production (it doesn't persist on serverless). The project uses PostgreSQL via Prisma.
- **Image uploads:** Currently saved to `/public/uploads/`. On Vercel serverless these are ephemeral — for production-grade persistence, integrate [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or S3. The upload API and admin UI will work as-is; just swap the storage backend in `src/app/api/upload/route.ts`.
- **Build settings:** Vercel auto-detects Next.js 16. `vercel.json` is included for region (Singapore) and function timeout (30s) overrides.

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (cars, brands, categories, bookings, settings, upload, admin)
│   ├── globals.css       # Tailwind + custom utilities
│   ├── layout.tsx        # Root layout (fonts, metadata)
│   └── page.tsx          # Hash router (home/fleet/car/about/contact/admin)
├── components/
│   ├── admin/            # Admin panel components
│   │   ├── admin-panel.tsx
│   │   ├── admin-login.tsx
│   │   ├── admin-dashboard.tsx
│   │   ├── admin-fleet-manager.tsx
│   │   ├── admin-bookings.tsx
│   │   ├── admin-settings.tsx
│   │   └── image-uploader.tsx  # File upload component
│   ├── site/             # Public site components
│   │   ├── public-site.tsx     # Shell (header, footer, routing)
│   │   ├── pages/              # Home, Fleet, CarDetail, About, Contact
│   │   ├── car-intro.tsx       # Speeding car intro animation
│   │   ├── floating-whatsapp.tsx
│   │   ├── scroll-progress.tsx
│   │   ├── back-to-top.tsx
│   │   ├── language-switcher.tsx
│   │   ├── section-reveal.tsx  # Animation helpers
│   │   └── animated-counter.tsx
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── db.ts             # Prisma client
│   ├── types.ts          # Shared types + API client
│   ├── i18n.ts           # 4-language translations (EN/AR/HI/ML)
│   └── language-context.tsx
└── prisma/
    └── schema.prisma     # Car, CarImage, Brand, Category, Booking, SiteSettings
```

## Customization

### Change admin password
Log into `/admin` → Settings → Security → Change Admin Password.

### Add/edit cars
Log into `/admin` → Fleet → Add Car (or Edit existing). Upload images directly from your device.

### Change site copy (hero, about, contact info)
Log into `/admin` → Settings → edit fields → Save.

### Change languages
Edit `src/lib/i18n.ts` — add or modify translation keys for any of the 4 languages.

## License

© PHRONESIS. All rights reserved. Crafted in Al Ain · UAE.
