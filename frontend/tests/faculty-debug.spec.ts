import { test, expect } from '@playwright/test';

test.describe('Faculty Page Debug', () => {
  test('should load and display faculty data', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    // Intercept API calls
    page.on('request', request => {
      if (request.url().includes('api/faculties')) {
        console.log('API REQUEST:', request.url());
      }
    });

    page.on('response', async response => {
      if (response.url().includes('api/faculties')) {
        console.log('API RESPONSE:', response.status());
        const body = await response.text();
        console.log('API BODY:', body.substring(0, 500));
      }
    });

    // Navigate to the people page
    console.log('Navigating to /people...');
    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });

    // Take a screenshot
    await page.screenshot({ path: '/tmp/faculty-page.png', fullPage: true });
    console.log('Screenshot saved to /tmp/faculty-page.png');

    // Check for loading state
    const loadingText = await page.locator('text=Loading faculty...').count();
    console.log('Loading text visible:', loadingText > 0);

    // Wait a bit for data to load
    await page.waitForTimeout(3000);

    // Check if any faculty cards are displayed
    const facultyCards = await page.locator('[class*="bg-white"][class*="rounded-lg"]').count();
    console.log('Faculty cards found:', facultyCards);

    // Check for error messages
    const errorText = await page.locator('text=Error loading faculty').count();
    console.log('Error message visible:', errorText > 0);

    // Get the page HTML for debugging
    const html = await page.content();
    console.log('Page contains "professor":', html.toLowerCase().includes('professor'));
    console.log('Page contains "faculty":', html.toLowerCase().includes('faculty'));

    // Check network requests
    console.log('Waiting for any additional network activity...');
    await page.waitForTimeout(2000);
  });

  test('should verify faculty data loads on the rendered page', async ({ page }) => {
    console.log('Verifying faculty data is available via the app (Supabase)...');

    await page.goto('http://localhost:3000/people', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Check if faculty cards are rendered (data came from Supabase)
    const facultyCards = await page.locator('[class*="bg-white"][class*="rounded-lg"]').count();
    console.log('Faculty cards found:', facultyCards);
    expect(facultyCards).toBeGreaterThan(0);

    // Grab first faculty name as a sanity check
    const firstCardName = await page.locator('[class*="bg-white"][class*="rounded-lg"] h3').first().textContent();
    console.log('First faculty name:', firstCardName);
    expect(firstCardName).toBeTruthy();
  });
});