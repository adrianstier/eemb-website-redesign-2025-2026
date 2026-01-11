import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { GraduateStudent, ResearchArea, Faculty } from '@/lib/supabase/types'

export type StudentWithDetails = GraduateStudent & {
  research_areas: ResearchArea[]
  advisor: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'full_name' | 'photo_url' | 'title'> | null
}

// Type for the nested select result from Supabase
type StudentWithNestedDetails = GraduateStudent & {
  student_research_areas: Array<{
    research_areas: ResearchArea
  }>
  faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'full_name' | 'photo_url' | 'title'> | null
}

/**
 * Transform the nested Supabase result into our StudentWithDetails type
 */
function transformStudentWithDetails(student: StudentWithNestedDetails): StudentWithDetails {
  const { student_research_areas, faculty, ...rest } = student
  return {
    ...rest,
    research_areas: student_research_areas?.map(sra => sra.research_areas).filter(Boolean) || [],
    advisor: faculty
  }
}

/**
 * Get all active graduate students with their research areas and advisor
 * Uses a single query with nested selects (no N+1 problem)
 */
export async function getAllStudents(): Promise<StudentWithDetails[]> {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('graduate_students')
    .select(`
      *,
      student_research_areas(
        research_areas(*)
      ),
      faculty:advisor_id(
        id,
        first_name,
        last_name,
        slug,
        full_name,
        photo_url,
        title
      )
    `)
    .eq('active', true)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching students:', error)
    return []
  }

  return (students as StudentWithNestedDetails[] || []).map(transformStudentWithDetails)
}

/**
 * Get a single student by slug with full details
 * Uses a single query with nested selects
 */
export async function getStudentBySlug(slug: string): Promise<StudentWithDetails | null> {
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('graduate_students')
    .select(`
      *,
      student_research_areas(
        research_areas(*)
      ),
      faculty:advisor_id(
        id,
        first_name,
        last_name,
        slug,
        full_name,
        photo_url,
        title
      )
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !student) {
    console.error('Error fetching student by slug:', error)
    return null
  }

  return transformStudentWithDetails(student as StudentWithNestedDetails)
}

/**
 * Get students by advisor
 * Uses a single query with nested selects
 */
export async function getStudentsByAdvisor(advisorId: number): Promise<StudentWithDetails[]> {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('graduate_students')
    .select(`
      *,
      student_research_areas(
        research_areas(*)
      ),
      faculty:advisor_id(
        id,
        first_name,
        last_name,
        slug,
        full_name,
        photo_url,
        title
      )
    `)
    .eq('active', true)
    .eq('advisor_id', advisorId)
    .order('last_name', { ascending: true })

  if (error || !students) {
    return []
  }

  return (students as StudentWithNestedDetails[] || []).map(transformStudentWithDetails)
}

/**
 * Get students by degree program
 * Uses a single query with nested selects
 */
export async function getStudentsByProgram(program: 'PhD' | 'MS' | 'Combined BS-MS'): Promise<StudentWithDetails[]> {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('graduate_students')
    .select(`
      *,
      student_research_areas(
        research_areas(*)
      ),
      faculty:advisor_id(
        id,
        first_name,
        last_name,
        slug,
        full_name,
        photo_url,
        title
      )
    `)
    .eq('active', true)
    .eq('degree_program', program)
    .order('last_name', { ascending: true })

  if (error || !students) {
    return []
  }

  return (students as StudentWithNestedDetails[] || []).map(transformStudentWithDetails)
}

/**
 * Get all student slugs for static generation
 * Uses createStaticClient to avoid cookie issues during build
 */
export async function getAllStudentSlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('graduate_students')
    .select('slug')
    .eq('active', true)
    .not('slug', 'is', null)

  if (error || !data) {
    return []
  }

  return data.map(s => s.slug).filter((slug): slug is string => slug !== null)
}
