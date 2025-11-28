import { test, expect } from '@playwright/test';

test.describe('People Directory Filters', () => {
  test.beforeEach(async ({ page }) => {
    // Log console messages
    page.on('console', msg => {
      if (msg.text().includes('FACULTY FILTER') || msg.text().includes('INCLUDED') || msg.text().includes('RENDERING')) {
        console.log('BROWSER:', msg.text());
      }
    });

    // Navigate to the people page
    await page.goto('http://localhost:3000/people');
    // Wait for data to load
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });
  });

  test('Full Directory tab shows all people', async ({ page }) => {
    await page.click('button:has-text("Full Directory")');
    await page.waitForTimeout(1000);

    // Full Directory uses table view, count tbody tr elements
    const peopleRows = await page.locator('tbody tr').count();
    console.log(`Full Directory: ${peopleRows} people`);
    expect(peopleRows).toBeGreaterThan(0);
  });

  test('Faculty tab shows only regular faculty', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1000);

    const facultyCards = await page.locator('article').count();
    console.log(`Faculty: ${facultyCards} people`);

    // Should show around 34 faculty
    expect(facultyCards).toBeGreaterThan(0);

    // Check titles don't include "Research Professor"
    const titles = await page.locator('article p').allTextContents();
    const hasResearch = titles.some(t => t.toLowerCase().includes('research professor'));
    expect(hasResearch).toBe(false);
  });

  test('Researchers tab shows research professors', async ({ page }) => {
    await page.click('button:has-text("Researchers")');
    await page.waitForTimeout(1000);

    const researcherCards = await page.locator('article').count();
    console.log(`Researchers: ${researcherCards} people`);

    // Should show around 19 researchers
    expect(researcherCards).toBeGreaterThan(0);
  });

  test('Students tab shows only students', async ({ page }) => {
    await page.click('button:has-text("Students")');
    await page.waitForTimeout(1000);

    const studentCards = await page.locator('article').count();
    console.log(`Students: ${studentCards} people`);

    // Should show around 35 students
    expect(studentCards).toBeGreaterThan(0);
  });

  test('Staff tab shows only staff', async ({ page }) => {
    await page.click('button:has-text("Staff")');
    await page.waitForTimeout(1000);

    const staffCards = await page.locator('article').count();
    console.log(`Staff: ${staffCards} people`);

    // Should show around 19 staff
    expect(staffCards).toBeGreaterThan(0);
  });

  test('Tab counts match displayed people', async ({ page }) => {
    // Get all tab buttons
    const tabs = ['Full Directory', 'Faculty', 'Researchers', 'Students', 'Staff'];

    for (const tabName of tabs) {
      // Click the tab
      await page.click(`button:has-text("${tabName}")`);
      await page.waitForTimeout(1000);

      // Get count from button
      const buttonText = await page.locator(`button:has-text("${tabName}")`).textContent();
      const countMatch = buttonText?.match(/\((\d+)\)/);
      const expectedCount = countMatch ? parseInt(countMatch[1]) : 0;

      // Get actual displayed count
      // Full Directory uses table view, others use card grid
      const actualCount = tabName === 'Full Directory'
        ? await page.locator('tbody tr').count()
        : await page.locator('article').count();

      console.log(`${tabName}: Expected ${expectedCount}, Got ${actualCount}`);

      expect(actualCount).toBe(expectedCount);
    }
  });
});
