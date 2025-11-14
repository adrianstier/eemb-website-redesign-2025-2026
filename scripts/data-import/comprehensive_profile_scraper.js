#!/usr/bin/env node

/**
 * Comprehensive Profile Scraper
 * Visits each person's profile page and extracts ALL available information:
 * - Bio (full and short)
 * - Research interests
 * - Social media (Google Scholar, ORCID, Twitter, LinkedIn)
 * - Lab/Personal website
 * - Phone, Office, Email
 * - Photo
 */

const https = require('https');
const http = require('http');

const STRAPI_URL = 'http://localhost:1337';

// Fetch helpers
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function fetchJSON(url) {
  const response = await fetch(url);
  return response.json();
}

// Extract helpers
function extractText(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : null;
}

function extractPhoto(html) {
  // Look for profile photos in common locations
  const patterns = [
    /class="field-name-field-photo"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i,
    /<img[^>]+class="[^"]*person-photo[^"]*"[^>]+src="([^"]+)"/i,
    /<img[^>]+src="([^"]*styles\/medium[^"]+)"/i,
    /<img[^>]+src="([^"]*files\/people[^"]+)"/i,
    /<div[^>]+class="[^"]*user-picture[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      let url = match[1];

      if (url.startsWith('//')) {
        url = 'https:' + url;
      } else if (url.startsWith('/')) {
        url = 'https://www.eemb.ucsb.edu' + url;
      }

      // Skip default placeholders
      if (!url.includes('default-avatar') &&
          !url.includes('default_images') &&
          !url.includes('portrait-default')) {
        return url;
      }
    }
  }
  return null;
}

function extractBio(html) {
  const patterns = [
    /class="field-name-body"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
    /class="field-type-text-with-summary"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
    /<div class="field-item[^"]*"[^>]*><p>([\s\S]*?)<\/p>/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      let bio = match[1];
      // Clean up HTML tags
      bio = bio.replace(/<div[^>]*>/gi, '').replace(/<\/div>/gi, '\n');
      bio = bio.replace(/<p[^>]*>/gi, '\n').replace(/<\/p>/gi, '\n');
      bio = bio.replace(/<br\s*\/?>/gi, '\n');
      bio = bio.replace(/<[^>]+>/g, '');
      bio = bio.replace(/&nbsp;/g, ' ');
      bio = bio.replace(/&amp;/g, '&');
      bio = bio.replace(/&quot;/g, '"');
      bio = bio.replace(/&#39;/g, "'");
      bio = bio.trim();

      if (bio.length > 50) {
        return bio;
      }
    }
  }
  return null;
}

function extractResearchInterests(html) {
  const patterns = [
    /class="field-name-field-research-interests"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
    /Research Interests[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      let text = match[1];
      text = text.replace(/<[^>]+>/g, ' ');
      text = text.replace(/&nbsp;/g, ' ');
      text = text.trim();

      // Split by common delimiters
      const interests = text.split(/[;,\n]/)
        .map(i => i.trim())
        .filter(i => i.length > 2 && i.length < 150);

      if (interests.length > 0) {
        return interests;
      }
    }
  }
  return null;
}

function extractWebsites(html) {
  const websites = {
    lab_website: null,
    personal_website: null,
    google_scholar: null,
    orcid: null,
    twitter: null,
    linkedin: null
  };

  // Extract all links
  const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>([^<]*)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    const text = match[2].toLowerCase();

    if (url.includes('scholar.google')) {
      websites.google_scholar = url;
    } else if (url.includes('orcid.org')) {
      websites.orcid = url;
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      websites.twitter = url;
    } else if (url.includes('linkedin.com')) {
      websites.linkedin = url;
    } else if (text.includes('lab') || text.includes('website') || text.includes('group')) {
      if (url.startsWith('http') && !websites.lab_website) {
        websites.lab_website = url;
      }
    } else if (text.includes('personal') || text.includes('homepage')) {
      if (url.startsWith('http') && !websites.personal_website) {
        websites.personal_website = url;
      }
    }
  }

  return websites;
}

function extractContactInfo(html) {
  const contact = {
    phone: null,
    office: null,
    email: null
  };

  // Phone
  const phonePatterns = [
    /Phone:[\s]*([0-9\-\(\)\s\.x]+)/i,
    /tel:([0-9\-]+)/i,
    /\(805\)\s*[\d\-]+/
  ];
  for (const pattern of phonePatterns) {
    const match = html.match(pattern);
    if (match) {
      contact.phone = match[1].trim();
      break;
    }
  }

  // Office
  const officePatterns = [
    /Office:[\s]*([A-Z0-9\s\-]+)/i,
    /Location:[\s]*([A-Z0-9\s\-]+)/i,
    /Room[\s]*:?[\s]*([A-Z0-9\s\-]+)/i
  ];
  for (const pattern of officePatterns) {
    const match = html.match(pattern);
    if (match) {
      contact.office = match[1].trim();
      break;
    }
  }

  // Email
  const emailMatch = html.match(/mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    contact.email = emailMatch[1];
  }

  return contact;
}

async function scrapeProfilePage(profileUrl) {
  try {
    console.log(`  🔍 Scraping: ${profileUrl}`);
    const html = await fetchPage(profileUrl);

    const data = {
      photo_url: extractPhoto(html),
      bio: extractBio(html),
      research_interests: extractResearchInterests(html),
      ...extractWebsites(html),
      ...extractContactInfo(html)
    };

    // Create short bio from full bio (first 200 chars)
    if (data.bio) {
      data.short_bio = data.bio.substring(0, 200).trim();
      if (data.bio.length > 200) {
        data.short_bio += '...';
      }
    }

    return data;
  } catch (error) {
    console.log(`  ⚠️  Error scraping: ${error.message}`);
    return null;
  }
}

async function updateDatabase(type, id, data) {
  const endpoints = {
    faculty: 'faculties',
    staff: 'staff-members',
    students: 'graduate-students'
  };

  const endpoint = endpoints[type];
  if (!endpoint) return false;

  // Clean up the data - remove nulls
  const cleanData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      cleanData[key] = value;
    }
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: cleanData })
    });

    return response.ok;
  } catch (error) {
    console.log(`  ❌ Database update failed: ${error.message}`);
    return false;
  }
}

async function processPeople(type, endpoint) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 Processing ${type.toUpperCase()}`);
  console.log('='.repeat(70));

  // Fetch all people of this type
  const response = await fetchJSON(`${STRAPI_URL}/api/${endpoint}?pagination[limit]=200`);
  const people = response.data;

  console.log(`Found ${people.length} ${type}`);

  let processed = 0;
  let updated = 0;
  let skipped = 0;

  for (const person of people) {
    const { id, attributes } = person;
    console.log(`\n👤 ${attributes.fullName || attributes.full_name}`);

    // Build profile URL from slug
    let profileUrl;
    if (attributes.slug) {
      const category = type === 'faculty' ? 'faculty' : type === 'staff' ? 'staff' : 'students';
      profileUrl = `https://www.eemb.ucsb.edu/people/${category}/${attributes.slug}`;
    } else {
      console.log(`  ⚠️  No slug available - skipping`);
      skipped++;
      continue;
    }

    // Scrape profile
    const scrapedData = await scrapeProfilePage(profileUrl);

    if (scrapedData) {
      // Merge with existing data (don't overwrite with nulls)
      const updates = {};
      let hasUpdates = false;

      for (const [key, value] of Object.entries(scrapedData)) {
        if (value !== null && (!attributes[key] || attributes[key] === '')) {
          updates[key] = value;
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        console.log(`  📝 Found new data:`, Object.keys(updates).join(', '));
        const success = await updateDatabase(type, id, updates);

        if (success) {
          console.log(`  ✅ Updated successfully`);
          updated++;
        } else {
          console.log(`  ❌ Update failed`);
        }
      } else {
        console.log(`  ℹ️  No new data found`);
      }
    }

    processed++;

    // Delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 ${type.toUpperCase()} Summary:`);
  console.log(`  Total: ${people.length}`);
  console.log(`  Processed: ${processed}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);

  return { total: people.length, processed, updated, skipped };
}

async function main() {
  console.log('🔍 Comprehensive Profile Scraper');
  console.log('='.repeat(70));
  console.log('This will scrape detailed information from each person\'s profile page');
  console.log('='.repeat(70));

  const stats = {
    faculty: await processPeople('faculty', 'faculties'),
    staff: await processPeople('staff', 'staff-members'),
    students: await processPeople('students', 'graduate-students')
  };

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`Faculty: ${stats.faculty.updated}/${stats.faculty.total} updated`);
  console.log(`Staff: ${stats.staff.updated}/${stats.staff.total} updated`);
  console.log(`Students: ${stats.students.updated}/${stats.students.total} updated`);
  console.log(`Total Updates: ${stats.faculty.updated + stats.staff.updated + stats.students.updated}`);
  console.log('='.repeat(70));
  console.log('\n✅ Scraping complete!');
  console.log('Refresh http://localhost:3000/people to see the updated data.\n');
}

main().catch(console.error);
