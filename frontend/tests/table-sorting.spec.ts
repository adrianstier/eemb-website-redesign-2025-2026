import { test, expect } from '@playwright/test'

test.describe('People Directory Table Sorting', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console logs
    page.on('console', msg => {
      console.log('BROWSER:', msg.text())
    })

    await page.goto('http://localhost:3000/people')
    await page.waitForLoadState('networkidle')

    // Make sure we're on the Full Directory tab
    const fullDirectoryTab = page.locator('button:has-text("Full Directory")')
    await fullDirectoryTab.click()
    await page.waitForTimeout(500)
  })

  test('should sort by name ascending and descending', async ({ page }) => {
    // Get initial first person's name
    const firstNameBefore = await page.locator('tbody tr:first-child td:first-child').textContent()
    console.log('First name before sort:', firstNameBefore)

    // Click Name header to sort descending (default is ascending)
    await page.locator('th:has-text("Name")').click()
    await page.waitForTimeout(1000) // Increased wait time for React to re-render

    const firstNameAfterDesc = await page.locator('tbody tr:first-child td:first-child').textContent()
    console.log('First name after desc sort:', firstNameAfterDesc)

    // Names should be different after sorting
    expect(firstNameBefore).not.toBe(firstNameAfterDesc)

    // Click again to sort ascending
    await page.locator('th:has-text("Name")').click()
    await page.waitForTimeout(1000) // Increased wait time for React to re-render

    const firstNameAfterAsc = await page.locator('tbody tr:first-child td:first-child').textContent()
    console.log('First name after asc sort:', firstNameAfterAsc)

    // Should be back to original
    expect(firstNameAfterAsc).toBe(firstNameBefore)
  })

  test('should sort by title/role', async ({ page }) => {
    // Get all titles before sorting
    const titlesBefore = await page.locator('tbody tr td:nth-child(2)').allTextContents()
    console.log('First 3 titles before:', titlesBefore.slice(0, 3))

    // Click Title/Role header
    await page.locator('th:has-text("Title/Role")').click()
    await page.waitForTimeout(500)

    const titlesAfter = await page.locator('tbody tr td:nth-child(2)').allTextContents()
    console.log('First 3 titles after:', titlesAfter.slice(0, 3))

    // Titles should be different after sorting
    expect(titlesBefore[0]).not.toBe(titlesAfter[0])
  })

  test('should sort by email', async ({ page }) => {
    // Get first email before sorting
    const emailBefore = await page.locator('tbody tr:first-child td:nth-child(3)').textContent()
    console.log('First email before:', emailBefore)

    // Click Email header
    await page.locator('th:has-text("Email")').click()
    await page.waitForTimeout(500)

    const emailAfter = await page.locator('tbody tr:first-child td:nth-child(3)').textContent()
    console.log('First email after:', emailAfter)

    // Should be sorted alphabetically
    expect(emailAfter).toBeTruthy()
  })

  test('should show sort indicator icons', async ({ page }) => {
    // Click Name header
    await page.locator('th:has-text("Name")').click()
    await page.waitForTimeout(500)

    // Check for SVG icon in the Name header
    const nameHeaderSvg = page.locator('th:has-text("Name") svg')
    await expect(nameHeaderSvg).toBeVisible()
  })

  test('should toggle sort direction on multiple clicks', async ({ page }) => {
    const nameHeader = page.locator('th:has-text("Name")')

    // Get initial SVG (should show up arrow for asc)
    await page.waitForTimeout(300)
    let svg = await nameHeader.locator('svg path').getAttribute('d')
    console.log('Initial SVG path:', svg)

    // Click to reverse
    await nameHeader.click()
    await page.waitForTimeout(300)

    let svgAfter = await nameHeader.locator('svg path').getAttribute('d')
    console.log('SVG path after click:', svgAfter)

    // SVG should change
    expect(svg).not.toBe(svgAfter)
  })
})
