#!/usr/bin/env node

/**
 * Combined script to validate links and take screenshots
 * for visual verification
 */

const fs = require('fs');
const path = require('path');

async function validateAndScreenshot() {
  // Check if Playwright is installed
  let playwright;
  try {
    playwright = require('playwright');
  } catch (error) {
    console.log('❌ Playwright not found.');
    console.log('Run: npm install -D playwright && npx playwright install chromium\\n');
    return;
  }

  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Fetching faculty from database...\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  console.log(`📋 Found ${faculty.length} faculty in database\n');

  // Create output directories
  const screenshotDir = path.join(__dirname, '..', 'link-validation-screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Launch browser
  console.log('🌐 Launching browser...\n');
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  const validationResults = [];
  let totalLinks = 0;
  let accessibleLinks = 0;
  let brokenLinks = 0;
  let suspiciousLinks = 0;
  let screenshotsTaken = 0;

  console.log('🔗 Validating and screenshotting links...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  for (const person of faculty) {
    const attrs = person.attributes;
    const name = attrs.fullName;
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    if (!attrs.labWebsite && !attrs.googleScholar && !attrs.orcid) {
      continue;
    }

    console.log(`\n👤 ${name}`);
    console.log('─'.repeat(60));

    const personResults = {
      name,
      id: person.id,
      links: {}
    };

    // Validate and screenshot lab website
    if (attrs.labWebsite && attrs.labWebsite.startsWith('http')) {
      totalLinks++;
      console.log(`\n🌐 Lab Website: ${attrs.labWebsite}`);

      try {
        const page = await context.newPage();
        const response = await page.goto(attrs.labWebsite, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });

        const status = response.status();
        const accessible = status >= 200 && status < 400;

        console.log(`   Status: ${accessible ? '✅' : '❌'} ${status}`);

        if (accessible) {
          accessibleLinks++;

          // Get page title and content
          const title = await page.title();
          const content = await page.content();

          // Analyze content
          const lowerContent = content.toLowerCase();
          const lowerName = name.toLowerCase();
          const lastName = lowerName.split(' ').pop();

          const hasName = lowerContent.includes(lastName);
          const hasLab = lowerContent.includes('lab') || lowerContent.includes('laboratory');
          const hasUCSB = lowerContent.includes('ucsb') || lowerContent.includes('santa barbara');
          const likelyCorrect = hasName || (hasLab && hasUCSB);

          console.log(`   Title: ${title}`);
          console.log(`   Likely correct: ${likelyCorrect ? '✅ Yes' : '⚠️  Uncertain'}`);

          if (!likelyCorrect) {
            suspiciousLinks++;
            console.log(`   ⚠️  WARNING: This link may not be correct!`);
          }

          // Take screenshot
          const screenshotPath = path.join(screenshotDir, `${safeName}_lab.png`);
          await page.screenshot({
            path: screenshotPath,
            fullPage: false
          });
          console.log(`   📸 Screenshot saved: ${path.basename(screenshotPath)}`);
          screenshotsTaken++;

          personResults.links.labWebsite = {
            url: attrs.labWebsite,
            accessible: true,
            status,
            title,
            likelyCorrect,
            screenshot: screenshotPath
          };
        } else {
          brokenLinks++;
          console.log(`   ❌ BROKEN LINK`);
          personResults.links.labWebsite = {
            url: attrs.labWebsite,
            accessible: false,
            status
          };
        }

        await page.close();
      } catch (error) {
        brokenLinks++;
        console.log(`   ❌ Error: ${error.message}`);
        personResults.links.labWebsite = {
          url: attrs.labWebsite,
          accessible: false,
          error: error.message
        };
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Validate Google Scholar (no screenshot needed, we trust Google)
    if (attrs.googleScholar && attrs.googleScholar.startsWith('http')) {
      totalLinks++;
      console.log(`\n🎓 Google Scholar: ${attrs.googleScholar}`);

      try {
        const page = await context.newPage();
        const response = await page.goto(attrs.googleScholar, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });

        const status = response.status();
        const accessible = status >= 200 && status < 400;

        console.log(`   Status: ${accessible ? '✅' : '❌'} ${status}`);

        if (accessible) {
          accessibleLinks++;
          personResults.links.googleScholar = {
            url: attrs.googleScholar,
            accessible: true,
            status
          };
        } else {
          brokenLinks++;
          personResults.links.googleScholar = {
            url: attrs.googleScholar,
            accessible: false,
            status
          };
        }

        await page.close();
      } catch (error) {
        brokenLinks++;
        console.log(`   ❌ Error: ${error.message}`);
        personResults.links.googleScholar = {
          url: attrs.googleScholar,
          accessible: false,
          error: error.message
        };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Validate ORCID
    if (attrs.orcid) {
      totalLinks++;
      const orcidUrl = `https://orcid.org/${attrs.orcid}`;
      console.log(`\n🆔 ORCID: ${orcidUrl}`);

      try {
        const page = await context.newPage();
        const response = await page.goto(orcidUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });

        const status = response.status();
        const accessible = status >= 200 && status < 400;

        console.log(`   Status: ${accessible ? '✅' : '❌'} ${status}`);

        if (accessible) {
          accessibleLinks++;
          personResults.links.orcid = {
            url: orcidUrl,
            accessible: true,
            status
          };
        } else {
          brokenLinks++;
          personResults.links.orcid = {
            url: orcidUrl,
            accessible: false,
            status
          };
        }

        await page.close();
      } catch (error) {
        brokenLinks++;
        console.log(`   ❌ Error: ${error.message}`);
        personResults.links.orcid = {
          url: orcidUrl,
          accessible: false,
          error: error.message
        };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    validationResults.push(personResults);
  }

  await browser.close();

  // Generate summary report
  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📊 VALIDATION & SCREENSHOT SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   Total links checked: ${totalLinks}`);
  console.log(`   ✅ Accessible: ${accessibleLinks} (${Math.round(accessibleLinks/totalLinks*100)}%)`);
  console.log(`   ❌ Broken: ${brokenLinks} (${Math.round(brokenLinks/totalLinks*100)}%)`);
  console.log(`   ⚠️  Suspicious: ${suspiciousLinks}`);
  console.log(`   📸 Screenshots taken: ${screenshotsTaken}`);
  console.log(`   📁 Screenshot location: ${screenshotDir}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'link-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalLinks,
      accessibleLinks,
      brokenLinks,
      suspiciousLinks,
      screenshotsTaken
    },
    results: validationResults
  }, null, 2));

  console.log(`📄 Detailed report saved to: link-validation-report.json\n`);

  // List broken links
  if (brokenLinks > 0) {
    console.log('\n❌ BROKEN LINKS:\n');
    for (const result of validationResults) {
      for (const [type, link] of Object.entries(result.links)) {
        if (!link.accessible) {
          console.log(`   ${result.name} - ${type}: ${link.url}`);
          console.log(`      Error: ${link.error || 'HTTP ' + link.status}`);
        }
      }
    }
  }

  // List suspicious links
  if (suspiciousLinks > 0) {
    console.log('\n\n⚠️  SUSPICIOUS LINKS (may not be correct):\n');
    for (const result of validationResults) {
      if (result.links.labWebsite &&
          result.links.labWebsite.accessible &&
          !result.links.labWebsite.likelyCorrect) {
        console.log(`   ${result.name}: ${result.links.labWebsite.url}`);
        console.log(`      Title: ${result.links.labWebsite.title || 'N/A'}`);
        console.log(`      Screenshot: ${path.basename(result.links.labWebsite.screenshot)}`);
      }
    }
  }

  console.log('\n✨ Validation and screenshot complete!\n');
  console.log(`📁 Review screenshots in: ${screenshotDir}\n`);
}

validateAndScreenshot().catch(console.error);
