'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Event {
  id: number
  attributes: {
    title: string
    startDate: string
    location?: string
    eventType?: string
    slug: string
  }
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const now = new Date().toISOString()
        const response = await fetch(`http://localhost:1337/api/events?filters[startDate][$gte]=${now}&pagination[limit]=4&sort=startDate:asc`)
        const data = await response.json()
        setEvents(data.data || [])
      } catch (error) {
        console.error('Error fetching events:', error)
        // Set placeholder data
        setEvents([
          {
            id: 1,
            attributes: {
              title: 'EEMB Seminar: Ocean Acidification Research',
              startDate: '2024-11-15T15:00:00Z',
              location: 'Life Sciences Building, Room 1001',
              eventType: 'Seminar',
              slug: 'ocean-acidification-seminar'
            }
          },
          {
            id: 2,
            attributes: {
              title: 'Graduate Student Symposium',
              startDate: '2024-11-20T09:00:00Z',
              location: 'Marine Science Institute',
              eventType: 'Symposium',
              slug: 'graduate-symposium'
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-ocean-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-ocean-sunset bg-opacity-10 rounded-full">
              <p className="text-sm font-semibold text-ocean-sunset uppercase tracking-wide">Events</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-blue mb-3 leading-tight">Upcoming Events</h2>
          </div>
          <div className="max-w-4xl mx-auto animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg h-28"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20 bg-ocean-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-3 px-3 py-1 bg-ocean-sunset bg-opacity-10 rounded-full">
            <p className="text-sm font-semibold text-ocean-sunset uppercase tracking-wide">Events</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-blue mb-3 leading-tight">Upcoming Events</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Seminars, symposia, thesis defenses, and other department events.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 border border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs bg-ocean-sunset/10 text-ocean-sunset px-3 py-1 rounded-full font-semibold">
                          {event.attributes.eventType || 'Event'}
                        </span>
                        <time className="text-xs text-gray-500">
                          {new Date(event.attributes.startDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </time>
                      </div>
                      <h3 className="text-lg font-bold text-ocean-blue mb-2">
                        <Link href={`/events/${event.attributes.slug}`} className="hover:text-ocean-teal transition-colors duration-150">
                          {event.attributes.title}
                        </Link>
                      </h3>
                      {event.attributes.location && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <svg className="w-4 h-4 text-ocean-teal" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {event.attributes.location}
                        </p>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/events/${event.attributes.slug}`}
                        className="inline-flex items-center gap-1 text-ocean-teal font-semibold text-sm hover:gap-2 transition-all duration-150"
                      >
                        Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">No upcoming events scheduled.</p>
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/events" className="inline-block bg-ocean-blue text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-ocean-teal transition-colors duration-150 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2">
              View All Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}