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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Upcoming Events</h2>
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Upcoming Events</h2>
        <div className="max-w-3xl mx-auto">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm bg-ucsb-gold text-ucsb-navy px-3 py-1 rounded-full font-semibold">
                          {event.attributes.eventType || 'Event'}
                        </span>
                        <time className="text-sm text-gray-500">
                          {new Date(event.attributes.startDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </time>
                      </div>
                      <h3 className="text-xl font-semibold text-ucsb-navy mb-2">
                        <Link href={`/events/${event.attributes.slug}`} className="hover:text-ucsb-gold transition">
                          {event.attributes.title}
                        </Link>
                      </h3>
                      {event.attributes.location && (
                        <p className="text-gray-600">📍 {event.attributes.location}</p>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Link href={`/events/${event.attributes.slug}`} className="text-ucsb-navy font-semibold hover:text-ucsb-gold transition">
                        Learn More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No upcoming events scheduled.</p>
          )}
          <div className="text-center mt-8">
            <Link href="/events" className="inline-block bg-ucsb-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition">
              View All Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}