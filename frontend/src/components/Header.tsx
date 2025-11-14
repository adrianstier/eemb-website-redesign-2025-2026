'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-ocean-blue">EEMB</div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-gray-600">Ecology, Evolution</div>
              <div className="text-xs text-gray-500">Marine Biology</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/about" className="text-gray-700 hover:text-ocean-teal transition font-medium">About</Link>
            <Link href="/people" className="text-gray-700 hover:text-ocean-teal transition font-medium">People</Link>
            <Link href="/research" className="text-gray-700 hover:text-ocean-teal transition font-medium">Research</Link>
            <Link href="/academics" className="text-gray-700 hover:text-ocean-teal transition font-medium">Academics</Link>
            <Link href="/news" className="text-gray-700 hover:text-ocean-teal transition font-medium">News</Link>
            <Link href="/calendar" className="text-gray-700 hover:text-ocean-teal transition font-medium">Events</Link>
            <Link href="/support" className="text-gray-700 hover:text-ocean-teal transition font-medium">Support</Link>
            <Link href="/contact" className="text-gray-700 hover:text-ocean-teal transition font-medium">Contact</Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6 text-ocean-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1 pt-4">
              <Link href="/about" className="text-gray-700 hover:text-ocean-teal transition py-2 font-medium">About</Link>
              <Link href="/people" className="text-gray-700 hover:text-ocean-teal transition py-2 font-medium">People</Link>
              <Link href="/research" className="text-gray-700 hover:text-ocean-teal transition py-2 font-medium">Research</Link>
              <Link href="/academics" className="text-gray-700 hover:text-ocean-teal transition py-2 font-medium">Academics</Link>
              <Link href="/news" className="text-gray-700 hover:text-ocean-teal transition py-2 font-medium">News</Link>
              <Link href="/calendar" className="text-gray-700 hover:text-ocean-teal transition py-2 font-medium">Events</Link>
              <Link href="/support" className="text-gray-700 hover:text-ocean-teal transition py-2 font-medium">Support</Link>
              <Link href="/contact" className="text-gray-700 hover:text-ocean-teal transition py-2 font-medium">Contact</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}