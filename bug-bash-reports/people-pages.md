# Bug Bash: People & Faculty Pages

## Summary
- **19 bugs found** (3 critical, 5 high, 7 medium, 4 low)

---

## Bugs

### [CRITICAL] Broken redirect: `/faculty` redirects to non-existent `/people/faculty`
- **File**: `/frontend/app/faculty/page.tsx:4`
- **Description**: The `/faculty` page calls `redirect('/people/faculty')`, but there is no `page.tsx` at `/app/people/faculty/`. Only `/app/people/faculty/[slug]/page.tsx` exists. This results in a 404 for anyone navigating to `/faculty` or `/people/faculty`.
- **Impact**: Users following old or external links to `/faculty` will see a 404 error instead of being directed to the people directory or faculty listing.

### [CRITICAL] Broken link in faculty profile edit form: "View public profile" points to wrong route
- **File**: `/frontend/app/faculty/profile/FacultyProfileForm.tsx:278`
- **Description**: The "View public profile" link uses `href={/people/${faculty.slug}}` which resolves to `/people/john-doe`. The correct route is `/people/faculty/john-doe`. There is no route handler at `/people/[slug]`.
- **Impact**: Faculty members editing their profile see a 404 when they click "View public profile". Directly breaks the profile editing UX.

### [CRITICAL] Student link with null slug generates broken href on faculty detail page
- **File**: `/frontend/app/people/faculty/[slug]/page.tsx:336`
- **Description**: In the "Graduate Students" section, students are rendered as `<Link href={/people/students/${student.slug}}>`. If `student.slug` is null, this produces a link to `/people/students/null`. The `slug` field on `graduate_students` is typed as `string | null` in the database. There is no null-guard before rendering the link.
- **Impact**: Clicking on a student without a slug navigates to a page that will 404 or show incorrect content.

---

### [HIGH] People directory page fetches ALL faculty (active + inactive) without filtering
- **File**: `/frontend/app/people/page.tsx:103`
- **Description**: The client-side query on the people directory page fetches `supabase.from('faculty').select('*').order('last_name')` without `.eq('active', true)`. All other entity queries (staff, students) correctly filter by `active = true`. This means inactive/departed faculty appear in the main directory, category counts, and search results.
- **Impact**: Inactive faculty members show up in the directory and inflate the faculty count displayed in the header. Users may try to contact people no longer at the department.

### [HIGH] `generateMetadata` calls `getFacultyBySlug` / `getStudentBySlug` / `getStaffBySlug` which use `createClient()` (cookie-dependent) during build
- **File**: `/frontend/app/people/faculty/[slug]/page.tsx:14-16`, `/frontend/app/people/students/[slug]/page.tsx:14-16`, `/frontend/app/people/staff/[slug]/page.tsx:14-16`
- **Description**: `generateStaticParams()` correctly uses `createStaticClient()` (via `getAllFacultySlugs()`, etc.) for build-time data fetching. However, `generateMetadata()` calls the `getXBySlug()` functions which use `createClient()` -- this requires a cookie store from Next.js `headers()`. During static generation at build time, the cookie store may not be properly available, leading to warnings or build failures depending on the Next.js version and configuration.
- **Impact**: Metadata generation may fail or produce warnings during `next build`. In the worst case, pages may be missing proper titles/descriptions in production.

### [HIGH] Inconsistent active-status filtering between `getFacultyBySlug` and `getStaffBySlug`/`getStudentBySlug`
- **File**: `/frontend/src/lib/data/faculty.ts:59-69` vs `/frontend/src/lib/data/staff.ts:35-36` vs `/frontend/src/lib/data/students.ts:88-89`
- **Description**: `getFacultyBySlug()` deliberately does NOT filter by `active` status (comment says "we want to show all faculty profiles including emeriti"). However, `getStaffBySlug()` and `getStudentBySlug()` both filter `.eq('active', true)`. Meanwhile, `getAllFacultySlugs()` generates static params for ALL faculty (active and inactive), but `getAllStaffSlugs()` and `getAllStudentSlugs()` only generate params for active members. This means:
  - An inactive staff member's page will be statically generated but return a 404 at runtime (slug exists from build, but `getStaffBySlug` returns null).
  - Actually the opposite: inactive staff/student slugs are NOT generated, so their pages are not built. But if someone navigates to an inactive staff member's URL, ISR will try to render it and `getStaffBySlug` will return null -> 404. This is the correct behavior. However, the inconsistency is still confusing and could lead to unexpected behavior if the team expects parity.
- **Impact**: Inconsistent user experience: former faculty have profile pages, but former staff and former students do not. This may be intentional but is undocumented and could confuse content editors.

### [HIGH] `research_interests` is `Json | null` in the database but unsafely cast to `string[]` in detail pages
- **File**: `/frontend/app/people/faculty/[slug]/page.tsx:38`, `/frontend/app/people/students/[slug]/page.tsx:38`
- **Description**: Both faculty and student detail pages do `const researchInterests = faculty.research_interests as string[] | null`. The database type is `Json | null`, which could be any JSON value -- an object, a number, a nested array, etc. If the data is not actually a flat `string[]`, calling `.map()` on it later could throw a runtime error or render `[object Object]` as text.
- **Impact**: If someone stores research interests in an unexpected format (e.g., objects with name/description fields), the page will either crash or display garbled text.

### [HIGH] Faculty profile form updates bypass RLS -- no server-side validation
- **File**: `/frontend/app/faculty/profile/FacultyProfileForm.tsx:56-68`
- **Description**: The profile update is performed from the browser client directly: `supabase.from('faculty').update({...}).eq('id', faculty.id)`. This relies entirely on Supabase Row Level Security (RLS) policies for authorization. If RLS policies are misconfigured or overly permissive (e.g., the anon key can update), any authenticated user could update any faculty member's record by modifying the `faculty.id` value in the browser. There is no server-side API route to validate that the authenticated user owns the profile they are updating.
- **Impact**: Potential unauthorized modification of faculty profiles if RLS is not properly configured. The `faculty.id` is passed as a prop from the server component, but a malicious user could intercept and modify the client-side request.

---

### [MEDIUM] People directory page is entirely client-rendered -- no SSR/SSG, poor SEO
- **File**: `/frontend/app/people/page.tsx:1`
- **Description**: The entire people directory page is a `'use client'` component that fetches data via `useEffect`. This means:
  1. The page sends no HTML content to crawlers -- search engines see an empty loading spinner.
  2. There is no `generateMetadata()` export (the file is a client component, so it cannot export metadata).
  3. The page has no `<title>` or `<meta description>` tag.
- **Impact**: The main people directory page is invisible to search engines. For an academic department website, the people/faculty page is one of the most important pages for SEO (prospective students searching for specific researchers).

### [MEDIUM] Card grid key collision when multiple person types share the same numeric ID
- **File**: `/frontend/app/people/page.tsx:944`
- **Description**: In the card grid view (non-"all" categories), the `ScrollReveal` key is `person.id` (a plain number). Since faculty, staff, and students have separate ID sequences, collisions are possible (e.g., faculty id=1 and student id=1). The table view correctly uses `${person.person_type}-${person.id}` as the key (line 884), but the card grid does not.
- **Impact**: React key collisions can cause incorrect DOM recycling, stale data display, or animation glitches when switching between category tabs.

### [MEDIUM] `degree_program` can be null but is rendered without guard on student detail page
- **File**: `/frontend/app/people/students/[slug]/page.tsx:83`
- **Description**: `student.degree_program` is typed as `Database["public"]["Enums"]["degree_program"] | null` but is rendered as `{student.degree_program} Student` without a null check. If `degree_program` is null, this renders as "null Student".
- **Impact**: Students without a set degree program will see "null Student" as their subtitle on the profile page.

### [MEDIUM] `staff.title` can be null but is rendered without guard on staff detail page
- **File**: `/frontend/app/people/staff/[slug]/page.tsx:90-91`
- **Description**: In the types, `staff.title` is `string | null`. The hero renders `<span>{staff.title}</span>` without a null check. If title is null, React renders nothing, but the `<Briefcase>` icon and layout wrapper are still rendered, leaving an empty space. Additionally, the "a/an" grammar logic on line 224 would throw if `staff.title` is null because it calls `.toLowerCase()` on null.
- **Impact**: For staff members without a title: the hero shows an empty line with a dangling icon, and the empty-state bio text will throw a runtime error.

### [MEDIUM] No `next/image` usage on the people directory page -- raw `<img>` tags bypass Next.js image optimization
- **File**: `/frontend/app/people/page.tsx:401-407` and `:889-894`
- **Description**: The people directory page uses raw `<img>` tags for all profile photos (both card view and table view) instead of Next.js `<Image>` component. The detail pages (faculty, student, staff) correctly use `next/image`. This means the directory page:
  1. Does not benefit from lazy loading, responsive sizing, or format optimization.
  2. Loads full-resolution images for tiny 48x48 and 96x96 thumbnails.
- **Impact**: Poor performance on the directory page, especially on mobile. Each profile photo loads at full resolution instead of being optimized for the display size.

### [MEDIUM] Advisor link on student detail page does not handle null advisor slug
- **File**: `/frontend/app/people/students/[slug]/page.tsx:348`
- **Description**: The advisor section renders `<Link href={/people/faculty/${student.advisor.slug}}>` without checking whether `student.advisor.slug` is null. The `slug` field on the faculty table is `string | null`. If the advisor has no slug, this produces a link to `/people/faculty/null`.
- **Impact**: Clicking the advisor link when the advisor has no slug leads to a 404 page.

### [MEDIUM] `getFacultyByResearchArea` in the data layer makes 3 sequential queries instead of using a join
- **File**: `/frontend/src/lib/data/faculty.ts:111-153`
- **Description**: The function first queries `research_areas` for the ID, then queries `faculty_research_areas` for faculty IDs, then queries `faculty` with those IDs. This is 3 round trips to the database. A single query using Supabase's nested selects or a database function could accomplish this in one round trip.
- **Impact**: Slower page loads for research-area-filtered faculty views. Each query adds network latency.

### [MEDIUM] `full_name` may be null in the database but is displayed without fallback in directory table view
- **File**: `/frontend/app/people/page.tsx:914`
- **Description**: In the directory table view, `{person.full_name}` is rendered directly. While the `Person` type defines `full_name: string | null`, the rendered output for a null value would be nothing (empty link text / empty span text). The card view has the same issue at line 420. The detail pages correctly use `faculty.full_name || ${faculty.first_name} ${faculty.last_name}` as a fallback.
- **Impact**: People with null `full_name` appear as blank rows in the directory with no visible name text, making them unclickable and invisible.

---

### [LOW] People directory page `'use client'` prevents layout metadata
- **File**: `/frontend/app/people/page.tsx`
- **Description**: There is no `layout.tsx` in the `/people/` directory to provide metadata for this route. Since the page itself is a client component, it cannot export metadata. A `layout.tsx` with `generateMetadata` or a `metadata` export would solve this.
- **Impact**: The `/people` page has no page title or description in the HTML head.

### [LOW] Profile form does not include `short_bio`, `research_interests`, `office_hours`, or `accepting_students` fields
- **File**: `/frontend/app/faculty/profile/FacultyProfileForm.tsx:8-23`
- **Description**: The `Faculty` interface in the form component only includes a subset of fields. Notably missing: `short_bio`, `research_interests`, `office_hours`, `accepting_students`, `accepting_students_note`. Faculty can only edit bio (mapped to `research_summary`), contact info, and external links. They cannot update their short bio, research interests tags, office hours, or student-accepting status through the self-service form.
- **Impact**: Faculty must contact an admin to update commonly-changed fields like office hours and whether they are accepting students. This reduces the utility of the self-service profile editor.

### [LOW] Faculty profile form interface type diverges from database type
- **File**: `/frontend/app/faculty/profile/FacultyProfileForm.tsx:8-23`
- **Description**: The component defines its own local `Faculty` interface instead of importing from `@/lib/supabase/types`. The local interface defines `title: string` (non-nullable) while the database type has `title: Database["public"]["Enums"]["faculty_title"]` (an enum, also non-nullable, but a different type). If the parent server component passes the full database type, TypeScript won't catch mismatches because the local interface is structurally typed and more permissive.
- **Impact**: Type safety is weakened. Future changes to the database schema may not propagate to this component.

### [LOW] `imageErrors` state in people directory uses person `id` which can collide across person types
- **File**: `/frontend/app/people/page.tsx:65`, `:336`, `:889`
- **Description**: The `imageErrors` set stores `person.id` (a number). Since faculty, staff, and students each have independent ID sequences, a faculty member with id=5 and a student with id=5 would share the same error state. If one person's image fails to load, the other person with the same numeric id would also show the fallback initials.
- **Impact**: Rare but possible: a broken image for one person could hide a working image for a different person type with the same numeric ID.

---

## Notes

- The people directory page (`/app/people/page.tsx`) is the largest single component at nearly 1000 lines. It handles data fetching, filtering, sorting, and rendering all in one client component. This makes it harder to test, debug, and optimize.
- The `research_interests` field uses `Json` type in the database, which is a very loose contract. Consider creating a dedicated `faculty_research_interests` junction table or at minimum validating the shape at the data layer before passing it to components.
- The `google_scholar` field on faculty stores a full URL. The `orcid` field stores just the identifier (which is then prefixed with `https://orcid.org/`). This inconsistency means the ORCID field would break if someone stored the full URL.
- The faculty detail page and the people directory page use different Supabase clients (server vs browser) and different query patterns. The detail page uses the server-side data layer with joins; the directory uses the browser client with raw queries. This dual-path approach increases maintenance burden and divergence risk.
- No `loading.tsx` or `error.tsx` files exist in the `/people/faculty/[slug]/`, `/people/students/[slug]/`, or `/people/staff/[slug]/` directories. Next.js streaming/suspense fallbacks are not configured for these routes.
