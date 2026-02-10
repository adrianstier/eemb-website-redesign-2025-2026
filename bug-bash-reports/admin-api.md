# Bug Bash: Admin Pages & API Routes

## Summary
- 20 bugs found (2 critical, 5 high, 9 medium, 4 low)

---

## Bugs

### [CRITICAL] Missing admin news page -- dashboard links to `/admin/news` which does not exist
- **File**: `frontend/app/admin/dashboard/page.tsx:264`
- **Description**: The dashboard has a "Manage News" card linking to `/admin/news` (line 264), but there is no `frontend/app/admin/news/page.tsx` file. The API route `frontend/app/api/admin/news/route.ts` exists, but the corresponding admin UI page does not. Clicking this card will result in a 404 error.
- **Impact**: Admins cannot manage news articles through the admin interface. The feature is completely broken.

### [CRITICAL] Double Supabase client creation in every API route `isAdmin()` helper -- uses a separate client from the route handler, losing auth context
- **File**: `frontend/app/api/admin/faculty/route.ts:6-10` (same pattern in all 5 API route files)
- **Description**: The `isAdmin()` helper function creates its own `await createClient()` instance independently from the one created in the route handler. In Next.js API routes using the cookie-based Supabase server client, each call to `createClient()` creates a new server client that reads cookies at that point. While this currently works because `cookies()` returns the same store per request, it results in unnecessary duplicate Supabase client creation. More importantly, if the first `getUser()` call in the route handler triggers a token refresh that sets new cookies, the second `createClient()` inside `isAdmin()` may not pick up the refreshed tokens in certain edge cases (race conditions during token expiry). The `isAdmin` helper should accept the existing supabase client as a parameter.
- **Impact**: Potential authentication failures during token refresh edge cases; unnecessary resource overhead on every admin API request. Could lead to intermittent 403 errors that are hard to reproduce.

### [HIGH] Faculty page sends free-text title to API, but Supabase schema uses `faculty_title` enum
- **File**: `frontend/app/admin/faculty/page.tsx:216-223` and `frontend/app/api/admin/faculty/route.ts:110-111`
- **Description**: The faculty edit form uses a plain text `<input>` for the `title` field (line 216-223), allowing any arbitrary string. However, the Supabase `faculty` table defines `title` as `Database["public"]["Enums"]["faculty_title"]`, an enum restricted to values like "Professor", "Associate Professor", "Assistant Professor", etc. Sending a free-text value that doesn't match the enum will cause a Supabase insert/update error at the database level. The form should use a `<select>` dropdown constrained to the enum values.
- **Impact**: Editing faculty title with a non-enum value will silently fail with a 500 error ("Failed to update faculty"). The user gets a generic error with no indication of what went wrong.

### [HIGH] Staff page sends free-text department to API, but Supabase schema uses `department` enum
- **File**: `frontend/app/admin/staff/page.tsx:237-245` and `frontend/app/api/admin/staff/route.ts:110-111`
- **Description**: The staff edit form uses a plain text `<input>` for the `department` field (line 237-245), allowing any arbitrary string. However, the Supabase `staff` table defines `department` as `Database["public"]["Enums"]["department"]`, an enum restricted to "EEMB", "MCDB", "Joint Appointment", "Administration", "Shared". A non-enum value will cause a database error. Same issue exists for the `department` field on the faculty table.
- **Impact**: Editing staff department with a non-enum value will cause a 500 error.

### [HIGH] Student degree program select uses "Combined BS/MS" but Supabase enum is "Combined BS-MS"
- **File**: `frontend/app/admin/students/page.tsx:217`
- **Description**: The degree program `<select>` offers `<option value="Combined BS/MS">Combined BS/MS</option>`, but the Supabase `degree_program` enum is defined as `"PhD" | "MS" | "Combined BS-MS"` (with a hyphen, not a slash). Selecting "Combined BS/MS" will send a value that doesn't match the database enum, causing a database error.
- **Impact**: Students with the "Combined BS-MS" program cannot be correctly edited. Saving will fail with a 500 error.

### [HIGH] Staff search filter only checks `full_name`, not `first_name`/`last_name` -- staff without `full_name` are unfindable
- **File**: `frontend/app/admin/staff/page.tsx:118-122`
- **Description**: The staff search filter uses `member.full_name?.toLowerCase().includes(...)`. If `full_name` is null (which is valid per the schema -- it's nullable and auto-generated only on creation, not guaranteed), the optional chaining returns `undefined`, which means `undefined.includes()` is skipped but the staff member won't match the name search. By contrast, the faculty page (line 126-134) and students page (line 126-133) both use a `displayName()` function that falls back to `first_name + last_name`. Staff with null `full_name` will never appear in search results.
- **Impact**: Some staff members may be impossible to find via search, making them effectively uneditable.

### [HIGH] Staff display view renders `member.full_name` directly, which can be `null`
- **File**: `frontend/app/admin/staff/page.tsx:326`
- **Description**: Line 326 renders `{member.full_name}` directly in an `<h3>` tag. If `full_name` is null, this will render nothing (empty heading). The faculty and student pages both use a `displayName()` helper that falls back to `first_name + last_name`, but the staff page does not.
- **Impact**: Staff members without a `full_name` will show as a blank name in the list, making them unidentifiable.

### [MEDIUM] Faculty page interface types `research_interests` as `any[]` instead of `Json`
- **File**: `frontend/app/admin/faculty/page.tsx:17`
- **Description**: The `FacultyMember` interface defines `research_interests: any[] | null`. The Supabase schema defines it as `Json | null`, which can be any JSON value (string, number, boolean, object, array, or null). The code on line 64-66 calls `.join(', ')` on it, which will fail if the JSON value is not an array (e.g., if it's an object or string). Also, the `any[]` type loses type safety.
- **Impact**: If `research_interests` is stored as a non-array JSON value, the `.join()` call will throw a runtime error.

### [MEDIUM] Staff page interface types `responsibilities` as `string[]` instead of `Json`
- **File**: `frontend/app/admin/staff/page.tsx:17`
- **Description**: The `StaffMember` interface defines `responsibilities: string[] | null`. The Supabase schema defines it as `Json | null`. The code on line 63 calls `.join(', ')` on it. If the stored value is not a string array (e.g., if it's an object), this will produce unexpected results or errors.
- **Impact**: If `responsibilities` is stored as a non-array JSON value, the `.join()` call will throw a runtime error or produce garbage output.

### [MEDIUM] Faculty page edit form sends `full_name` to API, which is then overwritten by the API's auto-generation logic
- **File**: `frontend/app/admin/faculty/page.tsx:86` and `frontend/app/api/admin/faculty/route.ts:117-129`
- **Description**: The faculty edit form sends `full_name` from the form (line 86). The API route's PUT handler (lines 117-129) auto-generates `full_name` from `first_name` and `last_name` whenever either is provided. This means the user-entered `full_name` is silently overwritten. If a faculty member has a display name that differs from "first last" (e.g., includes a middle name or suffix), the user's edit to `full_name` will be lost.
- **Impact**: Users cannot set a custom display name for faculty if they also change first or last name in the same edit. Confusing UX where edits appear to not save.

### [MEDIUM] Same full_name overwrite issue in students and staff API routes
- **File**: `frontend/app/api/admin/students/route.ts:117-129`, `frontend/app/api/admin/staff/route.ts:117-129`
- **Description**: Same pattern as the faculty route -- the `full_name` field is auto-computed and overwrites user input whenever `first_name` or `last_name` is included in the update payload. Since the frontend always sends both fields, `full_name` can never be set to a custom value.
- **Impact**: Custom display names are silently overwritten on every save.

### [MEDIUM] Staff page edit sends empty strings instead of `null` for optional fields
- **File**: `frontend/app/admin/staff/page.tsx:79-93`
- **Description**: The `dataToSave` object sends raw `editForm` values without converting empty strings to `null`. For example, `title: editForm.title` will send `""` instead of `null` when the field is empty. By contrast, the faculty page (lines 91-98) and students page (lines 87-101) both use `|| null` to convert empty strings to null. This means the staff database rows will contain empty strings instead of null for optional fields, which may cause inconsistencies.
- **Impact**: Database inconsistency -- some records have `null` for empty fields, others have `""`. This can break queries that check for `IS NULL`.

### [MEDIUM] Dashboard page does not redirect on auth failure -- shows dashboard with zero counts
- **File**: `frontend/app/admin/dashboard/page.tsx:20-35`
- **Description**: The `init()` function fetches the user from Supabase but does not redirect if no user is found (line 26 only sets `userEmail` if user exists). If the middleware somehow fails to redirect (e.g., expired token between middleware check and page load), the dashboard renders with "Welcome, Admin" and zero stats, with no indication that authentication has failed. Compare with the events page (line 113-115) which explicitly redirects on 401/403.
- **Impact**: In edge cases, an unauthenticated user may see the dashboard shell (though without real data). Confusing UX.

### [MEDIUM] Events page date parsing strips timezone information with `.split('.')[0]`
- **File**: `frontend/app/admin/events/page.tsx:192-193`
- **Description**: When editing an event, `start_date` and `end_date` are processed with `.split('.')[0]` (lines 192-193). This strips everything after the first `.` including fractional seconds and timezone info. For ISO dates like `2026-02-15T10:00:00.000+00:00`, this produces `2026-02-15T10:00:00`. However, for dates without fractional seconds like `2026-02-15T10:00:00+00:00`, the split does nothing and the timezone suffix remains, which may cause the `datetime-local` input to not populate correctly (it expects `YYYY-MM-DDTHH:mm` format without timezone).
- **Impact**: Editing existing events may show incorrect or empty date fields depending on the stored date format.

### [MEDIUM] Events page uses `useRouter` import but only for logout and auth redirect -- inconsistent navigation approach
- **File**: `frontend/app/admin/events/page.tsx:4,93`
- **Description**: The events page imports `useRouter` and `createClient` from Supabase (lines 4,6) and has its own `handleLogout` function (lines 262-267). The dashboard page also has its own `handleLogout` (lines 67-72). The faculty, students, and staff pages have NO logout button and NO auth redirect handling at all. This is an inconsistent experience where some admin pages have logout and some don't.
- **Impact**: UX inconsistency. Users on faculty/students/staff pages have no way to log out without navigating back to dashboard or events.

### [MEDIUM] API routes do not set `updated_at` timestamp on PUT operations
- **File**: `frontend/app/api/admin/faculty/route.ts:132-137` (same in students, staff, events)
- **Description**: When updating records via PUT, none of the API routes set `updated_at` to the current timestamp. The Supabase schema has `updated_at: string | null` on all tables. Unless there's a database trigger handling this, the `updated_at` field will retain its old value after edits, making it impossible to tell when a record was last modified.
- **Impact**: Stale `updated_at` values -- audit trail is incomplete.

### [LOW] `editForm` typed as `any` in faculty and staff pages
- **File**: `frontend/app/admin/faculty/page.tsx:30`, `frontend/app/admin/staff/page.tsx:28`
- **Description**: `editForm` state is typed as `any` (`useState<any>({})`), losing all type safety. The students page correctly uses `Record<string, string>` which is slightly better. None of them use a proper typed interface.
- **Impact**: No compile-time type checking for form field access. Typos in field names won't be caught.

### [LOW] Faculty page interface missing `photo_url`, `accepting_students`, `department`, `joined_year`, `office_hours` fields from Supabase schema
- **File**: `frontend/app/admin/faculty/page.tsx:6-23`
- **Description**: The `FacultyMember` interface is missing several fields that exist in the Supabase `faculty` table: `photo_url`, `accepting_students`, `accepting_students_note`, `department`, `joined_year`, `office_hours`, `user_id`. While these fields may not need to be edited, they are returned by the API's `select('*')` query and discarded by the TypeScript interface.
- **Impact**: No current runtime bug, but these fields cannot be edited through the admin UI. Missing `accepting_students` is notable since prospective students check this.

### [LOW] Student page interface missing `bio` field from Supabase schema
- **File**: `frontend/app/admin/students/page.tsx:6-27`
- **Description**: The `Student` interface is missing the `bio` field (distinct from `short_bio`). The Supabase `graduate_students` table has both `bio: string | null` and `short_bio: string | null`. The admin form only edits `short_bio` and there's no way to edit the full `bio`.
- **Impact**: Graduate student full bios cannot be edited through the admin interface.

### [LOW] Staff page interface missing `joined_year`, `slug`, `photo_url`, `user_id` fields from Supabase schema
- **File**: `frontend/app/admin/staff/page.tsx:6-21`
- **Description**: The `StaffMember` interface is missing `joined_year`, `slug`, `photo_url`, and `user_id` fields from the Supabase `staff` table. These cannot be viewed or edited.
- **Impact**: These fields cannot be managed through the admin UI.

---

## Notes

1. **No localStorage auth issues found**: All admin pages use Supabase cookie-based auth. No localStorage remnants were detected.

2. **Middleware provides auth gating**: The `middleware.ts` correctly checks both authentication and admin role for `/admin` routes. This provides a baseline protection layer, so the missing client-side auth redirects in faculty/students/staff pages are mitigated (but not fully -- see the dashboard bug above about edge cases).

3. **API routes consistently check auth + admin**: All 5 API route files correctly check both `getUser()` and `isAdmin()` before processing requests. The auth model is sound at the API level despite the double-client-creation issue.

4. **No input sanitization on API routes**: None of the API routes sanitize or validate input beyond checking required fields. For example, `email` is not validated as a proper email address, `url` fields are not validated, and string lengths are not checked. While Supabase/Postgres will enforce some constraints, injection via malformed data is possible. This is mitigated by the admin-only access requirement.

5. **Unused imports**: The `useRouter` import in `frontend/app/admin/dashboard/page.tsx` is used (for logout), but the `Mic` and `Star` icons from lucide-react in the events page are used. No truly unused imports were found.

6. **No CSRF protection**: The admin API routes rely solely on cookie-based authentication. There is no CSRF token validation. While Supabase's cookie-based auth includes SameSite attributes which provide some protection, explicit CSRF tokens would add defense-in-depth.

7. **Events cancel flow uses DELETE with query params**: The cancel functionality (line 240-243 in events page) sends a DELETE request with `cancel=true` as a query parameter. Semantically this is an update (PUT), not a delete. While it works, it's a non-standard API design.
