#!/usr/bin/env node

/**
 * Deep scrape photos from individual profile pages
 * Visits each profile page URL and extracts the photo
 */

const https = require('https');
const http = require('http');

const STRAPI_URL = 'http://localhost:1337';

// People missing photos with their profile URLs
const missingPhotos = [
  // Faculty
  { type: 'faculty', id: 168, full_name: "Adrian M. Wenner", email: "wenner@lifesci.ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/emeriti/wenner" },
  { type: 'faculty', id: 134, full_name: "Anna James", email: "ajames@ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/faculty/james-0" },
  { type: 'faculty', id: 112, full_name: "Daniel Botkin", email: "danielbotkin@rcn.com", profile_url: "https://www.eemb.ucsb.edu/people/emeriti/botkin" },
  { type: 'faculty', id: 119, full_name: "Ivia Closset", email: "ivia@ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/researchers/closset" },

  // Staff
  { type: 'staff', id: 13, full_name: "Danielle Perez", email: "dcperez@ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/staff/dcperez" },
  { type: 'staff', id: 16, full_name: "Ellery Wilkie", email: "ewilkie@lifesci.ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/staff/wilkie" },
  { type: 'staff', id: 2, full_name: "Paul Diaz", email: "pdiaz@lifesci.ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/staff/diaz" },
  { type: 'staff', id: 15, full_name: "Rosa Vasquez", email: "rosavasquez@ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/staff/vasquez" },
  { type: 'staff', id: 8, full_name: "Saru Lantier", email: "info@eemb.ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/staff/lantier" },

  // Students
  { type: 'students', id: 28, full_name: "Julianna Renzi", email: "julianna.renzi@lifesci.ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/students/renzi" },
  { type: 'students', id: 11, full_name: "Kenneth Gilliland", email: "kenneth.gilliland@lifesci.ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/students/gilliland" },
  { type: 'students', id: 35, full_name: "Zoe Welch", email: "zoe.welch@lifesci.ucsb.edu", profile_url: "https://www.eemb.ucsb.edu/people/students/welch" }
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, { timeout: 10000 }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractPhotoUrl(html) {
  // Try multiple patterns to find the photo
  const patterns = [
    // Drupal style image in content area
    /<img[^>]+class="[^"]*image-style[^"]*"[^>]+src="([^"]+)"/i,
    // Medium square style (specific to EEMB site)
    /\/styles\/medium_square\/public\/[^"]+\.(?:jpg|jpeg|png|gif)/i,
    // Any image in the main content that looks like a profile photo
    /<div[^>]+class="[^"]*field--name-field-photo[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i,
    // Meta tag image
    /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i,
    // Look for any image with person's name or generic profile patterns
    /<img[^>]+src="([^"]*(?:profile|headshot|photo|portrait|people)[^"]*\.(?:jpg|jpeg|png|gif))"/i,
    // Generic image in article or node content
    /<article[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      let url = match[1] || match[0];

      // Clean up the URL
      if (url.startsWith('//')) {
        url = 'https:' + url;
      } else if (url.startsWith('/')) {
        url = 'https://www.eemb.ucsb.edu' + url;
      } else if (!url.startsWith('http')) {
        // Try to extract just the path from a longer match
        const pathMatch = url.match(/\/sites\/default\/files\/[^"'\s]+/);
        if (pathMatch) {
          url = 'https://www.eemb.ucsb.edu' + pathMatch[0];
        }
      }

      // Validate it looks like an image URL and is not a default placeholder
      if (url.match(/\.(?:jpg|jpeg|png|gif)/i) &&
          !url.includes('default-avatar') &&
          !url.includes('default_images') &&
          !url.includes('portrait-default')) {
        return url;
      }
    }
  }

  return null;
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
  console.log('🔍 Deep Scraping Photos from Profile Pages\n');
  console.log('=' .repeat(70));

  let totalScraped = 0;
  let totalFound = 0;
  let totalUpdated = 0;
  let totalFailed = 0;

  for (const person of missingPhotos) {
    console.log(`\n📄 Processing: ${person.full_name}`);
    console.log(`   Type: ${person.type}`);
    console.log(`   URL: ${person.profile_url}`);

    try {
      // Fetch the profile page
      const html = await fetchPage(person.profile_url);
      totalScraped++;

      // Extract photo URL
      const photoUrl = extractPhotoUrl(html);

      if (photoUrl) {
        console.log(`   ✅ Found photo: ${photoUrl}`);
        totalFound++;

        // Update in Strapi
        console.log(`   📤 Updating database...`);
        const updated = await updatePhotoInStrapi(person.type, person.id, photoUrl);

        if (updated) {
          console.log(`   ✅ Successfully updated!`);
          totalUpdated++;
        } else {
          console.log(`   ❌ Failed to update database`);
          totalFailed++;
        }
      } else {
        console.log(`   ⚠️  No photo found on profile page`);
        totalFailed++;
      }

      // Delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.log(`   ❌ Error scraping page: ${error.message}`);
      totalFailed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY:');
  console.log('='.repeat(70));
  console.log(`Total people processed: ${missingPhotos.length}`);
  console.log(`Pages successfully scraped: ${totalScraped}`);
  console.log(`Photos found: ${totalFound}`);
  console.log(`Database records updated: ${totalUpdated}`);
  console.log(`Failed/Not found: ${totalFailed}`);
  console.log('='.repeat(70));

  if (totalUpdated > 0) {
    console.log(`\n🎉 Successfully updated ${totalUpdated} photos!`);
  }
  if (totalFailed > 0) {
    console.log(`\n⚠️  ${totalFailed} photos could not be found or updated.`);
    console.log('   These profile pages may not have photos or use a different format.\n');
  }
}

main().catch(console.error);
