#!/usr/bin/env node

/**
 * Search for ORCID IDs using the ORCID Public API
 * https://info.orcid.org/documentation/integration-guide/working-with-the-orcid-public-api/
 */

const https = require('https');

function searchORCID(firstName, lastName, affiliation = 'UC Santa Barbara') {
  return new Promise((resolve, reject) => {
    // Build search query
    const query = `given-names:${firstName} AND family-name:${lastName} AND affiliation-org-name:"${affiliation}"`;
    const encodedQuery = encodeURIComponent(query);

    const url = `https://pub.orcid.org/v3.0/search/?q=${encodedQuery}`;

    https.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (error) {
            reject(new Error('Failed to parse ORCID response'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function searchAllFacultyORCIDs() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('\\n🔍 Searching for ORCID IDs for faculty...\\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  // Filter faculty without ORCID IDs
  const facultyWithoutORCID = faculty.filter(p => !p.attributes.orcid);

  console.log(`Found ${facultyWithoutORCID.length} faculty without ORCID IDs\\n`);
  console.log('═══════════════════════════════════════════════════════════\\n');

  const results = [];
  let found = 0;
  let notFound = 0;
  let errors = 0;

  for (const person of facultyWithoutORCID) {
    const attrs = person.attributes;
    const fullName = attrs.fullName;
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];

    console.log(`\\n👤 ${fullName}`);
    console.log(`   Searching: ${firstName} ${lastName} @ UC Santa Barbara`);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit

      const searchResults = await searchORCID(firstName, lastName);

      if (searchResults['num-found'] && searchResults['num-found'] > 0) {
        const records = searchResults.result || [];

        console.log(`   ✅ Found ${records.length} potential match(es):`);

        records.slice(0, 3).forEach((record, index) => {
          const orcidId = record['orcid-identifier']?.path;
          const creditName = record['credit-name']?.value;
          const institutions = record['institution-name'] || [];

          console.log(`\\n      ${index + 1}. ORCID: ${orcidId}`);
          if (creditName) console.log(`         Name: ${creditName}`);
          if (institutions.length > 0) {
            console.log(`         Affiliations: ${institutions.slice(0, 2).join(', ')}`);
          }
        });

        // Take the first match (most likely)
        if (records.length > 0) {
          const bestMatch = records[0];
          const orcidId = bestMatch['orcid-identifier']?.path;

          results.push({
            name: fullName,
            orcidId,
            numResults: records.length,
            creditName: bestMatch['credit-name']?.value
          });

          found++;
        }
      } else {
        console.log(`   ❌ No ORCID found`);
        notFound++;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      errors++;
    }
  }

  console.log('\\n\\n═══════════════════════════════════════════════════════════');
  console.log('📊 ORCID SEARCH SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   Total searched: ${facultyWithoutORCID.length}`);
  console.log(`   ✅ Found: ${found}`);
  console.log(`   ❌ Not found: ${notFound}`);
  console.log(`   ⚠️  Errors: ${errors}`);
  console.log('═══════════════════════════════════════════════════════════');

  // Save results
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, '..', 'orcid-search-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\\n📄 Results saved: orcid-search-results.json`);

  // Print suggested updates
  if (results.length > 0) {
    console.log(`\\n\\n📋 SUGGESTED ORCID IDs TO ADD:\\n`);
    console.log('Copy and paste these into a script to update the database:\\n');
    console.log('const orcidUpdates = {');
    results.forEach(r => {
      console.log(`  '${r.name}': '${r.orcidId}',  // ${r.numResults} match(es)`);
    });
    console.log('};');
  }

  console.log('\\n✨ Done!\\n');
}

searchAllFacultyORCIDs().catch(console.error);
