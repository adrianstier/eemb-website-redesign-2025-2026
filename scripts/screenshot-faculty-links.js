#!/usr/bin/env node

/**
 * Take screenshots of faculty links using Playwright
 * to visually verify they're the correct sites
 */

const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  // Check if Playwright is installed
  let playwright;
  try {
    playwright = require('playwright');
  } catch (error) {
    console.log('❌ Playwright not found. Installing...\n');
    console.log('Please run: npm install -D playwright\n');
    console.log('Then run: npx playwright install chromium\n');
    return;
  }

  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Fetching faculty from database...\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  // Create screenshot directory
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

  let screenshotCount = 0;
  let errorCount = 0;

  console.log('📸 Taking screenshots...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  for (const person of faculty) {
    const attrs = person.attributes;
    const name = attrs.fullName;
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    if (!attrs.labWebsite && !attrs.googleScholar) {
      continue;
    }

    console.log(`\n👤 ${name}`);

    // Screenshot lab website
    if (attrs.labWebsite && attrs.labWebsite.startsWith('http')) {
      try {
        console.log(`   📸 Lab Website: ${attrs.labWebsite}`);

        const page = await context.newPage();
        await page.goto(attrs.labWebsite, {
          waitUntil: 'networkidle',
          timeout: 15000
        });

        const screenshotPath = path.join(screenshotDir, `${safeName}_lab.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: false
        });

        console.log(`      ✅ Saved: ${screenshotPath}`);
        screenshotCount++;

        await page.close();
      } catch (error) {
        console.log(`      ❌ Failed: ${error.message}`);
        errorCount++;
      }

      // Delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Screenshot Google Scholar
    if (attrs.googleScholar && attrs.googleScholar.startsWith('http')) {
      try {
        console.log(`   📸 Google Scholar: ${attrs.googleScholar}`);

        const page = await context.newPage();
        await page.goto(attrs.googleScholar, {
          waitUntil: 'networkidle',
          timeout: 15000
        });

        const screenshotPath = path.join(screenshotDir, `${safeName}_scholar.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: false
        });

        console.log(`      ✅ Saved: ${screenshotPath}`);
        screenshotCount++;

        await page.close();
      } catch (error) {
        console.log(`      ❌ Failed: ${error.message}`);
        errorCount++;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  await browser.close();

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📊 SCREENSHOT SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   ✅ Screenshots taken: ${screenshotCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📁 Location: ${screenshotDir}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('✨ Done! Review screenshots to verify links are correct.\n');
}

takeScreenshots().catch(console.error);
