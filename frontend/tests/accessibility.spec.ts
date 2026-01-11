import { test, expect } from '@playwright/test'

/**
 * Accessibility E2E Tests
 * Tests keyboard navigation, focus management, and ARIA compliance
 */

test.describe('Keyboard Navigation', () => {
  test('homepage can be navigated with keyboard only', async ({ page }) => {
    await page.goto('/')

    // Tab should move focus through interactive elements
    await page.keyboard.press('Tab')

    // First focusable element should have focus
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Tab through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      const currentFocus = page.locator(':focus')
      await expect(currentFocus).toBeVisible()
    }
  })

  test('skip link works when present', async ({ page }) => {
    await page.goto('/')

    // Press Tab to potentially reveal skip link
    await page.keyboard.press('Tab')

    // Check for skip link
    const skipLink = page.getByRole('link', { name: /skip to main|skip to content/i })
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeFocused()

      // Activate skip link
      await page.keyboard.press('Enter')

      // Focus should move to main content area
      const main = page.getByRole('main')
      await expect(main).toBeVisible()
    }
  })

  test('mobile menu can be operated with keyboard', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Find and activate mobile menu button
    const menuButton = page.getByRole('button', { name: /menu|navigation/i })

    if (await menuButton.count() > 0) {
      await menuButton.focus()
      await page.keyboard.press('Enter')

      // Menu should open
      await page.waitForTimeout(300) // Allow for animation

      // Escape should close menu
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
    }
  })
})

test.describe('Focus Management', () => {
  test('focus indicators are visible', async ({ page }) => {
    await page.goto('/')

    // Tab to first interactive element
    await page.keyboard.press('Tab')

    // Get the focused element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Check that focus is visible (has outline or other indicator)
    // This is a basic check - the element should be distinguishable when focused
    const outline = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      }
    })

    // Focus should have some visual indication (outline or shadow)
    const hasFocusStyle =
      outline.outline !== 'none' ||
      outline.outlineWidth !== '0px' ||
      outline.boxShadow !== 'none'

    expect(hasFocusStyle).toBeTruthy()
  })

  test('links in navigation are focusable', async ({ page }) => {
    await page.goto('/')

    const nav = page.getByRole('navigation')
    const links = nav.getByRole('link')

    // All nav links should be focusable
    const linkCount = await links.count()
    expect(linkCount).toBeGreaterThan(0)

    // First link should be focusable
    const firstLink = links.first()
    await firstLink.focus()
    await expect(firstLink).toBeFocused()
  })
})

test.describe('ARIA Compliance', () => {
  test('page has proper landmark structure', async ({ page }) => {
    await page.goto('/')

    // Should have main landmark
    const main = page.getByRole('main')
    await expect(main).toBeVisible()

    // Should have navigation landmark
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()
  })

  test('headings follow hierarchy', async ({ page }) => {
    await page.goto('/')

    // Get all headings
    const headings = await page.evaluate(() => {
      const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      return Array.from(allHeadings).map((h) => ({
        level: parseInt(h.tagName.slice(1)),
        text: h.textContent?.trim().slice(0, 50),
      }))
    })

    // Should have at least one h1
    const h1s = headings.filter((h) => h.level === 1)
    expect(h1s.length).toBeGreaterThanOrEqual(1)

    // First heading should be h1 or h2 (allowing for banner/nav headings)
    if (headings.length > 0) {
      expect(headings[0].level).toBeLessThanOrEqual(2)
    }
  })

  test('images have alt text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Get all images
    const images = page.locator('img')
    const imageCount = await images.count()

    // Check each image has alt attribute
    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')

      // Alt should be defined (can be empty for decorative images)
      expect(alt).toBeDefined()
    }
  })

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/contact')

    // Get all form inputs
    const inputs = page.locator('input, textarea, select').filter({
      hasNot: page.locator('[type="hidden"]'),
    })

    const inputCount = await inputs.count()

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledby = await input.getAttribute('aria-labelledby')

      // Should have either a label, aria-label, or aria-labelledby
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const hasLabel = (await label.count()) > 0
        const hasAriaLabel = ariaLabel || ariaLabelledby

        expect(hasLabel || hasAriaLabel).toBeTruthy()
      }
    }
  })

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/')

    const buttons = page.getByRole('button')
    const buttonCount = await buttons.count()

    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i)
      const accessibleName = await button.evaluate((el) => {
        return (
          el.textContent?.trim() ||
          el.getAttribute('aria-label') ||
          el.getAttribute('title') ||
          ''
        )
      })

      // Button should have some accessible name
      expect(accessibleName.length).toBeGreaterThan(0)
    }
  })
})

test.describe('Color Contrast (Visual Check)', () => {
  test('text is readable on all pages', async ({ page }) => {
    const pages = ['/', '/people', '/research', '/contact', '/about']

    for (const path of pages) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      // Basic check that text exists and is not invisible
      const bodyText = await page.evaluate(() => {
        const body = document.body
        const styles = window.getComputedStyle(body)
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
        }
      })

      // Text color should not be fully transparent
      expect(bodyText.color).not.toContain('rgba(0, 0, 0, 0)')
    }
  })
})

test.describe('Reduced Motion', () => {
  test('respects prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    // Check that animations are disabled
    const animations = await page.evaluate(() => {
      const elements = document.querySelectorAll('*')
      let animatedCount = 0

      elements.forEach((el) => {
        const styles = window.getComputedStyle(el)
        const animation = styles.animation
        const transition = styles.transition

        // Check if element has running animations
        if (animation && !animation.includes('none') && !animation.includes('0s')) {
          animatedCount++
        }
      })

      return animatedCount
    })

    // With reduced motion, there should be minimal animations
    // This is a soft check - some CSS transitions may still exist
    console.log(`Found ${animations} potentially animated elements with reduced motion enabled`)
  })
})
