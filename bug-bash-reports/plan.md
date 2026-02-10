# Bug Bash Fix Plan — Wave 3

## Status
- **Wave 1** (audit): Complete — 68 bugs found
- **P0 fixes**: Complete — 7 critical bugs + 3 bonus
- **Wave 2** (fix): Complete — 55 bugs fixed, 6 deferred
- **Wave 3** (regression + deep audit): In progress

## Wave 3 Scope Splits

Focus: Verify wave 2 fixes didn't introduce regressions. Deep-dive into areas that got the most changes. Find any bugs the original audit missed.

### Scope 1: Admin Pages & API Routes (Regression Check)
- Verify all 5 admin pages render correctly, forms submit, enum dropdowns work
- Verify the new admin news page is complete and functional
- Verify isAdmin() accepts client param correctly in all 5 API routes
- Check for any new TypeScript errors, missing imports, broken JSX
- Check updated_at is being set correctly
- Check full_name auto-generation logic is correct

### Scope 2: People Pages (Regression Check)
- Verify null safety fixes don't break rendering for valid data
- Verify next/image replacements have correct props
- Verify generateMetadata try/catch returns valid metadata
- Check the /faculty redirect works
- Check imageErrors prefixed keys are consistent
- Verify active faculty filter doesn't accidentally exclude valid records

### Scope 3: Content Pages + Components (Regression Check)
- Verify DEI links are valid URLs
- Verify contact form maxLength works with the counter
- Verify heroicons→lucide migration in give page has correct icon names
- Verify useInView shared import works (check hook API matches usage in all 7 components)
- Verify Header scroll handler with useRef works correctly
- Verify TestimonialCarousel keyboard scoping works
- Verify CardEyebrow lookup object has all needed variants

### Scope 4: Auth & Cross-cutting (Regression + New Issues)
- Verify login error allowlist handles all real error strings
- Verify revalidation route timingSafeEqual works with edge cases
- Verify middleware error handling redirects correctly
- Check for any remaining security issues missed in wave 1
- Check for any new dead code, unused imports, or broken references

## Wave 3 Post-fix: Build verification + final summary
