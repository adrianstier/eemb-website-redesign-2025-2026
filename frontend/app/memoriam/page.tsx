'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Memorial {
  id: string
  name: string
  title: string
  years: string
  photo?: string
  bio: string
  obituary?: string
  externalLinks?: {
    title: string
    url: string
  }[]
  researchAreas?: string[]
  legacy: string
}

export default function InMemoriamPage() {
  const [selectedMemorial, setSelectedMemorial] = useState<string | null>(null)

  const memorials: Memorial[] = [
    {
      id: 'john-damuth',
      name: 'John Damuth',
      title: 'Professor Emeritus',
      years: '1943-2024',
      bio: 'John Damuth was a distinguished evolutionary biologist and ecologist whose groundbreaking research on body size and energy use in mammals transformed our understanding of ecological scaling relationships.',
      legacy: 'Professor Damuth\'s work on the "Energetic Equivalence Rule" remains foundational in ecology. His mentorship of graduate students and collaborative spirit left an indelible mark on the department. He will be remembered for his intellectual curiosity, kindness, and dedication to understanding the natural world.',
      researchAreas: ['Evolutionary Biology', 'Ecology', 'Mammalian Evolution'],
      externalLinks: []
    },
    {
      id: 'allen-stewart-oaten',
      name: 'Allen Stewart-Oaten',
      title: 'Professor Emeritus',
      years: '1945-2024',
      bio: 'Allen Stewart-Oaten was a pioneering statistician and ecologist who revolutionized environmental impact assessment through his development of the BACI (Before-After-Control-Impact) design.',
      legacy: 'Professor Stewart-Oaten\'s statistical methods for environmental monitoring are used worldwide and have been instrumental in assessing ecological impacts of human activities. His rigorous approach to statistical ecology and his mentorship of students across disciplines created a lasting legacy in environmental science.',
      researchAreas: ['Biostatistics', 'Environmental Impact Assessment', 'Ecological Statistics'],
      externalLinks: []
    },
    {
      id: 'bob-trench',
      name: 'Robert Kent "Bob" Trench',
      title: 'Professor Emeritus',
      years: '1935-2022',
      bio: 'Bob Trench was a pioneering marine biologist whose research on coral-algal symbiosis fundamentally advanced our understanding of reef ecosystems.',
      legacy: 'Professor Trench\'s work on zooxanthellae and coral symbiosis laid crucial groundwork for understanding coral bleaching and reef health. His dedication to marine biology and his warm mentorship style inspired generations of marine scientists.',
      researchAreas: ['Marine Biology', 'Coral Reef Ecology', 'Symbiosis'],
      externalLinks: [
        {
          title: 'Global Coral Memorial',
          url: 'https://www.globalcoral.org/robert-kent-trench-in-memoriam-2/'
        }
      ]
    },
    {
      id: 'joe-connell',
      name: 'Joseph Hurd Connell',
      title: 'Professor Emeritus',
      years: '1923-2020',
      bio: 'Joseph Connell was one of the most influential ecologists of the 20th century, known for his pioneering work on competition, predation, and community ecology.',
      legacy: 'Professor Connell\'s research on barnacles and the intermediate disturbance hypothesis revolutionized community ecology. His elegant field experiments and theoretical insights continue to shape ecological thinking. He was a beloved mentor and a giant in the field of ecology.',
      researchAreas: ['Community Ecology', 'Marine Ecology', 'Competition Theory'],
      obituary: 'Professor Joseph Connell, a foundational figure in modern ecology, passed away in 2020. His six-decade career at UC Santa Barbara produced seminal work that transformed our understanding of species interactions and community dynamics.',
      externalLinks: [
        {
          title: 'Chancellor\'s Memorial',
          url: 'https://chancellor.ucsb.edu/memos/2020-09-28-sad-news-professor-emeritus-joseph-hurd-connell'
        }
      ]
    },
    {
      id: 'adrian-wenner',
      name: 'Adrian M. Wenner',
      title: 'Professor Emeritus',
      years: '1928-2023',
      bio: 'Adrian Wenner was a distinguished behavioral ecologist whose controversial research on bee navigation challenged prevailing theories about honey bee communication.',
      legacy: 'Professor Wenner\'s meticulous research on how honey bees find food sources sparked important scientific debates about animal communication. His dedication to empirical evidence and scientific rigor, along with his mentorship of students, left a profound impact on behavioral ecology.',
      researchAreas: ['Behavioral Ecology', 'Animal Communication', 'Bee Navigation'],
      externalLinks: [
        {
          title: 'CCS Memorial',
          url: 'https://ccs.ucsb.edu/news/2023/memoriam-professor-adrian-m-wenner-ccs-provost-1989-1993-remembered-1928-2023'
        }
      ]
    }
  ]

  const selectedMem = memorials.find(m => m.id === selectedMemorial)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 text-white py-16">
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
            <p className="text-lg text-gray-700 leading-relaxed">
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
            {memorials.map((memorial) => (
              <div
                key={memorial.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => setSelectedMemorial(memorial.id)}
              >
                {memorial.photo && (
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    <img
                      src={memorial.photo}
                      alt={memorial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!memorial.photo && (
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gray-400 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                      {memorial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{memorial.name}</h3>
                  <p className="text-gray-600 font-semibold mb-1">{memorial.title}</p>
                  <p className="text-gray-500 text-sm mb-4">{memorial.years}</p>
                  <p className="text-gray-700 line-clamp-3">{memorial.bio}</p>
                  {memorial.researchAreas && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {memorial.researchAreas.map((area, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                  <button className="mt-4 text-ocean-blue font-semibold hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memorial Detail Modal */}
      {selectedMem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMemorial(null)}
        >
          <div
            className="bg-white rounded-xl max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedMem.name}</h2>
              <button
                onClick={() => setSelectedMemorial(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 font-semibold mb-1">{selectedMem.title}</p>
                <p className="text-gray-500">{selectedMem.years}</p>
              </div>

              {selectedMem.obituary && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <p className="text-gray-700 italic">{selectedMem.obituary}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Biography</h3>
                <p className="text-gray-700 leading-relaxed">{selectedMem.bio}</p>
              </div>

              {selectedMem.researchAreas && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Research Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMem.researchAreas.map((area, index) => (
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">Legacy</h3>
                <p className="text-gray-700 leading-relaxed">{selectedMem.legacy}</p>
              </div>

              {selectedMem.externalLinks && selectedMem.externalLinks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Additional Information</h3>
                  <div className="space-y-2">
                    {selectedMem.externalLinks.map((link, index) => (
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit a Memorial</h2>
            <p className="text-gray-700 mb-6">
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
