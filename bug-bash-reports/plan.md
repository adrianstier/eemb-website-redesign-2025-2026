# Bug Bash Fix Plan — Wave 4

## Status
- **Wave 1** (audit): Complete — 68 bugs found
- **P0 fixes**: Complete — 7 critical bugs + 3 bonus
- **Wave 2** (fix): Complete — 55 bugs fixed, 6 deferred
- **Wave 3** (regression): Complete — 2 regressions fixed (heroicons in support page, dead footer links)
- **Wave 4** (deep audit + polish): In progress

## Wave 4 Scope Splits

Focus: Deep audit of areas not fully covered in waves 1-3. Find any remaining bugs, dead code, broken patterns, accessibility issues, or runtime errors. Each agent reads, audits, fixes, and reports.

### Scope 1: Admin Pages & API Routes (Deep Audit)
- Read every admin page and API route end-to-end
- Check for missing error states, loading states, form validation gaps
- Verify enum values match database constraints
- Check for XSS vectors in any user-input rendering
- Look for missing auth checks or authorization bypasses
- Check pagination/filtering if applicable
- Report: `bug-bash-reports/wave4-admin.md`

### Scope 2: Public Pages & SEO (Deep Audit)
- Read every public page (home, about, research, academics, dei, give, memoriam, calendar, good-news, alumni, support, contact)
- Check for hardcoded/fake data that slipped through
- Verify all external links are real URLs (not # or placeholder)
- Check metadata exports (title, description) on every page
- Check for missing alt text on images
- Look for layout/responsive issues in JSX
- Report: `bug-bash-reports/wave4-public-pages.md`

### Scope 3: Components & Hooks (Deep Audit)
- Read every shared component in src/components/
- Check for accessibility issues (missing aria labels, keyboard nav, focus management)
- Verify all imports resolve (no dangling references)
- Check for any remaining @heroicons/react imports that should be lucide
- Verify animation/scroll components handle edge cases (SSR, reduced motion)
- Check for prop type mismatches or unused props
- Report: `bug-bash-reports/wave4-components.md`

### Scope 4: Data Layer, Auth & Config (Deep Audit)
- Read all files in src/lib/ (supabase client, data queries, hooks)
- Verify middleware auth logic is correct and complete
- Check next.config.js CSP covers all actual resource origins
- Look for any remaining localhost:1337 references outside test files
- Check environment variable usage (fallbacks, missing vars)
- Verify TypeScript strict mode compliance
- Report: `bug-bash-reports/wave4-data-auth.md`

## Wave 4 Post-fix: Build verification + consolidated final summary
