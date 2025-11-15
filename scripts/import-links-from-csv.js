#!/usr/bin/env node

/**
 * Import social/academic links from EEMB CSV export to Strapi
 */

const fs = require('fs');
const path = require('path');

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const records = [];
  let currentRecord = [];
  let inQuotes = false;
  let currentField = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        currentRecord.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }

    // End of line
    if (!inQuotes) {
      currentRecord.push(currentField.trim());

      if (currentRecord.length === headers.length) {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = currentRecord[index];
        });
        records.push(record);
      }

      currentRecord = [];
      currentField = '';
    } else {
      currentField += '\n';
    }
  }

  return records;
}

function extractLinks(record) {
  const links = {
    labWebsite: null,
    googleScholar: null,
    orcid: null
  };

  // Extract Google Scholar from "Publications Link" field
  const pubLink = record['Publications Link'] || '';
  const scholarMatch = pubLink.match(/https:\/\/scholar\.google\.com\/citations\?[^\s]+/);
  if (scholarMatch) {
    links.googleScholar = scholarMatch[0].trim();
  }

  // Extract lab website from "Website" field
  const website = record['Website'] || '';
  if (website && website.trim() && !website.toLowerCase().includes('google scholar')) {
    links.labWebsite = website.trim();
  }

  // ORCID would be in the bio or publications link if present
  const bio = record['Biography'] || '';
  const orcidMatch = bio.match(/orcid\.org\/(\d{4}-\d{4}-\d{4}-\d{3}[0-9X])/i);
  if (orcidMatch) {
    links.orcid = orcidMatch[1];
  }

  return links;
}

async function importLinksFromCSV() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('📄 Reading CSV file...\n');

  const csvPath = path.join(__dirname, '..', 'eemb-people-export.csv');
  const csvText = fs.readFileSync(csvPath, 'utf-8');

  console.log('📊 Parsing CSV data...\n');
  const records = parseCSV(csvText);

  console.log(`Found ${records.length} records in CSV\n`);

  // Get all faculty from database
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const dbFaculty = data.data;

  console.log(`Found ${dbFaculty.length} faculty in database\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  // Process each CSV record
  for (const record of records) {
    const name = record['title']?.trim();
    const jobTitle = record['field_job_title']?.trim();

    if (!name) continue;

    // Only process faculty, not staff or students
    const type = record['type']?.trim();
    if (type !== 'Faculty' && type !== 'Researcher') {
      continue;
    }

    console.log(`\n📝 ${name}`);
    console.log(`   Job: ${jobTitle}`);

    // Find matching person in database
    const dbPerson = dbFaculty.find(p => {
      const fullName = p.attributes.fullName.toLowerCase();
      const csvName = name.toLowerCase();

      // Try exact match first
      if (fullName === csvName) return true;

      // Try last name match
      const lastName = p.attributes.lastName.toLowerCase();
      if (csvName.includes(lastName) && lastName.length > 3) return true;

      return false;
    });

    if (!dbPerson) {
      console.log(`   ⏭️  Not found in database`);
      skipped++;
      continue;
    }

    console.log(`   ✓ Matched: ${dbPerson.attributes.fullName}`);

    // Extract links
    const links = extractLinks(record);

    console.log(`   Links found:`);
    console.log(`     Lab: ${links.labWebsite || 'none'}`);
    console.log(`     Scholar: ${links.googleScholar || 'none'}`);
    console.log(`     ORCID: ${links.orcid || 'none'}`);

    // Update if we found at least one link
    if (links.labWebsite || links.googleScholar || links.orcid) {
      const updateData = {};
      if (links.labWebsite) updateData.labWebsite = links.labWebsite;
      if (links.googleScholar) updateData.googleScholar = links.googleScholar;
      if (links.orcid) updateData.orcid = links.orcid;

      try {
        const updateResponse = await fetch(`${API_URL}/faculties/${dbPerson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: updateData })
        });

        if (updateResponse.ok) {
          console.log(`   ✅ Updated in database`);
          updated++;
        } else {
          const errorText = await updateResponse.text();
          console.log(`   ❌ Failed: ${updateResponse.status}`);
          errors++;
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        errors++;
      }
    } else {
      console.log(`   ⏭️  No links to update`);
      skipped++;
    }
  }

  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 Summary:');
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📝 Total processed: ${records.length}`);
  console.log('═══════════════════════════════════════\n');
  console.log('✨ Done! Refresh your browser to see all the social/academic links.\n');
}

importLinksFromCSV().catch(console.error);
