#!/usr/bin/env node

const fs = require('fs');
const { parse } = require('csv-parse/sync');

/**
 * COMPREHENSIVE DATA CLEANUP
 *
 * This script:
 * 1. Uses the CSV as the SINGLE SOURCE OF TRUTH
 * 2. Cleans all data in the database
 * 3. Ensures proper categorization (Faculty/Student/Staff)
 * 4. Validates all fields
 * 5. Creates a clean directory
 */

async function cleanAndValidateData() {
  console.log('🧹 COMPREHENSIVE DATA CLEANUP\n');
  console.log('Using CSV as source of truth...\n');

  // Read CSV file
  const csvPath = '/Users/adrianstiermbp2023/Downloads/eemb-people-export.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`✅ Loaded ${records.length} people from CSV\n`);

  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  // Categorize by type
  const facultyRecords = records.filter(r => r.type === 'Faculty' || r.type === 'Researcher');
  const studentRecords = records.filter(r => r.type === 'Student');
  const staffRecords = records.filter(r => r.type === 'Staff');

  console.log('📊 CSV Categories:');
  console.log(`   Faculty: ${facultyRecords.length}`);
  console.log(`   Students: ${studentRecords.length}`);
  console.log(`   Staff: ${staffRecords.length}\n`);

  // Fetch current database
  const [facultyRes, studentsRes, staffRes] = await Promise.all([
    fetch(`${API_URL}/faculties?pagination[limit]=200`),
    fetch(`${API_URL}/graduate-students?pagination[limit]=200`),
    fetch(`${API_URL}/staff-members?pagination[limit]=200`)
  ]);

  const dbFaculty = (await facultyRes.json()).data;
  const dbStudents = (await studentsRes.json()).data;
  const dbStaff = (await staffRes.json()).data;

  console.log('📊 Current Database:');
  console.log(`   Faculty: ${dbFaculty.length}`);
  console.log(`   Students: ${dbStudents.length}`);
  console.log(`   Staff: ${dbStaff.length}\n`);

  // Helper functions
  function parseName(fullName) {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: parts[0] };
    }
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return { firstName, lastName };
  }

  function cleanEmail(emailField) {
    if (!emailField) return null;
    const match = emailField.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return match ? match[1] : null;
  }

  function cleanPhone(phoneField) {
    if (!phoneField) return null;
    const match = phoneField.match(/(\d{3}[-.)]\s*\d{3}[-.\s]*\d{4}|\d{3}\.\d{3}\.\d{4})/);
    return match ? match[0] : phoneField.split('\n')[0].trim();
  }

  function cleanOffice(officeField) {
    if (!officeField) return null;
    return officeField.split('\n')[0].trim();
  }

  function createSlug(name) {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9-]/g, '');
  }

  function parseResearchInterests(taxonomy) {
    if (!taxonomy) return [];
    return taxonomy.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  function extractGoogleScholar(publicationsLink) {
    if (!publicationsLink) return null;
    const match = publicationsLink.match(/(https?:\/\/scholar\.google\.com[^\s\n]+)/);
    return match ? match[1] : null;
  }

  function extractWebsite(websiteField) {
    if (!websiteField) return null;
    const cleaned = websiteField.trim();
    if (cleaned.startsWith('http')) return cleaned;
    return null;
  }

  // PHASE 1: Clean Faculty
  console.log('\n🎓 PHASE 1: Cleaning Faculty Data\n');
  let facultyUpdated = 0;
  let facultyErrors = 0;

  for (const record of facultyRecords) {
    const fullName = record.title;
    if (!fullName || fullName.length < 3) continue;

    const { firstName, lastName } = parseName(fullName);

    // Find in database
    const existing = dbFaculty.find(f =>
      f.attributes.fullName === fullName ||
      f.attributes.fullName?.toLowerCase() === fullName.toLowerCase()
    );

    if (!existing) {
      console.log(`⚠️  Not in DB: ${fullName}`);
      continue;
    }

    // Build clean data object
    const cleanData = {
      firstName,
      lastName,
      fullName,
      email: cleanEmail(record.field_email),
      phone: cleanPhone(record.field_phone || record.Phone),
      office: cleanOffice(record.field_office),
      title: record.field_job_title || null,
      slug: createSlug(fullName),
      bio: record.Biography && record.Biography.length > 50 ? record.Biography.trim() : null,
      researchInterests: parseResearchInterests(record.Taxonomy),
      labWebsite: extractWebsite(record.Website),
      googleScholar: extractGoogleScholar(record['Publications Link'])
    };

    // Add short bio
    if (cleanData.bio) {
      const firstPara = cleanData.bio.split('\n')[0];
      cleanData.shortBio = firstPara.length > 300
        ? firstPara.substring(0, 297) + '...'
        : firstPara;
    }

    // Update
    try {
      const response = await fetch(`${API_URL}/faculties/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: cleanData })
      });

      if (!response.ok) {
        console.error(`❌ Failed: ${fullName}`);
        facultyErrors++;
      } else {
        console.log(`✅ Cleaned: ${fullName}`);
        facultyUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error: ${fullName} -`, error.message);
      facultyErrors++;
    }
  }

  // PHASE 2: Clean Students
  console.log('\n\n🎓 PHASE 2: Cleaning Student Data\n');
  let studentsUpdated = 0;
  let studentsErrors = 0;

  for (const record of studentRecords) {
    const fullName = record.title;
    if (!fullName || fullName.length < 3) continue;

    const { firstName, lastName } = parseName(fullName);

    const existing = dbStudents.find(s =>
      s.attributes.fullName === fullName ||
      s.attributes.fullName?.toLowerCase() === fullName.toLowerCase()
    );

    if (!existing) {
      console.log(`⚠️  Not in DB: ${fullName}`);
      continue;
    }

    const cleanData = {
      firstName,
      lastName,
      fullName,
      email: cleanEmail(record.field_email),
      phone: cleanPhone(record.field_phone || record.Phone),
      office: cleanOffice(record.field_office),
      degreeProgram: 'PhD',
      advisor: record.Taxonomy || null,
      slug: createSlug(fullName)
    };

    try {
      const response = await fetch(`${API_URL}/graduate-students/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: cleanData })
      });

      if (!response.ok) {
        console.error(`❌ Failed: ${fullName}`);
        studentsErrors++;
      } else {
        console.log(`✅ Cleaned: ${fullName}`);
        studentsUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error: ${fullName} -`, error.message);
      studentsErrors++;
    }
  }

  // PHASE 3: Clean Staff
  console.log('\n\n👥 PHASE 3: Cleaning Staff Data\n');
  let staffUpdated = 0;
  let staffErrors = 0;

  for (const record of staffRecords) {
    const fullName = record.title;
    if (!fullName || fullName.length < 3) continue;

    const { firstName, lastName } = parseName(fullName);

    const existing = dbStaff.find(s =>
      s.attributes.fullName === fullName ||
      s.attributes.fullName?.toLowerCase() === fullName.toLowerCase()
    );

    if (!existing) {
      console.log(`⚠️  Not in DB: ${fullName}`);
      continue;
    }

    const cleanData = {
      firstName,
      lastName,
      fullName,
      email: cleanEmail(record.field_email),
      phone: cleanPhone(record.field_phone || record.Phone),
      office: cleanOffice(record.field_office),
      title: record.field_job_title || null,
      slug: createSlug(fullName)
    };

    try {
      const response = await fetch(`${API_URL}/staff-members/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: cleanData })
      });

      if (!response.ok) {
        console.error(`❌ Failed: ${fullName}`);
        staffErrors++;
      } else {
        console.log(`✅ Cleaned: ${fullName}`);
        staffUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error: ${fullName} -`, error.message);
      staffErrors++;
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('✨ CLEANUP COMPLETE!\n');
  console.log('📊 Summary:');
  console.log(`   Faculty: ${facultyUpdated} cleaned, ${facultyErrors} errors`);
  console.log(`   Students: ${studentsUpdated} cleaned, ${studentsErrors} errors`);
  console.log(`   Staff: ${staffUpdated} cleaned, ${staffErrors} errors`);
  console.log('='.repeat(70) + '\n');
}

cleanAndValidateData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
