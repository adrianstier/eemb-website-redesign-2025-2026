import { createClient } from '@/lib/supabase/server'

export type Memorial = {
  id: number
  name: string
  title: string | null
  birth_year: number | null
  death_year: number | null
  photo_url: string | null
  bio: string | null
  legacy: string | null
  research_areas: string[] | null
  external_links: { title: string; url: string }[] | null
  slug: string
  display_order: number | null
  created_at: string | null
  updated_at: string | null
}

/**
 * Get all memorials ordered by display_order
 */
export async function getAllMemorials(): Promise<Memorial[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('memorials')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching memorials:', error)
    return []
  }

  return (data as Memorial[]) || []
}

/**
 * Get a single memorial by slug
 */
export async function getMemorialBySlug(slug: string): Promise<Memorial | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('memorials')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching memorial by slug:', error)
    return null
  }

  return data as Memorial
}
