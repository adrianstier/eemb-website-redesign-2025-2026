import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { ResearchArea, Faculty } from '@/lib/supabase/types'

export type ResearchAreaWithFaculty = ResearchArea & {
  faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'photo_url'>[]
}

export type ResearchAreaWithDetailedFaculty = ResearchArea & {
  faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'photo_url' | 'short_bio'>[]
}

/**
 * Get all research areas
 */
export async function getAllResearchAreas(): Promise<ResearchArea[]> {
  const supabase = await createClient()

  const { data: areas, error } = await supabase
    .from('research_areas')
    .select('*')
    .order('order_index', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching research areas:', error)
    return []
  }

  return areas
}

/**
 * Get all research areas with associated faculty details
 * Used on the Research page to show themes with faculty lists
 */
export async function getAllResearchAreasWithFaculty(): Promise<ResearchAreaWithDetailedFaculty[]> {
  const supabase = await createClient()

  const { data: areas, error } = await supabase
    .from('research_areas')
    .select(`
      *,
      faculty_research_areas(
        faculty:faculty_id(
          id,
          first_name,
          last_name,
          slug,
          photo_url,
          short_bio,
          active
        )
      )
    `)
    .order('order_index', { ascending: true })
    .order('name', { ascending: true })

  if (error || !areas) {
    console.error('Error fetching research areas with faculty:', error)
    return []
  }

  // Transform nested data structure and filter active faculty
  return areas.map(area => {
    const { faculty_research_areas, ...areaData } = area
    return {
      ...areaData,
      faculty: (faculty_research_areas || [])
        .map((fra: { faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'photo_url' | 'short_bio' | 'active'> | null }) => fra.faculty)
        .filter((f): f is Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'photo_url' | 'short_bio' | 'active'> => f !== null && f.active === true)
        .map(({ active: _active, ...rest }) => rest) // Remove active field from output
    }
  })
}

/**
 * Get total count of active faculty
 */
export async function getFacultyCount(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('faculty')
    .select('id', { count: 'exact', head: true })
    .eq('active', true)
  if (error) {
    console.error('Error fetching faculty count:', error)
    return 0
  }
  return count || 0
}

/**
 * Get total count of active graduate students
 */
export async function getStudentCount(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('graduate_students')
    .select('id', { count: 'exact', head: true })
    .eq('active', true)
  if (error) {
    console.error('Error fetching student count:', error)
    return 0
  }
  return count || 0
}

/**
 * Get featured research areas (for homepage)
 * Uses nested select to avoid N+1 queries
 */
export async function getFeaturedResearchAreas(): Promise<ResearchAreaWithFaculty[]> {
  const supabase = await createClient()

  const { data: areas, error } = await supabase
    .from('research_areas')
    .select(`
      *,
      faculty_research_areas(
        faculty:faculty_id(
          id,
          first_name,
          last_name,
          slug,
          photo_url,
          active
        )
      )
    `)
    .eq('featured', true)
    .order('order_index', { ascending: true })

  if (error || !areas) {
    console.error('Error fetching featured research areas:', error)
    return []
  }

  // Transform nested data structure and filter active faculty
  return areas.map(area => {
    const { faculty_research_areas, ...areaData } = area
    return {
      ...areaData,
      faculty: (faculty_research_areas || [])
        .map((fra: { faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'photo_url' | 'active'> | null }) => fra.faculty)
        .filter((f): f is Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'photo_url' | 'active'> => f !== null && f.active === true)
        .map(({ active: _active, ...rest }) => rest) // Remove active field from output
    }
  })
}

/**
 * Get a single research area by slug with associated faculty
 * Uses nested select to avoid N+1 queries
 */
export async function getResearchAreaBySlug(slug: string): Promise<ResearchAreaWithFaculty | null> {
  const supabase = await createClient()

  const { data: area, error } = await supabase
    .from('research_areas')
    .select(`
      *,
      faculty_research_areas(
        faculty:faculty_id(
          id,
          first_name,
          last_name,
          slug,
          photo_url,
          active
        )
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !area) {
    console.error('Error fetching research area by slug:', error)
    return null
  }

  // Transform nested data structure and filter active faculty
  const { faculty_research_areas, ...areaData } = area
  return {
    ...areaData,
    faculty: (faculty_research_areas || [])
      .map((fra: { faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'photo_url' | 'active'> | null }) => fra.faculty)
      .filter((f): f is Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'photo_url' | 'active'> => f !== null && f.active === true)
      .map(({ active: _active, ...rest }) => rest) // Remove active field from output
  }
}

/**
 * Get research areas grouped by category
 */
export async function getResearchAreasByCategory(): Promise<Record<string, ResearchArea[]>> {
  const supabase = await createClient()

  const { data: areas, error } = await supabase
    .from('research_areas')
    .select('*')
    .order('order_index', { ascending: true })
    .order('name', { ascending: true })

  if (error || !areas) {
    return {}
  }

  // Group by category
  return areas.reduce((acc, area) => {
    const category = area.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(area)
    return acc
  }, {} as Record<string, ResearchArea[]>)
}

/**
 * Get all research area slugs for static generation
 * Uses createStaticClient to avoid cookie issues during build
 */
export async function getAllResearchAreaSlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('research_areas')
    .select('slug')
    .not('slug', 'is', null)

  if (error || !data) {
    return []
  }

  return data.map(r => r.slug).filter((slug): slug is string => slug !== null)
}
