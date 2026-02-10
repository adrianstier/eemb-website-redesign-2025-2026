# Bug Bash Fix Plan — Wave 2

## Status
- **Wave 1** (audit): Complete — 68 bugs found
- **P0 fixes**: Complete — 7 critical bugs fixed + 3 bonus (alumni, good-news pages)
- **Wave 2** (fix): In progress — fixing remaining P1/P2/P3 bugs

## Already Fixed
- #1–#7 (all P0 items)
- #16 (good-news page fake data → Supabase server component)
- #19, #20 (alumni CTA buttons + spotlight links → page replaced with empty state)

## Wave 2 Scope Splits

### Scope 1: Admin Pages & API Routes
**Bugs**: #12, #13, #14, #15, #23, #29, #30, #32, #33, #34, #35, #56, #57, #58
**Files**: `app/admin/{faculty,students,staff,events,dashboard}/page.tsx`, `app/api/admin/{faculty,students,staff,events,news}/route.ts`
**Key fixes**:
- Replace free-text inputs with enum dropdowns (faculty title, staff department, student degree)
- Create admin news page
- Fix isAdmin() double client creation across all API routes
- Fix staff search/display name fallbacks, empty string→null
- Fix full_name auto-overwrite, add updated_at to PUT handlers
- Add logout button to all admin pages
- Fix events date parsing

### Scope 2: People Pages — Null Safety & Broken Links
**Bugs**: #8, #9, #10, #11, #22, #26, #27, #28, #31, #43, #44, #48, #63
**Files**: `app/faculty/page.tsx`, `app/faculty/profile/FacultyProfileForm.tsx`, `app/people/page.tsx`, `app/people/faculty/[slug]/page.tsx`, `app/people/students/[slug]/page.tsx`, `app/people/staff/[slug]/page.tsx`
**Key fixes**:
- Fix /faculty redirect to /people (with filter)
- Fix "View public profile" link path
- Add null guards for slugs, titles, degree_program, full_name, research_interests
- Filter inactive faculty from directory
- Fix card grid key collisions and imageErrors collisions
- Replace raw <img> with next/image
- Fix generateMetadata to use createStaticClient

### Scope 3: Content Pages Cleanup
**Bugs**: #17, #18, #39, #40, #41, #42, #64, #65, #66, #67
**Files**: `app/dei/page.tsx`, `app/research/page.tsx`, `app/academics/page.tsx`, `app/about/page.tsx`, `app/memoriam/page.tsx`, `app/events/page.tsx`, `app/give/page.tsx`, `src/components/ContactForm.tsx`
**Key fixes**:
- Replace DEI placeholder links with real UCSB resource URLs
- Fix DEI join button to link to mailto
- Fix contact form /privacy link and character limit mismatch
- Replace about page gray borders with warm borders
- Replace give page heroicons with lucide-react
- Fix memoriam page to use next/image
- Remove interactive styling from non-functional event filter badges

### Scope 4: Auth & Security Hardening
**Bugs**: #36, #37, #38, #51, #52, #53, #54, #55
**Files**: `src/lib/supabase/middleware.ts`, `app/api/contact/route.ts`, `app/auth/login/page.tsx`, `next.config.js`, `middleware.ts`, `app/api/revalidate/route.ts`
**Key fixes**:
- Delete dead middleware file
- Add Map size limits and TTL cleanup to rate limiter
- Replace raw error param with allowlist-mapped messages on login page
- Add HSTS preload directive
- Add error handling to middleware role query
- Remove config leak from revalidation GET endpoint
- Use crypto.timingSafeEqual for token comparison
- Add subject length validation to contact API

### Scope 5: Components & UI Fixes
**Bugs**: #24, #45, #46, #47, #49, #50, #68
**Files**: `src/components/FacultyQuote.tsx`, `src/components/Header.tsx`, `src/components/TestimonialCarousel.tsx`, `src/components/ContactForm.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Loading.tsx`, `src/components/FeaturedFaculty.tsx`, `src/components/FeaturedNews.tsx`, `src/components/PartnersSection.tsx`, `src/components/QuickNav.tsx`, `src/components/ResearchThemes.tsx`, `src/components/UpcomingEvents.tsx`, `tailwind.config.ts`
**Key fixes**:
- Add reduced motion support to FacultyQuote carousel
- Fix Header scroll handler to use useRef instead of useState
- Scope TestimonialCarousel keyboard handler to container
- Add kelp-50 color to Tailwind config
- Fix CardEyebrow dynamic class to use lookup object
- Replace 7 inline useInView hooks with shared import
- Fix TextSkeleton hydration mismatch (deterministic widths)

## Wave 3: Review agent validates all fixes + build
