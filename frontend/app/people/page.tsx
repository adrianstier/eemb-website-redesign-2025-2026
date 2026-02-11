'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Faculty, Staff, GraduateStudent, Database } from '@/lib/supabase/types'
import ResearchAreaFilter from '@/components/ResearchAreaFilter'
import { useResearchAreas, useFacultyResearchAreaMap } from '@/hooks/useResearchAreas'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

type ResearchCategory = Database['public']['Enums']['research_category']

// Unified person type for display
interface Person {
  id: number
  first_name: string
  last_name: string
  full_name: string | null
  slug: string | null
  title?: string | null
  email: string
  phone?: string | null
  office?: string | null
  bio?: string | null
  short_bio?: string | null
  research_interests?: string[] | null
  degree_program?: string | null
  year_entered?: number | null
  expected_graduation?: number | null
  active: boolean
  department?: string | null
  photo_url?: string | null
  lab_website?: string | null
  personal_website?: string | null
  google_scholar?: string | null
  orcid?: string | null
  twitter?: string | null
  linkedin?: string | null
  research_areas?: string
  advisor?: {
    id: number
    full_name: string | null
    last_name: string
    slug: string | null
  } | null
  person_type: 'faculty' | 'staff' | 'student'
}

type CategoryTab = 'all' | 'faculty' | 'researchers' | 'adjunct' | 'emeriti' | 'lecturers' | 'staff' | 'students'
type SortOption = 'name-asc' | 'name-desc' | 'title-asc' | 'title-desc' | 'email-asc' | 'email-desc' | 'office-asc' | 'office-desc' | 'recent'

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
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [selectedResearchCategory, setSelectedResearchCategory] = useState<ResearchCategory | 'All'>('All')
  const [selectedResearchAreaIds, setSelectedResearchAreaIds] = useState<string[]>([])

  // Fetch research areas and faculty-research area associations
  const { areas: researchAreas, loading: areasLoading } = useResearchAreas()
  const { areaFacultyMap, loading: mapLoading } = useFacultyResearchAreaMap()

  useEffect(() => {
    fetchAllPeople()
  }, [])

  // Auto-select faculty tab when URL filter is present
  useEffect(() => {
    if (urlResearchAreaFilter) {
      setActiveCategory('faculty')
      // Map URL filter to research category if possible
      const categoryMap: Record<string, ResearchCategory> = {
        'ecology': 'Ecology',
        'evolution': 'Evolution',
        'marine-biology': 'Marine Biology',
      }
      const category = categoryMap[urlResearchAreaFilter]
      if (category) {
        setSelectedResearchCategory(category)
      }
    }
  }, [urlResearchAreaFilter])

  const fetchAllPeople = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Fetch all data in parallel
      const [facultyRes, staffRes, studentsRes] = await Promise.all([
        supabase.from('faculty').select('*').eq('active', true).order('last_name'),
        supabase.from('staff').select('*').eq('active', true).order('last_name'),
        supabase.from('graduate_students').select('*, advisor:faculty!graduate_students_advisor_id_fkey(id, full_name, last_name, slug)').eq('active', true).order('last_name')
      ])

      if (facultyRes.error) throw new Error(facultyRes.error.message)
      if (staffRes.error) throw new Error(staffRes.error.message)
      if (studentsRes.error) throw new Error(studentsRes.error.message)

      // Transform faculty data
      const transformedFaculty: Person[] = (facultyRes.data || []).map((f: Faculty) => ({
        id: f.id,
        first_name: f.first_name,
        last_name: f.last_name,
        full_name: f.full_name,
        slug: f.slug,
        title: f.title,
        email: f.email,
        phone: f.phone,
        office: f.office,
        bio: f.bio,
        short_bio: f.short_bio,
        research_interests: Array.isArray(f.research_interests) ? f.research_interests as string[] : null,
        active: f.active,
        department: f.department,
        photo_url: f.photo_url,
        lab_website: f.lab_website,
        google_scholar: f.google_scholar,
        orcid: f.orcid,
        person_type: 'faculty' as const
      }))

      // Transform staff data
      const transformedStaff: Person[] = (staffRes.data || []).map((s: Staff) => ({
        id: s.id,
        first_name: s.first_name,
        last_name: s.last_name,
        full_name: s.full_name,
        slug: s.slug,
        title: s.title,
        email: s.email,
        phone: s.phone,
        office: s.office,
        bio: s.bio,
        short_bio: s.short_bio,
        active: s.active,
        department: s.department,
        photo_url: s.photo_url,
        linkedin: s.linkedin,
        person_type: 'staff' as const
      }))

      // Transform student data
      const transformedStudents: Person[] = (studentsRes.data || []).map((s: GraduateStudent & { advisor: { id: number; full_name: string | null; last_name: string; slug: string | null } | null }) => ({
        id: s.id,
        first_name: s.first_name,
        last_name: s.last_name,
        full_name: s.full_name,
        slug: s.slug,
        email: s.email,
        phone: s.phone,
        office: s.office,
        bio: s.bio,
        short_bio: s.short_bio,
        research_interests: Array.isArray(s.research_interests) ? s.research_interests as string[] : null,
        degree_program: s.degree_program,
        year_entered: s.year_entered,
        expected_graduation: s.expected_graduation,
        active: s.active,
        photo_url: s.photo_url,
        lab_website: s.lab_website,
        personal_website: s.personal_website,
        google_scholar: s.google_scholar,
        orcid: s.orcid,
        twitter: s.twitter,
        linkedin: s.linkedin,
        advisor: s.advisor || null,
        person_type: 'student' as const
      }))

      setFaculty(transformedFaculty)
      setStaff(transformedStaff)
      setStudents(transformedStudents)
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
      people = faculty.filter(person => {
        const title = person.title?.toLowerCase() || ''
        return !title.includes('emeritus') &&
               !title.includes('lecturer') &&
               !title.includes('adjunct') &&
               !title.includes('research') &&
               title.includes('professor')
      })
    } else if (activeCategory === 'researchers') {
      people = faculty.filter(person => {
        const title = person.title?.toLowerCase() || ''
        return title.includes('research professor') || title.includes('research biologist') || title.includes('postdoctoral')
      })
    } else if (activeCategory === 'adjunct') {
      people = faculty.filter(person =>
        person.title?.toLowerCase().includes('adjunct')
      )
    } else if (activeCategory === 'emeriti') {
      people = faculty.filter(person =>
        person.title?.toLowerCase().includes('emeritus')
      )
    } else if (activeCategory === 'lecturers') {
      people = faculty.filter(person => {
        const title = person.title?.toLowerCase() || ''
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
        const fullName = person.full_name?.toLowerCase() || ''
        const email = person.email?.toLowerCase() || ''
        const title = person.title?.toLowerCase() || ''
        const research = person.research_interests?.join(' ').toLowerCase() || ''
        const degreeProgram = person.degree_program?.toLowerCase() || ''

        return fullName.includes(search) ||
               email.includes(search) ||
               title.includes(search) ||
               research.includes(search) ||
               degreeProgram.includes(search)
      })
    }

    // Filter by research area (using the research area map)
    if (activeCategory === 'faculty' && !mapLoading) {
      // If specific area IDs are selected, filter by those
      if (selectedResearchAreaIds.length > 0) {
        const selectedAreaIdsAsNumbers = selectedResearchAreaIds.map(id => parseInt(id, 10))
        const facultyInSelectedAreas = new Set<number>()

        for (const areaId of selectedAreaIdsAsNumbers) {
          const facultyIds = areaFacultyMap.get(areaId) || []
          facultyIds.forEach(id => facultyInSelectedAreas.add(id))
        }

        people = people.filter(person => facultyInSelectedAreas.has(person.id))
      }
      // If only category is selected (not 'All'), filter by areas in that category
      else if (selectedResearchCategory !== 'All') {
        const areasInCategory = researchAreas.filter(a => a.category === selectedResearchCategory)
        const facultyInCategory = new Set<number>()

        for (const area of areasInCategory) {
          const facultyIds = areaFacultyMap.get(area.id) || []
          facultyIds.forEach(id => facultyInCategory.add(id))
        }

        people = people.filter(person => facultyInCategory.has(person.id))
      }
    }

    // Sort - create a new array to avoid mutation issues
    const sortedPeople = [...people]

    switch (sortOption) {
      case 'name-asc':
        sortedPeople.sort((a, b) =>
          a.last_name.localeCompare(b.last_name)
        )
        break
      case 'name-desc':
        sortedPeople.sort((a, b) =>
          b.last_name.localeCompare(a.last_name)
        )
        break
      case 'title-asc':
        sortedPeople.sort((a, b) => {
          const titleA = a.title || a.degree_program || ''
          const titleB = b.title || b.degree_program || ''
          return titleA.localeCompare(titleB)
        })
        break
      case 'title-desc':
        sortedPeople.sort((a, b) => {
          const titleA = a.title || a.degree_program || ''
          const titleB = b.title || b.degree_program || ''
          return titleB.localeCompare(titleA)
        })
        break
      case 'email-asc':
        sortedPeople.sort((a, b) =>
          (a.email || '').localeCompare(b.email || '')
        )
        break
      case 'email-desc':
        sortedPeople.sort((a, b) =>
          (b.email || '').localeCompare(a.email || '')
        )
        break
      case 'office-asc':
        sortedPeople.sort((a, b) =>
          (a.office || '').localeCompare(b.office || '')
        )
        break
      case 'office-desc':
        sortedPeople.sort((a, b) =>
          (b.office || '').localeCompare(a.office || '')
        )
        break
      case 'recent':
        sortedPeople.sort((a, b) => b.id - a.id)
        break
    }

    return sortedPeople
  }, [searchTerm, sortOption, faculty, staff, students, activeCategory, selectedResearchCategory, selectedResearchAreaIds, researchAreas, areaFacultyMap, mapLoading])

  const handleImageError = (personKey: string) => {
    setImageErrors(prev => new Set(prev).add(personKey))
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const handleColumnSort = (column: 'name' | 'title' | 'email' | 'office') => {
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
    const first = person.first_name?.[0] || ''
    const last = person.last_name?.[0] || ''
    return (first + last).toUpperCase()
  }

  const renderPersonCard = (person: Person, index: number) => {
    const imageKey = `${person.person_type}-${person.id}`
    const hasImageError = imageErrors.has(imageKey)
    const isStudent = person.person_type === 'student'
    const hasSocialLinks = person.lab_website || person.google_scholar || person.orcid || person.personal_website || person.twitter || person.linkedin

    return (
      <article
        key={`${person.person_type}-${person.id}`}
        className="group relative bg-white rounded-3xl border border-warm-200 hover:border-ocean-teal/30 shadow-warm-sm hover:shadow-warm-xl transition-all duration-500 overflow-hidden animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
        role="article"
        aria-label={`${person.full_name} profile`}
      >
        {/* Gradient accent on hover */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ocean-teal to-bioluminescent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-teal/5 to-bioluminescent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-6">
          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-ocean-teal to-bioluminescent opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
              {person.photo_url && !hasImageError ? (
                <Image
                  src={person.photo_url}
                  alt={person.full_name || ''}
                  width={96}
                  height={96}
                  className="object-cover rounded-full w-full h-full"
                  sizes="96px"
                  onError={() => handleImageError(imageKey)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center">
                  <span className="text-white text-2xl font-heading font-bold">
                    {getInitials(person)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h3 className="font-heading text-lg font-bold text-ocean-deep text-center mb-1 group-hover:text-ocean-blue transition-colors duration-300">
            {person.full_name || [person.first_name, person.last_name].filter(Boolean).join(' ') || 'Unknown'}
          </h3>

          {/* Title/Program Info */}
          <div className="text-center mb-4">
            {person.title && (
              <p className="text-sm text-ocean-teal font-medium">
                {person.title}
              </p>
            )}
            {isStudent && (
              <>
                <p className="text-sm text-ocean-teal font-medium">
                  {person.degree_program} Student
                  {person.year_entered && (
                    <span className="text-warm-600 font-normal"> · {person.year_entered}</span>
                  )}
                </p>
                {person.expected_graduation && (
                  <p className="text-xs text-warm-600 mt-0.5">
                    Expected {person.expected_graduation}
                  </p>
                )}
              </>
            )}
            {person.advisor && (
              <p className="text-xs mt-1">
                {person.advisor.slug ? (
                  <Link
                    href={`/people/faculty/${person.advisor.slug}`}
                    className="text-ocean-teal hover:text-ocean-deep hover:underline"
                  >
                    {person.advisor.last_name} Lab
                  </Link>
                ) : (
                  <span className="text-warm-600">{person.advisor.last_name} Lab</span>
                )}
              </p>
            )}
          </div>

          {/* Short Bio */}
          {person.short_bio && (
            <p className="text-sm text-warm-600 text-center leading-relaxed mb-4 line-clamp-3">
              {person.short_bio}
            </p>
          )}

          {/* Contact Icons */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {person.email && (
              <a
                href={`mailto:${person.email}`}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-warm-100 hover:bg-ocean-teal text-warm-600 hover:text-white transition-all duration-300"
                aria-label="Email"
                title={person.email}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            )}
            {person.office && (
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full bg-warm-100 text-warm-600 cursor-help"
                title={person.office}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
            {person.phone && (
              <a
                href={`tel:${person.phone}`}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-warm-100 hover:bg-ocean-teal text-warm-600 hover:text-white transition-all duration-300"
                aria-label="Phone"
                title={person.phone}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            )}
          </div>

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-warm-200 flex-wrap">
              {person.lab_website && (
                <a
                  href={person.lab_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-warm-100 hover:bg-kelp-500 text-warm-600 hover:text-white transition-all duration-300"
                  title="Lab Website"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </a>
              )}
              {person.google_scholar && (
                <a
                  href={person.google_scholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-warm-100 hover:bg-blue-600 text-warm-600 hover:text-white transition-all duration-300"
                  title="Google Scholar"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M390.9 298.5c0 0 0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64C405.3 445.1 338.5 512 256 512s-149.3-66.9-149.3-149.3c0-22.9 5.2-44.6 14.4-64h0c1.7-3.6 3.6-7.2 5.6-10.7c4.4-7.6 9.4-14.7 15-21.3c27.4-32.6 68.5-53.3 114.4-53.3c33.6 0 64.6 11.1 89.6 29.9c9.1 6.9 17.4 14.7 24.8 23.5c5.6 6.6 10.6 13.8 15 21.3c2 3.4 3.8 7 5.5 10.5zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4L0 202.7 256 0 512 202.7l-94.7 77.1z"/>
                  </svg>
                </a>
              )}
              {person.orcid && (
                <a
                  href={`https://orcid.org/${person.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-warm-100 hover:bg-[#A6CE39] text-warm-600 hover:text-white transition-all duration-300"
                  title="ORCID"
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
              {person.twitter && (
                <a
                  href={person.twitter.startsWith('http') ? person.twitter : `https://twitter.com/${person.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-warm-100 hover:bg-black text-warm-600 hover:text-white transition-all duration-300"
                  title="Twitter/X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {person.linkedin && (
                <a
                  href={person.linkedin.startsWith('http') ? person.linkedin : `https://linkedin.com/in/${person.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-warm-100 hover:bg-[#0077B5] text-warm-600 hover:text-white transition-all duration-300"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* View Profile Button */}
          {person.slug && (
            <Link
              href={
                person.person_type === 'student'
                  ? `/people/students/${person.slug}`
                  : person.person_type === 'staff'
                  ? `/people/staff/${person.slug}`
                  : `/people/faculty/${person.slug}`
              }
              className="mt-4 block w-full text-center px-4 py-2.5 bg-gradient-to-r from-ocean-teal to-ocean-blue text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-ocean-teal/25 hover:-translate-y-0.5"
            >
              View Full Profile
            </Link>
          )}
        </div>
      </article>
    )
  }

  const renderSkeletonCard = () => (
    <div className="bg-white rounded-3xl border border-warm-200 p-6 animate-pulse">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-warm-200"></div>
      <div className="space-y-3">
        <div className="h-5 bg-warm-200 rounded-lg w-3/4 mx-auto"></div>
        <div className="h-4 bg-warm-200 rounded-lg w-1/2 mx-auto"></div>
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-warm-200 rounded-lg w-full"></div>
          <div className="h-3 bg-warm-200 rounded-lg w-5/6 mx-auto"></div>
        </div>
      </div>
    </div>
  )

  const getCategoryCount = (category: CategoryTab) => {
    switch (category) {
      case 'all':
        return faculty.length + staff.length + students.length
      case 'faculty':
        return faculty.filter(person => {
          const title = person.title?.toLowerCase() || ''
          return !title.includes('emeritus') &&
                 !title.includes('lecturer') &&
                 !title.includes('adjunct') &&
                 !title.includes('research') &&
                 title.includes('professor')
        }).length
      case 'researchers':
        return faculty.filter(person => {
          const title = person.title?.toLowerCase() || ''
          return title.includes('research professor') || title.includes('research biologist') || title.includes('postdoctoral')
        }).length
      case 'adjunct':
        return faculty.filter(person =>
          person.title?.toLowerCase().includes('adjunct')
        ).length
      case 'emeriti':
        return faculty.filter(person =>
          person.title?.toLowerCase().includes('emeritus')
        ).length
      case 'lecturers':
        return faculty.filter(person => {
          const title = person.title?.toLowerCase() || ''
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
    <div className="min-h-screen bg-warm-50">
      {/* Compact Page Header */}
      <section className="bg-white border-b border-warm-200 pt-8 pb-6">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-ocean-teal to-ocean-blue rounded-full" />
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-ocean-deep">
                  People Directory
                </h1>
              </div>
              <p className="text-warm-600 ml-4">
                Faculty, staff, and students in ecology, evolution & marine biology
              </p>
            </div>

            {/* Quick stats - compact */}
            <div className="flex gap-6 ml-4 md:ml-0">
              <div className="text-center">
                <span className="block text-2xl font-heading font-bold text-ocean-deep">{getCategoryCount('faculty')}</span>
                <span className="text-warm-600 text-xs uppercase tracking-wide">Faculty</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-heading font-bold text-ocean-deep">{getCategoryCount('students')}</span>
                <span className="text-warm-600 text-xs uppercase tracking-wide">Students</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-heading font-bold text-ocean-deep">{getCategoryCount('staff')}</span>
                <span className="text-warm-600 text-xs uppercase tracking-wide">Staff</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs & Controls */}
      <section className="bg-white border-b border-warm-200 sticky top-0 z-20 shadow-warm-sm">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col gap-4 py-4">
            {/* Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1" role="tablist">
              {([
                { key: 'all', label: 'Directory' },
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
                      setSelectedResearchCategory('All')
                      setSelectedResearchAreaIds([])
                    }
                  }}
                  role="tab"
                  aria-selected={activeCategory === key}
                  className={`relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal ${
                    activeCategory === key
                      ? 'bg-ocean-deep text-white shadow-lg'
                      : 'text-warm-600 hover:text-ocean-deep hover:bg-warm-100'
                  }`}
                >
                  {label}
                  <span className={`ml-1.5 text-xs ${
                    activeCategory === key ? 'text-white/70' : 'text-warm-400'
                  }`}>
                    {getCategoryCount(key)}
                  </span>
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search by name, research area, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-10 py-3 text-sm rounded-2xl border border-warm-200 bg-warm-50 focus:outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 focus:bg-white w-full transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-warm-400 hover:text-warm-600 transition-colors"
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
                className="px-4 py-3 text-sm rounded-2xl border border-warm-200 bg-warm-50 focus:outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 focus:bg-white transition-all duration-300 cursor-pointer"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Research Area Filter - Shows when Faculty tab is active */}
      {activeCategory === 'faculty' && !areasLoading && researchAreas.length > 0 && (
        <section className="bg-gradient-to-r from-ocean-teal/5 to-bioluminescent/5 border-b border-warm-200">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl py-4">
            <div className="flex items-start gap-4">
              <span className="text-sm font-medium text-warm-600 mt-2 flex-shrink-0">Filter by research:</span>
              <ResearchAreaFilter
                areas={researchAreas}
                selectedAreas={selectedResearchAreaIds}
                onFilterChange={setSelectedResearchAreaIds}
                selectedCategory={selectedResearchCategory}
                onCategoryChange={setSelectedResearchCategory}
                variant="pills"
                showCounts={true}
                className="flex-1"
              />
            </div>
          </div>
        </section>
      )}

      {/* People Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
          {loading ? (
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-warm-200 border-t-ocean-teal mx-auto mb-4"></div>
                  <p className="text-warm-600 font-medium">Loading people...</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>{renderSkeletonCard()}</div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-red-900 mb-2">Unable to Load People</h3>
                <p className="text-red-700 text-sm mb-6">{error}</p>
                <button
                  onClick={fetchAllPeople}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {filteredAndSortedPeople.length > 0 ? (
                activeCategory === 'all' ? (
                  // Table view for full directory
                  <div className="bg-white rounded-3xl shadow-warm-lg border border-warm-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-ocean-deep via-ocean-blue to-ocean-teal text-white">
                            <th
                              className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                              onClick={() => handleColumnSort('name')}
                            >
                              <span className="flex items-center gap-1">
                                Name{getSortIcon('name')}
                              </span>
                            </th>
                            <th
                              className="px-6 py-4 text-left text-sm font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                              onClick={() => handleColumnSort('title')}
                            >
                              <span className="flex items-center gap-1">
                                Title/Role{getSortIcon('title')}
                              </span>
                            </th>
                            <th
                              className="px-6 py-4 text-left text-sm font-semibold hidden md:table-cell cursor-pointer hover:bg-white/10 transition-colors"
                              onClick={() => handleColumnSort('email')}
                            >
                              <span className="flex items-center gap-1">
                                Email{getSortIcon('email')}
                              </span>
                            </th>
                            <th
                              className="px-6 py-4 text-left text-sm font-semibold hidden lg:table-cell cursor-pointer hover:bg-white/10 transition-colors"
                              onClick={() => handleColumnSort('office')}
                            >
                              <span className="flex items-center gap-1">
                                Office{getSortIcon('office')}
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-100">
                          {filteredAndSortedPeople.map((person, index) => (
                            <tr
                              key={`${person.person_type}-${person.id}-${index}`}
                              className="hover:bg-warm-50 transition-colors duration-200 group"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  {person.photo_url && !imageErrors.has(`${person.person_type}-${person.id}`) ? (
                                    <Image
                                      src={person.photo_url}
                                      alt={person.full_name || ''}
                                      width={48}
                                      height={48}
                                      className="w-12 h-12 object-cover rounded-full border-2 border-warm-200 group-hover:border-ocean-teal transition-colors"
                                      sizes="48px"
                                      onError={() => handleImageError(`${person.person_type}-${person.id}`)}
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center border-2 border-warm-200 group-hover:border-ocean-teal transition-colors">
                                      <span className="text-white text-sm font-bold">
                                        {getInitials(person)}
                                      </span>
                                    </div>
                                  )}
                                  {person.slug ? (
                                    <Link
                                      href={
                                        person.person_type === 'student'
                                          ? `/people/students/${person.slug}`
                                          : person.person_type === 'staff'
                                          ? `/people/staff/${person.slug}`
                                          : `/people/faculty/${person.slug}`
                                      }
                                      className="font-semibold text-ocean-deep hover:text-ocean-teal transition-colors"
                                    >
                                      {person.full_name || [person.first_name, person.last_name].filter(Boolean).join(' ') || 'Unknown'}
                                    </Link>
                                  ) : (
                                    <span className="font-semibold text-ocean-deep">{person.full_name || [person.first_name, person.last_name].filter(Boolean).join(' ') || 'Unknown'}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-warm-600">
                                {person.title || (person.degree_program ? `${person.degree_program} Student` : '—')}
                              </td>
                              <td className="px-6 py-4 text-sm hidden md:table-cell">
                                {person.email ? (
                                  <a href={`mailto:${person.email}`} className="text-ocean-teal hover:text-ocean-deep hover:underline">
                                    {person.email}
                                  </a>
                                ) : '—'}
                              </td>
                              <td className="px-6 py-4 text-sm text-warm-600 hidden lg:table-cell">
                                {person.office || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  // Card grid for categories with scroll-triggered animations
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedPeople.map((person, index) => (
                      <ScrollReveal
                        key={`${person.person_type}-${person.id}`}
                        delay={(index % 4) * 75}
                        duration={500}
                        direction="up"
                        distance={20}
                        threshold={0.05}
                      >
                        {renderPersonCard(person, index)}
                      </ScrollReveal>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-ocean-deep mb-3">
                      No results found
                    </h3>
                    <p className="text-warm-600 mb-6">
                      {searchTerm
                        ? `No matches for "${searchTerm}". Try different keywords.`
                        : `No people found in this category.`
                      }
                    </p>
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="px-6 py-3 bg-gradient-to-r from-ocean-teal to-ocean-blue text-white rounded-xl hover:shadow-lg transition-all font-semibold"
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
