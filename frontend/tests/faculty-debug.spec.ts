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

  test('should check backend API directly', async ({ request }) => {
    console.log('Testing backend API directly...');

    const response = await request.get('http://localhost:1337/api/faculties?pagination[limit]=100');
    console.log('API Status:', response.status());

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2).substring(0, 1000));

    if (data.data) {
      console.log('Number of faculty records:', data.data.length);
      if (data.data.length > 0) {
        console.log('First faculty record:', JSON.stringify(data.data[0], null, 2));
      }
    }
  });
});