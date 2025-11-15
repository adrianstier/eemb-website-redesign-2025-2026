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
    labWebsite?: string
    googleScholar?: string
    orcid?: string
  }
}

type CategoryTab = 'all' | 'faculty' | 'researchers' | 'adjunct' | 'emeriti' | 'lecturers' | 'staff' | 'students'
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

  // Memoized filtered and sorted people
  const filteredAndSortedPeople = useMemo(() => {
    // Get people based on active category
    let people: Person[] = []

    if (activeCategory === 'all') {
      people = [...faculty, ...staff, ...students]
    } else if (activeCategory === 'faculty') {
      // Regular faculty: Professor, Associate Professor, Assistant Professor, Distinguished Professor
      // Excludes: Research Professors, Emeriti, Lecturers, Adjuncts
      people = faculty.filter(person => {
        const title = person.attributes.title?.toLowerCase() || ''
        return !title.includes('emeritus') &&
               !title.includes('lecturer') &&
               !title.includes('adjunct') &&
               !title.includes('research') &&
               title.includes('professor')
      })
    } else if (activeCategory === 'researchers') {
      // Research faculty: Research Professor, Research Biologist
      people = faculty.filter(person => {
        const title = person.attributes.title?.toLowerCase() || ''
        return title.includes('research professor') || title.includes('research biologist')
      })
    } else if (activeCategory === 'adjunct') {
      // Adjunct faculty
      people = faculty.filter(person =>
        person.attributes.title?.toLowerCase().includes('adjunct')
      )
    } else if (activeCategory === 'emeriti') {
      // Emeriti faculty
      people = faculty.filter(person =>
        person.attributes.title?.toLowerCase().includes('emeritus')
      )
    } else if (activeCategory === 'lecturers') {
      // Lecturers and Teaching Professors
      people = faculty.filter(person => {
        const title = person.attributes.title?.toLowerCase() || ''
        return title.includes('lecturer') || title.includes('teaching professor')
      })
    } else if (activeCategory === 'staff') {
      people = staff
    } else if (activeCategory === 'students') {
      people = students
    }

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
        className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors group"
        role="article"
        aria-label={`${person.attributes.fullName} contact`}
      >
        <div className="py-2 px-3 flex items-center gap-3">
          {/* Tiny avatar - 40px */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-ocean-light to-ocean-teal flex-shrink-0">
            {person.attributes.photo_url && !hasImageError ? (
              <img
                src={person.attributes.photo_url.startsWith('http')
                  ? person.attributes.photo_url
                  : `http://localhost:1337${person.attributes.photo_url}`}
                alt={person.attributes.fullName}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => handleImageError(person.id)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {getInitials(person)}
                </span>
              </div>
            )}
          </div>

          {/* Name - 30% width */}
          <div className="flex-shrink-0" style={{ width: '30%' }}>
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {person.attributes.fullName}
            </h3>
          </div>

          {/* Title - 25% width */}
          <div className="flex-shrink-0 hidden md:block" style={{ width: '25%' }}>
            {person.attributes.title && (
              <p className="text-xs text-gray-600 truncate">
                {person.attributes.title}
              </p>
            )}
            {person.attributes.degreeProgram && (
              <p className="text-xs text-gray-600 truncate">
                {person.attributes.degreeProgram} Student
              </p>
            )}
          </div>

          {/* Email - 25% width */}
          <div className="flex-shrink-0 hidden lg:block" style={{ width: '25%' }}>
            {person.attributes.email && (
              <a
                href={`mailto:${person.attributes.email}`}
                className="text-xs text-ocean-teal hover:text-ocean-deep hover:underline truncate block"
              >
                {person.attributes.email}
              </a>
            )}
          </div>

          {/* Office - flexible */}
          <div className="flex-grow min-w-0 hidden xl:block">
            {person.attributes.office && (
              <p className="text-xs text-gray-500 truncate">
                {person.attributes.office}
              </p>
            )}
          </div>

          {/* Social/Academic Links */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {person.attributes.labWebsite && (
              <a
                href={person.attributes.labWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ocean-teal transition-colors"
                aria-label={`${person.attributes.fullName}'s lab website`}
                title="Lab Website"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}
            {person.attributes.googleScholar && (
              <a
                href={person.attributes.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ocean-teal transition-colors"
                aria-label={`${person.attributes.fullName}'s Google Scholar profile`}
                title="Google Scholar"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0L9 6h6l-3-6zm0 7.5L9.5 13h5L12 7.5zm5.2 5.5H6.8l2.6 4.5h5.2l2.6-4.5zm-1.7 6.5H8.5L12 24l3.5-4.5z"/>
                </svg>
              </a>
            )}
            {person.attributes.orcid && (
              <a
                href={`https://orcid.org/${person.attributes.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-ocean-teal transition-colors"
                aria-label={`${person.attributes.fullName}'s ORCID profile`}
                title="ORCID"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.925-1.531 3.925-3.722 0-2.219-1.594-3.722-3.925-3.722h-2.297z"/>
                </svg>
              </a>
            )}
          </div>

          {/* Link icon */}
          {person.attributes.slug && (
            <Link
              href={`/people/faculty/${person.attributes.slug}`}
              className="flex-shrink-0 text-ocean-teal hover:text-ocean-deep transition-colors"
              aria-label={`View ${person.attributes.fullName}'s profile`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
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
        // Count regular faculty (excluding adjunct, emeriti, lecturers, research professors)
        return faculty.filter(person => {
          const title = person.attributes.title?.toLowerCase() || ''
          return !title.includes('emeritus') &&
                 !title.includes('lecturer') &&
                 !title.includes('adjunct') &&
                 !title.includes('research') &&
                 title.includes('professor')
        }).length
      case 'researchers':
        // Count research faculty
        return faculty.filter(person => {
          const title = person.attributes.title?.toLowerCase() || ''
          return title.includes('research professor') || title.includes('research biologist')
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
      <section className="bg-white border-b-2 border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Tabs - Clean horizontal tab bar */}
            <div className="flex overflow-x-auto" role="tablist" aria-label="People categories">
              {([
                { key: 'all', label: 'Full Directory' },
                { key: 'faculty', label: 'Faculty' },
                { key: 'researchers', label: 'Researchers' },
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
                  className={`relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeCategory === key
                      ? 'text-ocean-teal border-ocean-teal'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {label}
                  <span className={`ml-2 text-xs ${
                    activeCategory === key ? 'text-ocean-teal/70' : 'text-gray-400'
                  }`}>
                    ({getCategoryCount(key)})
                  </span>
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
              {/* Table View for All / Grid for Categories */}
              {filteredAndSortedPeople.length > 0 ? (
                activeCategory === 'all' ? (
                  // Compact table view for full directory
                  <div key="all-table" className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-ocean-teal to-ocean-blue text-white">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Title/Role</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold hidden md:table-cell">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">Office</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">Phone</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold hidden xl:table-cell">Links</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Profile</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredAndSortedPeople.map((person, index) => (
                            <tr key={person.id} className={`hover:bg-ocean-light hover:bg-opacity-10 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  {person.attributes.photo_url ? (
                                    <img
                                      src={person.attributes.photo_url}
                                      alt={person.attributes.fullName}
                                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center flex-shrink-0">
                                      <span className="text-white text-sm font-bold">
                                        {getInitials(person)}
                                      </span>
                                    </div>
                                  )}
                                  <span className="font-medium text-gray-900">{person.attributes.fullName}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {person.attributes.title || person.attributes.degreeProgram ? `${person.attributes.degreeProgram || ''} ${person.attributes.degreeProgram ? 'Student' : person.attributes.title || ''}`.trim() : '—'}
                              </td>
                              <td className="px-4 py-3 text-sm hidden md:table-cell">
                                {person.attributes.email ? (
                                  <a href={`mailto:${person.attributes.email}`} className="text-ocean-teal hover:text-ocean-deep hover:underline">
                                    {person.attributes.email}
                                  </a>
                                ) : '—'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                                {person.attributes.office || '—'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                                {person.attributes.phone || '—'}
                              </td>
                              <td className="px-4 py-3 text-center hidden xl:table-cell">
                                <div className="flex items-center justify-center gap-2">
                                  {person.attributes.labWebsite && (
                                    <a
                                      href={person.attributes.labWebsite}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-ocean-teal transition-colors"
                                      aria-label={`${person.attributes.fullName}'s lab website`}
                                      title="Lab Website"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                      </svg>
                                    </a>
                                  )}
                                  {person.attributes.googleScholar && (
                                    <a
                                      href={person.attributes.googleScholar}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-ocean-teal transition-colors"
                                      aria-label={`${person.attributes.fullName}'s Google Scholar profile`}
                                      title="Google Scholar"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0L9 6h6l-3-6zm0 7.5L9.5 13h5L12 7.5zm5.2 5.5H6.8l2.6 4.5h5.2l2.6-4.5zm-1.7 6.5H8.5L12 24l3.5-4.5z"/>
                                      </svg>
                                    </a>
                                  )}
                                  {person.attributes.orcid && (
                                    <a
                                      href={`https://orcid.org/${person.attributes.orcid}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-ocean-teal transition-colors"
                                      aria-label={`${person.attributes.fullName}'s ORCID profile`}
                                      title="ORCID"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.925-1.531 3.925-3.722 0-2.219-1.594-3.722-3.925-3.722h-2.297z"/>
                                      </svg>
                                    </a>
                                  )}
                                  {!person.attributes.labWebsite && !person.attributes.googleScholar && !person.attributes.orcid && (
                                    <span className="text-gray-400 text-sm">—</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {person.attributes.slug ? (
                                  <Link
                                    href={`/people/faculty/${person.attributes.slug}`}
                                    className="inline-flex items-center justify-center px-3 py-1.5 bg-ocean-teal hover:bg-ocean-blue text-white text-sm font-medium rounded transition"
                                  >
                                    View
                                  </Link>
                                ) : (
                                  <span className="text-gray-400 text-sm">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  // Directory View - List format (phone book style)
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    {filteredAndSortedPeople.map((person) => renderPersonCard(person))}
                  </div>
                )
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
