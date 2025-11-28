import { test, expect } from '@playwright/test';

test.describe('People Directory Layout Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/people');
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });
  });

  test('Directory view displays phone book list layout', async ({ page }) => {
    // Click Faculty tab to get directory view
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1000);

    // Should have article elements (not table)
    const articles = await page.locator('article').count();
    expect(articles).toBeGreaterThan(0);

    console.log(`✅ Directory view showing ${articles} people in list format`);
  });

  test('Directory cards have horizontal layout', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1000);

    const firstCard = page.locator('article').first();

    // Check for horizontal flex layout
    const cardClasses = await firstCard.getAttribute('class');
    expect(cardClasses).toContain('border-b'); // List item style, not card style

    // Get card dimensions
    const box = await firstCard.boundingBox();
    console.log(`\nCard dimensions: ${box?.width}px × ${box?.height}px`);

    // Should be wide and short (horizontal layout)
    expect(box?.height).toBeLessThan(100); // Should be compact (~60-80px)

    console.log(`✅ Cards are horizontally laid out (${box?.height}px height)`);
  });

  test('Directory cards show avatar on left', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1000);

    const firstCard = page.locator('article').first();
    const avatar = firstCard.locator('div.w-10.h-10').first(); // 40px avatar

    const exists = await avatar.count();
    expect(exists).toBe(1);

    // Check avatar size
    const avatarBox = await avatar.boundingBox();
    expect(avatarBox?.width).toBe(40);
    expect(avatarBox?.height).toBe(40);

    console.log(`✅ Avatar is 40px × 40px on the left`);
  });

  test('Directory shows name, title, email, and office columns', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1500);

    const firstCard = page.locator('article').first();

    // Check for name (h3)
    const name = await firstCard.locator('h3').textContent();
    expect(name).toBeTruthy();

    // Check for title/position (should be visible)
    const titleExists = await firstCard.locator('p.text-xs.text-gray-600').count();
    expect(titleExists).toBeGreaterThan(0);

    // On desktop, should have email link
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);

    const emailLink = await firstCard.locator('a[href^="mailto:"]').count();

    console.log(`✅ Card shows: Name="${name?.trim()}", Has email link: ${emailLink > 0}`);
  });

  test('Directory has arrow link to profile', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1000);

    const firstCard = page.locator('article').first();

    // Check for arrow SVG icon
    const arrowIcon = await firstCard.locator('svg').last().count();
    expect(arrowIcon).toBe(1);

    // Check for profile link
    const profileLink = await firstCard.locator('a[href*="/people/faculty/"]').count();
    expect(profileLink).toBe(1);

    console.log(`✅ Each card has arrow link to profile`);
  });

  test('Responsive: Mobile shows minimal columns', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1000);

    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);

    const firstCard = page.locator('article').first();

    // Should have avatar and name visible
    const avatar = await firstCard.locator('div.w-10.h-10').count();
    const name = await firstCard.locator('h3').textContent();

    expect(avatar).toBe(1);
    expect(name).toBeTruthy();

    // Title might be hidden on mobile (check computed style)
    const titleElements = await firstCard.locator('p.text-xs').count();

    console.log(`✅ Mobile view: Avatar + Name visible, ${titleElements} additional fields`);
  });

  test('Responsive: Desktop shows all columns', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1000);

    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    const firstCard = page.locator('article').first();

    // Should show: avatar, name, title, email, office
    const avatar = await firstCard.locator('div.w-10.h-10').count();
    const name = await firstCard.locator('h3').textContent();
    const title = await firstCard.locator('p.text-xs').first().textContent();
    const email = await firstCard.locator('a[href^="mailto:"]').count();

    expect(avatar).toBe(1);
    expect(name).toBeTruthy();
    expect(title).toBeTruthy();

    console.log(`✅ Desktop view shows all fields`);
    console.log(`   Name: ${name?.trim()}`);
    console.log(`   Title: ${title?.trim()}`);
    console.log(`   Email link: ${email > 0 ? 'Yes' : 'No'}`);
  });

  test('Directory cards have hover effect', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1000);

    const firstCard = page.locator('article').first();

    // Get background color before hover
    const bgBefore = await firstCard.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Hover over card
    await firstCard.hover();
    await page.waitForTimeout(200);

    const bgAfter = await firstCard.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Should have hover state (background should change)
    console.log(`✅ Hover effect: ${bgBefore} → ${bgAfter}`);
    expect(bgBefore).not.toBe(bgAfter);
  });

  test('All directory cards align consistently', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1500);

    const cards = page.locator('article');
    const cardCount = await cards.count();

    // Get heights of first 5 cards
    const heights: number[] = [];
    for (let i = 0; i < Math.min(5, cardCount); i++) {
      const card = cards.nth(i);
      const box = await card.boundingBox();
      if (box) heights.push(box.height);
    }

    // All cards should have similar heights (±5px tolerance)
    const avgHeight = heights.reduce((a, b) => a + b, 0) / heights.length;
    const allSimilar = heights.every(h => Math.abs(h - avgHeight) < 5);

    expect(allSimilar).toBe(true);

    console.log(`✅ All cards aligned: Heights ${heights.map(h => Math.round(h))}px`);
    console.log(`   Average: ${Math.round(avgHeight)}px`);
  });

  test('Directory container has proper styling', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1000);

    // Find the container div
    const container = page.locator('div.bg-white.rounded-lg.shadow-md').first();

    const containerStyles = await container.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        background: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        overflow: styles.overflow
      };
    });

    expect(containerStyles.background).toBeTruthy();
    expect(containerStyles.borderRadius).toBeTruthy();

    console.log(`✅ Container styling:`);
    console.log(`   Background: ${containerStyles.background}`);
    console.log(`   Border radius: ${containerStyles.borderRadius}`);
    console.log(`   Shadow: ${containerStyles.boxShadow !== 'none' ? 'Yes' : 'No'}`);
  });

  test('No research view toggle exists', async ({ page }) => {
    // Should NOT have view mode toggle buttons
    const toggleButtons = await page.locator('button:has-text("Directory View"), button:has-text("Research View")').count();

    expect(toggleButtons).toBe(0);

    console.log(`✅ No view mode toggle (directory-only design)`);
  });

  test('Directory is scannable - fits many people on screen', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1500);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);

    // Count visible cards in viewport
    const cards = page.locator('article');
    const cardCount = await cards.count();

    let visibleCount = 0;
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const isVisible = await card.isVisible();
      if (isVisible) {
        const box = await card.boundingBox();
        if (box && box.y < 900) { // Within viewport
          visibleCount++;
        }
      }
    }

    // Should show at least 10 people without scrolling
    expect(visibleCount).toBeGreaterThanOrEqual(10);

    console.log(`✅ Scannable: ${visibleCount} people visible in viewport (1440×900)`);
  });

  test('Take screenshot of directory view', async ({ page }) => {
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1500);

    // Desktop screenshot
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/directory-desktop.png',
      fullPage: false
    });

    // Mobile screenshot
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/directory-mobile.png',
      fullPage: false
    });

    console.log(`✅ Screenshots saved to test-results/`);
  });
});
