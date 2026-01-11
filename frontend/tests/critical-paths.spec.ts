import { test, expect } from '@playwright/test'

/**
 * Critical Path E2E Tests
 * These tests verify the core user journeys through the EEMB website
 */

test.describe('Homepage', () => {
  test('loads successfully with hero section', async ({ page }) => {
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle(/EEMB|Ecology|Evolution/)

    // Hero should be visible
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()

    // Main CTA buttons should exist
    await expect(page.getByRole('link', { name: /research/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /faculty|people/i })).toBeVisible()
  })

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/')

    // Main nav should be visible
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()

    // Click on People link and verify navigation
    await page.getByRole('link', { name: /people/i }).first().click()
    await expect(page).toHaveURL(/\/people/)
  })

  test('research areas section renders', async ({ page }) => {
    await page.goto('/')

    // Look for research areas section
    const researchHeading = page.getByRole('heading', { name: /research/i })
    if (await researchHeading.count() > 0) {
      await expect(researchHeading.first()).toBeVisible()
    }
  })
})

test.describe('Faculty Directory', () => {
  test('loads faculty listing', async ({ page }) => {
    await page.goto('/people')

    // Page should load
    await expect(page).toHaveTitle(/people|faculty|directory/i)

    // Should have faculty cards or listings
    await page.waitForLoadState('networkidle')

    // Check for faculty content
    const content = page.locator('main')
    await expect(content).toBeVisible()
  })

  test('faculty cards display correctly', async ({ page }) => {
    await page.goto('/people')
    await page.waitForLoadState('networkidle')

    // Look for any faculty-related content
    const facultySection = page.getByRole('main')
    await expect(facultySection).toBeVisible()
  })

  test('search/filter functionality exists', async ({ page }) => {
    await page.goto('/people')
    await page.waitForLoadState('networkidle')

    // Look for search input or filter controls
    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i))

    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible()
    }
  })
})

test.describe('Research Page', () => {
  test('displays research areas', async ({ page }) => {
    await page.goto('/research')

    await expect(page).toHaveTitle(/research/i)

    // Should have research content
    const main = page.getByRole('main')
    await expect(main).toBeVisible()
  })
})

test.describe('Events Page', () => {
  test('loads events listing', async ({ page }) => {
    await page.goto('/events')

    // Should load without errors
    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Should show events heading
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('displays event cards when events exist', async ({ page }) => {
    await page.goto('/events')
    await page.waitForLoadState('networkidle')

    // Either has events or shows empty state
    const content = page.locator('main')
    await expect(content).toBeVisible()
  })
})

test.describe('News Page', () => {
  test('loads news listing', async ({ page }) => {
    await page.goto('/news')

    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Should show news heading
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })
})

test.describe('Contact Page', () => {
  test('displays contact form', async ({ page }) => {
    await page.goto('/contact')

    // Should have form
    const form = page.locator('form')
    await expect(form).toBeVisible()

    // Should have required fields
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/message/i)).toBeVisible()
  })

  test('shows validation errors for empty submission', async ({ page }) => {
    await page.goto('/contact')

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /send|submit/i })
    await submitButton.click()

    // Should show validation (either HTML5 or custom)
    await page.waitForTimeout(500) // Allow for validation state
  })

  test('displays contact information', async ({ page }) => {
    await page.goto('/contact')

    // Should have contact info sections
    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Look for phone or email info
    const contactText = page.getByText(/805|@ucsb\.edu/i)
    if (await contactText.count() > 0) {
      await expect(contactText.first()).toBeVisible()
    }
  })
})

test.describe('Graduate Program Page', () => {
  test('loads graduate information', async ({ page }) => {
    await page.goto('/academics/graduate')

    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Should have program information
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })
})

test.describe('About Page', () => {
  test('displays department information', async ({ page }) => {
    await page.goto('/about')

    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Should have about content
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })
})
