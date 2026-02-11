'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Memorial } from '@/lib/data/memorials'

interface InMemoriamClientProps {
  memorials: Memorial[]
}

export default function InMemoriamClient({ memorials }: InMemoriamClientProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const selectedMem = memorials.find(m => m.slug === selectedSlug)

  // Format years string from birth_year and death_year
  const formatYears = (m: Memorial) => {
    if (m.birth_year && m.death_year) return `${m.birth_year}-${m.death_year}`
    if (m.birth_year) return `${m.birth_year}-`
    if (m.death_year) return `?-${m.death_year}`
    return ''
  }

  // Parse external_links from JSONB
  const getExternalLinks = (m: Memorial): { title: string; url: string }[] => {
    if (!m.external_links) return []
    if (Array.isArray(m.external_links)) return m.external_links
    return []
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-deep/90 to-ocean-deep/80 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">In Memoriam</h1>
            <p className="text-lg md:text-xl text-white/90">
              Honoring the lives and legacies of our esteemed colleagues who have passed away.
            </p>
          </div>
        </div>
      </section>

      {/* Memorial Message */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-warm-700 leading-relaxed">
              The EEMB Department has been shaped by brilliant scientists, dedicated educators, and wonderful human beings.
              This page honors the memory of our departed colleagues whose contributions to science, teaching, and our community
              continue to inspire us. Their legacy lives on through their research, their students, and the lasting impact they
              made on our field and our department.
            </p>
          </div>
        </div>
      </section>

      {/* Memorial Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memorials.map((memorial) => {
              const years = formatYears(memorial)
              return (
                <div
                  key={memorial.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedSlug(memorial.slug)}
                >
                  {memorial.photo_url ? (
                    <div className="relative h-48 bg-gradient-to-br from-warm-200 to-warm-200 overflow-hidden">
                      <Image
                        src={memorial.photo_url}
                        alt={memorial.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-warm-200 to-warm-200 flex items-center justify-center">
                      <div className="w-32 h-32 bg-warm-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                        {memorial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-ocean-deep mb-2">{memorial.name}</h3>
                    <p className="text-warm-600 font-semibold mb-1">{memorial.title}</p>
                    {years && <p className="text-warm-600 text-sm mb-4">{years}</p>}
                    <p className="text-warm-700 line-clamp-3">{memorial.bio}</p>
                    {memorial.research_areas && memorial.research_areas.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {memorial.research_areas.map((area, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-warm-100 text-warm-600 rounded text-xs"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                    <button className="mt-4 text-ocean-blue font-semibold hover:underline">
                      Read More &rarr;
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Memorial Detail Modal */}
      {selectedMem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSlug(null)}
        >
          <div
            className="bg-white rounded-xl max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-ocean-deep">{selectedMem.name}</h2>
              <button
                onClick={() => setSelectedSlug(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-warm-100 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-warm-600 font-semibold mb-1">{selectedMem.title}</p>
                {formatYears(selectedMem) && (
                  <p className="text-warm-600">{formatYears(selectedMem)}</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-ocean-deep mb-3">Biography</h3>
                <p className="text-warm-700 leading-relaxed">{selectedMem.bio}</p>
              </div>

              {selectedMem.research_areas && selectedMem.research_areas.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-ocean-deep mb-3">Research Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMem.research_areas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-ocean-blue/10 text-ocean-deep rounded-full text-sm font-semibold"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-ocean-deep mb-3">Legacy</h3>
                <p className="text-warm-700 leading-relaxed">{selectedMem.legacy}</p>
              </div>

              {getExternalLinks(selectedMem).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-ocean-deep mb-3">Additional Information</h3>
                  <div className="space-y-2">
                    {getExternalLinks(selectedMem).map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-ocean-blue hover:underline"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-ocean-deep mb-4">Submit a Memorial</h2>
            <p className="text-warm-700 mb-6">
              If you would like to suggest someone to be remembered on this page or have additional information
              to contribute about those listed, please contact the department.
            </p>
            <a
              href="mailto:eemb@ucsb.edu"
              className="inline-block bg-ocean-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-ocean-deep transition"
            >
              Contact Department
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
