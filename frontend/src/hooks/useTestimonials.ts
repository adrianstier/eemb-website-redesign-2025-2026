'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { StudentTestimonial, GraduateStudent } from '@/lib/supabase/types'

export type TestimonialWithStudent = StudentTestimonial & {
  student: Pick<GraduateStudent, 'id' | 'first_name' | 'last_name' | 'photo_url' | 'degree_program' | 'slug'> | null
}

// Type for nested select result
type TestimonialWithNestedStudent = StudentTestimonial & {
  student_data: Pick<GraduateStudent, 'id' | 'first_name' | 'last_name' | 'photo_url' | 'degree_program' | 'slug'> | null
}

/**
 * Client-side hook for fetching featured testimonials
 * Uses the browser Supabase client for client components
 */
export function useFeaturedTestimonials(limit: number = 3) {
  const [testimonials, setTestimonials] = useState<TestimonialWithStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        const { data, error: fetchError } = await supabase
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

        if (fetchError) {
          console.error('Error fetching testimonials:', fetchError)
          setError(fetchError.message)
          setTestimonials([])
          return
        }

        // Transform the nested result into our expected type
        const transformed = (data as TestimonialWithNestedStudent[] || []).map(
          (testimonial): TestimonialWithStudent => {
            const { student_data, ...rest } = testimonial
            return {
              ...rest,
              student: student_data
            }
          }
        )

        setTestimonials(transformed)
      } catch (err) {
        console.error('Error in useTestimonials:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch testimonials')
        setTestimonials([])
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [limit])

  return { testimonials, loading, error }
}
