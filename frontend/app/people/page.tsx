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
type SortOption = 'name-asc' | 'name-desc' | 'title-asc' | 'title-desc' | 'email-asc' | 'email-desc' | 'office-asc' | 'office-desc' | 'recent'

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

    // Sort - create a new array to avoid mutation issues
    const sortedPeople = [...people] // Create a copy to avoid mutating the original

    switch (sortOption) {
      case 'name-asc':
        sortedPeople.sort((a, b) =>
          a.attributes.lastName.localeCompare(b.attributes.lastName)
        )
        break
      case 'name-desc':
        sortedPeople.sort((a, b) =>
          b.attributes.lastName.localeCompare(a.attributes.lastName)
        )
        break
      case 'title-asc':
        sortedPeople.sort((a, b) => {
          const titleA = a.attributes.title || a.attributes.degreeProgram || ''
          const titleB = b.attributes.title || b.attributes.degreeProgram || ''
          return titleA.localeCompare(titleB)
        })
        break
      case 'title-desc':
        sortedPeople.sort((a, b) => {
          const titleA = a.attributes.title || a.attributes.degreeProgram || ''
          const titleB = b.attributes.title || b.attributes.degreeProgram || ''
          return titleB.localeCompare(titleA)
        })
        break
      case 'email-asc':
        sortedPeople.sort((a, b) =>
          (a.attributes.email || '').localeCompare(b.attributes.email || '')
        )
        break
      case 'email-desc':
        sortedPeople.sort((a, b) =>
          (b.attributes.email || '').localeCompare(a.attributes.email || '')
        )
        break
      case 'office-asc':
        sortedPeople.sort((a, b) =>
          (a.attributes.office || '').localeCompare(b.attributes.office || '')
        )
        break
      case 'office-desc':
        sortedPeople.sort((a, b) =>
          (b.attributes.office || '').localeCompare(a.attributes.office || '')
        )
        break
      case 'recent':
        sortedPeople.sort((a, b) => b.id - a.id)
        break
    }

    return sortedPeople
  }, [searchTerm, sortOption, faculty, staff, students, activeCategory])

  const handleImageError = (personId: number) => {
    setImageErrors(prev => new Set(prev).add(personId))
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const handleColumnSort = (column: 'name' | 'title' | 'email' | 'office') => {
    // Toggle between ascending and descending
    const currentSort = sortOption
    if (currentSort === `${column}-asc`) {
      setSortOption(`${column}-desc` as SortOption)
    } else {
      setSortOption(`${column}-asc` as SortOption)
    }
  }

  const getSortIcon = (column: 'name' | 'title' | 'email' | 'office') => {
    if (sortOption === `${column}-asc`) {
      return (
        <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )
    } else if (sortOption === `${column}-desc`) {
      return (
        <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )
    }
    return null
  }

  const getInitials = (person: Person) => {
    const first = person.attributes.firstName?.[0] || ''
    const last = person.attributes.lastName?.[0] || ''
    return (first + last).toUpperCase()
  }

  const renderPersonCard = (person: Person) => {
    const hasImageError = imageErrors.has(person.id)
    const hasSocialLinks = person.attributes.labWebsite || person.attributes.googleScholar || person.attributes.orcid

    return (
      <article
        key={person.id}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 p-6 transition-all duration-200 group hover:-translate-y-1 flex flex-col"
        role="article"
        aria-label={`${person.attributes.fullName} contact`}
      >
        {/* Avatar - Fixed size */}
        <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-ocean-light to-ocean-teal shadow-md flex-shrink-0">
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
              <span className="text-white text-2xl font-bold">
                {getInitials(person)}
              </span>
            </div>
          )}
        </div>

        {/* Name - Fixed height */}
        <h3 className="text-base font-bold text-gray-900 text-center mb-2 min-h-[2.5rem] flex items-center justify-center">
          {person.attributes.fullName}
        </h3>

        {/* Title - Fixed minimum height */}
        <div className="min-h-[3rem] mb-4">
          {person.attributes.title && (
            <p className="text-sm text-ocean-teal text-center font-medium">
              {person.attributes.title}
            </p>
          )}
          {person.attributes.degreeProgram && (
            <p className="text-sm text-ocean-teal text-center font-medium">
              {person.attributes.degreeProgram} Student
            </p>
          )}
        </div>

        {/* Contact Info - Consistent spacing */}
        <div className="space-y-2 mb-4 flex-grow">
          {person.attributes.email && (
            <a
              href={`mailto:${person.attributes.email}`}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-ocean-deep transition-colors group/email"
            >
              <svg className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover/email:text-ocean-teal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{person.attributes.email}</span>
            </a>
          )}
          {person.attributes.office && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{person.attributes.office}</span>
            </div>
          )}
          {person.attributes.phone && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="truncate">{person.attributes.phone}</span>
            </div>
          )}
        </div>

        {/* Social Links - Always render with fixed height */}
        <div className={`flex items-center justify-center gap-3 py-4 border-t border-gray-200 min-h-[4rem] ${!hasSocialLinks ? 'opacity-0' : ''}`}>
          {person.attributes.labWebsite ? (
            <a
              href={person.attributes.labWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-ocean-teal text-gray-500 hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-md"
              aria-label={`${person.attributes.fullName}'s lab website`}
              title="Lab Website"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </a>
          ) : <div className="w-10 h-10"></div>}

          {person.attributes.googleScholar ? (
            <a
              href={person.attributes.googleScholar}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-blue-600 text-gray-500 hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-md"
              aria-label={`${person.attributes.fullName}'s Google Scholar profile`}
              title="Google Scholar"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512">
                <path d="M390.9 298.5c0 0 0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64C405.3 445.1 338.5 512 256 512s-149.3-66.9-149.3-149.3c0-22.9 5.2-44.6 14.4-64h0c1.7-3.6 3.6-7.2 5.6-10.7c4.4-7.6 9.4-14.7 15-21.3c27.4-32.6 68.5-53.3 114.4-53.3c33.6 0 64.6 11.1 89.6 29.9c9.1 6.9 17.4 14.7 24.8 23.5c5.6 6.6 10.6 13.8 15 21.3c2 3.4 3.8 7 5.5 10.5zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4L0 202.7 256 0 512 202.7l-94.7 77.1z"/>
              </svg>
            </a>
          ) : <div className="w-10 h-10"></div>}

          {person.attributes.orcid ? (
            <a
              href={`https://orcid.org/${person.attributes.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-[#A6CE39] text-gray-500 hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-md"
              aria-label={`${person.attributes.fullName}'s ORCID profile`}
              title="ORCID iD"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z" fill="currentColor"/>
                <g>
                  <path d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z" fill="white"/>
                  <path d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5   c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z" fill="white"/>
                  <path d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1   C84.2,46.7,88.7,51.3,88.7,56.8z" fill="white"/>
                </g>
              </svg>
            </a>
          ) : <div className="w-10 h-10"></div>}
        </div>

        {/* View Profile Button - Always at bottom */}
        {person.attributes.slug && (
          <Link
            href={`/people/faculty/${person.attributes.slug}`}
            className="block w-full text-center px-4 py-2.5 bg-ocean-teal hover:bg-ocean-blue text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md mt-2"
          >
            View Full Profile
          </Link>
        )}
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
                            <th
                              className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-ocean-deep/20 transition-colors select-none"
                              onClick={() => handleColumnSort('name')}
                              title="Click to sort by name"
                            >
                              <span className="flex items-center">
                                Name{getSortIcon('name')}
                              </span>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-ocean-deep/20 transition-colors select-none"
                              onClick={() => handleColumnSort('title')}
                              title="Click to sort by title/role"
                            >
                              <span className="flex items-center">
                                Title/Role{getSortIcon('title')}
                              </span>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-sm font-semibold hidden md:table-cell cursor-pointer hover:bg-ocean-deep/20 transition-colors select-none"
                              onClick={() => handleColumnSort('email')}
                              title="Click to sort by email"
                            >
                              <span className="flex items-center">
                                Email{getSortIcon('email')}
                              </span>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell cursor-pointer hover:bg-ocean-deep/20 transition-colors select-none"
                              onClick={() => handleColumnSort('office')}
                              title="Click to sort by office"
                            >
                              <span className="flex items-center">
                                Office{getSortIcon('office')}
                              </span>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">Phone</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredAndSortedPeople.map((person, index) => (
                            <tr key={`${person.id}-${person.attributes.email || index}`} className={`hover:bg-ocean-light hover:bg-opacity-10 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  {person.attributes.photo_url && !imageErrors.has(person.id) ? (
                                    <img
                                      src={person.attributes.photo_url.startsWith('http')
                                        ? person.attributes.photo_url
                                        : `http://localhost:1337${person.attributes.photo_url}`}
                                      alt={person.attributes.fullName}
                                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                      onError={() => handleImageError(person.id)}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center flex-shrink-0">
                                      <span className="text-white text-sm font-bold">
                                        {getInitials(person)}
                                      </span>
                                    </div>
                                  )}
                                  {person.attributes.slug ? (
                                    <Link
                                      href={`/people/faculty/${person.attributes.slug}`}
                                      className="font-medium text-ocean-teal hover:text-ocean-deep hover:underline"
                                    >
                                      {person.attributes.fullName}
                                    </Link>
                                  ) : (
                                    <span className="font-medium text-gray-900">{person.attributes.fullName}</span>
                                  )}
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  // Directory View - Beautiful card grid layout
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
