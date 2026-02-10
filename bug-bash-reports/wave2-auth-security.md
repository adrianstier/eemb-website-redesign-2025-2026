# Wave 2: Auth & Security Hardening - Bug Bash Report

## Summary

8 bugs fixed across 6 files (1 deleted). All changes are minimal and targeted.

---

## Bug #36: Dead middleware file with divergent auth logic

**File:** `src/lib/supabase/middleware.ts`
**Action:** Deleted the file entirely.
**Notes:** This file exported `updateSession()` which was never imported anywhere in the codebase. It had divergent redirect behavior (redirecting to a non-existent `/unauthorized` page) compared to the root `middleware.ts`. Removing it eliminates confusion and dead code.

## Bug #37: Rate limiting uses in-memory store (ineffective in serverless)

**File:** `app/api/contact/route.ts`
**Action:** Added a `MAX_RATE_LIMIT_ENTRIES = 10000` constant. Modified `cleanupRateLimitStore()` to only run TTL cleanup when the Map exceeds this size limit, preventing unbounded memory growth.
**Notes:** The cleanup now gates on `rateLimitStore.size > MAX_RATE_LIMIT_ENTRIES` before iterating and purging expired entries. This keeps the Map bounded without adding overhead on every request when the Map is small.

## Bug #38: Login page renders unsanitized error parameter

**File:** `app/auth/login/page.tsx`
**Action:** Added an `errorMessages` allowlist mapping known error strings to safe display messages. Unknown error values now show a generic "An error occurred. Please try again." message. The JSX renders `displayError` instead of the raw `error` query parameter.
**Notes:** This prevents attackers from crafting URLs with misleading or malicious messages in the error parameter.

## Bug #51: HSTS header missing preload directive

**File:** `next.config.js`
**Action:** Changed the `Strict-Transport-Security` header value from `'max-age=31536000; includeSubDomains'` to `'max-age=31536000; includeSubDomains; preload'`.
**Notes:** The `preload` directive allows the domain to be submitted to the HSTS preload list, ensuring browsers always use HTTPS even on the first visit.

## Bug #52: Admin role check in middleware has no error handling

**File:** `middleware.ts` (root of frontend)
**Action:** Added error handling to the `user_roles` query. If the query fails, the error is logged and the user is redirected to home (fail closed).
**Notes:** Previously, a database error during the role check would result in `userRole` being null, which would correctly deny access, but the error itself was silently swallowed. Now the error is explicitly caught, logged, and handled with a redirect.

## Bug #53: Revalidation webhook GET endpoint leaks configuration

**File:** `app/api/revalidate/route.ts`
**Action:** Removed the `configured: !!REVALIDATION_TOKEN` field from the GET handler response. Now returns only `{ status: 'ok' }`.
**Notes:** The previous response leaked whether the revalidation token was configured, which is information an attacker could use to determine system state.

## Bug #54: Non-constant-time token comparison in revalidation webhook

**File:** `app/api/revalidate/route.ts`
**Action:** Added a `safeCompare()` function using `crypto.timingSafeEqual` and replaced the `!==` token comparison with `!safeCompare()`. Also added a null check for the token before comparison.
**Notes:** The `timingSafeEqual` function prevents timing attacks that could be used to guess the token character by character. The length check before `timingSafeEqual` is necessary because the function requires equal-length buffers; while this leaks length information, it prevents a crash.

## Bug #55: Contact form subject has no length validation

**File:** `app/api/contact/route.ts`
**Action:** Added a validation check for `subject.length > 200` after the existing field length validation block. Returns a 400 error with message "Subject is too long. Please keep it under 200 characters."
**Notes:** The existing validation checked name, email, and message lengths but omitted the optional subject field. This fix ensures the subject cannot be used to submit arbitrarily long strings.
