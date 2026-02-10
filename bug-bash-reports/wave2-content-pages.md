# Wave 2 - Content Pages Bug Bash Report

## Bug #17: DEI page resource links all point to href="#"
**File:** `frontend/app/dei/page.tsx`
**Fix:** Replaced all six placeholder `link: '#'` entries with real UCSB resource URLs:
- Disabled Students Program -> https://dsp.sa.ucsb.edu/
- Office of Diversity, Equity & Inclusion -> https://diversity.ucsb.edu/
- Counseling & Psychological Services -> https://caps.sa.ucsb.edu/
- Title IX & Sexual Harassment -> https://titleix.ucsb.edu/ (replaced "Women in Science" which had no clear UCSB URL)
- Office of the Ombuds -> https://ombuds.ucsb.edu/
- International Students & Scholars -> https://oiss.sa.ucsb.edu/
- Financial Aid Office -> https://www.finaid.ucsb.edu/

**Notes:** Replaced the vague "Women in Science" entry with "Title IX & Sexual Harassment" and "Office of the Ombuds" per the bug spec, and updated "International Student Programs" to the correct OISS office name and URL.

---

## Bug #18: DEI page "Join Our Community" button non-functional
**File:** `frontend/app/dei/page.tsx`
**Fix:** Converted the `<button>` element to an `<a>` tag with `href="mailto:eemb-web@ucsb.edu?subject=DEI%20Community%20Interest"`. Preserved all existing CSS classes.

---

## Bug #39: Research page uses hardcoded data
**File:** `frontend/app/research/layout.tsx` (new file)
**Fix:** The research page uses `'use client'` with `useState` for interactive accordion behavior, so a `metadata` export cannot be added directly to `page.tsx`. Created a `layout.tsx` in the research route with the metadata export:
```ts
export const metadata = {
  title: 'Research | EEMB',
  description: 'Explore research themes in ecology, evolution, and marine biology at UC Santa Barbara...',
}
```
**Notes:** Kept the hardcoded data in `page.tsx` as instructed since the Supabase `research_areas` table is empty. The data represents real faculty and research themes and does not change often.

---

## Bug #40: Academics page has fabricated student testimonials
**File:** `frontend/app/academics/page.tsx`
**Fix:** Replaced fabricated names with anonymous descriptors:
- "Maria Santos" -> "PhD Student"
- "James Chen" -> "Graduate Student"
- "Aisha Williams" -> "Recent PhD Graduate"

Also updated the `advisor` field to use generic research area labels instead of specific lab names (e.g., "Burkepile Lab" -> "Marine Ecology") and adjusted `year` fields accordingly.

---

## Bug #41: Contact form links to non-existent /privacy page
**File:** `frontend/src/components/ContactForm.tsx`
**Fix:** Changed `href="/privacy"` to `href="https://www.policy.ucsb.edu/terms-of-use/privacy-notification"`.

---

## Bug #42: Contact form character limit mismatch (1000 displayed vs 5000 enforced)
**Files:** `frontend/src/components/ContactForm.tsx`, `frontend/app/api/contact/route.ts`
**Fix:**
- Added `maxLength={1000}` attribute to the textarea element in `ContactForm.tsx`
- Changed the server-side validation in `route.ts` from `message.length > 5000` to `message.length > 1000`
- The UI counter already showed "X/1000 characters" so no change needed there

---

## Bug #64: In-memoriam page uses raw img instead of next/image
**File:** `frontend/app/memoriam/page.tsx`
**Fix:**
- Added `import Image from 'next/image'`
- Replaced `<img src={memorial.photo} ... className="w-full h-full object-cover" />` with `<Image src={memorial.photo} ... fill sizes="..." className="object-cover" />`
- Added `relative` to the parent div (required for `fill` layout)
- Added appropriate `sizes` attribute for responsive loading

**Notes:** Currently none of the memorial entries have a `photo` property set, so this code path is not actively rendered. The fix ensures correctness when photos are added.

---

## Bug #65: Event filter badges are non-functional
**File:** `frontend/app/events/page.tsx`
**Fix:** Removed `cursor-pointer`, `hover:border-ocean-teal/30`, and `transition-colors` classes from the event type badge `<span>` elements. These badges have no click handlers, so they should appear as static labels.

---

## Bug #66: About page uses border-gray-100 instead of border-warm-200
**File:** `frontend/app/about/page.tsx`
**Fix:** Replaced all 4 instances of `border-gray-100` with `border-warm-200` to match the design system. Affected sections: Research Centers, By the Numbers stats, Leadership cards, and Explore EEMB links.

---

## Bug #67: Give page uses @heroicons/react
**File:** `frontend/app/give/page.tsx`
**Fix:** Replaced the `@heroicons/react/24/outline` import with `lucide-react` equivalents:
- `HeartIcon` -> `Heart`
- `AcademicCapIcon` -> `GraduationCap`
- `BeakerIcon` -> `FlaskConical`
- `UsersIcon` -> `Users`
- `GlobeAltIcon` -> `Globe`
- `EnvelopeIcon` -> `Mail`
- `PhoneIcon` -> `Phone`
- `CheckCircleIcon` -> `CheckCircle`
- `ChevronDownIcon` -> `ChevronDown`
- `ChevronUpIcon` -> `ChevronUp`

Updated all references throughout the file (import + usage sites). The `@heroicons/react` package can now potentially be removed from dependencies if no other files use it.
