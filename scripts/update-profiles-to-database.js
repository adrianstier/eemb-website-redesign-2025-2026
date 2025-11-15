#!/usr/bin/env node

/**
 * Update Database with Full Profile Data
 * Takes the scraped profile data and updates the Strapi database
 */

const fs = require('fs');
const path = require('path');

async function updateProfiles() {
  console.log('🔄 Starting database update with full profile data...\n');

  // Load scraped data
  const scrapedDataPath = path.join(__dirname, 'full-profiles-data.json');
  if (!fs.existsSync(scrapedDataPath)) {
    console.error('❌ Error: full-profiles-data.json not found!');
    console.error('   Please run: node scripts/scrape-full-profiles.js first');
    process.exit(1);
  }

  const scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf-8'));
  console.log(`📊 Loaded ${scrapedData.profiles.length} scraped profiles\n`);

  // Connect to Strapi API
  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  // Fetch all faculty
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  if (!response.ok) {
    console.error('❌ Failed to fetch faculty from API');
    process.exit(1);
  }

  const data = await response.json();
  const allFaculty = data.data.map(person => ({
    id: person.id,
    ...person.attributes
  }));

  console.log(`📚 Loaded ${allFaculty.length} faculty from database\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const scrapedProfile of scrapedData.profiles) {
    // Find matching faculty by name or email
    const dbPerson = allFaculty.find(p =>
      (p.fullName && scrapedProfile.name && p.fullName.toLowerCase() === scrapedProfile.name.toLowerCase()) ||
      (p.email && scrapedProfile.email && p.email.toLowerCase() === scrapedProfile.email.toLowerCase())
    );

    if (!dbPerson) {
      console.log(`⚠️  No match found for: ${scrapedProfile.name}`);
      skipped++;
      continue;
    }

    // Prepare update data
    const updates = {};
    let hasUpdates = false;

    // Only update if we have new data and it's not already populated
    if (scrapedProfile.bio && (!dbPerson.bio || dbPerson.bio.length < 100)) {
      updates.bio = scrapedProfile.bio;
      hasUpdates = true;
    }

    if (scrapedProfile.shortBio && !dbPerson.shortBio) {
      updates.shortBio = scrapedProfile.shortBio;
      hasUpdates = true;
    }

    if (scrapedProfile.researchInterests && scrapedProfile.researchInterests.length > 0) {
      // Always update research interests if we have them
      updates.researchInterests = scrapedProfile.researchInterests;
      hasUpdates = true;
    }

    if (scrapedProfile.website && !dbPerson.labWebsite) {
      updates.labWebsite = scrapedProfile.website;
      hasUpdates = true;
    }

    if (scrapedProfile.googleScholar && !dbPerson.googleScholar) {
      updates.googleScholar = scrapedProfile.googleScholar;
      hasUpdates = true;
    }

    if (scrapedProfile.orcid && !dbPerson.orcid) {
      updates.orcid = scrapedProfile.orcid;
      hasUpdates = true;
    }

    // Update email, phone, office if they're better than what we have
    if (scrapedProfile.email && scrapedProfile.email !== dbPerson.email) {
      updates.email = scrapedProfile.email;
      hasUpdates = true;
    }

    if (scrapedProfile.phone && scrapedProfile.phone !== dbPerson.phone) {
      updates.phone = scrapedProfile.phone;
      hasUpdates = true;
    }

    if (scrapedProfile.office && scrapedProfile.office !== dbPerson.office) {
      updates.office = scrapedProfile.office;
      hasUpdates = true;
    }

    if (scrapedProfile.title && scrapedProfile.title !== dbPerson.title) {
      updates.title = scrapedProfile.title;
      hasUpdates = true;
    }

    if (!hasUpdates) {
      continue;
    }

    // Perform update via API
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
        console.error(`❌ Failed to update ${scrapedProfile.name}: ${updateResponse.statusText}`);
        console.error(`   Response: ${errorText}`);
        errors++;
        continue;
      }

      console.log(`✅ Updated ${scrapedProfile.name}:`);
      if (updates.bio) console.log(`   📝 Bio (${updates.bio.length} chars)`);
      if (updates.shortBio) console.log(`   📝 Short Bio`);
      if (updates.researchInterests) console.log(`   🔬 Research Interests (${updates.researchInterests.length} areas)`);
      if (updates.labWebsite) console.log(`   🌐 Website: ${updates.labWebsite}`);
      if (updates.googleScholar) console.log(`   📚 Google Scholar`);
      if (updates.orcid) console.log(`   🆔 ORCID`);
      if (updates.email) console.log(`   📧 Email: ${updates.email}`);
      if (updates.phone) console.log(`   📱 Phone: ${updates.phone}`);
      if (updates.office) console.log(`   📍 Office: ${updates.office}`);
      if (updates.title) console.log(`   📋 Title: ${updates.title}`);
      updated++;

    } catch (error) {
      console.error(`❌ Error updating ${scrapedProfile.name}:`, error.message);
      errors++;
    }
  }

  console.log(`\n\n✨ Update complete!`);
  console.log(`📊 Statistics:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
}

updateProfiles().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
