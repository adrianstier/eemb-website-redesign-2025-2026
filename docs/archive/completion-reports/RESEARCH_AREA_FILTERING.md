# Research Area Filtering Implementation

## Overview
Added backend database categorization and frontend filtering for research areas (Ecology, Evolution, Marine Biology).

## Backend Changes

### Database Schema
- Added `research_areas` column to `faculties` table (TEXT type)
- Column stores comma-separated values: `ecology`, `evolution`, `marine-biology`

### Categorization
- Created `/scripts/categorize-research-areas.sql` with categorization for all 43 active faculty
- Categorization logic based on `research_interests` JSON field:
  - **Ecology**: Faculty with interests in "Ecology", "Ecosystem Ecology", "Population and Community Ecology", "Disease Ecology", etc.
  - **Evolution**: Faculty with "Evolution", "Evolutionary Ecology", "Evolutionary Genetics", "Macroevolution"
  - **Marine Biology**: Faculty with "Marine Biology", "Aquatic Biology", "Biological Oceanography"
  - Faculty can have multiple categories (e.g., "ecology,evolution,marine-biology")

### Faculty Counts by Research Area
- **Ecology**: 28 faculty
- **Evolution**: 16 faculty
- **Marine Biology**: 22 faculty

### Strapi API
- Updated schema in `/backend/src/api/faculty/content-types/faculty/schema.json`
- Added `research_areas` field (type: string, maxLength: 255)
- API now exposes research_areas in faculty endpoints

## Frontend Changes

### People Page (`/frontend/app/people/page.tsx`)
1. **Added URL Parameter Support**:
   - Imported `useSearchParams` from next/navigation
   - Reads `filter` parameter from URL (e.g., `/people?filter=ecology`)

2. **Auto-Category Selection**:
   - When research area filter is present, automatically switches to "Faculty" tab

3. **Filtering Logic**:
   - Added research area filter in `filteredAndSortedPeople` useMemo
   - Filters faculty by checking if `research_areas` contains the filter value

4. **Visual Filter Indicator**:
   - Added filter badge section that displays when a research area filter is active
   - Shows: "Filtered by research area: [Ecology/Evolution/Marine Biology]"
   - Includes clear filter button (X) to remove filter

5. **Interface Updates**:
   - Added `research_areas?: string` to Person interface

## Research Page Links

The research page (`/frontend/app/research/page.tsx`) already had the correct link format:
```typescript
<a href={`/people?filter=${area.id}`}>
  View {area.title} Faculty
</a>
```

These links now work correctly:
- `/people?filter=ecology` - Shows 28 ecology faculty
- `/people?filter=evolution` - Shows 16 evolution faculty
- `/people?filter=marine-biology` - Shows 22 marine biology faculty

## Testing

To test the implementation:
1. Visit http://localhost:3000/research
2. Click "View Ecology Faculty" (or Evolution/Marine Biology)
3. Should navigate to `/people?filter=ecology` with filtered results
4. Filter badge should appear at top showing active filter
5. Click X on filter badge to clear filter and show all faculty

## Files Modified
1. `/backend/src/api/faculty/content-types/faculty/schema.json` - Added research_areas field
2. `/frontend/app/people/page.tsx` - Added filtering logic and UI
3. `/scripts/categorize-research-areas.sql` - Created with all categorizations

## Database Commands Run
```sql
-- Add column to faculties table
ALTER TABLE faculties ADD COLUMN research_areas TEXT

-- Apply categorizations (43 UPDATE statements)
-- See scripts/categorize-research-areas.sql
```
