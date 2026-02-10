# Wave 2 Bug Bash Report: Components & UI Fixes

**Date:** 2026-02-09
**Scope:** Frontend component-level bugs (accessibility, performance, Tailwind, hydration)

---

## Bug #24: FacultyQuote carousel has no reduced motion support

**File:** `src/components/FacultyQuote.tsx`

**Problem:** The auto-rotating carousel used `setInterval` unconditionally, ignoring the user's `prefers-reduced-motion` system setting.

**Fix:** Imported the existing `useReducedMotion` hook from `@/hooks/useReducedMotion` and wrapped the `setInterval` auto-rotation logic in a `if (prefersReducedMotion) return` guard. When reduced motion is active, the carousel stops auto-rotating but users can still manually navigate via dot buttons.

---

## Bug #45: Header scroll handler causes excessive event listener churn

**File:** `src/components/Header.tsx`

**Problem:** `lastScrollY` was stored in `useState`, which placed it in the `useEffect` dependency array. Every scroll event updated `lastScrollY`, causing the effect to re-run and re-register the scroll listener on every frame.

**Fix:** Changed `lastScrollY` from `useState` to `useRef(0)`. Updated all reads to `lastScrollYRef.current` and writes to `lastScrollYRef.current = currentScrollY`. Removed `lastScrollY` from the `useEffect` dependency array (now `[]`), so the scroll listener is registered once and never re-attached.

---

## Bug #46: TestimonialCarousel keyboard handler is global

**File:** `src/components/TestimonialCarousel.tsx`

**Problem:** Arrow key listeners were added to `window`, meaning any arrow key press anywhere on the page would trigger carousel navigation.

**Fix:** Removed the `window.addEventListener('keydown', ...)` useEffect. Added `onKeyDown` prop and `tabIndex={0}` to the carousel container `<div>` so keyboard events are scoped to the carousel only when it has focus.

---

## Bug #47: bg-kelp-50 class doesn't exist in Tailwind config

**File:** `tailwind.config.ts`

**Problem:** The `kelp` color scale only had 400, 500, and 600 shades. Usage of `bg-kelp-50` elsewhere would be purged by Tailwind.

**Fix:** Added `'50': '#ecfdf5'` to the `kelp` color object in the Tailwind config.

---

## Bug #49: CardEyebrow dynamic Tailwind class construction may be purged

**File:** `src/components/ui/Card.tsx`

**Problem:** The `CardEyebrow` component used a ternary expression inside a template literal to construct gradient class names dynamically (e.g., `` from-${...} ``). Tailwind's purge scanner cannot detect these dynamically constructed class names, so they would be removed in production builds.

**Fix:** Replaced the dynamic interpolation with a static lookup object `gradientClasses` mapping each color variant (`teal`, `blue`, `gold`) to its full gradient class string (e.g., `'from-ocean-teal to-transparent'`). All class names are now statically present in the source and will be retained by Tailwind's purge.

---

## Bug #50: Duplicate inline useInView hook in 7 components

**Files:**
- `src/components/FacultyQuote.tsx`
- `src/components/FeaturedFaculty.tsx`
- `src/components/FeaturedNews.tsx`
- `src/components/PartnersSection.tsx`
- `src/components/QuickNav.tsx`
- `src/components/ResearchThemes.tsx`
- `src/components/UpcomingEvents.tsx`

**Problem:** Each of these 7 components contained an identical inline `useInView` function definition (~20 lines each), duplicating the shared hook at `src/hooks/useInView.ts`.

**Fix:** In all 7 files:
1. Removed the inline `useInView` function definition
2. Added `import { useInView } from '@/hooks/useInView'`
3. Updated call sites from positional argument `useInView(0.1)` to the shared hook's options-object API: `useInView({ threshold: 0.1 })`
4. Cleaned up unused imports (`useRef`, `useState`, `useEffect`) where they were only needed by the inline hook

The shared hook provides additional features (triggerOnce, rootMargin, skip, hasBeenInView) that the inline versions lacked.

---

## Bug #68: TextSkeleton uses Math.random() causing hydration mismatch

**File:** `src/components/ui/Loading.tsx`

**Problem:** The `TextSkeleton` component used `Math.random()` to compute skeleton line widths. Since `Math.random()` produces different values on server vs. client, this caused React hydration mismatches.

**Fix:** Replaced `Math.random()` with a deterministic formula based on the line index: `60 + ((i * 37) % 40)`. This produces varied but consistent widths (60%, 97%, 74%, 71%, 88%, ...) that are identical between server and client renders.

---

## Summary

| Bug | Status | Type |
|-----|--------|------|
| #24 | Fixed | Accessibility |
| #45 | Fixed | Performance |
| #46 | Fixed | Accessibility / Correctness |
| #47 | Fixed | Tailwind config |
| #49 | Fixed | Build / Tailwind purge |
| #50 | Fixed | Code quality / DRY |
| #68 | Fixed | Hydration / SSR |

**Total bugs fixed:** 7
**Files modified:** 11 (10 component files + 1 config file)
**No new TypeScript errors introduced** (verified via `tsc --noEmit`)
