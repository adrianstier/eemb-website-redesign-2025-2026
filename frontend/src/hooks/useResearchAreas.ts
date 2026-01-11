'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ResearchArea } from '@/lib/supabase/types'

/**
 * Client-side hook for fetching all research areas
 * Uses the browser Supabase client for client components
 */
export function useResearchAreas() {
  const [areas, setAreas] = useState<ResearchArea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResearchAreas() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        const { data, error: fetchError } = await supabase
          .from('research_areas')
          .select('*')
          .order('order_index', { ascending: true })
          .order('name', { ascending: true })

        if (fetchError) {
          console.error('Error fetching research areas:', fetchError)
          setError(fetchError.message)
          setAreas([])
          return
        }

        setAreas(data || [])
      } catch (err) {
        console.error('Error in useResearchAreas:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch research areas')
        setAreas([])
      } finally {
        setLoading(false)
      }
    }

    fetchResearchAreas()
  }, [])

  return { areas, loading, error }
}

/**
 * Hook for fetching faculty IDs associated with a research area
 */
export function useFacultyByResearchArea(areaId: number | null) {
  const [facultyIds, setFacultyIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (areaId === null) {
      setFacultyIds([])
      return
    }

    const currentAreaId = areaId // Capture the non-null value

    async function fetchFacultyIds() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        const { data, error: fetchError } = await supabase
          .from('faculty_research_areas')
          .select('faculty_id')
          .eq('research_area_id', currentAreaId)

        if (fetchError) {
          console.error('Error fetching faculty by research area:', fetchError)
          setError(fetchError.message)
          setFacultyIds([])
          return
        }

        setFacultyIds((data || []).map(row => row.faculty_id))
      } catch (err) {
        console.error('Error in useFacultyByResearchArea:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch faculty')
        setFacultyIds([])
      } finally {
        setLoading(false)
      }
    }

    fetchFacultyIds()
  }, [areaId])

  return { facultyIds, loading, error }
}

/**
 * Hook for fetching all faculty-research area associations (for bulk filtering)
 */
export function useFacultyResearchAreaMap() {
  const [facultyAreaMap, setFacultyAreaMap] = useState<Map<number, number[]>>(new Map())
  const [areaFacultyMap, setAreaFacultyMap] = useState<Map<number, number[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAssociations() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        const { data, error: fetchError } = await supabase
          .from('faculty_research_areas')
          .select('faculty_id, research_area_id')

        if (fetchError) {
          console.error('Error fetching faculty-research associations:', fetchError)
          setError(fetchError.message)
          return
        }

        // Build both maps
        const newFacultyAreaMap = new Map<number, number[]>()
        const newAreaFacultyMap = new Map<number, number[]>()

        for (const row of data || []) {
          // Faculty -> Areas map
          if (!newFacultyAreaMap.has(row.faculty_id)) {
            newFacultyAreaMap.set(row.faculty_id, [])
          }
          newFacultyAreaMap.get(row.faculty_id)!.push(row.research_area_id)

          // Area -> Faculty map
          if (!newAreaFacultyMap.has(row.research_area_id)) {
            newAreaFacultyMap.set(row.research_area_id, [])
          }
          newAreaFacultyMap.get(row.research_area_id)!.push(row.faculty_id)
        }

        setFacultyAreaMap(newFacultyAreaMap)
        setAreaFacultyMap(newAreaFacultyMap)
      } catch (err) {
        console.error('Error in useFacultyResearchAreaMap:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch associations')
      } finally {
        setLoading(false)
      }
    }

    fetchAssociations()
  }, [])

  return { facultyAreaMap, areaFacultyMap, loading, error }
}
