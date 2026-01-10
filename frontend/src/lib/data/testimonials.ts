import { createClient } from '@/lib/supabase/server'
import type { StudentTestimonial, GraduateStudent } from '@/lib/supabase/types'

export type TestimonialWithStudent = StudentTestimonial & {
  student: Pick<GraduateStudent, 'id' | 'first_name' | 'last_name' | 'photo_url' | 'degree_program' | 'slug'> | null
}

/**
 * Get all testimonials with student info
 */
export async function getAllTestimonials(): Promise<TestimonialWithStudent[]> {
  const supabase = await createClient()

  const { data: testimonials, error } = await supabase
    .from('student_testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }

  // Get student info for each testimonial
  const testimonialsWithStudents = await Promise.all(
    testimonials.map(async (testimonial) => {
      let student: TestimonialWithStudent['student'] = null
      if (testimonial.student_id) {
        const { data: studentData } = await supabase
          .from('graduate_students')
          .select('id, first_name, last_name, photo_url, degree_program, slug')
          .eq('id', testimonial.student_id)
          .single()
        student = studentData
      }
      return { ...testimonial, student }
    })
  )

  return testimonialsWithStudents
}

/**
 * Get featured testimonials (for graduate program page)
 */
export async function getFeaturedTestimonials(limit: number = 3): Promise<TestimonialWithStudent[]> {
  const supabase = await createClient()

  const { data: testimonials, error } = await supabase
    .from('student_testimonials')
    .select('*')
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(limit)

  if (error || !testimonials) {
    return []
  }

  // Get student info for each testimonial
  const testimonialsWithStudents = await Promise.all(
    testimonials.map(async (testimonial) => {
      let student: TestimonialWithStudent['student'] = null
      if (testimonial.student_id) {
        const { data: studentData } = await supabase
          .from('graduate_students')
          .select('id, first_name, last_name, photo_url, degree_program, slug')
          .eq('id', testimonial.student_id)
          .single()
        student = studentData
      }
      return { ...testimonial, student }
    })
  )

  return testimonialsWithStudents
}
