'use client'

import { useInView } from '@/hooks/useInView'

export default function PartnersSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  const partners = [
    { name: 'Marine Science Institute', url: 'https://msi.ucsb.edu', abbr: 'MSI' },
    { name: 'NCEAS', url: 'https://www.nceas.ucsb.edu', abbr: 'NCEAS' },
    { name: 'SB Coastal LTER', url: 'https://sbclter.msi.ucsb.edu', abbr: 'SBC LTER' },
    { name: 'Moorea Coral Reef LTER', url: 'https://mcr.lternet.edu', abbr: 'MCR LTER' },
    { name: 'Bren School', url: 'https://bren.ucsb.edu', abbr: 'Bren' },
    { name: 'Channel Islands NMS', url: 'https://channelislands.noaa.gov', abbr: 'CINMS' },
  ]

  return (
    <section ref={ref} className="py-12 bg-warm-50 border-t border-warm-200 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl relative">
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-8 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Label */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ocean-teal/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-ocean-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-warm-600 font-medium text-sm">
              Research Partners & Affiliations
            </p>
          </div>

          {/* Partner links */}
          <div className="flex flex-wrap items-center gap-3">
            {partners.map((partner, index) => (
              <a
                key={index}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative px-4 py-2 text-sm text-warm-600 hover:text-ocean-deep font-medium transition-all duration-500 rounded-xl hover:bg-white hover:shadow-warm-md whitespace-nowrap ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                title={partner.name}
              >
                {/* Hover underline */}
                <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-ocean-teal/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />

                {/* Show abbreviation on mobile, full name on larger screens */}
                <span className="md:hidden">{partner.abbr}</span>
                <span className="hidden md:inline">{partner.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
