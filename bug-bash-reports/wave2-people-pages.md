# Wave 2: People Pages -- Null Safety & Broken Links

**Date:** 2026-02-09
**Scope:** People directory, faculty/student/staff profile pages, admin faculty page

---

## Bug #8: Broken redirect /faculty -> /people/faculty (404)
**File:** `app/faculty/page.tsx`
**Fix:** Changed `redirect('/people/faculty')` to `redirect('/people')`. The `/people/faculty` route does not exist; the people directory page at `/people` is the correct target.

## Bug #9: Broken "View public profile" link in faculty profile editor
**File:** `app/faculty/profile/FacultyProfileForm.tsx`
**Fix:** Changed href from `/people/${faculty.slug}` to `/people/faculty/${faculty.slug}`. Faculty profiles live under the `/people/faculty/` path segment.

## Bug #10: Student links with null slugs generate /people/students/null
**File:** `app/people/faculty/[slug]/page.tsx`
**Fix:** Wrapped each student entry in the "Graduate Students" section with a null guard on `student.slug`. When slug is truthy, renders as a clickable `<Link>`. When null, renders as a plain `<div>`.

## Bug #11: People directory shows inactive faculty
**File:** `app/people/page.tsx`
**Fix:** Added `.eq('active', true)` to the faculty Supabase query in `fetchAllPeople()`. Staff and students already had this filter; faculty was missing it.

## Bug #22: research_interests unsafely cast from Json to string[]
**Files:** `app/people/faculty/[slug]/page.tsx`, `app/people/students/[slug]/page.tsx`, `app/admin/faculty/page.tsx`
**Fix:** Replaced `as string[] | null` casts with a runtime check: `Array.isArray(x) ? x.filter((i): i is string => typeof i === 'string') : []`. Updated conditional rendering to match (removed null checks that are no longer needed since the value is always an array). In the admin page, added `Array.isArray()` guard before `.map()` and filtered non-string entries.

## Bug #26: Staff title can be null causing runtime error
**File:** `app/people/staff/[slug]/page.tsx`
**Fix:** Added null guards in four locations:
- Hero section: `staff.title || 'Staff'`
- Empty bio state: Wrapped the `a/an` article logic in a conditional that checks `staff.title` before calling `.toLowerCase()`
- Role section: `staff.title || 'Staff'`
- Metadata description: safe interpolation with conditional

## Bug #27: degree_program renders as "null Student"
**File:** `app/people/students/[slug]/page.tsx`
**Fix:** Changed `{student.degree_program} Student` to `{student.degree_program ? \`\${student.degree_program} \` : ''}Student` in both the hero section and the empty bio placeholder text.

## Bug #28: Advisor link doesn't handle null slug
**File:** `app/people/students/[slug]/page.tsx`
**Fix:** Refactored the advisor section to check `student.advisor.slug` before rendering. When slug is truthy, renders as a `<Link>`. When null/falsy, renders as a plain `<div>` with the same visual content.

## Bug #31: full_name null renders blank rows in people directory
**File:** `app/people/page.tsx`
**Fix:** Added fallback chain in three locations (card view h3, table view Link text, table view span text): `person.full_name || [person.first_name, person.last_name].filter(Boolean).join(' ') || 'Unknown'`.

## Bug #43: People directory uses raw img tags instead of next/image
**File:** `app/people/page.tsx`
**Fix:** Added `import Image from 'next/image'` and replaced both `<img>` tags:
- Card view: `<Image width={96} height={96} sizes="96px" ...>`
- Table view: `<Image width={48} height={48} sizes="48px" ...>`
Both retain `onError` handlers for the imageErrors fallback system.

## Bug #44: Card grid key collision
**File:** `app/people/page.tsx`
**Fix:** Changed the `ScrollReveal` wrapper key from `person.id` (numeric, could collide across faculty/staff/student) to `` `${person.person_type}-${person.id}` ``.

## Bug #48: generateMetadata uses cookie-dependent createClient during build
**Files:** `app/people/faculty/[slug]/page.tsx`, `app/people/students/[slug]/page.tsx`, `app/people/staff/[slug]/page.tsx`
**Fix:** Wrapped each `generateMetadata` function body in a try/catch. On failure (e.g., during static build when cookies are unavailable), returns a generic metadata object with a sensible title.
**Note:** A more thorough fix would create static-client variants of the `getXBySlug` data functions, but the try/catch approach prevents build failures without introducing new data layer complexity.

## Bug #63: imageErrors state collision across person types
**File:** `app/people/page.tsx`
**Fix:** Changed `imageErrors` state type from `Set<number>` to `Set<string>`. Updated `handleImageError` to accept a string key. All callers now use `` `${person.person_type}-${person.id}` `` as the key, preventing collisions between e.g. faculty id=1 and staff id=1.
