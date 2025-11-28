'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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
    yearEntered?: number
    expectedGraduation?: number
    active: boolean
    department?: string
    photo_url?: string
    labWebsite?: string
    personalWebsite?: string
    googleScholar?: string
    orcid?: string
    twitter?: string
    linkedin?: string
    research_areas?: string
    advisor?: {
      data?: {
        id: number
        attributes: {
          fullName: string
          lastName: string
          slug?: string
        }
      }
    }
  }
}

type CategoryTab = 'all' | 'faculty' | 'researchers' | 'adjunct' | 'emeriti' | 'lecturers' | 'staff' | 'students'
type SortOption = 'name-asc' | 'name-desc' | 'title-asc' | 'title-desc' | 'email-asc' | 'email-desc' | 'office-asc' | 'office-desc' | 'recent'
type ResearchAreaFilter = 'all' | 'ecology' | 'evolution' | 'marine-biology'

export default function PeoplePage() {
  const searchParams = useSearchParams()
  const urlResearchAreaFilter = searchParams?.get('filter') || null

  const [faculty, setFaculty] = useState<Person[]>([])
  const [staff, setStaff] = useState<Person[]>([])
  const [students, setStudents] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const [activeResearchArea, setActiveResearchArea] = useState<ResearchAreaFilter>('all')

  useEffect(() => {
    fetchAllPeople()
  }, [])

  // Auto-select faculty tab and research area when URL filter is present
  useEffect(() => {
    if (urlResearchAreaFilter) {
      setActiveCategory('faculty')
      setActiveResearchArea(urlResearchAreaFilter as ResearchAreaFilter)
    }
  }, [urlResearchAreaFilter])

  const fetchAllPeople = async () => {
    try {
      setLoading(true)
      setError(null)

      const [facultyRes, staffRes, studentsRes] = await Promise.all([
        fetch('http://localhost:1337/api/faculties?pagination[limit]=200'),
        fetch('http://localhost:1337/api/staff-members?pagination[limit]=100'),
        fetch('http://localhost:1337/api/graduate-students?pagination[limit]=100&populate=advisor')
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

    // Filter by research area (from state)
    if (activeResearchArea !== 'all' && activeCategory === 'faculty') {
      people = people.filter(person => {
        const areas = person.attributes.research_areas || ''
        return areas.includes(activeResearchArea)
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
  }, [searchTerm, sortOption, faculty, staff, students, activeCategory, activeResearchArea])

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
    const isStudent = !!person.attributes.degreeProgram
    const hasSocialLinks = person.attributes.labWebsite || person.attributes.googleScholar || person.attributes.orcid || person.attributes.personalWebsite || person.attributes.twitter || person.attributes.linkedin

    return (
      <article
        key={person.id}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 p-5 transition-all duration-200 group hover:-translate-y-1 flex flex-col"
        role="article"
        aria-label={`${person.attributes.fullName} contact`}
      >
        {/* Avatar - Fixed size */}
        <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br from-ocean-light to-ocean-teal shadow-md flex-shrink-0">
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
              <span className="text-white text-xl font-bold">
                {getInitials(person)}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-gray-900 text-center mb-1">
          {person.attributes.fullName}
        </h3>

        {/* Title/Program Info */}
        <div className="mb-2">
          {person.attributes.title && (
            <p className="text-sm text-ocean-teal text-center font-medium">
              {person.attributes.title}
            </p>
          )}
          {isStudent && (
            <>
              <p className="text-sm text-ocean-teal text-center font-medium">
                {person.attributes.degreeProgram} Student
                {person.attributes.yearEntered && (
                  <span className="text-gray-500 font-normal"> · {person.attributes.yearEntered}</span>
                )}
              </p>
              {person.attributes.expectedGraduation && (
                <p className="text-xs text-gray-500 text-center">
                  Expected {person.attributes.expectedGraduation}
                </p>
              )}
            </>
          )}
          {/* Advisor/Lab for students - Clickable link */}
          {person.attributes.advisor?.data && (
            <p className="text-xs text-center mt-1">
              {person.attributes.advisor.data.attributes.slug ? (
                <Link
                  href={`/people/faculty/${person.attributes.advisor.data.attributes.slug}`}
                  className="text-ocean-teal hover:text-ocean-deep hover:underline"
                >
                  {person.attributes.advisor.data.attributes.lastName} Lab
                </Link>
              ) : (
                <span className="text-gray-500">{person.attributes.advisor.data.attributes.lastName} Lab</span>
              )}
            </p>
          )}
        </div>

        {/* Research Summary - Full sentence */}
        {person.attributes.shortBio && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 text-center leading-snug">
              {person.attributes.shortBio}
            </p>
          </div>
        )}

        {/* Contact Icons with Hover Tooltips - Centered */}
        <div className="flex items-center justify-center gap-2.5 mb-3">
          {person.attributes.email && (
            <div className="relative group/contact">
              <a
                href={`mailto:${person.attributes.email}`}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-ocean-teal text-gray-500 hover:text-white transition-all"
                aria-label="Email"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/contact:opacity-100 pointer-events-none transition-opacity z-10">
                {person.attributes.email}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
          {person.attributes.office && (
            <div className="relative group/contact">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-ocean-teal text-gray-500 hover:text-white transition-all cursor-help">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/contact:opacity-100 pointer-events-none transition-opacity z-10">
                {person.attributes.office}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
          {person.attributes.phone && (
            <div className="relative group/contact">
              <a
                href={`tel:${person.attributes.phone}`}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-ocean-teal text-gray-500 hover:text-white transition-all"
                aria-label="Phone"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/contact:opacity-100 pointer-events-none transition-opacity z-10">
                {person.attributes.phone}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>

        {/* Social Links - Compact row of icons */}
        {hasSocialLinks && (
          <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-200 mt-auto flex-wrap">
            {person.attributes.personalWebsite && (
              <a
                href={person.attributes.personalWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-ocean-teal text-gray-500 hover:text-white transition-all duration-200"
                aria-label="Personal Website"
                title="Personal Website"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}

            {person.attributes.labWebsite && (
              <a
                href={person.attributes.labWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-ocean-teal text-gray-500 hover:text-white transition-all duration-200"
                aria-label="Lab Website"
                title="Lab Website"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </a>
            )}

            {person.attributes.googleScholar && (
              <a
                href={person.attributes.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-600 text-gray-500 hover:text-white transition-all duration-200"
                aria-label="Google Scholar"
                title="Google Scholar"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M390.9 298.5c0 0 0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64C405.3 445.1 338.5 512 256 512s-149.3-66.9-149.3-149.3c0-22.9 5.2-44.6 14.4-64h0c1.7-3.6 3.6-7.2 5.6-10.7c4.4-7.6 9.4-14.7 15-21.3c27.4-32.6 68.5-53.3 114.4-53.3c33.6 0 64.6 11.1 89.6 29.9c9.1 6.9 17.4 14.7 24.8 23.5c5.6 6.6 10.6 13.8 15 21.3c2 3.4 3.8 7 5.5 10.5zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4L0 202.7 256 0 512 202.7l-94.7 77.1z"/>
                </svg>
              </a>
            )}

            {person.attributes.orcid && (
              <a
                href={`https://orcid.org/${person.attributes.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-[#A6CE39] text-gray-500 hover:text-white transition-all duration-200"
                aria-label="ORCID"
                title="ORCID iD"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"/>
                  <g>
                    <path d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z" fill="white"/>
                    <path d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z" fill="white"/>
                    <path d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1C84.2,46.7,88.7,51.3,88.7,56.8z" fill="white"/>
                  </g>
                </svg>
              </a>
            )}

            {person.attributes.twitter && (
              <a
                href={person.attributes.twitter.startsWith('http') ? person.attributes.twitter : `https://twitter.com/${person.attributes.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-black text-gray-500 hover:text-white transition-all duration-200"
                aria-label="Twitter/X"
                title="Twitter/X"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}

            {person.attributes.linkedin && (
              <a
                href={person.attributes.linkedin.startsWith('http') ? person.attributes.linkedin : `https://linkedin.com/in/${person.attributes.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-[#0077B5] text-gray-500 hover:text-white transition-all duration-200"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
          </div>
        )}

        {/* View Profile Button - Always at bottom */}
        {person.attributes.slug && (
          <Link
            href={person.attributes.degreeProgram
              ? `/people/students/${person.attributes.slug}`
              : `/people/faculty/${person.attributes.slug}`
            }
            className="block w-full text-center px-4 py-2 bg-ocean-teal hover:bg-ocean-blue text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Improved spacing and typography */}
      <section className="relative bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <p className="text-xs font-semibold tracking-wide uppercase">Meet Our Community</p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">Our People</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Meet the faculty, staff, and students leading the way in ecology, evolution, and marine biology research.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs & Controls - Improved accessibility and spacing */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col gap-3 py-3">
            {/* Tabs - Enhanced accessibility */}
            <div className="flex overflow-x-auto scrollbar-hide pb-1" role="tablist" aria-label="People categories">
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
                    if (key !== 'faculty') {
                      setActiveResearchArea('all')
                    }
                  }}
                  role="tab"
                  aria-selected={activeCategory === key}
                  aria-controls={`${key}-panel`}
                  className={`relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-150 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2 rounded-t ${
                    activeCategory === key
                      ? 'text-ocean-teal border-ocean-teal'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {label}
                  <span className={`ml-1.5 text-xs ${
                    activeCategory === key ? 'text-ocean-teal/70' : 'text-gray-400'
                  }`}>
                    ({getCategoryCount(key)})
                  </span>
                </button>
              ))}
            </div>

            {/* Search & Sort Controls - Improved spacing and focus states */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search people..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 w-full transition-all duration-150"
                  aria-label="Search people"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal rounded"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 bg-white transition-all duration-150 cursor-pointer"
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

      {/* Research Area Filter Tabs - Shows when Faculty tab is active */}
      {activeCategory === 'faculty' && (
        <section className="bg-ocean-50 border-b border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl py-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Filter by research area:</span>
              <div className="flex gap-2 flex-wrap">
                {([
                  { key: 'all', label: 'All Faculty', count: faculty.filter(p => {
                    const title = p.attributes.title?.toLowerCase() || ''
                    return !title.includes('emeritus') && !title.includes('lecturer') && !title.includes('adjunct') && !title.includes('research') && title.includes('professor')
                  }).length },
                  { key: 'ecology', label: 'Ecology', count: faculty.filter(p => {
                    const title = p.attributes.title?.toLowerCase() || ''
                    const isFaculty = !title.includes('emeritus') && !title.includes('lecturer') && !title.includes('adjunct') && !title.includes('research') && title.includes('professor')
                    return isFaculty && p.attributes.research_areas?.includes('ecology')
                  }).length },
                  { key: 'evolution', label: 'Evolution', count: faculty.filter(p => {
                    const title = p.attributes.title?.toLowerCase() || ''
                    const isFaculty = !title.includes('emeritus') && !title.includes('lecturer') && !title.includes('adjunct') && !title.includes('research') && title.includes('professor')
                    return isFaculty && p.attributes.research_areas?.includes('evolution')
                  }).length },
                  { key: 'marine-biology', label: 'Marine Biology', count: faculty.filter(p => {
                    const title = p.attributes.title?.toLowerCase() || ''
                    const isFaculty = !title.includes('emeritus') && !title.includes('lecturer') && !title.includes('adjunct') && !title.includes('research') && title.includes('professor')
                    return isFaculty && p.attributes.research_areas?.includes('marine-biology')
                  }).length },
                ] as { key: ResearchAreaFilter; label: string; count: number }[]).map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setActiveResearchArea(key)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2 ${
                      activeResearchArea === key
                        ? 'bg-ocean-teal text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-ocean-teal hover:text-ocean-teal'
                    }`}
                  >
                    {label}
                    <span className={`ml-1.5 text-xs ${activeResearchArea === key ? 'text-white/80' : 'text-gray-400'}`}>
                      ({count})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* People Grid - Improved spacing */}
      <section className="py-8 md:py-12" id={`${activeCategory}-panel`} role="tabpanel">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-ocean-light border-t-ocean-teal mx-auto mb-3"></div>
                  <p className="text-gray-600 font-medium text-sm">Loading people...</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>{renderSkeletonCard()}</div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load People</h3>
                <p className="text-red-700 text-sm mb-6">{error}</p>
                <button
                  onClick={fetchAllPeople}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
                  // Compact table view for full directory - Improved design
                  <div key="all-table" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-ocean-teal to-ocean-blue text-white">
                          <tr>
                            <th
                              className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-white/10 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
                              onClick={() => handleColumnSort('name')}
                              title="Click to sort by name"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && handleColumnSort('name')}
                            >
                              <span className="flex items-center gap-1">
                                Name{getSortIcon('name')}
                              </span>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-white/10 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
                              onClick={() => handleColumnSort('title')}
                              title="Click to sort by title/role"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && handleColumnSort('title')}
                            >
                              <span className="flex items-center gap-1">
                                Title/Role{getSortIcon('title')}
                              </span>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-sm font-semibold hidden md:table-cell cursor-pointer hover:bg-white/10 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
                              onClick={() => handleColumnSort('email')}
                              title="Click to sort by email"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && handleColumnSort('email')}
                            >
                              <span className="flex items-center gap-1">
                                Email{getSortIcon('email')}
                              </span>
                            </th>
                            <th
                              className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell cursor-pointer hover:bg-white/10 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
                              onClick={() => handleColumnSort('office')}
                              title="Click to sort by office"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && handleColumnSort('office')}
                            >
                              <span className="flex items-center gap-1">
                                Office{getSortIcon('office')}
                              </span>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">Phone</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredAndSortedPeople.map((person, index) => (
                            <tr key={`${person.id}-${person.attributes.email || index}`} className="hover:bg-gray-50 transition-colors duration-150">
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
                                      href={person.attributes.degreeProgram
                                        ? `/people/students/${person.attributes.slug}`
                                        : `/people/faculty/${person.attributes.slug}`
                                      }
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
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No {activeCategory === 'all' ? 'people' : activeCategory === 'emeriti' ? 'emeriti' : activeCategory} found
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      {searchTerm
                        ? `No ${activeCategory === 'all' ? 'people' : activeCategory} match your search "${searchTerm}". Try different keywords or clear your search.`
                        : `No ${activeCategory === 'all' ? 'people' : activeCategory} are currently listed in the directory.`
                      }
                    </p>
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="px-4 py-2 bg-ocean-teal text-white rounded-lg hover:bg-ocean-blue transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2"
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
