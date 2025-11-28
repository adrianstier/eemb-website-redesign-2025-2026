'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from '@/components/icons'

interface Event {
  id: number
  attributes: {
    title: string
    description?: string
    shortDescription?: string
    startDate: string
    endDate?: string
    location?: string
    virtualLink?: string
    eventType?: string
    speaker?: string
    slug: string
    featured?: boolean
    allDay?: boolean
  }
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: Event[]
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month')

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
    } finally {
      setLoading(false)
    }
  }

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: CalendarDay[] = []

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        events: getEventsForDate(date)
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        events: getEventsForDate(date)
      })
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        events: getEventsForDate(date)
      })
    }

    return days
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.attributes.startDate)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (type?: string) => {
    switch (type) {
      case 'Seminar': return 'bg-blue-500'
      case 'Workshop': return 'bg-purple-500'
      case 'Conference': return 'bg-green-500'
      case 'Lecture': return 'bg-yellow-500'
      case 'Social': return 'bg-pink-500'
      case 'Field Trip': return 'bg-teal-500'
      case 'Defense': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Google Calendar Integration
  const generateGoogleCalendarUrl = (event: Event) => {
    const { title, startDate, endDate, location, description, shortDescription } = event.attributes

    const formatDateForGoogle = (date: string) => {
      return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate || startDate)}`,
      details: description || shortDescription || '',
      location: location || '',
      sf: 'true',
      output: 'xml'
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  const downloadICS = (event: Event) => {
    const { title, startDate, endDate, location, description, shortDescription } = event.attributes

    const formatDateForICS = (date: string) => {
      return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EEMB UCSB//Events Calendar//EN
BEGIN:VEVENT
UID:${event.id}@eemb.ucsb.edu
DTSTAMP:${formatDateForICS(new Date().toISOString())}
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate || startDate)}
SUMMARY:${title}
DESCRIPTION:${(description || shortDescription || '').replace(/\n/g, '\\n')}
LOCATION:${location || ''}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${event.attributes.slug || 'event'}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const exportAllEvents = () => {
    const formatDateForICS = (date: string) => {
      return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EEMB UCSB//Events Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:EEMB Events
X-WR-TIMEZONE:America/Los_Angeles
X-WR-CALDESC:Department of Ecology, Evolution & Marine Biology Events
`

    events.forEach(event => {
      const { title, startDate, endDate, location, description, shortDescription } = event.attributes
      icsContent += `BEGIN:VEVENT
UID:${event.id}@eemb.ucsb.edu
DTSTAMP:${formatDateForICS(new Date().toISOString())}
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate || startDate)}
SUMMARY:${title}
DESCRIPTION:${(description || shortDescription || '').replace(/\n/g, '\\n')}
LOCATION:${location || ''}
STATUS:CONFIRMED
END:VEVENT
`
    })

    icsContent += 'END:VCALENDAR'

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'eemb-events.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const calendarDays = generateCalendarDays()
  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Events Calendar</h1>
            <p className="text-lg md:text-xl text-white/90">
              View all department events in a monthly calendar format. Add events to your Google Calendar or download .ics files.
            </p>
          </div>
        </div>
      </section>

      {/* Calendar Controls */}
      <section className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Previous month"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 min-w-[200px] text-center">
                {formatMonthYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Next month"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-ocean-blue text-white rounded-lg font-semibold hover:bg-ocean-deep transition"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/events"
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                List View
              </Link>
              <button
                onClick={exportAllEvents}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <DownloadIcon className="w-5 h-5" />
                Export All Events
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-100 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="py-3 text-center font-semibold text-gray-700">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day.date)}
                    className={`min-h-[120px] border-b border-r p-2 cursor-pointer transition-all hover:bg-blue-50 ${
                      !day.isCurrentMonth ? 'bg-gray-50' : ''
                    } ${
                      day.isToday ? 'bg-blue-100' : ''
                    } ${
                      selectedDate?.toDateString() === day.date.toDateString() ? 'ring-2 ring-ocean-blue' : ''
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      !day.isCurrentMonth ? 'text-gray-400' :
                      day.isToday ? 'text-ocean-blue' : 'text-gray-900'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.events.slice(0, 3).map(event => (
                        <Link
                          key={event.id}
                          href={`/events/${event.attributes.slug}`}
                          className={`block text-xs px-2 py-1 rounded text-white truncate ${getCategoryColor(event.attributes.eventType)} hover:opacity-80 transition`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {formatTime(event.attributes.startDate)} {event.attributes.title}
                        </Link>
                      ))}
                      {day.events.length > 3 && (
                        <div className="text-xs text-gray-500 px-2">
                          +{day.events.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { type: 'Seminar', color: 'bg-blue-500' },
                  { type: 'Workshop', color: 'bg-purple-500' },
                  { type: 'Conference', color: 'bg-green-500' },
                  { type: 'Lecture', color: 'bg-yellow-500' },
                  { type: 'Social', color: 'bg-pink-500' },
                  { type: 'Field Trip', color: 'bg-teal-500' },
                  { type: 'Defense', color: 'bg-red-500' },
                  { type: 'Other', color: 'bg-gray-500' }
                ].map(({ type, color }) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${color}`}></div>
                    <span className="text-sm text-gray-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Selected Date Events */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedDate ? (
                  <>
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({selectedDayEvents.length} events)
                    </span>
                  </>
                ) : (
                  'Select a date'
                )}
              </h3>

              {selectedDate && selectedDayEvents.length === 0 && (
                <p className="text-gray-500 text-sm">No events on this date</p>
              )}

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {selectedDayEvents.map(event => (
                  <div key={event.id} className="border-l-4 border-ocean-blue pl-3 py-2">
                    <div className={`inline-block px-2 py-1 rounded text-xs text-white mb-2 ${getCategoryColor(event.attributes.eventType)}`}>
                      {event.attributes.eventType}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {event.attributes.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatTime(event.attributes.startDate)}
                    </p>
                    {event.attributes.location && (
                      <p className="text-xs text-gray-500 mb-2">
                        📍 {event.attributes.location}
                      </p>
                    )}
                    {event.attributes.speaker && (
                      <p className="text-xs text-gray-500 mb-3">
                        🎤 {event.attributes.speaker}
                      </p>
                    )}
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/events/${event.attributes.slug}`}
                        className="text-xs text-ocean-blue hover:underline font-semibold"
                      >
                        View Details →
                      </Link>
                      <button
                        onClick={() => window.open(generateGoogleCalendarUrl(event), '_blank')}
                        className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition flex items-center justify-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.5 3.09L15 7.59V4.5a.5.5 0 00-.5-.5H10v2h4v5h-2v2h2v5H10v2h4.5a.5.5 0 00.5-.5v-3.09l4.5 4.5V3.09zM9 11v2H7v-2h2m8-4h2v2h-2V7M5 7h2v2H5V7m0 4h2v2H5v-2m0 4h2v2H5v-2z"/>
                        </svg>
                        Add to Google Calendar
                      </button>
                      <button
                        onClick={() => downloadICS(event)}
                        className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition flex items-center justify-center gap-1"
                      >
                        <DownloadIcon className="w-3 h-3" />
                        Download .ics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Calendar Integration CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Calendar</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Stay up-to-date with all EEMB events. Export our calendar to Google Calendar, Apple Calendar, Outlook, or any calendar app that supports .ics files.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={exportAllEvents}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2"
            >
              <DownloadIcon className="w-5 h-5" />
              Download Full Calendar
            </button>
            <Link
              href="/events"
              className="bg-white/10 backdrop-blur border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition"
            >
              View Events List
            </Link>
          </div>
          <p className="text-sm text-white/70 mt-6">
            The .ics file can be imported into Google Calendar, Apple Calendar, Outlook, and most other calendar applications.
          </p>
        </div>
      </section>
    </div>
  )
}
