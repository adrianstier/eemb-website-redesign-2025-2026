# Bug Bash: Auth & Infrastructure

## Summary
- **15 bugs found** (3 critical, 5 high, 5 medium, 2 low)

---

## Bugs

### [CRITICAL] Open redirect in OAuth callback route
- **File**: `/frontend/app/auth/callback/route.ts:7,47`
- **Description**: The `next` query parameter is read from the URL and used directly in a redirect without any validation. While the login page has a `getSafeRedirectUrl()` function that validates the redirect URL, this validation is only applied client-side before initiating the OAuth flow. The callback route itself performs no validation at all. An attacker can craft a malicious Supabase OAuth link that, after successful authentication, redirects the user to an external domain using protocol-relative URLs like `//malicious.com`. Because the callback constructs the redirect as `${origin}${next}`, various URL manipulation techniques can bypass simple prefix checks.
- **Impact**: After successful login, users can be redirected to a phishing site that looks like the real EEMB site. The attacker gets the user to authenticate on the real site first, making the phishing more convincing.

### [CRITICAL] Logout via GET request enables CSRF logout attacks
- **File**: `/frontend/app/auth/logout/route.ts:12-18`
- **Description**: The logout route handles both POST and GET requests. The GET handler means any page can log a user out by embedding `<img src="/auth/logout">` or a similar tag. This is a classic CSRF vulnerability. State-changing operations should only be performed via POST with CSRF protection.
- **Impact**: Any website can silently log users out of the EEMB site by including the logout URL in an image tag, iframe, or link. This is a denial-of-service on authenticated sessions.

### [CRITICAL] Dead middleware file creates confusion about which auth logic is active
- **File**: `/frontend/src/lib/supabase/middleware.ts` (entire file)
- **Description**: There are two middleware implementations:
  1. `/frontend/middleware.ts` (active -- this is what Next.js uses)
  2. `/frontend/src/lib/supabase/middleware.ts` (dead code -- never imported anywhere)

  The dead `updateSession()` function has **different behavior** from the active middleware:
  - It uses `redirect` as the query param name (line 48) vs `next` in the active middleware (line 45)
  - On admin auth failure, it redirects to `/unauthorized` (line 63) which **does not exist** as a page
  - It does not check `userRole.role !== 'admin'`; instead checks `userRole?.role !== 'admin'` (subtly different null handling)

  If a developer mistakenly starts importing and using `updateSession()` thinking it is the canonical middleware, auth will break silently with incorrect redirect behavior.
- **Impact**: Code maintenance hazard. The divergent logic means a developer could wire in the wrong middleware, causing broken redirects, missing auth checks, or 404s on the nonexistent `/unauthorized` page.

### [HIGH] Login page renders unsanitized error parameter in the UI
- **File**: `/frontend/app/auth/login/page.tsx:98-100`
- **Description**: The `error` query parameter from the URL is rendered directly into the page: `{error}`. While React escapes text content by default (preventing basic XSS), the error message originates from the callback route which sets it to a fixed string. However, the login page reads the `error` param from `searchParams` with no validation. An attacker can craft a URL like `/auth/login?error=Your+account+has+been+compromised.+Call+1-800-SCAM+immediately` for social engineering.
- **Impact**: Social engineering / phishing via crafted error messages displayed in the official login UI. While not XSS due to React escaping, the error message box has no allowlist of valid error messages.

### [HIGH] CSP allows overly permissive directives in script-src
- **File**: `/frontend/next.config.js:11`
- **Description**: The Content-Security-Policy `script-src` directive includes both `'unsafe-inline'` and `'unsafe-eval'`. The latter allows `Function()` constructor, `setTimeout(string)`, and similar dynamic code execution. This effectively negates much of the protection CSP is supposed to provide against XSS. Together they make the CSP nearly useless for script injection prevention.
- **Impact**: If an attacker finds any injection point, CSP will not block the execution of injected scripts. The CSP becomes a false sense of security.

### [HIGH] Rate limiting uses in-memory store (broken in serverless/multi-instance deployments)
- **File**: `/frontend/app/api/contact/route.ts:12`
- **Description**: The rate limiter uses a JavaScript `Map()` stored in module-level memory. In serverless environments (Vercel, AWS Lambda), each function invocation may run in a different instance with its own memory. This means:
  1. Rate limits are not shared across instances -- an attacker can exceed the limit by hitting different instances
  2. The `Map` grows unbounded if the cleanup function does not run frequently enough (memory leak in long-lived instances)
  3. On cold starts, all rate limit history is lost

  The code itself acknowledges this with a comment: "for serverless, consider using Redis or Supabase"
- **Impact**: Rate limiting is effectively non-functional in a serverless deployment. An attacker can spam the contact form without restriction. In a traditional server, memory can grow unbounded.

### [HIGH] HSTS header missing `preload` directive
- **File**: `/frontend/next.config.js:44-45`
- **Description**: The `Strict-Transport-Security` header is set to `max-age=31536000; includeSubDomains` but is missing the `preload` directive. Without `preload`, the HSTS protection only takes effect after the browser first visit. The first visit is still vulnerable to SSL stripping attacks until the header is received.
- **Impact**: First-time visitors are not protected by HSTS. To get full protection, the `preload` directive should be added and the domain submitted to the HSTS preload list.

### [HIGH] Faculty profile form allows client-side writes without server-side authorization
- **File**: `/frontend/app/faculty/profile/FacultyProfileForm.tsx:54-68`
- **Description**: The faculty profile update is performed directly from the browser client using the Supabase browser client with an `.update()` call filtered by `faculty.id`. The `faculty.id` is passed as a prop from the server component, but the actual database write happens from the client. This means:
  1. Authorization depends entirely on Supabase RLS policies being correctly configured
  2. A user could potentially modify the `faculty.id` in the request to update a different faculty member profile
  3. There is no server-side validation of the data being written (no length checks, no format validation, no sanitization)

  If RLS policies are not correctly configured (which cannot be verified from the frontend code alone), any authenticated user could update any faculty record.
- **Impact**: Potential unauthorized modification of faculty profiles. The security boundary is entirely delegated to Supabase RLS with no defense-in-depth from the application layer.

### [MEDIUM] Admin role check in middleware queries user_roles table using anon key
- **File**: `/frontend/middleware.ts:57-61`
- **Description**: The middleware uses the Supabase anon key to query the `user_roles` table. If RLS policies on `user_roles` allow users to read only their own records, this should work. But if the RLS is not configured, or if the anon key does not have read access to `user_roles`, the query will fail silently (returning null), and the admin check at line 63 will deny access even to legitimate admins. Conversely, if RLS is too permissive, users could potentially see all roles. The middleware has no error handling for the query failure case.
- **Impact**: Admin access could be broken or insecure depending on RLS configuration. No error logging when the role query fails.

### [MEDIUM] .gitignore does not exclude .env files
- **File**: `/frontend/.gitignore:1`
- **Description**: The `.gitignore` file contains only `.vercel`. There is no exclusion for `.env`, `.env.local`, `.env.production`, or other environment files. While `.env.local` currently exists and is not committed, this is only because it has not been `git add`ed. There is no `.gitignore` protection preventing accidental commits of secrets.
- **Impact**: High risk of accidentally committing secrets (Supabase keys, revalidation tokens) to version control.

### [MEDIUM] Revalidation webhook GET endpoint leaks configuration status
- **File**: `/frontend/app/api/revalidate/route.ts:132-137`
- **Description**: The GET handler returns `{ status: 'ok', configured: !!REVALIDATION_TOKEN }` without any authentication. This tells an attacker whether the revalidation system is configured, which is information disclosure. While minor on its own, it confirms the endpoint exists and is active.
- **Impact**: Information disclosure. An attacker learns whether the webhook is configured, which helps in planning further attacks on the revalidation system.

### [MEDIUM] Contact form subject field has no length validation
- **File**: `/frontend/app/api/contact/route.ts:91`
- **Description**: The validation at line 91 checks `name.length > 200 || email.length > 254 || message.length > 5000` but does not validate the `subject` field length. The `subject` field is extracted from the request body (line 69), trimmed (line 115), and inserted into the database. An attacker could send a multi-megabyte subject string.
- **Impact**: Potential for storing excessively large data in the database, consuming storage, or causing display issues in admin views.

### [MEDIUM] Non-constant-time token comparison in revalidation webhook
- **File**: `/frontend/app/api/revalidate/route.ts:42`
- **Description**: The revalidation token is compared using `token !== REVALIDATION_TOKEN` which is a standard JavaScript string comparison. This is not constant-time, making it theoretically vulnerable to timing attacks where an attacker can guess the token one character at a time by measuring response times. In practice, network jitter makes this very difficult to exploit over the internet, but it is a security best practice to use constant-time comparison for secrets.
- **Impact**: Theoretical timing attack vector. Low practical risk over network, but violates security best practices.

### [LOW] Google Analytics component uses raw HTML injection for measurement ID
- **File**: `/frontend/src/components/GoogleAnalytics.tsx:90-101`
- **Description**: The GA measurement ID from `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID` is interpolated directly into a raw HTML script block via React's `dangerouslySetInnerHTML` prop. If the environment variable were to contain malicious JavaScript (e.g., through a compromised deployment pipeline), it would execute. While environment variables are generally trusted, this pattern bypasses React's XSS protections.
- **Impact**: If the `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable is compromised, arbitrary JavaScript executes in all users browsers. Low likelihood but high impact supply-chain risk.

### [LOW] Admin dashboard page (client component) has no server-side auth check
- **File**: `/frontend/app/admin/dashboard/page.tsx:14-35`
- **Description**: The admin dashboard is a `'use client'` component that checks the user on the client side via `supabase.auth.getUser()`. While the middleware protects the route at the request level, the page itself has no `redirect()` call if the user is unauthenticated. If the middleware were to be misconfigured or bypassed (e.g., during development with the matcher changed), the dashboard would render and then try to fetch data, potentially showing a loading state indefinitely or exposing the dashboard layout to unauthenticated users.
- **Impact**: No defense-in-depth for the admin dashboard. Relies entirely on middleware for access control.

---

## Notes

### Architecture Observations

1. **Dual middleware files**: The active middleware is `/frontend/middleware.ts`. The file at `/frontend/src/lib/supabase/middleware.ts` exports `updateSession()` but it is never imported anywhere. This is dead code that should be removed to avoid confusion.

2. **Auth flow trace** (login -> callback -> session -> protected page -> logout):
   - User clicks "Sign in with Google" on `/auth/login`
   - Supabase OAuth redirects to Google, then back to `/auth/callback?code=...&next=...`
   - Callback exchanges code for session, auto-creates faculty role if email matches
   - Middleware refreshes session on every request and checks protected routes
   - Faculty profile page has an additional server-side auth check
   - Logout is available via both GET and POST at `/auth/logout`

3. **Admin API routes are well-protected**: All five admin API routes (`/api/admin/faculty`, `/api/admin/students`, `/api/admin/staff`, `/api/admin/events`, `/api/admin/news`) consistently check both authentication and admin role via the `isAdmin()` RPC function. This is good defense-in-depth beyond the middleware.

4. **Missing `/admin/news` page**: The admin dashboard links to `/admin/news` (line 264 of dashboard) but there is no `/frontend/app/admin/news/page.tsx` file. The API route exists but the UI page does not. This will result in a 404.

5. **Missing `/unauthorized` page**: The dead middleware file references `/unauthorized` but no such page exists.

6. **Cookie security settings**: The Supabase SSR client handles cookies automatically. The middleware and server client both use the `@supabase/ssr` package default cookie configuration. No explicit `Secure`, `HttpOnly`, or `SameSite` flags are set in the application code -- these are managed by the Supabase SDK. This is acceptable but means cookie security depends on the SDK version.

7. **Redirect loop risk**: There is a small risk of redirect loops if an authenticated non-admin user navigates to `/admin`. The middleware redirects them to `/` (line 67), which is correct and does not loop. However, the dead middleware file would redirect to `/unauthorized` which does not exist, causing a 404 rather than a loop.

8. **CSP and Next.js**: The `'unsafe-inline'` in `style-src` is commonly needed for Next.js styled-jsx and inline styles. The dangerous eval-like directives in `script-src` may be required for Next.js development mode but should be removed in production. Consider using nonces instead of `unsafe-inline`.
