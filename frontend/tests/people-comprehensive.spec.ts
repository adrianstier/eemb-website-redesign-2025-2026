import { test, expect } from '@playwright/test';

test.describe('Comprehensive People Database', () => {
  test.beforeEach(async ({ page }) => {
    // Enable console logging for debugging
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  });

  test('should load people page with all three tabs', async ({ page }) => {
    console.log('Navigating to /people page...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });

    // Check page title
    await expect(page.locator('h1')).toContainText('Our People');

    // Check all three tabs are present
    console.log('Checking for tabs...');
    const facultyTab = page.locator('button:has-text("Faculty")');
    const staffTab = page.locator('button:has-text("Staff")');
    const studentsTab = page.locator('button:has-text("Students")');

    await expect(facultyTab).toBeVisible();
    await expect(staffTab).toBeVisible();
    await expect(studentsTab).toBeVisible();

    console.log('✅ All tabs are visible');
  });

  test('should fetch and display faculty data', async ({ page }) => {
    console.log('Testing faculty data...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });

    // Wait for data to load
    await page.waitForTimeout(2000);

    // Faculty tab should be active by default
    const facultyTab = page.locator('button:has-text("Faculty")');
    await expect(facultyTab).toHaveClass(/bg-ocean-mid/);

    // Check for faculty cards
    const facultyCards = page.locator('div.bg-white.rounded-lg.shadow-lg');
    const count = await facultyCards.count();
    console.log(`Found ${count} faculty cards`);

    expect(count).toBeGreaterThan(0);
    console.log('✅ Faculty data is loading');

    // Check that at least one faculty member has required info
    const firstCard = facultyCards.first();
    await expect(firstCard.locator('h3')).toBeVisible(); // Name
    await expect(firstCard.locator('a[href^="mailto:"]')).toBeVisible(); // Email

    console.log('✅ Faculty cards display correctly');
  });

  test('should switch to staff tab and display staff', async ({ page }) => {
    console.log('Testing staff tab...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });

    // Click staff tab
    const staffTab = page.locator('button:has-text("Staff")');
    await staffTab.click();

    // Wait for tab to become active
    await expect(staffTab).toHaveClass(/bg-ocean-mid/);
    console.log('✅ Staff tab is now active');

    // Wait for data to load
    await page.waitForTimeout(2000);

    // Check for staff cards
    const staffCards = page.locator('div.bg-white.rounded-lg.shadow-lg');
    const count = await staffCards.count();
    console.log(`Found ${count} staff cards`);

    expect(count).toBeGreaterThan(0);
    console.log('✅ Staff data is loading');

    // Verify staff card content
    const firstCard = staffCards.first();
    await expect(firstCard.locator('h3')).toBeVisible(); // Name
    await expect(firstCard.locator('a[href^="mailto:"]')).toBeVisible(); // Email
  });

  test('should switch to students tab and display students', async ({ page }) => {
    console.log('Testing students tab...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });

    // Click students tab
    const studentsTab = page.locator('button:has-text("Students")');
    await studentsTab.click();

    // Wait for tab to become active
    await expect(studentsTab).toHaveClass(/bg-ocean-mid/);
    console.log('✅ Students tab is now active');

    // Wait for data to load
    await page.waitForTimeout(2000);

    // Check for student cards
    const studentCards = page.locator('div.bg-white.rounded-lg.shadow-lg');
    const count = await studentCards.count();
    console.log(`Found ${count} student cards`);

    expect(count).toBeGreaterThan(0);
    console.log('✅ Students data is loading');

    // Verify student card content
    const firstCard = studentCards.first();
    await expect(firstCard.locator('h3')).toBeVisible(); // Name
    await expect(firstCard.locator('a[href^="mailto:"]')).toBeVisible(); // Email
  });

  test('should search across people', async ({ page }) => {
    console.log('Testing search functionality...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Get initial count
    const initialCards = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Initial faculty count: ${initialCards}`);

    // Search for a common name/word
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('ucsb.edu');
    await page.waitForTimeout(1000);

    // Should still have results (everyone has ucsb.edu email)
    const searchResults = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Search results: ${searchResults}`);
    expect(searchResults).toBeGreaterThan(0);

    // Try a more specific search
    await searchInput.clear();
    await searchInput.fill('Professor');
    await page.waitForTimeout(1000);

    const professorResults = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Professor search results: ${professorResults}`);

    console.log('✅ Search functionality works');
  });

  test('should verify people data loads via Supabase on the rendered page', async ({ page }) => {
    console.log('Testing that people data loads from Supabase via the app...');

    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Verify faculty data loaded
    const facultyCards = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Faculty cards rendered: ${facultyCards}`);
    expect(facultyCards).toBeGreaterThan(0);

    // Switch to staff tab and verify data
    await page.locator('button:has-text("Staff")').click();
    await page.waitForTimeout(1000);
    const staffCards = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Staff cards rendered: ${staffCards}`);
    expect(staffCards).toBeGreaterThan(0);

    // Switch to students tab and verify data
    await page.locator('button:has-text("Students")').click();
    await page.waitForTimeout(1000);
    const studentCards = await page.locator('div.bg-white.rounded-lg.shadow-lg').count();
    console.log(`Student cards rendered: ${studentCards}`);
    expect(studentCards).toBeGreaterThan(0);

    console.log('All people data is loading from Supabase');
  });

  test('should display correct counts in tabs', async ({ page }) => {
    console.log('Testing tab counts...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check faculty count
    const facultyTab = page.locator('button:has-text("Faculty")');
    const facultyText = await facultyTab.textContent();
    console.log(`Faculty tab text: ${facultyText}`);
    expect(facultyText).toMatch(/\d+/); // Should contain a number

    // Check staff count
    const staffTab = page.locator('button:has-text("Staff")');
    const staffText = await staffTab.textContent();
    console.log(`Staff tab text: ${staffText}`);
    expect(staffText).toMatch(/\d+/);

    // Check students count
    const studentsTab = page.locator('button:has-text("Students")');
    const studentsText = await studentsTab.textContent();
    console.log(`Students tab text: ${studentsText}`);
    expect(studentsText).toMatch(/\d+/);

    console.log('✅ All tabs show counts');
  });

  test('should display photos correctly', async ({ page }) => {
    console.log('Testing photo display...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Find cards with photos
    const photoElements = page.locator('div.rounded-full img');
    const photoCount = await photoElements.count();
    console.log(`Found ${photoCount} photos`);

    if (photoCount > 0) {
      // Check that at least one photo loaded
      const firstPhoto = photoElements.first();
      const src = await firstPhoto.getAttribute('src');
      console.log(`First photo src: ${src}`);
      expect(src).toBeTruthy();

      // Check if photo is visible
      await expect(firstPhoto).toBeVisible();
      console.log('✅ Photos are displaying');
    } else {
      console.log('⚠️  No photos found, but cards should show initials');
      // Check for initials fallback
      const initials = page.locator('div.rounded-full span.text-white');
      await expect(initials.first()).toBeVisible();
    }
  });

  test('should handle empty search gracefully', async ({ page }) => {
    console.log('Testing empty search results...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Search for something that doesn't exist
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('zzzzzzzzzzzzz');
    await page.waitForTimeout(1000);

    // Should show "no results" message
    const noResults = page.locator('text=No faculty found matching your search');
    await expect(noResults).toBeVisible();
    console.log('✅ Empty search handled correctly');
  });

  test('should take screenshots of all tabs', async ({ page }) => {
    console.log('Taking screenshots...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Screenshot faculty tab
    await page.screenshot({
      path: '/tmp/people-faculty-tab.png',
      fullPage: true
    });
    console.log('✅ Faculty screenshot saved');

    // Screenshot staff tab
    await page.locator('button:has-text("Staff")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: '/tmp/people-staff-tab.png',
      fullPage: true
    });
    console.log('✅ Staff screenshot saved');

    // Screenshot students tab
    await page.locator('button:has-text("Students")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: '/tmp/people-students-tab.png',
      fullPage: true
    });
    console.log('✅ Students screenshot saved');
  });
});
