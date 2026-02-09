# EEMB Website: Next Steps

Last updated: February 2026

## Overview

The EEMB department website redesign is built on Next.js 14 + Supabase + TypeScript + Tailwind CSS. The Supabase migration from Strapi is ~90% complete: all public-facing pages read from Supabase, but 6 admin pages still call the old Strapi backend (localhost:1337). The database holds 119 people records (65 faculty, 35 students, 19 staff). Content tables for news, events, alumni, in memoriam, and DEI exist but are empty. No production deployment yet.

---

## Phase 1: Complete Strapi Removal

**Priority: High -- blocks all other work**

| # | Task | Details |
|---|------|---------|
| 1 | Rewrite admin login | Replace Strapi JWT auth with Supabase magic link flow (auth middleware already exists) |
| 2 | Rewrite admin dashboard | Point at existing Supabase API routes (`/api/admin/*`) instead of Strapi endpoints |
| 3 | Rewrite admin CRUD pages | Faculty, students, staff, and events CRUD -- use existing Supabase API routes |
| 4 | Delete deprecated Strapi code | Remove any remaining Strapi utility files, types, or helpers |
| 5 | Clean next.config.js | Remove `localhost:1337` from `images.remotePatterns` |
| 6 | Verify | `grep -r "localhost:1337" frontend/` returns 0 results |

**Done when:** The entire frontend builds and runs with zero references to Strapi or localhost:1337.

---

## Phase 2: Content Population

**Priority: Medium -- needed before launch**

| # | Task | Details |
|---|------|---------|
| 1 | Wire research page to database | Replace hardcoded content with queries against `research_areas` table |
| 2 | Wire graduate program page | Move hardcoded courses, fellowships, FAQs into Supabase or a structured data file |
| 3 | Import news articles | Scrape/import from department Good News emails; wire good-news page to news system |
| 4 | Add events | Populate events table with upcoming seminars, defenses, departmental events |
| 5 | Add In Memoriam profiles | 5 known: Trench, Connell, Wenner, Damuth, Stewart-Oaten |
| 6 | Add DEI content | Populate DEI page content from department materials |
| 7 | Add alumni spotlights | Gather and enter alumni profiles |

---

## Phase 3: Production Deployment

**Priority: High -- do immediately after Phase 1**

| # | Task | Details |
|---|------|---------|
| 1 | Set up Vercel project | Connect repo, configure build settings for Next.js 14 |
| 2 | Verify Supabase production readiness | Confirm RLS policies on all tables, enable backups, review connection pooling |
| 3 | Set environment variables | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, plus server-side keys in Vercel |
| 4 | Deploy and smoke test | Verify all public pages render, admin auth works, images load |
| 5 | Custom domain | Coordinate with UCSB IT for eemb.ucsb.edu DNS configuration |

---

## Phase 4: Polish and Enhancement

**Priority: Lower -- post-launch improvements**

| # | Task | Details |
|---|------|---------|
| 1 | Contact form email | Integrate Resend or SendGrid for form submission notifications |
| 2 | Google Analytics | GA4 tag ID is already in env vars; add the tracking script |
| 3 | Accessibility audit | Run axe-core, test keyboard navigation, verify screen reader compatibility |
| 4 | Performance audit | Target Lighthouse score >90 on all pages |
| 5 | SEO audit | Add meta tags, Open Graph images, generate sitemap.xml |
| 6 | Image optimization | Audit all images for proper sizing, WebP conversion, alt text |

---

## Tech Stack Reference

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 14 (App Router) | TypeScript, server components |
| Database | Supabase (PostgreSQL) | Auth, storage, RLS |
| Styling | Tailwind CSS | Pacific Naturalism v4.0 design system |
| Fonts | Fraunces (headings), DM Sans (body) | Loaded via next/font |
| Hosting | Vercel (planned) | Not yet deployed |
| Auth | Supabase magic links | Admin-only, middleware-protected |
| Contact form | Next.js API route | Rate limiting + honeypot spam protection |

### Key paths

```
frontend/app/              # Pages (App Router)
frontend/src/components/   # React components
frontend/src/lib/data/     # Supabase query functions
frontend/src/lib/supabase/ # Supabase client setup
frontend/src/data/         # Static data files
```

### Commands

```bash
cd frontend && npm run dev     # Start frontend (localhost:3000)
cd frontend && npm run build   # Production build
```
