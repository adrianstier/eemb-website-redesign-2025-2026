#!/usr/bin/env node

const fs = require('fs');

/**
 * PHOTO IMPORT SCRIPT
 *
 * This script matches and imports photo URLs from scraped data to the database
 * - Reads people-detailed-complete.json for photo URLs
 * - Matches by name to database records
 * - Updates photo_url field for faculty, students, and staff
 */

async function importPhotos() {
  console.log('📸 PHOTO IMPORT\n');

  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  // Read scraped data
  console.log('📖 Reading scraped data...\n');
  const scrapedPath = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/scraping/data/people-detailed-complete.json';
  const scrapedData = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));

  console.log(`Found ${scrapedData.length} people in scraped data\n`);

  // Fetch current database
  console.log('🔍 Fetching database records...\n');
  const [facultyRes, studentsRes, staffRes] = await Promise.all([
    fetch(`${API_URL}/faculties?pagination[limit]=200`),
    fetch(`${API_URL}/graduate-students?pagination[limit]=200`),
    fetch(`${API_URL}/staff-members?pagination[limit]=200`)
  ]);

  const dbFaculty = (await facultyRes.json()).data;
  const dbStudents = (await studentsRes.json()).data;
  const dbStaff = (await staffRes.json()).data;

  console.log(`Database records: ${dbFaculty.length} faculty, ${dbStudents.length} students, ${dbStaff.length} staff\n`);

  // Helper to normalize names for matching
  function normalizeName(name) {
    return name.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  // Stats
  let facultyUpdated = 0;
  let studentsUpdated = 0;
  let staffUpdated = 0;
  let noMatch = 0;
  let noPhoto = 0;

  // Process each scraped person
  console.log('🔄 Matching and updating photos...\n');

  for (const person of scrapedData) {
    const fullName = person.full_name;
    const photoUrl = person.photo_url;

    if (!fullName) continue;

    if (!photoUrl) {
      noPhoto++;
      continue;
    }

    const normalizedName = normalizeName(fullName);

    // Try to find in faculty
    let match = dbFaculty.find(f =>
      normalizeName(f.attributes.fullName || '') === normalizedName
    );

    if (match) {
      try {
        const response = await fetch(`${API_URL}/faculties/${match.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { photo_url: photoUrl } })
        });

        if (response.ok) {
          console.log(`✅ Faculty: ${fullName}`);
          facultyUpdated++;
        } else {
          console.error(`❌ Failed: ${fullName}`);
        }
      } catch (error) {
        console.error(`❌ Error: ${fullName} - ${error.message}`);
      }
      continue;
    }

    // Try to find in students
    match = dbStudents.find(s =>
      normalizeName(s.attributes.fullName || '') === normalizedName
    );

    if (match) {
      try {
        const response = await fetch(`${API_URL}/graduate-students/${match.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { photo_url: photoUrl } })
        });

        if (response.ok) {
          console.log(`✅ Student: ${fullName}`);
          studentsUpdated++;
        } else {
          console.error(`❌ Failed: ${fullName}`);
        }
      } catch (error) {
        console.error(`❌ Error: ${fullName} - ${error.message}`);
      }
      continue;
    }

    // Try to find in staff
    match = dbStaff.find(s =>
      normalizeName(s.attributes.fullName || '') === normalizedName
    );

    if (match) {
      try {
        const response = await fetch(`${API_URL}/staff-members/${match.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { photo_url: photoUrl } })
        });

        if (response.ok) {
          console.log(`✅ Staff: ${fullName}`);
          staffUpdated++;
        } else {
          console.error(`❌ Failed: ${fullName}`);
        }
      } catch (error) {
        console.error(`❌ Error: ${fullName} - ${error.message}`);
      }
      continue;
    }

    // No match found
    console.log(`⚠️  No match: ${fullName}`);
    noMatch++;
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('✨ PHOTO IMPORT COMPLETE!\n');
  console.log('📊 Summary:');
  console.log(`   Faculty photos: ${facultyUpdated}`);
  console.log(`   Student photos: ${studentsUpdated}`);
  console.log(`   Staff photos: ${staffUpdated}`);
  console.log(`   No match: ${noMatch}`);
  console.log(`   No photo in scraped data: ${noPhoto}`);
  console.log(`   Total photos imported: ${facultyUpdated + studentsUpdated + staffUpdated}`);
  console.log('='.repeat(70) + '\n');

  // Final stats
  const [finalFacultyRes, finalStudentsRes, finalStaffRes] = await Promise.all([
    fetch(`${API_URL}/faculties?pagination[limit]=200`),
    fetch(`${API_URL}/graduate-students?pagination[limit]=200`),
    fetch(`${API_URL}/staff-members?pagination[limit]=200`)
  ]);

  const finalFaculty = (await finalFacultyRes.json()).data;
  const finalStudents = (await finalStudentsRes.json()).data;
  const finalStaff = (await finalStaffRes.json()).data;

  const facultyWithPhotos = finalFaculty.filter(f => f.attributes.photo_url).length;
  const studentsWithPhotos = finalStudents.filter(s => s.attributes.photo_url).length;
  const staffWithPhotos = finalStaff.filter(s => s.attributes.photo_url).length;

  console.log('📈 Photo Coverage:');
  console.log(`   Faculty: ${facultyWithPhotos}/${finalFaculty.length} (${Math.round(facultyWithPhotos/finalFaculty.length*100)}%)`);
  console.log(`   Students: ${studentsWithPhotos}/${finalStudents.length} (${Math.round(studentsWithPhotos/finalStudents.length*100)}%)`);
  console.log(`   Staff: ${staffWithPhotos}/${finalStaff.length} (${Math.round(staffWithPhotos/finalStaff.length*100)}%)`);
  console.log(`   Overall: ${facultyWithPhotos + studentsWithPhotos + staffWithPhotos}/${finalFaculty.length + finalStudents.length + finalStaff.length} (${Math.round((facultyWithPhotos + studentsWithPhotos + staffWithPhotos)/(finalFaculty.length + finalStudents.length + finalStaff.length)*100)}%)`);
}

importPhotos().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
