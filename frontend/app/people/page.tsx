'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface Person {
  id: number
  attributes: {
    firstName: string
    lastName: string
    fullName: string
    slug?: string
    title?: string
    email: string
    phone?: string
    office?: string
    bio?: string
    shortBio?: string
    researchInterests?: string[]
    degreeProgram?: string
    active: boolean
    department?: string
    photo_url?: string
  }
}

type CategoryTab = 'all' | 'faculty' | 'adjunct' | 'emeriti' | 'lecturers' | 'staff' | 'students'
type SortOption = 'name-asc' | 'name-desc' | 'recent'

export default function PeoplePage() {
  const [faculty, setFaculty] = useState<Person[]>([])
  const [staff, setStaff] = useState<Person[]>([])
  const [students, setStudents] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchAllPeople()
  }, [])

  const fetchAllPeople = async () => {
    try {
      setLoading(true)
      setError(null)

      const [facultyRes, staffRes, studentsRes] = await Promise.all([
        fetch('http://localhost:1337/api/faculties?pagination[limit]=200'),
        fetch('http://localhost:1337/api/staff-members?pagination[limit]=100'),
        fetch('http://localhost:1337/api/graduate-students?pagination[limit]=100')
      ])

      if (!facultyRes.ok || !staffRes.ok || !studentsRes.ok) {
        throw new Error('Failed to fetch people data')
      }

      const [facultyData, staffData, studentsData] = await Promise.all([
        facultyRes.json(),
        staffRes.json(),
        studentsRes.json()
      ])

      setFaculty(facultyData.data || [])
      setStaff(staffData.data || [])
      setStudents(studentsData.data || [])
    } catch (error) {
      console.error('Error fetching people:', error)
      setError('Failed to load people data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentPeople = () => {
    if (activeCategory === 'all') {
      return [...faculty, ...staff, ...students]
    }

    switch (activeCategory) {
      case 'faculty':
        // Regular faculty: Professor, Associate Professor, Assistant Professor, Distinguished Professor
        return faculty.filter(person => {
          const title = person.attributes.title?.toLowerCase() || ''
          return !title.includes('emeritus') &&
                 !title.includes('lecturer') &&
                 !title.includes('adjunct') &&
                 (title.includes('professor') || title.includes('research'))
        })
      case 'adjunct':
        // Adjunct faculty - check title contains adjunct
        return faculty.filter(person =>
          person.attributes.title?.toLowerCase().includes('adjunct')
        )
      case 'emeriti':
        // Emeriti faculty - check title contains emeritus
        return faculty.filter(person =>
          person.attributes.title?.toLowerCase().includes('emeritus')
        )
      case 'lecturers':
        // Lecturers and Teaching Professors
        return faculty.filter(person => {
          const title = person.attributes.title?.toLowerCase() || ''
          return title.includes('lecturer') || title.includes('teaching professor')
        })
      case 'staff':
        return staff
      case 'students':
        return students
      default:
        return []
    }
  }

  // Memoized filtered and sorted people
  const filteredAndSortedPeople = useMemo(() => {
    let people = getCurrentPeople()

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase().trim()
      people = people.filter(person => {
        const fullName = person.attributes.fullName?.toLowerCase() || ''
        const email = person.attributes.email?.toLowerCase() || ''
        const title = person.attributes.title?.toLowerCase() || ''
        const research = person.attributes.researchInterests?.join(' ').toLowerCase() || ''
        const degreeProgram = person.attributes.degreeProgram?.toLowerCase() || ''

        return fullName.includes(search) ||
               email.includes(search) ||
               title.includes(search) ||
               research.includes(search) ||
               degreeProgram.includes(search)
      })
    }

    // Sort
    switch (sortOption) {
      case 'name-asc':
        people.sort((a, b) =>
          a.attributes.lastName.localeCompare(b.attributes.lastName)
        )
        break
      case 'name-desc':
        people.sort((a, b) =>
          b.attributes.lastName.localeCompare(a.attributes.lastName)
        )
        break
      case 'recent':
        people.sort((a, b) => b.id - a.id)
        break
    }

    return people
  }, [searchTerm, sortOption, faculty, staff, students, activeCategory])

  const handleImageError = (personId: number) => {
    setImageErrors(prev => new Set(prev).add(personId))
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const getInitials = (person: Person) => {
    const first = person.attributes.firstName?.[0] || ''
    const last = person.attributes.lastName?.[0] || ''
    return (first + last).toUpperCase()
  }

  const renderPersonCard = (person: Person) => {
    const hasImageError = imageErrors.has(person.id)

    return (
      <article
        key={person.id}
        className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        role="article"
        aria-label={`${person.attributes.fullName} profile`}
      >
        <div className="p-6">
          {/* Person Image */}
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-ocean-light via-ocean-teal to-ocean-mid shadow-lg">
            {person.attributes.photo_url && !hasImageError ? (
              <img
                src={person.attributes.photo_url.startsWith('http')
                  ? person.attributes.photo_url
                  : `http://localhost:1337${person.attributes.photo_url}`}
                alt={`${person.attributes.fullName} profile photo`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => handleImageError(person.id)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold drop-shadow-lg">
                  {getInitials(person)}
                </span>
              </div>
            )}
          </div>

          {/* Person Info */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-ocean-deep transition">
              {person.attributes.fullName}
            </h3>

            {person.attributes.title && (
              <p className="text-sm text-ocean-mid font-medium mb-3 px-3 py-1 bg-ocean-50 rounded-full inline-block">
                {person.attributes.title}
              </p>
            )}

            {person.attributes.degreeProgram && (
              <p className="text-sm text-ocean-mid font-medium mb-3 px-3 py-1 bg-ocean-50 rounded-full inline-block">
                {person.attributes.degreeProgram} Student
              </p>
            )}

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-600 mb-4 mt-4">
              {person.attributes.email && (
                <div className="flex items-center justify-center gap-2 group">
                  <svg className="w-4 h-4 flex-shrink-0 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href={`mailto:${person.attributes.email}`}
                    className="hover:text-ocean-deep hover:underline transition break-all"
                    aria-label={`Email ${person.attributes.fullName}`}
                  >
                    {person.attributes.email}
                  </a>
                </div>
              )}
              {person.attributes.phone && (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${person.attributes.phone}`} className="hover:text-ocean-deep hover:underline transition">
                    {person.attributes.phone}
                  </a>
                </div>
              )}
              {person.attributes.office && (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{person.attributes.office}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {person.attributes.shortBio && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 text-left px-2 leading-relaxed">
                {person.attributes.shortBio}
              </p>
            )}

            {/* Research Interests */}
            {person.attributes.researchInterests && person.attributes.researchInterests.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Research Interests</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {person.attributes.researchInterests.slice(0, 4).map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-ocean-light to-ocean-teal bg-opacity-10 text-ocean-deep text-xs rounded-full font-medium border border-ocean-200 hover:border-ocean-teal transition"
                    >
                      {interest}
                    </span>
                  ))}
                  {person.attributes.researchInterests.length > 4 && (
                    <span className="px-3 py-1 text-ocean-mid text-xs rounded-full font-medium">
                      +{person.attributes.researchInterests.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* View Profile Button - Only for faculty with slugs */}
            {['all', 'faculty', 'adjunct', 'emeriti', 'lecturers'].includes(activeCategory) && person.attributes.slug && (
              <Link
                href={`/people/faculty/${person.attributes.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-ocean-mid to-ocean-deep text-white rounded-lg hover:from-ocean-deep hover:to-ocean-blue transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                aria-label={`View full profile of ${person.attributes.fullName}`}
              >
                <span>View Full Profile</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </article>
    )
  }

  const renderSkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mx-auto"></div>
        </div>
      </div>
    </div>
  )

  const getCategoryCount = (category: CategoryTab) => {
    switch (category) {
      case 'all':
        return faculty.length + staff.length + students.length
      case 'faculty':
        // Count regular faculty (excluding adjunct, emeriti, lecturers)
        return faculty.filter(person => {
          const title = person.attributes.title?.toLowerCase() || ''
          return !title.includes('emeritus') &&
                 !title.includes('lecturer') &&
                 !title.includes('adjunct') &&
                 (title.includes('professor') || title.includes('research'))
        }).length
      case 'adjunct':
        return faculty.filter(person =>
          person.attributes.title?.toLowerCase().includes('adjunct')
        ).length
      case 'emeriti':
        return faculty.filter(person =>
          person.attributes.title?.toLowerCase().includes('emeritus')
        ).length
      case 'lecturers':
        return faculty.filter(person => {
          const title = person.attributes.title?.toLowerCase() || ''
          return title.includes('lecturer') || title.includes('teaching professor')
        }).length
      case 'staff':
        return staff.length
      case 'students':
        return students.length
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full border border-white border-opacity-30">
              <p className="text-sm font-semibold tracking-wide uppercase">Meet Our Community</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Our People</h1>
            <p className="text-xl md:text-2xl text-white text-opacity-90 leading-relaxed max-w-3xl mx-auto">
              Meet the faculty, staff, and students who are leading the way in ecology, evolution, and marine biology research.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs & Controls */}
      <section className="bg-white shadow-md sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between py-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="People categories">
              {([
                { key: 'all', label: 'Full Directory' },
                { key: 'faculty', label: 'Faculty' },
                { key: 'adjunct', label: 'Adjunct' },
                { key: 'emeriti', label: 'Emeriti' },
                { key: 'lecturers', label: 'Lecturers' },
                { key: 'staff', label: 'Staff' },
                { key: 'students', label: 'Students' }
              ] as { key: CategoryTab; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveCategory(key)
                    setSearchTerm('')
                  }}
                  role="tab"
                  aria-selected={activeCategory === key}
                  aria-controls={`${key}-panel`}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                    activeCategory === key
                      ? 'bg-gradient-to-r from-ocean-teal to-ocean-blue text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {label} ({getCategoryCount(key)})
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-initial lg:min-w-[400px]">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search by name, email, or research area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-ocean-mid focus:ring-2 focus:ring-ocean-light w-full transition"
                  aria-label="Search people"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-ocean-mid focus:ring-2 focus:ring-ocean-light bg-white transition"
                aria-label="Sort people"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* People Grid */}
      <section className="py-12" id={`${activeCategory}-panel`} role="tabpanel">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-ocean-light border-t-ocean-deep mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading people...</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>{renderSkeletonCard()}</div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load People</h3>
                <p className="text-red-700 mb-6">{error}</p>
                <button
                  onClick={fetchAllPeople}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Info */}
              <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  {activeCategory === 'all' && (
                    <p className="text-gray-700 font-medium">
                      Showing all {filteredAndSortedPeople.length} {filteredAndSortedPeople.length === 1 ? 'person' : 'people'}
                      {searchTerm && <span className="text-ocean-deep"> matching "{searchTerm}"</span>}
                    </p>
                  )}
                  {activeCategory === 'faculty' && (
                    <div className="space-y-1">
                      <p className="text-gray-700 font-medium">
                        {filteredAndSortedPeople.length} {filteredAndSortedPeople.length === 1 ? 'faculty member' : 'faculty members'}
                        {searchTerm && <span className="text-ocean-deep"> matching "{searchTerm}"</span>}
                      </p>
                      <p className="text-gray-600 text-sm max-w-2xl">
                        Our faculty members are internationally recognized researchers and educators in ecology, evolution, and marine biology.
                      </p>
                    </div>
                  )}
                  {activeCategory === 'adjunct' && (
                    <div className="space-y-1">
                      <p className="text-gray-700 font-medium">
                        {filteredAndSortedPeople.length} adjunct {filteredAndSortedPeople.length === 1 ? 'faculty member' : 'faculty members'}
                        {searchTerm && <span className="text-ocean-deep"> matching "{searchTerm}"</span>}
                      </p>
                      <p className="text-gray-600 text-sm max-w-2xl">
                        Adjunct faculty contribute expertise and teaching to our department.
                      </p>
                    </div>
                  )}
                  {activeCategory === 'emeriti' && (
                    <div className="space-y-1">
                      <p className="text-gray-700 font-medium">
                        {filteredAndSortedPeople.length} {filteredAndSortedPeople.length === 1 ? 'emeritus professor' : 'emeriti professors'}
                        {searchTerm && <span className="text-ocean-deep"> matching "{searchTerm}"</span>}
                      </p>
                      <p className="text-gray-600 text-sm max-w-2xl">
                        Our emeriti faculty have made lasting contributions to the department and continue to inspire future generations.
                      </p>
                    </div>
                  )}
                  {activeCategory === 'lecturers' && (
                    <div className="space-y-1">
                      <p className="text-gray-700 font-medium">
                        {filteredAndSortedPeople.length} {filteredAndSortedPeople.length === 1 ? 'lecturer' : 'lecturers'}
                        {searchTerm && <span className="text-ocean-deep"> matching "{searchTerm}"</span>}
                      </p>
                      <p className="text-gray-600 text-sm max-w-2xl">
                        Our lecturers and teaching professors are dedicated to excellence in undergraduate and graduate education.
                      </p>
                    </div>
                  )}
                  {activeCategory === 'staff' && (
                    <div className="space-y-1">
                      <p className="text-gray-700 font-medium">
                        {filteredAndSortedPeople.length} {filteredAndSortedPeople.length === 1 ? 'staff member' : 'staff members'}
                        {searchTerm && <span className="text-ocean-deep"> matching "{searchTerm}"</span>}
                      </p>
                      <p className="text-gray-600 text-sm max-w-2xl">
                        Our dedicated staff members provide essential support for research, teaching, and department operations.
                      </p>
                    </div>
                  )}
                  {activeCategory === 'students' && (
                    <div className="space-y-1">
                      <p className="text-gray-700 font-medium">
                        {filteredAndSortedPeople.length} {filteredAndSortedPeople.length === 1 ? 'graduate student' : 'graduate students'}
                        {searchTerm && <span className="text-ocean-deep"> matching "{searchTerm}"</span>}
                      </p>
                      <p className="text-gray-600 text-sm max-w-2xl">
                        Our graduate students are conducting cutting-edge research across diverse fields in ecology, evolution, and marine biology.
                      </p>
                    </div>
                  )}
                </div>

                {searchTerm && filteredAndSortedPeople.length > 0 && (
                  <button
                    onClick={clearSearch}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-ocean-deep hover:text-ocean-blue border-2 border-ocean-light hover:border-ocean-mid rounded-lg transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Search
                  </button>
                )}
              </div>

              {/* Grid */}
              {filteredAndSortedPeople.length > 0 ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  role="list"
                  aria-label={`${activeCategory} members`}
                >
                  {filteredAndSortedPeople.map((person) => renderPersonCard(person))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No {activeCategory === 'all' ? 'people' : activeCategory === 'emeriti' ? 'emeriti' : activeCategory} found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm
                        ? `No ${activeCategory === 'all' ? 'people' : activeCategory} match your search "${searchTerm}". Try different keywords or clear your search.`
                        : `No ${activeCategory === 'all' ? 'people' : activeCategory} are currently listed in the directory.`
                      }
                    </p>
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="px-6 py-3 bg-ocean-mid text-white rounded-lg hover:bg-ocean-deep transition font-semibold shadow-md hover:shadow-lg"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
