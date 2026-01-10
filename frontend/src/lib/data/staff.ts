import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { Staff, Database } from '@/lib/supabase/types'

type Department = Database['public']['Enums']['department']

/**
 * Get all active staff members
 */
export async function getAllStaff(): Promise<Staff[]> {
  const supabase = await createClient()

  const { data: staff, error } = await supabase
    .from('staff')
    .select('*')
    .eq('active', true)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching staff:', error)
    return []
  }

  return staff
}

/**
 * Get a single staff member by slug
 */
export async function getStaffBySlug(slug: string): Promise<Staff | null> {
  const supabase = await createClient()

  const { data: staff, error } = await supabase
    .from('staff')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !staff) {
    console.error('Error fetching staff by slug:', error)
    return null
  }

  return staff
}

/**
 * Get staff by department
 */
export async function getStaffByDepartment(department: Department): Promise<Staff[]> {
  const supabase = await createClient()

  const { data: staff, error } = await supabase
    .from('staff')
    .select('*')
    .eq('active', true)
    .eq('department', department)
    .order('last_name', { ascending: true })

  if (error || !staff) {
    return []
  }

  return staff
}

/**
 * Get all staff slugs for static generation
 * Uses createStaticClient to avoid cookie issues during build
 */
export async function getAllStaffSlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('staff')
    .select('slug')
    .eq('active', true)
    .not('slug', 'is', null)

  if (error || !data) {
    return []
  }

  return data.map(s => s.slug).filter((slug): slug is string => slug !== null)
}
