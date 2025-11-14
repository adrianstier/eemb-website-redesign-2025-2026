#!/usr/bin/env node

/**
 * Scrape missing photos from individual profile pages
 * This script finds people without photos and attempts to get their photos
 * from their individual profile pages on the current EEMB website
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';
const SCRAPED_DATA_PATH = path.join(__dirname, '../../scraping/data/people-detailed-complete.json');

// People missing photos (from database query)
const missingPhotos = {
  faculty: [
    { id: 168, full_name: "Adrian M. Wenner", email: "wenner@lifesci.ucsb.edu" },
    { id: 134, full_name: "Anna James", email: "ajames@ucsb.edu" },
    { id: 112, full_name: "Daniel Botkin", email: "danielbotkin@rcn.com" },
    { id: 119, full_name: "Ivia Closset", email: "ivia@ucsb.edu" }
  ],
  staff: [
    { id: 13, full_name: "Danielle Perez", email: "dcperez@ucsb.edu" },
    { id: 16, full_name: "Ellery Wilkie", email: "ewilkie@lifesci.ucsb.edu" },
    { id: 2, full_name: "Paul Diaz", email: "pdiaz@lifesci.ucsb.edu" },
    { id: 15, full_name: "Rosa Vasquez", email: "rosavasquez@ucsb.edu" },
    { id: 8, full_name: "Saru Lantier", email: "info@eemb.ucsb.edu" }
  ],
  students: [
    { id: 28, full_name: "Julianna Renzi", email: "julianna.renzi@lifesci.ucsb.edu" },
    { id: 11, full_name: "Kenneth Gilliland", email: "kenneth.gilliland@lifesci.ucsb.edu" },
    { id: 35, full_name: "Zoe Welch", email: "zoe.welch@lifesci.ucsb.edu" }
  ]
};

async function loadScrapedData() {
  try {
    const data = fs.readFileSync(SCRAPED_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error loading scraped data:', error.message);
    return [];
  }
}

function findPersonInScrapedData(scrapedData, email, fullName) {
  // Try to find by email first
  let person = scrapedData.find(p => p.email && p.email.toLowerCase() === email.toLowerCase());

  // If not found by email, try by name
  if (!person) {
    person = scrapedData.find(p =>
      p.full_name && p.full_name.toLowerCase() === fullName.toLowerCase()
    );
  }

  return person;
}

async function updatePhotoInStrapi(type, id, photoUrl) {
  const endpoints = {
    faculty: 'faculties',
    staff: 'staff-members',
    students: 'graduate-students'
  };

  const endpoint = endpoints[type];
  if (!endpoint) {
    console.error(`❌ Unknown type: ${type}`);
    return false;
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          photo_url: photoUrl
        }
      })
    });

    if (response.ok) {
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ Error updating ${type} ${id}:`, response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${type} ${id}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Scraping Missing Photos\n');
  console.log('=' .repeat(60));

  // Load scraped data
  console.log('\n📂 Loading scraped data...');
  const scrapedData = await loadScrapedData();
  console.log(`✅ Loaded ${scrapedData.length} records from scraped data\n`);

  let totalFound = 0;
  let totalUpdated = 0;
  let totalMissing = 0;

  // Process each category
  for (const [type, people] of Object.entries(missingPhotos)) {
    console.log(`\n📋 Processing ${type.toUpperCase()}:`);
    console.log('-'.repeat(60));

    for (const person of people) {
      const scrapedPerson = findPersonInScrapedData(scrapedData, person.email, person.full_name);

      if (scrapedPerson && scrapedPerson.photo_url) {
        console.log(`\n✅ Found photo for: ${person.full_name}`);
        console.log(`   Email: ${person.email}`);
        console.log(`   Photo URL: ${scrapedPerson.photo_url}`);
        console.log(`   Profile URL: ${scrapedPerson.profile_url || 'N/A'}`);

        totalFound++;

        // Update in Strapi
        console.log(`   📤 Updating in database...`);
        const updated = await updatePhotoInStrapi(type, person.id, scrapedPerson.photo_url);

        if (updated) {
          console.log(`   ✅ Updated successfully!`);
          totalUpdated++;
        } else {
          console.log(`   ❌ Failed to update`);
        }

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.log(`\n❌ No photo found for: ${person.full_name}`);
        console.log(`   Email: ${person.email}`);
        if (scrapedPerson) {
          console.log(`   Profile URL: ${scrapedPerson.profile_url || 'N/A'}`);
          console.log(`   Note: Person found in scraped data but has no photo_url`);
        } else {
          console.log(`   Note: Person not found in scraped data`);
        }
        totalMissing++;
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY:');
  console.log('='.repeat(60));
  console.log(`Total people missing photos: ${totalFound + totalMissing}`);
  console.log(`Photos found in scraped data: ${totalFound}`);
  console.log(`Successfully updated: ${totalUpdated}`);
  console.log(`Still missing: ${totalMissing}`);
  console.log('='.repeat(60));

  if (totalMissing > 0) {
    console.log('\n⚠️  Some people still have missing photos.');
    console.log('   These may need to be added manually or their profile pages');
    console.log('   may not have photos on the current website.\n');
  } else if (totalUpdated === totalFound) {
    console.log('\n🎉 All missing photos have been found and updated!\n');
  }
}

main().catch(console.error);
