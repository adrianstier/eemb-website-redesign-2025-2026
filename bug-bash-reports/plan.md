# Bug Bash Plan

## Scope Splits

The codebase is divided into 5 independent scope areas for parallel investigation:

### Scope 1: Admin Pages & API Routes
- `app/admin/` (login, dashboard, faculty, students, staff, events)
- `app/api/admin/` (faculty, students, staff, events, news routes)
- Focus: Verify the Strapi→Supabase migration is correct, check for runtime errors, type mismatches, missing error handling, dead code

### Scope 2: Public Pages (People, Faculty, Students, Staff)
- `app/people/page.tsx`, `app/people/faculty/[slug]/`, `app/people/students/[slug]/`, `app/people/staff/[slug]/`
- `app/faculty/` (profile editing)
- `src/lib/data/faculty.ts`, `src/lib/data/students.ts`, `src/lib/data/staff.ts`
- Focus: Data fetching, SSG/ISR params, slug generation, missing null checks, broken links

### Scope 3: Content Pages (News, Events, Research, Academics, Home)
- `app/page.tsx` (home), `app/news/`, `app/events/`, `app/research/`, `app/academics/`
- `app/calendar/`, `app/good-news/`, `app/alumni/`, `app/memoriam/`, `app/dei/`, `app/give/`
- `src/lib/data/news.ts`, `src/lib/data/events.ts`, `src/lib/data/research.ts`
- Components: `EventCard`, `FeaturedNews`, `UpcomingEvents`, `ResearchThemes`, etc.
- Focus: Data fetching from Supabase, empty state handling, dead Strapi refs, broken imports

### Scope 4: Auth, Middleware & Infrastructure
- `middleware.ts`, `app/auth/` (login, callback, logout)
- `src/lib/supabase/` (server.ts, client.ts, middleware.ts, types.ts)
- `next.config.js`, `layout.tsx`, `globals.css`, `error.tsx`, `not-found.tsx`
- Focus: Auth flow correctness, redirect loops, CSP issues, missing security headers, config errors

### Scope 5: Components, UI & Build Health
- `src/components/` (all 20+ components)
- `src/components/ui/` (shared UI primitives)
- `src/lib/animationTokens.ts`
- `package.json` dependencies, TypeScript config
- Focus: Unused imports, broken component props, accessibility issues, build warnings, dead dependencies

## Wave 1: Parallel scope agents (5 agents)
## Wave 2: Review agent reads all reports + validates fixes
## Wave 3: Fix any BLOCKED items, write final summary
