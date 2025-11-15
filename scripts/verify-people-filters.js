#!/usr/bin/env node

/**
 * FILTER VERIFICATION SCRIPT
 *
 * This script verifies that all people directory filters are working correctly
 * - Checks categorization of faculty, researchers, emeriti, lecturers, adjuncts
 * - Verifies student and staff counts
 * - Reports any miscategorized people
 */

async function verifyFilters() {
  console.log('🔍 PEOPLE DIRECTORY FILTER VERIFICATION\n');

  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  // Fetch all data
  console.log('📖 Fetching all data...\n');
  const [facultyRes, studentsRes, staffRes] = await Promise.all([
    fetch(`${API_URL}/faculties?pagination[limit]=200`),
    fetch(`${API_URL}/graduate-students?pagination[limit]=200`),
    fetch(`${API_URL}/staff-members?pagination[limit]=200`)
  ]);

  const faculty = (await facultyRes.json()).data;
  const students = (await studentsRes.json()).data;
  const staff = (await staffRes.json()).data;

  console.log(`Total Database: ${faculty.length} faculty, ${students.length} students, ${staff.length} staff\n`);

  // Apply filter logic from frontend
  const regularFaculty = faculty.filter(person => {
    const title = person.attributes.title?.toLowerCase() || '';
    return !title.includes('emeritus') &&
           !title.includes('lecturer') &&
           !title.includes('adjunct') &&
           !title.includes('research') &&
           title.includes('professor');
  });

  const researchers = faculty.filter(person => {
    const title = person.attributes.title?.toLowerCase() || '';
    return title.includes('research professor') || title.includes('research biologist');
  });

  const adjuncts = faculty.filter(person =>
    person.attributes.title?.toLowerCase().includes('adjunct')
  );

  const emeriti = faculty.filter(person =>
    person.attributes.title?.toLowerCase().includes('emeritus')
  );

  const lecturers = faculty.filter(person => {
    const title = person.attributes.title?.toLowerCase() || '';
    return title.includes('lecturer') || title.includes('teaching professor');
  });

  // Display results
  console.log('=' .repeat(70));
  console.log('📊 FILTER RESULTS\n');

  console.log(`✅ Regular Faculty: ${regularFaculty.length}`);
  if (regularFaculty.length > 0) {
    console.log('   Titles:');
    const titleCounts = {};
    regularFaculty.forEach(p => {
      const title = p.attributes.title || 'No Title';
      titleCounts[title] = (titleCounts[title] || 0) + 1;
    });
    Object.entries(titleCounts).forEach(([title, count]) => {
      console.log(`   - ${title}: ${count}`);
    });
  }

  console.log(`\n✅ Researchers: ${researchers.length}`);
  if (researchers.length > 0) {
    console.log('   Titles:');
    const titleCounts = {};
    researchers.forEach(p => {
      const title = p.attributes.title || 'No Title';
      titleCounts[title] = (titleCounts[title] || 0) + 1;
    });
    Object.entries(titleCounts).forEach(([title, count]) => {
      console.log(`   - ${title}: ${count}`);
    });
  }

  console.log(`\n✅ Adjuncts: ${adjuncts.length}`);
  if (adjuncts.length > 0) {
    adjuncts.forEach(p => {
      console.log(`   - ${p.attributes.fullName}: ${p.attributes.title}`);
    });
  }

  console.log(`\n✅ Emeriti: ${emeriti.length}`);
  if (emeriti.length > 0) {
    const titleCounts = {};
    emeriti.forEach(p => {
      const title = p.attributes.title || 'No Title';
      titleCounts[title] = (titleCounts[title] || 0) + 1;
    });
    Object.entries(titleCounts).forEach(([title, count]) => {
      console.log(`   - ${title}: ${count}`);
    });
  }

  console.log(`\n✅ Lecturers: ${lecturers.length}`);
  if (lecturers.length > 0) {
    lecturers.forEach(p => {
      console.log(`   - ${p.attributes.fullName}: ${p.attributes.title}`);
    });
  }

  console.log(`\n✅ Students: ${students.length}`);
  console.log(`✅ Staff: ${staff.length}`);

  // Check for miscategorized people
  console.log('\n' + '='.repeat(70));
  console.log('🔎 CHECKING FOR ISSUES\n');

  let issues = 0;

  // Check: No overlap between regular faculty and researchers
  const facultyNames = new Set(regularFaculty.map(p => p.attributes.fullName));
  const researcherNames = new Set(researchers.map(p => p.attributes.fullName));
  const overlap = [...facultyNames].filter(name => researcherNames.has(name));

  if (overlap.length > 0) {
    console.log(`⚠️  OVERLAP between Faculty and Researchers: ${overlap.length}`);
    overlap.forEach(name => console.log(`   - ${name}`));
    issues++;
  } else {
    console.log('✅ No overlap between Faculty and Researchers');
  }

  // Check: All faculty members should be in at least one category
  const allCategorized = new Set([
    ...regularFaculty.map(p => p.id),
    ...researchers.map(p => p.id),
    ...adjuncts.map(p => p.id),
    ...emeriti.map(p => p.id),
    ...lecturers.map(p => p.id)
  ]);

  const uncategorized = faculty.filter(p => !allCategorized.has(p.id));

  if (uncategorized.length > 0) {
    console.log(`\n⚠️  UNCATEGORIZED faculty: ${uncategorized.length}`);
    uncategorized.forEach(p => {
      console.log(`   - ${p.attributes.fullName}: "${p.attributes.title}"`);
    });
    issues++;
  } else {
    console.log('✅ All faculty members are categorized');
  }

  // Photo coverage
  console.log('\n' + '='.repeat(70));
  console.log('📸 PHOTO COVERAGE\n');

  const facultyWithPhotos = faculty.filter(f => f.attributes.photo_url).length;
  const studentsWithPhotos = students.filter(s => s.attributes.photo_url).length;
  const staffWithPhotos = staff.filter(s => s.attributes.photo_url).length;

  console.log(`Faculty: ${facultyWithPhotos}/${faculty.length} (${Math.round(facultyWithPhotos/faculty.length*100)}%)`);
  console.log(`Students: ${studentsWithPhotos}/${students.length} (${Math.round(studentsWithPhotos/students.length*100)}%)`);
  console.log(`Staff: ${staffWithPhotos}/${staff.length} (${Math.round(staffWithPhotos/staff.length*100)}%)`);
  console.log(`Overall: ${facultyWithPhotos + studentsWithPhotos + staffWithPhotos}/${faculty.length + students.length + staff.length} (${Math.round((facultyWithPhotos + studentsWithPhotos + staffWithPhotos)/(faculty.length + students.length + staff.length)*100)}%)`);

  // Research interests coverage
  console.log('\n' + '='.repeat(70));
  console.log('🔬 RESEARCH INTERESTS COVERAGE\n');

  const facultyWithInterests = faculty.filter(f => f.attributes.researchInterests && f.attributes.researchInterests.length > 0).length;
  console.log(`Faculty with research interests: ${facultyWithInterests}/${faculty.length} (${Math.round(facultyWithInterests/faculty.length*100)}%)`);

  // Summary
  console.log('\n' + '='.repeat(70));
  if (issues === 0) {
    console.log('✨ ALL FILTERS WORKING CORRECTLY!');
  } else {
    console.log(`⚠️  Found ${issues} issue(s) - please review above`);
  }
  console.log('='.repeat(70) + '\n');

  // Expected counts from PEOPLE_DIRECTORY_FIXES.md
  console.log('📋 EXPECTED vs ACTUAL:\n');
  console.log(`Faculty:     Expected ~34, Actual ${regularFaculty.length}`);
  console.log(`Researchers: Expected ~19, Actual ${researchers.length}`);
  console.log(`Emeriti:     Expected ~10, Actual ${emeriti.length}`);
  console.log(`Lecturers:   Expected ~2,  Actual ${lecturers.length}`);
  console.log(`Adjunct:     Expected ~2,  Actual ${adjuncts.length}`);
  console.log(`Staff:       Expected ~19, Actual ${staff.length}`);
  console.log(`Students:    Expected ~35, Actual ${students.length}`);
  console.log(`\nTotal:       Expected 119, Actual ${faculty.length + students.length + staff.length}`);
}

verifyFilters().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
