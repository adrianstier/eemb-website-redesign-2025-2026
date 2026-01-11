import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react'
import { getUpcomingEvents, getFeaturedEvents, getEventTypes } from '@/lib/data'
import EventCard from '@/components/EventCard'
import SectionHeader from '@/components/ui/SectionHeader'
import WaveDivider from '@/components/ui/WaveDivider'

export const revalidate = 900 // Revalidate every 15 minutes

export const metadata = {
  title: 'Events & Seminars | EEMB',
  description: 'Join us for seminars, workshops, field trips, and networking events in ecology, evolution, and marine biology at UC Santa Barbara.',
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
      <section className="relative py-20 md:py-28 overflow-hidden">
        <Image
          src="/images/about/campus-lagoon.jpg"
          alt="Campus lagoon at UCSB"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/70 to-ocean-deep/40" />

        <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-ucsb-gold" />
              <p className="text-ucsb-gold font-medium text-sm tracking-widest uppercase">
                Community Events
              </p>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] text-white tracking-tight">
              Events &
              <span className="block text-ucsb-gold">Seminars</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 text-white/85 leading-relaxed max-w-2xl">
              Join us for seminars, workshops, field trips, and networking events
              throughout the academic year.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 bg-ucsb-gold text-ocean-deep px-7 py-3.5 rounded-xl font-bold hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg"
              >
                <CalendarIcon className="w-5 h-5" />
                View Calendar
              </Link>
              <a
                href="#upcoming"
                className="bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition-all"
              >
                Browse Events
              </a>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider variant="bold" toColor="fill-white" className="-mt-1" />

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
            <SectionHeader
              eyebrow="Highlights"
              title="Featured Events"
              subtitle="Don't miss these upcoming highlights from our community."
              color="gold"
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      <WaveDivider variant="subtle" toColor="fill-warm-100" />

      {/* Event Stats & Filters */}
      <section id="upcoming" className="py-6 bg-warm-100 border-b border-warm-200 sticky top-0 z-10">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-ocean-deep font-semibold">
                {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? 's' : ''}
              </span>
              {eventTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map(({ type, count }) => (
                    <span
                      key={type}
                      className="px-3 py-1.5 bg-white text-warm-600 rounded-full text-sm font-medium border border-warm-200 hover:border-ocean-teal/30 transition-colors cursor-pointer"
                    >
                      {type} <span className="text-warm-400">({count})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/calendar"
              className="flex items-center gap-2 px-5 py-2.5 bg-ocean-teal text-white rounded-xl font-semibold hover:bg-ocean-teal/90 transition-all shadow-sm hover:shadow-md"
            >
              <CalendarIcon className="w-5 h-5" />
              Calendar View
            </Link>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12 md:py-16 bg-warm-100">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-warm-200">
              <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="w-10 h-10 text-warm-400" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-ocean-deep mb-3">
                No Upcoming Events
              </h3>
              <p className="text-warm-600 max-w-md mx-auto mb-6">
                Check back soon for new events and seminars, or browse our calendar for past events.
              </p>
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ocean-teal text-white rounded-xl font-semibold hover:bg-ocean-teal/90 transition-all"
              >
                View Full Calendar
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} variant="default" />
              ))}
            </div>
          )}
        </div>
      </section>

      <WaveDivider variant="bold" toColor="fill-ocean-deep" />

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-ocean-deep text-white -mt-1">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Stay Connected With EEMB
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Subscribe to our event calendar to receive notifications about upcoming
            seminars, workshops, and departmental gatherings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendar.google.com/calendar/embed?src=eemb%40ucsb.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-ucsb-gold text-ocean-deep px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all hover:shadow-lg"
            >
              <CalendarIcon className="w-5 h-5" />
              Add to Google Calendar
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
