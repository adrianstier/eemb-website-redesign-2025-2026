import { createClient } from '@/lib/supabase/server'
import type { StudentTestimonial, GraduateStudent } from '@/lib/supabase/types'

export type TestimonialWithStudent = StudentTestimonial & {
  student: Pick<GraduateStudent, 'id' | 'first_name' | 'last_name' | 'photo_url' | 'degree_program' | 'slug'> | null
}

// Type for nested select result
type TestimonialWithNestedStudent = StudentTestimonial & {
  student_data: Pick<GraduateStudent, 'id' | 'first_name' | 'last_name' | 'photo_url' | 'degree_program' | 'slug'> | null
}

/**
 * Transform the nested Supabase result into our TestimonialWithStudent type
 */
function transformTestimonialWithStudent(testimonial: TestimonialWithNestedStudent): TestimonialWithStudent {
  const { student_data, ...rest } = testimonial
  return {
    ...rest,
    student: student_data
  }
}

/**
 * Get all testimonials with student info
 * Uses a single query with nested selects (no N+1 problem)
 */
export async function getAllTestimonials(): Promise<TestimonialWithStudent[]> {
  const supabase = await createClient()

  const { data: testimonials, error } = await supabase
    .from('student_testimonials')
    .select(`
      *,
      student_data:student_id(
        id,
        first_name,
        last_name,
        photo_url,
        degree_program,
        slug
      )
    `)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }

  return (testimonials as TestimonialWithNestedStudent[] || []).map(transformTestimonialWithStudent)
}

/**
 * Get featured testimonials (for graduate program page)
 * Uses a single query with nested selects
 */
export async function getFeaturedTestimonials(limit: number = 3): Promise<TestimonialWithStudent[]> {
  const supabase = await createClient()

  const { data: testimonials, error } = await supabase
    .from('student_testimonials')
    .select(`
      *,
      student_data:student_id(
        id,
        first_name,
        last_name,
        photo_url,
        degree_program,
        slug
      )
    `)
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(limit)

  if (error || !testimonials) {
    return []
  }

  return (testimonials as TestimonialWithNestedStudent[] || []).map(transformTestimonialWithStudent)
}
