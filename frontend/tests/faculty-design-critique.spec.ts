import { test, expect } from '@playwright/test';

test.describe('Faculty Tab Design Critique', () => {
  test('Capture faculty tab for design review', async ({ page }) => {
    // Navigate to the people page
    await page.goto('http://localhost:3000/people');
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });

    // Click Faculty tab
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1500);

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/faculty-tab-full.png',
      fullPage: true
    });

    // Take viewport screenshot
    await page.screenshot({
      path: 'test-results/faculty-tab-viewport.png',
      fullPage: false
    });

    // Capture individual card for detailed review
    const firstCard = page.locator('article').first();
    await firstCard.screenshot({
      path: 'test-results/faculty-card-detail.png'
    });

    // Scroll to middle of page and capture
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/faculty-tab-middle.png',
      fullPage: false
    });

    // Test mobile view (iPhone 12 Pro)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/faculty-tab-mobile.png',
      fullPage: true
    });

    // Test tablet view (iPad)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/faculty-tab-tablet.png',
      fullPage: true
    });

    // Test desktop view (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'test-results/faculty-tab-desktop.png',
      fullPage: false
    });

    // Capture hover state
    await page.setViewportSize({ width: 1440, height: 900 });
    const cardToHover = page.locator('article').first();
    await cardToHover.hover();
    await page.waitForTimeout(300);
    await cardToHover.screenshot({
      path: 'test-results/faculty-card-hover.png'
    });

    console.log('✅ All screenshots captured in test-results/');
  });

  test('Analyze layout and spacing', async ({ page }) => {
    await page.goto('http://localhost:3000/people');
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1500);

    // Get grid container
    const grid = page.locator('[role="list"]');
    const gridBox = await grid.boundingBox();

    // Get all cards
    const cards = page.locator('article');
    const cardCount = await cards.count();

    console.log('\n=== LAYOUT ANALYSIS ===');
    console.log(`Total cards: ${cardCount}`);
    console.log(`Grid container width: ${gridBox?.width}px`);
    console.log(`Grid container height: ${gridBox?.height}px`);

    // Analyze first few cards
    for (let i = 0; i < Math.min(4, cardCount); i++) {
      const card = cards.nth(i);
      const box = await card.boundingBox();
      const bgColor = await card.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      const borderRadius = await card.evaluate(el =>
        window.getComputedStyle(el).borderRadius
      );
      const boxShadow = await card.evaluate(el =>
        window.getComputedStyle(el).boxShadow
      );

      console.log(`\nCard ${i + 1}:`);
      console.log(`  Size: ${box?.width}px × ${box?.height}px`);
      console.log(`  Background: ${bgColor}`);
      console.log(`  Border radius: ${borderRadius}`);
      console.log(`  Box shadow: ${boxShadow}`);
    }
  });

  test('Analyze typography', async ({ page }) => {
    await page.goto('http://localhost:3000/people');
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1500);

    const firstCard = page.locator('article').first();

    // Analyze name typography
    const name = firstCard.locator('h3').first();
    const nameStyles = await name.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
        fontFamily: styles.fontFamily
      };
    });

    // Analyze title typography
    const title = firstCard.locator('p').first();
    const titleStyles = await title.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
        fontFamily: styles.fontFamily
      };
    });

    console.log('\n=== TYPOGRAPHY ANALYSIS ===');
    console.log('\nName (h3):');
    console.log(`  Font: ${nameStyles.fontFamily}`);
    console.log(`  Size: ${nameStyles.fontSize}`);
    console.log(`  Weight: ${nameStyles.fontWeight}`);
    console.log(`  Line height: ${nameStyles.lineHeight}`);
    console.log(`  Color: ${nameStyles.color}`);

    console.log('\nTitle (p):');
    console.log(`  Font: ${titleStyles.fontFamily}`);
    console.log(`  Size: ${titleStyles.fontSize}`);
    console.log(`  Weight: ${titleStyles.fontWeight}`);
    console.log(`  Line height: ${titleStyles.lineHeight}`);
    console.log(`  Color: ${titleStyles.color}`);
  });

  test('Analyze colors and contrast', async ({ page }) => {
    await page.goto('http://localhost:3000/people');
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1500);

    const firstCard = page.locator('article').first();

    // Get all color values
    const colors = await firstCard.evaluate(el => {
      const card = el;
      const name = el.querySelector('h3');
      const title = el.querySelector('p');
      const button = el.querySelector('a');

      const cardStyles = window.getComputedStyle(card);
      const nameStyles = name ? window.getComputedStyle(name) : null;
      const titleStyles = title ? window.getComputedStyle(title) : null;
      const buttonStyles = button ? window.getComputedStyle(button) : null;

      return {
        cardBg: cardStyles.backgroundColor,
        cardBorder: cardStyles.borderColor,
        nameColor: nameStyles?.color,
        titleColor: titleStyles?.color,
        buttonBg: buttonStyles?.backgroundColor,
        buttonColor: buttonStyles?.color
      };
    });

    console.log('\n=== COLOR ANALYSIS ===');
    console.log(`Card background: ${colors.cardBg}`);
    console.log(`Card border: ${colors.cardBorder}`);
    console.log(`Name text color: ${colors.nameColor}`);
    console.log(`Title text color: ${colors.titleColor}`);
    console.log(`Button background: ${colors.buttonBg}`);
    console.log(`Button text color: ${colors.buttonColor}`);
  });

  test('Analyze responsive behavior', async ({ page }) => {
    await page.goto('http://localhost:3000/people');
    await page.waitForSelector('[role="tablist"]', { timeout: 10000 });
    await page.click('button:has-text("Faculty")');
    await page.waitForTimeout(1500);

    const viewports = [
      { name: 'Mobile (390px)', width: 390, height: 844 },
      { name: 'Tablet (768px)', width: 768, height: 1024 },
      { name: 'Desktop (1024px)', width: 1024, height: 768 },
      { name: 'Large Desktop (1440px)', width: 1440, height: 900 },
      { name: 'XL Desktop (1920px)', width: 1920, height: 1080 }
    ];

    console.log('\n=== RESPONSIVE ANALYSIS ===');

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);

      const grid = page.locator('[role="list"]');
      const gridStyles = await grid.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          gridTemplateColumns: styles.gridTemplateColumns,
          gap: styles.gap
        };
      });

      const cardCount = await page.locator('article').count();
      const firstCard = page.locator('article').first();
      const cardBox = await firstCard.boundingBox();

      console.log(`\n${viewport.name}:`);
      console.log(`  Grid columns: ${gridStyles.gridTemplateColumns}`);
      console.log(`  Gap: ${gridStyles.gap}`);
      console.log(`  Card width: ${cardBox?.width}px`);
      console.log(`  Visible cards: ${cardCount}`);
    }
  });
});
