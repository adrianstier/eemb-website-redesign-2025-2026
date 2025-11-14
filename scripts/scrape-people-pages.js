const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function scrapePeople() {
  console.log('🚀 Starting people pages scraping...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  const results = {
    timestamp: new Date().toISOString(),
    pages: [],
    people: []
  };

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'docs', 'people-scrape-results');
  const screenshotsDir = path.join(outputDir, 'screenshots');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Main people directory pages
  const mainPages = [
    { name: 'People Directory', url: 'https://www.eemb.ucsb.edu/people' },
    { name: 'Faculty', url: 'https://www.eemb.ucsb.edu/people/faculty' },
    { name: 'Researchers', url: 'https://www.eemb.ucsb.edu/people/researchers' },
    { name: 'Graduate Students', url: 'https://www.eemb.ucsb.edu/people/graduate-students' },
    { name: 'Staff', url: 'https://www.eemb.ucsb.edu/people/staff' }
  ];

  console.log('📋 Phase 1: Scraping main directory pages...\n');

  for (const mainPage of mainPages) {
    console.log(`📄 Scraping: ${mainPage.name}`);
    console.log(`   URL: ${mainPage.url}`);

    try {
      const response = await page.goto(mainPage.url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      if (!response || response.status() === 404) {
        console.log(`   ⚠️  404 Not Found\n`);
        results.pages.push({
          name: mainPage.name,
          url: mainPage.url,
          status: 404
        });
        continue;
      }

      await page.waitForTimeout(2000);

      // Screenshot
      const screenshotPath = path.join(screenshotsDir, `${mainPage.name.toLowerCase().replace(/\s+/g, '-')}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`   📸 Screenshot saved`);

      // Extract people list and links
      const pageData = await page.evaluate(() => {
        const peopleLinks = [];

        // Find all person cards/links
        const personElements = document.querySelectorAll('a[href*="/people/"]');
        personElements.forEach(el => {
          const href = el.href;
          const text = el.innerText.trim();

          // Only include profile links, not navigation
          if (href.includes('/people/faculty/') ||
              href.includes('/people/researchers/') ||
              href.includes('/people/graduate-students/') ||
              href.includes('/people/staff/')) {
            peopleLinks.push({
              name: text,
              url: href
            });
          }
        });

        // Extract all text
        const main = document.querySelector('main') || document.body;
        const fullText = main.innerText;

        // Extract headings
        const headings = Array.from(main.querySelectorAll('h1, h2, h3, h4')).map(h => ({
          level: h.tagName,
          text: h.innerText.trim()
        }));

        return {
          fullText,
          headings,
          peopleLinks: [...new Map(peopleLinks.map(p => [p.url, p])).values()] // Deduplicate
        };
      });

      console.log(`   ✅ Found ${pageData.peopleLinks.length} people links`);
      console.log(`   ✅ Extracted ${pageData.headings.length} headings\n`);

      results.pages.push({
        name: mainPage.name,
        url: mainPage.url,
        status: 200,
        screenshot: screenshotPath,
        data: pageData
      });

      // Add people links to scraping queue
      pageData.peopleLinks.forEach(person => {
        if (!results.people.find(p => p.url === person.url)) {
          results.people.push({
            name: person.name,
            url: person.url,
            status: 'pending'
          });
        }
      });

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      results.pages.push({
        name: mainPage.name,
        url: mainPage.url,
        status: 'error',
        error: error.message
      });
    }
  }

  console.log(`\n📋 Phase 2: Scraping individual profile pages...\n`);
  console.log(`   Total profiles to scrape: ${results.people.length}\n`);

  // Scrape individual profiles (limit to prevent timeout)
  const maxProfiles = 50; // Adjust as needed
  const profilesToScrape = results.people.slice(0, maxProfiles);

  for (let i = 0; i < profilesToScrape.length; i++) {
    const person = profilesToScrape[i];
    console.log(`[${i + 1}/${profilesToScrape.length}] Scraping: ${person.name}`);

    try {
      const response = await page.goto(person.url, {
        waitUntil: 'networkidle',
        timeout: 20000
      });

      if (!response || response.status() === 404) {
        console.log(`   ⚠️  404 Not Found`);
        person.status = 404;
        continue;
      }

      await page.waitForTimeout(1000);

      // Extract profile data
      const profileData = await page.evaluate(() => {
        const main = document.querySelector('main') || document.body;

        // Extract email
        const emailLink = main.querySelector('a[href^="mailto:"]');
        const email = emailLink ? emailLink.href.replace('mailto:', '') : null;

        // Extract phone
        const phoneLink = main.querySelector('a[href^="tel:"]');
        const phone = phoneLink ? phoneLink.innerText.trim() : null;

        // Extract title/position
        const titleElement = main.querySelector('.field--name-field-title, .position, h2');
        const title = titleElement ? titleElement.innerText.trim() : null;

        // Extract office/location
        const officeElement = main.querySelector('.field--name-field-office, .office');
        const office = officeElement ? officeElement.innerText.trim() : null;

        // Extract research interests
        const interestsElement = main.querySelector('.field--name-field-research-interests, .research-interests');
        const interests = interestsElement ? interestsElement.innerText.trim() : null;

        // Extract bio
        const bioElement = main.querySelector('.field--name-body, .bio, .biography');
        const bio = bioElement ? bioElement.innerText.trim().substring(0, 500) : null; // First 500 chars

        // Extract website
        const websiteLink = main.querySelector('a[href*="http"]:not([href*="ucsb.edu/people"])');
        const website = websiteLink ? websiteLink.href : null;

        // Extract all text
        const fullText = main.innerText;

        return {
          email,
          phone,
          title,
          office,
          interests,
          bio,
          website,
          fullText: fullText.substring(0, 2000) // First 2000 chars
        };
      });

      person.status = 200;
      person.data = profileData;

      if (profileData.email) console.log(`   ✅ Email: ${profileData.email}`);
      if (profileData.phone) console.log(`   ✅ Phone: ${profileData.phone}`);
      if (profileData.title) console.log(`   ✅ Title: ${profileData.title}`);

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      person.status = 'error';
      person.error = error.message;
    }
  }

  await browser.close();

  // Save results
  const jsonPath = path.join(outputDir, 'people-scrape-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${jsonPath}`);

  // Generate summary report
  let report = `# People Directory Scraping Report\n\n`;
  report += `**Scraped:** ${new Date(results.timestamp).toLocaleString()}\n\n`;
  report += `---\n\n`;

  // Summary statistics
  const totalPeople = results.people.length;
  const scrapedPeople = results.people.filter(p => p.status === 200).length;
  const peopleWith404 = results.people.filter(p => p.status === 404).length;
  const peopleWithEmail = results.people.filter(p => p.data?.email).length;
  const peopleWithPhone = results.people.filter(p => p.data?.phone).length;

  report += `## Summary Statistics\n\n`;
  report += `- **Total People Found:** ${totalPeople}\n`;
  report += `- **Profiles Scraped:** ${scrapedPeople}\n`;
  report += `- **With Email:** ${peopleWithEmail}\n`;
  report += `- **With Phone:** ${peopleWithPhone}\n`;
  report += `- **404 Errors:** ${peopleWith404}\n\n`;
  report += `---\n\n`;

  // Directory pages
  report += `## Directory Pages\n\n`;
  results.pages.forEach(page => {
    report += `### ${page.name}\n\n`;
    report += `**URL:** ${page.url}\n`;
    report += `**Status:** ${page.status}\n\n`;
    if (page.data) {
      report += `- People links found: ${page.data.peopleLinks.length}\n`;
      report += `- Headings: ${page.data.headings.length}\n\n`;
    }
  });

  report += `---\n\n`;

  // People by category
  const faculty = results.people.filter(p => p.url.includes('/faculty/'));
  const researchers = results.people.filter(p => p.url.includes('/researchers/'));
  const gradStudents = results.people.filter(p => p.url.includes('/graduate-students/'));
  const staff = results.people.filter(p => p.url.includes('/staff/'));

  report += `## People by Category\n\n`;
  report += `- **Faculty:** ${faculty.length}\n`;
  report += `- **Researchers:** ${researchers.length}\n`;
  report += `- **Graduate Students:** ${gradStudents.length}\n`;
  report += `- **Staff:** ${staff.length}\n\n`;
  report += `---\n\n`;

  // Sample profile data
  report += `## Sample Profile Data (First 10)\n\n`;
  results.people.slice(0, 10).forEach(person => {
    report += `### ${person.name}\n\n`;
    report += `**URL:** ${person.url}\n`;
    report += `**Status:** ${person.status}\n\n`;
    if (person.data) {
      if (person.data.title) report += `- **Title:** ${person.data.title}\n`;
      if (person.data.email) report += `- **Email:** ${person.data.email}\n`;
      if (person.data.phone) report += `- **Phone:** ${person.data.phone}\n`;
      if (person.data.office) report += `- **Office:** ${person.data.office}\n`;
      if (person.data.interests) report += `- **Interests:** ${person.data.interests.substring(0, 100)}...\n`;
      report += `\n`;
    }
  });

  report += `---\n\n`;

  // All emails found
  const allEmails = results.people.filter(p => p.data?.email).map(p => ({
    name: p.name,
    email: p.data.email
  }));

  report += `## All Email Addresses (${allEmails.length})\n\n`;
  allEmails.forEach(person => {
    report += `- ${person.name}: ${person.email}\n`;
  });

  const reportPath = path.join(outputDir, 'PEOPLE_SCRAPE_REPORT.md');
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Report saved to: ${reportPath}`);

  // Create verification checklist
  let checklist = `# People Directory Migration Checklist\n\n`;
  checklist += `Generated: ${new Date().toLocaleString()}\n\n`;
  checklist += `## Categories to Verify\n\n`;
  checklist += `- [ ] Faculty (${faculty.length} people)\n`;
  checklist += `- [ ] Researchers (${researchers.length} people)\n`;
  checklist += `- [ ] Graduate Students (${gradStudents.length} people)\n`;
  checklist += `- [ ] Staff (${staff.length} people)\n\n`;
  checklist += `## Contact Information\n\n`;
  checklist += `### Emails Found (${allEmails.length})\n\n`;
  allEmails.forEach(person => {
    checklist += `- [ ] ${person.name} - ${person.email}\n`;
  });

  const checklistPath = path.join(outputDir, 'PEOPLE_MIGRATION_CHECKLIST.md');
  fs.writeFileSync(checklistPath, checklist);
  console.log(`✅ Checklist saved to: ${checklistPath}`);

  console.log(`\n✨ Scraping complete!`);
  console.log(`\nFinal Summary:`);
  console.log(`  - Directory pages: ${results.pages.length}`);
  console.log(`  - Total people found: ${totalPeople}`);
  console.log(`  - Profiles scraped: ${scrapedPeople}`);
  console.log(`  - Faculty: ${faculty.length}`);
  console.log(`  - Researchers: ${researchers.length}`);
  console.log(`  - Graduate Students: ${gradStudents.length}`);
  console.log(`  - Staff: ${staff.length}`);
  console.log(`  - With email: ${peopleWithEmail}`);
  console.log(`  - With phone: ${peopleWithPhone}`);
}

scrapePeople().catch(console.error);
