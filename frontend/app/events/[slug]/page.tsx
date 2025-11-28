'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CalendarIcon, LocationIcon, UserIcon, MailIcon, ExternalLinkIcon, ChevronLeftIcon, ClockIcon, DownloadIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface EventDetail {
  id: number
  attributes: {
    title: string
    description?: string
    fullDescription?: string
    startDate: string
    endDate?: string
    location?: string
    eventType?: string
    slug: string
    image?: string
    speaker?: string
    speakerBio?: string
    speakerAffiliation?: string
    contactEmail?: string
    registrationLink?: string
    tags?: string[]
    relatedLinks?: { title: string; url: string }[]
    attachments?: { title: string; url: string }[]
  }
}

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventDetail()
  }, [params?.slug])

  const fetchEventDetail = async () => {
    try {
      // In production, fetch from API
      // const response = await fetch(`http://localhost:1337/api/events?filters[slug][$eq]=${params.slug}&populate=*`)
      // const data = await response.json()
      // setEvent(data.data[0])

      // Mock data for now
      setEvent({
        id: 1,
        attributes: {
          title: 'Ocean Acidification and Marine Life',
          description: 'Join us for an in-depth discussion on the impacts of ocean acidification on marine organisms and ecosystems.',
          fullDescription: `Dr. Sarah Chen will present groundbreaking research on ocean acidification's effects on marine ecosystems, with particular focus on coral reef systems in the Pacific Ocean.

This seminar will cover:
• Recent findings from long-term monitoring studies
• Impacts on calcifying organisms and food webs
• Implications for coastal communities
• Potential mitigation and adaptation strategies
• Future research directions

The presentation will include interactive Q&A sessions and opportunities for graduate students to discuss potential collaboration opportunities.

Light refreshments will be served following the seminar.`,
          startDate: '2024-12-15T15:00:00Z',
          endDate: '2024-12-15T16:30:00Z',
          location: 'Life Sciences Building, Room 1001',
          eventType: 'Seminar',
          slug: params?.slug as string || '',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
          speaker: 'Dr. Sarah Chen',
          speakerBio: 'Dr. Sarah Chen is a marine biologist and climate scientist at Stanford University\'s Hopkins Marine Station. Her research focuses on the effects of climate change on marine ecosystems, particularly coral reefs and their associated communities.',
          speakerAffiliation: 'Stanford University, Hopkins Marine Station',
          contactEmail: 'eemb-seminars@ucsb.edu',
          registrationLink: 'https://ucsb.zoom.us/webinar/register/example',
          tags: ['Marine Biology', 'Climate Science', 'Ocean Acidification', 'Coral Reefs'],
          relatedLinks: [
            { title: 'Dr. Chen\'s Lab Website', url: 'https://example.com/chen-lab' },
            { title: 'Recent Publication in Nature', url: 'https://example.com/publication' },
          ],
          attachments: [
            { title: 'Seminar Flyer (PDF)', url: '/files/seminar-flyer.pdf' },
            { title: 'Abstract', url: '/files/abstract.pdf' },
          ]
        }
      })
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

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
    if (!event) return

    const startDate = new Date(event.attributes.startDate)
    const endDate = event.attributes.endDate ? new Date(event.attributes.endDate) : new Date(startDate.getTime() + 60 * 60 * 1000)

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
SUMMARY:${event.attributes.title}
DESCRIPTION:${event.attributes.description?.replace(/\n/g, '\\n') || ''}
LOCATION:${event.attributes.location || 'TBD'}
${event.attributes.registrationLink ? `URL:${event.attributes.registrationLink}` : ''}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.attributes.slug}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  const addToGoogleCalendar = () => {
    if (!event) return

    const startDate = new Date(event.attributes.startDate)
    const endDate = event.attributes.endDate ? new Date(event.attributes.endDate) : new Date(startDate.getTime() + 60 * 60 * 1000)

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    }

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.attributes.title,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: event.attributes.description || '',
      location: event.attributes.location || '',
    })

    window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
          <Link href="/events">
            <Button variant="primary">Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      {event.attributes.image && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={event.attributes.image}
            alt={event.attributes.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                Back to Events
              </Link>
              <span className="inline-block px-3 py-1 bg-ucsb-coral text-white text-sm font-bold rounded-full mb-4">
                {event.attributes.eventType}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {event.attributes.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {!event.attributes.image && (
              <>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  Back to Events
                </Link>
                <h1 className="text-4xl font-bold text-ucsb-navy mb-6">
                  {event.attributes.title}
                </h1>
              </>
            )}

            {/* Speaker Information */}
            {event.attributes.speaker && (
              <Card className="mb-8 p-6 bg-gradient-to-br from-ocean-deep/5 to-ocean-teal/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ocean-blue rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-ucsb-navy mb-1">
                      {event.attributes.speaker}
                    </h2>
                    {event.attributes.speakerAffiliation && (
                      <p className="text-gray-600 mb-3">{event.attributes.speakerAffiliation}</p>
                    )}
                    {event.attributes.speakerBio && (
                      <p className="text-gray-700">{event.attributes.speakerBio}</p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Full Description */}
            <Card className="mb-8 p-6">
              <h2 className="text-2xl font-bold text-ucsb-navy mb-4">About This Event</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {event.attributes.fullDescription ? (
                  <div className="whitespace-pre-wrap">{event.attributes.fullDescription}</div>
                ) : (
                  <p>{event.attributes.description}</p>
                )}
              </div>
            </Card>

            {/* Related Links */}
            {event.attributes.relatedLinks && event.attributes.relatedLinks.length > 0 && (
              <Card className="mb-8 p-6">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Related Links</h3>
                <div className="space-y-2">
                  {event.attributes.relatedLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-ocean-blue hover:text-ocean-deep transition"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                      {link.title}
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Attachments */}
            {event.attributes.attachments && event.attributes.attachments.length > 0 && (
              <Card className="mb-8 p-6">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Downloads</h3>
                <div className="space-y-2">
                  {event.attributes.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      download
                      className="flex items-center gap-2 text-ocean-blue hover:text-ocean-deep transition"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      {attachment.title}
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Event Details Card */}
            <Card className="mb-6 p-6 sticky top-4">
              <h3 className="text-xl font-bold text-ucsb-navy mb-4">Event Details</h3>

              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-ocean-blue mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{formatDate(event.attributes.startDate)}</p>
                    {event.attributes.endDate && (
                      <p className="text-sm text-gray-600">
                        {formatTime(event.attributes.startDate)} - {formatTime(event.attributes.endDate)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                {event.attributes.location && (
                  <div className="flex items-start gap-3">
                    <LocationIcon className="w-5 h-5 text-ocean-blue mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">{event.attributes.location}</p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(event.attributes.location + ', UC Santa Barbara')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ocean-blue hover:underline"
                      >
                        Get directions
                      </a>
                    </div>
                  </div>
                )}

                {/* Contact */}
                {event.attributes.contactEmail && (
                  <div className="flex items-start gap-3">
                    <MailIcon className="w-5 h-5 text-ocean-blue mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Questions?</p>
                      <a
                        href={`mailto:${event.attributes.contactEmail}`}
                        className="font-semibold text-ocean-blue hover:underline"
                      >
                        {event.attributes.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {event.attributes.registrationLink && (
                  <a
                    href={event.attributes.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="primary" className="w-full">
                      Register for Event
                    </Button>
                  </a>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={generateICS}
                    className="flex-1"
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={addToGoogleCalendar}
                    className="flex-1"
                  >
                    Google Calendar
                  </Button>
                </div>
              </div>

              {/* Tags */}
              {event.attributes.tags && event.attributes.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.attributes.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Share Card */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-ucsb-navy mb-4">Share This Event</h3>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                  }}
                >
                  Copy Link
                </Button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.attributes.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="sm">
                    Share on X
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}