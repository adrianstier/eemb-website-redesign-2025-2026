# Bug Bash Report: Wave 4 - Data Layer, Auth & Config

**Date:** 2026-02-10
**Scope:** Data layer queries, authentication logic, configuration files, security headers
**Agent:** Claude Opus 4.6

---

## Files Audited

### Supabase Clients
- `frontend/src/lib/supabase/client.ts` - Browser client
- `frontend/src/lib/supabase/server.ts` - Server client + static client
- `frontend/src/lib/supabase/types.ts` - Auto-generated database types

### Data Layer (`frontend/src/lib/data/`)
- `frontend/src/lib/data/index.ts` - Barrel exports
- `frontend/src/lib/data/faculty.ts` - Faculty queries
- `frontend/src/lib/data/students.ts` - Graduate student queries
- `frontend/src/lib/data/staff.ts` - Staff queries
- `frontend/src/lib/data/news.ts` - News article queries
- `frontend/src/lib/data/events.ts` - Events queries
- `frontend/src/lib/data/research.ts` - Research area queries
- `frontend/src/lib/data/testimonials.ts` - Student testimonial queries
- `frontend/src/lib/data/contact.ts` - Contact form submission queries

### Auth Routes
- `frontend/app/auth/login/page.tsx` - Login page (client component)
- `frontend/app/auth/callback/route.ts` - OAuth callback handler
- `frontend/app/auth/logout/route.ts` - Logout handler (POST only)
- `frontend/middleware.ts` - Route protection middleware

### API Routes
- `frontend/app/api/revalidate/route.ts` - Cache revalidation webhook
- `frontend/app/api/contact/route.ts` - Contact form submission
- `frontend/app/api/admin/faculty/route.ts` - Admin faculty CRUD
- `frontend/app/api/admin/students/route.ts` - Admin student CRUD
- `frontend/app/api/admin/staff/route.ts` - Admin staff CRUD
- `frontend/app/api/admin/events/route.ts` - Admin events CRUD
- `frontend/app/api/admin/news/route.ts` - Admin news CRUD

### Config Files
- `frontend/next.config.js` - Next.js config with CSP and security headers
- `frontend/tailwind.config.ts` - Tailwind design system
- `frontend/tsconfig.json` - TypeScript configuration
- `frontend/package.json` - Dependencies
- `frontend/.env.local.example` - Environment variable template
- `frontend/app/layout.tsx` - Root layout

### Utility Files
- `frontend/src/lib/animationTokens.ts` - Animation constants
- `frontend/src/components/GoogleAnalytics.tsx` - GA tracking

---

## Codebase-Wide Searches

| Pattern | Results |
|---------|---------|
| `localhost:1337` | Found in test files only + `.env.local.example` (now commented out) |
| `@ts-ignore` / `@ts-nocheck` | **None found** |
| `as any` | **None found** |
| Raw HTML injection patterns | 1 occurrence in `GoogleAnalytics.tsx` (acceptable - GA initialization, now validated) |
| Dynamic code execution | **None found** |
| `innerHTML` | 1 occurrence in test file only |

---

## Bugs Found and Fixed

### BUG-1: CSP missing `object-src 'none'` directive (P1 - Security)

**File:** `frontend/next.config.js` (line 16)
**Issue:** The Content Security Policy did not include an explicit `object-src` directive. Without it, `object-src` falls back to `default-src 'self'`, which permits loading of plugins (Flash, Java applets, etc.) from the same origin.
**Fix:** Added `object-src 'none';` to the CSP directive string.

### BUG-2: `parseInt()` without NaN validation in all admin DELETE routes (P1 - Data Integrity)

**Files:**
- `frontend/app/api/admin/faculty/route.ts`
- `frontend/app/api/admin/students/route.ts`
- `frontend/app/api/admin/staff/route.ts`
- `frontend/app/api/admin/events/route.ts`
- `frontend/app/api/admin/news/route.ts`

**Issue:** All admin DELETE handlers used `parseInt(id)` on query string parameters without validating the result. If `id=abc` is passed, `parseInt('abc')` returns `NaN`, and the Supabase query `.eq('id', NaN)` has undefined behavior. Also, `parseInt` was called without a radix argument.
**Fix:** Added explicit `parseInt(id, 10)` with `isNaN()` and `<= 0` validation, returning a 400 error for invalid IDs. Applied to all 5 admin API route files.

### BUG-3: Wrong return type in `getContactSubmissions` (P2 - Type Safety)

**File:** `frontend/src/lib/data/contact.ts` (line 39)
**Issue:** The function declared its return type as `TablesInsert<'contact_submissions'>[]` but the data comes from a SELECT query, meaning the actual shape is `Tables<'contact_submissions'>` (the Row type).
**Fix:** Added `Tables` import, created `ContactSubmission` type alias, and updated the return type.

### BUG-4: Pagination logic bug in `getContactSubmissions` (P2 - Data Integrity)

**File:** `frontend/src/lib/data/contact.ts` (lines 53-59)
**Issue:** When both `offset` and `limit` were provided, `.limit()` was applied before `.range()`. Supabase's `.range()` overrides `.limit()`, making the earlier call pointless.
**Fix:** Restructured: use `.range()` when offset is specified, fall back to `.limit()` only when offset is absent.

### BUG-5: GA Measurement ID injected into script without validation (P2 - Security)

**File:** `frontend/src/components/GoogleAnalytics.tsx` (line 7)
**Issue:** The `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var was interpolated directly into an inline script block without format validation. A compromised CI/CD pipeline or misconfigured env could inject arbitrary JavaScript.
**Fix:** Added regex validation (`/^G-[A-Z0-9]+$/`) to ensure the value matches GA4 format before use.

### BUG-6: Stale `localhost:1337` reference in `.env.local.example` (P3 - Maintenance)

**File:** `frontend/.env.local.example` (line 45)
**Issue:** The example env file still listed `NEXT_PUBLIC_API_URL=http://localhost:1337` as active, even though the project migrated to Supabase.
**Fix:** Commented out the variable and marked it as deprecated.

---

## Issues NOT Found (Positive Findings)

1. **Auth middleware**: Correctly protects `/faculty/profile` and `/admin` routes. Fails closed on role check errors.
2. **Open redirect protection**: Both callback and login implement `getSafeRedirectUrl()` with comprehensive validation.
3. **Login error allowlist**: Uses allowlisted error strings, falls back to generic message for unknown errors.
4. **Logout is POST-only**: Prevents CSRF via GET link.
5. **Revalidation route**: Uses `timingSafeEqual` for token comparison.
6. **SQL injection**: Not applicable -- all queries use parameterized Supabase query builder.
7. **No type safety bypasses**: Zero `@ts-ignore`, `@ts-nocheck`, or `as any` in the codebase.
8. **HSTS**: Correctly configured with `max-age=31536000; includeSubDomains; preload`.
9. **Contact form API**: Has rate limiting, honeypot, input validation, length limits.
10. **Admin API routes**: All check auth and admin role before operations. Fail-closed pattern.
11. **Cookie handling**: Supabase SSR library manages cookie security. Server Component case handled.
12. **`.env.local` not committed**: `.gitignore` correctly excludes env files.
13. **TypeScript config**: `strict: true` is enabled.

---

## Deferred Issues

### DEFER-1: Duplicated `getSafeRedirectUrl` function (Low Priority)
**Why deferred:** One is server-side, one is client component. Cannot easily share code in Next.js.

### DEFER-2: `isAdmin` helper duplicated across 5 admin API routes (Low Priority)
**Why deferred:** One-liner function, minimal duplication risk. Refactoring task.

### DEFER-3: In-memory rate limiting on contact form (Medium Priority)
**Why deferred:** Ineffective on serverless. Code acknowledges this. Requires infrastructure decision.

### DEFER-4: `unsafe-inline` in CSP script-src (Medium Priority)
**Why deferred:** Next.js makes CSP nonces difficult. Known framework trade-off.

---

## Summary

| Severity | Found | Fixed | Deferred |
|----------|-------|-------|----------|
| P0 (Critical) | 0 | 0 | 0 |
| P1 (High) | 2 | 2 | 0 |
| P2 (Medium) | 3 | 3 | 2 |
| P3 (Low) | 1 | 1 | 2 |
| **Total** | **6** | **6** | **4** |

**Overall assessment:** The data layer, auth logic, and configuration are well-implemented. The Supabase client pattern is correctly applied throughout. All data queries use parameterized query builders with proper error handling. Auth follows a fail-closed pattern. The bugs found were input validation gaps in admin API routes, a type safety issue, a CSP hardening gap, and a defense-in-depth issue with GA ID validation.
