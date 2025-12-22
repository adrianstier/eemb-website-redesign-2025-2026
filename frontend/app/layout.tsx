import type { Metadata } from 'next'
import { Inter, Literata } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Body font - clean, modern, highly readable
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Heading font - academic serif with warmth and character
const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EEMB - Ecology, Evolution & Marine Biology | UC Santa Barbara',
  description: 'Department of Ecology, Evolution and Marine Biology at UC Santa Barbara',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${literata.variable} font-sans`}>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-ocean-teal focus:text-white focus:rounded-lg focus:shadow-lg focus:font-semibold"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}