import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import WebVitals from '@/components/WebVitals'

// Body font - warm, friendly, highly readable
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

// Heading font - characterful serif with personality and academic gravitas
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://eemb.ucsb.edu'),
  title: 'EEMB - Ecology, Evolution & Marine Biology | UC Santa Barbara',
  description: 'Department of Ecology, Evolution and Marine Biology at UC Santa Barbara. Where the Santa Ynez Mountains meet the Pacific, we ask questions that matter.',
  twitter: {
    card: 'summary_large_image',
    site: '@UCSBEcoEvo',
  },
}

// Viewport configuration for accessibility
// Allows users to zoom up to 5x and doesn't disable user scaling
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Department of Ecology, Evolution and Marine Biology",
              "alternateName": "EEMB",
              "url": "https://eemb.ucsb.edu",
              "parentOrganization": {
                "@type": "CollegeOrUniversity",
                "name": "University of California, Santa Barbara",
                "url": "https://www.ucsb.edu"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Noble Hall",
                "addressLocality": "Santa Barbara",
                "addressRegion": "CA",
                "postalCode": "93106",
                "addressCountry": "US"
              },
              "department": "College of Letters and Science"
            }),
          }}
        />
      </head>
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans antialiased`}>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-bioluminescent focus:text-ocean-deep focus:rounded-xl focus:shadow-glow focus:font-semibold focus:ring-2 focus:ring-bioluminescent/50"
        >
          Skip to main content
        </a>

        {/* Subtle grain overlay for texture */}
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <Header />
        <main id="main-content" className="min-h-screen overflow-x-hidden">{children}</main>
        <Footer />
        <WebVitals />
      </body>
    </html>
  )
}
