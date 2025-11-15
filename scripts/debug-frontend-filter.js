#!/usr/bin/env node

/**
 * DEBUG FRONTEND FILTER
 * This replicates the exact frontend filter logic to see what's happening
 */

async function debugFilter() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Fetching data from API...\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  console.log(`Total faculty in database: ${faculty.length}\n`);

  // Apply EXACT frontend filter logic for "faculty" category
  const facultyFiltered = faculty.filter(person => {
    const title = person.attributes.title?.toLowerCase() || '';
    const result = !title.includes('emeritus') &&
           !title.includes('lecturer') &&
           !title.includes('adjunct') &&
           !title.includes('research') &&
           title.includes('professor');

    if (!result && title.includes('professor')) {
      console.log(`EXCLUDED: ${person.attributes.fullName} - "${person.attributes.title}"`);
    }

    return result;
  });

  console.log(`\n✅ Faculty after filter: ${facultyFiltered.length}\n`);

  console.log('Faculty members included:');
  const titleCounts = {};
  facultyFiltered.forEach(p => {
    const title = p.attributes.title || 'No Title';
    titleCounts[title] = (titleCounts[title] || 0) + 1;
  });
  Object.entries(titleCounts).forEach(([title, count]) => {
    console.log(`   - ${title}: ${count}`);
  });

  // Check the excluded ones
  const excluded = faculty.filter(person => {
    const title = person.attributes.title?.toLowerCase() || '';
    return title.includes('emeritus') ||
           title.includes('lecturer') ||
           title.includes('adjunct') ||
           title.includes('research') ||
           !title.includes('professor');
  });

  console.log(`\n❌ Excluded: ${excluded.length}`);
  console.log('\nExcluded people:');
  excluded.forEach(p => {
    console.log(`   - ${p.attributes.fullName}: "${p.attributes.title}"`);
  });
}

debugFilter().catch(console.error);
