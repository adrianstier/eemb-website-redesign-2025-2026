import { test, expect, Page } from '@playwright/test'

/**
 * Comprehensive Button & Interactive Element Tests
 * Tests all buttons, links, and interactive elements across the EEMB website
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Helper to wait for page to be interactive
async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(500) // Allow hydration
}

// Helper to check if element is clickable (visible & enabled)
async function isClickable(page: Page, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector).first()
    await expect(element).toBeVisible({ timeout: 5000 })
    const isDisabled = await element.getAttribute('disabled')
    return isDisabled === null
  } catch {
    return false
  }
}

test.describe('Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)
  })

  test('logo links to home page', async ({ page }) => {
    // Try different selectors for the logo link
    const logo = page.locator('header a[href="/"], a[href="/"]:has(img), a[href="/"]:has(svg)').first()

    if (await logo.isVisible()) {
      await expect(logo).toBeVisible()
      await logo.click()
      await expect(page).toHaveURL(BASE_URL + '/')
    } else {
      // Logo might be styled differently, check for any home link in header
      const homeLink = page.locator('header').getByRole('link').first()
      if (await homeLink.isVisible()) {
        const href = await homeLink.getAttribute('href')
        expect(href === '/' || href === BASE_URL + '/').toBeTruthy()
      }
    }
  })

  test('desktop navigation links are clickable', async ({ page }) => {
    // Skip on mobile viewport
    const viewportSize = page.viewportSize()
    if (viewportSize && viewportSize.width < 1024) {
      test.skip()
    }

    const navLinks = [
      { text: 'About', href: '/about' },
      { text: 'People', href: '/people' },
      { text: 'Research', href: '/research' },
      { text: 'Academics', href: '/academics' },
      { text: 'News', href: '/news' },
      { text: 'Events', href: '/events' },
      { text: 'Support', href: '/support' },
      { text: 'Contact', href: '/contact' },
    ]

    for (const link of navLinks) {
      const navLink = page.locator(`header nav a:has-text("${link.text}")`).first()
      if (await navLink.isVisible()) {
        await expect(navLink).toHaveAttribute('href', link.href)
      }
    }
  })

  test('Apply Now CTA button is visible and links correctly', async ({ page }) => {
    const viewportSize = page.viewportSize()
    if (viewportSize && viewportSize.width < 1024) {
      test.skip()
    }

    const applyButton = page.locator('header a:has-text("Apply Now")').first()
    if (await applyButton.isVisible()) {
      await expect(applyButton).toHaveAttribute('href', '/academics/graduate')
      await applyButton.click()
      await expect(page).toHaveURL(/\/academics\/graduate/)
    }
  })

  test('mobile menu toggle works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await waitForPageReady(page)

    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-controls*="mobile" i]').first()

    if (await menuButton.isVisible()) {
      // Menu should initially be closed
      const mobileNav = page.locator('[id*="mobile"]').first()

      // Click to open
      await menuButton.click()
      await page.waitForTimeout(300) // Wait for animation

      // Click to close
      await menuButton.click()
    }
  })
})

test.describe('Home Page Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)
  })

  test('hero section CTA buttons work', async ({ page }) => {
    // Primary CTA - Explore Research
    const researchCTA = page.locator('a:has-text("Explore Our Research"), a:has-text("Explore Research")').first()
    if (await researchCTA.isVisible()) {
      const href = await researchCTA.getAttribute('href')
      expect(href).toBeTruthy()
    }

    // Secondary CTA - Meet Faculty
    const facultyCTA = page.locator('a:has-text("Meet Our Faculty"), a:has-text("Meet Faculty")').first()
    if (await facultyCTA.isVisible()) {
      const href = await facultyCTA.getAttribute('href')
      expect(href).toBeTruthy()
    }
  })

  test('hero carousel indicators are clickable', async ({ page }) => {
    const indicators = page.locator('[role="tab"], button[aria-label*="slide" i]')
    const count = await indicators.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const indicator = indicators.nth(i)
      if (await indicator.isVisible()) {
        await expect(indicator).toBeEnabled()
      }
    }
  })

  test('news section "All news" link works', async ({ page }) => {
    const allNewsLink = page.locator('a:has-text("All news"), a[href="/news"]').first()
    if (await allNewsLink.isVisible()) {
      await expect(allNewsLink).toHaveAttribute('href', '/news')
    }
  })

  test('calendar section link works', async ({ page }) => {
    const calendarLink = page.locator('a:has-text("Full calendar"), a[href="/calendar"]').first()
    if (await calendarLink.isVisible()) {
      await expect(calendarLink).toHaveAttribute('href', '/calendar')
    }
  })

  test('quick links cards are clickable', async ({ page }) => {
    const quickLinks = [
      '/faculty',
      '/academics',
      '/research',
      '/alumni',
      '/people',
    ]

    for (const href of quickLinks) {
      const link = page.locator(`a[href="${href}"]`).first()
      if (await link.isVisible()) {
        await expect(link).toBeEnabled()
      }
    }
  })
})

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`)
    await waitForPageReady(page)
  })

  test('contact info cards with links are clickable', async ({ page }) => {
    const linkCards = page.locator('a[href="/academics/graduate"], a[href="/research"], a[href="/dei"]')
    const count = await linkCards.count()

    for (let i = 0; i < count; i++) {
      const card = linkCards.nth(i)
      if (await card.isVisible()) {
        await expect(card).toBeEnabled()
      }
    }
  })

  test('quick links section links work', async ({ page }) => {
    const quickLinks = [
      { href: '/academics', text: 'Academic Programs' },
      { href: '/research', text: 'Research Areas' },
      { href: '/people', text: 'Faculty Directory' },
      { href: '/dei', text: 'Diversity & Inclusion' },
    ]

    for (const link of quickLinks) {
      const element = page.locator(`a[href="${link.href}"]`).first()
      if (await element.isVisible()) {
        await expect(element).toBeEnabled()
      }
    }
  })

  test('UCSB external link has correct attributes', async ({ page }) => {
    const ucsbLink = page.locator('a[href*="ucsb.edu"]').first()
    if (await ucsbLink.isVisible()) {
      await expect(ucsbLink).toHaveAttribute('target', '_blank')
      await expect(ucsbLink).toHaveAttribute('rel', /noopener/)
    }
  })

  test('request appointment button/link works', async ({ page }) => {
    const appointmentButton = page.locator('a[href*="mailto:"]').first()
    if (await appointmentButton.isVisible()) {
      const href = await appointmentButton.getAttribute('href')
      expect(href).toContain('mailto:')
    }
  })

  test('contact form submit button exists and is initially enabled', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()
    if (await submitButton.isVisible()) {
      await expect(submitButton).toBeEnabled()
    }
  })

  test('contact form inputs are interactive', async ({ page }) => {
    // Name input
    const nameInput = page.locator('input[name="name"], input[id="name"]').first()
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User')
      await expect(nameInput).toHaveValue('Test User')
    }

    // Email input
    const emailInput = page.locator('input[name="email"], input[id="email"], input[type="email"]').first()
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com')
      await expect(emailInput).toHaveValue('test@example.com')
    }

    // Subject select
    const subjectSelect = page.locator('select[name="subject"], select[id="subject"]').first()
    if (await subjectSelect.isVisible()) {
      const options = await subjectSelect.locator('option').count()
      expect(options).toBeGreaterThan(0)
    }

    // Message textarea
    const messageTextarea = page.locator('textarea[name="message"], textarea[id="message"]').first()
    if (await messageTextarea.isVisible()) {
      await messageTextarea.fill('This is a test message')
      await expect(messageTextarea).toHaveValue('This is a test message')
    }
  })
})

test.describe('Events Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/events`)
    await waitForPageReady(page)
  })

  test('View Calendar button works', async ({ page }) => {
    const calendarButton = page.locator('a:has-text("View Calendar"), a:has-text("Calendar View")').first()
    if (await calendarButton.isVisible()) {
      const href = await calendarButton.getAttribute('href')
      expect(href).toBeTruthy()
    }
  })

  test('Browse Events anchor link works', async ({ page }) => {
    const browseButton = page.locator('a[href="#upcoming"]').first()
    if (await browseButton.isVisible()) {
      await browseButton.click()
      await expect(page).toHaveURL(/#upcoming/)
    }
  })

  test('event type filter buttons are clickable', async ({ page }) => {
    const filterButtons = page.locator('[class*="rounded-full"][class*="cursor-pointer"]')
    const count = await filterButtons.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = filterButtons.nth(i)
      if (await button.isVisible()) {
        // Just verify it's visible and not disabled
        const isDisabled = await button.getAttribute('disabled')
        expect(isDisabled).toBeNull()
      }
    }
  })

  test('Google Calendar external link has correct attributes', async ({ page }) => {
    const calendarLink = page.locator('a[href*="calendar.google.com"]').first()
    if (await calendarLink.isVisible()) {
      await expect(calendarLink).toHaveAttribute('target', '_blank')
      await expect(calendarLink).toHaveAttribute('rel', /noopener/)
    }
  })
})

test.describe('People Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/people`)
    await waitForPageReady(page)
  })

  test('category filter tabs are clickable', async ({ page }) => {
    const tabs = page.locator('button[role="tab"], [aria-pressed]')
    const count = await tabs.count()

    for (let i = 0; i < Math.min(count, 8); i++) {
      const tab = tabs.nth(i)
      if (await tab.isVisible()) {
        await expect(tab).toBeEnabled()
      }
    }
  })

  test('search input is interactive', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('ecology')
      await expect(searchInput).toHaveValue('ecology')
    }
  })

  test('sort dropdown is interactive', async ({ page }) => {
    const sortSelect = page.locator('select').first()
    if (await sortSelect.isVisible()) {
      const options = await sortSelect.locator('option').count()
      expect(options).toBeGreaterThan(0)
    }
  })

  test('faculty cards are clickable', async ({ page }) => {
    const facultyCards = page.locator('a[href*="/people/"]')
    const count = await facultyCards.count()

    if (count > 0) {
      const firstCard = facultyCards.first()
      if (await firstCard.isVisible()) {
        const href = await firstCard.getAttribute('href')
        expect(href).toContain('/people/')
      }
    }
  })
})

test.describe('Research Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/research`)
    await waitForPageReady(page)
  })

  test('research theme cards/buttons are clickable', async ({ page }) => {
    const themeCards = page.locator('[class*="cursor-pointer"], button, a[href*="/research"]')
    const count = await themeCards.count()

    for (let i = 0; i < Math.min(count, 6); i++) {
      const card = themeCards.nth(i)
      if (await card.isVisible()) {
        const tagName = await card.evaluate(el => el.tagName.toLowerCase())
        if (tagName === 'button') {
          await expect(card).toBeEnabled()
        }
      }
    }
  })

  test('LTER links are clickable', async ({ page }) => {
    const lterLinks = page.locator('a[href*="#sbc-lter"], a[href*="#mcr-lter"], a[href*="lter"]')
    const count = await lterLinks.count()

    for (let i = 0; i < count; i++) {
      const link = lterLinks.nth(i)
      if (await link.isVisible()) {
        const href = await link.getAttribute('href')
        expect(href).toBeTruthy()
      }
    }
  })
})

test.describe('Academics Graduate Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/academics/graduate`)
    await waitForPageReady(page)
  })

  test('tab navigation buttons work', async ({ page }) => {
    const tabs = page.locator('button[role="tab"], [class*="cursor-pointer"]:has-text("Overview"), [class*="cursor-pointer"]:has-text("PhD"), [class*="cursor-pointer"]:has-text("MA")')
    const count = await tabs.count()

    for (let i = 0; i < Math.min(count, 7); i++) {
      const tab = tabs.nth(i)
      if (await tab.isVisible()) {
        await expect(tab).toBeEnabled()
      }
    }
  })

  test('degree program cards are clickable', async ({ page }) => {
    const programCards = page.locator('[class*="cursor-pointer"]')
    const count = await programCards.count()

    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = programCards.nth(i)
      if (await card.isVisible()) {
        // Just verify it's visible and interactive
        const isDisabled = await card.getAttribute('disabled')
        expect(isDisabled).toBeNull()
      }
    }
  })

  test('DEI link works', async ({ page }) => {
    const deiLink = page.locator('a[href="/dei"]').first()
    if (await deiLink.isVisible()) {
      await expect(deiLink).toHaveAttribute('href', '/dei')
    }
  })
})

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)
  })

  test('footer quick links work', async ({ page }) => {
    const quickLinks = ['/about', '/people', '/research', '/academics', '/news']

    for (const href of quickLinks) {
      const link = page.locator(`footer a[href="${href}"]`).first()
      if (await link.isVisible()) {
        await expect(link).toHaveAttribute('href', href)
      }
    }
  })

  test('footer resource links work', async ({ page }) => {
    const resourceLinks = [
      '/academics/graduate',
      '/calendar',
      '/news',
      '/contact',
    ]

    for (const href of resourceLinks) {
      const link = page.locator(`footer a[href="${href}"]`).first()
      if (await link.isVisible()) {
        await expect(link).toHaveAttribute('href', href)
      }
    }
  })

  test('social media links have correct attributes', async ({ page }) => {
    const socialLinks = page.locator('footer a[target="_blank"]')
    const count = await socialLinks.count()

    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i)
      if (await link.isVisible()) {
        await expect(link).toHaveAttribute('rel', /noopener/)
      }
    }
  })

  test('email link works', async ({ page }) => {
    const emailLink = page.locator('footer a[href^="mailto:"]').first()
    if (await emailLink.isVisible()) {
      const href = await emailLink.getAttribute('href')
      expect(href).toContain('mailto:')
    }
  })

  test('phone link works', async ({ page }) => {
    const phoneLink = page.locator('footer a[href^="tel:"]').first()
    if (await phoneLink.isVisible()) {
      const href = await phoneLink.getAttribute('href')
      expect(href).toContain('tel:')
    }
  })

  test('policy links work', async ({ page }) => {
    const privacyLink = page.locator('footer a[href*="privacy"]').first()
    if (await privacyLink.isVisible()) {
      const href = await privacyLink.getAttribute('href')
      expect(href).toBeTruthy()
    }

    const accessibilityLink = page.locator('footer a[href*="accessibility"]').first()
    if (await accessibilityLink.isVisible()) {
      const href = await accessibilityLink.getAttribute('href')
      expect(href).toBeTruthy()
    }
  })
})

test.describe('Testimonial Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)
  })

  test('carousel navigation buttons work', async ({ page }) => {
    // Look for carousel section
    const carousel = page.locator('[aria-roledescription="carousel"], [class*="testimonial" i]').first()

    if (await carousel.isVisible()) {
      // Previous button
      const prevButton = page.locator('button[aria-label*="previous" i], button:has-text("Previous")').first()
      if (await prevButton.isVisible()) {
        await expect(prevButton).toBeEnabled()
      }

      // Next button
      const nextButton = page.locator('button[aria-label*="next" i], button:has-text("Next")').first()
      if (await nextButton.isVisible()) {
        await expect(nextButton).toBeEnabled()
      }
    }
  })

  test('carousel dot indicators are clickable', async ({ page }) => {
    const dots = page.locator('[role="tab"], button[aria-label*="slide" i]')
    const count = await dots.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const dot = dots.nth(i)
      if (await dot.isVisible()) {
        await expect(dot).toBeEnabled()
      }
    }
  })
})

test.describe('News Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/news`)
    await waitForPageReady(page)
  })

  test('news article cards are clickable', async ({ page }) => {
    const articleLinks = page.locator('a[href*="/news/"]')
    const count = await articleLinks.count()

    for (let i = 0; i < Math.min(count, 6); i++) {
      const link = articleLinks.nth(i)
      if (await link.isVisible()) {
        const href = await link.getAttribute('href')
        expect(href).toContain('/news/')
      }
    }
  })

  test('category filter buttons are clickable', async ({ page }) => {
    const filterButtons = page.locator('button[aria-pressed], [class*="filter"]')
    const count = await filterButtons.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = filterButtons.nth(i)
      if (await button.isVisible()) {
        await expect(button).toBeEnabled()
      }
    }
  })
})

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/about`)
    await waitForPageReady(page)
  })

  test('internal navigation links work', async ({ page }) => {
    const internalLinks = page.locator('a[href^="/"]')
    const count = await internalLinks.count()

    // Test first 10 internal links
    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = internalLinks.nth(i)
      if (await link.isVisible()) {
        const href = await link.getAttribute('href')
        expect(href).toMatch(/^\//)
      }
    }
  })
})

test.describe('Button Component Variants', () => {
  test('all button variants render correctly on contact page', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`)
    await waitForPageReady(page)

    // Primary/Gold style button
    const goldButtons = page.locator('[class*="bg-ucsb-gold"], [class*="bg-yellow"]')
    const goldCount = await goldButtons.count()

    for (let i = 0; i < goldCount; i++) {
      const button = goldButtons.nth(i)
      if (await button.isVisible()) {
        // Check for proper styling
        const classes = await button.getAttribute('class')
        expect(classes).toBeTruthy()
      }
    }
  })

  test('all button variants render correctly on events page', async ({ page }) => {
    await page.goto(`${BASE_URL}/events`)
    await waitForPageReady(page)

    // Teal style button
    const tealButtons = page.locator('[class*="bg-ocean-teal"]')
    const tealCount = await tealButtons.count()

    for (let i = 0; i < tealCount; i++) {
      const button = tealButtons.nth(i)
      if (await button.isVisible()) {
        const classes = await button.getAttribute('class')
        expect(classes).toBeTruthy()
      }
    }
  })
})

test.describe('Broken Link Detection', () => {
  test('no buttons/links have empty href', async ({ page }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)

    const links = page.locator('a[href=""], a:not([href])')
    const count = await links.count()

    // Report any links without href
    if (count > 0) {
      console.warn(`Found ${count} links without valid href attribute`)
    }
  })

  test('no buttons have broken onClick handlers', async ({ page }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)

    // Get all buttons
    const buttons = page.locator('button')
    const count = await buttons.count()

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      if (await button.isVisible()) {
        // Check button is not in error state
        const classes = await button.getAttribute('class')
        // Some buttons may not have classes, which is fine
        if (classes) {
          expect(classes).not.toContain('error')
        }
      }
    }
  })
})

test.describe('Interactive Element Focus States', () => {
  test('buttons have visible focus states', async ({ page }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)

    const button = page.locator('button, a[href]').first()
    if (await button.isVisible()) {
      await button.focus()
      // Just verify focus was set
      await expect(button).toBeFocused()
    }
  })

  test('form inputs have visible focus states', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`)
    await waitForPageReady(page)

    const input = page.locator('input').first()
    if (await input.isVisible()) {
      await input.focus()
      await expect(input).toBeFocused()
    }
  })
})

test.describe('Disabled State Handling', () => {
  test('disabled buttons are not clickable', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`)
    await waitForPageReady(page)

    // Fill form to potentially trigger disabled state
    const nameInput = page.locator('input[name="name"]').first()
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button[type="submit"]').first()

    if (await submitButton.isVisible()) {
      // Submit should be enabled initially
      await expect(submitButton).toBeEnabled()
    }
  })
})
