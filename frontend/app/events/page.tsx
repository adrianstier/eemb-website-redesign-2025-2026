import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, MapPinIcon, ClockIcon, Sparkles, Bell, CalendarDays } from 'lucide-react'
import { getUpcomingEvents, getFeaturedEvents, getEventTypes } from '@/lib/data'
import EventCard from '@/components/EventCard'
import SectionHeader from '@/components/ui/SectionHeader'
import WaveDivider from '@/components/ui/WaveDivider'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

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
            <ScrollReveal direction="up" duration={500}>
              <SectionHeader
                eyebrow="Highlights"
                title="Featured Events"
                subtitle="Don't miss these upcoming highlights from our community."
                color="gold"
                className="mb-12"
              />
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event, index) => (
                <ScrollReveal key={event.id} delay={index * 100} duration={500} direction="up" distance={25}>
                  <EventCard event={event} variant="featured" />
                </ScrollReveal>
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
                      className="px-3 py-1.5 bg-white text-warm-600 rounded-full text-sm font-medium border border-warm-200"
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
            <ScrollReveal direction="up" duration={600}>
              <div className="relative overflow-hidden bg-white rounded-3xl border border-warm-200 shadow-warm-lg">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-ocean-teal/5 via-transparent to-bioluminescent/5" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-ucsb-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-ocean-teal/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                {/* Animated wave pattern */}
                <div className="absolute bottom-0 left-0 right-0 opacity-10">
                  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-16">
                    <path fill="currentColor" className="text-ocean-teal" d="M0,64 C240,96,480,32,720,64 C960,96,1200,32,1440,64 L1440,120 L0,120 Z">
                      <animate attributeName="d" dur="8s" repeatCount="indefinite" values="M0,64 C240,96,480,32,720,64 C960,96,1200,32,1440,64 L1440,120 L0,120 Z;M0,32 C240,64,480,96,720,32 C960,64,1200,96,1440,32 L1440,120 L0,120 Z;M0,64 C240,96,480,32,720,64 C960,96,1200,32,1440,64 L1440,120 L0,120 Z" />
                    </path>
                  </svg>
                </div>

                <div className="relative px-8 py-16 md:py-20 text-center">
                  {/* Icon cluster */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-ocean-teal/10 rounded-xl flex items-center justify-center transform -rotate-6">
                      <CalendarDays className="w-6 h-6 text-ocean-teal" />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-ucsb-gold to-sunset-400 rounded-2xl flex items-center justify-center shadow-glow-gold">
                      <Sparkles className="w-8 h-8 text-ocean-deep" />
                    </div>
                    <div className="w-12 h-12 bg-bioluminescent/10 rounded-xl flex items-center justify-center transform rotate-6">
                      <Bell className="w-6 h-6 text-bioluminescent" />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-ocean-deep mb-4">
                    The Best Events Are Yet to Come
                  </h3>
                  <p className="text-warm-600 max-w-lg mx-auto mb-8 text-lg leading-relaxed">
                    We&apos;re planning exciting seminars, workshops, and community gatherings.
                    Add our calendar to stay in the loop!
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://calendar.google.com/calendar/embed?src=eemb%40ucsb.edu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-ucsb-gold text-ocean-deep rounded-xl font-bold hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg group"
                    >
                      <CalendarIcon className="w-5 h-5" />
                      Subscribe to Calendar
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-ocean-teal/10 text-ocean-teal rounded-xl font-semibold hover:bg-ocean-teal hover:text-white transition-all duration-300"
                    >
                      Contact Us About Events
                    </Link>
                  </div>

                  {/* Suggestion cards */}
                  <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <div className="bg-warm-50 rounded-xl p-4 text-left border border-warm-200">
                      <div className="w-8 h-8 bg-ocean-teal/10 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-4 h-4 text-ocean-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-ocean-deep text-sm mb-1">Weekly Seminars</h4>
                      <p className="text-warm-500 text-xs">Research talks every Thursday during the academic year</p>
                    </div>
                    <div className="bg-warm-50 rounded-xl p-4 text-left border border-warm-200">
                      <div className="w-8 h-8 bg-ucsb-gold/10 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-4 h-4 text-ucsb-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-ocean-deep text-sm mb-1">Prospective Student Days</h4>
                      <p className="text-warm-500 text-xs">Meet faculty and tour labs during recruitment season</p>
                    </div>
                    <div className="bg-warm-50 rounded-xl p-4 text-left border border-warm-200">
                      <div className="w-8 h-8 bg-bioluminescent/10 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-4 h-4 text-bioluminescent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-ocean-deep text-sm mb-1">Field Trips</h4>
                      <p className="text-warm-500 text-xs">Explore coastal ecosystems with our research community</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <ScrollReveal key={event.id} delay={index * 75} duration={500} direction="up" distance={20}>
                  <EventCard event={event} variant="default" />
                </ScrollReveal>
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
