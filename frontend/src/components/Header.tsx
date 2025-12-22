'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add scroll listener for header background transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ocean-deep/95 backdrop-blur-md shadow-lg'
          : 'bg-ocean-deep'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 md:h-18">
          {/* Logo - refined with serif font */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-heading text-2xl font-bold text-white tracking-tight">
              EEMB
            </span>
            <div className="hidden sm:block border-l border-white/20 pl-3">
              <div className="text-xs font-medium text-white/90 leading-tight">
                Ecology, Evolution &
              </div>
              <div className="text-xs text-white/60 leading-tight">
                Marine Biology
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm text-white/90 hover:text-white font-medium transition-colors duration-200 rounded-lg hover:bg-white/5 group"
              >
                {link.label}
                {/* Animated underline */}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-ucsb-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation - improved styling */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="pb-4 pt-2 border-t border-white/10" aria-label="Mobile navigation">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 py-3 px-4 rounded-xl font-medium flex items-center justify-between group"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                  <svg className="w-4 h-4 text-white/40 group-hover:text-ucsb-gold group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
