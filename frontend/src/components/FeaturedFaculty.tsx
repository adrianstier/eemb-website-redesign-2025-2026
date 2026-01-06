'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Faculty {
  id: number
  attributes: {
    fullName: string
    lastName: string
    title: string
    shortBio: string
    slug: string
    photo_url?: string
    researchInterests?: string[]
    research_areas?: string  // "ecology", "evolution", "marine-biology" or combinations
  }
}

// Helper to get primary research area from faculty
function getPrimaryArea(f: Faculty): 'ecology' | 'evolution' | 'marine-biology' | 'other' {
  const areas = f.attributes.research_areas?.toLowerCase() || ''
  // Check for pure areas first, then combinations
  if (areas === 'evolution') return 'evolution'
  if (areas === 'ecology') return 'ecology'
  if (areas === 'marine-biology') return 'marine-biology'
  if (areas.includes('evolution')) return 'evolution'
  if (areas.includes('ecology')) return 'ecology'
  if (areas.includes('marine-biology')) return 'marine-biology'
  return 'other'
}

// Select faculty ensuring balanced representation across Ecology, Evolution, and Marine Biology
function selectBalancedFaculty(allFaculty: Faculty[]): Faculty[] {
  const coreTitles = ['Professor', 'Associate Professor', 'Assistant Professor', 'Distinguished Professor']
  const coreFaculty = allFaculty.filter((f: Faculty) =>
    coreTitles.includes(f.attributes.title) && f.attributes.photo_url
  )

  // Group by primary research area
  const byArea: Record<string, Faculty[]> = {
    'ecology': [],
    'evolution': [],
    'marine-biology': []
  }

  coreFaculty.forEach(f => {
    const area = getPrimaryArea(f)
    if (area !== 'other' && byArea[area]) {
      byArea[area].push(f)
    }
  })

  // Shuffle each group
  Object.keys(byArea).forEach(key => {
    byArea[key] = byArea[key].sort(() => 0.5 - Math.random())
  })

  // Select to ensure representation: 2 ecology, 2 evolution, 1 marine (or adjust based on availability)
  const selected: Faculty[] = []
  const targetPerArea = { 'ecology': 2, 'evolution': 2, 'marine-biology': 1 }

  // First pass: get target number from each area
  Object.entries(targetPerArea).forEach(([area, target]) => {
    const available = byArea[area].slice(0, target)
    selected.push(...available)
    // Remove selected from pool
    byArea[area] = byArea[area].slice(target)
  })

  // If we don't have 5, fill from remaining pools
  while (selected.length < 5) {
    const remainingAreas = Object.keys(byArea).filter(a => byArea[a].length > 0)
    if (remainingAreas.length === 0) break
    const randomArea = remainingAreas[Math.floor(Math.random() * remainingAreas.length)]
    const next = byArea[randomArea].shift()
    if (next) selected.push(next)
  }

  // Final shuffle to mix the order
  return selected.sort(() => 0.5 - Math.random())
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

export default function FeaturedFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const { ref, isInView } = useInView(0.1)

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/faculties?pagination[limit]=100')
        const data = await response.json()

        if (data.data && data.data.length > 0) {
          // Use balanced selection to ensure representation across Ecology, Evolution, and Marine Biology
          const balanced = selectBalancedFaculty(data.data)
          setFaculty(balanced)
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
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-warm-200 rounded-xl w-64 mb-12" />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <div className="aspect-[4/5] bg-warm-200 rounded-3xl" />
              </div>
              <div className="lg:col-span-7 grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="aspect-square bg-warm-200 rounded-2xl mb-4" />
                    <div className="h-5 bg-warm-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-warm-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (faculty.length === 0) return null

  const featured = faculty[0]
  const others = faculty.slice(1, 5)

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-ocean-teal/[0.02] rounded-full blur-3xl" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-ocean-blue to-transparent" />
              <span className="text-ocean-blue text-sm font-semibold tracking-[0.2em] uppercase">
                Our People
              </span>
            </div>
            <h2 className="font-heading text-display-sm font-bold text-ocean-deep">
              Faculty driving discovery
            </h2>
          </div>
          <Link
            href="/people"
            className="group inline-flex items-center gap-3 text-ocean-blue font-semibold hover:gap-4 transition-all duration-300"
          >
            View all 25 faculty
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Asymmetric grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Featured faculty - larger card */}
          <div className={`lg:col-span-5 transition-all duration-1000 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <Link href={`/people/faculty/${featured.attributes.slug}`} className="group block">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-warm-100 shadow-warm-lg">
                {featured.attributes.photo_url ? (
                  <Image
                    src={featured.attributes.photo_url.startsWith('http')
                      ? featured.attributes.photo_url
                      : `http://localhost:1337${featured.attributes.photo_url}`}
                    alt={`Portrait of ${featured.attributes.fullName}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-ocean-deep to-ocean-blue flex items-center justify-center">
                    <span className="text-7xl font-heading font-bold text-white/20">
                      {featured.attributes.fullName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-heading text-2xl font-bold text-white mb-2">
                    {featured.attributes.fullName}
                  </h3>
                  <p className="text-white/70 mb-3">{featured.attributes.title}</p>
                  {featured.attributes.shortBio && (
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                      {featured.attributes.shortBio}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Other faculty - 2x2 grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-6">
              {others.map((member, index) => (
                <Link
                  key={member.id}
                  href={`/people/faculty/${member.attributes.slug}`}
                  className={`group transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-warm-100 shadow-warm-md group-hover:shadow-warm-xl transition-all duration-500">
                    {member.attributes.photo_url ? (
                      <Image
                        src={member.attributes.photo_url.startsWith('http')
                          ? member.attributes.photo_url
                          : `http://localhost:1337${member.attributes.photo_url}`}
                        alt={`Portrait of ${member.attributes.fullName}`}
                        fill
                        className="object-cover transition-transform duration-700 ease-spring group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ocean-deep to-ocean-blue flex items-center justify-center">
                        <span className="text-4xl font-heading font-bold text-white/20">
                          {member.attributes.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-ocean-deep/0 group-hover:bg-ocean-deep/20 transition-colors duration-500" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-heading font-bold text-ocean-deep group-hover:text-ocean-blue transition-colors leading-tight">
                      {member.attributes.fullName}
                    </h3>
                    <p className="text-sm text-warm-500 mt-1">{member.attributes.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
