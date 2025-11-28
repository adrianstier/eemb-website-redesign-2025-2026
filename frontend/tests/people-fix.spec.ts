import { test, expect } from '@playwright/test'

test.describe('People Page Fix', () => {
  test('should load people page and display data', async ({ page }) => {
    // Capture console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    page.on('pageerror', error => {
      errors.push(error.message)
    })

    // Try to navigate to the people page
    const response = await page.goto('http://localhost:3000/people', {
      timeout: 30000,
      waitUntil: 'networkidle'
    })

    // Log the response status
    console.log('Response status:', response?.status())

    // Wait for data to load (look for table rows or error message to appear)
    await page.waitForTimeout(5000)

    // Take a screenshot
    await page.screenshot({ path: 'test-results/people-page-debug.png', fullPage: true })

    // Log any errors
    if (errors.length > 0) {
      console.log('Errors found:', errors)
    }

    // Check for error state
    const errorState = page.locator('text=Unable to Load People')
    const hasErrorState = await errorState.count() > 0
    console.log('Has error state:', hasErrorState)

    if (hasErrorState) {
      // If there's an error, the test should fail with helpful info
      console.log('Console errors:', errors)
      expect(hasErrorState).toBe(false)
    }

    // Check for data loaded - either table rows or people cards
    const tableRows = await page.locator('table tbody tr').count()
    const cards = await page.locator('article[role="article"]').count()
    console.log('Table rows:', tableRows, 'Cards:', cards)

    // Should have at least some people displayed
    expect(tableRows + cards).toBeGreaterThan(0)
  })
})
