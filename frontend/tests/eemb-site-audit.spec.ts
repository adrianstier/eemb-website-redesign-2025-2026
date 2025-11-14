import { test, expect } from '@playwright/test';

test.describe('EEMB Website Comprehensive Audit', () => {

  test('Homepage - Test and identify issues', async ({ page }) => {
    console.log('\n🔍 Testing Homepage...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot for visual review
    await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });

    // Test hero section
    const hero = await page.locator('section').first();
    await expect(hero).toBeVisible();

    // Check for main heading - Updated for Ocean Recoveries Lab design
    const mainHeading = await page.getByRole('heading', { level: 1 }).first();
    await expect(mainHeading).toContainText('Recovering Our Ocean');

    // Test navigation
    const nav = await page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Check Mission section
    const missionSection = await page.getByText('Our Mission').first();
    await expect(missionSection).toBeVisible();

    // Check Impact Metrics section
    const impactSection = await page.getByText('Our Impact');
    await expect(impactSection).toBeVisible();

    // Check Research Themes section
    const researchSection = await page.getByText('Our Research');
    await expect(researchSection).toBeVisible();

    // Test responsive menu on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'screenshots/homepage-mobile.png', fullPage: true });

    console.log('✅ Homepage tested');
  });

  test('Faculty Directory - Create and test', async ({ page }) => {
    console.log('\n🔍 Testing Faculty Directory...');

    await page.goto('/faculty');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/faculty.png', fullPage: true });

    // Check if page loads (might be 404 initially)
    const title = await page.title();
    console.log(`Faculty page title: ${title}`);

    // Check for content or 404
    const pageContent = await page.content();
    if (pageContent.includes('404')) {
      console.log('⚠️ Faculty page needs to be created');
    } else {
      console.log('✅ Faculty page exists');
    }
  });

  test('Alumni Pages - Create and test', async ({ page }) => {
    console.log('\n🔍 Testing Alumni Pages...');

    await page.goto('/alumni');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/alumni.png', fullPage: true });

    const pageContent = await page.content();
    if (pageContent.includes('404')) {
      console.log('⚠️ Alumni page needs to be created');
    } else {
      console.log('✅ Alumni page exists');
    }
  });

  test('News/Blog Pages - Create and test', async ({ page }) => {
    console.log('\n🔍 Testing News Pages...');

    await page.goto('/news');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/news.png', fullPage: true });

    const pageContent = await page.content();
    if (pageContent.includes('404')) {
      console.log('⚠️ News page needs to be created');
    } else {
      console.log('✅ News page exists');
    }
  });

  test('Events Pages - Create and test', async ({ page }) => {
    console.log('\n🔍 Testing Events Pages...');

    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/events.png', fullPage: true });

    const pageContent = await page.content();
    if (pageContent.includes('404')) {
      console.log('⚠️ Events page needs to be created');
    } else {
      console.log('✅ Events page exists');
    }
  });

  test('Research Pages - Create and test', async ({ page }) => {
    console.log('\n🔍 Testing Research Pages...');

    await page.goto('/research');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/research.png', fullPage: true });

    const pageContent = await page.content();
    if (pageContent.includes('404')) {
      console.log('⚠️ Research page needs to be created');
    } else {
      console.log('✅ Research page exists');
    }
  });

  test('Academics Pages - Create and test', async ({ page }) => {
    console.log('\n🔍 Testing Academics Pages...');

    await page.goto('/academics');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/academics.png', fullPage: true });

    const pageContent = await page.content();
    if (pageContent.includes('404')) {
      console.log('⚠️ Academics page needs to be created');
    } else {
      console.log('✅ Academics page exists');
    }
  });

  test('DEI Pages - Create and test', async ({ page }) => {
    console.log('\n🔍 Testing DEI Pages...');

    await page.goto('/dei');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/dei.png', fullPage: true });

    const pageContent = await page.content();
    if (pageContent.includes('404')) {
      console.log('⚠️ DEI page needs to be created');
    } else {
      console.log('✅ DEI page exists');
    }
  });

  test('About Pages - Create and test', async ({ page }) => {
    console.log('\n🔍 Testing About Pages...');

    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/about.png', fullPage: true });

    const pageContent = await page.content();
    if (pageContent.includes('404')) {
      console.log('⚠️ About page needs to be created');
    } else {
      console.log('✅ About page exists');
    }
  });

  test('Contact Page - Create and test', async ({ page }) => {
    console.log('\n🔍 Testing Contact Page...');

    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/contact.png', fullPage: true });

    const pageContent = await page.content();
    if (pageContent.includes('404')) {
      console.log('⚠️ Contact page needs to be created');
    } else {
      console.log('✅ Contact page exists');
    }
  });

  test('Performance and Accessibility Audit', async ({ page }) => {
    console.log('\n🔍 Running Performance & Accessibility Tests...');

    await page.goto('/');

    // Check for meta tags
    const metaDescription = await page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);

    // Check for proper heading hierarchy
    const h1Count = await page.getByRole('heading', { level: 1 }).count();
    expect(h1Count).toBeGreaterThan(0);

    // Check images have alt text
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (!alt) {
        console.log('⚠️ Image missing alt text');
      }
    }

    // Check for ARIA labels on interactive elements
    const buttons = await page.getByRole('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      if (!text && !ariaLabel) {
        console.log('⚠️ Button missing accessible label');
      }
    }

    console.log('✅ Performance & Accessibility audit complete');
  });

  test('Generate improvement report', async ({ page }) => {
    console.log('\n📊 IMPROVEMENT REPORT');
    console.log('===================');
    console.log('\nPages that need to be created:');
    console.log('- Faculty Directory');
    console.log('- Alumni Network');
    console.log('- News/Blog');
    console.log('- Events Calendar');
    console.log('- Research Areas');
    console.log('- Academic Programs');
    console.log('- DEI Initiatives');
    console.log('- About EEMB');
    console.log('- Contact Us');

    console.log('\nRecommended improvements:');
    console.log('- Add loading states for data fetching');
    console.log('- Implement error boundaries');
    console.log('- Add SEO metadata to all pages');
    console.log('- Optimize images with Next.js Image component');
    console.log('- Add sitemap.xml');
    console.log('- Implement search functionality');
    console.log('- Add breadcrumb navigation');
    console.log('- Implement dark mode toggle');
    console.log('- Add skip navigation link for accessibility');
    console.log('- Add structured data for better SEO');
  });
});