#!/usr/bin/env node

/**
 * Scrape social/academic links from EEMB faculty directory page
 * https://www.eemb.ucsb.edu/people/faculty
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

function extractLinksFromHTML(html) {
  const facultyData = [];

  // The EEMB page has faculty profiles with structured data
  // Look for patterns like: href="/people/faculty/[slug]" and associated links

  // Extract all faculty profile sections
  const profilePattern = /<article[^>]*class="[^"]*node--type-person[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  const profiles = html.matchAll(profilePattern);

  for (const profile of profiles) {
    const profileHtml = profile[1];

    // Extract name
    const nameMatch = profileHtml.match(/<h2[^>]*><a[^>]*>([^<]+)<\/a><\/h2>/i);
    const name = nameMatch ? nameMatch[1].trim() : null;

    // Extract profile link to get more details
    const profileLinkMatch = profileHtml.match(/href="(\/people\/faculty\/[^"]+)"/i);
    const profilePath = profileLinkMatch ? profileLinkMatch[1] : null;

    if (name && profilePath) {
      facultyData.push({
        name,
        profileUrl: `https://www.eemb.ucsb.edu${profilePath}`
      });
    }
  }

  return facultyData;
}

async function extractLinksFromProfile(profileUrl) {
  console.log(`  Fetching: ${profileUrl}`);

  try {
    const html = await fetchHTML(profileUrl);

    const links = {
      labWebsite: null,
      googleScholar: null,
      orcid: null
    };

    // Extract Google Scholar
    const scholarMatch = html.match(/https?:\/\/scholar\.google\.com\/citations\?[^"'\s]+/i);
    if (scholarMatch) {
      links.googleScholar = scholarMatch[0].replace(/&amp;/g, '&');
    }

    // Extract ORCID
    const orcidMatch = html.match(/orcid\.org\/(\d{4}-\d{4}-\d{4}-\d{3}[0-9X])/i);
    if (orcidMatch) {
      links.orcid = orcidMatch[1];
    }

    // Extract lab website
    // Look for "Lab Website", "Website", "Lab Page", "Research Group" links
    const labPatterns = [
      /<a[^>]+href=["']([^"']+)["'][^>]*>(?:Lab Website|Website|Lab Page|Research Group|Personal Website)<\/a>/gi,
      /href=["']([^"']+)["'][^>]*>(?:Lab Website|Website|Lab Page|Research Group)<\/a>/gi
    ];

    for (const pattern of labPatterns) {
      const match = html.match(pattern);
      if (match) {
        const urlMatch = match[0].match(/href=["']([^"']+)["']/);
        if (urlMatch) {
          const url = urlMatch[1];
          // Skip social media and internal links
          if (!url.includes('scholar.google') &&
              !url.includes('orcid.org') &&
              !url.includes('twitter.com') &&
              !url.includes('linkedin.com') &&
              !url.includes('facebook.com') &&
              !url.includes('instagram.com') &&
              !url.startsWith('/') &&
              url.startsWith('http')) {
            links.labWebsite = url;
            break;
          }
        }
      }
    }

    // Alternative: Look for external links in the contact section
    if (!links.labWebsite) {
      const externalLinks = html.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi);
      for (const match of externalLinks) {
        const url = match[1];
        // Look for .edu or research-related domains
        if ((url.includes('lab.') || url.includes('research') || url.match(/\.edu\/[a-z]+\/?$/)) &&
            !url.includes('scholar.google') &&
            !url.includes('orcid.org') &&
            !url.includes('twitter.com') &&
            !url.includes('linkedin.com') &&
            !url.includes('facebook.com') &&
            !url.includes('instagram.com') &&
            !url.includes('eemb.ucsb.edu/people')) {
          links.labWebsite = url;
          break;
        }
      }
    }

    return links;
  } catch (error) {
    console.error(`  Error fetching ${profileUrl}:`, error.message);
    return { labWebsite: null, googleScholar: null, orcid: null };
  }
}

async function scrapeAllFacultyLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Fetching EEMB faculty directory page...\n');

  // First, get the main faculty directory page
  const directoryHtml = await fetchHTML('https://www.eemb.ucsb.edu/people/faculty');
  const facultyList = extractLinksFromHTML(directoryHtml);

  console.log(`Found ${facultyList.length} faculty profiles on EEMB site\n`);

  // Get all faculty from our database
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const dbFaculty = data.data;

  console.log(`Found ${dbFaculty.length} faculty in our database\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  // For each faculty on the EEMB site
  for (const faculty of facultyList) {
    console.log(`\n📄 ${faculty.name}`);

    // Find matching person in our database
    const dbPerson = dbFaculty.find(p =>
      p.attributes.fullName.toLowerCase() === faculty.name.toLowerCase() ||
      faculty.name.toLowerCase().includes(p.attributes.lastName.toLowerCase())
    );

    if (!dbPerson) {
      console.log(`  ⏭️  Not found in database`);
      skipped++;
      continue;
    }

    // Fetch their profile page to get links
    const links = await extractLinksFromProfile(faculty.profileUrl);

    console.log(`  Found:`);
    console.log(`    Lab: ${links.labWebsite || 'none'}`);
    console.log(`    Scholar: ${links.googleScholar || 'none'}`);
    console.log(`    ORCID: ${links.orcid || 'none'}`);

    // Update if we found at least one link
    if (links.labWebsite || links.googleScholar || links.orcid) {
      const updateData = {};
      if (links.labWebsite) updateData.labWebsite = links.labWebsite;
      if (links.googleScholar) updateData.googleScholar = links.googleScholar;
      if (links.orcid) updateData.orcid = links.orcid;

      const updateResponse = await fetch(`${API_URL}/faculties/${dbPerson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updateData })
      });

      if (updateResponse.ok) {
        console.log(`  ✅ Updated in database`);
        updated++;
      } else {
        const errorText = await updateResponse.text();
        console.log(`  ❌ Failed to update: ${updateResponse.status}`);
        errors++;
      }
    } else {
      console.log(`  ⏭️  No links found`);
      skipped++;
    }

    // Rate limit: wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 Summary:');
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📝 Total: ${facultyList.length}`);
  console.log('═══════════════════════════════════════\n');
  console.log('✨ Done! Refresh your browser to see the links.\n');
}

scrapeAllFacultyLinks().catch(console.error);
