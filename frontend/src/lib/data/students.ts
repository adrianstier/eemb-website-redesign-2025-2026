import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { GraduateStudent, ResearchArea, Faculty } from '@/lib/supabase/types'

export type StudentWithDetails = GraduateStudent & {
  research_areas: ResearchArea[]
  advisor: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug' | 'full_name' | 'photo_url' | 'title'> | null
}

/**
 * Get all active graduate students with their research areas and advisor
 */
export async function getAllStudents(): Promise<StudentWithDetails[]> {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('graduate_students')
    .select('*')
    .eq('active', true)
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching students:', error)
    return []
  }

  // Get research areas and advisor for each student
  const studentsWithDetails = await Promise.all(
    students.map(async (student) => {
      // Get research areas
      const { data: researchAreaIds } = await supabase
        .from('student_research_areas')
        .select('research_area_id')
        .eq('student_id', student.id)

      let researchAreas: ResearchArea[] = []
      if (researchAreaIds && researchAreaIds.length > 0) {
        const { data: areas } = await supabase
          .from('research_areas')
          .select('*')
          .in('id', researchAreaIds.map(r => r.research_area_id))
        researchAreas = areas || []
      }

      // Get advisor info
      let advisor: StudentWithDetails['advisor'] = null
      if (student.advisor_id) {
        const { data: advisorData } = await supabase
          .from('faculty')
          .select('id, first_name, last_name, slug, full_name, photo_url, title')
          .eq('id', student.advisor_id)
          .single()
        advisor = advisorData
      }

      return { ...student, research_areas: researchAreas, advisor }
    })
  )

  return studentsWithDetails
}

/**
 * Get a single student by slug with full details
 */
export async function getStudentBySlug(slug: string): Promise<StudentWithDetails | null> {
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('graduate_students')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !student) {
    console.error('Error fetching student by slug:', error)
    return null
  }

  // Get research areas
  const { data: researchAreaIds } = await supabase
    .from('student_research_areas')
    .select('research_area_id')
    .eq('student_id', student.id)

  let researchAreas: ResearchArea[] = []
  if (researchAreaIds && researchAreaIds.length > 0) {
    const { data: areas } = await supabase
      .from('research_areas')
      .select('*')
      .in('id', researchAreaIds.map(r => r.research_area_id))
    researchAreas = areas || []
  }

  // Get advisor info
  let advisor: StudentWithDetails['advisor'] = null
  if (student.advisor_id) {
    const { data: advisorData } = await supabase
      .from('faculty')
      .select('id, first_name, last_name, slug, full_name, photo_url, title')
      .eq('id', student.advisor_id)
      .single()
    advisor = advisorData
  }

  return { ...student, research_areas: researchAreas, advisor }
}

/**
 * Get students by advisor
 */
export async function getStudentsByAdvisor(advisorId: number): Promise<StudentWithDetails[]> {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('graduate_students')
    .select('*')
    .eq('active', true)
    .eq('advisor_id', advisorId)
    .order('last_name', { ascending: true })

  if (error || !students) {
    return []
  }

  // Get research areas for each student
  const studentsWithDetails = await Promise.all(
    students.map(async (student) => {
      const { data: researchAreaIds } = await supabase
        .from('student_research_areas')
        .select('research_area_id')
        .eq('student_id', student.id)

      let researchAreas: ResearchArea[] = []
      if (researchAreaIds && researchAreaIds.length > 0) {
        const { data: areas } = await supabase
          .from('research_areas')
          .select('*')
          .in('id', researchAreaIds.map(r => r.research_area_id))
        researchAreas = areas || []
      }

      // Get advisor info
      const { data: advisorData } = await supabase
        .from('faculty')
        .select('id, first_name, last_name, slug, full_name, photo_url, title')
        .eq('id', advisorId)
        .single()

      return { ...student, research_areas: researchAreas, advisor: advisorData }
    })
  )

  return studentsWithDetails
}

/**
 * Get students by degree program
 */
export async function getStudentsByProgram(program: 'PhD' | 'MS' | 'Combined BS-MS'): Promise<StudentWithDetails[]> {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('graduate_students')
    .select('*')
    .eq('active', true)
    .eq('degree_program', program)
    .order('last_name', { ascending: true })

  if (error || !students) {
    return []
  }

  // Get details for each student
  const studentsWithDetails = await Promise.all(
    students.map(async (student) => {
      const { data: researchAreaIds } = await supabase
        .from('student_research_areas')
        .select('research_area_id')
        .eq('student_id', student.id)

      let researchAreas: ResearchArea[] = []
      if (researchAreaIds && researchAreaIds.length > 0) {
        const { data: areas } = await supabase
          .from('research_areas')
          .select('*')
          .in('id', researchAreaIds.map(r => r.research_area_id))
        researchAreas = areas || []
      }

      let advisor: StudentWithDetails['advisor'] = null
      if (student.advisor_id) {
        const { data: advisorData } = await supabase
          .from('faculty')
          .select('id, first_name, last_name, slug, full_name, photo_url, title')
          .eq('id', student.advisor_id)
          .single()
        advisor = advisorData
      }

      return { ...student, research_areas: researchAreas, advisor }
    })
  )

  return studentsWithDetails
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
