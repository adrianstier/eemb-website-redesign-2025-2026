#!/usr/bin/env node

/**
 * Comprehensive People Database Import Script
 *
 * This script imports all 122 people from the scraped data into Strapi:
 * - Faculty (39) -> faculties
 * - Staff (19) -> staff-members
 * - Students (35) -> graduate-students
 * - Emeriti (22) -> faculties (with active=false)
 * - Adjunct (2) -> faculties
 * - Researchers (5) -> faculties or staff based on title
 */

const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || ''; // Set this if needed
const DATA_FILE = path.join(__dirname, '../../scraping/data/people-detailed-complete.json');

// Read the scraped data
console.log('📖 Reading scraped people data...');
const peopleData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
console.log(`✅ Loaded ${peopleData.length} people from scraped data\n`);

// Statistics
const stats = {
  faculty: { total: 0, imported: 0, skipped: 0, errors: 0 },
  staff: { total: 0, imported: 0, skipped: 0, errors: 0 },
  students: { total: 0, imported: 0, skipped: 0, errors: 0 },
  total: peopleData.length
};

/**
 * Split full name into first and last name
 */
function splitName(fullName) {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  const firstName = parts.slice(0, -1).join(' ');
  const lastName = parts[parts.length - 1];
  return { firstName, lastName };
}

/**
 * Determine the faculty title based on category and scraped data
 */
function determineFacultyTitle(person) {
  if (person.category === 'Emeriti') {
    return 'Professor Emeritus';
  }
  if (person.category === 'Adjunct') {
    return 'Research Professor'; // Adjuncts are typically research faculty
  }
  if (person.category === 'Researcher') {
    return 'Research Professor';
  }
  // Default for active faculty - you may want to scrape this from their profile
  return 'Professor';
}

/**
 * Import a person as faculty
 */
async function importAsFaculty(person) {
  const { firstName, lastName } = splitName(person.full_name);

  const facultyData = {
    data: {
      firstName,
      lastName,
      fullName: person.full_name,
      title: determineFacultyTitle(person),
      email: person.email,
      phone: person.phone || '',
      office: person.office || '',
      bio: person.bio || '',
      shortBio: person.short_bio || '',
      researchInterests: person.research_interests || [],
      photo_url: person.photo_url || '',
      labWebsite: person.lab_website || '',
      googleScholar: person.google_scholar || '',
      orcid: person.orcid || '',
      active: person.category !== 'Emeriti', // Emeriti are inactive
      department: 'EEMB',
      publishedAt: new Date().toISOString()
    }
  };

  try {
    const response = await fetch(`${STRAPI_URL}/api/faculties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
      },
      body: JSON.stringify(facultyData)
    });

    if (response.ok) {
      stats.faculty.imported++;
      console.log(`  ✅ Imported faculty: ${person.full_name}`);
      return true;
    } else if (response.status === 400) {
      const error = await response.json();
      if (error.error?.message?.includes('email')) {
        stats.faculty.skipped++;
        console.log(`  ⏭️  Skipped (duplicate): ${person.full_name}`);
        return false;
      }
      stats.faculty.errors++;
      console.error(`  ❌ Error importing ${person.full_name}:`, error.error?.message);
      return false;
    } else {
      stats.faculty.errors++;
      console.error(`  ❌ HTTP ${response.status} for ${person.full_name}`);
      return false;
    }
  } catch (error) {
    stats.faculty.errors++;
    console.error(`  ❌ Exception importing ${person.full_name}:`, error.message);
    return false;
  }
}

/**
 * Import a person as staff
 */
async function importAsStaff(person) {
  const { firstName, lastName } = splitName(person.full_name);

  const staffData = {
    data: {
      firstName,
      lastName,
      fullName: person.full_name,
      title: person.title || '',
      email: person.email,
      phone: person.phone || '',
      office: person.office || '',
      bio: person.bio || '',
      shortBio: person.short_bio || '',
      photo_url: person.photo_url || '',
      department: 'EEMB',
      active: true,
      linkedin: person.linkedin || '',
      publishedAt: new Date().toISOString()
    }
  };

  try {
    const response = await fetch(`${STRAPI_URL}/api/staff-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
      },
      body: JSON.stringify(staffData)
    });

    if (response.ok) {
      stats.staff.imported++;
      console.log(`  ✅ Imported staff: ${person.full_name}`);
      return true;
    } else if (response.status === 400) {
      const error = await response.json();
      if (error.error?.message?.includes('email')) {
        stats.staff.skipped++;
        console.log(`  ⏭️  Skipped (duplicate): ${person.full_name}`);
        return false;
      }
      stats.staff.errors++;
      console.error(`  ❌ Error importing ${person.full_name}:`, error.error?.message);
      return false;
    } else {
      stats.staff.errors++;
      console.error(`  ❌ HTTP ${response.status} for ${person.full_name}`);
      return false;
    }
  } catch (error) {
    stats.staff.errors++;
    console.error(`  ❌ Exception importing ${person.full_name}:`, error.message);
    return false;
  }
}

/**
 * Import a person as graduate student
 */
async function importAsStudent(person) {
  const { firstName, lastName } = splitName(person.full_name);

  const studentData = {
    data: {
      firstName,
      lastName,
      fullName: person.full_name,
      email: person.email,
      phone: person.phone || '',
      office: person.office || '',
      bio: person.bio || '',
      shortBio: person.short_bio || '',
      researchInterests: person.research_interests || [],
      photo_url: person.photo_url || '',
      degreeProgram: 'PhD', // Default, could be refined
      active: true,
      labWebsite: person.lab_website || '',
      personalWebsite: person.personal_website || '',
      googleScholar: person.google_scholar || '',
      orcid: person.orcid || '',
      twitter: person.twitter || '',
      linkedin: person.linkedin || '',
      publishedAt: new Date().toISOString()
    }
  };

  try {
    const response = await fetch(`${STRAPI_URL}/api/graduate-students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
      },
      body: JSON.stringify(studentData)
    });

    if (response.ok) {
      stats.students.imported++;
      console.log(`  ✅ Imported student: ${person.full_name}`);
      return true;
    } else if (response.status === 400) {
      const error = await response.json();
      if (error.error?.message?.includes('email')) {
        stats.students.skipped++;
        console.log(`  ⏭️  Skipped (duplicate): ${person.full_name}`);
        return false;
      }
      stats.students.errors++;
      console.error(`  ❌ Error importing ${person.full_name}:`, error.error?.message);
      return false;
    } else {
      stats.students.errors++;
      console.error(`  ❌ HTTP ${response.status} for ${person.full_name}`);
      return false;
    }
  } catch (error) {
    stats.students.errors++;
    console.error(`  ❌ Exception importing ${person.full_name}:`, error.message);
    return false;
  }
}

/**
 * Main import function
 */
async function importAllPeople() {
  console.log('🚀 Starting comprehensive people import...\n');
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  // Check if Strapi is running
  try {
    const healthCheck = await fetch(`${STRAPI_URL}/_health`);
    if (!healthCheck.ok) {
      console.error('❌ Strapi is not responding. Please start Strapi first.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Cannot connect to Strapi. Please start Strapi first.');
    process.exit(1);
  }

  // Group people by category
  const facultyCategories = ['Faculty', 'Emeriti', 'Adjunct', 'Researcher'];
  const faculty = peopleData.filter(p => facultyCategories.includes(p.category));
  const staff = peopleData.filter(p => p.category === 'Staff');
  const students = peopleData.filter(p => p.category === 'Student');

  stats.faculty.total = faculty.length;
  stats.staff.total = staff.length;
  stats.students.total = students.length;

  console.log('📊 Import Summary:');
  console.log(`  Faculty (including Emeriti, Adjunct, Researchers): ${faculty.length}`);
  console.log(`  Staff: ${staff.length}`);
  console.log(`  Students: ${students.length}`);
  console.log(`  Total: ${stats.total}\n`);

  // Import Faculty
  console.log('👨‍🏫 Importing Faculty...');
  for (const person of faculty) {
    if (!person.email) {
      console.log(`  ⚠️  Skipping ${person.full_name} (no email)`);
      stats.faculty.skipped++;
      continue;
    }
    await importAsFaculty(person);
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Import Staff
  console.log('\n👔 Importing Staff...');
  for (const person of staff) {
    if (!person.email) {
      console.log(`  ⚠️  Skipping ${person.full_name} (no email)`);
      stats.staff.skipped++;
      continue;
    }
    await importAsStaff(person);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Import Students
  console.log('\n🎓 Importing Graduate Students...');
  for (const person of students) {
    if (!person.email) {
      console.log(`  ⚠️  Skipping ${person.full_name} (no email)`);
      stats.students.skipped++;
      continue;
    }
    await importAsStudent(person);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Print final statistics
  console.log('\n' + '='.repeat(60));
  console.log('📈 IMPORT COMPLETE - Final Statistics');
  console.log('='.repeat(60));
  console.log('\nFaculty:');
  console.log(`  Total:    ${stats.faculty.total}`);
  console.log(`  Imported: ${stats.faculty.imported}`);
  console.log(`  Skipped:  ${stats.faculty.skipped}`);
  console.log(`  Errors:   ${stats.faculty.errors}`);

  console.log('\nStaff:');
  console.log(`  Total:    ${stats.staff.total}`);
  console.log(`  Imported: ${stats.staff.imported}`);
  console.log(`  Skipped:  ${stats.staff.skipped}`);
  console.log(`  Errors:   ${stats.staff.errors}`);

  console.log('\nStudents:');
  console.log(`  Total:    ${stats.students.total}`);
  console.log(`  Imported: ${stats.students.imported}`);
  console.log(`  Skipped:  ${stats.students.skipped}`);
  console.log(`  Errors:   ${stats.students.errors}`);

  console.log('\nOverall:');
  const totalImported = stats.faculty.imported + stats.staff.imported + stats.students.imported;
  const totalSkipped = stats.faculty.skipped + stats.staff.skipped + stats.students.skipped;
  const totalErrors = stats.faculty.errors + stats.staff.errors + stats.students.errors;

  console.log(`  Total People: ${stats.total}`);
  console.log(`  Imported:     ${totalImported}`);
  console.log(`  Skipped:      ${totalSkipped}`);
  console.log(`  Errors:       ${totalErrors}`);
  console.log('='.repeat(60));

  if (totalErrors > 0) {
    console.log('\n⚠️  Some imports failed. Check the errors above.');
  } else {
    console.log('\n✅ All imports completed successfully!');
  }
}

// Run the import
importAllPeople().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
