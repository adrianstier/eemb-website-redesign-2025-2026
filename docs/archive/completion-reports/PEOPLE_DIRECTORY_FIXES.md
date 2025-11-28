# People Directory: Systematic Review & Fixes

## Current Issues Identified

### 1. **Filter Logic Issues**
- ✅ Faculty filter works correctly - filters by title
- ✅ Emeriti filter works correctly
- ✅ Lecturers filter works correctly
- ⚠️ "Research" professors showing in regular faculty (line 91 includes "research")
- ✅ Staff and Students filters work correctly

### 2. **Data Quality Issues from Scraping**
- Some fields have inconsistent formatting
- Need to use CSV as single source of truth
- Photos not yet imported
- Some validation errors on updates

### 3. **Display Issues**
- Profile pages need to better showcase research
- Directory cards could be cleaner
- Research interests need better display

## Systematic Fixes

### Fix 1: Refine Faculty Filter Logic

**Current Code (line 86-92):**
```typescript
people = faculty.filter(person => {
  const title = person.attributes.title?.toLowerCase() || ''
  return !title.includes('emeritus') &&
         !title.includes('lecturer') &&
         !title.includes('adjunct') &&
         (title.includes('professor') || title.includes('research'))
})
```

**Problem:** This includes "Research Professor" in regular faculty

**Solution:** Exclude "research professor" explicitly
```typescript
people = faculty.filter(person => {
  const title = person.attributes.title?.toLowerCase() || ''
  return !title.includes('emeritus') &&
         !title.includes('lecturer') &&
         !title.includes('adjunct') &&
         !title.includes('research professor') &&
         title.includes('professor')
})
```

### Fix 2: Add "Researchers" Category

Add a new tab for Research Professors:

```typescript
type CategoryTab = 'all' | 'faculty' | 'researchers' | 'adjunct' | 'emeriti' | 'lecturers' | 'staff' | 'students'
```

Add filter logic:
```typescript
} else if (activeCategory === 'researchers') {
  people = faculty.filter(person => {
    const title = person.attributes.title?.toLowerCase() || ''
    return title.includes('research professor') || title.includes('research biologist')
  })
}
```

### Fix 3: Clean Data with CSV as Source of Truth

The script `clean-and-validate-data.js` needs modification:
- Remove validation that's causing failures
- Ensure firstName/lastName parsing is correct
- Handle special characters in names properly

### Fix 4: Import Photos

Create photo matching script:
1. Check scraped JSON for photo URLs
2. Match by name to database records
3. Update `photo_url` field
4. Fall back to placeholder if no photo

### Fix 5: Enhance Profile Pages

Improvements needed:
1. **Research Showcase Section**
   - Prominent research interests display
   - Link to Google Scholar
   - Link to ORCID
   - Link to lab website

2. **Publications Section**
   - If Google Scholar link exists, show publication count/preview
   - Link to external publication page

3. **Contact Card**
   - Clean, card-based contact information
   - Office hours if available
   - Map link for office location

4. **Bio Section**
   - Well-formatted biography
   - Education background
   - Career highlights

## Implementation Order

1. ✅ **Fix Faculty Filter** - Exclude research professors from main faculty list
2. ✅ **Add Researchers Tab** - New category for research professors
3. 🔄 **Data Cleanup** - Run corrected validation script
4. 📸 **Photo Import** - Match and import photos
5. 🎨 **Profile Enhancement** - Improve profile page layout
6. ✅ **Testing** - Verify all filters work correctly

## Category Breakdown (Target State)

Based on CSV truth:

- **Faculty** (32 people): Regular professors (Professor, Associate, Assistant)
  - Excludes: Emeriti, Lecturers, Research Professors, Adjuncts

- **Researchers** (19 people): Research Professors and Research Biologists
  - All with "Research Professor" or "Research Biologist" title

- **Emeriti** (10 people): Retired professors
  - All with "Emeritus" in title

- **Lecturers** (2 people): Teaching-focused faculty
  - Senior Lecturers and Teaching Professors

- **Adjunct** (2 people): Adjunct faculty
  - All with "Adjunct" in title

- **Staff** (19 people): Administrative and support staff

- **Students** (35 people): Graduate students (PhD/MS)

**Total: 119 people**

## Data Schema Requirements

### Faculty Schema
```typescript
{
  fullName: string        // Required
  firstName: string       // Required
  lastName: string        // Required
  title: string          // Required - determines category
  email: string          // Required
  phone: string          // Optional
  office: string         // Optional
  slug: string           // Required - URL-safe name
  bio: string            // Optional - full biography
  shortBio: string       // Optional - first paragraph
  researchInterests: string[]  // Optional - array of interests
  labWebsite: string     // Optional - lab URL
  googleScholar: string  // Optional - Google Scholar URL
  orcid: string         // Optional - ORCID ID
  photo_url: string     // Optional - photo URL
}
```

### Students Schema
```typescript
{
  fullName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  office: string
  degreeProgram: string  // "PhD" or "MS"
  advisor: string        // Advisor name
  slug: string
  photo_url: string
}
```

### Staff Schema
```typescript
{
  fullName: string
  firstName: string
  lastName: string
  title: string          // Job title
  email: string
  phone: string
  office: string
  department: string
  responsibilities: string[]
  slug: string
  photo_url: string
}
```

## Next Actions

1. Update people/page.tsx with refined filters
2. Create photo import script
3. Enhance profile page layout
4. Test all categories
5. Document for future updates
