import { test, expect } from '@playwright/test';

test.describe('Faculty Photos Verification', () => {
  test('should display faculty photos on people page', async ({ page }) => {
    // Navigate to the people page
    await page.goto('http://localhost:3000/people');

    // Wait for faculty to load
    await page.waitForSelector('[class*="bg-white"][class*="rounded-lg"]', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: '/tmp/faculty-photos-check.png', fullPage: true });

    // Count total faculty cards
    const facultyCards = await page.locator('[class*="bg-white"][class*="rounded-lg"]').count();
    console.log(`\n📊 Total faculty cards: ${facultyCards}`);
    expect(facultyCards).toBe(36);

    // Count actual photo images (not initials)
    const photoImages = await page.locator('img[src*="/uploads/faculty/"]').count();
    console.log(`📷 Faculty photos displayed: ${photoImages}`);

    // Count initials placeholders
    const initialsPlaceholders = await page.locator('span:has-text(/^[A-Z]{1,2}$/)').count();
    console.log(`🔤 Initials placeholders: ${initialsPlaceholders}`);

    // List all faculty with photos
    const photosFound = await page.locator('img[src*="/uploads/faculty/"]').evaluateAll(imgs =>
      imgs.map(img => ({
        alt: img.getAttribute('alt'),
        src: img.getAttribute('src')
      }))
    );

    console.log(`\n✅ Faculty with photos (${photosFound.length}):`);
    photosFound.forEach((photo, idx) => {
      console.log(`  ${idx + 1}. ${photo.alt}`);
    });

    // Check specific faculty we know should have photos
    const expectedPhotos = [
      'Cherie Briggs',
      'Adrian Stier',
      'Holly Moeller',
      'Stephen Proulx',
      'Todd Oakley',
      'Gretchen Hofmann',
      'Douglas McCauley',
      'Alyson Santoro'
    ];

    console.log(`\n🔍 Checking specific faculty photos:`);
    for (const name of expectedPhotos) {
      const hasPhoto = await page.locator(`img[alt="${name}"][src*="/uploads/faculty/"]`).count();
      const status = hasPhoto > 0 ? '✅' : '❌';
      console.log(`  ${status} ${name}: ${hasPhoto > 0 ? 'PHOTO' : 'NO PHOTO'}`);
    }

    // Verify research interests are showing
    const researchCount = await page.locator('text=/ecology|biology|evolution/i').count();
    console.log(`\n📚 Research interest mentions: ${researchCount}`);
    expect(researchCount).toBeGreaterThan(0);

    // Verify offices are showing
    const officeCount = await page.locator('text=/Noble Hall|Marine Science|Life Sciences/i').count();
    console.log(`🏢 Office location mentions: ${officeCount}`);
    expect(officeCount).toBeGreaterThan(0);

    console.log(`\n📸 Screenshot saved to: /tmp/faculty-photos-check.png`);
  });

  test('should check individual faculty profile page with photo', async ({ page }) => {
    // Test a faculty member we know has a photo
    await page.goto('http://localhost:3000/people/faculty/stephen-proulx');
    await page.waitForTimeout(2000);

    // Check for photo
    const hasPhoto = await page.locator('img[src*="/uploads/faculty/stephen-proulx"]').count();
    console.log(`\n📷 Stephen Proulx profile photo: ${hasPhoto > 0 ? 'FOUND' : 'NOT FOUND'}`);

    // Check for name
    const hasName = await page.locator('h1:has-text("Stephen Proulx")').count();
    console.log(`✅ Name displayed: ${hasName > 0 ? 'YES' : 'NO'}`);

    // Take screenshot
    await page.screenshot({ path: '/tmp/faculty-profile-proulx.png', fullPage: true });
    console.log(`📸 Profile screenshot saved to: /tmp/faculty-profile-proulx.png`);
  });

  test('should verify faculty photo images load correctly on the page', async ({ page }) => {
    console.log(`\nTesting faculty photo accessibility on the rendered page...`);

    await page.goto('http://localhost:3000/people');
    await page.waitForSelector('[class*="bg-white"][class*="rounded-lg"]', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Find all faculty photo images and check they loaded (naturalWidth > 0)
    const images = await page.locator('img[src*="/uploads/faculty/"]').all();
    console.log(`  Found ${images.length} faculty photo images`);

    let loadedCount = 0;
    let brokenCount = 0;

    for (const img of images) {
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      const filename = src?.split('/').pop() || 'unknown';

      if (naturalWidth > 0) {
        loadedCount++;
        console.log(`  OK ${filename}: loaded`);
      } else {
        brokenCount++;
        console.log(`  BROKEN ${filename}: failed to load`);
      }
    }

    console.log(`\n  Summary: ${loadedCount} loaded, ${brokenCount} broken`);
    expect(brokenCount).toBe(0);
  });
});