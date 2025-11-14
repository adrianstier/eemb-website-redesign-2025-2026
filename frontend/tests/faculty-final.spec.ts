import { test, expect } from '@playwright/test';

test.describe('Faculty Page Final Verification', () => {
  test('should display all 36 faculty members with photos and content', async ({ page }) => {
    // Navigate to the people page
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });

    // Wait for faculty to load
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({ path: '/tmp/faculty-final-page.png', fullPage: true });

    // Count faculty cards
    const facultyCards = await page.locator('[class*="bg-white"][class*="rounded-lg"]').count();
    console.log(`✅ Found ${facultyCards} faculty cards`);
    expect(facultyCards).toBe(36);

    // Check for specific faculty members
    const expectedFaculty = [
      'Cherie Briggs',
      'Adrian Stier',
      'Holly Moeller',
      'Hillary Young',
      'Douglas McCauley',
      'Alyson Santoro',
      'Anna James',
      'Thomas Even'
    ];

    for (const name of expectedFaculty) {
      const facultyCard = await page.locator(`text=${name}`).count();
      console.log(`✅ ${name}: ${facultyCard > 0 ? 'FOUND' : 'NOT FOUND'}`);
      expect(facultyCard).toBeGreaterThan(0);
    }

    // Check for photos
    const photos = await page.locator('img[alt*="Briggs"], img[alt*="Stier"], img[alt*="Moeller"]').count();
    console.log(`📷 Found ${photos} faculty photos displayed`);
    expect(photos).toBeGreaterThan(0);

    // Check for research interests
    const researchText = await page.locator('text=/disease ecology|marine ecology|community ecology/i').count();
    console.log(`📚 Found ${researchText} research interest mentions`);
    expect(researchText).toBeGreaterThan(0);

    // Check for office locations
    const officeText = await page.locator('text=/Noble Hall|Marine Science|Life Sciences/i').count();
    console.log(`🏢 Found ${officeText} office location mentions`);
    expect(officeText).toBeGreaterThan(0);

    // Test search functionality
    await page.fill('input[placeholder*="Search"]', 'Briggs');
    await page.waitForTimeout(500);
    const searchResults = await page.locator('text=Cherie Briggs').count();
    console.log(`🔍 Search for "Briggs" returned ${searchResults} results`);
    expect(searchResults).toBeGreaterThan(0);

    // Clear search
    await page.fill('input[placeholder*="Search"]', '');
    await page.waitForTimeout(500);

    // Test filter functionality
    const filterSelect = page.locator('select');
    if (await filterSelect.count() > 0) {
      await filterSelect.selectOption('Professor');
      await page.waitForTimeout(500);
      const profCards = await page.locator('[class*="bg-white"][class*="rounded-lg"]').count();
      console.log(`🎓 Filter to "Professor" shows ${profCards} cards`);
      expect(profCards).toBeGreaterThan(0);
    }

    // Take final screenshot
    await page.screenshot({ path: '/tmp/faculty-final-complete.png', fullPage: true });
    console.log('✅ All tests passed! Screenshots saved to /tmp/');
  });

  test('should display individual faculty profile page', async ({ page }) => {
    // Navigate to a specific faculty member's page
    await page.goto('http://localhost:3000/people/faculty/cherie-briggs', { waitUntil: 'networkidle' });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Check for faculty name
    const nameHeading = await page.locator('h1:has-text("Cherie Briggs")').count();
    console.log(`✅ Faculty name heading: ${nameHeading > 0 ? 'FOUND' : 'NOT FOUND'}`);
    expect(nameHeading).toBeGreaterThan(0);

    // Check for office
    const office = await page.locator('text=/2112 Noble Hall|Office/i').count();
    console.log(`🏢 Office info: ${office > 0 ? 'FOUND' : 'NOT FOUND'}`);

    // Check for research interests
    const research = await page.locator('text=/disease ecology|research/i').count();
    console.log(`📚 Research interests: ${research > 0 ? 'FOUND' : 'NOT FOUND'}`);

    // Take screenshot of profile page
    await page.screenshot({ path: '/tmp/faculty-profile-briggs.png', fullPage: true });
    console.log('✅ Profile page test passed! Screenshot saved.');
  });
});