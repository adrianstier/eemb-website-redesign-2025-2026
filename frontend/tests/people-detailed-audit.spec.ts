import { test, expect } from '@playwright/test';

test.describe('People Page - Detailed Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/people');
    await page.waitForLoadState('networkidle');
  });

  test('should check for broken images', async ({ page }) => {
    console.log('\n🖼️  CHECKING FOR BROKEN IMAGES...\n');

    // Wait for images to load
    await page.waitForTimeout(2000);

    const images = await page.locator('img').all();
    console.log(`Found ${images.length} images on the page`);

    let brokenImages = 0;
    let workingImages = 0;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');

      if (!src) continue;

      // Check if image loaded successfully
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);

      if (naturalWidth === 0) {
        console.log(`❌ BROKEN IMAGE: ${alt || 'No alt text'}`);
        console.log(`   URL: ${src}`);
        brokenImages++;
      } else {
        workingImages++;
      }
    }

    console.log(`\n📊 Image Summary:`);
    console.log(`   ✅ Working: ${workingImages}`);
    console.log(`   ❌ Broken: ${brokenImages}`);

    expect(brokenImages).toBe(0);
  });

  test('should check tab functionality and data consistency', async ({ page }) => {
    console.log('\n📑 CHECKING TAB FUNCTIONALITY...\n');

    // Faculty tab
    const facultyTab = page.locator('button:has-text("Faculty")');
    await facultyTab.click();
    await page.waitForTimeout(500);

    const facultyCount = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    const facultyTabText = await facultyTab.textContent();
    console.log(`Faculty Tab: ${facultyTabText}`);
    console.log(`Faculty Cards Displayed: ${facultyCount}`);

    expect(facultyCount).toBeGreaterThan(0);

    // Staff tab
    const staffTab = page.locator('button:has-text("Staff")');
    await staffTab.click();
    await page.waitForTimeout(500);

    const staffCount = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    const staffTabText = await staffTab.textContent();
    console.log(`\nStaff Tab: ${staffTabText}`);
    console.log(`Staff Cards Displayed: ${staffCount}`);

    expect(staffCount).toBeGreaterThan(0);

    // Students tab
    const studentsTab = page.locator('button:has-text("Students")');
    await studentsTab.click();
    await page.waitForTimeout(500);

    const studentsCount = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    const studentsTabText = await studentsTab.textContent();
    console.log(`\nStudents Tab: ${studentsTabText}`);
    console.log(`Students Cards Displayed: ${studentsCount}`);

    expect(studentsCount).toBeGreaterThan(0);
  });

  test('should check for missing required information', async ({ page }) => {
    console.log('\n📝 CHECKING FOR MISSING INFORMATION...\n');

    const cards = await page.locator('div.bg-white.rounded-lg.shadow-lg').all();
    console.log(`Checking ${cards.length} people cards...`);

    let missingNames = 0;
    let missingEmails = 0;
    let missingPhotos = 0;

    const peopleWithIssues = [];

    for (const card of cards) {
      const name = await card.locator('h3').textContent();
      const email = await card.locator('a[href^="mailto:"]').count();
      const photo = await card.locator('img').count();
      const initials = await card.locator('span.text-white.text-3xl').count();

      const issues = [];

      if (!name || name.trim() === '') {
        missingNames++;
        issues.push('no name');
      }

      if (email === 0) {
        missingEmails++;
        issues.push('no email');
      }

      if (photo === 0 && initials === 0) {
        missingPhotos++;
        issues.push('no photo or initials');
      }

      if (issues.length > 0) {
        peopleWithIssues.push({ name: name || 'Unknown', issues });
      }
    }

    console.log(`\n⚠️  Issues Found:`);
    console.log(`   Missing Names: ${missingNames}`);
    console.log(`   Missing Emails: ${missingEmails}`);
    console.log(`   Missing Photos/Initials: ${missingPhotos}`);

    if (peopleWithIssues.length > 0) {
      console.log(`\n📋 People with Issues:`);
      peopleWithIssues.forEach(person => {
        console.log(`   - ${person.name}: ${person.issues.join(', ')}`);
      });
    }

    expect(missingNames).toBe(0);
    expect(missingEmails).toBe(0);
    expect(missingPhotos).toBe(0);
  });

  test('should check search functionality', async ({ page }) => {
    console.log('\n🔍 CHECKING SEARCH FUNCTIONALITY...\n');

    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();

    // Test search
    await searchInput.fill('marine');
    await page.waitForTimeout(500);

    const resultsAfterSearch = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Results for "marine": ${resultsAfterSearch}`);

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);

    const resultsAfterClear = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Results after clearing search: ${resultsAfterClear}`);

    expect(resultsAfterClear).toBeGreaterThan(resultsAfterSearch);
  });

  test('should check responsive design', async ({ page }) => {
    console.log('\n📱 CHECKING RESPONSIVE DESIGN...\n');

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    const desktopCards = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Desktop (1920x1080): ${desktopCards} cards visible`);

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    const tabletCards = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Tablet (768x1024): ${tabletCards} cards visible`);

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    const mobileCards = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Mobile (375x667): ${mobileCards} cards visible`);

    // All viewports should show the same number of cards
    expect(desktopCards).toBe(tabletCards);
    expect(tabletCards).toBe(mobileCards);
  });

  test('should check accessibility', async ({ page }) => {
    console.log('\n♿ CHECKING ACCESSIBILITY...\n');

    // Check for heading hierarchy
    const h1Count = await page.locator('h1').count();
    console.log(`H1 headings: ${h1Count}`);
    expect(h1Count).toBeGreaterThan(0);

    // Check for alt text on images
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    console.log(`Images without alt text: ${imagesWithoutAlt}`);

    // Check for ARIA labels on interactive elements
    const buttons = await page.locator('button').all();
    let buttonsWithoutLabel = 0;

    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      if (!text?.trim() && !ariaLabel) {
        buttonsWithoutLabel++;
      }
    }

    console.log(`Buttons without text or aria-label: ${buttonsWithoutLabel}`);
    expect(buttonsWithoutLabel).toBe(0);
  });

  test('should check for console errors', async ({ page }) => {
    console.log('\n🐛 CHECKING FOR CONSOLE ERRORS...\n');

    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Navigate and interact
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Switch tabs
    await page.locator('button:has-text("Staff")').click();
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Students")').click();
    await page.waitForTimeout(500);

    console.log(`Console Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Errors:');
      errors.forEach(err => console.log(`  - ${err}`));
    }

    console.log(`Console Warnings: ${warnings.length}`);
    if (warnings.length > 0 && warnings.length < 10) {
      console.log('Warnings:');
      warnings.forEach(warn => console.log(`  - ${warn}`));
    }

    // Filter out common React DevTools message
    const criticalErrors = errors.filter(e =>
      !e.includes('React DevTools') &&
      !e.includes('Download the React DevTools')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should check API response times', async ({ page }) => {
    console.log('\n⏱️  CHECKING API PERFORMANCE...\n');

    const apiCalls: { url: string; startTime: number; duration?: number }[] = [];

    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push({
          url: request.url(),
          startTime: Date.now()
        });
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const call = apiCalls.find(c => c.url === response.url() && !c.duration);
        if (call) {
          call.duration = Date.now() - call.startTime;
        }
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const completedCalls = apiCalls.filter(call => call.duration !== undefined);
    console.log(`\nAPI Calls Made: ${completedCalls.length}`);
    completedCalls.forEach(call => {
      const url = call.url.replace('http://localhost:1337', '');
      console.log(`  ${url}: ${call.duration}ms`);
    });

    // Check if any API calls are too slow
    const slowCalls = completedCalls.filter(call => call.duration! > 2000);
    if (slowCalls.length > 0) {
      console.log(`\n⚠️  Slow API calls (>2s):`);
      slowCalls.forEach(call => console.log(`  - ${call.url}`));
    }
  });

  test('should generate visual report', async ({ page }) => {
    console.log('\n📸 GENERATING VISUAL REPORT...\n');

    // Faculty tab screenshot
    await page.locator('button:has-text("Faculty")').click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/people-audit-faculty.png',
      fullPage: true
    });
    console.log('✅ Faculty screenshot saved');

    // Staff tab screenshot
    await page.locator('button:has-text("Staff")').click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/people-audit-staff.png',
      fullPage: true
    });
    console.log('✅ Staff screenshot saved');

    // Students tab screenshot
    await page.locator('button:has-text("Students")').click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/people-audit-students.png',
      fullPage: true
    });
    console.log('✅ Students screenshot saved');

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: 'test-results/people-audit-mobile.png',
      fullPage: true
    });
    console.log('✅ Mobile screenshot saved');
  });
});
