#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

/**
 * Import people data from the CSV export
 * This will be the source of truth for categorization
 */

async function importFromCSV() {
  console.log('📊 Importing people from CSV export...\n');

  // Read CSV file
  const csvPath = '/Users/adrianstiermbp2023/Downloads/eemb-people-export.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`Found ${records.length} people in CSV\n`);

  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  // Categorize people
  const faculty = [];
  const students = [];
  const staff = [];

  for (const record of records) {
    const type = record.type?.toLowerCase() || '';

    if (type === 'faculty' || type === 'researcher') {
      faculty.push(record);
    } else if (type === 'student') {
      students.push(record);
    } else if (type === 'staff') {
      staff.push(record);
    }
  }

  console.log('📋 Categorization:');
  console.log(`   Faculty/Researchers: ${faculty.length}`);
  console.log(`   Students: ${students.length}`);
  console.log(`   Staff: ${staff.length}\n`);

  // Get existing data from database
  console.log('🔍 Fetching existing database records...\n');

  const [facultyResp, studentsResp, staffResp] = await Promise.all([
    fetch(`${API_URL}/faculties?pagination[limit]=200`),
    fetch(`${API_URL}/graduate-students?pagination[limit]=200`),
    fetch(`${API_URL}/staff-members?pagination[limit]=200`)
  ]);

  const existingFaculty = (await facultyResp.json()).data;
  const existingStudents = (await studentsResp.json()).data;
  const existingStaff = (await staffResp.json()).data;

  console.log('📊 Existing database:');
  console.log(`   Faculty: ${existingFaculty.length}`);
  console.log(`   Students: ${existingStudents.length}`);
  console.log(`   Staff: ${existingStaff.length}\n`);

  // Helper function to parse name
  function parseName(fullName) {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: parts[0] };
    }
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return { firstName, lastName };
  }

  // Helper function to clean email
  function cleanEmail(emailField) {
    if (!emailField) return null;
    // Extract just the email address from the field which may have newlines and other text
    const match = emailField.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return match ? match[1] : null;
  }

  // Helper function to clean phone
  function cleanPhone(phoneField) {
    if (!phoneField) return null;
    // Extract phone number
    const match = phoneField.match(/(\d{3}[-.)]\s*\d{3}[-.\s]*\d{4}|\d{3}\.\d{3}\.\d{4})/);
    return match ? match[0] : phoneField.split('\n')[0].trim();
  }

  // Helper to create slug
  function createSlug(name) {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[^a-z0-9-]/g, '');
  }

  // Update/create faculty
  console.log('\n🎓 Processing Faculty...\n');
  let facultyUpdated = 0;
  let facultyCreated = 0;

  for (const person of faculty) {
    const fullName = person.title || person.field_job_title || '';
    if (!fullName) continue;

    const { firstName, lastName } = parseName(fullName);
    const email = cleanEmail(person.field_email);
    const phone = cleanPhone(person.field_phone || person.Phone);
    const office = person.field_office?.split('\n')[0]?.trim() || null;
    const title = person.field_job_title || null;
    const slug = createSlug(fullName);

    // Find existing faculty member
    const existing = existingFaculty.find(f =>
      f.attributes.fullName === fullName ||
      (f.attributes.email && email && f.attributes.email === email) ||
      f.attributes.slug === slug
    );

    const data = {
      firstName,
      lastName,
      fullName,
      email,
      phone,
      office,
      title,
      slug
    };

    try {
      if (existing) {
        // Update
        await fetch(`${API_URL}/faculties/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data })
        });
        console.log(`   ✅ Updated: ${fullName}`);
        facultyUpdated++;
      } else {
        // Create
        await fetch(`${API_URL}/faculties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data })
        });
        console.log(`   ➕ Created: ${fullName}`);
        facultyCreated++;
      }
    } catch (error) {
      console.error(`   ❌ Error with ${fullName}:`, error.message);
    }
  }

  // Update/create students
  console.log('\n🎓 Processing Students...\n');
  let studentsUpdated = 0;
  let studentsCreated = 0;

  for (const person of students) {
    const fullName = person.title || '';
    if (!fullName) continue;

    const { firstName, lastName } = parseName(fullName);
    const email = cleanEmail(person.field_email);
    const phone = cleanPhone(person.field_phone || person.Phone);
    const office = person.field_office?.split('\n')[0]?.trim() || null;
    const advisor = person.Taxonomy || null;
    const slug = createSlug(fullName);

    const existing = existingStudents.find(s =>
      s.attributes.fullName === fullName ||
      (s.attributes.email && email && s.attributes.email === email)
    );

    const data = {
      firstName,
      lastName,
      fullName,
      email,
      phone,
      office,
      degreeProgram: 'PhD',
      slug
    };

    try {
      if (existing) {
        await fetch(`${API_URL}/graduate-students/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data })
        });
        console.log(`   ✅ Updated: ${fullName}`);
        studentsUpdated++;
      } else {
        await fetch(`${API_URL}/graduate-students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data })
        });
        console.log(`   ➕ Created: ${fullName}`);
        studentsCreated++;
      }
    } catch (error) {
      console.error(`   ❌ Error with ${fullName}:`, error.message);
    }
  }

  // Update/create staff
  console.log('\n👥 Processing Staff...\n');
  let staffUpdated = 0;
  let staffCreated = 0;

  for (const person of staff) {
    const fullName = person.title || '';
    if (!fullName) continue;

    const { firstName, lastName } = parseName(fullName);
    const email = cleanEmail(person.field_email);
    const phone = cleanPhone(person.field_phone || person.Phone);
    const office = person.field_office?.split('\n')[0]?.trim() || null;
    const title = person.field_job_title || null;
    const slug = createSlug(fullName);

    const existing = existingStaff.find(s =>
      s.attributes.fullName === fullName ||
      (s.attributes.email && email && s.attributes.email === email)
    );

    const data = {
      firstName,
      lastName,
      fullName,
      email,
      phone,
      office,
      title,
      slug
    };

    try {
      if (existing) {
        await fetch(`${API_URL}/staff-members/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data })
        });
        console.log(`   ✅ Updated: ${fullName}`);
        staffUpdated++;
      } else {
        await fetch(`${API_URL}/staff-members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data })
        });
        console.log(`   ➕ Created: ${fullName}`);
        staffCreated++;
      }
    } catch (error) {
      console.error(`   ❌ Error with ${fullName}:`, error.message);
    }
  }

  console.log('\n\n✨ Import Complete!');
  console.log('\n📊 Summary:');
  console.log(`   Faculty: ${facultyUpdated} updated, ${facultyCreated} created`);
  console.log(`   Students: ${studentsUpdated} updated, ${studentsCreated} created`);
  console.log(`   Staff: ${staffUpdated} updated, ${staffCreated} created`);
}

importFromCSV().catch(console.error);
