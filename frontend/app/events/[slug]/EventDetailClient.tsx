'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, User, Mail, ExternalLink, ChevronLeft, Clock, Download } from 'lucide-react'
import type { EventWithHost } from '@/lib/data'

interface EventDetailClientProps {
  event: EventWithHost
  relatedEvents: EventWithHost[]
}

export default function EventDetailClient({ event, relatedEvents }: EventDetailClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const generateICS = () => {
    const startDate = new Date(event.start_date)
    const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 60 * 60 * 1000)

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//UCSB EEMB//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@eemb.ucsb.edu
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${(event.description || event.short_description || '').replace(/\n/g, '\\n')}
LOCATION:${event.location || 'TBD'}
${event.registration_link ? `URL:${event.registration_link}` : ''}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.slug}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  const addToGoogleCalendar = () => {
    const startDate = new Date(event.start_date)
    const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 60 * 60 * 1000)

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    }

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: event.description || event.short_description || '',
      location: event.location || '',
    })

    window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section with Speaker Image */}
      {event.speaker_image_url && (
        <div className="relative h-96 overflow-hidden">
          <Image
            src={event.speaker_image_url}
            alt={event.speaker || event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-ocean-deep/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto max-w-6xl">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Events
              </Link>
              {event.event_type && (
                <span className="inline-block px-3 py-1 bg-ocean-teal text-white text-sm font-bold rounded-full mb-4">
                  {event.event_type}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {event.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {!event.speaker_image_url && (
              <>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 text-warm-600 hover:text-ocean-deep mb-6 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Events
                </Link>
                {event.event_type && (
                  <span className="inline-block px-3 py-1 bg-ocean-teal text-white text-sm font-bold rounded-full mb-4 ml-4">
                    {event.event_type}
                  </span>
                )}
                <h1 className="text-4xl font-display font-bold text-ocean-deep mb-6">
                  {event.title}
                </h1>
              </>
            )}

            {/* Speaker Information */}
            {event.speaker && (
              <div className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 mb-8 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ocean-blue rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-ocean-deep mb-1">
                      {event.speaker}
                    </h2>
                    {event.speaker_title && (
                      <p className="text-warm-600 text-sm mb-1">{event.speaker_title}</p>
                    )}
                    {event.speaker_affiliation && (
                      <p className="text-warm-600 mb-3">{event.speaker_affiliation}</p>
                    )}
                    {event.speaker_bio && (
                      <p className="text-warm-700">{event.speaker_bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Full Description */}
            <div className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 mb-8 p-6">
              <h2 className="text-2xl font-display font-bold text-ocean-deep mb-4">About This Event</h2>
              <div className="prose prose-warm max-w-none text-warm-700">
                {event.description ? (
                  <div className="whitespace-pre-wrap">{event.description}</div>
                ) : event.short_description ? (
                  <p>{event.short_description}</p>
                ) : (
                  <p className="text-warm-600 italic">No description available.</p>
                )}
              </div>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 p-6">
                <h3 className="text-xl font-display font-bold text-ocean-deep mb-4">More Upcoming Events</h3>
                <div className="space-y-4">
                  {relatedEvents.map(relatedEvent => (
                    <Link
                      key={relatedEvent.id}
                      href={`/events/${relatedEvent.slug}`}
                      className="block p-4 rounded-xl bg-warm-50 hover:bg-warm-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-ocean-teal/10 rounded-lg p-2 text-center min-w-[60px]">
                          <div className="text-xs text-ocean-teal font-semibold">
                            {new Date(relatedEvent.start_date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-xl font-bold text-ocean-deep">
                            {new Date(relatedEvent.start_date).getDate()}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-ocean-deep hover:text-ocean-blue transition-colors">
                            {relatedEvent.title}
                          </h4>
                          {relatedEvent.event_type && (
                            <span className="text-xs text-warm-600">{relatedEvent.event_type}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 mb-6 p-6 sticky top-4">
              <h3 className="text-xl font-bold text-ocean-deep mb-4">Event Details</h3>

              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-ocean-blue mt-0.5" />
                  <div>
                    <p className="font-semibold text-ocean-deep">{formatDate(event.start_date)}</p>
                    {event.end_date && (
                      <p className="text-sm text-warm-600">
                        {formatTime(event.start_date)} - {formatTime(event.end_date)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-ocean-blue mt-0.5" />
                    <div>
                      <p className="font-semibold text-ocean-deep">{event.location}</p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(event.location + ', UC Santa Barbara')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ocean-blue hover:underline"
                      >
                        Get directions
                      </a>
                    </div>
                  </div>
                )}

                {/* Virtual Link */}
                {event.virtual_link && (
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-ocean-blue mt-0.5" />
                    <div>
                      <p className="text-sm text-warm-600">Virtual Event</p>
                      <a
                        href={event.virtual_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-ocean-blue hover:underline"
                      >
                        Join Online
                      </a>
                    </div>
                  </div>
                )}

                {/* Host Faculty Contact */}
                {event.host && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-ocean-blue mt-0.5" />
                    <div>
                      <p className="text-sm text-warm-600">Hosted by</p>
                      <Link
                        href={`/people/faculty/${event.host.slug}`}
                        className="font-semibold text-ocean-blue hover:underline"
                      >
                        {event.host.first_name} {event.host.last_name}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {event.registration_link && (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button className="w-full bg-ucsb-gold text-ocean-deep px-4 py-3 rounded-xl font-bold hover:bg-ucsb-gold/90 transition">
                      Register for Event
                    </button>
                  </a>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={generateICS}
                    className="flex-1 flex items-center justify-center gap-2 bg-warm-100 text-warm-700 px-4 py-2 rounded-xl font-semibold hover:bg-warm-200 transition"
                  >
                    <Download className="w-4 h-4" />
                    .ics
                  </button>
                  <button
                    onClick={addToGoogleCalendar}
                    className="flex-1 flex items-center justify-center gap-2 bg-warm-100 text-warm-700 px-4 py-2 rounded-xl font-semibold hover:bg-warm-200 transition"
                  >
                    <Calendar className="w-4 h-4" />
                    Google
                  </button>
                </div>
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 p-6">
              <h3 className="text-lg font-bold text-ocean-deep mb-4">Share This Event</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                  }}
                  className="flex-1 bg-warm-100 text-warm-700 px-4 py-2 rounded-xl font-semibold hover:bg-warm-200 transition text-sm"
                >
                  Copy Link
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-warm-100 text-warm-700 px-4 py-2 rounded-xl font-semibold hover:bg-warm-200 transition text-sm text-center"
                >
                  Share on X
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
