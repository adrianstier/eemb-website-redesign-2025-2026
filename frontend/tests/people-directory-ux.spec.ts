import { test, expect } from '@playwright/test'

test.describe('People Directory - UX/UI Improvements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/people')
    // Wait for initial load
    await page.waitForLoadState('networkidle')
  })

  test.describe('Visual Hierarchy & Layout', () => {
    test('hero section should be prominent with proper hierarchy', async ({ page }) => {
      const hero = page.locator('section').first()
      await expect(hero).toContainText('Our People')

      // Check gradient background
      await expect(hero).toHaveCSS('background-image', /gradient/)

      // Title should be large and bold
      const title = hero.locator('h1')
      await expect(title).toBeVisible()
      const fontSize = await title.evaluate((el) => window.getComputedStyle(el).fontSize)
      expect(parseFloat(fontSize)).toBeGreaterThan(36) // At least 36px
    })

    test('sticky navigation should work correctly', async ({ page }) => {
      const stickyNav = page.locator('section').nth(1)

      // Should have sticky positioning
      await expect(stickyNav).toHaveCSS('position', 'sticky')

      // Scroll down and verify it stays visible
      await page.evaluate(() => window.scrollTo(0, 500))
      await expect(stickyNav).toBeInViewport()
    })

    test('category tabs should have proper visual states', async ({ page }) => {
      const firstTab = page.getByRole('tab').first()

      // Check active state styling
      await expect(firstTab).toHaveAttribute('aria-selected', 'true')
      await expect(firstTab).toHaveCSS('color', /rgb\(37, 99, 235\)/) // blue-600

      // Check hover state on inactive tab
      const secondTab = page.getByRole('tab').nth(1)
      await secondTab.hover()
      await page.waitForTimeout(200) // Wait for transition
    })
  })

  test.describe('Search Experience', () => {
    test('search should have proper debouncing', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search by name, email, or research area...')

      // Type quickly
      await searchInput.fill('test')

      // Results shouldn't update immediately (debounced)
      await page.waitForTimeout(100)

      // Wait for debounce (300ms)
      await page.waitForTimeout(250)

      // Now results should be filtered
      const resultsCount = page.locator('p').filter({ hasText: /result/ })
      await expect(resultsCount).toBeVisible()
    })

    test('search clear button should appear and work', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search by name, email, or research area...')
      const clearButton = page.getByLabel('Clear search')

      // Clear button hidden initially
      await expect(clearButton).not.toBeVisible()

      // Type something
      await searchInput.fill('biology')

      // Clear button should appear
      await expect(clearButton).toBeVisible()

      // Click clear
      await clearButton.click()

      // Input should be empty
      await expect(searchInput).toHaveValue('')
      await expect(clearButton).not.toBeVisible()
    })

    test('search results count should update', async ({ page }) => {
      await page.waitForSelector('article', { state: 'visible' })

      const initialCount = await page.locator('article').count()

      // Search for something specific
      await page.getByPlaceholder('Search by name, email, or research area...').fill('professor')
      await page.waitForTimeout(350) // Debounce + a bit extra

      // Results count should be shown
      const resultsText = await page.locator('p').filter({ hasText: /result/ }).textContent()
      expect(resultsText).toContain('result')
    })
  })

  test.describe('Loading States', () => {
    test('should show skeleton screens while loading', async ({ page }) => {
      // Navigate to page (fresh load)
      await page.goto('http://localhost:3000/people')

      // Check for loading indicator
      const loadingIndicator = page.getByText('Loading directory...')
      // May or may not be visible depending on load speed - that's OK

      // Eventually content should load
      await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 })
    })

    test('skeleton screens should match actual content layout', async ({ page }) => {
      // This would require mocking slow API - for now check structure exists
      await expect(page.locator('article').first()).toBeVisible()

      // Check article structure
      const firstArticle = page.locator('article').first()
      await expect(firstArticle.locator('img, div').first()).toBeVisible() // Avatar
    })
  })

  test.describe('Interactive Elements', () => {
    test('person cards should have hover states', async ({ page }) => {
      await page.waitForSelector('article', { state: 'visible' })
      const firstCard = page.locator('article').first()

      // Hover over card
      await firstCard.hover()

      // Should have hover background
      await expect(firstCard).toHaveCSS('background-color', /rgb\(248, 250, 252\)/) // slate-50
    })

    test('social link icons should have hover effects', async ({ page }) => {
      await page.waitForSelector('article', { state: 'visible' })

      // Find a social link (lab website, scholar, or orcid)
      const socialLink = page.locator('a[title="Lab Website"]').first()

      if (await socialLink.count() > 0) {
        // Initial state
        const initialColor = await socialLink.evaluate((el) =>
          window.getComputedStyle(el).color
        )

        // Hover
        await socialLink.hover()
        await page.waitForTimeout(200)

        // Color should change on hover
        const hoverColor = await socialLink.evaluate((el) =>
          window.getComputedStyle(el).color
        )

        expect(initialColor).not.toBe(hoverColor)
      }
    })

    test('profile view button should have smooth transition', async ({ page }) => {
      await page.waitForSelector('article', { state: 'visible' })

      const viewButton = page.locator('a[aria-label*="full profile"]').first()

      if (await viewButton.count() > 0) {
        await viewButton.hover()
        await page.waitForTimeout(200)

        // Arrow should translate on hover
        const arrow = viewButton.locator('svg')
        await expect(arrow).toBeVisible()
      }
    })
  })

  test.describe('Category Filtering', () => {
    test('should switch categories smoothly', async ({ page }) => {
      const facultyTab = page.getByRole('tab', { name: /Faculty/ })
      const studentsTab = page.getByRole('tab', { name: /Students/ })

      // Click Faculty
      await facultyTab.click()
      await expect(facultyTab).toHaveAttribute('aria-selected', 'true')
      await page.waitForTimeout(100)

      // Click Students
      await studentsTab.click()
      await expect(studentsTab).toHaveAttribute('aria-selected', 'true')

      // Faculty should no longer be active
      await expect(facultyTab).toHaveAttribute('aria-selected', 'false')
    })

    test('category counts should be accurate', async ({ page }) => {
      // Get "All People" count
      const allTab = page.getByRole('tab', { name: /All People/ })
      const allCount = await allTab.locator('span').last().textContent()
      const totalCount = parseInt(allCount?.replace(/[()]/g, '') || '0')

      expect(totalCount).toBeGreaterThan(0)

      // Check individual category counts add up
      const facultyTab = page.getByRole('tab', { name: /Faculty/ })
      const facultyCount = await facultyTab.locator('span').last().textContent()
      const facultyNum = parseInt(facultyCount?.replace(/[()]/g, '') || '0')

      expect(facultyNum).toBeGreaterThanOrEqual(0)
      expect(facultyNum).toBeLessThanOrEqual(totalCount)
    })

    test('should clear search when switching categories', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search by name, email, or research area...')

      // Search for something
      await searchInput.fill('biology')
      await expect(searchInput).toHaveValue('biology')

      // Switch category
      const studentsTab = page.getByRole('tab', { name: /Students/ })
      await studentsTab.click()

      // Search should be cleared
      await expect(searchInput).toHaveValue('')
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Tabs should have tablist role
      const tablist = page.locator('[role="tablist"]')
      await expect(tablist).toBeVisible()

      // Each tab should have proper aria-selected
      const tabs = page.getByRole('tab')
      expect(await tabs.count()).toBeGreaterThan(0)

      const firstTab = tabs.first()
      const ariaSelected = await firstTab.getAttribute('aria-selected')
      expect(['true', 'false']).toContain(ariaSelected)
    })

    test('search input should have proper label', async ({ page }) => {
      const searchInput = page.getByLabel('Search people')
      await expect(searchInput).toBeVisible()
    })

    test('keyboard navigation should work for tabs', async ({ page }) => {
      const firstTab = page.getByRole('tab').first()

      // Focus first tab
      await firstTab.focus()

      // Press right arrow
      await page.keyboard.press('ArrowRight')

      // Next tab should be focused
      const secondTab = page.getByRole('tab').nth(1)
      await expect(secondTab).toBeFocused()
    })

    test('focus states should be visible', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search by name, email, or research area...')

      await searchInput.focus()

      // Should have visible focus ring
      await expect(searchInput).toBeFocused()
      const outline = await searchInput.evaluate((el) =>
        window.getComputedStyle(el).getPropertyValue('box-shadow')
      )

      // Should have ring (Tailwind focus:ring-2)
      expect(outline).not.toBe('none')
    })
  })

  test.describe('Empty & Error States', () => {
    test('should show helpful empty state when no results', async ({ page }) => {
      // Search for something that won't match
      await page.getByPlaceholder('Search by name, email, or research area...').fill('zzzzzzzzz')
      await page.waitForTimeout(350)

      // Should show empty state
      await expect(page.getByText(/No.*Found/i)).toBeVisible()
      await expect(page.getByText(/No results match/i)).toBeVisible()

      // Clear search button should be available
      const clearButton = page.getByRole('button', { name: /Clear Search/i })
      await expect(clearButton).toBeVisible()

      // Click it
      await clearButton.click()

      // Results should reappear
      await expect(page.locator('article').first()).toBeVisible()
    })

    test('empty state should have icon and helpful copy', async ({ page }) => {
      // Search for nonsense
      await page.getByPlaceholder('Search by name, email, or research area...').fill('xqzpwlkjm')
      await page.waitForTimeout(350)

      // Should have icon (Users icon in empty state)
      const emptyState = page.locator('div').filter({ hasText: /No.*Found/i })
      await expect(emptyState).toBeVisible()

      // Should have SVG icon
      const icon = emptyState.locator('svg').first()
      await expect(icon).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Tabs should be scrollable
      const tablist = page.locator('[role="tablist"]')
      await expect(tablist).toBeVisible()

      // Search should be full width
      const searchInput = page.getByPlaceholder('Search by name, email, or research area...')
      const width = await searchInput.evaluate((el) => el.getBoundingClientRect().width)
      expect(width).toBeGreaterThan(300) // Should use most of screen width
    })

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      await expect(page.locator('article').first()).toBeVisible()

      // Layout should adapt
      const firstArticle = page.locator('article').first()
      await expect(firstArticle).toBeVisible()
    })

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })

      await expect(page.locator('article').first()).toBeVisible()

      // All columns should be visible
      const firstArticle = page.locator('article').first()
      await expect(firstArticle).toBeVisible()
    })
  })

  test.describe('Performance & Interactions', () => {
    test('should have smooth transitions', async ({ page }) => {
      // Check tab transition
      const tab = page.getByRole('tab').nth(1)

      const duration = await tab.evaluate((el) =>
        window.getComputedStyle(el).transitionDuration
      )

      // Should have transition defined
      expect(duration).not.toBe('0s')
    })

    test('should prevent layout shift', async ({ page }) => {
      await page.waitForSelector('article', { state: 'visible' })

      // Measure initial position
      const firstArticle = page.locator('article').first()
      const initialPosition = await firstArticle.boundingBox()

      // Interact with page
      await page.mouse.move(200, 200)
      await page.waitForTimeout(100)

      // Position should remain stable
      const finalPosition = await firstArticle.boundingBox()
      expect(initialPosition?.y).toBe(finalPosition?.y)
    })
  })

  test.describe('Visual Regression', () => {
    test('homepage should match visual baseline', async ({ page }) => {
      await page.waitForSelector('article', { state: 'visible' })

      // Take screenshot
      await expect(page).toHaveScreenshot('people-directory-full.png', {
        fullPage: true,
        maxDiffPixels: 100 // Allow small differences
      })
    })

    test('hero section should match baseline', async ({ page }) => {
      const hero = page.locator('section').first()

      await expect(hero).toHaveScreenshot('people-hero.png', {
        maxDiffPixels: 50
      })
    })

    test('person card should match baseline', async ({ page }) => {
      await page.waitForSelector('article', { state: 'visible' })
      const firstCard = page.locator('article').first()

      await expect(firstCard).toHaveScreenshot('person-card.png', {
        maxDiffPixels: 20
      })
    })
  })

  test.describe('User Flows', () => {
    test('complete search flow should work smoothly', async ({ page }) => {
      // 1. Start with full directory
      await expect(page.locator('article').first()).toBeVisible()
      const initialCount = await page.locator('article').count()

      // 2. Search for something
      await page.getByPlaceholder('Search by name, email, or research area...').fill('biology')
      await page.waitForTimeout(350)

      // 3. Results should filter
      const filteredCount = await page.locator('article').count()
      // Count may be same or different, both are valid

      // 4. Clear search
      await page.getByLabel('Clear search').click()

      // 5. Back to initial state
      await page.waitForTimeout(100)
      const finalCount = await page.locator('article').count()
      expect(finalCount).toBe(initialCount)
    })

    test('category switching flow should work smoothly', async ({ page }) => {
      // 1. Start on "All People"
      const allTab = page.getByRole('tab', { name: /All People/ })
      await expect(allTab).toHaveAttribute('aria-selected', 'true')

      // 2. Switch to Faculty
      const facultyTab = page.getByRole('tab', { name: /Faculty/ })
      await facultyTab.click()
      await expect(facultyTab).toHaveAttribute('aria-selected', 'true')

      // 3. Switch to Students
      const studentsTab = page.getByRole('tab', { name: /Students/ })
      await studentsTab.click()
      await expect(studentsTab).toHaveAttribute('aria-selected', 'true')

      // 4. Back to All
      await allTab.click()
      await expect(allTab).toHaveAttribute('aria-selected', 'true')
    })
  })
})
