import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { Event, Faculty, Database } from '@/lib/supabase/types'

type EventType = Database['public']['Enums']['event_type']

export type EventWithHost = Event & {
  host: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug'> | null
}

/**
 * Get upcoming events (not canceled)
 */
export async function getUpcomingEvents(options?: {
  limit?: number
  eventType?: EventType
}): Promise<EventWithHost[]> {
  const supabase = await createClient()

  const now = new Date().toISOString()

  let query = supabase
    .from('events')
    .select('*')
    .gte('start_date', now)
    .or('canceled.is.null,canceled.eq.false')
    .order('start_date', { ascending: true })

  if (options?.eventType) {
    query = query.eq('event_type', options.eventType)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data: events, error } = await query

  if (error) {
    console.error('Error fetching upcoming events:', error)
    return []
  }

  // Get host info for each event
  const eventsWithHost = await Promise.all(
    events.map(async (event) => {
      let host: EventWithHost['host'] = null
      if (event.host_faculty_id) {
        const { data: hostData } = await supabase
          .from('faculty')
          .select('id, first_name, last_name, slug')
          .eq('id', event.host_faculty_id)
          .single()
        host = hostData
      }
      return { ...event, host }
    })
  )

  return eventsWithHost
}

/**
 * Get past events
 */
export async function getPastEvents(options?: {
  limit?: number
  offset?: number
  eventType?: EventType
}): Promise<EventWithHost[]> {
  const supabase = await createClient()

  const now = new Date().toISOString()

  let query = supabase
    .from('events')
    .select('*')
    .lt('start_date', now)
    .or('canceled.is.null,canceled.eq.false')
    .order('start_date', { ascending: false })

  if (options?.eventType) {
    query = query.eq('event_type', options.eventType)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data: events, error } = await query

  if (error) {
    console.error('Error fetching past events:', error)
    return []
  }

  // Get host info for each event
  const eventsWithHost = await Promise.all(
    events.map(async (event) => {
      let host: EventWithHost['host'] = null
      if (event.host_faculty_id) {
        const { data: hostData } = await supabase
          .from('faculty')
          .select('id, first_name, last_name, slug')
          .eq('id', event.host_faculty_id)
          .single()
        host = hostData
      }
      return { ...event, host }
    })
  )

  return eventsWithHost
}

/**
 * Get a single event by slug
 */
export async function getEventBySlug(slug: string): Promise<EventWithHost | null> {
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !event) {
    console.error('Error fetching event by slug:', error)
    return null
  }

  // Get host info
  let host: EventWithHost['host'] = null
  if (event.host_faculty_id) {
    const { data: hostData } = await supabase
      .from('faculty')
      .select('id, first_name, last_name, slug')
      .eq('id', event.host_faculty_id)
      .single()
    host = hostData
  }

  return { ...event, host }
}

/**
 * Get featured events (for homepage)
 */
export async function getFeaturedEvents(limit: number = 3): Promise<EventWithHost[]> {
  const supabase = await createClient()

  const now = new Date().toISOString()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', now)
    .eq('featured', true)
    .or('canceled.is.null,canceled.eq.false')
    .order('start_date', { ascending: true })
    .limit(limit)

  if (error || !events) {
    return []
  }

  // Get host info for each event
  const eventsWithHost = await Promise.all(
    events.map(async (event) => {
      let host: EventWithHost['host'] = null
      if (event.host_faculty_id) {
        const { data: hostData } = await supabase
          .from('faculty')
          .select('id, first_name, last_name, slug')
          .eq('id', event.host_faculty_id)
          .single()
        host = hostData
      }
      return { ...event, host }
    })
  )

  return eventsWithHost
}

/**
 * Get events by date range (for calendar view)
 */
export async function getEventsByDateRange(
  startDate: string,
  endDate: string
): Promise<EventWithHost[]> {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', startDate)
    .lte('start_date', endDate)
    .or('canceled.is.null,canceled.eq.false')
    .order('start_date', { ascending: true })

  if (error) {
    console.error('Error fetching events by date range:', error)
    return []
  }

  // Get host info for each event
  const eventsWithHost = await Promise.all(
    events.map(async (event) => {
      let host: EventWithHost['host'] = null
      if (event.host_faculty_id) {
        const { data: hostData } = await supabase
          .from('faculty')
          .select('id, first_name, last_name, slug')
          .eq('id', event.host_faculty_id)
          .single()
        host = hostData
      }
      return { ...event, host }
    })
  )

  return eventsWithHost
}

/**
 * Get all events (for calendar view)
 */
export async function getAllEvents(): Promise<EventWithHost[]> {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .or('canceled.is.null,canceled.eq.false')
    .order('start_date', { ascending: true })

  if (error) {
    console.error('Error fetching all events:', error)
    return []
  }

  // Get host info for each event
  const eventsWithHost = await Promise.all(
    events.map(async (event) => {
      let host: EventWithHost['host'] = null
      if (event.host_faculty_id) {
        const { data: hostData } = await supabase
          .from('faculty')
          .select('id, first_name, last_name, slug')
          .eq('id', event.host_faculty_id)
          .single()
        host = hostData
      }
      return { ...event, host }
    })
  )

  return eventsWithHost
}

/**
 * Get all event slugs for static generation
 * Uses createStaticClient to avoid cookie issues during build
 */
export async function getAllEventSlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('events')
    .select('slug')
    .not('slug', 'is', null)

  if (error || !data) {
    return []
  }

  return data.map(e => e.slug).filter((slug): slug is string => slug !== null)
}

/**
 * Get event types with counts
 */
export async function getEventTypes(): Promise<{ type: string; count: number }[]> {
  const supabase = await createClient()

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('events')
    .select('event_type')
    .gte('start_date', now)
    .or('canceled.is.null,canceled.eq.false')
    .not('event_type', 'is', null)

  if (error || !data) {
    return []
  }

  // Count by event type
  const typeCounts = data.reduce((acc, event) => {
    const type = event.event_type
    if (type) {
      acc[type] = (acc[type] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  return Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count
  }))
}
