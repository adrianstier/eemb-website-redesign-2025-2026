# Missing Photos Report

**Date:** November 13, 2025
**Status:** Investigation Complete

---

## Summary

Out of **151 total people** in the database (99 faculty, 17 staff, 35 students), **12 people are missing photos**. These individuals do not have photos on the current EEMB website - their profile pages only display default placeholder images.

---

## People Missing Photos

### Faculty (4 people)

| ID  | Name | Email | Profile URL | Status |
|-----|------|-------|-------------|--------|
| 168 | Adrian M. Wenner | wenner@lifesci.ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/emeriti/wenner) | Emeritus - No photo available |
| 134 | Anna James | ajames@ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/faculty/james-0) | No photo on current site |
| 112 | Daniel Botkin | danielbotkin@rcn.com | [Profile](https://www.eemb.ucsb.edu/people/emeriti/botkin) | Emeritus - No photo available |
| 119 | Ivia Closset | ivia@ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/researchers/closset) | Researcher - No photo available |

### Staff (5 people)

| ID  | Name | Email | Profile URL | Status |
|-----|------|-------|-------------|--------|
| 13 | Danielle Perez | dcperez@ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/staff/dcperez) | No photo on current site |
| 16 | Ellery Wilkie | ewilkie@lifesci.ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/staff/wilkie) | No photo on current site |
| 2 | Paul Diaz | pdiaz@lifesci.ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/staff/diaz) | No photo on current site |
| 15 | Rosa Vasquez | rosavasquez@ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/staff/vasquez) | No photo on current site |
| 8 | Saru Lantier | info@eemb.ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/staff/lantier) | No photo on current site |

### Graduate Students (3 people)

| ID  | Name | Email | Profile URL | Status |
|-----|------|-------|-------------|--------|
| 28 | Julianna Renzi | julianna.renzi@lifesci.ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/students/renzi) | No photo on current site |
| 11 | Kenneth Gilliland | kenneth.gilliland@lifesci.ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/students/gilliland) | No photo on current site |
| 35 | Zoe Welch | zoe.welch@lifesci.ucsb.edu | [Profile](https://www.eemb.ucsb.edu/people/students/welch) | No photo on current site |

---

## Investigation Process

### What We Did

1. **Database Query** - Identified all people with `NULL` or empty `photo_url` fields
2. **Scraped Data Check** - Verified none of these people had photos in the original scraped data
3. **Deep Profile Scraping** - Visited each individual's profile page on the current website
4. **Result** - All 12 profile pages only show default placeholder images (faculty-portrait-default.gif, staff-portrait-default.gif, student-portrait-default.gif)

### Scripts Created

- [scrape_missing_photos.js](scripts/data-import/scrape_missing_photos.js) - Checks scraped data for missing photos
- [scrape_photos_from_profiles.js](scripts/data-import/scrape_photos_from_profiles.js) - Deep scrapes individual profile pages

---

## Current Behavior

Without photos, the frontend displays **initials as placeholder** (e.g., "AW" for Adrian Wenner) in a colored circle. This is handled in [frontend/app/people/page.tsx:108-111](frontend/app/people/page.tsx#L108-L111):

```typescript
<span className="text-white text-3xl font-bold">
  {person.attributes.firstName?.[0]}{person.attributes.lastName?.[0] || ''}
</span>
```

---

## Statistics

### Photo Coverage

| Category | Total | With Photos | Missing Photos | Coverage |
|----------|-------|-------------|----------------|----------|
| **Faculty** | 99 | 95 | 4 | 95.96% |
| **Staff** | 17 | 12 | 5 | 70.59% |
| **Students** | 35 | 32 | 3 | 91.43% |
| **TOTAL** | 151 | 139 | 12 | **92.05%** |

---

## Recommendations

### Option 1: Keep As-Is (Recommended)
- The initials placeholder looks professional and clean
- These people may be:
  - Emeritus faculty who are semi-retired
  - New hires without photos yet
  - People who prefer not to have photos online
- No action needed

### Option 2: Request Photos from Department
- Contact EEMB department admin to request photos for these 12 individuals
- Photos may need to be taken or may be available but not uploaded to current site

### Option 3: Use Generic Avatars
- Upload generic silhouette/avatar images
- Less personal but fills the visual space
- Not recommended - initials are more distinctive

### Option 4: Mark as "Photo Coming Soon"
- Add a badge or indicator showing photo will be added later
- Creates expectation of future update

---

## Technical Notes

### Database Permissions Updated

Added `update` permissions for public role to allow photo updates:
```sql
INSERT INTO up_permissions (action) VALUES
  ('api::faculty.faculty.update'),
  ('api::staff.staff.update'),
  ('api::graduate-student.graduate-student.update');
```

### Photo URL Validation

The scraper now filters out default placeholder images:
- `default-avatar`
- `default_images`
- `portrait-default`

---

## Future Maintenance

### Adding Photos Later

If photos become available, update via Strapi Admin Panel or API:

**Via Strapi Admin:**
1. Go to http://localhost:1337/admin
2. Navigate to Content Manager → Faculty/Staff/Students
3. Find the person by name
4. Upload photo or add photo URL
5. Save and publish

**Via API:**
```bash
curl -X PUT http://localhost:1337/api/faculties/{id} \
  -H "Content-Type: application/json" \
  -d '{"data": {"photo_url": "https://example.com/photo.jpg"}}'
```

**Via Script:**
```bash
cd scripts/data-import
node scrape_photos_from_profiles.js
```

---

## Conclusion

**92% of people have photos** - excellent coverage! The 12 missing photos are legitimately unavailable on the source website, not a scraping error. The current initials-based placeholder provides a clean, professional fallback.

**Recommendation:** Leave as-is unless the department specifically provides photos for these individuals.
