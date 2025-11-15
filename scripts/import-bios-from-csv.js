#!/usr/bin/env node

const fs = require('fs');
const { parse } = require('csv-parse/sync');

/**
 * Import ALL biographical data, research interests, and links from CSV
 * This will populate bios, research interests, Google Scholar, ORCID, Twitter, websites
 */

async function importBiosFromCSV() {
  console.log('📚 Importing all biographical data from CSV...\n');

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

  // Get existing faculty
  console.log('🔍 Fetching existing faculty from database...\n');
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const existingFaculty = data.data;

  console.log(`Found ${existingFaculty.length} faculty in database\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  // Process each faculty member from CSV
  for (const record of records) {
    if (record.type !== 'Faculty' && record.type !== 'Researcher') {
      continue; // Only process faculty for now
    }

    const fullName = record.title || '';
    if (!fullName) continue;

    // Find matching faculty in database
    const dbPerson = existingFaculty.find(f =>
      f.attributes.fullName === fullName ||
      f.attributes.fullName?.toLowerCase() === fullName.toLowerCase()
    );

    if (!dbPerson) {
      console.log(`⚠️  No database match for: ${fullName}`);
      skipped++;
      continue;
    }

    // Prepare updates
    const updates = {};
    let hasUpdates = false;

    // Biography
    if (record.Biography && record.Biography.trim().length > 50) {
      updates.bio = record.Biography.trim();
      hasUpdates = true;
    }

    // Research Interests from Taxonomy field
    if (record.Taxonomy) {
      const interests = record.Taxonomy
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (interests.length > 0) {
        updates.researchInterests = interests;
        hasUpdates = true;
      }
    }

    // Extract short bio from first paragraph of bio
    if (updates.bio) {
      const firstPara = updates.bio.split('\n')[0];
      updates.shortBio = firstPara.length > 300
        ? firstPara.substring(0, 297) + '...'
        : firstPara;
    }

    // Website (from Website field)
    if (record.Website && record.Website.trim()) {
      const website = record.Website.trim();
      if (website.includes('http')) {
        updates.labWebsite = website;
        hasUpdates = true;
      }
    }

    // Google Scholar (from Publications Link field)
    if (record['Publications Link']) {
      const links = record['Publications Link'].split('\n');
      for (const link of links) {
        if (link.includes('scholar.google')) {
          const match = link.match(/(https?:\/\/[^\s]+)/);
          if (match) {
            updates.googleScholar = match[1];
            hasUpdates = true;
            break;
          }
        } else if (link.includes('ncbi.nlm.nih.gov')) {
          // NCBI publications link
          const match = link.match(/(https?:\/\/[^\s]+)/);
          if (match) {
            updates.publicationsLink = match[1];
            hasUpdates = true;
          }
        }
      }
    }

    // Twitter (from Twitter Link field)
    if (record['Twitter Link'] && record['Twitter Link'].includes('@')) {
      updates.twitter = record['Twitter Link'].trim();
      hasUpdates = true;
    }

    if (!hasUpdates) {
      continue;
    }

    // Perform update
    try {
      const updateUrl = `${API_URL}/faculties/${dbPerson.id}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: updates })
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error(`❌ Failed to update ${fullName}: ${updateResponse.statusText}`);
        errors++;
        continue;
      }

      console.log(`✅ Updated ${fullName}:`);
      if (updates.bio) console.log(`   📝 Bio (${updates.bio.length} chars)`);
      if (updates.researchInterests) console.log(`   🔬 ${updates.researchInterests.length} research interests`);
      if (updates.labWebsite) console.log(`   🌐 Website: ${updates.labWebsite}`);
      if (updates.googleScholar) console.log(`   📚 Google Scholar`);
      if (updates.publicationsLink) console.log(`   📄 Publications`);
      if (updates.twitter) console.log(`   🐦 Twitter: ${updates.twitter}`);
      updated++;

    } catch (error) {
      console.error(`❌ Error updating ${fullName}:`, error.message);
      errors++;
    }
  }

  console.log(`\n\n✨ Bio import complete!`);
  console.log(`📊 Statistics:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped (no match): ${skipped}`);
  console.log(`   Errors: ${errors}`);

  // Summary stats
  const finalResponse = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const finalData = await finalResponse.json();
  const finalFaculty = finalData.data;

  const withBio = finalFaculty.filter(f => f.attributes.bio && f.attributes.bio.length > 50).length;
  const withResearch = finalFaculty.filter(f => f.attributes.researchInterests && f.attributes.researchInterests.length > 0).length;
  const withWebsite = finalFaculty.filter(f => f.attributes.labWebsite).length;
  const withScholar = finalFaculty.filter(f => f.attributes.googleScholar).length;

  console.log(`\n📈 Final Statistics:`);
  console.log(`   With Bio: ${withBio} / ${finalFaculty.length} (${Math.round(withBio/finalFaculty.length*100)}%)`);
  console.log(`   With Research Interests: ${withResearch} / ${finalFaculty.length} (${Math.round(withResearch/finalFaculty.length*100)}%)`);
  console.log(`   With Website: ${withWebsite} / ${finalFaculty.length} (${Math.round(withWebsite/finalFaculty.length*100)}%)`);
  console.log(`   With Google Scholar: ${withScholar} / ${finalFaculty.length} (${Math.round(withScholar/finalFaculty.length*100)}%)`);
}

importBiosFromCSV().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
