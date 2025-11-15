#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Quick check of what people are on each category page on the original EEMB website
 */

async function checkCategories() {
  console.log('🔍 Checking categorization on original EEMB website...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  const results = {
    faculty: [],
    students: [],
    staff: []
  };

  // Check Faculty page
  console.log('📋 Checking Faculty page...');
  await page.goto('https://www.eemb.ucsb.edu/people/faculty', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await page.waitForTimeout(1500);

  results.faculty = await page.evaluate(() => {
    const names = [];
    // Try multiple selectors to find names
    const links = document.querySelectorAll('a[href*="/people/faculty/"]');
    links.forEach(link => {
      const name = link.innerText.trim();
      // Only get actual names, not navigation links
      if (name &&
          !name.toLowerCase().includes('faculty') &&
          !name.toLowerCase().includes('view') &&
          name.length > 2 &&
          name.length < 100) {
        names.push(name);
      }
    });
    return [...new Set(names)]; // Deduplicate
  });

  console.log(`   Found ${results.faculty.length} faculty\n`);

  // Check Graduate Students page
  console.log('📋 Checking Graduate Students page...');
  await page.goto('https://www.eemb.ucsb.edu/people/graduate-students', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await page.waitForTimeout(1500);

  results.students = await page.evaluate(() => {
    const names = [];
    const links = document.querySelectorAll('a[href*="/people/graduate-students/"]');
    links.forEach(link => {
      const name = link.innerText.trim();
      if (name &&
          !name.toLowerCase().includes('student') &&
          !name.toLowerCase().includes('view') &&
          name.length > 2 &&
          name.length < 100) {
        names.push(name);
      }
    });
    return [...new Set(names)];
  });

  console.log(`   Found ${results.students.length} students\n`);

  // Check Staff page
  console.log('📋 Checking Staff page...');
  await page.goto('https://www.eemb.ucsb.edu/people/staff', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await page.waitForTimeout(1500);

  results.staff = await page.evaluate(() => {
    const names = [];
    const links = document.querySelectorAll('a[href*="/people/staff/"]');
    links.forEach(link => {
      const name = link.innerText.trim();
      if (name &&
          !name.toLowerCase().includes('staff') &&
          !name.toLowerCase().includes('view') &&
          name.length > 2 &&
          name.length < 100) {
        names.push(name);
      }
    });
    return [...new Set(names)];
  });

  console.log(`   Found ${results.staff.length} staff\n`);

  await browser.close();

  // Save results
  fs.writeFileSync('scripts/website-categories.json', JSON.stringify(results, null, 2));

  console.log('✅ Results saved to scripts/website-categories.json\n');
  console.log('📊 Summary:');
  console.log(`   Faculty: ${results.faculty.length}`);
  console.log(`   Students: ${results.students.length}`);
  console.log(`   Staff: ${results.staff.length}`);
  console.log(`   Total: ${results.faculty.length + results.students.length + results.staff.length}`);

  return results;
}

checkCategories().catch(console.error);
