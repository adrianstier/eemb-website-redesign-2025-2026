'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Faculty {
  id: number
  attributes: {
    firstName: string
    lastName: string
    fullName: string
    slug: string
    title: string
    email: string
    phone: string
    office: string
    bio: string
    shortBio: string
    researchInterests: string[]
    active: boolean
    department: string
    labWebsite?: string
    googleScholar?: string
    orcid?: string
    photo_url?: string
  }
}

export default function FacultyProfilePage() {
  const params = useParams()
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchFacultyMember(params.slug as string)
    }
  }, [params.slug])

  const fetchFacultyMember = async (slug: string) => {
    try {
      const response = await fetch(`http://localhost:1337/api/faculties?filters[slug][$eq]=${slug}`)
      const data = await response.json()
      if (data.data && data.data.length > 0) {
        setFaculty(data.data[0])
      } else {
        setError(true)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching faculty member:', error)
      setError(true)
      setLoading(false)
    }
  }

  // Loading State - Skeleton Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Skeleton */}
        <div className="bg-gradient-to-br from-ocean-deep via-ocean-mid to-ocean-light py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="h-10 w-48 bg-white/20 rounded mb-6 animate-pulse"></div>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-white/20 animate-pulse flex-shrink-0"></div>
              <div className="space-y-3 flex-1">
                <div className="h-10 bg-white/20 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded w-1/2 animate-pulse"></div>
                <div className="h-5 bg-white/20 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Content Skeleton */}
        <div className="container mx-auto px-4 max-w-6xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !faculty) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Faculty Member Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the faculty member you're looking for. They may have been moved or removed.
          </p>
          <Link
            href="/people"
            className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-teal text-white rounded-lg hover:bg-ocean-blue transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to People Directory
          </Link>
        </div>
      </div>
    )
  }

  const hasResearchLinks = faculty.attributes.labWebsite || faculty.attributes.googleScholar || faculty.attributes.orcid

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Improved spacing and hierarchy */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-mid to-ocean-light text-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Link - Improved accessibility and hit area */}
          <Link
            href="/people"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-150 mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-deep rounded px-2 py-1 -ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Directory</span>
          </Link>

          {/* Profile Header - Responsive layout */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Image - Optimized sizing */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
              {faculty.attributes.photo_url ? (
                <img
                  src={faculty.attributes.photo_url.startsWith('http')
                    ? faculty.attributes.photo_url
                    : `http://localhost:1337${faculty.attributes.photo_url}`}
                  alt={faculty.attributes.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<span class="text-white text-4xl font-bold">${faculty.attributes.firstName[0]}${faculty.attributes.lastName?.[0] || ''}</span>`
                    }
                  }}
                />
              ) : (
                <span className="text-white text-4xl font-bold">
                  {faculty.attributes.firstName[0]}{faculty.attributes.lastName?.[0] || ''}
                </span>
              )}
            </div>

            {/* Profile Info - Improved typography */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
                {faculty.attributes.fullName}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium mb-1">
                {faculty.attributes.title}
              </p>
              <p className="text-base md:text-lg text-white/80">
                Department of {faculty.attributes.department}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Improved spacing and grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Sidebar - Contact Info - Improved card design */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {/* Email - Improved layout and accessibility */}
                  {faculty.attributes.email && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-light/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                        <a
                          href={`mailto:${faculty.attributes.email}`}
                          className="text-ocean-teal hover:text-ocean-deep hover:underline break-words font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2 rounded"
                        >
                          {faculty.attributes.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {faculty.attributes.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-light/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                        <a
                          href={`tel:${faculty.attributes.phone}`}
                          className="text-gray-700 hover:text-ocean-teal font-medium transition-colors duration-150"
                        >
                          {faculty.attributes.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Office */}
                  {faculty.attributes.office && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-light/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Office</p>
                        <p className="text-gray-700 font-medium">{faculty.attributes.office}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Research Links - Improved button design */}
                {hasResearchLinks && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                      Research Links
                    </h3>
                    <div className="space-y-2">
                      {faculty.attributes.labWebsite && (
                        <a
                          href={faculty.attributes.labWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2"
                        >
                          <div className="w-9 h-9 rounded-lg bg-ocean-light/10 flex items-center justify-center group-hover:bg-ocean-light/20 transition-colors flex-shrink-0">
                            <svg className="w-5 h-5 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-ocean-teal transition-colors">Lab Website</span>
                        </a>
                      )}

                      {faculty.attributes.googleScholar && (
                        <a
                          href={faculty.attributes.googleScholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2"
                        >
                          <div className="w-9 h-9 rounded-lg bg-ocean-light/10 flex items-center justify-center group-hover:bg-ocean-light/20 transition-colors flex-shrink-0">
                            <svg className="w-5 h-5 text-ocean-teal" fill="currentColor" viewBox="0 0 512 512">
                              <path d="M390.9 298.5c0 0 0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64C405.3 445.1 338.5 512 256 512s-149.3-66.9-149.3-149.3c0-22.9 5.2-44.6 14.4-64h0c1.7-3.6 3.6-7.2 5.6-10.7c4.4-7.6 9.4-14.7 15-21.3c27.4-32.6 68.5-53.3 114.4-53.3c33.6 0 64.6 11.1 89.6 29.9c9.1 6.9 17.4 14.7 24.8 23.5c5.6 6.6 10.6 13.8 15 21.3c2 3.4 3.8 7 5.5 10.5zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4L0 202.7 256 0 512 202.7l-94.7 77.1z"/>
                            </svg>
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-ocean-teal transition-colors">Google Scholar</span>
                        </a>
                      )}

                      {faculty.attributes.orcid && (
                        <a
                          href={`https://orcid.org/${faculty.attributes.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2"
                        >
                          <div className="w-9 h-9 rounded-lg bg-ocean-light/10 flex items-center justify-center group-hover:bg-ocean-light/20 transition-colors flex-shrink-0">
                            <svg className="w-5 h-5 text-ocean-teal" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"/>
                              <g fill="white">
                                <path d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z"/>
                                <path d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z"/>
                                <path d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1C84.2,46.7,88.7,51.3,88.7,56.8z"/>
                              </g>
                            </svg>
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-ocean-teal transition-colors">ORCID iD</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content - Improved content hierarchy */}
            <div className="lg:col-span-2 space-y-6">

              {/* Biography - Prioritized with better typography */}
              <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Biography</h2>
                <div className="prose prose-gray max-w-none">
                  {faculty.attributes.bio ? (
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {faculty.attributes.bio}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 italic">Biography coming soon</p>
                    </div>
                  )}
                </div>
              </article>

              {/* Research Interests - Improved design */}
              {faculty.attributes.researchInterests && faculty.attributes.researchInterests.length > 0 && (
                <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-ocean-teal to-ocean-blue p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Research Focus
                    </h2>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap gap-2">
                      {faculty.attributes.researchInterests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 bg-ocean-light/10 border border-ocean-teal/20 text-ocean-teal rounded-full text-sm font-medium hover:bg-ocean-light/20 transition-colors duration-150"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
