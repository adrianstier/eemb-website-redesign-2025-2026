#!/usr/bin/env node

/**
 * Fetch links from ORCID API for all faculty
 * ORCID provides structured data about researchers including:
 * - Websites
 * - Social media profiles
 * - Institutional affiliations
 * - Research IDs
 */

const https = require('https');

function fetchORCID(orcidId) {
  return new Promise((resolve, reject) => {
    const url = `https://pub.orcid.org/v3.0/${orcidId}`;

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
            resolve(JSON.parse(data));
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

function extractLinksFromORCID(orcidData) {
  const links = {
    websites: [],
    researcherUrls: [],
    keywords: [],
    otherNames: []
  };

  try {
    // Extract researcher URLs
    if (orcidData.person && orcidData.person['researcher-urls'] &&
        orcidData.person['researcher-urls']['researcher-url']) {
      const urls = orcidData.person['researcher-urls']['researcher-url'];
      urls.forEach(urlObj => {
        if (urlObj.url && urlObj.url.value) {
          links.researcherUrls.push({
            name: urlObj['url-name'] || 'Website',
            url: urlObj.url.value
          });
        }
      });
    }

    // Extract keywords
    if (orcidData.person && orcidData.person.keywords &&
        orcidData.person.keywords.keyword) {
      const keywords = orcidData.person.keywords.keyword;
      links.keywords = keywords.map(k => k.content).filter(Boolean);
    }

    // Extract other names
    if (orcidData.person && orcidData.person['other-names'] &&
        orcidData.person['other-names']['other-name']) {
      const otherNames = orcidData.person['other-names']['other-name'];
      links.otherNames = otherNames.map(n => n.content).filter(Boolean);
    }

    // Extract external IDs
    if (orcidData.person && orcidData.person['external-identifiers'] &&
        orcidData.person['external-identifiers']['external-identifier']) {
      const externalIds = orcidData.person['external-identifiers']['external-identifier'];
      links.externalIds = externalIds.map(id => ({
        type: id['external-id-type'],
        value: id['external-id-value'],
        url: id['external-id-url'] ? id['external-id-url'].value : null
      })).filter(id => id.url);
    }
  } catch (error) {
    console.error('Error extracting ORCID data:', error.message);
  }

  return links;
}

async function fetchAllORCIDLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('\\n🔍 Fetching faculty with ORCID IDs...\\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  const facultyWithORCID = faculty.filter(p => p.attributes.orcid);

  console.log(`Found ${facultyWithORCID.length} faculty with ORCID IDs\\n`);
  console.log('═══════════════════════════════════════════════════════════\\n');

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const person of facultyWithORCID) {
    const attrs = person.attributes;
    const name = attrs.fullName;
    const orcidId = attrs.orcid;

    console.log(`\\n👤 ${name}`);
    console.log(`   ORCID: ${orcidId}`);

    try {
      const orcidData = await fetchORCID(orcidId);
      const links = extractLinksFromORCID(orcidData);

      console.log(`   ✅ Fetched ORCID data`);

      if (links.researcherUrls.length > 0) {
        console.log(`   🔗 Researcher URLs:`);
        links.researcherUrls.forEach(url => {
          console.log(`      ${url.name}: ${url.url}`);
        });
      }

      if (links.externalIds && links.externalIds.length > 0) {
        console.log(`   🆔 External IDs:`);
        links.externalIds.forEach(id => {
          console.log(`      ${id.type}: ${id.url || id.value}`);
        });
      }

      if (links.keywords.length > 0) {
        console.log(`   🏷️  Keywords: ${links.keywords.slice(0, 5).join(', ')}`);
      }

      results.push({
        name,
        orcidId,
        ...links
      });

      successCount++;
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      errorCount++;
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\\n\\n═══════════════════════════════════════════════════════════');
  console.log('📊 ORCID FETCH SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total ORCID IDs: ${facultyWithORCID.length}`);
  console.log(`✅ Successfully fetched: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('═══════════════════════════════════════════════════════════');

  // Save results
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, '..', 'orcid-links-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\\n📄 Results saved: orcid-links-data.json`);

  // Print summary of new links found
  const newLinksFound = results.filter(r => r.researcherUrls.length > 0);
  if (newLinksFound.length > 0) {
    console.log(`\\n🔗 Found researcher URLs for ${newLinksFound.length} faculty:\\n`);
    newLinksFound.forEach(faculty => {
      console.log(`${faculty.name}:`);
      faculty.researcherUrls.forEach(url => {
        console.log(`   ${url.name}: ${url.url}`);
      });
      console.log('');
    });
  }

  console.log('\\n✨ Done!\\n');
}

fetchAllORCIDLinks().catch(console.error);
