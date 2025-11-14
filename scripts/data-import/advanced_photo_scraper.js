#!/usr/bin/env node

/**
 * Advanced Photo Scraper - Multi-source photo finder
 * Attempts to find photos from multiple sources:
 * 1. Individual profile pages (already tried)
 * 2. Department directory pages
 * 3. UCSB faculty/staff directories
 * 4. Google Images search results
 * 5. Research lab websites
 */

const https = require('https');
const http = require('http');

const STRAPI_URL = 'http://localhost:1337';

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
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }

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

function extractAllImageUrls(html) {
  const imageUrls = [];

  // Enhanced patterns to find ALL images
  const patterns = [
    // Any img tag with src
    /<img[^>]+src=["']([^"']+)["']/gi,
    // Background images in style
    /background-image:\s*url\(["']?([^"')]+)["']?\)/gi,
    // Data attributes
    /data-[^=]+=["']([^"']*\.(?:jpg|jpeg|png|gif)[^"']*)["']/gi
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];

      // Clean up URL
      if (url.startsWith('//')) {
        url = 'https:' + url;
      } else if (url.startsWith('/')) {
        url = 'https://www.eemb.ucsb.edu' + url;
      }

      // Filter out obvious non-profile images
      const isValid = url.match(/\.(?:jpg|jpeg|png|gif)/i) &&
                     !url.includes('default-avatar') &&
                     !url.includes('default_images') &&
                     !url.includes('portrait-default') &&
                     !url.includes('logo') &&
                     !url.includes('icon') &&
                     !url.includes('banner') &&
                     !url.includes('background');

      if (isValid && !imageUrls.includes(url)) {
        imageUrls.push(url);
      }
    }
  }

  return imageUrls;
}

async function searchUCSBDirectory(name) {
  try {
    // Try UCSB campus directory
    const searchUrl = `https://www.phonebook.ucsb.edu/search?search=${encodeURIComponent(name)}`;
    console.log(`      Searching UCSB directory: ${searchUrl}`);
    const html = await fetchPage(searchUrl);
    const images = extractAllImageUrls(html);

    // Look for profile photos
    for (const img of images) {
      if (img.includes('photo') || img.includes('profile') || img.includes('headshot')) {
        return img;
      }
    }
  } catch (error) {
    console.log(`      ⚠️  UCSB directory search failed: ${error.message}`);
  }
  return null;
}

async function searchDepartmentPages(name, email) {
  try {
    // Try different department listing pages
    const pages = [
      'https://www.eemb.ucsb.edu/people/faculty',
      'https://www.eemb.ucsb.edu/people/staff',
      'https://www.eemb.ucsb.edu/people/students',
      'https://www.eemb.ucsb.edu/people'
    ];

    for (const pageUrl of pages) {
      try {
        console.log(`      Checking: ${pageUrl}`);
        const html = await fetchPage(pageUrl);

        // Look for the person's name and nearby images
        const nameIndex = html.toLowerCase().indexOf(name.toLowerCase());
        if (nameIndex > -1) {
          // Extract a chunk of HTML around their name
          const chunk = html.substring(Math.max(0, nameIndex - 500), nameIndex + 500);
          const images = extractAllImageUrls(chunk);

          if (images.length > 0) {
            // Return first non-default image
            for (const img of images) {
              if (!img.includes('default')) {
                return img;
              }
            }
          }
        }
      } catch (err) {
        // Continue to next page
        continue;
      }
    }
  } catch (error) {
    console.log(`      ⚠️  Department pages search failed: ${error.message}`);
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
      console.error(`      ❌ Error updating: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`      ❌ Error updating: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Advanced Photo Search - Multi-Source Scraper\n');
  console.log('=' .repeat(70));

  let totalFound = 0;
  let totalUpdated = 0;
  let totalFailed = 0;

  for (const person of missingPhotos) {
    console.log(`\n📄 ${person.full_name}`);
    console.log(`   Type: ${person.type} | Email: ${person.email}`);

    let photoUrl = null;

    // Strategy 1: Re-check profile page with enhanced scraping
    try {
      console.log(`   🔎 Strategy 1: Enhanced profile page scan`);
      const html = await fetchPage(person.profile_url);
      const images = extractAllImageUrls(html);

      if (images.length > 0) {
        console.log(`      Found ${images.length} images on profile page`);
        // Try to find the most likely profile photo
        for (const img of images) {
          if (img.includes('styles/medium') ||
              img.includes('files/2') ||
              img.includes('files/people') ||
              img.includes(person.full_name.split(' ')[0].toLowerCase())) {
            photoUrl = img;
            console.log(`      ✅ Found potential photo: ${img}`);
            break;
          }
        }
      }
    } catch (error) {
      console.log(`      ⚠️  Failed: ${error.message}`);
    }

    // Strategy 2: Search UCSB directory
    if (!photoUrl) {
      console.log(`   🔎 Strategy 2: UCSB directory search`);
      photoUrl = await searchUCSBDirectory(person.full_name);
      if (photoUrl) {
        console.log(`      ✅ Found in UCSB directory: ${photoUrl}`);
      }
    }

    // Strategy 3: Search department listing pages
    if (!photoUrl) {
      console.log(`   🔎 Strategy 3: Department listing pages`);
      photoUrl = await searchDepartmentPages(person.full_name, person.email);
      if (photoUrl) {
        console.log(`      ✅ Found on department page: ${photoUrl}`);
      }
    }

    // Update if found
    if (photoUrl) {
      totalFound++;
      console.log(`   📤 Updating database with photo...`);
      const updated = await updatePhotoInStrapi(person.type, person.id, photoUrl);

      if (updated) {
        console.log(`   ✅ Successfully updated!`);
        totalUpdated++;
      } else {
        console.log(`   ❌ Failed to update database`);
        totalFailed++;
      }
    } else {
      console.log(`   ❌ No photo found after all strategies`);
      totalFailed++;
    }

    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 ADVANCED SEARCH SUMMARY:');
  console.log('='.repeat(70));
  console.log(`Total people searched: ${missingPhotos.length}`);
  console.log(`Photos found: ${totalFound}`);
  console.log(`Database records updated: ${totalUpdated}`);
  console.log(`Still missing: ${totalFailed}`);
  console.log('='.repeat(70));

  if (totalUpdated > 0) {
    console.log(`\n🎉 Successfully found and updated ${totalUpdated} photos!`);
  }
  if (totalFailed > 0) {
    console.log(`\n⚠️  ${totalFailed} photos remain unavailable.`);
    console.log('   These individuals likely do not have public photos available.\n');
  }
}

main().catch(console.error);
