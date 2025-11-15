#!/usr/bin/env node

/**
 * Scrape all social links, Google Scholar, and lab websites from EEMB faculty profiles
 * https://www.eemb.ucsb.edu/people/faculty
 */

const https = require('https');

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractFacultyListFromHTML(html) {
  const facultyProfiles = [];

  // Extract all profile links from the faculty directory
  // Pattern: href="/people/faculty/[slug]"
  const profileLinkPattern = /href="(\/people\/faculty\/[^"]+)"/gi;
  const matches = html.matchAll(profileLinkPattern);

  const uniqueProfiles = new Set();
  for (const match of matches) {
    const profilePath = match[1];
    if (!profilePath.includes('?') && !profilePath.includes('#')) {
      uniqueProfiles.add(profilePath);
    }
  }

  return Array.from(uniqueProfiles).map(path => ({
    url: `https://www.eemb.ucsb.edu${path}`,
    slug: path.split('/').pop()
  }));
}

function extractNameFromHTML(html) {
  // Extract name from page title or h1
  const titleMatch = html.match(/<title>([^<|]+)/i);
  if (titleMatch) {
    return titleMatch[1].trim().replace(' | EEMB', '');
  }

  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].trim();
  }

  return null;
}

function extractLinksFromProfile(html) {
  const links = {
    labWebsite: null,
    googleScholar: null,
    orcid: null,
    twitter: null,
    linkedin: null,
    github: null
  };

  // Extract Google Scholar
  const scholarMatch = html.match(/https?:\/\/scholar\.google\.com\/citations\?[^"'\s<>]+/i);
  if (scholarMatch) {
    links.googleScholar = scholarMatch[0]
      .replace(/&amp;/g, '&')
      .replace(/&hl=[^&]+/, '')
      .replace(/&oi=[^&]+/, '');
  }

  // Extract ORCID
  const orcidMatch = html.match(/orcid\.org\/([\d]{4}-[\d]{4}-[\d]{4}-[\d]{3}[X\d])/i);
  if (orcidMatch) {
    links.orcid = orcidMatch[1];
  }

  // Extract Twitter
  const twitterMatch = html.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i);
  if (twitterMatch && !twitterMatch[1].includes('intent') && !twitterMatch[1].includes('share')) {
    links.twitter = `https://twitter.com/${twitterMatch[1]}`;
  }

  // Extract LinkedIn
  const linkedinMatch = html.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
  if (linkedinMatch) {
    links.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
  }

  // Extract GitHub
  const githubMatch = html.match(/github\.com\/([a-zA-Z0-9-]+)(?:\/|\"|'|\s|$)/i);
  if (githubMatch && !githubMatch[1].includes('button')) {
    links.github = `https://github.com/${githubMatch[1]}`;
  }

  // Extract lab website - look for external links
  const allLinks = html.matchAll(/href=["']([^"']+)["']/gi);

  for (const match of allLinks) {
    const url = match[1];

    // Skip if already found a lab website
    if (links.labWebsite) continue;

    // Skip non-http links
    if (!url.startsWith('http')) continue;

    // Skip if it's a social media or known service
    if (url.includes('scholar.google') ||
        url.includes('orcid.org') ||
        url.includes('twitter.com') ||
        url.includes('x.com') ||
        url.includes('linkedin.com') ||
        url.includes('facebook.com') ||
        url.includes('instagram.com') ||
        url.includes('youtube.com') ||
        url.includes('github.com') ||
        url.includes('researchgate.net') ||
        url.includes('eemb.ucsb.edu/people')) {
      continue;
    }

    // Look for lab-related URLs
    if (url.match(/lab\./) ||
        url.match(/research/) ||
        url.match(/\.edu\/[a-z\-]+\/?$/) ||
        url.includes('eemb.ucsb.edu') && url.includes('lab')) {
      links.labWebsite = url;
      break;
    }
  }

  // Alternative: look in the main content area for "Website:" or "Lab:" labels
  const websitePattern = /(?:Website|Lab|Research Group|Personal Website|Lab Website)[:\s]*<[^>]*>.*?href=["']([^"']+)["']/is;
  const websiteMatch = html.match(websitePattern);
  if (websiteMatch && !links.labWebsite) {
    const url = websiteMatch[1];
    if (url.startsWith('http') &&
        !url.includes('scholar.google') &&
        !url.includes('orcid.org')) {
      links.labWebsite = url;
    }
  }

  return links;
}

async function scrapeFacultyProfiles() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Fetching EEMB faculty directory page...\n');

  // Fetch the main directory page
  const directoryHTML = await fetchURL('https://www.eemb.ucsb.edu/people/faculty');
  const facultyProfiles = extractFacultyListFromHTML(directoryHTML);

  console.log(`📋 Found ${facultyProfiles.length} faculty profiles to scrape\n`);

  // Get all faculty from our database
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const dbFaculty = data.data;

  console.log(`💾 Found ${dbFaculty.length} faculty in database\n`);

  const results = [];
  let scraped = 0;
  let matched = 0;
  let updated = 0;
  let errors = 0;

  // Scrape each profile
  for (const profile of facultyProfiles) {
    try {
      console.log(`\n🌐 Fetching: ${profile.url}`);

      // Add delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 1000));

      const html = await fetchURL(profile.url);
      const name = extractNameFromHTML(html);
      const links = extractLinksFromProfile(html);

      scraped++;

      console.log(`   Name: ${name || 'Unknown'}`);
      console.log(`   Links found:`);
      console.log(`     Lab: ${links.labWebsite || 'none'}`);
      console.log(`     Scholar: ${links.googleScholar || 'none'}`);
      console.log(`     ORCID: ${links.orcid || 'none'}`);
      console.log(`     Twitter: ${links.twitter || 'none'}`);
      console.log(`     LinkedIn: ${links.linkedin || 'none'}`);
      console.log(`     GitHub: ${links.github || 'none'}`);

      results.push({
        name,
        slug: profile.slug,
        ...links
      });

      // Try to match with database and update
      if (name) {
        const dbPerson = dbFaculty.find(p => {
          const fullName = p.attributes.fullName.toLowerCase();
          const searchName = name.toLowerCase();

          // Try exact match
          if (fullName === searchName) return true;

          // Try last name match
          const lastName = p.attributes.lastName?.toLowerCase();
          if (lastName && searchName.includes(lastName) && lastName.length > 3) return true;

          return false;
        });

        if (dbPerson) {
          matched++;
          console.log(`   ✓ Matched with: ${dbPerson.attributes.fullName}`);

          // Prepare update data
          const updateData = {};

          // Only include labWebsite if it's a valid URL
          if (links.labWebsite && links.labWebsite.match(/^https?:\/\//)) {
            updateData.labWebsite = links.labWebsite;
          }

          if (links.googleScholar) {
            updateData.googleScholar = links.googleScholar;
          }

          if (links.orcid) {
            updateData.orcid = links.orcid;
          }

          // Update in database if we have any links
          if (Object.keys(updateData).length > 0) {
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
                console.log(`   ❌ Failed to update: ${updateResponse.status}`);
                console.log(`   Error: ${errorText}`);
                errors++;
              }
            } catch (error) {
              console.log(`   ❌ Error updating: ${error.message}`);
              errors++;
            }
          } else {
            console.log(`   ⏭️  No links to update`);
          }
        } else {
          console.log(`   ⚠️  Not found in database`);
        }
      }

    } catch (error) {
      console.error(`   ❌ Error scraping ${profile.url}:`, error.message);
      errors++;
    }
  }

  // Print summary
  console.log('\n\n════════════════════════════════════════════════════');
  console.log('📊 SCRAPING SUMMARY');
  console.log('════════════════════════════════════════════════════');
  console.log(`   🌐 Profiles scraped: ${scraped}`);
  console.log(`   🔗 Matched with DB: ${matched}`);
  console.log(`   ✅ Updated in DB: ${updated}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('════════════════════════════════════════════════════\n');

  // Print all results as JSON for reference
  console.log('📋 Full results (copy to use elsewhere):\n');
  console.log(JSON.stringify(results, null, 2));

  console.log('\n✨ Done! Refresh your browser to see the updated links.\n');
}

scrapeFacultyProfiles().catch(console.error);
