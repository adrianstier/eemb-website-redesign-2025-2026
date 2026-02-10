# Wave 2 Bug Bash Report: Admin Pages & API Routes

**Date:** 2026-02-09
**Scope:** Admin CRUD pages, API route handlers, auth edge cases

---

## Bug #12: Faculty title enum dropdown
- **File:** `frontend/app/admin/faculty/page.tsx`
- **Fix:** Replaced the plain `<input type="text">` for the `title` field with a `<select>` dropdown containing the `faculty_title` enum values: Professor, Associate Professor, Assistant Professor, Adjunct Professor, Professor Emeritus, Lecturer, Researcher, Visiting Professor.

## Bug #13: Staff department enum dropdown
- **File:** `frontend/app/admin/staff/page.tsx`
- **Fix:** Replaced the free-text `<input>` for the `department` field with a `<select>` dropdown containing the `department` enum values: EEMB, MCDB, ERI, MSI, Other.

## Bug #14: Student degree "Combined BS/MS" mismatch
- **File:** `frontend/app/admin/students/page.tsx`
- **Fix:** Changed the `<option value="Combined BS/MS">` to `<option value="Combined BS-MS">` to match the database enum which uses a hyphen, not a slash.

## Bug #15: Create admin news page
- **File:** `frontend/app/admin/news/page.tsx` (NEW)
- **Fix:** Created a full admin news management page with:
  - List view showing all articles with category badges, published/draft status, featured indicator
  - Create/edit form with fields: title, slug, excerpt, content, category (select from `news_category` enum), author, subtitle, publish_date, image_url, featured, published
  - Delete functionality with confirmation
  - Search filter by title, category, or author
  - Logout button in header
  - Pattern matches the events admin page style

## Bug #23: Double Supabase client in isAdmin()
- **Files:** All 5 API routes (`faculty`, `students`, `staff`, `events`, `news` under `app/api/admin/`)
- **Fix:** Changed the `isAdmin()` helper to accept a Supabase client parameter (`isAdmin(supabase: Awaited<ReturnType<typeof createClient>>)`) instead of creating its own `createClient()` instance. Updated all call sites in GET, POST, PUT, and DELETE handlers to pass `isAdmin(supabase)`.

## Bug #29: Staff search filter only checks full_name
- **File:** `frontend/app/admin/staff/page.tsx`
- **Fix:** Added a `displayName()` helper (matching the faculty/student pattern) that returns `full_name || \`${first_name} ${last_name}\`.trim()`. Updated the search filter to use `displayName(member)` so it checks against the composed name, email, and title.

## Bug #30: Staff display shows blank name when full_name is null
- **File:** `frontend/app/admin/staff/page.tsx`
- **Fix:** Changed the display-mode heading from `{member.full_name}` to `{displayName(member)}`, which falls back to `"${first_name} ${last_name}"` when `full_name` is null.

## Bug #32: Staff page sends empty strings instead of null
- **File:** `frontend/app/admin/staff/page.tsx`
- **Fix:** Added `|| null` to optional fields in the `dataToSave` object: `full_name`, `title`, `office`, `phone`, `bio`, `short_bio`, `department`, `linkedin`. This matches the pattern used in the faculty and student admin pages.

## Bug #33: full_name silently overwritten by auto-generation in API routes
- **Files:** PUT handlers in `app/api/admin/faculty/route.ts`, `app/api/admin/students/route.ts`, `app/api/admin/staff/route.ts`
- **Fix:** Added a guard `if (!updates.full_name && ...)` so that `full_name` is only auto-generated from `first_name`/`last_name` when it is not explicitly provided in the request body. Previously, any name change would overwrite an explicitly set `full_name`.

## Bug #34: Events date parsing breaks for some formats
- **File:** `frontend/app/admin/events/page.tsx`
- **Fix:** Replaced `event.start_date?.split('.')[0]` and `event.end_date?.split('.')[0]` with `new Date(event.start_date).toISOString().slice(0, 16)` and the same for `end_date`. The `.split('.')` approach only worked for ISO strings with fractional seconds; the new approach properly formats any valid date string to `YYYY-MM-DDTHH:mm` for `datetime-local` inputs.

## Bug #35: API routes don't set updated_at on PUT
- **Files:** All 5 PUT handlers in `app/api/admin/{faculty,students,staff,events,news}/route.ts`
- **Fix:** Added `updates.updated_at = new Date().toISOString()` to each PUT handler before the `.update()` call.

## Bug #56: Dashboard shows shell on auth edge case
- **File:** `frontend/app/admin/dashboard/page.tsx`
- **Fix:** Added a client-side auth check in the `init()` function: if `getUser()` returns no user, the page immediately redirects to `/auth/login` instead of proceeding to load stats and render the dashboard shell.

## Bug #57: Inconsistent logout across admin pages
- **Files:** `frontend/app/admin/faculty/page.tsx`, `frontend/app/admin/students/page.tsx`, `frontend/app/admin/staff/page.tsx`
- **Fix:** Added `useRouter` import and a `handleLogout` function (POST to `/auth/logout`, then redirect) to each page. Added a "Logout" button in the top-right of the header area, matching the dashboard's pattern. The header layout was changed from a single flex row to a `justify-between` layout to accommodate the button.

## Bug #58: editForm typed as any
- **Files:** `frontend/app/admin/faculty/page.tsx`, `frontend/app/admin/staff/page.tsx`
- **Fix:** Changed `useState<any>({})` to `useState<Record<string, string>>({})` for the `editForm` state in both files. The students page already used `Record<string, string>`.

---

## Notes
- All fixes were verified with `tsc --noEmit` -- no new TypeScript errors introduced.
- The news admin page was created from scratch following the same patterns as the events admin page (create/edit form, list view, delete).
- The `isAdmin()` refactor eliminates one unnecessary `createClient()` call per API request across all 5 admin routes (20 handler functions total).
