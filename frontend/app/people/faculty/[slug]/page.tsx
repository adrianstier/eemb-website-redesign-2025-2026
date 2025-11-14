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
            <div className="w-40 h-40 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center">
              {faculty.attributes.photo_url ? (
                <img
                  src={`http://localhost:1337${faculty.attributes.photo_url}`}
                  alt={faculty.attributes.fullName}
                  className="w-full h-full object-cover"
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>

                {faculty.attributes.email && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Email</p>
                    <a href={`mailto:${faculty.attributes.email}`} className="text-ocean-mid hover:underline break-all">
                      {faculty.attributes.email}
                    </a>
                  </div>
                )}

                {faculty.attributes.phone && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Phone</p>
                    <p className="text-gray-600">{faculty.attributes.phone}</p>
                  </div>
                )}

                {faculty.attributes.office && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Office</p>
                    <p className="text-gray-600">{faculty.attributes.office}</p>
                  </div>
                )}

                {/* External Links */}
                {(faculty.attributes.labWebsite || faculty.attributes.googleScholar || faculty.attributes.orcid) && (
                  <>
                    <hr className="my-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">External Links</h3>
                    <div className="space-y-2">
                      {faculty.attributes.labWebsite && (
                        <a
                          href={faculty.attributes.labWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-ocean-mid hover:underline"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          Lab Website
                        </a>
                      )}
                      {faculty.attributes.googleScholar && (
                        <a
                          href={faculty.attributes.googleScholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-ocean-mid hover:underline"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Google Scholar
                        </a>
                      )}
                      {faculty.attributes.orcid && (
                        <a
                          href={`https://orcid.org/${faculty.attributes.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-ocean-mid hover:underline"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 15.5h-1v-11h1v11zm-.5-12.5c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1zm5.5 12.5h-1.5l-2-11h1.2l1.3 7.5 1.3-7.5h1.2l-2 11z"/>
                          </svg>
                          ORCID
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Biography */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Biography</h2>
                <div className="prose prose-gray max-w-none">
                  {faculty.attributes.bio ? (
                    <p className="text-gray-700 whitespace-pre-line">{faculty.attributes.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">Biography coming soon...</p>
                  )}
                </div>
              </div>

              {/* Research Interests */}
              {faculty.attributes.researchInterests && faculty.attributes.researchInterests.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Research Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {faculty.attributes.researchInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-ocean-light bg-opacity-20 text-ocean-deep rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}