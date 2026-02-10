# Wave 4 Bug Bash Report: Public Pages & SEO

**Date:** 2026-02-10
**Scope:** All public-facing pages in `frontend/app/` (18 routes)
**Agent:** Scope 2 - Public Pages & SEO

---

## Files Audited

### Public Pages (18 routes)
| File | Status |
|------|--------|
| `frontend/app/page.tsx` (Home) | Clean - server component with Supabase data |
| `frontend/app/about/page.tsx` | 1 bug fixed (deprecated icon) |
| `frontend/app/about/layout.tsx` | Created (missing metadata) |
| `frontend/app/research/page.tsx` | Clean - has layout.tsx for metadata |
| `frontend/app/academics/page.tsx` | 2 bugs fixed (missing `sizes` props) |
| `frontend/app/academics/layout.tsx` | Created (missing metadata) |
| `frontend/app/academics/graduate/page.tsx` | Clean |
| `frontend/app/dei/page.tsx` | 3 bugs fixed (fabricated data, off-brand colors, unescaped entities) |
| `frontend/app/dei/layout.tsx` | Created (missing metadata) |
| `frontend/app/give/page.tsx` | 1 bug fixed (off-brand colors) |
| `frontend/app/give/layout.tsx` | Created (missing metadata) |
| `frontend/app/memoriam/page.tsx` | 1 bug fixed (off-brand colors) |
| `frontend/app/memoriam/layout.tsx` | Created (missing metadata) |
| `frontend/app/contact/page.tsx` | 1 bug fixed (fabricated contact info) |
| `frontend/app/calendar/page.tsx` | Clean |
| `frontend/app/good-news/page.tsx` | Clean |
| `frontend/app/alumni/page.tsx` | Clean |
| `frontend/app/support/page.tsx` | Clean - has layout.tsx for metadata |
| `frontend/app/support/layout.tsx` | Previously created |
| `frontend/app/news/page.tsx` | Clean |
| `frontend/app/news/[slug]/page.tsx` | Clean |
| `frontend/app/people/page.tsx` | Clean |
| `frontend/app/people/layout.tsx` | Previously created |
| `frontend/app/people/faculty/[slug]/page.tsx` | Clean |
| `frontend/app/people/students/[slug]/page.tsx` | Clean |
| `frontend/app/people/staff/[slug]/page.tsx` | Clean |

---

## Bugs Found and Fixed

### P0 - Critical

#### Bug 1: Deprecated `Palmtree` icon import causes build/runtime error
- **File:** `frontend/app/about/page.tsx`
- **Issue:** The file imported `Palmtree` from `lucide-react`, which was renamed to `TreePalm` in recent versions. This icon was used in 3 places in the component. Depending on the installed lucide-react version, this would cause either a build error or a runtime crash rendering the About page.
- **Fix:** Replaced all 3 occurrences of `Palmtree` with `TreePalm` (import and 2 JSX usages).

#### Bug 2: Fabricated faculty names and emails on DEI page
- **File:** `frontend/app/dei/page.tsx`
- **Issue:** The DEI page contained 7 completely fabricated faculty names (Dr. James Wilson, Dr. Angela Martinez, Dr. Robert Chen, Dr. Lisa Wong, Dr. Patricia Johnson, Dr. Michael Torres, Dr. Carlos Rodriguez) with fake email addresses as "leaders" and "contacts" for various DEI initiatives. These people do not exist in the department. Publishing this page would be embarrassing and misleading.
- **Fix:** Removed all fabricated names and emails from the initiative data. Removed `leader` and `contact` fields from the `Initiative` interface. All initiative contact info now correctly directs to `eemb-dei@ucsb.edu`. Replaced the fabricated DEI committee chairs with the real co-chairs listed on the contact/support pages (Deron Burkepile and Cherie Briggs).

#### Bug 3: Fabricated contact information on Contact page
- **File:** `frontend/app/contact/page.tsx`
- **Issue:** The Contact page had fabricated phone numbers (e.g., 893-2100, 893-2400, 893-2500, 893-2600) and fabricated staff names/emails for several contact categories. These numbers and people don't exist.
- **Fix:** Cross-referenced with the Support page (which had verified real data) and replaced all fabricated information with real department contacts:
  - Main Office: Room 4102, (805) 893-2974, info@eemb.ucsb.edu
  - Graduate Program: Mengshu Ye, mengshuye@ucsb.edu
  - Undergraduate Program: Evelin Ambrocio-Silva, (805) 893-4622, eambrocio@lifesci.ucsb.edu
  - Academic Personnel: Rosa Vasquez, rosavasquez@ucsb.edu
  - DEI: eemb-dei@ucsb.edu, Co-Chairs Deron Burkepile & Cherie Briggs

### P1 - High

#### Bug 4: Seven pages missing SEO metadata
- **Files:** Multiple `layout.tsx` files (created)
- **Issue:** Seven client-component pages (`'use client'`) had no metadata exports, and no wrapper `layout.tsx` existed for them. Client components cannot export Next.js metadata objects, so these pages would only show the generic site-wide title from the root layout, hurting SEO and social sharing.
- **Fix:** Created `layout.tsx` files with proper `Metadata` exports for:
  - `frontend/app/about/layout.tsx` - "About | EEMB"
  - `frontend/app/academics/layout.tsx` - "Graduate Programs | EEMB"
  - `frontend/app/dei/layout.tsx` - "Diversity, Equity & Inclusion | EEMB"
  - `frontend/app/give/layout.tsx` - "Give to EEMB | UC Santa Barbara"
  - `frontend/app/memoriam/layout.tsx` - "In Memoriam | EEMB"

  (Note: `support/layout.tsx` and `people/layout.tsx` already existed with proper metadata.)

#### Bug 5: Missing `sizes` prop on `<Image fill>` components (academics page)
- **File:** `frontend/app/academics/page.tsx`
- **Issue:** Two `<Image>` components using `fill` layout lacked the `sizes` prop. Without `sizes`, Next.js generates a suboptimal `srcset` that can lead to downloading images much larger than needed on smaller screens, wasting bandwidth and hurting Core Web Vitals (LCP).
- **Fix:** Added `sizes="100vw"` to the hero image and `sizes="(max-width: 768px) 100vw, 33vw"` to the research experience card images.

### P2 - Medium (Design System Violations)

#### Bug 6: DEI page uses non-design-system colors throughout
- **File:** `frontend/app/dei/page.tsx`
- **Issue:** The entire page used generic Tailwind colors (`gray-*`, `purple-*`, `pink-*`) instead of the project's "Pacific Naturalism" design tokens (`warm-*`, `ocean-*`, `bioluminescent`). This made the page visually inconsistent with every other page on the site. Also contained a fabricated statistics section with made-up percentages (45%, 32%, 28%, 22%).
- **Fix:** Complete rewrite of the page:
  - Replaced all `gray-*` with `warm-*` equivalents
  - Replaced `purple-600` with `ocean-teal`
  - Replaced `pink-500` with `bioluminescent`
  - Replaced `from-purple-50 to-pink-50` gradients with `from-ocean-teal/5 to-bioluminescent/5`
  - Replaced `bg-gray-900` with `bg-ocean-deep`
  - Added `font-heading` to h1
  - Removed fabricated statistics section entirely
  - Fixed unescaped apostrophes (`'` to `&apos;`)
  - Added `target="_blank" rel="noopener noreferrer"` to external resource links

#### Bug 7: Memoriam page uses non-design-system colors throughout
- **File:** `frontend/app/memoriam/page.tsx`
- **Issue:** The page used generic Tailwind `gray-*` colors throughout instead of the design system tokens. Background was `bg-gray-50`, hero gradient used `gray-800/700/600`, and card text used `text-gray-600`, `text-gray-500`, `bg-gray-100`, `bg-gray-400`, etc.
- **Fix:** Replaced all non-design-system colors:
  - `bg-gray-50` -> `bg-warm-50`
  - `from-gray-800 via-gray-700 to-gray-600` -> `from-ocean-deep via-ocean-deep/90 to-ocean-deep/80`
  - `text-gray-700` -> `text-warm-700`
  - `text-gray-900` -> `text-ocean-deep`
  - `text-gray-600` -> `text-warm-600`
  - `text-gray-500` -> `text-warm-500`
  - `from-gray-200 to-gray-300` -> `from-warm-200 to-warm-200`
  - `bg-gray-400` -> `bg-warm-500`
  - `bg-gray-100` -> `bg-warm-100`
  - `bg-gray-50` -> `bg-warm-50`
  - `border-gray-400` -> `border-warm-400`

#### Bug 8: Give page uses non-design-system colors throughout
- **File:** `frontend/app/give/page.tsx`
- **Issue:** Extensive use of generic Tailwind colors: `gray-*`, `purple-*`, `green-*`, `blue-*`, `yellow-*`, `orange-*` instead of design system tokens. Backgrounds like `bg-purple-50`, `bg-green-50`, `bg-blue-50`, borders like `border-purple-500`, `border-green-500`, and text colors like `text-purple-700`, `text-green-700`, `text-yellow-900`.
- **Fix:** Replaced all non-design-system colors (~30 occurrences):
  - All `gray-*` -> `warm-*` equivalents
  - `from-purple-600 to-blue-600` -> `from-ocean-blue to-ocean-teal`
  - `from-green-600 to-teal-600` -> `from-ocean-teal to-bioluminescent`
  - `bg-purple-50` -> `bg-ocean-blue/5`
  - `border-purple-500` -> `border-ocean-blue`
  - `text-purple-700` -> `text-ocean-blue`
  - `bg-green-50` -> `bg-ocean-teal/5`
  - `border-green-500` -> `border-ocean-teal`
  - `text-green-600/700` -> `text-ocean-teal`
  - `bg-blue-50` -> `bg-ocean-blue/5`
  - `text-blue-600/700` -> `text-ocean-blue`
  - `from-blue-50 to-purple-50` -> `from-ocean-blue/5 to-ocean-teal/5`
  - `bg-yellow-50` -> `bg-ucsb-gold/10`
  - `border-yellow-500` -> `border-ucsb-gold`
  - `text-yellow-900` -> `text-ocean-deep`
  - `text-yellow-600` -> `text-ucsb-gold`
  - `from-yellow-50 to-orange-50` -> `from-ucsb-gold/10 to-ucsb-gold/5`

### P3 - Low (Deferred / Informational)

#### Observation 1: DEI page fabricated statistics removed (no replacement)
- **File:** `frontend/app/dei/page.tsx`
- **Issue:** The original page had a "By the Numbers" section with fabricated statistics (45% increase in URM representation, etc.). These were removed but not replaced with real data.
- **Recommendation:** If the department has real diversity statistics, these could be added back. For now, the section is omitted to avoid publishing false data.

#### Observation 2: Memoriam page data is hardcoded
- **File:** `frontend/app/memoriam/page.tsx`
- **Issue:** All memorial data (5 people) is hardcoded in the component. If this data needs to be managed by non-developers, it should eventually move to the CMS/Supabase backend.
- **Recommendation:** Consider creating a `memorials` table in Supabase and building an admin interface for managing memorial entries.

#### Observation 3: Give page has `href="#contact"` anchor link
- **File:** `frontend/app/give/page.tsx` (line ~248)
- **Issue:** Uses `href="#contact"` to link to the contact section. This is valid since `id="contact"` exists on the target section. No fix needed.

#### Observation 4: Contact page already had layout.tsx with metadata
- **File:** `frontend/app/contact/page.tsx`
- **Issue:** The contact page is a server component and already exports its own metadata. No layout.tsx needed.

---

## Summary

| Priority | Found | Fixed | Deferred |
|----------|-------|-------|----------|
| P0 (Critical) | 3 | 3 | 0 |
| P1 (High) | 2 | 2 | 0 |
| P2 (Medium) | 3 | 3 | 0 |
| P3 (Low) | 4 | 0 | 4 (informational) |
| **Total** | **12** | **8** | **4** |

### Files Modified
1. `frontend/app/about/page.tsx` - Fixed deprecated Palmtree icon
2. `frontend/app/about/layout.tsx` - Created for metadata
3. `frontend/app/academics/page.tsx` - Added missing `sizes` props to Images
4. `frontend/app/academics/layout.tsx` - Created for metadata
5. `frontend/app/dei/page.tsx` - Major rewrite: removed fabricated data, fixed colors, fixed entities
6. `frontend/app/dei/layout.tsx` - Created for metadata
7. `frontend/app/contact/page.tsx` - Replaced fabricated contact info with real data
8. `frontend/app/memoriam/page.tsx` - Replaced all non-design-system colors
9. `frontend/app/memoriam/layout.tsx` - Created for metadata
10. `frontend/app/give/page.tsx` - Replaced all non-design-system colors (~30 occurrences)
11. `frontend/app/give/layout.tsx` - Created for metadata

### Key Findings
- **Fabricated data was the most dangerous issue.** Both the DEI page (7 fake faculty names) and the Contact page (fake phone numbers and staff names) would have published false information if deployed. These were P0 critical fixes.
- **Design system compliance was poor on 3 pages.** The DEI, Memoriam, and Give pages all used generic Tailwind colors instead of the project's custom design tokens. This has been corrected across all three pages.
- **SEO metadata was missing on 5 pages.** Client components (`'use client'`) cannot export Next.js metadata, so wrapper `layout.tsx` files were needed. Five new layout files were created.
