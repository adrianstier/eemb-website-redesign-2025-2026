# Wave 2 Bug Bash -- Final Review Summary

**Date:** 2026-02-09
**Reviewer:** Review Agent (read-only validation pass)

---

## Totals

| Category | Count |
|----------|-------|
| Total bugs identified (wave 1 audit) | 68 |
| Fixed in wave 1 (P0 + bonus) | 10 |
| Fixed in wave 2 (P1/P2/P3) | 52 |
| **Total fixed** | **62** |
| Remaining (intentionally deferred) | 6 |

### Wave 1 Fixes (10)
- P0 #1-#7 (all 7 critical bugs)
- Bonus: #16 (good-news page fake data), #19 (alumni CTA buttons), #20 (alumni spotlight links)

### Wave 2 Fixes by Scope (52)
- **Admin Pages & API Routes** (14): #12, #13, #14, #15, #23, #29, #30, #32, #33, #34, #35, #56, #57, #58
- **People Pages** (13): #8, #9, #10, #11, #22, #26, #27, #28, #31, #43, #44, #48, #63
- **Content Pages** (10): #17, #18, #39, #40, #41, #42, #64, #65, #66, #67
- **Auth & Security** (8): #36, #37, #38, #51, #52, #53, #54, #55
- **Components & UI** (7): #24, #45, #46, #47, #49, #50, #68

---

## Spot-Check Results

### Critical Spot-Checks

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | Auth callback open redirect (P0 #1) | **PASS** | `getSafeRedirectUrl()` is present in `app/auth/callback/route.ts` with path-prefix allowlist, protocol-relative URL blocking, and encoded-character checks. Redirect uses validated `next` on line 78. |
| 2 | isAdmin() single client (P1 #23) | **PASS** | `app/api/admin/faculty/route.ts` line 6: `isAdmin()` accepts a `supabase` parameter. All 4 handlers (GET, POST, PUT, DELETE) pass the already-created client via `isAdmin(supabase)`. |
| 3 | News page published filter (P0 #2) | **PASS** | `app/news/page.tsx` imports and uses `getAllNews()` from `@/lib/data/news`. The data layer function at `src/lib/data/news.ts` line 52 correctly filters `.eq('published', true)`. Metadata and revalidate exports are present. |
| 4 | Login error allowlist (P2 #38) | **PASS** | `app/auth/login/page.tsx` lines 49-53: `errorMessages` allowlist maps known error strings to safe display messages. Line 61: unknown errors fall back to generic "An error occurred. Please try again." JSX renders `displayError` (line 107-110), not the raw query parameter. |
| 5 | Revalidation timing-safe compare (P3 #54) | **PASS** | `app/api/revalidate/route.ts` lines 3-9: imports `timingSafeEqual` from `crypto`, defines `safeCompare()` with length check and `Buffer.from()`. Line 49 uses `!safeCompare()` for token validation. GET endpoint (line 140) returns only `{ status: 'ok' }` with no config leak. |
| 6 | Dead middleware deleted (P2 #36) | **PASS** | Glob search for `frontend/src/lib/supabase/middleware.ts` returns no results. File has been deleted. |
| 7 | useInView dedup (P2 #50) | **PASS** | `src/components/FacultyQuote.tsx` line 5: `import { useInView } from '@/hooks/useInView'`. Line 38: uses `useInView({ threshold: 0.2 })` (options-object API). No inline useInView definition present. |
| 8 | Admin news page exists (P1 #15) | **PASS** | `app/admin/news/page.tsx` exists (531 lines). Full CRUD page with list view, create/edit form, delete with confirmation, search filter, category dropdown, published/draft/featured badges, and logout button. |

### Cross-Cutting Checks

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 9 | No remaining localhost:1337 refs in non-test files | **PASS** | Grep found 6 files with `localhost:1337`: `jest.setup.js`, `cypress.config.ts`, and 4 test spec files. All are test/config files. No production code references remain. The `cypress.config.ts` env var `apiUrl: 'http://localhost:1337'` is Strapi-era test config -- not ideal but not a production issue. |
| 10 | font-display Tailwind definition | **PASS** | `tailwind.config.ts` line 87: `'display': ['var(--font-fraunces)', 'Georgia', 'serif']` is defined under `fontFamily`. Additionally, both fonts in `app/layout.tsx` use `display: 'swap'` for proper font loading. |
| 11 | HSTS preload added | **PASS** | `next.config.js` line 44: `'max-age=31536000; includeSubDomains; preload'`. Correctly includes all three directives. |
| 12 | CSP unsafe-eval removed | **PASS** | `next.config.js` lines 10-11: `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com`. No `unsafe-eval` present. |

**Spot-check score: 12/12 PASS**

---

## Issues Found During Review

### Minor Observations (not blocking)

1. **Logout route is POST-only (good), but no CSRF token validation.**
   `app/auth/logout/route.ts` correctly only exposes a POST handler (P0 #6 fix verified). However, the route does not validate a CSRF token. The same-origin policy provides reasonable protection, but a CSRF token would be defense-in-depth.

2. **`cypress.config.ts` still references `localhost:1337`** (Strapi API URL in test env config).
   This is a leftover from the Strapi era. Not a production issue, but creates confusion. Low priority cleanup.

3. **`@heroicons/react` still in `optimizePackageImports`.**
   `next.config.js` line 85: `optimizePackageImports: ['lucide-react', '@heroicons/react']`. Bug #67 replaced heroicons with lucide-react in the give page, but `@heroicons/react` is still listed in the config. If the package is no longer used anywhere, this entry is dead and the package can be removed from `package.json`.

4. **CSP still includes `'unsafe-inline'` in `script-src`.**
   While `unsafe-eval` was correctly removed (P0 #4), `unsafe-inline` remains. The original bug report noted this weakens XSS protection. This may be necessary for Next.js operation but should be migrated to nonce-based CSP when feasible.

5. **`generateMetadata` uses try/catch fallback (bug #48) rather than `createStaticClient`.**
   The people-pages report notes this is a pragmatic fix. The more thorough fix (using `createStaticClient` in metadata functions) was deferred. The current approach prevents build failures but means metadata may be generic for statically-generated pages.

---

## Remaining Known Issues (6 bugs deferred)

| Bug | Priority | Description | Reason Deferred |
|-----|----------|-------------|-----------------|
| #21 | P1 | Faculty profile form allows client-side writes without server-side authorization | Architectural change -- requires creating a new API route and reworking the profile form. RLS provides current protection. |
| #25 | P2 | People directory page is entirely client-rendered (no SSR/SSG, no SEO) | Significant refactoring effort -- requires splitting into server + client components. |
| #59 | P3 | Faculty admin page interface missing several database fields | Feature gap, not a bug. Fields can be added incrementally. |
| #60 | P3 | Student admin page missing `bio` field | Feature gap. Only `short_bio` is exposed. |
| #61 | P3 | Staff admin page missing `joined_year`, `slug`, `photo_url`, `user_id` fields | Feature gap. Fields can be added incrementally. |
| #62 | P3 | Faculty profile form missing `short_bio`, `research_interests`, `office_hours`, `accepting_students` | Feature gap for faculty self-service editing. |

**Note:** Bug #21 (P1) is the most significant remaining issue. Client-side Supabase writes rely entirely on RLS policies for authorization. If RLS is misconfigured, a user could modify another faculty member's profile. This should be prioritized for the next fix cycle.

---

## Overall Assessment

**The bug bash was successful.** 62 of 68 identified bugs were fixed across two waves, with the 6 remaining items being intentionally deferred (4 are P3 feature gaps, 1 is a P2 architectural refactor, and 1 is a P1 security hardening that requires a new API route).

**Security posture is substantially improved:**
- Open redirect vulnerability patched with allowlist validation (both callback and login pages)
- CSRF logout attack surface eliminated (POST-only logout)
- CSP hardened (`unsafe-eval` removed, HSTS preload added)
- `.gitignore` now excludes environment files
- Revalidation webhook uses timing-safe token comparison and no longer leaks config
- Login page sanitizes error messages via allowlist
- Dead middleware with divergent auth logic deleted

**Code quality improvements:**
- 7 duplicate `useInView` hooks consolidated to shared import
- Admin forms now use enum-constrained dropdowns instead of free-text inputs
- Pervasive null safety gaps fixed across people pages and admin pages
- Header scroll handler performance issue resolved (useRef vs useState)
- Hydration mismatch in TextSkeleton fixed with deterministic values
- Design system consistency improved (warm borders, kelp-50 color, font-display defined)
- `next/image` adopted in people directory and memoriam pages

**Recommended next steps:**
1. Fix bug #21 (route faculty profile writes through a server-side API) -- P1
2. Address bug #25 (SSR/SEO for people directory) -- P2
3. Remove `@heroicons/react` from package.json if no remaining imports
4. Migrate to nonce-based CSP to eliminate `unsafe-inline`
5. Add admin form fields for the P3 feature gaps (#59-#62) as time permits
