'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { EventWithHost } from '@/lib/data'

const eventTypeColors: Record<string, { accent: string; bg: string; text: string }> = {
  Seminar: { accent: 'bg-ocean-teal', bg: 'bg-ocean-teal/10', text: 'text-ocean-teal' },
  Symposium: { accent: 'bg-ocean-blue', bg: 'bg-ocean-blue/10', text: 'text-ocean-blue' },
  Defense: { accent: 'bg-ucsb-gold', bg: 'bg-ucsb-gold/10', text: 'text-yellow-700' },
  Workshop: { accent: 'bg-kelp-500', bg: 'bg-kelp-500/10', text: 'text-kelp-600' },
  Lecture: { accent: 'bg-bioluminescent', bg: 'bg-bioluminescent/10', text: 'text-cyan-700' },
  Conference: { accent: 'bg-ocean-blue', bg: 'bg-ocean-blue/10', text: 'text-ocean-blue' },
  Social: { accent: 'bg-ucsb-gold', bg: 'bg-ucsb-gold/10', text: 'text-yellow-700' },
  Recruitment: { accent: 'bg-ocean-teal', bg: 'bg-ocean-teal/10', text: 'text-ocean-teal' },
  Meeting: { accent: 'bg-warm-400', bg: 'bg-warm-200', text: 'text-warm-600' },
  'Alumni Event': { accent: 'bg-ocean-blue', bg: 'bg-ocean-blue/10', text: 'text-ocean-blue' },
  'Field Trip': { accent: 'bg-kelp-500', bg: 'bg-kelp-500/10', text: 'text-kelp-600' },
  Other: { accent: 'bg-warm-400', bg: 'bg-warm-200', text: 'text-warm-600' },
  default: { accent: 'bg-warm-400', bg: 'bg-warm-200', text: 'text-warm-600' },
}

interface EventCardProps {
  event: EventWithHost
  variant?: 'default' | 'compact' | 'featured'
  showHost?: boolean
  className?: string
}

export default function EventCard({
  event,
  variant = 'default',
  showHost = true,
  className = '',
}: EventCardProps) {
  const colors = eventTypeColors[event.event_type || 'default'] || eventTypeColors.default
  const eventDate = new Date(event.start_date)
  const hostName = event.host
    ? `${event.host.first_name} ${event.host.last_name}`
    : null

  if (variant === 'compact') {
    return (
      <Link
        href={`/events/${event.slug}`}
        className={`group block bg-white rounded-xl p-4 border border-warm-200 hover:border-ocean-teal/30 hover:shadow-warm-md transition-all duration-300 ${className}`}
      >
        <div className="flex gap-3 items-start">
          {/* Date badge */}
          <div className="flex-shrink-0 w-12 text-center">
            <div className="bg-gradient-to-br from-ocean-teal to-bioluminescent rounded-lg p-2 shadow-sm">
              <div className="text-[9px] text-white/70 uppercase font-semibold tracking-wider">
                {eventDate.toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-xl font-heading font-bold text-white leading-none">
                {eventDate.getDate()}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-ocean-deep text-sm leading-snug line-clamp-2 group-hover:text-ocean-teal transition-colors">
              {event.title}
            </h3>
            <p className="text-xs text-warm-500 mt-1">
              {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              {event.location && ` · ${event.location}`}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <article
        className={`group relative bg-white rounded-3xl overflow-hidden shadow-warm-lg hover:shadow-warm-xl transition-all duration-500 ${className}`}
      >
        {/* Speaker image or gradient background */}
        <div className="relative aspect-[16/9]">
          {event.speaker_image_url ? (
            <Image
              src={event.speaker_image_url}
              alt={event.speaker || event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/40 to-transparent" />

          {/* Event type badge */}
          {event.event_type && (
            <div className="absolute top-4 left-4">
              <span className={`inline-block text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full ${colors.bg} ${colors.text} backdrop-blur-sm`}>
                {event.event_type}
              </span>
            </div>
          )}

          {/* Date badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg text-center">
              <div className="text-[10px] text-ocean-deep/70 uppercase font-semibold tracking-wider">
                {eventDate.toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-2xl font-heading font-bold text-ocean-deep leading-none">
                {eventDate.getDate()}
              </div>
            </div>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-display text-xl font-bold text-white mb-2 line-clamp-2">
              {event.title}
            </h3>
            {event.speaker && (
              <p className="text-white/80 text-sm">
                {event.speaker}
                {event.speaker_affiliation && (
                  <span className="text-white/60"> · {event.speaker_affiliation}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          {event.short_description && (
            <p className="text-warm-600 text-sm line-clamp-2 mb-4">
              {event.short_description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-warm-500">
              {/* Time */}
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>

              {/* Location */}
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </span>
              )}
            </div>

            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center gap-2 text-ocean-teal font-semibold text-sm hover:gap-3 transition-all duration-300"
            >
              Details
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // Default variant
  return (
    <article
      className={`group relative bg-white rounded-2xl p-5 border border-warm-200 hover:border-ocean-teal/30 hover:shadow-warm-lg transition-all duration-500 overflow-hidden ${className}`}
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

          {/* Speaker */}
          {event.speaker && (
            <p className="text-sm text-warm-600 mb-1">
              {event.speaker}
              {event.speaker_affiliation && (
                <span className="text-warm-400"> · {event.speaker_affiliation}</span>
              )}
            </p>
          )}

          {/* Location & Host */}
          <div className="flex items-center gap-3 text-sm text-warm-500 flex-wrap">
            {event.location && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </span>
            )}

            {showHost && hostName && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <Link
                  href={`/people/faculty/${event.host?.slug}`}
                  className="hover:text-ocean-teal transition-colors"
                >
                  {hostName}
                </Link>
              </span>
            )}
          </div>
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
}
