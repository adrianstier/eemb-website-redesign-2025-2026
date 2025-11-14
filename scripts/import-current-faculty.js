/**
 * Import Current Faculty Only
 * Filters out emeritus, deceased, and inactive faculty
 * Imports only current, active faculty members
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

// Keywords that indicate non-current faculty
const EXCLUDE_KEYWORDS = [
  'emeritus',
  'emeriti',
  'retired',
  'former',
  'deceased',
  'in memoriam',
  'memorial',
  '1960', '1970', '1980', '1990', // Very old dates
];

// Valid current titles
const VALID_TITLES = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Distinguished Professor',
  'Research Professor',
  'Lecturer',
  'Teaching Professor'
];

/**
 * Check if faculty member is current based on their data
 */
function isCurrentFaculty(faculty) {
  // Check title
  const title = faculty.title?.toLowerCase() || '';

  // Exclude emeritus
  if (title.includes('emeritus') || title.includes('emeriti')) {
    return false;
  }

  // Check for exclude keywords in any text field
  const textToCheck = [
    faculty.name,
    faculty.title,
    faculty.department,
    faculty.bio
  ].join(' ').toLowerCase();

  for (const keyword of EXCLUDE_KEYWORDS) {
    if (textToCheck.includes(keyword.toLowerCase())) {
      return false;
    }
  }

  // Check if they have recent activity (email, office, phone)
  const hasContactInfo = !!(
    faculty.email ||
    faculty.office ||
    faculty.phone
  );

  // Must have at least an email to be considered current
  if (!faculty.email) {
    return false;
  }

  // Check if email is @ucsb.edu
  if (!faculty.email.includes('@ucsb.edu')) {
    return false;
  }

  return hasContactInfo;
}

/**
 * Parse name into first and last name
 */
function parseName(fullName) {
  if (!fullName) return { firstName: '', lastName: '' };

  const parts = fullName.trim().split(' ');

  // Handle various name formats
  if (parts.length === 1) {
    return { firstName: '', lastName: parts[0] };
  } else if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  } else {
    // Assume last word is last name, everything else is first/middle
    return {
      firstName: parts.slice(0, -1).join(' '),
      lastName: parts[parts.length - 1]
    };
  }
}

/**
 * Convert scraped faculty to Strapi format
 */
function convertToStrapiFormat(faculty) {
  const { firstName, lastName } = parseName(faculty.name);

  // Determine title
  let title = 'Professor'; // Default
  if (faculty.title) {
    for (const validTitle of VALID_TITLES) {
      if (faculty.title.toLowerCase().includes(validTitle.toLowerCase())) {
        title = validTitle;
        break;
      }
    }
  }

  // Parse research interests
  let researchInterests = [];
  if (faculty.research_interests) {
    if (typeof faculty.research_interests === 'string') {
      researchInterests = faculty.research_interests
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    } else if (Array.isArray(faculty.research_interests)) {
      researchInterests = faculty.research_interests;
    }
  }

  return {
    firstName,
    lastName,
    title,
    email: faculty.email || '',
    phone: faculty.phone || '',
    office: faculty.office || '',
    bio: faculty.bio || '',
    shortBio: faculty.bio ? faculty.bio.substring(0, 500) : '',
    researchInterests,
    labWebsite: faculty.lab_website || faculty.website || '',
    googleScholar: faculty.google_scholar || '',
    orcid: faculty.orcid || '',
    active: true,
    department: 'EEMB',
    joinedYear: faculty.joined_year || null,
    officeHours: faculty.office_hours || ''
  };
}

/**
 * Main import function
 */
async function importCurrentFaculty() {
  console.log('🔍 Starting faculty import process...\n');

  // Read scraped data
  const scrapedDataPath = path.join(__dirname, '../scraping/data/faculty_data.json');

  if (!fs.existsSync(scrapedDataPath)) {
    console.error('❌ Scraped data not found at:', scrapedDataPath);
    console.log('Please run the scraping pipeline first.');
    process.exit(1);
  }

  const scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf8'));
  console.log(`📊 Found ${scrapedData.length} total faculty records\n`);

  // Filter for current faculty only
  const currentFaculty = scrapedData.filter(isCurrentFaculty);
  console.log(`✅ Filtered to ${currentFaculty.length} current faculty members\n`);

  // Convert to Strapi format
  const strapiRecords = currentFaculty.map(convertToStrapiFormat);

  // Remove duplicates based on email
  const uniqueRecords = [];
  const seenEmails = new Set();

  for (const record of strapiRecords) {
    if (!seenEmails.has(record.email)) {
      uniqueRecords.push(record);
      seenEmails.add(record.email);
    }
  }

  console.log(`📝 Prepared ${uniqueRecords.length} unique faculty records for import\n`);

  // Save to file for review
  const outputPath = path.join(__dirname, 'current-faculty-import.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(uniqueRecords, null, 2),
    'utf8'
  );
  console.log(`💾 Saved import data to: ${outputPath}\n`);

  // If Strapi is running and we have a token, import directly
  if (STRAPI_TOKEN) {
    console.log('🚀 Starting import to Strapi...\n');

    let imported = 0;
    let failed = 0;

    for (const faculty of uniqueRecords) {
      try {
        const response = await axios.post(
          `${STRAPI_URL}/api/faculties`,
          { data: faculty },
          {
            headers: {
              'Authorization': `Bearer ${STRAPI_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 200 || response.status === 201) {
          imported++;
          console.log(`✅ Imported: ${faculty.firstName} ${faculty.lastName}`);
        } else {
          failed++;
          console.log(`⚠️  Failed: ${faculty.firstName} ${faculty.lastName}`);
        }
      } catch (error) {
        failed++;
        console.log(`❌ Error importing ${faculty.firstName} ${faculty.lastName}:`, error.message);
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Successfully imported: ${imported}`);
    console.log(`   ❌ Failed: ${failed}`);
  } else {
    console.log('ℹ️  No Strapi token provided. Data prepared but not imported.');
    console.log('   To import, set STRAPI_TOKEN environment variable and run again.');
  }

  console.log('\n✨ Faculty import process complete!');
}

// Run if executed directly
if (require.main === module) {
  importCurrentFaculty().catch(console.error);
}

module.exports = { importCurrentFaculty, isCurrentFaculty, convertToStrapiFormat };