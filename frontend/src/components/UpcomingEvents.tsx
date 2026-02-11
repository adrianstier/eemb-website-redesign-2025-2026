'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import type { EventWithHost } from '@/lib/data'

const eventTypeColors: Record<string, { accent: string; bg: string }> = {
  Seminar: { accent: 'bg-ocean-teal', bg: 'bg-ocean-teal/10' },
  Symposium: { accent: 'bg-ocean-blue', bg: 'bg-ocean-blue/10' },
  Defense: { accent: 'bg-ucsb-gold', bg: 'bg-ucsb-gold/10' },
  Workshop: { accent: 'bg-kelp-500', bg: 'bg-kelp-500/10' },
  Lecture: { accent: 'bg-bioluminescent', bg: 'bg-bioluminescent/10' },
  default: { accent: 'bg-warm-400', bg: 'bg-warm-200' },
}

interface UpcomingEventsProps {
  initialEvents?: EventWithHost[]
}

export default function UpcomingEvents({ initialEvents = [] }: UpcomingEventsProps) {
  const [events, setEvents] = useState<EventWithHost[]>([])
  const [loading, setLoading] = useState(!initialEvents.length)
  const { ref, isInView } = useInView({ threshold: 0.1 })

  useEffect(() => {
    if (initialEvents.length > 0) {
      setEvents(initialEvents.slice(0, 3))
      setLoading(false)
    }
  }, [initialEvents])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl animate-pulse border border-warm-200">
            <div className="flex gap-4">
              <div className="w-14 h-16 bg-warm-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 bg-warm-200 rounded-lg w-3/4 mb-3" />
                <div className="h-3 bg-warm-200 rounded-lg w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-warm-200 text-center">
        <p className="text-warm-600">No upcoming events scheduled</p>
        <Link href="/calendar" className="text-ocean-teal hover:underline text-sm mt-2 inline-block">
          View past events →
        </Link>
      </div>
    )
  }

  return (
    <div ref={ref} className="space-y-4">
      {events.map((event, index) => {
        const colors = eventTypeColors[event.event_type || 'default'] || eventTypeColors.default
        const eventDate = new Date(event.start_date)

        return (
          <article
            key={event.id}
            className={`group relative bg-white rounded-2xl p-5 border border-warm-200 hover:border-ocean-teal/30 hover:shadow-warm-lg transition-all duration-500 overflow-hidden ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-teal/0 via-ocean-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex gap-4">
              {/* Date badge with accent */}
              <div className="flex-shrink-0 w-14 text-center relative">
                <div className={`absolute -left-1 top-0 bottom-0 w-1 ${colors.accent} rounded-full`} />
                <div className="bg-gradient-to-br from-ocean-teal to-bioluminescent rounded-xl p-3 shadow-md">
                  <div className="text-[10px] text-white/70 uppercase font-semibold tracking-wider">
                    {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-2xl font-heading font-bold text-white">
                    {eventDate.getDate()}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Event type & time */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {event.event_type && (
                    <span className={`inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${colors.bg} text-ocean-deep`}>
                      {event.event_type}
                    </span>
                  )}
                  <span className="text-[11px] text-warm-400 font-medium">
                    {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-ocean-deep text-base leading-snug mb-2 group-hover:text-ocean-teal transition-colors duration-300">
                  <Link href={`/events/${event.slug}`} className="line-clamp-2">
                    {event.title}
                  </Link>
                </h3>

                {/* Location */}
                {event.location && (
                  <p className="text-sm text-warm-600 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </p>
                )}
              </div>

              {/* Arrow indicator */}
              <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <svg className="w-5 h-5 text-ocean-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
