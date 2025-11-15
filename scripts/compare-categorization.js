#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Compare website categories with database
 */

// Load website categories
const websiteCategories = JSON.parse(
  fs.readFileSync('scripts/website-categories.json', 'utf-8')
);

// Get database data
const dbFaculty = execSync(
  `sqlite3 backend/.tmp/data.db "SELECT full_name FROM faculties ORDER BY full_name;"`
).toString().trim().split('\n');

const dbStaff = execSync(
  `sqlite3 backend/.tmp/data.db "SELECT full_name FROM staff_members ORDER BY full_name;"`
).toString().trim().split('\n');

const dbStudents = execSync(
  `sqlite3 backend/.tmp/data.db "SELECT full_name FROM graduate_students ORDER BY full_name;"`
).toString().trim().split('\n');

console.log('📊 CATEGORIZATION COMPARISON\n');
console.log('=' .repeat(70));

// Faculty comparison
console.log('\n🎓 FACULTY COMPARISON:');
console.log(`   Website faculty page: ${websiteCategories.faculty.length}`);
console.log(`   Database faculty table: ${dbFaculty.length}\n`);

// Find who is in DB but not on website faculty page
const extraInDb = dbFaculty.filter(name =>
  !websiteCategories.faculty.includes(name)
);

if (extraInDb.length > 0) {
  console.log(`   ℹ️  In DB but not on website faculty page (${extraInDb.length}):`);
  extraInDb.forEach(name => {
    // Get their title
    const title = execSync(
      `sqlite3 backend/.tmp/data.db "SELECT title FROM faculties WHERE full_name = '${name.replace(/'/g, "''")}';"`
    ).toString().trim();
    console.log(`      - ${name} (${title || 'No title'})`);
  });
}

// Find who is on website but not in DB
const missingInDb = websiteCategories.faculty.filter(name =>
  !dbFaculty.includes(name)
);

if (missingInDb.length > 0) {
  console.log(`\n   ⚠️  On website but NOT in DB (${missingInDb.length}):`);
  missingInDb.forEach(name => console.log(`      - ${name}`));
}

// Staff comparison
console.log('\n\n👥 STAFF COMPARISON:');
console.log(`   Website staff page: ${websiteCategories.staff.length}`);
console.log(`   Database staff table: ${dbStaff.length}\n`);

const extraStaffInDb = dbStaff.filter(name =>
  !websiteCategories.staff.includes(name)
);

if (extraStaffInDb.length > 0) {
  console.log(`   ℹ️  In DB but not on website staff page (${extraStaffInDb.length}):`);
  extraStaffInDb.forEach(name => console.log(`      - ${name}`));
}

const missingStaffInDb = websiteCategories.staff.filter(name =>
  !dbStaff.includes(name)
);

if (missingStaffInDb.length > 0) {
  console.log(`\n   ⚠️  On website but NOT in DB (${missingStaffInDb.length}):`);
  missingStaffInDb.forEach(name => console.log(`      - ${name}`));
}

console.log('\n' + '='.repeat(70));
console.log('\n✅ Comparison complete!\n');
