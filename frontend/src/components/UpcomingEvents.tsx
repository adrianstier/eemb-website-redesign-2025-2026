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
        const response = await fetch(`http://localhost:1337/api/events?filters[startDate][$gte]=${now}&pagination[limit]=3&sort=startDate:asc`)
        const data = await response.json()
        setEvents(data.data || [])
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([
          {
            id: 1,
            attributes: {
              title: 'EEMB Seminar: Ocean Acidification',
              startDate: '2024-11-15T15:00:00Z',
              location: 'LSB 1001',
              eventType: 'Seminar',
              slug: 'ocean-acidification-seminar'
            }
          },
          {
            id: 2,
            attributes: {
              title: 'Graduate Student Symposium',
              startDate: '2024-11-20T09:00:00Z',
              location: 'MSI Auditorium',
              eventType: 'Symposium',
              slug: 'graduate-symposium'
            }
          },
          {
            id: 3,
            attributes: {
              title: 'Thesis Defense: Jane Doe',
              startDate: '2024-11-22T14:00:00Z',
              location: 'LSB 2320',
              eventType: 'Defense',
              slug: 'thesis-defense-doe'
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg animate-pulse h-24 border border-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <article
          key={event.id}
          className="bg-white rounded-lg p-4 border border-gray-100 hover:border-ocean-blue/30 hover:shadow-md transition-all"
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-12 text-center">
              <div className="text-xs text-gray-500 uppercase font-medium">
                {new Date(event.attributes.startDate).toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-xl font-bold text-ucsb-navy">
                {new Date(event.attributes.startDate).getDate()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ucsb-navy text-sm leading-tight mb-1 line-clamp-2">
                <Link
                  href={`/events/${event.attributes.slug}`}
                  className="hover:text-ocean-blue transition-colors"
                >
                  {event.attributes.title}
                </Link>
              </h3>
              <p className="text-xs text-gray-500 line-clamp-1">
                {event.attributes.location}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
