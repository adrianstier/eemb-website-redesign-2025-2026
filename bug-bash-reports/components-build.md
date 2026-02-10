# Bug Bash: Components & Build Health

## Summary
- **22 bugs found** (3 critical, 7 high, 8 medium, 4 low)
- **3 dead components** (never imported anywhere)
- **4 unused dependencies**
- **5 duplicate code patterns**

---

## Bugs

### [CRITICAL] `font-display` CSS class used but never defined in Tailwind config
- **Files**: Multiple components
  - `frontend/src/components/FeaturedFaculty.tsx:155,186,196,233,242`
  - `frontend/src/components/EventCard.tsx:121`
  - `frontend/src/components/TestimonialCarousel.tsx:152,157`
  - `frontend/src/components/ContactForm.tsx:155`
- **Description**: Nine component instances use `font-display` as a Tailwind CSS class (e.g., `className="font-display text-3xl ..."`), but the Tailwind config only defines `font-heading` and `font-serif` font families. There is no `display` key in `theme.extend.fontFamily`, so `font-display` resolves to nothing at build time and no font-family is applied. The heading text in these components renders in the default sans-serif font instead of the intended Fraunces heading font.
- **Impact**: Heading text in FeaturedFaculty, EventCard (featured variant), TestimonialCarousel, and ContactForm success state renders with the wrong font. This is a visual regression across multiple pages.

### [CRITICAL] `bg-kelp-50` class does not exist in Tailwind config
- **File**: `frontend/src/components/ContactForm.tsx:149`
- **Description**: The success state of ContactForm uses `bg-kelp-50` but the Tailwind config only defines `kelp.400`, `kelp.500`, and `kelp.600`. There is no `kelp.50` shade. This class will have no effect and the background will be transparent/default instead of a light green success background.
- **Impact**: Contact form success state has no visible background color, making the success message visually indistinct.

### [CRITICAL] `AnimatedSection` ignores the `as` prop entirely
- **File**: `frontend/src/components/ui/AnimatedSection.tsx:22-112`
- **Description**: The component accepts an `as` prop typed as `'section' | 'div' | 'article' | 'aside'` (line 14), but the render always uses a `<div>` element (line 94). The `Component` variable destructured from `as` (line 31) is never used as a JSX element. The `role` attribute at line 104 references `Component` for semantic role assignment, but the actual DOM element is always a `div`. This means `<AnimatedSection as="article">` renders a `<div role="article">` instead of an `<article>` element, which is semantically incorrect.
- **Impact**: Semantic HTML is broken. Screen readers may not interpret sections correctly. The `as` prop gives a false impression of control.

### [HIGH] `TestimonialSection` is dead code (server component that is never imported)
- **File**: `frontend/src/components/TestimonialSection.tsx`
- **Description**: This is an async server component that imports `getFeaturedTestimonials` from `@/lib/data` and renders `TestimonialCarousel`. However, it is never imported by any page or layout. The `TestimonialCarousel` is imported directly by `app/academics/graduate/page.tsx`. `TestimonialSection` serves no purpose and creates a confusing indirection layer.
- **Impact**: Dead code that could mislead developers. No runtime impact since it's never rendered.

### [HIGH] `ImpactMetrics` component renders `null` but is still imported
- **File**: `frontend/src/components/ImpactMetrics.tsx`
- **Description**: The component explicitly returns `null` with a comment saying "This component is now intentionally minimal - stats are in the hero. Keeping file to avoid import errors, but not displaying redundant metrics." However, grep shows no file actually imports it anymore. The component is pure dead code.
- **Impact**: Dead code with a misleading comment. Should be removed.

### [HIGH] `WebVitals` component is never imported by any page or layout
- **File**: `frontend/src/components/WebVitals.tsx`
- **Description**: The only grep match for `WebVitals` import is its own file (the dynamic `import('web-vitals')` inside it). No page, layout, or other component imports and renders `<WebVitals />`. The web-vitals metrics are never collected or reported.
- **Impact**: Core Web Vitals monitoring is not active. Performance metrics are not being sent to Google Analytics despite the infrastructure being built.

### [HIGH] Duplicate `useInView` hook defined inline in 5+ components
- **Files**:
  - `frontend/src/components/FacultyQuote.tsx:33-55`
  - `frontend/src/components/FeaturedFaculty.tsx:67-89`
  - `frontend/src/components/FeaturedNews.tsx:7-29`
  - `frontend/src/components/PartnersSection.tsx:5-27`
  - `frontend/src/components/QuickNav.tsx:54-76`
  - `frontend/src/components/ResearchThemes.tsx:40-62`
  - `frontend/src/components/UpcomingEvents.tsx:7-29`
- **Description**: Seven components define their own identical `useInView` function inline, while `frontend/src/hooks/useInView.ts` provides a properly-typed, feature-rich version (with `triggerOnce`, `rootMargin`, `skip` options). The inline versions are less capable (no `skip` for reduced motion, no `rootMargin`, typed only as `HTMLDivElement`). The `WhoWeAre` component correctly uses the shared hook. The other components should too.
- **Impact**: Code duplication increases maintenance burden. The inline hooks lack reduced motion support, so animations still trigger for users who prefer reduced motion (accessibility issue).

### [HIGH] `FacultyQuote` carousel has no reduced motion support
- **File**: `frontend/src/components/FacultyQuote.tsx:62-71`
- **Description**: The auto-rotating quote carousel uses `setInterval` unconditionally and never checks `prefers-reduced-motion`. The `HeroSection` and `TestimonialCarousel` correctly use `useReducedMotion()` to pause auto-rotation, but `FacultyQuote` does not. There is also no pause-on-hover or pause-on-focus behavior.
- **Impact**: Accessibility violation. Users with vestibular disorders may experience discomfort from the auto-rotating content. WCAG 2.1 SC 2.2.2 requires a way to pause, stop, or hide auto-updating content.

### [HIGH] Header scroll handler uses stale closure for `lastScrollY`
- **File**: `frontend/src/components/Header.tsx:24-42`
- **Description**: The scroll handler on line 25-38 references `lastScrollY` state, and the `useEffect` dependency array includes `[lastScrollY]`. This means every scroll event that changes `lastScrollY` causes the effect to re-run, removing and re-adding the scroll listener. This is a performance issue that causes excessive listener registration/deregistration on scroll.
- **Impact**: Performance degradation on scroll. The header may jitter or behave unexpectedly during rapid scrolling due to constant event listener churn.

### [HIGH] `TestimonialCarousel` keyboard handler is global, not scoped
- **File**: `frontend/src/components/TestimonialCarousel.tsx:69-80`
- **Description**: The `useEffect` adds a `window.addEventListener('keydown', ...)` for ArrowLeft/ArrowRight keys. This listener is always active regardless of whether the carousel is focused or visible. If multiple carousels exist on a page, or if the user is typing in an input, arrow keys will still navigate the carousel.
- **Impact**: Keyboard navigation conflict. Arrow keys in text inputs or other components will unexpectedly trigger carousel navigation.

### [MEDIUM] `QuickLinks` and `ResearchHighlights` use `gray-*` colors instead of design system `warm-*`
- **Files**:
  - `frontend/src/components/QuickLinks.tsx:39,54`
  - `frontend/src/components/ResearchHighlights.tsx:43,62`
- **Description**: These two components use standard Tailwind `gray-50`, `gray-600`, `gray-200`, and `blue-700` classes instead of the project's `warm-*` and `ocean-*` design system colors. They also use `text-ucsb-navy` (which is defined) but pair it with generic gray tones. This looks like earlier code that was never updated to the v4.0 design system.
- **Impact**: Visual inconsistency. These components don't match the rest of the site's warm, coastal color palette.

### [MEDIUM] `QuickLinks` links to `/faculty` and `/alumni` which likely don't exist
- **File**: `frontend/src/components/QuickLinks.tsx:17,35`
- **Description**: The component links to `/faculty` (line 17) and `/alumni` (line 35). The site's navigation and other components use `/people` for the faculty directory. There is no evidence of `/faculty` or `/alumni` routes in the app directory.
- **Impact**: Broken links (404 errors) if the component is ever rendered.

### [MEDIUM] `CardImage` does not pass `sizes` prop to `next/image`
- **File**: `frontend/src/components/ui/Card.tsx:222-238`
- **Description**: The `CardImage` component uses `<Image fill ... />` but does not accept or pass a `sizes` prop. Without `sizes`, Next.js generates suboptimal srcsets and the browser may download images larger than necessary.
- **Impact**: Larger-than-needed images downloaded, hurting performance (especially on mobile).

### [MEDIUM] `ContactForm` textarea has no `maxLength` attribute despite showing character count
- **File**: `frontend/src/components/ContactForm.tsx:285-307`
- **Description**: The textarea displays `{formData.message.length}/1000 characters` (line 305) suggesting a 1000-character limit, but there is no `maxLength={1000}` attribute on the textarea element and no validation for maximum length. Users can type unlimited text.
- **Impact**: UX misleading. The character counter suggests a limit that isn't enforced, potentially leading to form submission failures or truncated data.

### [MEDIUM] `CardEyebrow` uses dynamic Tailwind class construction that will be purged
- **File**: `frontend/src/components/ui/Card.tsx:295`
- **Description**: Line 295 constructs `from-${color === 'teal' ? 'ocean-teal' : ...}` dynamically using template literals. Tailwind CSS purges classes that aren't found as complete strings in source files. The classes `from-ocean-teal`, `from-ocean-blue`, and `from-ucsb-gold` may or may not survive purging depending on whether they appear elsewhere as complete strings.
- **Impact**: The decorative gradient line in `CardEyebrow` may be invisible in production builds if the classes get purged.

### [MEDIUM] `EmptyState` name collision between `ui/EmptyState.tsx` and `ui/ErrorBoundary.tsx`
- **Files**:
  - `frontend/src/components/ui/EmptyState.tsx` (default export: `EmptyState`)
  - `frontend/src/components/ui/ErrorBoundary.tsx:90` (named export: `EmptyState`)
- **Description**: Both files export a component named `EmptyState`. The `ErrorBoundary.tsx` exports a simpler `EmptyState` as a named export alongside `ErrorState`. The `EmptyState.tsx` file exports a more feature-rich version as the default export. Import ambiguity could cause the wrong component to be used.
- **Impact**: Developer confusion. Importing `EmptyState` could silently resolve to the wrong component depending on which file is imported.

### [MEDIUM] `SectionHeader` is a client component but has no interactive state
- **File**: `frontend/src/components/ui/SectionHeader.tsx:1`
- **Description**: The file includes `'use client'` directive but the component has no state, effects, event handlers, or browser APIs. All it does is conditionally render based on props. It could be a server component for better performance.
- **Impact**: Unnecessary JavaScript shipped to the client. The component and its dependencies are included in the client bundle when they don't need to be.

### [MEDIUM] `Footer` component is a server component (no `'use client'`) but uses `new Date().getFullYear()`
- **File**: `frontend/src/components/Footer.tsx:188`
- **Description**: The Footer has no `'use client'` directive, making it a server component. It uses `new Date().getFullYear()` which will be evaluated at build/server time. This works correctly for the copyright year use case, but if the site is statically generated and cached across year boundaries, the year could become stale.
- **Impact**: Minor. The copyright year could be stale if the page is cached across January 1st. Practically low risk.

### [LOW] `ANIMATION_DURATION.SLOW` comment says 800ms but value is 1000
- **File**: `frontend/src/lib/animationTokens.ts:24`
- **Description**: The JSDoc comment says `/** Slower reveal animations - sections scrolling into view (800ms) */` but the actual value is `SLOW: 1000`. The comment and value are out of sync.
- **Impact**: Developer confusion. Minor documentation issue.

### [LOW] `WebVitals` uses `Function` type
- **File**: `frontend/src/components/WebVitals.tsx:48`
- **Description**: Line 48 uses `typeof window & { gtag: Function }` which uses the loose `Function` type. TypeScript strict mode would flag this. The `GoogleAnalytics.tsx` file provides a proper `Window.gtag` type declaration that could be reused.
- **Impact**: Type safety gap. No runtime impact.

### [LOW] `TopographicPattern` SVG pattern IDs may collide if multiple instances with same variant
- **File**: `frontend/src/components/ui/TopographicPattern.tsx:34`
- **Description**: The SVG pattern ID is `topo-${variant}` (e.g., `topo-subtle`). If two `TopographicPattern` components with the same variant exist on the same page, they will share the same pattern ID. This is valid SVG but the second instance's pattern definition will override the first's visually.
- **Impact**: Minimal in practice since the patterns are identical for the same variant. Could cause issues if different opacity values are used.

### [LOW] `TextSkeleton` uses `Math.random()` in render which causes hydration mismatch
- **File**: `frontend/src/components/ui/Loading.tsx:291`
- **Description**: The `TextSkeleton` component uses `Math.random()` in its style calculation: `width: \`${100 - i * 10 - Math.random() * 20}%\``. Since `Math.random()` produces different values on server and client, this causes a React hydration mismatch warning in development.
- **Impact**: Console warning in development. The skeleton widths will shift slightly after hydration.

---

## Dead Components (never imported)

| Component | File | Notes |
|-----------|------|-------|
| `ImpactMetrics` | `frontend/src/components/ImpactMetrics.tsx` | Returns `null`. Comment says "keeping to avoid import errors" but nothing imports it. |
| `TestimonialSection` | `frontend/src/components/TestimonialSection.tsx` | Server component wrapper for `TestimonialCarousel`. Never used by any page. |
| `WebVitals` | `frontend/src/components/WebVitals.tsx` | Web vitals monitoring component. Built but never wired into `layout.tsx`. |
| `TopographicPattern` | `frontend/src/components/ui/TopographicPattern.tsx` | SVG pattern component. Never imported by any page or component. |
| `ErrorBoundary/ErrorState` | `frontend/src/components/ui/ErrorBoundary.tsx` | Error state component. Not imported anywhere in the app (grep for `ErrorBoundary` returns 0 results). |
| `AnimatedSection` | `frontend/src/components/ui/AnimatedSection.tsx` | Section animation wrapper. Not imported by any page or component. |

---

## Unused Dependencies

| Package | Type | Evidence |
|---------|------|----------|
| `@tanstack/react-query` | runtime | Zero imports found in `src/` or `app/`. No query client provider, no `useQuery` calls. |
| `axios` | runtime | Zero imports found in `src/` or `app/`. All HTTP calls use `fetch` or Supabase client. |
| `date-fns` | runtime | Zero imports found anywhere. All date formatting uses native `Date` methods (`.toLocaleDateString()`, `.toLocaleTimeString()`). |
| `clsx` | runtime | Zero imports found. Tailwind classes are concatenated with template literals. |
| `tailwind-merge` | runtime | Zero imports found. No `twMerge()` or `cn()` utility function exists. |

**Note**: `clsx` and `tailwind-merge` are commonly used together in a `cn()` utility. Neither is actually used despite being installed.

---

## Duplicate Code Patterns

| Pattern | Occurrences | Canonical Version |
|---------|-------------|-------------------|
| Inline `useInView` hook | 7 components | `frontend/src/hooks/useInView.ts` |
| SVG arrow-right icon | ~15 inline definitions | `frontend/src/components/ui/Button.tsx:234-238` exports `ArrowRightIcon` |
| SVG chevron-right icon | ~10 inline definitions | `frontend/src/components/ui/Button.tsx:240-243` exports `ChevronRightIcon` |
| SVG location pin icon | 3 inline definitions | Could use `LocationIcon` from `frontend/src/components/icons/index.tsx` |
| Loading spinner SVG | 2 inline definitions | `frontend/src/components/ui/Loading.tsx` provides dedicated spinner |

---

## Build Configuration Notes

### TypeScript (`tsconfig.json`)
- Strict mode is **enabled** (`"strict": true`) -- good.
- Test files produce ~100+ type errors due to missing jest-dom type augmentation. The `@testing-library/jest-dom` types are not properly configured in tsconfig.
- `FeaturedFaculty.test.tsx` has type errors where `id` fields are strings but the type expects numbers.

### Tailwind (`tailwind.config.ts`)
- Missing `font-display` in fontFamily (see critical bug above).
- Missing `kelp-50` shade in kelp color scale (see critical bug above).
- The `display` and `display-sm` font size classes (`text-display`, `text-display-sm`) are defined and work correctly. The issue is only with `font-display` (font family), not `text-display` (font size).
- Content paths include `./pages/**` and `./components/**` which don't exist at root level (content is in `./src/`). This is harmless (no files match) but misleading.

### Animation Tokens (`animationTokens.ts`)
- Well-structured with proper types.
- `SLOW` duration comment/value mismatch (800ms comment, 1000ms value).
- `getTransition` helper function is exported but never used in any component (all components use Tailwind classes or inline styles directly).

---

## Accessibility Audit Summary

| Issue | Severity | Components Affected |
|-------|----------|-------------------|
| No reduced motion support in FacultyQuote carousel | High | FacultyQuote |
| Inline `useInView` hooks lack `skip` for reduced motion | Medium | 7 components |
| Global keyboard listener in TestimonialCarousel | Medium | TestimonialCarousel |
| `AnimatedSection` renders wrong semantic element | Medium | AnimatedSection (dead code, so no runtime impact) |
| External links in Footer missing `target="_blank"` accessible text | Low | Footer (has `aria-label`, so acceptable) |

---

## Notes

- The `HeroSection` component is the most accessibility-complete component: it respects `prefers-reduced-motion`, pauses on focus/hover, uses `aria-roledescription="carousel"`, and has proper tab roles.
- The `Header` component has excellent focus trap implementation for the mobile menu.
- The shared `useInView` hook in `frontend/src/hooks/useInView.ts` is well-designed and should be adopted by the 7 components still using inline versions.
- The icons index (`frontend/src/components/icons/index.tsx`) re-exports from `@heroicons/react` but is only used by 4 files. Most components define SVG icons inline.
- The `web-vitals` package is listed in dependencies and the `WebVitals` component is built, but it is never rendered. This should either be wired into `layout.tsx` or removed.
