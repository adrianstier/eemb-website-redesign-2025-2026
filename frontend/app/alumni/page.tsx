'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AlumniProfile {
  id: number
  attributes: {
    firstName: string
    lastName: string
    fullName: string
    graduationYear?: number
    degree?: string
    major?: string
    currentPosition?: string
    currentEmployer?: string
    location?: string
    bio?: string
    linkedin?: string
    slug: string
  }
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedDegree, setSelectedDegree] = useState('')

  useEffect(() => {
    fetchAlumni()
  }, [])

  const fetchAlumni = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/alumni-profiles?populate=*')
      const data = await response.json()
      setAlumni(data.data || [])
    } catch (error) {
      console.error('Error fetching alumni:', error)
      // Set placeholder data
      setAlumni([
        {
          id: 1,
          attributes: {
            firstName: 'Jessica',
            lastName: 'Martinez',
            fullName: 'Jessica Martinez',
            graduationYear: 2015,
            degree: 'PhD',
            major: 'Marine Biology',
            currentPosition: 'Senior Research Scientist',
            currentEmployer: 'NOAA',
            location: 'Silver Spring, MD',
            bio: 'Leading climate change research at NOAA',
            linkedin: 'linkedin.com/in/jmartinez',
            slug: 'jessica-martinez',
          }
        },
        {
          id: 2,
          attributes: {
            firstName: 'David',
            lastName: 'Park',
            fullName: 'David Park',
            graduationYear: 2018,
            degree: 'MS',
            major: 'Ecology',
            currentPosition: 'Conservation Program Manager',
            currentEmployer: 'WWF',
            location: 'San Francisco, CA',
            bio: 'Working on global conservation initiatives',
            linkedin: 'linkedin.com/in/dpark',
            slug: 'david-park',
          }
        },
        {
          id: 3,
          attributes: {
            firstName: 'Amanda',
            lastName: 'Thompson',
            fullName: 'Amanda Thompson',
            graduationYear: 2020,
            degree: 'PhD',
            major: 'Evolutionary Biology',
            currentPosition: 'Assistant Professor',
            currentEmployer: 'Stanford University',
            location: 'Stanford, CA',
            bio: 'Teaching and researching evolutionary genetics',
            linkedin: 'linkedin.com/in/athompson',
            slug: 'amanda-thompson',
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = person.attributes.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.attributes.currentEmployer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.attributes.currentPosition?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesYear = !selectedYear || person.attributes.graduationYear?.toString() === selectedYear
    const matchesDegree = !selectedDegree || person.attributes.degree === selectedDegree

    return matchesSearch && matchesYear && matchesDegree
  })

  // Generate year options
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Alumni Network</h1>
            <p className="text-lg md:text-xl text-white/90">
              Connect with our global community of EEMB graduates making an impact around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-ucsb-navy">5,000+</div>
              <div className="text-gray-600">Alumni Worldwide</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ucsb-navy">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ucsb-navy">85%</div>
              <div className="text-gray-600">Employment Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ucsb-navy">$95K</div>
              <div className="text-gray-600">Average Starting Salary</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, employer, or position..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ucsb-gold focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ucsb-gold focus:border-transparent"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ucsb-gold focus:border-transparent"
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
            >
              <option value="">All Degrees</option>
              <option value="BS">Bachelor of Science</option>
              <option value="MS">Master of Science</option>
              <option value="PhD">Doctor of Philosophy</option>
            </select>
          </div>
        </div>
      </section>

      {/* Alumni Directory */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
              ))}
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No alumni found matching your search criteria.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600">
                Showing {filteredAlumni.length} alumni profiles
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map(person => (
                  <div key={person.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-ucsb-aqua to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                        {person.attributes.firstName[0]}{person.attributes.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-ucsb-navy">
                          {person.attributes.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {person.attributes.degree} {person.attributes.major} '{person.attributes.graduationYear?.toString().slice(-2)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {person.attributes.currentPosition && (
                        <div className="text-sm">
                          <span className="font-semibold">{person.attributes.currentPosition}</span>
                          {person.attributes.currentEmployer && (
                            <span className="text-gray-600"> at {person.attributes.currentEmployer}</span>
                          )}
                        </div>
                      )}
                      {person.attributes.location && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          📍 {person.attributes.location}
                        </div>
                      )}
                      {person.attributes.bio && (
                        <p className="text-sm text-gray-700 italic mt-3">
                          "{person.attributes.bio}"
                        </p>
                      )}
                    </div>

                    {person.attributes.linkedin && (
                      <a
                        href={`https://${person.attributes.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-ucsb-navy hover:text-ucsb-gold transition"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Connect on LinkedIn
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Connected</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our alumni network to access exclusive events, mentorship opportunities,
            and career resources.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
              Update Your Profile
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition">
              Join Alumni Directory
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-ucsb-navy transition">
              Give Back
            </button>
          </div>
        </div>
      </section>

      {/* Alumni Spotlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Alumni Spotlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <article key={i} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="h-48 bg-gradient-to-br from-ucsb-moss to-green-400"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-ucsb-navy mb-2">
                    Featured Alumni Story {i}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Read about the amazing journey and achievements of our distinguished alumni.
                  </p>
                  <Link href={`/alumni/spotlight-${i}`} className="text-ucsb-navy font-semibold hover:text-ucsb-gold transition">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}