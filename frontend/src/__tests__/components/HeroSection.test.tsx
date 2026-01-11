import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroSection from '@/components/HeroSection'

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} data-fill={fill} data-priority={priority} />
  },
}))

// Mock the useReducedMotion hook
const mockUseReducedMotion = jest.fn()
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
  default: () => mockUseReducedMotion(),
}))

describe('HeroSection Component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the hero section with main elements', () => {
      render(<HeroSection />)

      // Check for main heading structure
      expect(screen.getByText('We study')).toBeInTheDocument()
      expect(screen.getByText('UC Santa Barbara')).toBeInTheDocument()
      expect(screen.getByText(/Department of Ecology, Evolution/)).toBeInTheDocument()
    })

    it('displays the first headline by default', () => {
      render(<HeroSection />)

      // First headline should be visible
      expect(screen.getByText('Kelp forests')).toBeInTheDocument()
    })

    it('renders CTA buttons with correct links', () => {
      render(<HeroSection />)

      const researchLink = screen.getByRole('link', { name: /Explore Our Research/i })
      const facultyLink = screen.getByRole('link', { name: /Meet Our Faculty/i })

      expect(researchLink).toHaveAttribute('href', '/research')
      expect(facultyLink).toHaveAttribute('href', '/people')
    })

    it('displays statistics', () => {
      render(<HeroSection />)

      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('Faculty')).toBeInTheDocument()
      expect(screen.getByText('100+')).toBeInTheDocument()
      expect(screen.getByText('Graduate Students')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('NSF LTER Sites')).toBeInTheDocument()
    })
  })

  describe('Carousel Navigation', () => {
    it('renders slide indicator buttons', () => {
      render(<HeroSection />)

      // There should be 5 indicator buttons (one for each headline)
      const indicators = screen.getAllByRole('tab')
      expect(indicators).toHaveLength(5)
    })

    it('changes slide when indicator is clicked', () => {
      render(<HeroSection />)

      // First headline should be visible initially
      expect(screen.getByText('Kelp forests')).toBeInTheDocument()

      // Click the second indicator
      const indicators = screen.getAllByRole('tab')
      fireEvent.click(indicators[1])

      // Wait for animation
      act(() => {
        jest.advanceTimersByTime(500)
      })

      // Second headline should now be visible
      expect(screen.getByText('Coral reefs')).toBeInTheDocument()
    })

    it('marks current slide indicator as selected', () => {
      render(<HeroSection />)

      const indicators = screen.getAllByRole('tab')
      expect(indicators[0]).toHaveAttribute('aria-selected', 'true')
      expect(indicators[1]).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('Auto-rotation', () => {
    it('auto-rotates headlines when reduced motion is not preferred', () => {
      mockUseReducedMotion.mockReturnValue(false)
      render(<HeroSection />)

      // First headline
      expect(screen.getByText('Kelp forests')).toBeInTheDocument()

      // Advance timer past rotation interval (5000ms + animation time)
      act(() => {
        jest.advanceTimersByTime(5500)
      })

      // Should show second headline
      expect(screen.getByText('Coral reefs')).toBeInTheDocument()
    })

    it('does not auto-rotate when reduced motion is preferred', () => {
      mockUseReducedMotion.mockReturnValue(true)
      render(<HeroSection />)

      // First headline
      expect(screen.getByText('Kelp forests')).toBeInTheDocument()

      // Advance timer past rotation interval
      act(() => {
        jest.advanceTimersByTime(6000)
      })

      // Should still show first headline
      expect(screen.getByText('Kelp forests')).toBeInTheDocument()
    })

    it('pauses rotation on mouse enter', () => {
      mockUseReducedMotion.mockReturnValue(false)
      render(<HeroSection />)

      const section = screen.getByRole('region', { name: /EEMB research highlights/i })

      // First headline
      expect(screen.getByText('Kelp forests')).toBeInTheDocument()

      // Hover over section
      fireEvent.mouseEnter(section)

      // Advance timer past rotation interval
      act(() => {
        jest.advanceTimersByTime(6000)
      })

      // Should still show first headline (paused)
      expect(screen.getByText('Kelp forests')).toBeInTheDocument()

      // Mouse leaves section
      fireEvent.mouseLeave(section)

      // Advance timer again
      act(() => {
        jest.advanceTimersByTime(6000)
      })

      // Now should have rotated
      expect(screen.getByText('Coral reefs')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has appropriate ARIA attributes', () => {
      render(<HeroSection />)

      const carousel = screen.getByRole('region', { name: /EEMB research highlights/i })
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')
    })

    it('has aria-live region for headline announcements', () => {
      render(<HeroSection />)

      // The aria-live attribute is on the rotating text span
      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).toBeInTheDocument()
    })

    it('provides accessible labels for indicator buttons', () => {
      render(<HeroSection />)

      const indicators = screen.getAllByRole('tab')
      expect(indicators[0]).toHaveAttribute('aria-label', 'Slide 1: Kelp forests')
      expect(indicators[1]).toHaveAttribute('aria-label', 'Slide 2: Coral reefs')
    })

    it('marks decorative elements as aria-hidden', () => {
      render(<HeroSection />)

      // Scroll indicator should be hidden
      const scrollIndicator = document.querySelector('[aria-hidden="true"]')
      expect(scrollIndicator).toBeInTheDocument()
    })

    it('disables animations when reduced motion is preferred', () => {
      mockUseReducedMotion.mockReturnValue(true)
      render(<HeroSection />)

      // Check that bounce animation class is not present
      const scrollIndicator = document.querySelector('.animate-bounce')
      expect(scrollIndicator).not.toBeInTheDocument()
    })
  })

  describe('Focus Management', () => {
    it('pauses rotation when carousel receives focus', () => {
      mockUseReducedMotion.mockReturnValue(false)
      render(<HeroSection />)

      const firstIndicator = screen.getAllByRole('tab')[0]

      // Focus on an element inside the carousel
      fireEvent.focus(firstIndicator)

      // First headline
      expect(screen.getByText('Kelp forests')).toBeInTheDocument()

      // Advance timer past rotation interval
      act(() => {
        jest.advanceTimersByTime(6000)
      })

      // Should still show first headline (paused due to focus)
      expect(screen.getByText('Kelp forests')).toBeInTheDocument()
    })
  })
})
