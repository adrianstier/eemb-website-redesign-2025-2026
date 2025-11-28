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
    researchInterests?: string[]
  }
}

export default function FeaturedFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/faculties?pagination[limit]=100')
        const data = await response.json()

        if (data.data && data.data.length > 0) {
          const coreTitles = ['Professor', 'Associate Professor', 'Assistant Professor', 'Distinguished Professor', 'Professor Emeritus']
          const coreFaculty = data.data.filter((f: Faculty) =>
            coreTitles.includes(f.attributes.title)
          )
          const shuffled = coreFaculty.sort(() => 0.5 - Math.random())
          setFaculty(shuffled.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching faculty:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFaculty()
  }, [])

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-8 text-center">
            Meet Our Faculty
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (faculty.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy">
              Meet Our Faculty
            </h2>
            <p className="text-gray-600 mt-1">
              25 researchers across ecology, evolution, and marine biology
            </p>
          </div>
          <Link
            href="/people"
            className="hidden md:inline-block text-ocean-blue font-semibold hover:text-ocean-teal transition-colors"
          >
            View all faculty →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {faculty.map((member) => (
            <Link
              key={member.id}
              href={`/people/faculty/${member.attributes.slug}`}
              className="group"
            >
              {/* Photo */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-ocean-deep to-ocean-blue mb-3 shadow-md">
                {member.attributes.photo_url ? (
                  <img
                    src={member.attributes.photo_url.startsWith('http')
                      ? member.attributes.photo_url
                      : `http://localhost:1337${member.attributes.photo_url}`}
                    alt={`Portrait of ${member.attributes.fullName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/40" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name and title */}
              <h3 className="font-bold text-ucsb-navy group-hover:text-ocean-blue transition-colors">
                {member.attributes.fullName}
              </h3>
              <p className="text-sm text-gray-600">
                {member.attributes.title}
              </p>
              {member.attributes.shortBio && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {member.attributes.shortBio}
                </p>
              )}
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/people"
            className="text-ocean-blue font-semibold hover:text-ocean-teal transition-colors"
          >
            View all faculty →
          </Link>
        </div>
      </div>
    </section>
  )
}
