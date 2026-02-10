import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alumni Network | EEMB',
  description: 'Connect with the global community of EEMB graduates from UC Santa Barbara.',
}

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Alumni Network</h1>
            <p className="text-lg md:text-xl text-white/90">
              Connect with our global community of EEMB graduates making an impact around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-ocean-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-ocean-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-heading font-bold text-ocean-deep mb-4">
              Alumni Directory Coming Soon
            </h2>
            <p className="text-warm-600 mb-8 leading-relaxed">
              We are building a comprehensive alumni network to connect EEMB graduates across the globe.
              If you are an EEMB alum and would like to be included, please reach out to us.
            </p>
            <a
              href="mailto:eemb-web@ucsb.edu?subject=Alumni%20Directory%20Interest"
              className="inline-flex items-center gap-2 bg-ucsb-gold text-ocean-deep px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="pb-16">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="text-ocean-blue hover:underline">
            &larr; Back to EEMB website
          </Link>
        </div>
      </section>
    </div>
  )
}
