# Wave 4 Bug Bash Report: Admin Pages & API Routes

**Date:** 2026-02-10
**Scope:** All admin pages (`frontend/app/admin/`), all admin API routes (`frontend/app/api/admin/`), contact route, revalidate route
**Agent:** Scope 1 - Admin Pages & API Routes

---

## Files Audited

### Admin Pages (7 files)
| File | Lines | Status |
|------|-------|--------|
| `frontend/app/admin/page.tsx` | 6 | Clean - simple redirect |
| `frontend/app/admin/dashboard/page.tsx` | 322 | Minor issue (P3) |
| `frontend/app/admin/faculty/page.tsx` | 457 | 3 bugs found, all fixed |
| `frontend/app/admin/students/page.tsx` | 484 | 3 bugs found, all fixed |
| `frontend/app/admin/staff/page.tsx` | 424 | 4 bugs found, all fixed |
| `frontend/app/admin/events/page.tsx` | 817 | Clean after review |
| `frontend/app/admin/news/page.tsx` | 532 | 1 bug found, fixed |

### API Routes (7 files)
| File | Lines | Status |
|------|-------|--------|
| `frontend/app/api/admin/faculty/route.ts` | 211 | 1 bug found, fixed |
| `frontend/app/api/admin/students/route.ts` | 211 | 1 bug found, fixed |
| `frontend/app/api/admin/staff/route.ts` | 211 | 1 bug found, fixed |
| `frontend/app/api/admin/events/route.ts` | 200 | 1 bug found, fixed |
| `frontend/app/api/admin/news/route.ts` | 180 | Clean |
| `frontend/app/api/contact/route.ts` | 162 | Clean |
| `frontend/app/api/revalidate/route.ts` | 142 | Clean |

---

## Bugs Found and Fixed

### P0 - Critical (Database Operation Failures)

#### Bug 1: Faculty title dropdown has invalid enum values
- **File:** `frontend/app/admin/faculty/page.tsx` (line ~237-246)
- **Issue:** The faculty title select offered "Researcher" and "Visiting Professor" which do NOT exist in the `faculty_title` database enum. Meanwhile, valid enum values "Distinguished Professor", "Research Professor", "Postdoctoral Researcher", and "Teaching Professor" were missing. Selecting invalid options would cause Supabase INSERT/UPDATE to fail with a Postgres enum constraint violation.
- **Fix:** Replaced dropdown options with exact values from the database enum type: Professor, Associate Professor, Assistant Professor, Professor Emeritus, Distinguished Professor, Research Professor, Adjunct Professor, Postdoctoral Researcher, Lecturer, Teaching Professor.

#### Bug 2: Staff department dropdown has invalid enum values
- **File:** `frontend/app/admin/staff/page.tsx` (line ~263-270)
- **Issue:** The department select offered "ERI", "MSI", "Other" which do NOT exist in the `department` database enum. The valid enum values are "EEMB", "MCDB", "Joint Appointment", "Administration", "Shared". Submitting "ERI" or "MSI" would cause a DB constraint violation.
- **Fix:** Replaced dropdown options with exact values from the database enum type.

### P1 - High (Broken UX / Incomplete Functionality)

#### Bug 3: Faculty page shows no error when data fetch fails
- **File:** `frontend/app/admin/faculty/page.tsx`
- **Issue:** When fetchFaculty() fails, only console.error fires. User sees an empty list with no indication of error.
- **Fix:** Added error state variable and red error banner in JSX.

#### Bug 4: Students page shows no error when data fetch fails
- **File:** `frontend/app/admin/students/page.tsx`
- **Issue:** Same pattern as faculty - silent failure with no user feedback.
- **Fix:** Same pattern - added error state and error banner display.

#### Bug 5: Staff page shows no error when data fetch fails
- **File:** `frontend/app/admin/staff/page.tsx`
- **Issue:** Same pattern. Additionally, the staff page had return inside the error path instead of throw, which meant loading would finish but with no error shown.
- **Fix:** Changed to throw new Error pattern consistent with other pages. Added error state and error banner display.

#### Bug 6: Inconsistent logout - Faculty page
- **File:** `frontend/app/admin/faculty/page.tsx`
- **Issue:** Used fetch('/auth/logout') which sends a server-side signout request but does NOT clear the client-side Supabase session token. Events and Dashboard pages correctly use createClient().auth.signOut().
- **Fix:** Added import of createClient from supabase/client and changed to supabase.auth.signOut().

#### Bug 7: Inconsistent logout - Students page
- **File:** `frontend/app/admin/students/page.tsx`
- **Issue:** Same as Bug 6.
- **Fix:** Same pattern.

#### Bug 8: Inconsistent logout - Staff page
- **File:** `frontend/app/admin/staff/page.tsx`
- **Issue:** Same as Bug 6.
- **Fix:** Same pattern.

#### Bug 9: Inconsistent logout - News page
- **File:** `frontend/app/admin/news/page.tsx`
- **Issue:** Same as Bug 6.
- **Fix:** Same pattern.

### P2 - Medium (Data Integrity / Missing Features)

#### Bug 10: Students handleSave missing full_name
- **File:** `frontend/app/admin/students/page.tsx` (line ~84)
- **Issue:** The handleSave function builds dataToSave WITHOUT full_name, unlike faculty and staff pages. The API only auto-generates full_name if first_name or last_name changed AND full_name is not explicitly provided. This could silently lose a manually-set full_name during edits.
- **Fix:** Added full_name generation from first_name + last_name and included it in dataToSave.

#### Bug 11: Staff save error not parsed
- **File:** `frontend/app/admin/staff/page.tsx` (line ~110)
- **Issue:** When the PUT request fails, the staff page just shows a generic alert without parsing the server error response. Faculty and students pages parse response.json() to show the specific API error message.
- **Fix:** Added error response parsing before showing alert.

#### Bug 12: Soft-delete missing updated_at - Faculty API
- **File:** `frontend/app/api/admin/faculty/route.ts` (line ~196)
- **Issue:** The soft-delete operation (active: false) does not set updated_at.
- **Fix:** Added updated_at to the update payload.

#### Bug 13: Soft-delete missing updated_at - Students API
- **File:** `frontend/app/api/admin/students/route.ts` (line ~196)
- **Issue:** Same as Bug 12 for graduate_students table.
- **Fix:** Same fix.

#### Bug 14: Soft-delete missing updated_at - Staff API
- **File:** `frontend/app/api/admin/staff/route.ts` (line ~196)
- **Issue:** Same as Bug 12 for staff table.
- **Fix:** Same fix.

#### Bug 15: Event cancel missing updated_at
- **File:** `frontend/app/api/admin/events/route.ts` (line ~172)
- **Issue:** The cancel event operation sets canceled: true and cancellation_reason but does NOT set updated_at.
- **Fix:** Added updated_at to the cancel update payload.

### P3 - Low (Code Quality / Minor Issues)

#### Bug 16: Dashboard useEffect missing router dependency (NOT FIXED)
- **File:** `frontend/app/admin/dashboard/page.tsx` (line ~40)
- **Issue:** useEffect calls router.push but the dependency array is []. This is a React lint warning but not a runtime bug since router is stable in Next.js.
- **Status:** Deferred - low risk, React lint warning only.

---

## Summary

| Severity | Found | Fixed | Deferred |
|----------|-------|-------|----------|
| P0 (Critical) | 2 | 2 | 0 |
| P1 (High) | 7 | 7 | 0 |
| P2 (Medium) | 6 | 6 | 0 |
| P3 (Low) | 1 | 0 | 1 |
| **Total** | **16** | **15** | **1** |

---

## Verification Notes

### What was already clean
- **Auth checks:** All 5 admin API routes correctly check both authentication (getUser()) and authorization (isAdmin(supabase)) on every HTTP method (GET, POST, PUT, DELETE). No gaps found.
- **PUT includes updated_at:** All 5 admin API routes correctly set updated_at on PUT operations.
- **Contact route:** Solid implementation with rate limiting, honeypot, field length validation, email format validation. No issues found.
- **Revalidate route:** Uses timing-safe comparison for token validation. Properly handles all table types. Health check endpoint included. Clean.
- **XSS vectors:** All admin pages render user data via React JSX text content which auto-escapes HTML entities. No XSS vectors found.
- **ID validation:** All DELETE handlers validate numeric IDs with parseInt + isNaN checks (already hardened in a prior wave).
- **Events and News pages:** Already had proper error state handling via saveMessage/message state patterns.

### Items requiring manual testing
1. Verify the updated faculty title dropdown values render correctly and submit successfully to the database.
2. Verify the updated staff department dropdown values render correctly and submit successfully.
3. Test logout flow from each admin page to confirm the session is fully cleared on both client and server.
4. Confirm error banners display correctly on network failure (can test by temporarily blocking /api/admin/* requests).
