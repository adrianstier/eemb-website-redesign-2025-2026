'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Faculty {
  id: number
  attributes: {
    fullName: string
    title: string
    shortBio: string
    slug: string
    photo_url?: string
    research_areas?: string
    researchInterests?: string[]
    labWebsite?: string
  }
}

export default function FeaturedFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        // Fetch 3 random faculty members who have short bios
        const response = await fetch('http://localhost:1337/api/faculties?pagination[limit]=100&filters[shortBio][$notNull]=true')
        const data = await response.json()

        if (data.data && data.data.length > 0) {
          // Shuffle and take 3
          const shuffled = data.data.sort(() => 0.5 - Math.random())
          setFaculty(shuffled.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching faculty:', error)
        // Set placeholder data if API is not available
        setFaculty([
          {
            id: 1,
            attributes: {
              fullName: 'Dr. Sarah Chen',
              title: 'Professor',
              shortBio: 'Research focuses on marine ecosystem dynamics and the impacts of climate change on coastal communities.',
              slug: 'sarah-chen',
              research_areas: 'marine-biology',
              researchInterests: ['Marine Ecology', 'Climate Change', 'Kelp Forests']
            }
          },
          {
            id: 2,
            attributes: {
              fullName: 'Dr. James Wilson',
              title: 'Associate Professor',
              shortBio: 'Studies evolutionary genetics and adaptation in natural populations using genomic approaches.',
              slug: 'james-wilson',
              research_areas: 'evolution',
              researchInterests: ['Population Genetics', 'Genomics', 'Adaptation']
            }
          },
          {
            id: 3,
            attributes: {
              fullName: 'Dr. Maria Rodriguez',
              title: 'Assistant Professor',
              shortBio: 'Investigates community ecology and species interactions in terrestrial ecosystems.',
              slug: 'maria-rodriguez',
              research_areas: 'ecology',
              researchInterests: ['Community Ecology', 'Species Interactions', 'Biodiversity']
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFaculty()
  }, [])

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-ocean-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
              <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Our People</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-blue mb-3 leading-tight">
              Featured Researchers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white animate-pulse h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20 bg-ocean-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
            <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Our People</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-blue mb-3 leading-tight">
            Featured Researchers
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Meet some of the faculty driving innovative research in ecology, evolution, and marine biology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faculty.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-150 border border-gray-200"
            >
              {/* Photo placeholder or actual photo */}
              <div className="h-48 bg-gradient-to-br from-ocean-blue to-ocean-teal flex items-center justify-center">
                {member.attributes.photo_url ? (
                  <img
                    src={member.attributes.photo_url.startsWith('http')
                      ? member.attributes.photo_url
                      : `http://localhost:1337${member.attributes.photo_url}`}
                    alt={member.attributes.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-ocean-blue mb-1">
                  {member.attributes.fullName}
                </h3>
                <p className="text-sm text-ocean-teal font-medium mb-3">
                  {member.attributes.title}
                </p>

                {member.attributes.shortBio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {member.attributes.shortBio}
                  </p>
                )}

                {/* Research interests tags */}
                {member.attributes.researchInterests && member.attributes.researchInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.attributes.researchInterests.slice(0, 3).map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-ocean-teal/10 text-ocean-teal rounded text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/people/faculty/${member.attributes.slug || member.id}`}
                  className="inline-flex items-center gap-1 text-ocean-teal font-semibold text-sm hover:gap-2 transition-all duration-150"
                >
                  View Profile
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/people"
            className="inline-block bg-ocean-blue text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-ocean-teal transition-colors duration-150 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2"
          >
            Meet All Faculty
          </Link>
        </div>
      </div>
    </section>
  )
}
