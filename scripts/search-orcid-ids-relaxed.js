#!/usr/bin/env node

/**
 * Search for ORCID IDs using relaxed search criteria
 * (without strict affiliation requirement)
 * https://info.orcid.org/documentation/integration-guide/working-with-the-orcid-public-api/
 */

const https = require('https');

function searchORCID(firstName, lastName) {
  return new Promise((resolve, reject) => {
    // More relaxed search - just name, no strict affiliation requirement
    const query = `given-names:${firstName} AND family-name:${lastName}`;
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

  console.log('\n🔍 Searching for ORCID IDs (relaxed search)...\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  // Filter faculty without ORCID IDs
  const facultyWithoutORCID = faculty.filter(p => !p.attributes.orcid);

  console.log(`Found ${facultyWithoutORCID.length} faculty without ORCID IDs\n`);
  console.log('═══════════════════════════════════════════════════════════\n');

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

    console.log(`\n👤 ${fullName}`);
    console.log(`   Searching: ${firstName} ${lastName}`);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit

      const searchResults = await searchORCID(firstName, lastName);

      if (searchResults['num-found'] && searchResults['num-found'] > 0) {
        const records = searchResults.result || [];

        console.log(`   ✅ Found ${records.length} potential match(es)`);

        // Filter for likely UCSB matches
        const ucsbMatches = records.filter(record => {
          const institutions = record['institution-name'] || [];
          return institutions.some(inst =>
            inst.value && (
              inst.value.toLowerCase().includes('santa barbara') ||
              inst.value.toLowerCase().includes('ucsb')
            )
          );
        });

        if (ucsbMatches.length > 0) {
          console.log(`   🎯 Found ${ucsbMatches.length} UCSB-affiliated match(es):`);

          ucsbMatches.slice(0, 3).forEach((record, index) => {
            const orcidId = record['orcid-identifier']?.path;
            const institutions = record['institution-name'] || [];

            console.log(`\n      ${index + 1}. ORCID: ${orcidId}`);
            if (institutions.length > 0) {
              console.log(`         Affiliations: ${institutions.slice(0, 3).map(i => i.value).join(', ')}`);
            }
          });

          // Take the first UCSB match
          const bestMatch = ucsbMatches[0];
          const orcidId = bestMatch['orcid-identifier']?.path;

          results.push({
            name: fullName,
            orcidId,
            numResults: ucsbMatches.length,
            totalResults: records.length,
            institutions: bestMatch['institution-name']?.slice(0, 3).map(i => i.value) || []
          });

          found++;
        } else if (records.length > 0) {
          console.log(`   ⚠️  Found ${records.length} match(es) but none with UCSB affiliation`);

          // Show top match anyway
          const topMatch = records[0];
          const orcidId = topMatch['orcid-identifier']?.path;
          const institutions = topMatch['institution-name'] || [];

          console.log(`\n      Top match: ${orcidId}`);
          if (institutions.length > 0) {
            console.log(`      Affiliations: ${institutions.slice(0, 2).map(i => i.value).join(', ')}`);
          }

          results.push({
            name: fullName,
            orcidId,
            numResults: 0, // 0 UCSB matches
            totalResults: records.length,
            institutions: institutions.slice(0, 3).map(i => i.value),
            warning: 'No UCSB affiliation found'
          });

          found++;
        } else {
          console.log(`   ❌ No matches found`);
          notFound++;
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

  console.log('\n\n═══════════════════════════════════════════════════════════');
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
  const outputPath = path.join(__dirname, '..', 'orcid-search-results-relaxed.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n📄 Results saved: orcid-search-results-relaxed.json`);

  // Print suggested updates for UCSB-affiliated matches
  const ucsbMatches = results.filter(r => r.numResults > 0);
  if (ucsbMatches.length > 0) {
    console.log(`\n\n📋 SUGGESTED ORCID IDs (UCSB-affiliated: ${ucsbMatches.length}):\n`);
    console.log('const orcidUpdates = {');
    ucsbMatches.forEach(r => {
      console.log(`  '${r.name}': '${r.orcidId}',  // ${r.numResults} UCSB match(es) from ${r.totalResults} total`);
    });
    console.log('};');
  }

  // Print potential matches without UCSB affiliation
  const nonUcsbMatches = results.filter(r => r.warning);
  if (nonUcsbMatches.length > 0) {
    console.log(`\n\n⚠️  POTENTIAL MATCHES (no UCSB affiliation: ${nonUcsbMatches.length}):\n`);
    console.log('// Review these manually - they may have moved institutions or listed affiliation differently');
    console.log('const potentialMatches = {');
    nonUcsbMatches.forEach(r => {
      const affiliation = r.institutions.length > 0 ? r.institutions[0] : 'Unknown';
      console.log(`  '${r.name}': '${r.orcidId}',  // ${r.totalResults} match(es), affiliation: ${affiliation}`);
    });
    console.log('};');
  }

  console.log('\n✨ Done!\n');
}

searchAllFacultyORCIDs().catch(console.error);
