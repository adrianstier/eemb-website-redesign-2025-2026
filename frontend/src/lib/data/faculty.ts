import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { Faculty, ResearchArea } from '@/lib/supabase/types'

export type FacultyWithResearch = Faculty & {
  research_areas: ResearchArea[]
}

/**
 * Get all active faculty members with their research areas
 */
export async function getAllFaculty(): Promise<FacultyWithResearch[]> {
  const supabase = await createClient()

  const { data: faculty, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('active', true)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching faculty:', error)
    return []
  }

  // Get research areas for each faculty member
  const facultyWithResearch = await Promise.all(
    faculty.map(async (f) => {
      const { data: researchAreas } = await supabase
        .from('faculty_research_areas')
        .select('research_area_id')
        .eq('faculty_id', f.id)

      if (!researchAreas || researchAreas.length === 0) {
        return { ...f, research_areas: [] }
      }

      const { data: areas } = await supabase
        .from('research_areas')
        .select('*')
        .in('id', researchAreas.map(r => r.research_area_id))

      return { ...f, research_areas: areas || [] }
    })
  )

  return facultyWithResearch
}

/**
 * Get a single faculty member by slug with research areas
 */
export async function getFacultyBySlug(slug: string): Promise<FacultyWithResearch | null> {
  const supabase = await createClient()

  const { data: faculty, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !faculty) {
    console.error('Error fetching faculty by slug:', error)
    return null
  }

  // Get research areas
  const { data: researchAreas } = await supabase
    .from('faculty_research_areas')
    .select('research_area_id')
    .eq('faculty_id', faculty.id)

  if (!researchAreas || researchAreas.length === 0) {
    return { ...faculty, research_areas: [] }
  }

  const { data: areas } = await supabase
    .from('research_areas')
    .select('*')
    .in('id', researchAreas.map(r => r.research_area_id))

  return { ...faculty, research_areas: areas || [] }
}

/**
 * Get faculty members who are accepting students
 */
export async function getFacultyAcceptingStudents(): Promise<FacultyWithResearch[]> {
  const supabase = await createClient()

  const { data: faculty, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('active', true)
    .eq('accepting_students', true)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching faculty accepting students:', error)
    return []
  }

  // Get research areas for each faculty member
  const facultyWithResearch = await Promise.all(
    faculty.map(async (f) => {
      const { data: researchAreas } = await supabase
        .from('faculty_research_areas')
        .select('research_area_id')
        .eq('faculty_id', f.id)

      if (!researchAreas || researchAreas.length === 0) {
        return { ...f, research_areas: [] }
      }

      const { data: areas } = await supabase
        .from('research_areas')
        .select('*')
        .in('id', researchAreas.map(r => r.research_area_id))

      return { ...f, research_areas: areas || [] }
    })
  )

  return facultyWithResearch
}

/**
 * Get faculty by research area
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

  // Get full faculty data
  const { data: faculty, error } = await supabase
    .from('faculty')
    .select('*')
    .in('id', facultyIds.map(f => f.faculty_id))
    .eq('active', true)
    .order('last_name', { ascending: true })

  if (error || !faculty) {
    return []
  }

  // Get all research areas for each faculty member
  const facultyWithResearch = await Promise.all(
    faculty.map(async (f) => {
      const { data: researchAreas } = await supabase
        .from('faculty_research_areas')
        .select('research_area_id')
        .eq('faculty_id', f.id)

      if (!researchAreas || researchAreas.length === 0) {
        return { ...f, research_areas: [] }
      }

      const { data: areas } = await supabase
        .from('research_areas')
        .select('*')
        .in('id', researchAreas.map(r => r.research_area_id))

      return { ...f, research_areas: areas || [] }
    })
  )

  return facultyWithResearch
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
