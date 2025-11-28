import { test, expect } from '@playwright/test'

test.describe('Support Page Screenshots', () => {
  test('capture full support page', async ({ page }) => {
    await page.goto('http://localhost:2345/support')
    await page.waitForLoadState('networkidle')

    // Wait for content to render
    await page.waitForTimeout(500)

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/support-page-full.png',
      fullPage: true
    })

    // Take viewport screenshot
    await page.screenshot({
      path: 'test-results/support-page-viewport.png'
    })
  })

  test('capture support page with multiple sections open', async ({ page }) => {
    await page.goto('http://localhost:2345/support')
    await page.waitForLoadState('networkidle')

    // Click to open Student Services
    await page.click('text=Student Services')
    await page.waitForTimeout(300)

    // Click to open Research Facilities
    await page.click('text=Research Facilities')
    await page.waitForTimeout(300)

    await page.screenshot({
      path: 'test-results/support-page-multiple-open.png',
      fullPage: true
    })
  })

  test('capture mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('http://localhost:2345/support')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await page.screenshot({
      path: 'test-results/support-page-mobile.png',
      fullPage: true
    })
  })
})
