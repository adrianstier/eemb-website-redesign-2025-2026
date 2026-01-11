import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '@/components/Header'

// Mock usePathname to return a specific path
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return mockUsePathname()
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

describe('Header Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  it('renders the header with EEMB branding', () => {
    render(<Header />)
    expect(screen.getByText('EEMB')).toBeInTheDocument()
    expect(screen.getByText(/Ecology · Evolution · Marine Biology/i)).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Header />)

    const navLinks = ['About', 'People', 'Research', 'Academics', 'News', 'Events', 'Support', 'Contact']
    navLinks.forEach(link => {
      expect(screen.getAllByText(link).length).toBeGreaterThan(0)
    })
  })

  it('renders Apply Now CTA button', () => {
    render(<Header />)
    const applyButtons = screen.getAllByText('Apply Now')
    expect(applyButtons.length).toBeGreaterThan(0)
  })

  it('toggles mobile menu on button click', () => {
    render(<Header />)

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    expect(menuButton).toBeInTheDocument()

    // Open menu
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // Close menu
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes mobile menu on Escape key press', async () => {
    render(<Header />)

    const menuButton = screen.getByRole('button', { name: /open menu/i })

    // Open menu
    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('has proper aria-controls attribute on mobile menu button', () => {
    render(<Header />)

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu')
  })

  it('mobile menu has aria-hidden when closed', () => {
    render(<Header />)

    const mobileMenu = document.getElementById('mobile-menu')
    expect(mobileMenu).toHaveAttribute('aria-hidden', 'true')
  })

  it('mobile menu is visible when opened', async () => {
    render(<Header />)

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(menuButton)

    const mobileMenu = document.getElementById('mobile-menu')
    expect(mobileMenu).toHaveAttribute('aria-hidden', 'false')
  })

  it('applies solid background on light pages', () => {
    mockUsePathname.mockReturnValue('/news')
    render(<Header />)

    const header = document.querySelector('header')
    expect(header?.className).toContain('bg-ocean-deep')
  })

  it('renders logo with link to home page', () => {
    render(<Header />)

    const homeLink = screen.getByRole('link', { name: /eemb/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('navigation links have correct hrefs', () => {
    render(<Header />)

    // Check a few key navigation links (desktop nav)
    const aboutLinks = screen.getAllByRole('link', { name: /about/i })
    expect(aboutLinks.some(link => link.getAttribute('href') === '/about')).toBe(true)

    const peopleLinks = screen.getAllByRole('link', { name: /people/i })
    expect(peopleLinks.some(link => link.getAttribute('href') === '/people')).toBe(true)
  })

  it('Apply Now links to graduate academics page', () => {
    render(<Header />)

    const applyLinks = screen.getAllByRole('link', { name: /apply now/i })
    expect(applyLinks.some(link => link.getAttribute('href') === '/academics/graduate')).toBe(true)
  })
})

describe('Header Scroll Behavior', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  it('adds scroll styles after scrolling', async () => {
    render(<Header />)

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    fireEvent.scroll(window)

    await waitFor(() => {
      const header = document.querySelector('header')
      expect(header?.className).toContain('backdrop-blur')
    })
  })
})
