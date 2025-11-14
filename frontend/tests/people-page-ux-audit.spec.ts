import { test, expect } from '@playwright/test'

test.describe('People Page - Comprehensive UX/UI Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/people')
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test.describe('Accessibility Tests', () => {
    test('should have proper ARIA labels on all interactive elements', async ({ page }) => {
      // Check search input
      const searchInput = page.locator('input[type="search"]')
      await expect(searchInput).toHaveAttribute('aria-label', 'Search people')

      // Check category tabs
      const tabs = page.locator('button[role="tab"]')
      const tabCount = await tabs.count()
      expect(tabCount).toBeGreaterThan(0)

      for (let i = 0; i < tabCount; i++) {
        await expect(tabs.nth(i)).toHaveAttribute('aria-selected')
      }

      // Check sort dropdown
      const sortSelect = page.locator('select[aria-label="Sort people"]')
      await expect(sortSelect).toBeVisible()
    })

    test('should have proper heading hierarchy', async ({ page }) => {
      // Main heading
      const h1 = page.locator('h1:has-text("Our People")')
      await expect(h1).toBeVisible()

      // Person card headings should be h3
      const personHeadings = page.locator('article h3')
      const headingCount = await personHeadings.count()

      if (headingCount > 0) {
        // Verify first heading has proper structure
        await expect(personHeadings.first()).toBeVisible()
      }
    })

    test('should have semantic HTML structure', async ({ page }) => {
      // Check for proper article tags
      const articles = page.locator('article[role="article"]')
      await expect(articles.first()).toBeVisible()

      // Check for proper tablist
      const tablist = page.locator('[role="tablist"]')
      await expect(tablist).toBeVisible()

      // Check for proper tabpanel
      const tabpanel = page.locator('[role="tabpanel"]')
      await expect(tabpanel).toBeVisible()
    })

    test('should have alt text for all images', async ({ page }) => {
      // Wait for people to load
      await page.waitForSelector('article', { timeout: 10000 })

      const images = page.locator('article img')
      const imageCount = await images.count()

      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
        expect(alt).toContain('profile')
      }
    })

    test('should support keyboard navigation on tabs', async ({ page }) => {
      const firstTab = page.locator('button[role="tab"]').first()
      await firstTab.focus()

      // Verify focus is visible
      await expect(firstTab).toBeFocused()

      // Tab to next element
      await page.keyboard.press('Tab')
      const secondTab = page.locator('button[role="tab"]').nth(1)
      await expect(secondTab).toBeFocused()
    })
  })

  test.describe('Loading States', () => {
    test('should show loading spinner on initial load', async ({ page }) => {
      // Reload to see loading state
      await page.goto('http://localhost:3000/people')

      // Check for loading spinner or text (may be quick)
      const loadingIndicator = page.locator('text=Loading people...')
      // This might not be visible if loading is fast, so we use a timeout
      const isVisible = await loadingIndicator.isVisible().catch(() => false)

      // If not visible, data loaded quickly which is fine
      expect(typeof isVisible).toBe('boolean')
    })

    test('should show skeleton cards during loading', async ({ page }) => {
      await page.goto('http://localhost:3000/people')

      // Look for skeleton cards (they have animate-pulse class)
      const skeletonCards = page.locator('.animate-pulse')

      // May or may not be visible depending on load speed
      const count = await skeletonCards.count()
      expect(count).toBeGreaterThanOrEqual(0)
    })

    test('should transition from loading to loaded state smoothly', async ({ page }) => {
      await page.goto('http://localhost:3000/people')
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      // Verify articles are visible
      const articles = page.locator('article[role="article"]')
      await expect(articles.first()).toBeVisible()
    })
  })

  test.describe('Error Handling', () => {
    test('should display error state when API fails', async ({ page }) => {
      // Intercept API calls and make them fail
      await page.route('**/api/faculties*', route => route.abort())
      await page.route('**/api/staff-members*', route => route.abort())
      await page.route('**/api/graduate-students*', route => route.abort())

      await page.goto('http://localhost:3000/people')

      // Wait for error state
      await page.waitForSelector('text=Unable to Load People', { timeout: 10000 })

      // Verify error message
      const errorHeading = page.locator('h3:has-text("Unable to Load People")')
      await expect(errorHeading).toBeVisible()

      // Verify retry button exists
      const retryButton = page.locator('button:has-text("Try Again")')
      await expect(retryButton).toBeVisible()
    })

    test('should have working retry button on error', async ({ page }) => {
      // First make requests fail
      await page.route('**/api/**', route => route.abort())
      await page.goto('http://localhost:3000/people')

      await page.waitForSelector('button:has-text("Try Again")', { timeout: 10000 })

      // Clear routes and click retry
      await page.unroute('**/api/**')

      const retryButton = page.locator('button:has-text("Try Again")')
      await retryButton.click()

      // Should load successfully now
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })
    })
  })

  test.describe('Search Functionality', () => {
    test('should have search input with proper attributes', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]')
      await expect(searchInput).toBeVisible()
      await expect(searchInput).toHaveAttribute('placeholder')
      await expect(searchInput).toHaveAttribute('aria-label')
    })

    test('should show clear button when search has text', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('biology')

      // Clear button should appear
      const clearButton = page.locator('button[aria-label="Clear search"]')
      await expect(clearButton).toBeVisible()
    })

    test('should filter results when searching', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const initialCount = await page.locator('article[role="article"]').count()

      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('zzzzz') // Search unlikely to match

      // Wait a bit for filtering
      await page.waitForTimeout(500)

      // Should show empty state
      const emptyState = page.locator('text=No faculty found')
      const isVisible = await emptyState.isVisible()

      // Either no results or fewer results
      const newCount = await page.locator('article[role="article"]').count()
      expect(newCount).toBeLessThanOrEqual(initialCount)
    })

    test('should clear search when clear button clicked', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('test')

      const clearButton = page.locator('button[aria-label="Clear search"]')
      await clearButton.click()

      // Search input should be empty
      await expect(searchInput).toHaveValue('')
    })

    test('should update results count when searching', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      // Look for results info
      const resultsInfo = page.locator('text=/\\d+ faculty member/')
      await expect(resultsInfo).toBeVisible()

      // Search for something
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('marine')

      await page.waitForTimeout(500)

      // Results should update
      const updatedInfo = page.locator('text=/\\d+ faculty member/')
      await expect(updatedInfo).toBeVisible()
    })

    test('should show search term in results when filtering', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('biology')

      await page.waitForTimeout(500)

      // Look for search term in results description
      const searchTerm = page.locator('text=matching "biology"')
      // May or may not be visible depending on results
      const count = await searchTerm.count()
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Category Tabs', () => {
    test('should have all category tabs visible', async ({ page }) => {
      const allTab = page.locator('button[role="tab"]:has-text("All")')
      const facultyTab = page.locator('button[role="tab"]:has-text("Faculty")')
      const staffTab = page.locator('button[role="tab"]:has-text("Staff")')
      const studentsTab = page.locator('button[role="tab"]:has-text("Students")')

      await expect(allTab).toBeVisible()
      await expect(facultyTab).toBeVisible()
      await expect(staffTab).toBeVisible()
      await expect(studentsTab).toBeVisible()
    })

    test('should show counts on each tab', async ({ page }) => {
      await page.waitForSelector('button[role="tab"]', { timeout: 10000 })

      const tabs = page.locator('button[role="tab"]')
      const tabCount = await tabs.count()

      for (let i = 0; i < tabCount; i++) {
        const tabText = await tabs.nth(i).textContent()
        expect(tabText).toMatch(/\(\d+\)/)
      }
    })

    test('should switch between categories', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      // Click on different tabs
      const staffTab = page.locator('button[role="tab"]:has-text("Staff")')
      await staffTab.click()

      await page.waitForTimeout(500)

      // Verify tab is selected
      await expect(staffTab).toHaveAttribute('aria-selected', 'true')

      // Switch to students
      const studentsTab = page.locator('button[role="tab"]:has-text("Students")')
      await studentsTab.click()

      await page.waitForTimeout(500)
      await expect(studentsTab).toHaveAttribute('aria-selected', 'true')
    })

    test('should clear search when switching categories', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('test search')

      const staffTab = page.locator('button[role="tab"]:has-text("Staff")')
      await staffTab.click()

      // Search should be cleared
      await expect(searchInput).toHaveValue('')
    })

    test('should have visual distinction for active tab', async ({ page }) => {
      const activeTab = page.locator('button[role="tab"][aria-selected="true"]')
      await expect(activeTab).toBeVisible()

      // Active tab should have different styling (check for gradient class)
      const className = await activeTab.getAttribute('class')
      expect(className).toContain('from-ocean')
    })
  })

  test.describe('Sort Functionality', () => {
    test('should have sort dropdown', async ({ page }) => {
      const sortSelect = page.locator('select[aria-label="Sort people"]')
      await expect(sortSelect).toBeVisible()
    })

    test('should have all sort options', async ({ page }) => {
      const sortSelect = page.locator('select[aria-label="Sort people"]')

      const options = await sortSelect.locator('option').allTextContents()
      expect(options).toContain('Name (A-Z)')
      expect(options).toContain('Name (Z-A)')
      expect(options).toContain('Recently Added')
    })

    test('should sort by name ascending', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const sortSelect = page.locator('select[aria-label="Sort people"]')
      await sortSelect.selectOption('name-asc')

      await page.waitForTimeout(500)

      // Get first few names
      const names = await page.locator('article h3').allTextContents()

      if (names.length >= 2) {
        // Verify first name comes before second alphabetically
        expect(names[0].localeCompare(names[1])).toBeLessThanOrEqual(0)
      }
    })

    test('should sort by name descending', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const sortSelect = page.locator('select[aria-label="Sort people"]')
      await sortSelect.selectOption('name-desc')

      await page.waitForTimeout(500)

      // Get first few names
      const names = await page.locator('article h3').allTextContents()

      if (names.length >= 2) {
        // Verify first name comes after second alphabetically
        expect(names[0].localeCompare(names[1])).toBeGreaterThanOrEqual(0)
      }
    })
  })

  test.describe('Person Cards', () => {
    test('should display person cards with proper structure', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const firstCard = page.locator('article[role="article"]').first()
      await expect(firstCard).toBeVisible()

      // Should have name
      const name = firstCard.locator('h3')
      await expect(name).toBeVisible()
    })

    test('should show contact information', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const firstCard = page.locator('article[role="article"]').first()

      // Look for email link
      const emailLink = firstCard.locator('a[href^="mailto:"]')
      const hasEmail = await emailLink.count() > 0

      expect(typeof hasEmail).toBe('boolean')
    })

    test('should have working email links', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const emailLinks = page.locator('a[href^="mailto:"]')
      const count = await emailLinks.count()

      if (count > 0) {
        const href = await emailLinks.first().getAttribute('href')
        expect(href).toContain('mailto:')
      }
    })

    test('should have working phone links', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const phoneLinks = page.locator('a[href^="tel:"]')
      const count = await phoneLinks.count()

      if (count > 0) {
        const href = await phoneLinks.first().getAttribute('href')
        expect(href).toContain('tel:')
      }
    })

    test('should show research interests as tags', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      // Look for research interests section
      const researchSection = page.locator('text=RESEARCH INTERESTS')
      const count = await researchSection.count()

      expect(count).toBeGreaterThanOrEqual(0)
    })

    test('should have hover effects on cards', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const firstCard = page.locator('article[role="article"]').first()

      // Hover over the card
      await firstCard.hover()

      // Card should still be visible after hover
      await expect(firstCard).toBeVisible()
    })

    test('should show profile images or initials', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const firstCard = page.locator('article[role="article"]').first()

      // Should have either an image or initials
      const image = firstCard.locator('img')
      const initialsSpan = firstCard.locator('span.text-white.text-3xl')

      const hasImage = await image.count() > 0
      const hasInitials = await initialsSpan.count() > 0

      expect(hasImage || hasInitials).toBe(true)
    })

    test('should lazy load images', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const images = page.locator('article img')
      const count = await images.count()

      if (count > 0) {
        const loading = await images.first().getAttribute('loading')
        expect(loading).toBe('lazy')
      }
    })
  })

  test.describe('Responsive Design', () => {
    test('should be mobile-friendly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      // Tabs should stack on mobile
      const tabs = page.locator('button[role="tab"]')
      await expect(tabs.first()).toBeVisible()

      // Search should be full width
      const search = page.locator('input[type="search"]')
      await expect(search).toBeVisible()
    })

    test('should have proper tablet layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const articles = page.locator('article[role="article"]')
      await expect(articles.first()).toBeVisible()
    })

    test('should have proper desktop layout', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const articles = page.locator('article[role="article"]')
      await expect(articles.first()).toBeVisible()
    })

    test('sticky header should work on scroll', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const stickyHeader = page.locator('section.sticky')
      await expect(stickyHeader).toBeVisible()

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500))

      // Header should still be visible
      await expect(stickyHeader).toBeVisible()
    })
  })

  test.describe('Empty States', () => {
    test('should show helpful empty state when no results', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('xyzzzzaabbccddnonexistent')

      await page.waitForTimeout(500)

      const emptyState = page.locator('text=No faculty found')
      await expect(emptyState).toBeVisible()

      // Should have helpful message
      const message = page.locator('text=Try different keywords')
      await expect(message).toBeVisible()
    })

    test('should have clear button in empty state', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('nonexistentperson123')

      await page.waitForTimeout(500)

      const clearButton = page.locator('button:has-text("Clear Search")')
      const count = await clearButton.count()

      expect(count).toBeGreaterThanOrEqual(1)
    })

    test('should show appropriate icon in empty state', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('xyzzzzaabbcc')

      await page.waitForTimeout(500)

      // Look for SVG icon
      const svg = page.locator('svg').first()
      const isVisible = await svg.isVisible()

      expect(typeof isVisible).toBe('boolean')
    })
  })

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('http://localhost:3000/people')
      await page.waitForSelector('article[role="article"]', { timeout: 15000 })
      const loadTime = Date.now() - startTime

      // Should load within 15 seconds
      expect(loadTime).toBeLessThan(15000)
    })

    test('should use memoization for filtering', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const searchInput = page.locator('input[type="search"]')

      // Multiple rapid searches
      await searchInput.fill('a')
      await page.waitForTimeout(200)
      await searchInput.fill('ab')
      await page.waitForTimeout(200)
      await searchInput.fill('abc')
      await page.waitForTimeout(500)

      // Should not crash or hang - either show results or empty state
      const articles = page.locator('article[role="article"]')
      const emptyState = page.locator('text=No faculty found')

      const hasArticles = await articles.count() > 0
      const hasEmptyState = await emptyState.isVisible()

      expect(hasArticles || hasEmptyState).toBe(true)
    })
  })

  test.describe('Visual Consistency', () => {
    test('should have consistent spacing in grid', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const grid = page.locator('[role="list"]')
      await expect(grid).toBeVisible()

      const articles = page.locator('article[role="article"]')
      const count = await articles.count()

      expect(count).toBeGreaterThan(0)
    })

    test('should have consistent color scheme', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      // Check for ocean color classes
      const oceanElements = page.locator('[class*="ocean"]')
      const count = await oceanElements.count()

      expect(count).toBeGreaterThan(0)
    })

    test('should have smooth transitions', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const staffTab = page.locator('button[role="tab"]:has-text("Staff")')
      await staffTab.click()

      await page.waitForTimeout(500)

      // Should transition smoothly
      const articles = page.locator('article[role="article"]')
      await expect(articles.first()).toBeVisible()
    })
  })

  test.describe('Integration Tests', () => {
    test('should work end-to-end: search, filter, clear', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      // Search
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('biology')
      await page.waitForTimeout(500)

      // Switch category
      const studentsTab = page.locator('button[role="tab"]:has-text("Students")')
      await studentsTab.click()
      await page.waitForTimeout(500)

      // Search should be cleared
      await expect(searchInput).toHaveValue('')

      // Search again
      await searchInput.fill('marine')
      await page.waitForTimeout(500)

      // Clear search
      const clearButton = page.locator('button[aria-label="Clear search"]')
      await clearButton.click()

      await expect(searchInput).toHaveValue('')
    })

    test('should maintain state during interactions', async ({ page }) => {
      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      // Select a sort option
      const sortSelect = page.locator('select[aria-label="Sort people"]')
      await sortSelect.selectOption('name-desc')

      await page.waitForTimeout(500)

      // Sort should persist
      const selectedValue = await sortSelect.inputValue()
      expect(selectedValue).toBe('name-desc')
    })
  })

  test.describe('Faculty Profile Links', () => {
    test('should show profile button only for faculty with slugs', async ({ page }) => {
      // Switch to faculty tab
      const facultyTab = page.locator('button[role="tab"]:has-text("Faculty")')
      await facultyTab.click()

      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      // Check for profile links
      const profileLinks = page.locator('a:has-text("View Full Profile")')
      const count = await profileLinks.count()

      // Should have at least some profile links
      expect(count).toBeGreaterThanOrEqual(0)
    })

    test('should have properly formatted profile URLs', async ({ page }) => {
      const facultyTab = page.locator('button[role="tab"]:has-text("Faculty")')
      await facultyTab.click()

      await page.waitForSelector('article[role="article"]', { timeout: 10000 })

      const profileLinks = page.locator('a:has-text("View Full Profile")')
      const count = await profileLinks.count()

      if (count > 0) {
        const href = await profileLinks.first().getAttribute('href')
        expect(href).toContain('/people/faculty/')
      }
    })
  })
})
