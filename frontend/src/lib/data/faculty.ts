import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { Faculty, ResearchArea } from '@/lib/supabase/types'

export type FacultyWithResearch = Faculty & {
  research_areas: ResearchArea[]
}

// Type for the nested select result from Supabase
type FacultyWithNestedResearch = Faculty & {
  faculty_research_areas: Array<{
    research_areas: ResearchArea
  }>
}

/**
 * Transform the nested Supabase result into our FacultyWithResearch type
 */
function transformFacultyWithResearch(faculty: FacultyWithNestedResearch): FacultyWithResearch {
  const { faculty_research_areas, ...rest } = faculty
  return {
    ...rest,
    research_areas: faculty_research_areas?.map(fra => fra.research_areas).filter(Boolean) || []
  }
}

/**
 * Get all active faculty members with their research areas
 * Uses a single query with nested selects (no N+1 problem)
 */
export async function getAllFaculty(): Promise<FacultyWithResearch[]> {
  const supabase = await createClient()

  const { data: faculty, error } = await supabase
    .from('faculty')
    .select(`
      *,
      faculty_research_areas(
        research_areas(*)
      )
    `)
    .eq('active', true)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching faculty:', error)
    return []
  }

  return (faculty as FacultyWithNestedResearch[] || []).map(transformFacultyWithResearch)
}

/**
 * Get a single faculty member by slug with research areas
 * Uses a single query with nested selects
 */
export async function getFacultyBySlug(slug: string): Promise<FacultyWithResearch | null> {
  const supabase = await createClient()

  const { data: faculty, error } = await supabase
    .from('faculty')
    .select(`
      *,
      faculty_research_areas(
        research_areas(*)
      )
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !faculty) {
    console.error('Error fetching faculty by slug:', error)
    return null
  }

  return transformFacultyWithResearch(faculty as FacultyWithNestedResearch)
}

/**
 * Get faculty members who are accepting students
 * Uses a single query with nested selects
 */
export async function getFacultyAcceptingStudents(): Promise<FacultyWithResearch[]> {
  const supabase = await createClient()

  const { data: faculty, error } = await supabase
    .from('faculty')
    .select(`
      *,
      faculty_research_areas(
        research_areas(*)
      )
    `)
    .eq('active', true)
    .eq('accepting_students', true)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching faculty accepting students:', error)
    return []
  }

  return (faculty as FacultyWithNestedResearch[] || []).map(transformFacultyWithResearch)
}

/**
 * Get faculty by research area
 * Uses optimized queries with nested selects
 */
export async function getFacultyByResearchArea(researchAreaSlug: string): Promise<FacultyWithResearch[]> {
  const supabase = await createClient()

  // First get the research area ID
  const { data: researchArea } = await supabase
    .from('research_areas')
    .select('id')
    .eq('slug', researchAreaSlug)
    .single()

  if (!researchArea) {
    return []
  }

  // Get faculty IDs associated with this research area
  const { data: facultyIds } = await supabase
    .from('faculty_research_areas')
    .select('faculty_id')
    .eq('research_area_id', researchArea.id)

  if (!facultyIds || facultyIds.length === 0) {
    return []
  }

  // Get full faculty data with all their research areas in a single query
  const { data: faculty, error } = await supabase
    .from('faculty')
    .select(`
      *,
      faculty_research_areas(
        research_areas(*)
      )
    `)
    .in('id', facultyIds.map(f => f.faculty_id))
    .eq('active', true)
    .order('last_name', { ascending: true })

  if (error || !faculty) {
    return []
  }

  return (faculty as FacultyWithNestedResearch[] || []).map(transformFacultyWithResearch)
}

/**
 * Get all faculty slugs for static generation
 * Uses createStaticClient to avoid cookie issues during build
 */
export async function getAllFacultySlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('faculty')
    .select('slug')
    .eq('active', true)
    .not('slug', 'is', null)

  if (error || !data) {
    return []
  }

  return data.map(f => f.slug).filter((slug): slug is string => slug !== null)
}
