# Bug Bash Report: Wave 4 - Components & Hooks

**Scope:** `frontend/src/components/` (33 files) and `frontend/src/hooks/` (4 files)
**Date:** 2026-02-10
**Agent:** Scope 3 - Components & Hooks

---

## Summary

Audited all 37 files across shared components and hooks. Found **15 bugs** ranging from P0 accessibility/security issues to P3 code quality items. Fixed **13 bugs** directly; 2 deferred.

### Files Audited

**Hooks (4 files):**
- `useInView.ts` - Clean, well-typed, proper cleanup
- `useReducedMotion.ts` - Clean, SSR-safe, proper listener cleanup
- `useResearchAreas.ts` - Clean, proper error handling
- `useTestimonials.ts` - Clean, proper transform types

**Components (19 files):**
- `ContactForm.tsx`, `EventCard.tsx`, `FacultyQuote.tsx`, `FeaturedFaculty.tsx`
- `FeaturedNews.tsx`, `Footer.tsx`, `GoogleAnalytics.tsx`, `Header.tsx`
- `HeroSection.tsx`, `ImpactMetrics.tsx`, `PartnersSection.tsx`
- `QuickLinks.tsx`, `QuickNav.tsx`, `ResearchAreaFilter.tsx`
- `ResearchHighlights.tsx`, `ResearchThemes.tsx`, `TestimonialCarousel.tsx`
- `TestimonialSection.tsx`, `UpcomingEvents.tsx`, `WebVitals.tsx`, `WhoWeAre.tsx`

**UI Components (10 files):**
- `AnimatedCounter.tsx`, `AnimatedSection.tsx`, `Button.tsx`, `Card.tsx`
- `EmptyState.tsx`, `ErrorBoundary.tsx`, `Loading.tsx`, `ScrollReveal.tsx`
- `SectionHeader.tsx`, `TopographicPattern.tsx`, `WaveDivider.tsx`

**Shared utility (1 file):**
- `icons/index.tsx` - Heroicons re-export (intentionally kept per project notes)

---

## Bugs Found & Fixed

### P0 - Critical

#### 1. AnimatedSection does not respect prefers-reduced-motion (Accessibility)
- **File:** `frontend/src/components/ui/AnimatedSection.tsx`
- **Issue:** `AnimatedSection` and `StaggeredChildren` use IntersectionObserver-based animations but never check `prefers-reduced-motion`. Users with vestibular disorders see forced entrance animations.
- **Fix:** Added `useReducedMotion` hook. When reduced motion is preferred, content renders immediately visible with no animation styles applied. Both `AnimatedSection` and `StaggeredChildren` updated.

#### 2. ScrollReveal does not respect prefers-reduced-motion (Accessibility)
- **File:** `frontend/src/components/ui/ScrollReveal.tsx`
- **Issue:** `ScrollReveal` and `StaggeredReveal` use IntersectionObserver-based animations but never check `prefers-reduced-motion`.
- **Fix:** Added `useReducedMotion` hook. When reduced motion is preferred, content renders immediately with no inline animation styles.

#### 3. HeroSection setTimeout memory leak (Memory Leak)
- **File:** `frontend/src/components/HeroSection.tsx`
- **Issue:** `goToSlide` and the auto-rotation interval create nested `setTimeout` calls that are never cleaned up on unmount. Fast navigation or component unmounting during a transition leaks timers that update state on unmounted components.
- **Fix:** Created a `safeTimeout` helper with a `timeoutsRef` that tracks all pending timeouts and cleans them up in a cleanup effect on unmount.

#### 4. FacultyQuote setTimeout memory leak (Memory Leak)
- **File:** `frontend/src/components/FacultyQuote.tsx`
- **Issue:** `handleDotClick` uses `setTimeout` without tracking the timer ID. If the component unmounts during the 500ms animation, the callback fires on an unmounted component. The auto-rotation interval also has the same nested setTimeout issue.
- **Fix:** Added `animationTimeoutRef` to track pending timeouts, with cleanup on unmount and on new dot clicks. Wrapped `handleDotClick` in `useCallback`.

### P1 - High

#### 5. TopographicPattern duplicate SVG pattern IDs (Rendering Bug)
- **File:** `frontend/src/components/ui/TopographicPattern.tsx`
- **Issue:** Pattern `id` was static (`topo-subtle`, `topo-ocean`, `topo-terrain`). When multiple instances with the same variant exist on a page, they share the same ID, causing the second instance to reference the first instance's pattern definition (or not render at all in some browsers).
- **Fix:** Used React's `useId()` hook to generate unique pattern IDs per instance. Also added `aria-hidden="true"` to the SVG since it's purely decorative.

#### 6. AnimatedSection ignores `as` prop (Semantic HTML Bug)
- **File:** `frontend/src/components/ui/AnimatedSection.tsx`
- **Issue:** The `as` prop accepts `'section' | 'div' | 'article' | 'aside'` but the component always renders a `<div>`. This breaks semantic HTML for pages relying on the `as="section"` or `as="article"` prop.
- **Fix:** Changed the rendered element from hardcoded `<div>` to `<Component>` (the destructured `as` prop).

#### 7. Footer social links missing target/rel attributes (Security)
- **File:** `frontend/src/components/Footer.tsx`
- **Issue:** External social media links (Facebook, Twitter, LinkedIn, YouTube) were missing `target="_blank"` and `rel="noopener noreferrer"`, causing them to navigate away from the site. Also missing accessible indication that links open in a new tab.
- **Fix:** Added `target="_blank"`, `rel="noopener noreferrer"`, and updated `aria-label` to include "(opens in new tab)".

#### 8. PartnersSection external links missing accessible indication (Accessibility)
- **File:** `frontend/src/components/PartnersSection.tsx`
- **Issue:** Partner links open in new tabs but have no accessible indication of this behavior for screen reader users.
- **Fix:** Added `aria-label` with "(opens in new tab)" text to each partner link.

### P2 - Medium

#### 9. QuickLinks uses `<a>` instead of Next.js `<Link>` (Performance/UX)
- **File:** `frontend/src/components/QuickLinks.tsx`
- **Issue:** Internal routes (`/faculty`, `/academics`, `/research`, `/alumni`) use raw `<a>` tags instead of Next.js `<Link>`, causing full page reloads instead of client-side navigation. Also used `index` as key instead of stable key.
- **Fix:** Replaced `<a>` with `<Link>`, changed key from `index` to `link.href`, added `aria-hidden="true"` to decorative icons.

#### 10. ResearchHighlights uses `<a>` instead of Next.js `<Link>` (Performance/UX)
- **File:** `frontend/src/components/ResearchHighlights.tsx`
- **Issue:** Same as above - internal routes use raw `<a>` tags. Also used `index` as key.
- **Fix:** Replaced all `<a>` with `<Link>`, changed key from `index` to `item.link`, added `aria-hidden="true"` to decorative icons.

#### 11. ContactForm success state missing ARIA attributes (Accessibility)
- **File:** `frontend/src/components/ContactForm.tsx`
- **Issue:** Success confirmation has no `role="status"` or `aria-live` attribute, so screen readers don't announce the form submission success. SVG checkmark also missing `aria-hidden="true"`.
- **Fix:** Added `role="status"` and `aria-live="polite"` to the success container. Added `aria-hidden="true"` to the decorative SVG.

#### 12. EventCard featured variant missing aria-hidden on decorative SVGs (Accessibility)
- **File:** `frontend/src/components/EventCard.tsx`
- **Issue:** Time and location icons in the featured variant are decorative but missing `aria-hidden="true"`, causing screen readers to attempt to read them.
- **Fix:** Added `aria-hidden="true"` to the clock and location SVGs.

#### 13. WebVitals uses unsafe `Function` type (TypeScript)
- **File:** `frontend/src/components/WebVitals.tsx`
- **Issue:** Uses `Function` type in a cast, which is an ESLint `@typescript-eslint/ban-types` violation and provides no type safety.
- **Fix:** Replaced `Function` with `(...args: unknown[]) => void`.

### P3 - Low

#### 14. EmptyState SVG animate does not respect reduced motion
- **File:** `frontend/src/components/ui/EmptyState.tsx`
- **Issue:** The wave animation uses SVG `<animate>` element which is not controlled by the `useReducedMotion` hook.
- **Fix:** Added an inline `<style>` tag with `@media (prefers-reduced-motion: reduce)` to disable the SVG animation. Also added `aria-hidden="true"` to the decorative wave container.

#### 15. FacultyQuote background orbs don't respect reduced motion
- **File:** `frontend/src/components/FacultyQuote.tsx`
- **Issue:** Background gradient orbs use CSS animation classes (`animate-float-slow`, `animate-float`) regardless of motion preference.
- **Fix:** Conditionally apply animation classes based on `prefersReducedMotion` state. Also added `aria-hidden="true"` to the background container.

---

## Deferred Issues

### D1. FeaturedFaculty Math.random hydration mismatch (P2)
- **File:** `frontend/src/components/FeaturedFaculty.tsx`
- **Issue:** `selectBalancedFaculty` uses `Math.random()` for shuffling inside a `useEffect`. Since data comes from `initialFaculty` prop (server-side), the selection happens client-side and won't cause hydration mismatch, but the random selection means different renders show different faculty. This is likely intentional behavior, not a bug.

### D2. ErrorBoundary exports conflicting EmptyState name (P3)
- **File:** `frontend/src/components/ui/ErrorBoundary.tsx`
- **Issue:** Exports an `EmptyState` component that conflicts with the separate `frontend/src/components/ui/EmptyState.tsx` default export. Currently neither is imported together, so no runtime issue. Could cause confusion if both are needed in the same file.

### D3. icons/index.tsx still uses @heroicons/react (P3 - Intentional)
- **File:** `frontend/src/components/icons/index.tsx`
- **Issue:** Re-exports from `@heroicons/react`. This is a known shared utility used by CalendarPageClient and is intentionally kept per project notes.

---

## Files with No Issues Found

The following files were audited and found to have no bugs:

- `frontend/src/hooks/useInView.ts` - Well-structured, proper cleanup, good TypeScript
- `frontend/src/hooks/useReducedMotion.ts` - SSR-safe, proper event listener cleanup
- `frontend/src/hooks/useResearchAreas.ts` - Proper error handling, cleanup patterns
- `frontend/src/hooks/useTestimonials.ts` - Proper type transforms
- `frontend/src/components/ImpactMetrics.tsx` - Intentionally empty (returns null)
- `frontend/src/components/ui/Button.tsx` - Well-typed, proper forwardRef, good a11y
- `frontend/src/components/ui/Card.tsx` - Good keyboard handling, proper forwardRef
- `frontend/src/components/ui/Loading.tsx` - Proper ARIA roles and sr-only text
- `frontend/src/components/ui/SectionHeader.tsx` - Clean, configurable, good semantics
- `frontend/src/components/ui/WaveDivider.tsx` - Pure presentational, no issues
- `frontend/src/components/TestimonialCarousel.tsx` - Good keyboard nav, reduced motion support
- `frontend/src/components/TestimonialSection.tsx` - Clean async server component
- `frontend/src/components/Header.tsx` - Good focus trap, escape handling, focus management
- `frontend/src/components/QuickNav.tsx` - Clean implementation
- `frontend/src/components/ResearchAreaFilter.tsx` - Good ARIA attributes, fieldset/legend usage
- `frontend/src/components/ResearchThemes.tsx` - Clean implementation
- `frontend/src/components/WhoWeAre.tsx` - Properly uses reduced motion skip
- `frontend/src/components/ui/AnimatedCounter.tsx` - Properly respects reduced motion

---

## TypeScript Verification

All changes pass `tsc --noEmit` with zero new errors. Pre-existing test file type errors (missing `@testing-library/jest-dom` types) are unrelated.
