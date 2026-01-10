import Link from 'next/link'
import { CalendarIcon, ClockIcon, MapPinIcon, ChevronRightIcon, UsersIcon } from 'lucide-react'
import { getUpcomingEvents, getFeaturedEvents, getEventTypes, type EventWithHost } from '@/lib/data'

export const revalidate = 900 // Revalidate every 15 minutes

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function EventCard({ event }: { event: EventWithHost }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex flex-col md:flex-row">
        {event.speaker_image_url && (
          <div className="md:w-48 h-48 overflow-hidden bg-gray-200">
            <img
              src={event.speaker_image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-white bg-ocean-teal px-3 py-1 rounded-full">
              {event.event_type || 'Event'}
            </span>
            <h3 className="text-2xl font-bold text-ocean-deep mt-4 mb-2 group-hover:text-ucsb-gold transition">
              {event.title}
            </h3>
            {event.short_description && (
              <p className="text-warm-600 mb-4">
                {event.short_description}
              </p>
            )}
            {event.speaker && (
              <p className="text-ocean-teal font-medium mb-2">
                Speaker: {event.speaker}
                {event.speaker_affiliation && ` (${event.speaker_affiliation})`}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 text-sm text-warm-600">
            <p className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-warm-500" />
              {formatDate(event.start_date)}
              {event.end_date && new Date(event.end_date).toDateString() !== new Date(event.start_date).toDateString() && (
                <span> - {formatDate(event.end_date)}</span>
              )}
            </p>
            {event.location && (
              <p className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-warm-500" />
                {event.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function FeaturedEventCard({ event }: { event: EventWithHost }) {
  return (
    <div className="bg-gradient-to-br from-ocean-deep to-ocean-blue text-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {event.speaker_image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.speaker_image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-8">
        <span className="text-sm font-bold bg-ucsb-gold text-ocean-deep px-4 py-1 rounded-full">
          {event.event_type || 'Event'}
        </span>
        <h3 className="text-2xl font-bold mt-4 mb-3">
          {event.title}
        </h3>
        {event.short_description && (
          <p className="text-gray-200 mb-4">
            {event.short_description}
          </p>
        )}
        {event.speaker && (
          <p className="text-bioluminescent font-medium mb-4">
            Speaker: {event.speaker}
          </p>
        )}
        <div className="space-y-2 mb-6">
          <p className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-200" />
            {formatDate(event.start_date)}
          </p>
          {event.location && (
            <p className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-gray-200" />
              {event.location}
            </p>
          )}
        </div>
        <Link
          href={`/events/${event.slug}`}
          className="inline-block bg-ucsb-gold text-ocean-deep px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Learn More
        </Link>
      </div>
    </div>
  )
}

export default async function EventsPage() {
  const [upcomingEvents, featuredEvents, eventTypes] = await Promise.all([
    getUpcomingEvents({ limit: 20 }),
    getFeaturedEvents(3),
    getEventTypes()
  ])

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Events & Seminars</h1>
            <p className="text-lg md:text-xl text-white/90">
              Join us for seminars, workshops, field trips, and networking events throughout the academic year.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-ocean-deep mb-8">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <FeaturedEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Stats */}
      <section className="py-8 bg-white border-b border-warm-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-warm-600">
                {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? 's' : ''}
              </span>
              {eventTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map(({ type, count }) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-warm-100 text-warm-600 rounded-full text-sm"
                    >
                      {type} ({count})
                    </span>
                  ))}
                </div>
              )}
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
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16">
              <CalendarIcon className="w-16 h-16 text-warm-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-warm-700 mb-2">No Upcoming Events</h3>
              <p className="text-warm-600">
                Check back soon for new events and seminars.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Don't Miss Our Events</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Subscribe to our event calendar to receive notifications about upcoming seminars, workshops, and departmental gatherings.
          </p>
          <button className="bg-ucsb-gold text-ocean-deep px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
            Subscribe to Calendar
          </button>
        </div>
      </section>
    </div>
  )
}
