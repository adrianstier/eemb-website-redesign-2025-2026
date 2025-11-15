const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive People Data Scraper and Importer
 * This script scrapes ALL people from the original EEMB website
 * and extracts complete, accurate data including titles and offices
 */

async function scrapePeopleComprehensive() {
  console.log('🚀 Starting comprehensive people data scraping...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  const allPeople = [];

  // Categories to scrape
  const categories = [
    { name: 'Faculty', url: 'https://www.eemb.ucsb.edu/people/faculty', type: 'faculty' },
    { name: 'Researchers', url: 'https://www.eemb.ucsb.edu/people/researchers', type: 'researchers' },
    { name: 'Graduate Students', url: 'https://www.eemb.ucsb.edu/people/graduate-students', type: 'graduate-students' },
    { name: 'Staff', url: 'https://www.eemb.ucsb.edu/people/staff', type: 'staff' }
  ];

  for (const category of categories) {
    console.log(`\n📂 Scraping ${category.name}...`);
    console.log(`   URL: ${category.url}`);

    try {
      const response = await page.goto(category.url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      if (!response || response.status() === 404) {
        console.log(`   ⚠️  404 Not Found - skipping\n`);
        continue;
      }

      await page.waitForTimeout(2000);

      // Extract all people links
      const peopleLinks = await page.evaluate(() => {
        const links = [];
        const personLinks = document.querySelectorAll('a[href*="/people/"]');

        personLinks.forEach(el => {
          const href = el.href;
          const text = el.innerText.trim();

          // Only include actual profile links
          if ((href.includes('/people/faculty/') ||
               href.includes('/people/researchers/') ||
               href.includes('/people/graduate-students/') ||
               href.includes('/people/staff/')) &&
              !href.endsWith('/people/faculty') &&
              !href.endsWith('/people/researchers') &&
              !href.endsWith('/people/graduate-students') &&
              !href.endsWith('/people/staff') &&
              text.length > 0) {
            links.push({ name: text, url: href });
          }
        });

        // Deduplicate
        const seen = new Set();
        return links.filter(link => {
          if (seen.has(link.url)) return false;
          seen.add(link.url);
          return true;
        });
      });

      console.log(`   ✅ Found ${peopleLinks.length} people\n`);

      // Scrape each person's profile
      for (let i = 0; i < peopleLinks.length; i++) {
        const person = peopleLinks[i];
        console.log(`   [${i + 1}/${peopleLinks.length}] ${person.name}`);

        try {
          const profileResponse = await page.goto(person.url, {
            waitUntil: 'networkidle',
            timeout: 20000
          });

          if (!profileResponse || profileResponse.status() === 404) {
            console.log(`      ⚠️  404 Not Found`);
            continue;
          }

          await page.waitForTimeout(1000);

          // Extract comprehensive profile data
          const profileData = await page.evaluate(() => {
            const main = document.querySelector('main') || document.body;

            // Extract email
            const emailLink = main.querySelector('a[href^="mailto:"]');
            const email = emailLink ? emailLink.href.replace('mailto:', '') : null;

            // Extract phone
            const phoneLink = main.querySelector('a[href^="tel:"]');
            let phone = phoneLink ? phoneLink.innerText.trim() : null;

            // Try to find phone in text if not in link
            if (!phone) {
              const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
              const phoneMatch = main.innerText.match(phoneRegex);
              if (phoneMatch) phone = phoneMatch[0];
            }

            // Extract title - look for specific patterns
            let title = null;

            // Try h2 or h3 near the top
            const titleElements = main.querySelectorAll('h2, h3, .field--name-field-title, .position');
            for (const el of titleElements) {
              const text = el.innerText.trim();
              // Look for common title patterns
              if (text &&
                  (text.includes('Professor') ||
                   text.includes('Researcher') ||
                   text.includes('Advisor') ||
                   text.includes('Student') ||
                   text.includes('Director') ||
                   text.includes('Manager') ||
                   text.includes('Coordinator') ||
                   text.includes('Officer') ||
                   text.includes('Assistant')) &&
                  !text.includes('Research Interests') &&
                  text.length < 100) {
                title = text;
                break;
              }
            }

            // Extract office location
            let office = null;
            const officeElement = main.querySelector('.field--name-field-office, .office');
            if (officeElement) {
              office = officeElement.innerText.trim().replace('Office:', '').trim();
            } else {
              // Look for "Office:" in text
              const officeMatch = main.innerText.match(/Office:\s*([^\n]+)/);
              if (officeMatch) {
                office = officeMatch[1].trim();
              }
            }

            // Extract research interests
            const interestsElement = main.querySelector('.field--name-field-research-interests, .research-interests');
            const interests = interestsElement ? interestsElement.innerText.trim() : null;

            // Extract bio
            const bioElement = main.querySelector('.field--name-body, .bio, .biography');
            const bio = bioElement ? bioElement.innerText.trim() : null;

            // Extract website
            let website = null;
            const links = main.querySelectorAll('a[href]');
            for (const link of links) {
              const href = link.href;
              if (href &&
                  (href.includes('http') || href.includes('https')) &&
                  !href.includes('ucsb.edu/people') &&
                  !href.includes('mailto:') &&
                  !href.includes('tel:') &&
                  (link.innerText.toLowerCase().includes('website') ||
                   link.innerText.toLowerCase().includes('lab') ||
                   href.includes('edu/~'))) {
                website = href;
                break;
              }
            }

            return {
              email,
              phone,
              title,
              office,
              interests,
              bio: bio ? bio.substring(0, 1000) : null,
              website
            };
          });

          allPeople.push({
            name: person.name,
            url: person.url,
            category: category.type,
            ...profileData
          });

          if (profileData.title) console.log(`      📋 ${profileData.title}`);
          if (profileData.office) console.log(`      📍 ${profileData.office}`);
          if (profileData.email) console.log(`      📧 ${profileData.email}`);

        } catch (error) {
          console.log(`      ❌ Error: ${error.message}`);
        }
      }

    } catch (error) {
      console.log(`   ❌ Category Error: ${error.message}\n`);
    }
  }

  await browser.close();

  // Save results
  const outputPath = path.join(__dirname, 'comprehensive-people-data.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: allPeople.length,
    people: allPeople
  }, null, 2));

  console.log(`\n\n✅ Scraping complete!`);
  console.log(`📊 Total people scraped: ${allPeople.length}`);
  console.log(`💾 Data saved to: ${outputPath}`);

  // Generate summary statistics
  const stats = {
    faculty: allPeople.filter(p => p.category === 'faculty').length,
    researchers: allPeople.filter(p => p.category === 'researchers').length,
    gradStudents: allPeople.filter(p => p.category === 'graduate-students').length,
    staff: allPeople.filter(p => p.category === 'staff').length,
    withEmail: allPeople.filter(p => p.email).length,
    withPhone: allPeople.filter(p => p.phone).length,
    withTitle: allPeople.filter(p => p.title).length,
    withOffice: allPeople.filter(p => p.office).length
  };

  console.log(`\n📈 Statistics:`);
  console.log(`   Faculty: ${stats.faculty}`);
  console.log(`   Researchers: ${stats.researchers}`);
  console.log(`   Graduate Students: ${stats.gradStudents}`);
  console.log(`   Staff: ${stats.staff}`);
  console.log(`   With Email: ${stats.withEmail}`);
  console.log(`   With Phone: ${stats.withPhone}`);
  console.log(`   With Title: ${stats.withTitle}`);
  console.log(`   With Office: ${stats.withOffice}`);

  return allPeople;
}

// Run the scraper
scrapePeopleComprehensive().catch(console.error);
