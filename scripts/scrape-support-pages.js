const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function scrapeSupport() {
  console.log('🚀 Starting support pages scraping...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  const results = {
    timestamp: new Date().toISOString(),
    pages: []
  };

  // Support pages to scrape
  const supportPages = [
    { name: 'Main Support', url: 'https://www.eemb.ucsb.edu/support' },
    { name: 'Administration', url: 'https://www.eemb.ucsb.edu/support/administration' },
    { name: 'Conference Rooms', url: 'https://www.eemb.ucsb.edu/support/conference-room-reservations' },
    { name: 'Research Services', url: 'https://www.eemb.ucsb.edu/support/research-services' },
    { name: 'Technical Support', url: 'https://www.eemb.ucsb.edu/support/technical-support' },
    { name: 'Campus Resources', url: 'https://www.eemb.ucsb.edu/support/campus-resources' },
    { name: 'Shipping', url: 'https://www.eemb.ucsb.edu/support/shipping-receiving' }
  ];

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'docs', 'support-scrape-results');
  const screenshotsDir = path.join(outputDir, 'screenshots');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (const supportPage of supportPages) {
    console.log(`📄 Scraping: ${supportPage.name}`);
    console.log(`   URL: ${supportPage.url}`);

    try {
      const response = await page.goto(supportPage.url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      if (!response || response.status() === 404) {
        console.log(`   ⚠️  404 Not Found - ${supportPage.name}\n`);
        results.pages.push({
          name: supportPage.name,
          url: supportPage.url,
          status: 404,
          error: 'Page not found'
        });
        continue;
      }

      // Wait a moment for any dynamic content
      await page.waitForTimeout(2000);

      // Take screenshot
      const screenshotPath = path.join(screenshotsDir, `${supportPage.name.toLowerCase().replace(/\s+/g, '-')}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      console.log(`   📸 Screenshot saved`);

      // Extract all text content
      const pageData = await page.evaluate(() => {
        // Remove script and style elements
        const scripts = document.querySelectorAll('script, style, noscript');
        scripts.forEach(el => el.remove());

        // Get main content
        const main = document.querySelector('main') || document.body;

        // Extract text
        const allText = main.innerText;

        // Extract links
        const links = Array.from(main.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.href
        })).filter(link => link.text && link.href);

        // Extract headings
        const headings = Array.from(main.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
          level: h.tagName,
          text: h.innerText.trim()
        }));

        // Extract email addresses
        const emails = Array.from(main.querySelectorAll('a[href^="mailto:"]')).map(a =>
          a.href.replace('mailto:', '')
        );

        // Extract phone numbers
        const phoneLinks = Array.from(main.querySelectorAll('a[href^="tel:"]')).map(a =>
          a.innerText.trim()
        );

        // Also search for phone patterns in text
        const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
        const phoneMatches = allText.match(phonePattern) || [];

        // Extract lists
        const lists = Array.from(main.querySelectorAll('ul, ol')).map(list => {
          const items = Array.from(list.querySelectorAll('li')).map(li => li.innerText.trim());
          return {
            type: list.tagName.toLowerCase(),
            items: items
          };
        });

        // Extract paragraphs
        const paragraphs = Array.from(main.querySelectorAll('p')).map(p =>
          p.innerText.trim()
        ).filter(p => p.length > 0);

        return {
          fullText: allText,
          headings: headings,
          links: links,
          emails: [...new Set(emails)],
          phones: [...new Set([...phoneLinks, ...phoneMatches])],
          lists: lists,
          paragraphs: paragraphs
        };
      });

      console.log(`   ✅ Extracted ${pageData.headings.length} headings`);
      console.log(`   ✅ Extracted ${pageData.emails.length} email addresses`);
      console.log(`   ✅ Extracted ${pageData.phones.length} phone numbers`);
      console.log(`   ✅ Extracted ${pageData.links.length} links\n`);

      results.pages.push({
        name: supportPage.name,
        url: supportPage.url,
        status: 200,
        screenshot: screenshotPath,
        data: pageData
      });

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      results.pages.push({
        name: supportPage.name,
        url: supportPage.url,
        status: 'error',
        error: error.message
      });
    }
  }

  await browser.close();

  // Save results to JSON
  const jsonPath = path.join(outputDir, 'scrape-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${jsonPath}`);

  // Generate markdown report
  let markdown = `# Support Pages Content Scraping Report\n\n`;
  markdown += `**Scraped:** ${new Date(results.timestamp).toLocaleString()}\n\n`;
  markdown += `---\n\n`;

  results.pages.forEach(page => {
    markdown += `## ${page.name}\n\n`;
    markdown += `**URL:** ${page.url}\n`;
    markdown += `**Status:** ${page.status}\n\n`;

    if (page.status === 200 && page.data) {
      markdown += `### Content Summary\n\n`;
      markdown += `- **Headings:** ${page.data.headings.length}\n`;
      markdown += `- **Emails:** ${page.data.emails.length}\n`;
      markdown += `- **Phone Numbers:** ${page.data.phones.length}\n`;
      markdown += `- **Links:** ${page.data.links.length}\n\n`;

      if (page.data.emails.length > 0) {
        markdown += `### Email Addresses\n\n`;
        page.data.emails.forEach(email => {
          markdown += `- ${email}\n`;
        });
        markdown += `\n`;
      }

      if (page.data.phones.length > 0) {
        markdown += `### Phone Numbers\n\n`;
        page.data.phones.forEach(phone => {
          markdown += `- ${phone}\n`;
        });
        markdown += `\n`;
      }

      if (page.data.headings.length > 0) {
        markdown += `### Page Structure (Headings)\n\n`;
        page.data.headings.forEach(heading => {
          const indent = '  '.repeat(parseInt(heading.level.charAt(1)) - 1);
          markdown += `${indent}- ${heading.text}\n`;
        });
        markdown += `\n`;
      }

      markdown += `### Full Text Content\n\n`;
      markdown += `\`\`\`\n${page.data.fullText}\n\`\`\`\n\n`;
    } else if (page.status === 404) {
      markdown += `⚠️ **Page not found (404)**\n\n`;
    } else if (page.error) {
      markdown += `❌ **Error:** ${page.error}\n\n`;
    }

    markdown += `---\n\n`;
  });

  const markdownPath = path.join(outputDir, 'SCRAPE_REPORT.md');
  fs.writeFileSync(markdownPath, markdown);
  console.log(`📄 Markdown report saved to: ${markdownPath}`);

  // Generate comparison checklist
  let checklist = `# Support Content Migration Checklist\n\n`;
  checklist += `Generated from scraping on ${new Date().toLocaleString()}\n\n`;
  checklist += `## Contact Information Verification\n\n`;

  const allEmails = new Set();
  const allPhones = new Set();

  results.pages.forEach(page => {
    if (page.data) {
      page.data.emails.forEach(email => allEmails.add(email));
      page.data.phones.forEach(phone => allPhones.add(phone));
    }
  });

  checklist += `### Email Addresses Found (${allEmails.size} unique)\n\n`;
  Array.from(allEmails).sort().forEach(email => {
    checklist += `- [ ] ${email}\n`;
  });

  checklist += `\n### Phone Numbers Found (${allPhones.size} unique)\n\n`;
  Array.from(allPhones).sort().forEach(phone => {
    checklist += `- [ ] ${phone}\n`;
  });

  checklist += `\n## Pages Migration Status\n\n`;
  results.pages.forEach(page => {
    if (page.status === 200) {
      checklist += `### ${page.name}\n\n`;
      checklist += `- [ ] All headings migrated\n`;
      checklist += `- [ ] All contact info migrated\n`;
      checklist += `- [ ] All service descriptions migrated\n`;
      checklist += `- [ ] All links working\n`;
      checklist += `- [ ] Visual design improved\n`;
      checklist += `- [ ] Mobile responsive\n\n`;
    } else if (page.status === 404) {
      checklist += `### ${page.name}\n\n`;
      checklist += `- [x] Page did not exist on old site (404)\n`;
      checklist += `- [ ] Created new content for this section\n\n`;
    }
  });

  const checklistPath = path.join(outputDir, 'MIGRATION_CHECKLIST.md');
  fs.writeFileSync(checklistPath, checklist);
  console.log(`✅ Checklist saved to: ${checklistPath}`);

  console.log(`\n✨ Scraping complete!`);
  console.log(`\nSummary:`);
  console.log(`  - Pages scraped: ${results.pages.length}`);
  console.log(`  - Successful: ${results.pages.filter(p => p.status === 200).length}`);
  console.log(`  - Not found (404): ${results.pages.filter(p => p.status === 404).length}`);
  console.log(`  - Errors: ${results.pages.filter(p => p.status === 'error').length}`);
  console.log(`  - Unique emails: ${allEmails.size}`);
  console.log(`  - Unique phones: ${allPhones.size}`);
}

scrapeSupport().catch(console.error);
