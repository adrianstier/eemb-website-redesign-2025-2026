# Bug Bash Summary

**Date**: February 9, 2026
**Scope**: Full EEMB website frontend codebase
**Agents**: 5 scope agents + 1 review agent

## Overview
- Total unique bugs: 68
- By priority: P0: 7, P1: 17, P2: 27, P3: 17
- By scope: Admin: 16, People: 16, Content: 15, Auth: 12, Components: 19
- Duplicates removed: 6 (from original 94 total across reports)

---

## P0 -- Fix Immediately

### 1. Open redirect in OAuth callback route
- **Scope**: Auth
- **File(s)**: `frontend/app/auth/callback/route.ts:7,47`
- **Issue**: The `next` query parameter is used directly in `NextResponse.redirect` with no validation. An attacker can craft an OAuth link that redirects users to a phishing site after successful authentication (e.g., using `//malicious.com` as the `next` param).
- **Fix**: Validate `next` against an allowlist of paths or ensure it starts with `/` and does not contain `//`. Apply the same `getSafeRedirectUrl()` logic used on the login page.

### 2. News listing page shows unpublished/draft articles
- **Scope**: Content
- **File(s)**: `frontend/app/news/page.tsx:6-46`
- **Issue**: The news list page bypasses the centralized `getAllNews()` data layer and runs its own inline Supabase query that does not filter by `published = true`. Draft and unpublished articles are visible to the public. Additionally, the page is missing `revalidate` and `metadata` exports, so new articles will not appear without redeployment.
- **Fix**: Replace the inline query with `getAllNews()` from `@/lib/data/news.ts`, which correctly filters published articles and orders by pinned status. Add `export const revalidate = 900` and `generateMetadata`.

### 3. Alumni page fetches from localhost:1337 in production
- **Scope**: Content
- **File(s)**: `frontend/app/alumni/page.tsx:37`
- **Issue**: The page actively calls `fetch('http://localhost:1337/api/alumni-profiles?populate=*')` on every load. In production, the fetch fails silently and falls back to hardcoded mock data with fabricated alumni profiles (Jessica Martinez, David Park, Amanda Thompson) presented as real people.
- **Fix**: Migrate the alumni page to use Supabase or remove the fake fallback data and show an honest empty state. Remove the localhost fetch entirely.

### 4. CSP allows unsafe-inline and unsafe-eval in script-src
- **Scope**: Auth
- **File(s)**: `frontend/next.config.js:11`
- **Issue**: The Content-Security-Policy `script-src` includes both `'unsafe-inline'` and `'unsafe-eval'`, which negates most XSS protection CSP is designed to provide. The `unsafe-eval` directive allows `Function()` constructor and dynamic code execution.
- **Fix**: Remove `'unsafe-eval'` from production CSP. If needed for Next.js dev mode, conditionally include it only when `NODE_ENV === 'development'`. Consider nonce-based CSP for `unsafe-inline`.

### 5. `.gitignore` does not exclude `.env` files
- **Scope**: Auth
- **File(s)**: `frontend/.gitignore`
- **Issue**: The `.gitignore` contains only `.vercel`. There is no exclusion for `.env`, `.env.local`, `.env.production`, or other environment files containing Supabase keys, revalidation tokens, and other secrets.
- **Fix**: Add `.env*` and `!.env.example` to `.gitignore` immediately. Audit git history for any previously committed secrets.

### 6. Logout via GET request enables CSRF logout attacks
- **Scope**: Auth
- **File(s)**: `frontend/app/auth/logout/route.ts:12-18`
- **Issue**: The logout route handles GET requests, meaning any page can log a user out by embedding `<img src="/auth/logout">`. This is a CSRF vulnerability on a state-changing operation.
- **Fix**: Remove the GET handler. Only handle logout via POST with proper CSRF protection.

### 7. `font-display` CSS class used across multiple components but never defined in Tailwind config
- **Scope**: Components
- **File(s)**: `frontend/src/components/FeaturedFaculty.tsx`, `EventCard.tsx`, `TestimonialCarousel.tsx`, `ContactForm.tsx` (9 instances total)
- **Issue**: Multiple components use `font-display` as a Tailwind class, but the Tailwind config only defines `font-heading` and `font-serif`. The class resolves to nothing, so headings render in the default sans-serif font instead of Fraunces.
- **Fix**: Add `'display': ['var(--font-fraunces)', 'Georgia', 'serif']` to `theme.extend.fontFamily` in `tailwind.config.ts`, or replace all `font-display` usages with `font-heading`.

---

## P1 -- Fix Before Launch

### 8. Broken redirect: `/faculty` redirects to non-existent `/people/faculty`
- **Scope**: People
- **File(s)**: `frontend/app/faculty/page.tsx:4`
- **Issue**: The `/faculty` page calls `redirect('/people/faculty')`, but no page exists at `/app/people/faculty/`. Only `/app/people/faculty/[slug]/page.tsx` exists. Users following external links to `/faculty` see a 404.
- **Fix**: Either create a `/people/faculty/page.tsx` that lists faculty, or redirect to `/people` with a faculty filter parameter.

### 9. Broken "View public profile" link in faculty profile editor
- **Scope**: People
- **File(s)**: `frontend/app/faculty/profile/FacultyProfileForm.tsx:278`
- **Issue**: The link uses `href={/people/${faculty.slug}}` instead of the correct `/people/faculty/${faculty.slug}`. Faculty editing their profile see a 404 when clicking "View public profile".
- **Fix**: Change the href to `/people/faculty/${faculty.slug}`.

### 10. Student links with null slugs generate `/people/students/null` hrefs
- **Scope**: People
- **File(s)**: `frontend/app/people/faculty/[slug]/page.tsx:336`
- **Issue**: Student links in the faculty detail page's "Graduate Students" section do not guard against null slugs. A student without a slug produces a link to `/people/students/null`.
- **Fix**: Conditionally render the link only when `student.slug` is not null. Otherwise render the name as plain text.

### 11. People directory shows inactive faculty
- **Scope**: People
- **File(s)**: `frontend/app/people/page.tsx:103`
- **Issue**: The faculty query does not filter by `active = true`, unlike staff and student queries. Inactive/departed faculty appear in the directory and inflate the faculty count.
- **Fix**: Add `.eq('active', true)` to the faculty query on the people directory page.

### 12. Faculty title admin form uses free-text input instead of enum dropdown
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/faculty/page.tsx:216-223`
- **Issue**: The faculty `title` field in the database is an enum (`faculty_title`), but the admin form uses a plain text input. Entering a non-enum value causes a 500 error with no user-facing explanation.
- **Fix**: Replace the text input with a `<select>` dropdown populated with the `faculty_title` enum values.

### 13. Staff department admin form uses free-text input instead of enum dropdown
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/staff/page.tsx:237-245`
- **Issue**: Same pattern as #12. The `department` field is an enum but uses a free-text input.
- **Fix**: Replace with a `<select>` dropdown constrained to the `department` enum values.

### 14. Student degree program "Combined BS/MS" vs database enum "Combined BS-MS"
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/students/page.tsx:217`
- **Issue**: The select option value uses a slash ("Combined BS/MS") but the database enum uses a hyphen ("Combined BS-MS"). Saving fails with a 500 error.
- **Fix**: Change the option value to `"Combined BS-MS"` to match the database enum.

### 15. Missing admin news page (dashboard links to 404)
- **Scope**: Admin, Auth
- **File(s)**: `frontend/app/admin/dashboard/page.tsx:264`
- **Issue**: The dashboard "Manage News" card links to `/admin/news`, but there is no `/app/admin/news/page.tsx`. The API route exists but the UI does not.
- **Fix**: Create `/app/admin/news/page.tsx` following the pattern of the other admin pages, or remove the card from the dashboard.

### 16. Good-news page permanently shows hardcoded fake data
- **Scope**: Content
- **File(s)**: `frontend/app/good-news/page.tsx:31-141`
- **Issue**: The Strapi fetch is commented out and the page always displays 8 static placeholder entries from the Strapi era. The page never fetches real data.
- **Fix**: Migrate to Supabase data source or remove the page if no data exists.

### 17. DEI page resource links all point to `href="#"`
- **Scope**: Content
- **File(s)**: `frontend/app/dei/page.tsx:117-148`
- **Issue**: All 6 resource links in the "Resources & Support" section have `link: '#'` as their href. Clicking "Learn More" navigates nowhere.
- **Fix**: Replace placeholder hrefs with actual URLs for each resource (DSP, Office of DEI, Counseling, etc.).

### 18. DEI page "Join Our Community" button is non-functional
- **Scope**: Content
- **File(s)**: `frontend/app/dei/page.tsx:375`
- **Issue**: The CTA button has no `onClick` handler or `href`. It does nothing when clicked.
- **Fix**: Add appropriate action -- either an `href` to a form/page, or an `onClick` to open a modal.

### 19. Alumni page CTA buttons are non-functional
- **Scope**: Content
- **File(s)**: `frontend/app/alumni/page.tsx:277-284`
- **Issue**: "Update Your Profile", "Join Alumni Directory", and "Give Back" buttons are bare `<button>` elements with no handlers.
- **Fix**: Add real actions or convert to links pointing to appropriate destinations.

### 20. Alumni page links to non-existent spotlight pages
- **Scope**: Content
- **File(s)**: `frontend/app/alumni/page.tsx:305`
- **Issue**: Spotlight cards link to `/alumni/spotlight-1`, `/alumni/spotlight-2`, `/alumni/spotlight-3`, which are non-existent routes (404).
- **Fix**: Remove the fake spotlight section or create real content for these routes.

### 21. Faculty profile form allows client-side writes without server-side authorization
- **Scope**: People, Auth
- **File(s)**: `frontend/app/faculty/profile/FacultyProfileForm.tsx:56-68`
- **Issue**: Profile updates go directly from the browser client to Supabase via `.update()`. Authorization relies entirely on RLS policies. A user could modify the `faculty.id` in the request to update another faculty member's record if RLS is misconfigured.
- **Fix**: Route updates through a server-side API route that validates the authenticated user owns the profile being updated.

### 22. `research_interests` unsafely cast from `Json` to `string[]` in detail pages
- **Scope**: People, Admin
- **File(s)**: `frontend/app/people/faculty/[slug]/page.tsx:38`, `frontend/app/people/students/[slug]/page.tsx:38`, `frontend/app/admin/faculty/page.tsx:17`
- **Issue**: The database type is `Json | null` (any valid JSON), but code casts it to `string[]` and calls `.map()` or `.join()`. Non-array values will throw runtime errors.
- **Fix**: Add runtime validation to check if the value is actually an array of strings before using array methods.

### 23. Double Supabase client creation in `isAdmin()` helper
- **Scope**: Admin
- **File(s)**: `frontend/app/api/admin/faculty/route.ts:6-10` (same pattern in all 5 API routes)
- **Issue**: The `isAdmin()` helper creates its own `createClient()` instance independent from the one in the route handler. During token refresh edge cases, the second client may not pick up refreshed tokens, causing intermittent 403 errors.
- **Fix**: Pass the existing Supabase client as a parameter to `isAdmin()` instead of creating a new one.

### 24. FacultyQuote carousel has no reduced motion support
- **Scope**: Components
- **File(s)**: `frontend/src/components/FacultyQuote.tsx:62-71`
- **Issue**: The auto-rotating carousel uses `setInterval` unconditionally and never checks `prefers-reduced-motion`. WCAG 2.1 SC 2.2.2 requires a way to pause auto-updating content.
- **Fix**: Use the existing `useReducedMotion()` hook to pause auto-rotation, as HeroSection and TestimonialCarousel already do.

---

## P2 -- Fix Soon

### 25. People directory page is entirely client-rendered (no SSR/SSG, no SEO)
- **Scope**: People
- **File(s)**: `frontend/app/people/page.tsx:1`
- **Issue**: The entire people directory is a `'use client'` component with data fetched in `useEffect`. No HTML content is sent to crawlers. No `generateMetadata()` or `<title>` exists.
- **Fix**: Refactor to a server component with client interactivity layered on top, or add a `layout.tsx` with metadata.

### 26. Staff `.title` can be null causing runtime error on staff detail page
- **Scope**: People
- **File(s)**: `frontend/app/people/staff/[slug]/page.tsx:90-91, 224`
- **Issue**: `staff.title` is `string | null`. The "a/an" grammar logic calls `.toLowerCase()` on null, which throws a runtime error.
- **Fix**: Add null guard before rendering title and before the `.toLowerCase()` call.

### 27. `degree_program` renders as "null Student" on student detail page
- **Scope**: People
- **File(s)**: `frontend/app/people/students/[slug]/page.tsx:83`
- **Issue**: If `degree_program` is null, the page renders the literal text "null Student".
- **Fix**: Add a null check and show a fallback or omit the degree label.

### 28. Advisor link on student page does not handle null advisor slug
- **Scope**: People
- **File(s)**: `frontend/app/people/students/[slug]/page.tsx:348`
- **Issue**: If the advisor has no slug, the link points to `/people/faculty/null`.
- **Fix**: Conditionally render the link only when `advisor.slug` is not null.

### 29. Staff search filter only checks `full_name`, not `first_name`/`last_name`
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/staff/page.tsx:118-122`
- **Issue**: Staff with null `full_name` are unfindable via search. Faculty and student pages use a `displayName()` fallback but staff does not.
- **Fix**: Implement the same `displayName()` pattern used in faculty and student admin pages.

### 30. Staff display shows blank name when `full_name` is null
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/staff/page.tsx:326`
- **Issue**: Staff members without `full_name` show as blank rows in the admin list.
- **Fix**: Use `full_name || \`${first_name} ${last_name}\`` fallback.

### 31. `full_name` null in people directory renders blank rows
- **Scope**: People
- **File(s)**: `frontend/app/people/page.tsx:914, 420`
- **Issue**: People with null `full_name` appear as blank/invisible entries in both table and card views.
- **Fix**: Add fallback to `first_name + last_name` as the detail pages already do.

### 32. Staff page sends empty strings instead of `null` for optional fields
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/staff/page.tsx:79-93`
- **Issue**: The staff edit form sends `""` instead of `null` for empty optional fields, unlike faculty and student pages which use `|| null`.
- **Fix**: Add `|| null` conversion for all optional fields in the staff save handler.

### 33. `full_name` silently overwritten by auto-generation in all API routes
- **Scope**: Admin
- **File(s)**: `frontend/app/api/admin/faculty/route.ts:117-129`, `students/route.ts`, `staff/route.ts`
- **Issue**: Custom display names are silently overwritten whenever `first_name` or `last_name` is included in the update payload.
- **Fix**: Only auto-generate `full_name` if it is not explicitly provided in the request body, or remove `full_name` from the edit form.

### 34. Events page date parsing may break for certain date formats
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/events/page.tsx:192-193`
- **Issue**: `.split('.')[0]` strips timezone info inconsistently. Some date formats will not populate the `datetime-local` input correctly.
- **Fix**: Use a proper date parsing function to convert to the `YYYY-MM-DDTHH:mm` format required by `datetime-local`.

### 35. API routes do not set `updated_at` timestamp on PUT operations
- **Scope**: Admin
- **File(s)**: `frontend/app/api/admin/faculty/route.ts:132-137` (same in all routes)
- **Issue**: `updated_at` is never set during updates, making audit trails incomplete.
- **Fix**: Add `updated_at: new Date().toISOString()` to all PUT update payloads, or configure a database trigger.

### 36. Dead middleware file with divergent auth logic
- **Scope**: Auth
- **File(s)**: `frontend/src/lib/supabase/middleware.ts`
- **Issue**: A dead `updateSession()` function has different redirect behavior, different query param names, and references a non-existent `/unauthorized` page. If a developer wires it in by mistake, auth will break.
- **Fix**: Delete the file entirely.

### 37. Rate limiting uses in-memory store (ineffective in serverless)
- **Scope**: Auth
- **File(s)**: `frontend/app/api/contact/route.ts:12`
- **Issue**: The rate limiter uses a JavaScript `Map` in module memory. In serverless deployments, rate limits are not shared across instances, and the Map can grow unbounded.
- **Fix**: Migrate to Redis, Supabase, or Vercel KV for rate limiting. As an interim measure, add Map size limits and TTL cleanup.

### 38. Login page renders unsanitized error parameter (social engineering risk)
- **Scope**: Auth
- **File(s)**: `frontend/app/auth/login/page.tsx:98-100`
- **Issue**: The `error` query parameter is displayed directly in the login UI. While React prevents XSS, an attacker can craft URLs with misleading error messages for phishing.
- **Fix**: Validate the error parameter against an allowlist of known error codes and map to predefined messages.

### 39. Research page uses hardcoded data instead of Supabase
- **Scope**: Content
- **File(s)**: `frontend/app/research/page.tsx:1-163`
- **Issue**: All research theme data is hardcoded in the client component. The Supabase data layer has `getAllResearchAreas()` and related functions that are ignored.
- **Fix**: Refactor to a server component using the existing data layer.

### 40. Academics page uses hardcoded data with fabricated student testimonials
- **Scope**: Content
- **File(s)**: `frontend/app/academics/page.tsx:1`
- **Issue**: Student testimonials reference fabricated people (Maria Santos, James Chen, Aisha Williams). All data is hardcoded and unmanageable via CMS.
- **Fix**: Migrate to Supabase-backed data or clearly mark content as placeholder.

### 41. Contact form links to non-existent `/privacy` page
- **Scope**: Content
- **File(s)**: `frontend/src/components/ContactForm.tsx:337`
- **Issue**: The privacy policy link in the contact form leads to a 404.
- **Fix**: Create a privacy policy page or link to the university's privacy policy.

### 42. Contact form character limit mismatch (1000 displayed vs 5000 enforced)
- **Scope**: Content, Components
- **File(s)**: `frontend/src/components/ContactForm.tsx:285-306`, `frontend/app/api/contact/route.ts:91`
- **Issue**: The textarea shows "X/1000 characters" but has no `maxLength` attribute. The server accepts up to 5000 characters.
- **Fix**: Either add `maxLength={1000}` to the textarea and update the server limit to 1000, or update the counter to show 5000.

### 43. People directory page uses raw `<img>` tags instead of `next/image`
- **Scope**: People
- **File(s)**: `frontend/app/people/page.tsx:401-407, 889-894`
- **Issue**: Profile photos load at full resolution for tiny 48x48 and 96x96 thumbnails, bypassing Next.js image optimization.
- **Fix**: Replace `<img>` tags with the `next/image` `Image` component with appropriate `sizes` prop.

### 44. Card grid key collision in people directory
- **Scope**: People
- **File(s)**: `frontend/app/people/page.tsx:944`
- **Issue**: The `ScrollReveal` key uses `person.id` (a number) without type prefix. Faculty and student with the same numeric ID cause React key collisions.
- **Fix**: Use `${person.person_type}-${person.id}` as the key, matching the pattern already used in the table view.

### 45. Header scroll handler causes excessive event listener churn
- **Scope**: Components
- **File(s)**: `frontend/src/components/Header.tsx:24-42`
- **Issue**: The `useEffect` dependency includes `lastScrollY`, causing the scroll listener to be removed and re-added on every scroll event.
- **Fix**: Use a `useRef` for `lastScrollY` instead of `useState` to avoid re-running the effect.

### 46. TestimonialCarousel keyboard handler is global, not scoped
- **Scope**: Components
- **File(s)**: `frontend/src/components/TestimonialCarousel.tsx:69-80`
- **Issue**: Arrow key listeners are attached to `window` regardless of focus state. They interfere with text inputs and other interactive elements.
- **Fix**: Scope the keyboard handler to the carousel container element, or only activate when the carousel has focus.

### 47. `bg-kelp-50` class does not exist in Tailwind config
- **Scope**: Components
- **File(s)**: `frontend/src/components/ContactForm.tsx:149`
- **Issue**: The success state uses `bg-kelp-50` but only `kelp.400/500/600` are defined. The background is transparent instead of a light green.
- **Fix**: Add `'50': '#ecfdf5'` (or similar) to the kelp color scale in `tailwind.config.ts`.

### 48. `generateMetadata` uses cookie-dependent `createClient()` during build
- **Scope**: People
- **File(s)**: `frontend/app/people/faculty/[slug]/page.tsx:14-16`, students, staff
- **Issue**: `generateMetadata()` calls `getXBySlug()` which uses `createClient()` requiring cookies. During static generation, the cookie store may not be available.
- **Fix**: Use `createStaticClient()` in `generateMetadata` or handle the error gracefully.

### 49. `CardEyebrow` dynamic Tailwind class construction may be purged
- **Scope**: Components
- **File(s)**: `frontend/src/components/ui/Card.tsx:295`
- **Issue**: Dynamic template literal construction of `from-ocean-teal`, `from-ocean-blue`, `from-ucsb-gold` may be purged by Tailwind's PurgeCSS.
- **Fix**: Use a lookup object with full class names as values, or add the classes to a safelist in `tailwind.config.ts`.

### 50. Duplicate inline `useInView` hook in 7 components
- **Scope**: Components
- **File(s)**: `FacultyQuote.tsx`, `FeaturedFaculty.tsx`, `FeaturedNews.tsx`, `PartnersSection.tsx`, `QuickNav.tsx`, `ResearchThemes.tsx`, `UpcomingEvents.tsx`
- **Issue**: Seven components define their own identical `useInView` function instead of using the shared hook at `frontend/src/hooks/useInView.ts`. The inline versions lack reduced motion support.
- **Fix**: Replace all inline `useInView` definitions with imports from `@/hooks/useInView`.

### 51. HSTS header missing `preload` directive
- **Scope**: Auth
- **File(s)**: `frontend/next.config.js:44-45`
- **Issue**: First-time visitors are not protected by HSTS until the header is received.
- **Fix**: Add `preload` to the HSTS header value and submit the domain to the HSTS preload list.

---

## P3 -- Backlog

### 52. Admin role check in middleware queries `user_roles` with anon key (RLS dependent)
- **Scope**: Auth
- **File(s)**: `frontend/middleware.ts:57-61`
- **Issue**: Admin access correctness depends on `user_roles` RLS configuration. No error handling for query failure.
- **Fix**: Add error handling and logging for the role query.

### 53. Revalidation webhook GET endpoint leaks configuration status
- **Scope**: Auth
- **File(s)**: `frontend/app/api/revalidate/route.ts:132-137`
- **Issue**: Returns `{ configured: !!REVALIDATION_TOKEN }` without auth, confirming the endpoint exists.
- **Fix**: Remove the `configured` field from the unauthenticated GET response.

### 54. Non-constant-time token comparison in revalidation webhook
- **Scope**: Auth
- **File(s)**: `frontend/app/api/revalidate/route.ts:42`
- **Issue**: Standard `!==` comparison for secret token is theoretically vulnerable to timing attacks.
- **Fix**: Use `crypto.timingSafeEqual()` for the token comparison.

### 55. Contact form subject field has no length validation
- **Scope**: Auth
- **File(s)**: `frontend/app/api/contact/route.ts:91`
- **Issue**: Subject field can accept arbitrarily large strings.
- **Fix**: Add `subject.length > 200` to the existing validation check.

### 56. Dashboard shows shell with zero counts on auth edge case
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/dashboard/page.tsx:20-35`
- **Issue**: If middleware fails to redirect, unauthenticated user sees an empty dashboard.
- **Fix**: Add client-side auth redirect fallback in the dashboard page.

### 57. Inconsistent logout availability across admin pages
- **Scope**: Admin
- **File(s)**: Multiple admin pages
- **Issue**: Only the dashboard and events pages have logout buttons. Faculty, students, and staff admin pages have no way to log out.
- **Fix**: Add a consistent admin layout with shared navigation and logout button.

### 58. `editForm` typed as `any` in faculty and staff admin pages
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/faculty/page.tsx:30`, `frontend/app/admin/staff/page.tsx:28`
- **Issue**: Loss of type safety for form field access.
- **Fix**: Define proper typed interfaces for each form.

### 59. Faculty admin page interface missing several database fields
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/faculty/page.tsx:6-23`
- **Issue**: Fields like `photo_url`, `accepting_students`, `department`, `joined_year`, `office_hours` cannot be edited via admin.
- **Fix**: Add the missing fields to the interface and create form controls for editable ones.

### 60. Student admin page missing `bio` field
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/students/page.tsx:6-27`
- **Issue**: Full student bios cannot be edited (only `short_bio` is exposed).
- **Fix**: Add `bio` field to the interface and form.

### 61. Staff admin page missing `joined_year`, `slug`, `photo_url`, `user_id`
- **Scope**: Admin
- **File(s)**: `frontend/app/admin/staff/page.tsx:6-21`
- **Issue**: These fields cannot be managed through the admin UI.
- **Fix**: Add missing fields to the interface and form.

### 62. Faculty profile form missing `short_bio`, `research_interests`, `office_hours`, `accepting_students`
- **Scope**: People
- **File(s)**: `frontend/app/faculty/profile/FacultyProfileForm.tsx:8-23`
- **Issue**: Faculty self-service editor cannot update commonly-changed fields like office hours and accepting-students status.
- **Fix**: Expand the form to include these fields.

### 63. `imageErrors` state collision across person types in people directory
- **Scope**: People
- **File(s)**: `frontend/app/people/page.tsx:65`
- **Issue**: The `imageErrors` set uses numeric IDs without type prefix, so a broken image for faculty id=5 hides the working image for student id=5.
- **Fix**: Use `${person_type}-${id}` as the key in the `imageErrors` set.

### 64. In-memoriam page uses `<img>` instead of `next/image`
- **Scope**: Content
- **File(s)**: `frontend/app/memoriam/page.tsx:138-140`
- **Issue**: Photos bypass Next.js image optimization.
- **Fix**: Import and use the `next/image` `Image` component.

### 65. Event type filter badges on events page are non-functional
- **Scope**: Content
- **File(s)**: `frontend/app/events/page.tsx:113-122`
- **Issue**: Badges have cursor-pointer styling but no click handler.
- **Fix**: Either add click handlers to filter events, or remove the interactive styling.

### 66. About page uses `border-gray-100` instead of design system `border-warm-200`
- **Scope**: Content
- **File(s)**: `frontend/app/about/page.tsx` (lines 177, 333, 398, 425, 530)
- **Issue**: Subtle visual inconsistency with warm-toned borders used elsewhere.
- **Fix**: Replace `border-gray-100` with `border-warm-200`.

### 67. Give page uses `@heroicons/react` while rest of site uses `lucide-react`
- **Scope**: Content
- **File(s)**: `frontend/app/give/page.tsx:5`
- **Issue**: Two icon libraries ship in the bundle, increasing size and causing visual inconsistency.
- **Fix**: Replace heroicons imports with lucide-react equivalents.

### 68. `TextSkeleton` uses `Math.random()` causing hydration mismatch
- **Scope**: Components
- **File(s)**: `frontend/src/components/ui/Loading.tsx:291`
- **Issue**: Server/client width values differ, causing React hydration warnings.
- **Fix**: Use a deterministic formula (e.g., based on index) instead of `Math.random()`.

---

## Cross-Cutting Patterns

- **Pattern 1: Strapi-era pages not migrated to Supabase.** Alumni, good-news, and research pages still use hardcoded data, Strapi `{ id, attributes }` shapes, and `'use client'` with `useEffect` fetching. These pages are architecturally inconsistent with the rest of the site.

- **Pattern 2: Pervasive null safety gaps.** Nearly every scope reported null-handling issues: `full_name`, `slug`, `title`, `degree_program`, `research_interests`, and `advisor.slug` are all nullable in the database but used without guards in rendering code. A systematic audit of all nullable fields rendered in JSX is needed.

- **Pattern 3: Design system color inconsistency.** Multiple components across content pages, about page, and shared components use Tailwind default `gray-*` and `blue-*` colors instead of the project's `warm-*` and `ocean-*` palette. The `font-display` / `font-heading` mismatch is a specific instance of this broader configuration drift.

- **Pattern 4: Type divergence from Supabase schema.** Admin pages, people pages, and the faculty profile form all define local TypeScript interfaces that diverge from the generated Supabase types. Fields are missing, types are loosened (`any[]` instead of `Json`), and enums are hardcoded incorrectly. Using the generated types directly would prevent an entire class of bugs.

- **Pattern 5: Dead code accumulation.** Six dead components (`ImpactMetrics`, `TestimonialSection`, `WebVitals`, `TopographicPattern`, `ErrorBoundary`, `AnimatedSection`), five unused npm dependencies (`@tanstack/react-query`, `axios`, `date-fns`, `clsx`, `tailwind-merge`), and a dead middleware file. These increase cognitive load and bundle size.

- **Pattern 6: Non-functional CTAs.** Multiple pages have buttons and links that look interactive but do nothing: DEI resources, DEI join button, alumni CTAs, alumni spotlights, event filter badges. This creates a pattern of broken trust with users.

---

## Duplicates Removed

- **Faculty profile client-side writes / RLS bypass** -- reported by People (HIGH #6) and Auth (HIGH #8). Consolidated as P1 #21.
- **Contact form textarea maxLength missing** -- reported by Content (MEDIUM #6) and Components (MEDIUM #7). Consolidated as P2 #42.
- **Missing admin news page** -- reported by Admin (CRITICAL #1) and Auth (note #4). Consolidated as P1 #15.
- **`research_interests` unsafe Json cast** -- reported by People (HIGH #5) and Admin (MEDIUM #1). Consolidated as P1 #22.
- **QuickLinks `/faculty` broken link** -- reported by Components (MEDIUM #5). Overlaps with People's `/faculty` redirect bug (CRITICAL #1). QuickLinks is dead code (never imported), so this is subsumed by the `/faculty` redirect bug (P1 #8).
- **`getContactSubmissions` wrong return type** -- reported by Content (MEDIUM #5). Subsumed under the broader type divergence cross-cutting pattern.

---

## False Positives / Severity Adjustments

- **`AnimatedSection` ignores `as` prop** (Components CRITICAL #3) -- downgraded because the component is dead code (never imported by any page). No runtime impact. Listed under dead code observations instead.

- **Dead middleware file** (Auth CRITICAL #3) -- downgraded from P0 to P2. It is dead code that cannot actively cause harm; the risk is a future developer wiring it in by mistake, which is a maintenance hazard, not an active vulnerability.

- **Double Supabase client in `isAdmin()`** (Admin CRITICAL #2) -- downgraded from P0 to P1. The issue is a potential edge case during token refresh, not a guaranteed authentication failure. The current implementation works correctly in normal flows.

- **`SectionHeader` is a client component but has no interactive state** (Components MEDIUM) -- valid optimization opportunity but not a bug. Omitted from the ranked list.

- **`Footer` uses `new Date().getFullYear()`** (Components MEDIUM) -- standard practice and not a meaningful risk. Omitted.

---

## Notes

**Overall codebase health assessment:**

The core architecture is sound. The Supabase data layer (`src/lib/data/`) is well-designed with proper error handling and type safety. The middleware authentication flow is correctly structured. The design system in Tailwind is comprehensive and thoughtful.

The primary concerns are:

1. **Security**: The open redirect (#1), CSRF logout (#6), CSP weaknesses (#4), and missing `.gitignore` protection (#5) are genuine security vulnerabilities that should be fixed before any public launch.

2. **Incomplete migration**: Several pages were built during the Strapi era and never migrated to the Supabase backend. These pages (alumni, good-news, research, academics) show fake data in production and cannot be managed via the CMS.

3. **Null safety**: The database schema has many nullable fields that are rendered without guards. This is a systematic issue that would benefit from a codebase-wide audit rather than individual fixes.

4. **Admin forms vs database enums**: The admin interface uses free-text inputs where the database expects enum values, causing silent 500 errors. This is a pattern that should be fixed with a shared enum constants module.

The 7 P0 issues should be addressed before any deployment to a public-facing environment. The 17 P1 issues represent broken user flows that would significantly degrade the user experience in production.
