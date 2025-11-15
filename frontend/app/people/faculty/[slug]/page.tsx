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
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching faculty member:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-mid"></div>
      </div>
    )
  }

  if (!faculty) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Faculty Member Not Found</h1>
        <Link href="/people" className="text-ocean-mid hover:underline">
          ← Back to People Directory
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-mid to-ocean-light text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/people" className="inline-flex items-center text-white hover:text-gray-200 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to People Directory
          </Link>
          <div className="flex items-center gap-8">
            {/* Profile Image */}
            <div className="w-40 h-40 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center border-4 border-white shadow-xl">
              {faculty.attributes.photo_url ? (
                <img
                  src={faculty.attributes.photo_url}
                  alt={faculty.attributes.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-white text-5xl font-bold">${faculty.attributes.firstName[0]}${faculty.attributes.lastName?.[0] || ''}</span>`;
                  }}
                />
              ) : (
                <span className="text-white text-5xl font-bold">
                  {faculty.attributes.firstName[0]}{faculty.attributes.lastName?.[0] || ''}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {faculty.attributes.fullName}
              </h1>
              <p className="text-xl text-gray-100">
                {faculty.attributes.title}
              </p>
              <p className="text-lg text-gray-200">
                Department of {faculty.attributes.department}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </h2>

                {faculty.attributes.email && (
                  <div className="mb-5 pb-5 border-b border-gray-200">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 mt-0.5 text-ocean-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                        <a href={`mailto:${faculty.attributes.email}`} className="text-ocean-teal hover:text-ocean-deep hover:underline break-all font-medium">
                          {faculty.attributes.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {faculty.attributes.phone && (
                  <div className="mb-5 pb-5 border-b border-gray-200">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 mt-0.5 text-ocean-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                        <p className="text-gray-700 font-medium">{faculty.attributes.phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {faculty.attributes.office && (
                  <div className="mb-5 pb-5 border-b border-gray-200">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 mt-0.5 text-ocean-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Office</p>
                        <p className="text-gray-700 font-medium">{faculty.attributes.office}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* External Links */}
                {(faculty.attributes.labWebsite || faculty.attributes.googleScholar || faculty.attributes.orcid) && (
                  <div className="pt-2">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Research Links</h3>
                    <div className="space-y-3">
                      {faculty.attributes.labWebsite && (
                        <a
                          href={faculty.attributes.labWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-ocean-teal hover:text-ocean-deep transition group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-ocean-light bg-opacity-20 flex items-center justify-center mr-3 group-hover:bg-opacity-30 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </div>
                          <span className="font-medium">Lab Website</span>
                        </a>
                      )}
                      {faculty.attributes.googleScholar && (
                        <a
                          href={faculty.attributes.googleScholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-ocean-teal hover:text-ocean-deep transition group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-ocean-light bg-opacity-20 flex items-center justify-center mr-3 group-hover:bg-opacity-30 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <span className="font-medium">Google Scholar</span>
                        </a>
                      )}
                      {faculty.attributes.orcid && (
                        <a
                          href={`https://orcid.org/${faculty.attributes.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-ocean-teal hover:text-ocean-deep transition group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-ocean-light bg-opacity-20 flex items-center justify-center mr-3 group-hover:bg-opacity-30 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 15.5h-1v-11h1v11zm-.5-12.5c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1zm5.5 12.5h-1.5l-2-11h1.2l1.3 7.5 1.3-7.5h1.2l-2 11z"/>
                            </svg>
                          </div>
                          <span className="font-medium">ORCID</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Research Interests - Featured prominently at top */}
              {faculty.attributes.researchInterests && faculty.attributes.researchInterests.length > 0 && (
                <div className="bg-gradient-to-br from-ocean-teal to-ocean-blue rounded-xl shadow-2xl p-8 mb-6 text-white">
                  <div className="flex items-center mb-4">
                    <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <h2 className="text-3xl font-bold">Research Focus</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {faculty.attributes.researchInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-5 py-2.5 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white rounded-full text-lg font-medium hover:bg-opacity-30 transition"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Biography */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-7 h-7 mr-2 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Biography
                </h2>
                <div className="prose prose-lg prose-gray max-w-none">
                  {faculty.attributes.bio ? (
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{faculty.attributes.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">Biography coming soon...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}