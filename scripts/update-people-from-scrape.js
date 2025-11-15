#!/usr/bin/env node

/**
 * Update People Database from Scraped Data
 * This script updates the Strapi database with accurate office locations,
 * titles, and other data scraped from the original EEMB website
 */

const fs = require('fs');
const path = require('path');

async function updatePeopleData() {
  console.log('🔄 Starting database update from scraped data...\n');

  // Load scraped data
  const scrapedDataPath = path.join(__dirname, 'comprehensive-people-data.json');
  if (!fs.existsSync(scrapedDataPath)) {
    console.error('❌ Error: comprehensive-people-data.json not found!');
    console.error('   Please run comprehensive-people-import.js first');
    process.exit(1);
  }

  const scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf-8'));
  console.log(`📊 Loaded ${scrapedData.people.length} scraped profiles\n`);

  // Connect to Strapi API
  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  // Fetch all existing people from each collection
  const collections = ['faculties', 'graduate-students', 'staffs'];
  const allPeople = [];

  for (const collection of collections) {
    try {
      const response = await fetch(`${API_URL}/${collection}?pagination[limit]=200`);
      if (!response.ok) {
        console.warn(`⚠️  Could not fetch ${collection}: ${response.statusText}`);
        continue;
      }
      const data = await response.json();
      const people = data.data.map(person => ({
        id: person.id,
        collection,
        ...person.attributes
      }));
      allPeople.push(...people);
      console.log(`✅ Loaded ${people.length} from ${collection}`);
    } catch (error) {
      console.warn(`⚠️  Error fetching ${collection}:`, error.message);
    }
  }

  console.log(`\n📚 Total people in database: ${allPeople.length}\n`);

  // Match and update
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const scrapedPerson of scrapedData.people) {
    // Skip if no meaningful data to update
    if (!scrapedPerson.office && !scrapedPerson.title && !scrapedPerson.phone) {
      skipped++;
      continue;
    }

    // Find matching person in database by email
    const dbPerson = allPeople.find(p =>
      p.email && scrapedPerson.email &&
      p.email.toLowerCase() === scrapedPerson.email.toLowerCase()
    );

    if (!dbPerson) {
      console.log(`⚠️  No match found for: ${scrapedPerson.name} (${scrapedPerson.email})`);
      skipped++;
      continue;
    }

    // Prepare update data
    const updates = {};
    let hasUpdates = false;

    // Update office if we have it and it's different
    if (scrapedPerson.office && scrapedPerson.office !== dbPerson.office) {
      updates.office = scrapedPerson.office;
      hasUpdates = true;
    }

    // Update phone if we have it and it's different
    if (scrapedPerson.phone && scrapedPerson.phone !== dbPerson.phone) {
      updates.phone = scrapedPerson.phone;
      hasUpdates = true;
    }

    // Update title if we have it and it's different (and it's not "Advisor" or "Students")
    if (scrapedPerson.title &&
        scrapedPerson.title !== 'Advisor' &&
        scrapedPerson.title !== 'Students' &&
        scrapedPerson.title !== dbPerson.title) {
      updates.title = scrapedPerson.title;
      hasUpdates = true;
    }

    if (!hasUpdates) {
      continue;
    }

    // Perform update
    try {
      const updateUrl = `${API_URL}/${dbPerson.collection}/${dbPerson.id}`;
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: updates })
      });

      if (!response.ok) {
        console.error(`❌ Failed to update ${scrapedPerson.name}: ${response.statusText}`);
        errors++;
        continue;
      }

      console.log(`✅ Updated ${scrapedPerson.name}:`);
      if (updates.office) console.log(`   📍 Office: ${updates.office}`);
      if (updates.phone) console.log(`   📱 Phone: ${updates.phone}`);
      if (updates.title) console.log(`   📋 Title: ${updates.title}`);
      updated++;

    } catch (error) {
      console.error(`❌ Error updating ${scrapedPerson.name}:`, error.message);
      errors++;
    }
  }

  console.log(`\n\n✨ Update complete!`);
  console.log(`📊 Statistics:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
}

updatePeopleData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
