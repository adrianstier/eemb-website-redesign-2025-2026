import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { ResearchArea, Faculty } from '@/lib/supabase/types'

export type ResearchAreaWithFaculty = ResearchArea & {
  faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'photo_url'>[]
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
 * Get featured research areas (for homepage)
 */
export async function getFeaturedResearchAreas(): Promise<ResearchAreaWithFaculty[]> {
  const supabase = await createClient()

  const { data: areas, error } = await supabase
    .from('research_areas')
    .select('*')
    .eq('featured', true)
    .order('order_index', { ascending: true })

  if (error || !areas) {
    return []
  }

  // Get faculty for each area
  const areasWithFaculty = await Promise.all(
    areas.map(async (area) => {
      const { data: facultyIds } = await supabase
        .from('faculty_research_areas')
        .select('faculty_id')
        .eq('research_area_id', area.id)

      if (!facultyIds || facultyIds.length === 0) {
        return { ...area, faculty: [] }
      }

      const { data: faculty } = await supabase
        .from('faculty')
        .select('id, first_name, last_name, slug, photo_url')
        .in('id', facultyIds.map(f => f.faculty_id))
        .eq('active', true)

      return { ...area, faculty: faculty || [] }
    })
  )

  return areasWithFaculty
}

/**
 * Get a single research area by slug with associated faculty
 */
export async function getResearchAreaBySlug(slug: string): Promise<ResearchAreaWithFaculty | null> {
  const supabase = await createClient()

  const { data: area, error } = await supabase
    .from('research_areas')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !area) {
    console.error('Error fetching research area by slug:', error)
    return null
  }

  // Get faculty for this area
  const { data: facultyIds } = await supabase
    .from('faculty_research_areas')
    .select('faculty_id')
    .eq('research_area_id', area.id)

  if (!facultyIds || facultyIds.length === 0) {
    return { ...area, faculty: [] }
  }

  const { data: faculty } = await supabase
    .from('faculty')
    .select('id, first_name, last_name, slug, photo_url')
    .in('id', facultyIds.map(f => f.faculty_id))
    .eq('active', true)

  return { ...area, faculty: faculty || [] }
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
