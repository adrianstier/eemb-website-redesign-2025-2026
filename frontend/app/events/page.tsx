'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, ClockIcon, LocationIcon, ChevronRightIcon, UserGroupIcon } from '@/components/icons'
import { Card } from '@/components/ui/Card'

interface Event {
  id: number
  attributes: {
    title: string
    description?: string
    startDate: string
    endDate?: string
    location?: string
    eventType?: string
    slug: string
    image?: string
    isFeatured?: boolean
    speaker?: string
    registrationLink?: string
    tags?: string[]
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'upcoming' | 'past'>('upcoming')
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/events?sort=startDate:asc&populate=*')
      const data = await response.json()
      setEvents(data.data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      // Set placeholder data
      setEvents([
        {
          id: 1,
          attributes: {
            title: 'EEMB Seminar: Ocean Acidification and Marine Life',
            description: 'Join us for an in-depth discussion on the impacts of ocean acidification on marine organisms and ecosystems.',
            startDate: '2024-11-20T15:00:00Z',
            location: 'Life Sciences Building, Room 1001',
            eventType: 'Seminar',
            slug: 'ocean-acidification-seminar',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
            isFeatured: true
          }
        },
        {
          id: 2,
          attributes: {
            title: 'Graduate Student Research Symposium',
            description: 'An opportunity for our graduate students to present their latest research findings to the department and university community.',
            startDate: '2024-11-25T09:00:00Z',
            endDate: '2024-11-25T17:00:00Z',
            location: 'Marine Science Institute',
            eventType: 'Symposium',
            slug: 'graduate-symposium',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
            isFeatured: true
          }
        },
        {
          id: 3,
          attributes: {
            title: 'Field Trip: Kelp Forest Monitoring',
            description: 'Students and faculty will conduct research on kelp forest ecology and biodiversity.',
            startDate: '2024-12-02T08:00:00Z',
            location: 'Santa Barbara Channel Marine Reserve',
            eventType: 'Field Trip',
            slug: 'kelp-forest-trip',
            image: 'https://images.unsplash.com/photo-1583212192562-40c695cabccf?w=600'
          }
        },
        {
          id: 4,
          attributes: {
            title: 'Faculty Research Forum',
            description: 'Faculty members present recent discoveries and upcoming research initiatives.',
            startDate: '2024-12-05T12:00:00Z',
            location: 'Geographical Sciences Building',
            eventType: 'Forum',
            slug: 'research-forum',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600'
          }
        },
        {
          id: 5,
          attributes: {
            title: 'Ecology Lab Open House',
            description: 'Visit our research labs and learn about ongoing conservation and ecology projects.',
            startDate: '2024-12-10T10:00:00Z',
            endDate: '2024-12-10T14:00:00Z',
            location: 'Marine Science Institute',
            eventType: 'Open House',
            slug: 'lab-open-house',
            image: 'https://images.unsplash.com/photo-1576080175515-33d50b14ae56?w=600',
            isFeatured: true
          }
        },
        {
          id: 6,
          attributes: {
            title: 'Evolution & Adaptation Lecture Series',
            description: 'A three-part lecture series examining evolutionary processes and species adaptation.',
            startDate: '2024-12-15T16:00:00Z',
            location: 'Cheadle Hall',
            eventType: 'Lecture',
            slug: 'evolution-lecture-series',
            image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'
          }
        },
        {
          id: 7,
          attributes: {
            title: 'Undergraduate Research Showcase',
            description: 'Undergraduates present their independent research projects completed during the academic year.',
            startDate: '2025-01-15T13:00:00Z',
            location: 'Girvetz Theater',
            eventType: 'Showcase',
            slug: 'undergrad-showcase',
            image: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600'
          }
        },
        {
          id: 8,
          attributes: {
            title: 'Career Development Workshop: Scientific Writing',
            description: 'Learn the essentials of writing scientific papers and grant proposals from experienced researchers.',
            startDate: '2025-01-22T14:00:00Z',
            location: 'Life Sciences Building, Room 2001',
            eventType: 'Workshop',
            slug: 'scientific-writing-workshop',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600'
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const now = new Date()
  const upcomingEvents = events.filter(e => new Date(e.attributes.startDate) >= now)
  const pastEvents = events.filter(e => new Date(e.attributes.startDate) < now)

  const currentEvents = viewMode === 'upcoming' ? upcomingEvents : pastEvents
  const displayedEvents = selectedType
    ? currentEvents.filter(e => e.attributes.eventType === selectedType)
    : currentEvents

  const eventTypes = Array.from(new Set(events.map(e => e.attributes.eventType).filter(Boolean)))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Events & Seminars</h1>
            <p className="text-lg md:text-xl text-white/90">
              Join us for seminars, workshops, field trips, and networking events throughout the academic year.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {events.filter(e => e.attributes.isFeatured).length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.filter(e => e.attributes.isFeatured).slice(0, 2).map(event => (
                <div key={event.id} className="bg-gradient-to-br from-ucsb-navy to-blue-800 text-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {event.attributes.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={event.attributes.image}
                        alt={event.attributes.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <span className="text-sm font-bold bg-ucsb-gold text-ucsb-navy px-4 py-1 rounded-full">
                      {event.attributes.eventType || 'Event'}
                    </span>
                    <h3 className="text-2xl font-bold mt-4 mb-3">
                      {event.attributes.title}
                    </h3>
                    <p className="text-gray-200 mb-6">
                      {event.attributes.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <p className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-200" />
                        {formatDate(event.attributes.startDate)}
                      </p>
                      {event.attributes.location && (
                        <p className="flex items-center gap-2">
                          <LocationIcon className="w-5 h-5 text-gray-200" />
                          {event.attributes.location}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/events/${event.attributes.slug}`}
                      className="inline-block bg-ucsb-gold text-ucsb-navy px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* View Toggle */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex gap-4">
                <button
                  onClick={() => setViewMode('upcoming')}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    viewMode === 'upcoming'
                      ? 'bg-ucsb-navy text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Upcoming ({upcomingEvents.length})
                </button>
                <button
                  onClick={() => setViewMode('past')}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    viewMode === 'past'
                      ? 'bg-ucsb-navy text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Past ({pastEvents.length})
                </button>
              </div>
              <select
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ucsb-gold focus:border-transparent bg-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Event Types</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <Link
              href="/calendar"
              className="flex items-center gap-2 px-6 py-2 bg-ocean-blue text-white rounded-lg font-semibold hover:bg-ocean-deep transition"
            >
              <CalendarIcon className="w-5 h-5" />
              Calendar View
            </Link>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-8 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : displayedEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No {viewMode} events{selectedType ? ` of type "${selectedType}"` : ''} at this time.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-gray-600">
                Showing {displayedEvents.length} event{displayedEvents.length !== 1 ? 's' : ''}
              </div>
              <div className="space-y-6">
                {displayedEvents.map(event => (
                  <Link
                    key={event.id}
                    href={`/events/${event.attributes.slug}`}
                    className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row">
                      {event.attributes.image && (
                        <div className="md:w-48 h-48 overflow-hidden bg-gray-200">
                          <img
                            src={event.attributes.image}
                            alt={event.attributes.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-8 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-white bg-ucsb-coral px-3 py-1 rounded-full">
                            {event.attributes.eventType || 'Event'}
                          </span>
                          <h3 className="text-2xl font-bold text-ucsb-navy mt-4 mb-2 group-hover:text-ucsb-gold transition">
                            {event.attributes.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {event.attributes.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            {formatDate(event.attributes.startDate)}
                            {event.attributes.endDate && new Date(event.attributes.endDate).toDateString() !== new Date(event.attributes.startDate).toDateString() && (
                              <span> - {formatDate(event.attributes.endDate)}</span>
                            )}
                          </p>
                          {event.attributes.location && (
                            <p className="flex items-center gap-2">
                              <LocationIcon className="w-4 h-4 text-gray-500" />
                              {event.attributes.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Our Events</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Subscribe to our event calendar to receive notifications about upcoming seminars, workshops, and departmental gatherings.
          </p>
          <button className="bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
            Subscribe to Calendar
          </button>
        </div>
      </section>
    </div>
  )
}
