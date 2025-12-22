'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

interface Faculty {
  id: number
  attributes: {
    firstName: string
    lastName: string
    fullName: string
    title?: string
    department?: string
    email?: string
    phone?: string
    office?: string
    researchInterests?: string[]
    slug: string
    profileImage?: any
  }
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArea, setSelectedArea] = useState('')

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/faculties?populate=*')
      const data = await response.json()
      setFaculty(data.data || [])
    } catch (error) {
      console.error('Error fetching faculty:', error)
      // Set placeholder data
      setFaculty([
        {
          id: 1,
          attributes: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            fullName: 'Sarah Johnson',
            title: 'Professor',
            department: 'Marine Biology',
            email: 'sjohnson@ucsb.edu',
            phone: '(805) 893-1234',
            office: 'Life Sciences Building 2001',
            researchInterests: ['Climate Change', 'Ocean Acidification', 'Coral Reefs'],
            slug: 'sarah-johnson',
          }
        },
        {
          id: 2,
          attributes: {
            firstName: 'Michael',
            lastName: 'Chen',
            fullName: 'Michael Chen',
            title: 'Associate Professor',
            department: 'Evolutionary Biology',
            email: 'mchen@ucsb.edu',
            phone: '(805) 893-5678',
            office: 'Noble Hall 3045',
            researchInterests: ['Population Genetics', 'Speciation', 'Phylogenetics'],
            slug: 'michael-chen',
          }
        },
        {
          id: 3,
          attributes: {
            firstName: 'Emily',
            lastName: 'Rodriguez',
            fullName: 'Emily Rodriguez',
            title: 'Assistant Professor',
            department: 'Ecology',
            email: 'erodriguez@ucsb.edu',
            phone: '(805) 893-9012',
            office: 'Marine Science Institute 2015',
            researchInterests: ['Conservation Biology', 'Ecosystem Restoration', 'Biodiversity'],
            slug: 'emily-rodriguez',
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredFaculty = faculty.filter(person => {
    const matchesSearch = person.attributes.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.attributes.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          person.attributes.researchInterests?.some(interest =>
                            interest.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesArea = !selectedArea ||
                        person.attributes.department === selectedArea ||
                        person.attributes.researchInterests?.includes(selectedArea)

    return matchesSearch && matchesArea
  })

  const researchAreas = [
    'Marine Biology',
    'Evolutionary Biology',
    'Ecology',
    'Conservation Biology',
    'Climate Science',
    'Microbiology'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Faculty Directory</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl">
              Meet our world-class researchers and educators who are advancing our understanding
              of ecology, evolution, and marine biology.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, department, or research interests..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ucsb-gold focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ucsb-gold focus:border-transparent"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="">All Research Areas</option>
              {researchAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 animate-pulse h-96 rounded-lg"></div>
              ))}
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No faculty members found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFaculty.map(person => (
                <div key={person.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-ucsb-gold to-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {person.attributes.firstName[0]}{person.attributes.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-ucsb-navy">
                          <Link href={`/faculty/${person.attributes.slug}`} className="hover:text-ucsb-gold transition">
                            {person.attributes.fullName}
                          </Link>
                        </h3>
                        <p className="text-gray-600">{person.attributes.title}</p>
                        {person.attributes.department && (
                          <p className="text-sm text-gray-500">{person.attributes.department}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {person.attributes.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${person.attributes.email}`} className="text-ucsb-navy hover:text-ucsb-gold">
                            {person.attributes.email}
                          </a>
                        </div>
                      )}
                      {person.attributes.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{person.attributes.phone}</span>
                        </div>
                      )}
                      {person.attributes.office && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{person.attributes.office}</span>
                        </div>
                      )}
                    </div>

                    {person.attributes.researchInterests && person.attributes.researchInterests.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Research Interests:</p>
                        <div className="flex flex-wrap gap-2">
                          {person.attributes.researchInterests.slice(0, 3).map((interest, idx) => (
                            <span key={idx} className="text-xs bg-ucsb-light-gray text-ucsb-dark-gray px-2 py-1 rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link
                      href={`/faculty/${person.attributes.slug}`}
                      className="inline-block mt-4 text-sm text-ucsb-navy font-semibold hover:text-ucsb-gold transition"
                    >
                      View Full Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{faculty.length || '50+'}</div>
              <div className="text-gray-300">Faculty Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-gray-300">Research Areas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$25M+</div>
              <div className="text-gray-300">Annual Research Funding</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-gray-300">Publications/Year</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}