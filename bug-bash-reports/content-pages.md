# Bug Bash: Content Pages

## Summary
- 18 bugs found (3 critical, 6 high, 6 medium, 3 low)

---

## Bugs

### [CRITICAL] Alumni page makes live fetch to localhost:1337 Strapi API
- **File**: `frontend/app/alumni/page.tsx:37`
- **Description**: The `fetchAlumni()` function actively fetches from `http://localhost:1337/api/alumni-profiles?populate=*` on every page load. This is an uncommented, live `fetch()` call (not behind a comment like the good-news page). When the Strapi server is unavailable (which it will be in production), the fetch fails and the catch block silently falls back to hardcoded mock data with only 3 placeholder alumni profiles. Users see fake data in production without any indication it is not real.
- **Impact**: In production, the page shows fabricated alumni profiles (Jessica Martinez, David Park, Amanda Thompson) as if they are real people. Additionally, the failed network request to localhost:1337 will cause a noticeable delay before the fallback kicks in.

### [CRITICAL] News list page bypasses centralized data layer with inline Supabase query
- **File**: `frontend/app/news/page.tsx:6-46`
- **Description**: The `NewsPage` server component directly calls `createClient()` from `@/lib/supabase/server` and runs its own inline Supabase query against `news_articles`, bypassing the centralized `getAllNews()` function in `@/lib/data/news.ts`. The inline query lacks several features of the centralized version: it does not filter by `published = true`, does not order by `pinned`, does not join related faculty via `news_faculty`, and does not have proper typing. It also transforms data into a completely different shape (`NewsItem` with `date`, `imageUrl`, `topic` fields) that is incompatible with the `NewsArticle` type used elsewhere. This means unpublished articles will appear on the news listing page.
- **Impact**: Unpublished/draft news articles are visible on the production news page. Pinned articles do not appear first. Related faculty information is lost. The data transformation loses the `category` enum in favor of a crude tag-based `topic` field.

### [CRITICAL] News list page missing `revalidate` and `metadata` exports
- **File**: `frontend/app/news/page.tsx`
- **Description**: Unlike every other server-rendered page in the app (home, events, calendar, news/[slug]), the news listing page exports neither `revalidate` nor `metadata`. This means the page will be statically generated once at build time and never refreshed until the next deploy (or uses Next.js's default behavior which may cache indefinitely). All other data-fetching pages use `revalidate = 900`.
- **Impact**: New articles published to Supabase will not appear on the news listing page until the site is redeployed. SEO metadata (title, description) is also missing.

### [HIGH] Good-news page uses hardcoded mock data with commented-out Strapi fetch
- **File**: `frontend/app/good-news/page.tsx:31-141`
- **Description**: The `fetchGoodNews()` function has the actual API fetch commented out (line 34) and instead always sets hardcoded mock data. The comment references `http://localhost:1337/api/good-news` which no longer exists since the backend migrated to Supabase. The page never fetches real data and will permanently show the same 8 static entries from 2024.
- **Impact**: The "Good News" page displays fabricated data. It will never show real department achievements.

### [HIGH] Good-news page imports from potentially fragile custom icons module
- **File**: `frontend/app/good-news/page.tsx:6`
- **Description**: Imports `CalendarIcon`, `UserIcon`, `AcademicCapIcon`, `BeakerIcon`, `NewspaperIcon` from `@/components/icons`. While this file exists, it is a custom icon module separate from the lucide-react icons used everywhere else in the codebase. If the icons module is refactored or removed, this page breaks. Additionally, the page uses the old Strapi `{ id, attributes: { ... } }` data shape -- a pattern abandoned everywhere else in the codebase after the Supabase migration.
- **Impact**: Technical debt and fragility; the page is architecturally inconsistent with the rest of the site.

### [HIGH] DEI page resources all have `href="#"` placeholder links
- **File**: `frontend/app/dei/page.tsx:117-148`
- **Description**: All 6 resource links in the "Resources & Support" section have `link: '#'` as their href. These are rendered as `<a href="#">` elements, meaning clicking "Learn More" on any resource (DSP, Office of DEI, Counseling, Women in Science, International Students, Financial Aid) navigates nowhere.
- **Impact**: Users clicking resource links get no useful navigation. The page appears broken for anyone trying to access external DEI resources.

### [HIGH] DEI page "Join Our Community" button is non-functional
- **File**: `frontend/app/dei/page.tsx:375`
- **Description**: The "Join Our Community" button in the CTA section is a bare `<button>` with no `onClick` handler or `href`. It renders as an interactive element that does nothing when clicked.
- **Impact**: Users expecting to join the community via this prominent CTA get no response.

### [HIGH] Alumni page CTA buttons are non-functional
- **File**: `frontend/app/alumni/page.tsx:277-284`
- **Description**: All three CTA buttons ("Update Your Profile", "Join Alumni Directory", "Give Back") are bare `<button>` elements with no `onClick` handlers or links. They visually appear as actionable buttons but do nothing when clicked.
- **Impact**: The main call-to-action section of the alumni page is entirely non-functional.

### [HIGH] Alumni page links to non-existent spotlight pages
- **File**: `frontend/app/alumni/page.tsx:305`
- **Description**: The "Alumni Spotlights" section renders 3 placeholder cards with `Link` components pointing to `/alumni/spotlight-1`, `/alumni/spotlight-2`, and `/alumni/spotlight-3`. These routes do not exist. Additionally, the spotlight content is completely generic ("Featured Alumni Story 1", etc.) with no real data.
- **Impact**: Clicking "Read More" on any spotlight card will result in a 404 error.

### [MEDIUM] Contact form references non-existent privacy policy page
- **File**: `frontend/src/components/ContactForm.tsx:337`
- **Description**: The contact form's privacy note links to `/privacy` with the text "Privacy Policy." No `frontend/app/privacy/page.tsx` file exists, so this link leads to a 404.
- **Impact**: Users clicking the privacy policy link from the contact form get a 404 error page.

### [MEDIUM] Contact form message has no maxlength enforcement on the client
- **File**: `frontend/src/components/ContactForm.tsx:285-306`
- **Description**: The contact form displays a character counter (`{formData.message.length}/1000 characters`) suggesting a 1000-character limit, but the textarea has no `maxLength` attribute. The server-side API route allows up to 5000 characters (line 91 of `api/contact/route.ts`). The client shows "1000" but enforces nothing, and the server accepts 5x that amount.
- **Impact**: Misleading UX -- users see a 1000 char counter that does not actually limit input, and the server accepts a different limit.

### [MEDIUM] `getContactSubmissions` uses wrong return type
- **File**: `frontend/src/lib/data/contact.ts:39`
- **Description**: The `getContactSubmissions` function declares its return type as `Promise<{ submissions: TablesInsert<'contact_submissions'>[]; total: number }>` but it is actually querying existing rows (which should be `Tables<'contact_submissions'>['Row'][]` or equivalent). `TablesInsert` represents the insert shape, which has different optionality on fields compared to `Row`. For example, `id` and `created_at` are optional in `Insert` but guaranteed present in `Row`.
- **Impact**: Type unsafety -- code consuming these results may incorrectly believe fields like `id` and `created_at` are optional when they are always present in query results.

### [MEDIUM] Research page is a client component with hardcoded data instead of using Supabase
- **File**: `frontend/app/research/page.tsx:1-2`
- **Description**: The research page is marked `'use client'` and contains all research theme data hardcoded in the component (lines 11-163). The data layer has `getAllResearchAreas()`, `getFeaturedResearchAreas()`, etc. that query Supabase's `research_areas` table. The page ignores these entirely and renders static data. This means any changes to research areas in the CMS have no effect on this page.
- **Impact**: Research themes are not manageable via the CMS. The page is frozen with whatever data was hardcoded at development time. Faculty slug links in the expanded sections (e.g., `/people/faculty/burkepile`) may be wrong if faculty slugs change in the database.

### [MEDIUM] Academics page is a client component with hardcoded data
- **File**: `frontend/app/academics/page.tsx:1`
- **Description**: Similar to the research page, the academics page is `'use client'` with all data hardcoded. Student testimonials are fabricated (Maria Santos, James Chen, Aisha Williams -- not from the `student_testimonials` table). Program facts are static. The page cannot be updated via the CMS.
- **Impact**: Content cannot be managed by department staff. Student testimonials may reference non-existent people.

### [MEDIUM] In-memoriam page uses `<img>` instead of `next/image`
- **File**: `frontend/app/memoriam/page.tsx:138-140`
- **Description**: When a memorial has a photo, the page renders a raw `<img>` tag instead of `next/image`. Every other page in the codebase uses the Next.js `Image` component for optimization (lazy loading, responsive sizing, WebP conversion). The `Image` component is not even imported.
- **Impact**: Photos on the memorial page (if any are added) will not benefit from Next.js image optimization, potentially causing slower page loads and larger bandwidth usage.

### [LOW] Event type filter badges on events page are non-functional
- **File**: `frontend/app/events/page.tsx:113-122`
- **Description**: The event type badges displayed in the filter bar are rendered as plain `<span>` elements with `cursor-pointer` class and hover styles, but they have no click handler. Users will expect clicking them to filter events by type, but nothing happens.
- **Impact**: Misleading UX -- badges look interactive but are not. Users must use the calendar view or scroll to find specific event types.

### [LOW] About page uses `border-gray-100` instead of design system `border-warm-200`
- **File**: `frontend/app/about/page.tsx` (lines 177, 333, 398, 425, 530)
- **Description**: Multiple components on the about page use `border-gray-100` (Tailwind default gray) instead of the project's design system color `border-warm-200`. This is inconsistent with the rest of the site which uses the warm palette.
- **Impact**: Subtle visual inconsistency. The gray borders will look slightly different from the warm-toned borders used site-wide.

### [LOW] Give page uses `@heroicons/react` while rest of site uses `lucide-react`
- **File**: `frontend/app/give/page.tsx:5`
- **Description**: The give page imports icons from `@heroicons/react/24/outline` (HeartIcon, AcademicCapIcon, BeakerIcon, etc.) while the rest of the site consistently uses `lucide-react`. Both packages are installed, but using two different icon libraries increases bundle size and creates visual inconsistency (slightly different icon aesthetics).
- **Impact**: Increased JavaScript bundle size from shipping two icon libraries. Minor visual inconsistency in icon style between this page and others.

---

## Notes

### Pattern: Secondary pages are architecturally outdated
The secondary pages (`good-news`, `alumni`, `memoriam`, `dei`, `give`) appear to have been built during an earlier Strapi-era phase. They exhibit several common patterns that differ from the main pages:
- They use `'use client'` with `useState`/`useEffect` for data fetching instead of server components
- They use the old Strapi `{ id, attributes: { ... } }` data shape
- They use `bg-gray-50`, `text-gray-600`, etc. (Tailwind defaults) instead of the design system's warm palette
- They lack the WaveDivider, SectionHeader, and ScrollReveal components used elsewhere
- They have no `metadata` exports for SEO

These pages would benefit from being rebuilt to match the architecture of the main content pages.

### Pattern: Hardcoded data vs CMS data
Several pages hardcode data that should come from the CMS:
- `research/page.tsx` -- research themes, faculty lists, LTER sites
- `academics/page.tsx` -- student testimonials, program facts, research experiences
- `about/page.tsx` -- milestones, research centers, leadership, stats

This means CMS changes will not be reflected on these pages without code changes.

### Data layer is well-structured
The Supabase data layer (`src/lib/data/`) is well-designed with proper error handling, nested selects avoiding N+1 queries, and a clean type system. The issue is that several pages do not use it.
