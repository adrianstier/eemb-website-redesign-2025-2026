'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      // Background change
      setScrolled(currentScrollY > 50)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/people', label: 'People' },
    { href: '/research', label: 'Research' },
    { href: '/academics', label: 'Academics' },
    { href: '/news', label: 'News' },
    { href: '/calendar', label: 'Events' },
    { href: '/support', label: 'Support' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-spring ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        scrolled
          ? 'bg-ocean-deep/95 backdrop-blur-xl shadow-ocean py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            {/* Logo mark */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                scrolled ? 'bg-white/10' : 'bg-white/5'
              } group-hover:bg-bioluminescent/20`}>
                <span className="font-heading text-xl font-bold text-white tracking-tight">
                  E
                </span>
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-bioluminescent/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Text */}
            <div className="hidden sm:block">
              <div className="font-heading text-xl font-bold text-white tracking-tight">
                EEMB
              </div>
              <div className="text-[10px] text-white/50 tracking-wider uppercase">
                Ecology · Evolution · Marine Biology
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2.5 text-sm text-white/80 hover:text-white font-medium transition-all duration-300 rounded-xl hover:bg-white/5 group"
              >
                {link.label}
                {/* Animated underline */}
                <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-gradient-to-r from-bioluminescent to-ocean-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </Link>
            ))}

            {/* CTA button */}
            <Link
              href="/academics/graduate"
              className="ml-4 px-5 py-2.5 text-sm font-semibold bg-ucsb-gold text-ocean-deep rounded-xl hover:shadow-glow-gold transition-all duration-300"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-spring ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-4 border-t border-white/10" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 py-3.5 px-4 rounded-xl font-medium flex items-center justify-between group"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    opacity: mobileMenuOpen ? 1 : 0,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `all 0.3s ease ${index * 50}ms`
                  }}
                >
                  {link.label}
                  <svg
                    className="w-4 h-4 text-white/30 group-hover:text-bioluminescent group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}

              {/* Mobile CTA */}
              <Link
                href="/academics/graduate"
                className="mt-4 mx-4 py-4 text-center font-semibold bg-ucsb-gold text-ocean-deep rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
