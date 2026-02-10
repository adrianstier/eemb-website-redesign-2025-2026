'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Star, Calendar, MapPin, Mic, ArrowLeft, AlertTriangle } from 'lucide-react'

interface EventData {
  id: number
  title: string
  event_type: string | null
  start_date: string
  end_date: string | null
  all_day: boolean | null
  location: string | null
  virtual_link: string | null
  description: string | null
  short_description: string | null
  speaker: string | null
  speaker_title: string | null
  speaker_affiliation: string | null
  speaker_bio: string | null
  speaker_image_url: string | null
  registration_required: boolean | null
  registration_link: string | null
  max_attendees: number | null
  featured: boolean | null
  canceled: boolean | null
  cancellation_reason: string | null
  slug: string | null
  host_faculty_id: number | null
  google_calendar_id: string | null
}

interface EventForm {
  title: string
  event_type: string
  start_date: string
  end_date: string
  all_day: boolean
  location: string
  virtual_link: string
  description: string
  short_description: string
  speaker: string
  speaker_title: string
  speaker_affiliation: string
  speaker_bio: string
  speaker_image_url: string
  registration_required: boolean
  registration_link: string
  max_attendees: string
  featured: boolean
}

const initialFormState: EventForm = {
  title: '',
  event_type: 'Seminar',
  start_date: '',
  end_date: '',
  all_day: false,
  location: '',
  virtual_link: '',
  description: '',
  short_description: '',
  speaker: '',
  speaker_title: '',
  speaker_affiliation: '',
  speaker_bio: '',
  speaker_image_url: '',
  registration_required: false,
  registration_link: '',
  max_attendees: '',
  featured: false,
}

const EVENT_TYPES = [
  'Seminar',
  'Workshop',
  'Conference',
  'Lecture',
  'Social',
  'Recruitment',
  'Defense',
  'Meeting',
  'Alumni Event',
  'Field Trip',
  'Other',
]

export default function AdminEventsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<EventForm>(initialFormState)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [cancelModalEventId, setCancelModalEventId] = useState<number | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/events')
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/auth/login')
          return
        }
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      setSaveMessage('error:Failed to load events. Please try again.')
      setTimeout(() => setSaveMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      const payload: Record<string, unknown> = {
        title: formData.title,
        event_type: formData.event_type || null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        all_day: formData.all_day,
        location: formData.location || null,
        virtual_link: formData.virtual_link || null,
        description: formData.description || null,
        short_description: formData.short_description || null,
        speaker: formData.speaker || null,
        speaker_title: formData.speaker_title || null,
        speaker_affiliation: formData.speaker_affiliation || null,
        speaker_bio: formData.speaker_bio || null,
        speaker_image_url: formData.speaker_image_url || null,
        registration_required: formData.registration_required,
        registration_link: formData.registration_link || null,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        featured: formData.featured,
      }

      if (editingEventId) {
        payload.id = editingEventId
      }

      const method = editingEventId ? 'PUT' : 'POST'

      const response = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSaveMessage(`success:Event ${editingEventId ? 'updated' : 'created'} successfully!`)
        setFormData(initialFormState)
        setShowForm(false)
        setEditingEventId(null)
        fetchEvents()
        setTimeout(() => setSaveMessage(''), 5000)
      } else {
        const error = await response.json()
        setSaveMessage(`error:Error: ${error.error || 'Failed to save event'}`)
      }
    } catch (error) {
      console.error('Error saving event:', error)
      setSaveMessage('error:Error saving event. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (event: EventData) => {
    setFormData({
      title: event.title || '',
      event_type: event.event_type || 'Seminar',
      start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
      end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
      all_day: event.all_day || false,
      location: event.location || '',
      virtual_link: event.virtual_link || '',
      description: event.description || '',
      short_description: event.short_description || '',
      speaker: event.speaker || '',
      speaker_title: event.speaker_title || '',
      speaker_affiliation: event.speaker_affiliation || '',
      speaker_bio: event.speaker_bio || '',
      speaker_image_url: event.speaker_image_url || '',
      registration_required: event.registration_required || false,
      registration_link: event.registration_link || '',
      max_attendees: event.max_attendees?.toString() || '',
      featured: event.featured || false,
    })
    setEditingEventId(event.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (eventId: number) => {
    if (!confirm('Are you sure you want to permanently delete this event? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/events?id=${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSaveMessage('success:Event deleted successfully!')
        fetchEvents()
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        const error = await response.json()
        setSaveMessage(`error:Error: ${error.error || 'Failed to delete event'}`)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      setSaveMessage('error:Error deleting event')
    }
  }

  const handleCancel = async () => {
    if (!cancelModalEventId) return

    try {
      const reasonParam = cancelReason ? `&reason=${encodeURIComponent(cancelReason)}` : ''
      const response = await fetch(
        `/api/admin/events?id=${cancelModalEventId}&cancel=true${reasonParam}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        setSaveMessage('success:Event canceled successfully!')
        setCancelModalEventId(null)
        setCancelReason('')
        fetchEvents()
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        const error = await response.json()
        setSaveMessage(`error:Error: ${error.error || 'Failed to cancel event'}`)
      }
    } catch (error) {
      console.error('Error canceling event:', error)
      setSaveMessage('error:Error canceling event')
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-deep to-ocean-blue text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold mb-1">Events Management</h1>
              <p className="text-white/80">Create and manage department events</p>
            </div>
            <div className="flex gap-4">
              <a
                href="/events"
                target="_blank"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Public Page
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Status Messages */}
        {saveMessage && (() => {
          const colonIndex = saveMessage.indexOf(':')
          const type = colonIndex > -1 ? saveMessage.substring(0, colonIndex) : 'error'
          const message = colonIndex > -1 ? saveMessage.substring(colonIndex + 1) : saveMessage
          const isSuccess = type === 'success'
          return (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${isSuccess ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
              {isSuccess ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <p className={`font-semibold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                {message}
              </p>
            </div>
          )
        })()}

        {/* Create Button */}
        {!showForm && (
          <div className="mb-8">
            <button
              onClick={() => {
                setShowForm(true)
                setEditingEventId(null)
                setFormData(initialFormState)
              }}
              className="bg-ocean-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-ocean-deep transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Event
            </button>
          </div>
        )}

        {/* Event Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEventId ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingEventId(null)
                  setFormData(initialFormState)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="EEMB Seminar: Ocean Acidification"
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="Life Sciences Building, Room 1001"
                  />
                </div>

                {/* Virtual Link */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Virtual Link (Zoom, etc.)
                  </label>
                  <input
                    type="url"
                    value={formData.virtual_link}
                    onChange={(e) => setFormData({ ...formData, virtual_link: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="https://zoom.us/..."
                  />
                </div>

                {/* Short Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent resize-none"
                    rows={2}
                    placeholder="Brief summary for list views..."
                  />
                </div>

                {/* Full Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Detailed event description..."
                  />
                </div>

                {/* Speaker Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaker Name
                  </label>
                  <input
                    type="text"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                {/* Speaker Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaker Title
                  </label>
                  <input
                    type="text"
                    value={formData.speaker_title}
                    onChange={(e) => setFormData({ ...formData, speaker_title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="Professor of Marine Biology"
                  />
                </div>

                {/* Speaker Affiliation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaker Affiliation
                  </label>
                  <input
                    type="text"
                    value={formData.speaker_affiliation}
                    onChange={(e) => setFormData({ ...formData, speaker_affiliation: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="Stanford University"
                  />
                </div>

                {/* Speaker Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaker Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.speaker_image_url}
                    onChange={(e) => setFormData({ ...formData, speaker_image_url: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                {/* Speaker Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaker Bio
                  </label>
                  <textarea
                    value={formData.speaker_bio}
                    onChange={(e) => setFormData({ ...formData, speaker_bio: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Brief biography of the speaker..."
                  />
                </div>

                {/* Checkboxes */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 text-ocean-blue"
                    />
                    <span className="text-sm font-semibold text-gray-700">Featured Event</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.all_day}
                      onChange={(e) => setFormData({ ...formData, all_day: e.target.checked })}
                      className="w-5 h-5 text-ocean-blue"
                    />
                    <span className="text-sm font-semibold text-gray-700">All Day Event</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.registration_required}
                      onChange={(e) => setFormData({ ...formData, registration_required: e.target.checked })}
                      className="w-5 h-5 text-ocean-blue"
                    />
                    <span className="text-sm font-semibold text-gray-700">Registration Required</span>
                  </label>
                </div>

                {/* Registration Fields (conditional) */}
                {formData.registration_required && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Registration Link
                      </label>
                      <input
                        type="url"
                        value={formData.registration_link}
                        onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Attendees
                      </label>
                      <input
                        type="number"
                        value={formData.max_attendees}
                        onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                        placeholder="50"
                        min="0"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-ocean-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-ocean-deep transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSaving ? 'Saving...' : editingEventId ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingEventId(null)
                    setFormData(initialFormState)
                  }}
                  className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cancel Event Modal */}
        {cancelModalEventId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Cancel Event</h3>
              </div>
              <p className="text-gray-600 mb-4">
                This will mark the event as canceled. It will still appear in the event list but will be shown as canceled to visitors.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cancellation Reason (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent resize-none"
                  rows={2}
                  placeholder="Reason for cancellation..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setCancelModalEventId(null)
                    setCancelReason('')
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
                >
                  Cancel Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events ({events.length})</h2>

          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg">No events created yet</p>
              <p className="text-sm mt-1">Click &quot;Create New Event&quot; to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`border-2 rounded-lg p-6 hover:border-ocean-blue transition-all ${
                    event.canceled
                      ? 'border-yellow-300 bg-yellow-50/50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {event.event_type && (
                          <span className="px-3 py-1 bg-ocean-blue text-white rounded-full text-xs font-semibold">
                            {event.event_type}
                          </span>
                        )}
                        {event.featured && (
                          <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3" /> Featured
                          </span>
                        )}
                        {event.canceled && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Canceled
                          </span>
                        )}
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${event.canceled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {event.title}
                      </h3>
                      {event.canceled && event.cancellation_reason && (
                        <p className="text-sm text-red-600 mb-2 italic">
                          Reason: {event.cancellation_reason}
                        </p>
                      )}
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.start_date).toLocaleString()}
                          {event.end_date && (
                            <span> - {new Date(event.end_date).toLocaleString()}</span>
                          )}
                        </p>
                        {event.location && (
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </p>
                        )}
                        {event.speaker && (
                          <p className="flex items-center gap-2">
                            <Mic className="w-4 h-4" />
                            {event.speaker}
                            {event.speaker_affiliation && (
                              <span className="text-gray-400">({event.speaker_affiliation})</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(event)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                      >
                        Edit
                      </button>
                      {!event.canceled && (
                        <button
                          onClick={() => setCancelModalEventId(event.id)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
