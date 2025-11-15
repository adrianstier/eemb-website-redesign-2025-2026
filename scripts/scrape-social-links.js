#!/usr/bin/env node

/**
 * Scrape social/academic links for all faculty from their EEMB profile pages
 */

const https = require('https');

async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractLinks(html, fullName) {
  const links = {
    labWebsite: null,
    googleScholar: null,
    orcid: null
  };

  // Extract Google Scholar
  const scholarMatch = html.match(/https?:\/\/scholar\.google\.com\/citations\?user=[^"'\s]+/i);
  if (scholarMatch) {
    links.googleScholar = scholarMatch[0];
  }

  // Extract ORCID
  const orcidMatch = html.match(/https?:\/\/orcid\.org\/(\d{4}-\d{4}-\d{4}-\d{3}[0-9X])/i);
  if (orcidMatch) {
    links.orcid = orcidMatch[1]; // Just the ID, not full URL
  }

  // Extract lab website - look for common patterns
  // Pattern 1: Links in the profile that aren't social media
  const linkMatches = html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*(?:lab|website|research group|home ?page))/gi);
  for (const match of linkMatches) {
    const url = match[1];
    // Skip social media and internal links
    if (!url.includes('scholar.google') &&
        !url.includes('orcid.org') &&
        !url.includes('twitter.com') &&
        !url.includes('linkedin.com') &&
        !url.includes('facebook.com') &&
        !url.includes('eemb.ucsb.edu') &&
        url.startsWith('http')) {
      links.labWebsite = url;
      break;
    }
  }

  // Pattern 2: Look for external links in specific sections
  if (!links.labWebsite) {
    const externalLinks = html.matchAll(/<a[^>]+href=["'](https?:\/\/[^"']+)["'][^>]*>/gi);
    for (const match of externalLinks) {
      const url = match[1];
      // Look for .edu or .org domains that aren't social media
      if ((url.includes('.edu') || url.includes('.org')) &&
          !url.includes('scholar.google') &&
          !url.includes('orcid.org') &&
          !url.includes('twitter.com') &&
          !url.includes('linkedin.com') &&
          !url.includes('facebook.com') &&
          !url.includes('eemb.ucsb.edu')) {
        links.labWebsite = url;
        break;
      }
    }
  }

  return links;
}

async function scrapeSocialLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Fetching all faculty...\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  console.log(`Found ${faculty.length} faculty members\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const person of faculty) {
    const fullName = person.attributes.fullName;
    const eembUrl = person.attributes.eemb_url;

    if (!eembUrl) {
      console.log(`⏭️  Skipping ${fullName} (no EEMB URL)`);
      skipped++;
      continue;
    }

    console.log(`\n📄 Scraping ${fullName}...`);
    console.log(`   URL: ${eembUrl}`);

    try {
      // Fetch the profile page
      const html = await fetchHTML(eembUrl);

      // Extract links
      const links = extractLinks(html, fullName);

      console.log(`   Found:`);
      console.log(`     Lab Website: ${links.labWebsite || 'none'}`);
      console.log(`     Google Scholar: ${links.googleScholar || 'none'}`);
      console.log(`     ORCID: ${links.orcid || 'none'}`);

      // Only update if we found at least one link
      if (links.labWebsite || links.googleScholar || links.orcid) {
        const updateData = {};
        if (links.labWebsite) updateData.labWebsite = links.labWebsite;
        if (links.googleScholar) updateData.googleScholar = links.googleScholar;
        if (links.orcid) updateData.orcid = links.orcid;

        const updateResponse = await fetch(`${API_URL}/faculties/${person.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: updateData })
        });

        if (updateResponse.ok) {
          console.log(`   ✅ Updated!`);
          updated++;
        } else {
          const errorText = await updateResponse.text();
          console.log(`   ❌ Failed to update: ${updateResponse.status} - ${errorText}`);
          errors++;
        }
      } else {
        console.log(`   ⏭️  No links found`);
        skipped++;
      }

      // Rate limit: wait 500ms between requests
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.log(`   ❌ Error scraping: ${error.message}`);
      errors++;
    }
  }

  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 Summary:');
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📝 Total: ${faculty.length}`);
  console.log('═══════════════════════════════════════\n');
}

scrapeSocialLinks().catch(console.error);
