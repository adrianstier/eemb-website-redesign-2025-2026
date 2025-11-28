'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Search, X, Users, GraduationCap, Briefcase, Award, BookOpen, UserCircle2, Globe, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

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
type ViewMode = 'list' | 'grid'

// Category configuration with icons and descriptions
const CATEGORIES = [
  {
    key: 'all' as CategoryTab,
    label: 'All People',
    icon: Users,
    description: 'Complete directory'
  },
  {
    key: 'faculty' as CategoryTab,
    label: 'Faculty',
    icon: GraduationCap,
    description: 'Core faculty members'
  },
  {
    key: 'researchers' as CategoryTab,
    label: 'Researchers',
    icon: BookOpen,
    description: 'Research faculty'
  },
  {
    key: 'adjunct' as CategoryTab,
    label: 'Adjunct',
    icon: Award,
    description: 'Adjunct faculty'
  },
  {
    key: 'emeriti' as CategoryTab,
    label: 'Emeriti',
    icon: Award,
    description: 'Emeritus professors'
  },
  {
    key: 'lecturers' as CategoryTab,
    label: 'Lecturers',
    icon: BookOpen,
    description: 'Teaching faculty'
  },
  {
    key: 'staff' as CategoryTab,
    label: 'Staff',
    icon: Briefcase,
    description: 'Administrative staff'
  },
  {
    key: 'students' as CategoryTab,
    label: 'Students',
    icon: UserCircle2,
    description: 'Graduate students'
  }
]

export default function PeoplePage() {
  // State management
  const [faculty, setFaculty] = useState<Person[]>([])
  const [staff, setStaff] = useState<Person[]>([])
  const [students, setStudents] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm])

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
      setError('Unable to load directory. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter people by category
  const filterByCategory = useCallback((people: Person[], category: CategoryTab): Person[] => {
    if (category === 'all') return people

    const title = (p: Person) => p.attributes.title?.toLowerCase() || ''

    switch (category) {
      case 'faculty':
        return people.filter(p => {
          const t = title(p)
          return !t.includes('emeritus') &&
                 !t.includes('lecturer') &&
                 !t.includes('adjunct') &&
                 !t.includes('research') &&
                 t.includes('professor')
        })
      case 'researchers':
        return people.filter(p => {
          const t = title(p)
          return t.includes('research professor') || t.includes('research biologist')
        })
      case 'adjunct':
        return people.filter(p => title(p).includes('adjunct'))
      case 'emeriti':
        return people.filter(p => title(p).includes('emeritus'))
      case 'lecturers':
        return people.filter(p => {
          const t = title(p)
          return t.includes('lecturer') || t.includes('teaching professor')
        })
      default:
        return people
    }
  }, [])

  // Memoized filtered and sorted people
  const filteredAndSortedPeople = useMemo(() => {
    let people: Person[] = []

    // Get people by category
    if (activeCategory === 'all') {
      people = [...faculty, ...staff, ...students]
    } else if (activeCategory === 'staff') {
      people = staff
    } else if (activeCategory === 'students') {
      people = students
    } else {
      people = filterByCategory(faculty, activeCategory)
    }

    // Filter by search (debounced)
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase().trim()
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
        people.sort((a, b) => a.attributes.lastName.localeCompare(b.attributes.lastName))
        break
      case 'name-desc':
        people.sort((a, b) => b.attributes.lastName.localeCompare(a.attributes.lastName))
        break
      case 'recent':
        people.sort((a, b) => b.id - a.id)
        break
    }

    return people
  }, [debouncedSearch, sortOption, faculty, staff, students, activeCategory, filterByCategory])

  // Get category count
  const getCategoryCount = useCallback((category: CategoryTab): number => {
    if (category === 'all') return faculty.length + staff.length + students.length
    if (category === 'staff') return staff.length
    if (category === 'students') return students.length
    return filterByCategory(faculty, category).length
  }, [faculty, staff, students, filterByCategory])

  const handleImageError = useCallback((personId: number) => {
    setImageErrors(prev => new Set(prev).add(personId))
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setDebouncedSearch('')
  }, [])

  const getInitials = useCallback((person: Person): string => {
    const first = person.attributes.firstName?.[0] || ''
    const last = person.attributes.lastName?.[0] || ''
    return (first + last).toUpperCase()
  }, [])

  // Render person card (list view)
  const renderPersonCard = useCallback((person: Person) => {
    const hasImageError = imageErrors.has(person.id)
    const hasProfile = Boolean(person.attributes.slug)

    return (
      <article
        key={person.id}
        className="group relative border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors duration-150"
        role="article"
        aria-label={`${person.attributes.fullName} contact information`}
      >
        <div className="flex items-center gap-4 p-4">
          {/* Avatar */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0 ring-2 ring-white shadow-sm">
            {person.attributes.photo_url && !hasImageError ? (
              <img
                src={person.attributes.photo_url.startsWith('http')
                  ? person.attributes.photo_url
                  : `http://localhost:1337${person.attributes.photo_url}`}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => handleImageError(person.id)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold" aria-hidden="true">
                  {getInitials(person)}
                </span>
              </div>
            )}
          </div>

          {/* Content - Flexible Grid */}
          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1">
            {/* Name */}
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold text-slate-900 truncate">
                {person.attributes.fullName}
              </h3>
            </div>

            {/* Title/Role */}
            <div className="md:col-span-1 lg:col-span-2">
              {person.attributes.title && (
                <p className="text-sm text-slate-600 truncate">
                  {person.attributes.title}
                </p>
              )}
              {person.attributes.degreeProgram && (
                <p className="text-sm text-slate-600 truncate">
                  {person.attributes.degreeProgram} Student
                </p>
              )}
            </div>

            {/* Email */}
            <div className="hidden lg:block">
              {person.attributes.email && (
                <a
                  href={`mailto:${person.attributes.email}`}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate block transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {person.attributes.email}
                </a>
              )}
            </div>
          </div>

          {/* Office (optional, only on XL screens) */}
          {person.attributes.office && (
            <div className="hidden xl:block flex-shrink-0 w-24">
              <p className="text-sm text-slate-500 truncate">
                {person.attributes.office}
              </p>
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {person.attributes.labWebsite && (
              <a
                href={person.attributes.labWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-150"
                aria-label={`${person.attributes.fullName}'s lab website`}
                title="Lab Website"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {person.attributes.googleScholar && (
              <a
                href={person.attributes.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-150"
                aria-label={`${person.attributes.fullName}'s Google Scholar profile`}
                title="Google Scholar"
                onClick={(e) => e.stopPropagation()}
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
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-150"
                aria-label={`${person.attributes.fullName}'s ORCID profile`}
                title="ORCID"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.925-1.531 3.925-3.722 0-2.219-1.594-3.722-3.925-3.722h-2.297z"/>
                </svg>
              </a>
            )}
          </div>

          {/* View Profile Link */}
          {hasProfile && (
            <Link
              href={`/people/faculty/${person.attributes.slug}`}
              className="flex-shrink-0 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-all duration-150 group/link"
              aria-label={`View ${person.attributes.fullName}'s full profile`}
            >
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </article>
    )
  }, [imageErrors, handleImageError, getInitials])

  // Skeleton loading state
  const renderSkeleton = () => (
    <div className="animate-pulse border-b border-slate-200 p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="w-24 h-4 bg-slate-200 rounded"></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20 overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <Users className="w-4 h-4" />
              <p className="text-sm font-medium tracking-wide">Department Directory</p>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Our People
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 leading-relaxed">
              Explore our community of faculty, researchers, staff, and students advancing ecology, evolution, and marine biology.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Controls Section */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="border-b border-slate-200">
            <nav
              className="flex overflow-x-auto hide-scrollbar -mb-px"
              role="tablist"
              aria-label="People categories"
            >
              {CATEGORIES.map(({ key, label, icon: Icon }) => {
                const count = getCategoryCount(key)
                const isActive = activeCategory === key

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveCategory(key)
                      clearSearch()
                    }}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${key}-panel`}
                    className={`
                      group relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150
                      ${isActive
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-150 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <span>{label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Search & Controls */}
          <div className="py-4 flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="search"
                placeholder="Search by name, email, or research area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full pl-10 pr-10 py-2.5 text-sm
                  border border-slate-300 rounded-lg
                  bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-150
                  placeholder:text-slate-400
                "
                aria-label="Search people"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="
                px-4 py-2.5 text-sm
                border border-slate-300 rounded-lg
                bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-150
                cursor-pointer
              "
              aria-label="Sort people"
            >
              <option value="name-asc">Name (A→Z)</option>
              <option value="name-desc">Name (Z→A)</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="pb-3">
              <p className="text-sm text-slate-600">
                {debouncedSearch ? (
                  <>
                    Showing <span className="font-semibold text-slate-900">{filteredAndSortedPeople.length}</span> result{filteredAndSortedPeople.length !== 1 ? 's' : ''} for "{debouncedSearch}"
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-slate-900">{filteredAndSortedPeople.length}</span> {activeCategory === 'all' ? 'people' : CATEGORIES.find(c => c.key === activeCategory)?.label.toLowerCase()}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8" id={`${activeCategory}-panel`} role="tabpanel">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            // Loading State
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-sm font-medium text-slate-700">Loading directory...</p>
              </div>
              {[...Array(8)].map((_, i) => (
                <div key={i}>{renderSkeleton()}</div>
              ))}
            </div>
          ) : error ? (
            // Error State
            <div className="max-w-md mx-auto text-center py-12">
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Unable to Load Directory
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  {error}
                </p>
                <button
                  onClick={fetchAllPeople}
                  className="
                    inline-flex items-center gap-2 px-4 py-2
                    bg-red-600 text-white text-sm font-medium rounded-lg
                    hover:bg-red-700
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    transition-all duration-150
                  "
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredAndSortedPeople.length > 0 ? (
            // Directory List
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              {filteredAndSortedPeople.map((person) => renderPersonCard(person))}
            </div>
          ) : (
            // Empty State
            <div className="max-w-md mx-auto text-center py-12">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No {activeCategory === 'all' ? 'People' : CATEGORIES.find(c => c.key === activeCategory)?.label} Found
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  {debouncedSearch ? (
                    <>
                      No results match "<span className="font-medium">{debouncedSearch}</span>". Try adjusting your search.
                    </>
                  ) : (
                    <>
                      No {activeCategory === 'all' ? 'people' : CATEGORIES.find(c => c.key === activeCategory)?.label.toLowerCase()} are currently listed.
                    </>
                  )}
                </p>
                {debouncedSearch && (
                  <button
                    onClick={clearSearch}
                    className="
                      inline-flex items-center gap-2 px-4 py-2
                      bg-blue-600 text-white text-sm font-medium rounded-lg
                      hover:bg-blue-700
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      transition-all duration-150
                    "
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Custom styles for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
