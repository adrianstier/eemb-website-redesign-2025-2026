/**
 * Event-specific utilities and API functions
 */

import { get, post, put, del, APIResponse } from './api'

// Event types
export interface Event {
  id: number
  attributes: {
    title: string
    description?: string
    fullDescription?: string
    startDate: string
    endDate?: string
    location?: string
    eventType?: string
    slug: string
    image?: string
    isFeatured?: boolean
    speaker?: string
    speakerBio?: string
    speakerAffiliation?: string
    contactEmail?: string
    registrationLink?: string
    tags?: string[]
    relatedLinks?: { title: string; url: string }[]
    attachments?: { title: string; url: string }[]
    capacity?: number
    registeredCount?: number
    isOnline?: boolean
    zoomLink?: string
    recordingAvailable?: boolean
    recordingLink?: string
  }
}

export type EventType =
  | 'Seminar'
  | 'Workshop'
  | 'Symposium'
  | 'Lecture'
  | 'Field Trip'
  | 'Defense'
  | 'Social'
  | 'Conference'
  | 'Other'

export interface EventFilters {
  eventType?: EventType
  startDate?: string
  endDate?: string
  tags?: string[]
  featured?: boolean
  hasRecording?: boolean
  isOnline?: boolean
  search?: string
}

// API functions
export const eventsAPI = {
  /**
   * Get all events with optional filters
   */
  getAll: async (filters?: EventFilters, limit = 50) => {
    const params: Record<string, any> = {
      'pagination[limit]': limit,
      'sort': 'startDate:asc',
      'populate': '*'
    }

    // Add filters
    if (filters) {
      if (filters.eventType) {
        params['filters[eventType][$eq]'] = filters.eventType
      }
      if (filters.featured !== undefined) {
        params['filters[isFeatured][$eq]'] = filters.featured
      }
      if (filters.isOnline !== undefined) {
        params['filters[isOnline][$eq]'] = filters.isOnline
      }
      if (filters.hasRecording) {
        params['filters[recordingAvailable][$eq]'] = true
      }
      if (filters.startDate) {
        params['filters[startDate][$gte]'] = filters.startDate
      }
      if (filters.endDate) {
        params['filters[endDate][$lte]'] = filters.endDate
      }
      if (filters.search) {
        params['filters[$or][0][title][$containsi]'] = filters.search
        params['filters[$or][1][description][$containsi]'] = filters.search
        params['filters[$or][2][speaker][$containsi]'] = filters.search
      }
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach((tag, index) => {
          params[`filters[tags][$contains][${index}]`] = tag
        })
      }
    }

    return get<APIResponse<Event[]>>('/api/events', params)
  },

  /**
   * Get a single event by slug
   */
  getBySlug: async (slug: string) => {
    const params = {
      'filters[slug][$eq]': slug,
      'populate': '*'
    }
    const response = await get<APIResponse<Event[]>>('/api/events', params)
    return response.data[0] || null
  },

  /**
   * Get upcoming events
   */
  getUpcoming: async (limit = 10) => {
    const now = new Date().toISOString()
    return eventsAPI.getAll({ startDate: now }, limit)
  },

  /**
   * Get past events
   */
  getPast: async (limit = 10) => {
    const now = new Date().toISOString()
    const params = {
      'pagination[limit]': limit,
      'sort': 'startDate:desc',
      'populate': '*',
      'filters[startDate][$lt]': now
    }
    return get<APIResponse<Event[]>>('/api/events', params)
  },

  /**
   * Get featured events
   */
  getFeatured: async (limit = 5) => {
    return eventsAPI.getAll({ featured: true }, limit)
  },

  /**
   * Create a new event (admin only)
   */
  create: async (eventData: Partial<Event['attributes']>) => {
    // Generate slug if not provided
    if (!eventData.slug && eventData.title) {
      eventData.slug = generateSlug(eventData.title)
    }

    return post<APIResponse<Event>>('/api/events', {
      data: eventData
    })
  },

  /**
   * Update an existing event (admin only)
   */
  update: async (id: number, eventData: Partial<Event['attributes']>) => {
    return put<APIResponse<Event>>(`/api/events/${id}`, {
      data: eventData
    })
  },

  /**
   * Delete an event (admin only)
   */
  delete: async (id: number) => {
    return del<APIResponse<Event>>(`/api/events/${id}`)
  },

  /**
   * Register for an event
   */
  register: async (eventId: number, registrationData: {
    name: string
    email: string
    affiliation?: string
    dietary?: string
    accessibility?: string
    comments?: string
  }) => {
    return post('/api/event-registrations', {
      data: {
        event: eventId,
        ...registrationData,
        registeredAt: new Date().toISOString()
      }
    })
  },

  /**
   * Parse event text using AI
   */
  parseEventText: async (text: string) => {
    // In production, this would call an AI API endpoint
    // For now, we'll do client-side parsing

    const parsed: Partial<Event['attributes']> = {
      title: '',
      speaker: '',
      startDate: '',
      location: '',
      description: '',
      eventType: 'Seminar',
      tags: []
    }

    // Extract title (usually first line or quoted text)
    const titleMatch = text.match(/"([^"]+)"|^([^\n]+)/m)
    if (titleMatch) {
      parsed.title = (titleMatch[1] || titleMatch[2]).trim()
    }

    // Extract speaker
    const speakerMatch = text.match(/(Dr\.|Prof\.|Professor)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:,\s*([^,\n]+))?/m)
    if (speakerMatch) {
      parsed.speaker = `${speakerMatch[1] || ''} ${speakerMatch[2]}`.trim()
      if (speakerMatch[3]) {
        parsed.speakerAffiliation = speakerMatch[3].trim()
      }
    }

    // Extract date and time
    const dateTimeMatch = text.match(/([A-Z][a-z]+day,?\s+)?([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})(?:,?\s+(?:at\s+)?(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)))?/m)
    if (dateTimeMatch) {
      const dateStr = dateTimeMatch[2]
      const timeStr = dateTimeMatch[3]

      // Parse date
      const date = new Date(dateStr)
      if (timeStr) {
        const [time, period] = timeStr.split(/\s+/)
        const [hours, minutes] = time.split(':').map(Number)
        let hour = hours
        if (period?.toLowerCase().includes('pm') && hours !== 12) hour += 12
        if (period?.toLowerCase().includes('am') && hours === 12) hour = 0
        date.setHours(hour, minutes)
      }

      parsed.startDate = date.toISOString()
    }

    // Extract location
    const locationPatterns = [
      /(?:Location:|Room|Building|at|@)\s*([^\n]+)/i,
      /(Life Sciences Building|Marine Science Institute|MSI|LSB|Bren Hall|Noble Hall)[^,\n]*/i,
    ]

    for (const pattern of locationPatterns) {
      const match = text.match(pattern)
      if (match) {
        parsed.location = match[1].trim()
        break
      }
    }

    // Extract description
    const lines = text.split('\n').filter(line => line.trim())
    const descStart = lines.findIndex(line =>
      line.length > 30 &&
      !line.match(/^(Dr\.|Prof\.|Date:|Time:|Location:|RSVP:|Register|When:|Where:|Who:)/i)
    )
    if (descStart >= 0) {
      parsed.description = lines.slice(descStart, descStart + 3).join(' ').trim()
    }

    // Determine event type
    const eventTypes: Record<string, EventType> = {
      'seminar': 'Seminar',
      'symposium': 'Symposium',
      'workshop': 'Workshop',
      'field trip': 'Field Trip',
      'lecture': 'Lecture',
      'defense': 'Defense',
      'conference': 'Conference',
      'social': 'Social'
    }

    for (const [keyword, type] of Object.entries(eventTypes)) {
      if (text.toLowerCase().includes(keyword)) {
        parsed.eventType = type
        break
      }
    }

    // Extract email
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)
    if (emailMatch) {
      parsed.contactEmail = emailMatch[1]
    }

    // Extract registration link
    const urlMatch = text.match(/https?:\/\/[^\s]+/)
    if (urlMatch) {
      parsed.registrationLink = urlMatch[0]
    }

    // Generate tags based on content
    const tagKeywords: Record<string, string> = {
      'ocean|marine|sea|coral|reef': 'Marine Biology',
      'ecology|ecosystem|habitat': 'Ecology',
      'evolution|adaptation|selection': 'Evolution',
      'climate|warming|acidification|carbon': 'Climate Science',
      'conservation|endangered|protection': 'Conservation',
      'graduate|phd|thesis|dissertation': 'Graduate Research',
      'undergrad|undergraduate': 'Undergraduate',
      'biodiversity|species': 'Biodiversity',
      'genomics|genetics|dna': 'Genetics',
      'microbio|bacteria|microbe': 'Microbiology'
    }

    const tags = new Set<string>()
    for (const [pattern, tag] of Object.entries(tagKeywords)) {
      if (new RegExp(pattern, 'i').test(text)) {
        tags.add(tag)
      }
    }
    parsed.tags = Array.from(tags)

    return parsed
  }
}

// Utility functions

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .trim()
}

/**
 * Format event date range for display
 */
export function formatEventDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }

  if (!end) {
    return start.toLocaleDateString('en-US', formatOptions)
  }

  // Same day event
  if (start.toDateString() === end.toDateString()) {
    const startTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
    const endTime = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
    const date = start.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    return `${date}, ${startTime} - ${endTime}`
  }

  // Multi-day event
  const startStr = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  return `${startStr} - ${endStr}`
}

/**
 * Check if an event is happening now
 */
export function isEventHappeningNow(startDate: string, endDate?: string): boolean {
  const now = new Date()
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 60 * 60 * 1000) // Default 1 hour

  return now >= start && now <= end
}

/**
 * Check if an event is upcoming
 */
export function isEventUpcoming(startDate: string): boolean {
  return new Date(startDate) > new Date()
}

/**
 * Check if an event is past
 */
export function isEventPast(endDate?: string, startDate?: string): boolean {
  const checkDate = endDate || startDate
  if (!checkDate) return false
  return new Date(checkDate) < new Date()
}

/**
 * Group events by month
 */
export function groupEventsByMonth(events: Event[]): Record<string, Event[]> {
  const grouped: Record<string, Event[]> = {}

  events.forEach(event => {
    const date = new Date(event.attributes.startDate)
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

    if (!grouped[monthKey]) {
      grouped[monthKey] = []
    }
    grouped[monthKey].push(event)
  })

  return grouped
}

/**
 * Get event color based on type
 */
export function getEventTypeColor(eventType?: string): string {
  const colors: Record<string, string> = {
    'Seminar': 'bg-ocean-blue',
    'Workshop': 'bg-ucsb-coral',
    'Symposium': 'bg-purple-600',
    'Lecture': 'bg-green-600',
    'Field Trip': 'bg-yellow-600',
    'Defense': 'bg-red-600',
    'Social': 'bg-pink-600',
    'Conference': 'bg-indigo-600',
    'Other': 'bg-gray-600'
  }

  return colors[eventType || 'Other'] || colors['Other']
}

/**
 * Export event to ICS format
 */
export function exportToICS(event: Event): string {
  const startDate = new Date(event.attributes.startDate)
  const endDate = event.attributes.endDate
    ? new Date(event.attributes.endDate)
    : new Date(startDate.getTime() + 60 * 60 * 1000)

  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//UCSB EEMB//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@eemb.ucsb.edu
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.attributes.title}
DESCRIPTION:${event.attributes.description?.replace(/\n/g, '\\n') || ''}
LOCATION:${event.attributes.location || 'TBD'}
${event.attributes.registrationLink ? `URL:${event.attributes.registrationLink}` : ''}
END:VEVENT
END:VCALENDAR`
}