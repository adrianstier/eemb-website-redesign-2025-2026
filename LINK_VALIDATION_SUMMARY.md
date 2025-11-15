# Faculty Links Validation Summary

**Date:** November 15, 2025
**Total Links Checked:** 98
**Total Faculty:** 65

## Overall Results

- ✅ **Good Links:** 76 (78%)
- ❌ **Broken Links:** 8 (8%)
- ⚠️  **Suspicious Links:** 14 (14%)
- 📸 **Verified with Screenshots:** 75
- 🔍 **Missing Screenshots:** 1

## Broken Links (8 issues)

### Lab Websites
1. **Holly Moeller** - https://moellerlab.eemb.ucsb.edu/
   - Error: DNS not found (domain doesn't exist)

2. **Adrian Stier** - https://stierlab.eemb.ucsb.edu/
   - Error: DNS not found (domain doesn't exist)

### Google Scholar Profiles
3. **Carla D'Antonio** - HTTP 404
4. **Halley Froehlich** - HTTP 404
5. **Scott Hodges** - HTTP 404
6. **Samuel Sweet** - HTTP 404
7. **William Rice** - HTTP 404
8. **Russell Schmitt** - HTTP 404

## Suspicious Links (14 issues)

The following faculty have placeholder/policy URLs instead of actual lab websites:

1. **Carla D'Antonio** - https://www.example.com/carla-dantonio
2. **Thomas Even** - http://www.policy.ucsb.edu/terms-of-use
3. **Scott Hodges** - http://www.policy.ucsb.edu/terms-of-use
4. **Anna James** - http://www.policy.ucsb.edu/terms-of-use
5. **Armand Kuris** - http://www.policy.ucsb.edu/terms-of-use
6. **John Latto** - http://www.policy.ucsb.edu/terms-of-use
7. **Sally MacIntyre** - http://www.policy.ucsb.edu/terms-of-use
8. **Nick Nidzieko** - http://www.policy.ucsb.edu/terms-of-use
9. **Joel Rothman** - http://www.policy.ucsb.edu/terms-of-use
10. **Jackie Shay** - http://www.policy.ucsb.edu/terms-of-use
11. **Samuel Sweet** - http://www.policy.ucsb.edu/terms-of-use
12. **Audrey Thellman** - http://www.policy.ucsb.edu/terms-of-use
13. **Thomas Turner** - http://www.policy.ucsb.edu/terms-of-use
14. **Yong Zhou** - http://www.policy.ucsb.edu/terms-of-use

## ORCID Analysis

- **Total ORCID IDs in Database:** 20
- **Valid ORCID IDs:** 2 (10%)
- **Invalid/Placeholder IDs:** 18 (90%)

### Valid ORCID IDs:
1. **Deron Burkepile** - 0000-0002-0427-0484
2. **Alyson Santoro** - 0000-0003-2503-8219
   - Has external IDs: ResearcherID, Loop profile, Scopus

## Verified Links (Sample)

The following faculty have fully verified, working links with screenshots:

- **Leander Anderegg** - Lab + Google Scholar ✓
- **Cherie Briggs** - Lab + Google Scholar ✓
- **Deron Burkepile** - Lab + Google Scholar + ORCID ✓
- **Halley Froehlich** - Lab ✓
- **Gretchen Hofmann** - Lab + Google Scholar ✓
- **Débora Iglesias-Rodriguez** - Lab ✓
- **Jesús Martínez-Gómez** - Lab ✓
- **Susan J. Mazer** - Lab + Google Scholar ✓
- **Douglas McCauley** - Lab + Google Scholar ✓
- **Todd Oakley** - Lab + Google Scholar ✓
- **Ryoko Oono** - Lab + Google Scholar ✓
- **Stephen Proulx** - Lab + Google Scholar ✓
- **Alyson Santoro** - Lab + Google Scholar ✓
- **Joshua Schimel** - Lab + Google Scholar ✓
- **Lizzy Wilbanks** - Lab + Google Scholar ✓
- **Soojin Yi** - Lab ✓
- **Hillary Young** - Lab + Google Scholar ✓
- **Yong Zhou** - Google Scholar ✓

## Recommendations

### Immediate Action Required

1. **Remove broken Google Scholar links** (6 faculty)
   - These return 404 errors and should be removed from the database

2. **Remove all `policy.ucsb.edu/terms-of-use` links** (13 faculty)
   - These are not real lab websites
   - Better to have no link than a misleading link

3. **Fix DNS issues** (2 faculty)
   - Holly Moeller: moellerlab.eemb.ucsb.edu doesn't exist
   - Adrian Stier: stierlab.eemb.ucsb.edu doesn't exist
   - Need to find correct lab URLs for these faculty

4. **Remove placeholder ORCID IDs** (18 faculty)
   - Most ORCID IDs in database are fake/test data
   - Should be removed or updated with real ORCID IDs

### Files Generated

1. **link-validation-screenshots/** - 75 screenshots for visual verification
2. **link-check-report.json** - Detailed JSON report of all findings
3. **orcid-links-data.json** - ORCID API data for valid IDs

## Next Steps

1. Review screenshots in `link-validation-screenshots/` folder
2. Clean up database:
   - Remove broken Google Scholar links
   - Remove all policy.ucsb.edu links
   - Remove fake ORCID IDs
3. Search for correct lab URLs for Holly Moeller and Adrian Stier
4. Consider manual verification of remaining faculty without links
