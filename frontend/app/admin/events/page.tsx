'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, CheckCircle, XCircle, Star, Calendar, MapPin, Mic } from 'lucide-react'

interface EventForm {
  title: string
  eventType: string
  startDate: string
  endDate: string
  allDay: boolean
  location: string
  virtualLink: string
  description: string
  shortDescription: string
  speaker: string
  speakerTitle: string
  speakerAffiliation: string
  speakerBio: string
  registrationRequired: boolean
  registrationLink: string
  registrationDeadline: string
  maxAttendees: string
  tags: string
  featured: boolean
  recurring: boolean
  recurringPattern: string
}

const initialFormState: EventForm = {
  title: '',
  eventType: 'Seminar',
  startDate: '',
  endDate: '',
  allDay: false,
  location: '',
  virtualLink: '',
  description: '',
  shortDescription: '',
  speaker: '',
  speakerTitle: '',
  speakerAffiliation: '',
  speakerBio: '',
  registrationRequired: false,
  registrationLink: '',
  registrationDeadline: '',
  maxAttendees: '',
  tags: '',
  featured: false,
  recurring: false,
  recurringPattern: ''
}

export default function AdminEventsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [formData, setFormData] = useState<EventForm>(initialFormState)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'authenticated') {
      setIsAuthenticated(true)
      fetchEvents()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - in production, use proper authentication
    if (password === 'eemb2024admin') {
      setIsAuthenticated(true)
      localStorage.setItem('admin_auth', 'authenticated')
      setLoginError('')
      fetchEvents()
    } else {
      setLoginError('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_auth')
    setPassword('')
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/events?sort=startDate:desc&populate=*')
      const data = await response.json()
      setEvents(data.data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return

    setIsAiGenerating(true)
    try {
      // Simulate AI generation with intelligent parsing
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Parse the prompt for event details
      const prompt = aiPrompt.toLowerCase()

      // Extract date patterns
      const dateMatch = prompt.match(/(\d{1,2}\/\d{1,2}\/\d{4})|(\d{4}-\d{2}-\d{2})|(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/)

      // Extract time patterns
      const timeMatch = prompt.match(/(\d{1,2}:\d{2}\s*(am|pm)?)|(\d{1,2}\s*(am|pm))/)

      // Extract event type
      let eventType = 'Seminar'
      if (prompt.includes('workshop')) eventType = 'Workshop'
      else if (prompt.includes('conference')) eventType = 'Conference'
      else if (prompt.includes('lecture')) eventType = 'Lecture'
      else if (prompt.includes('social')) eventType = 'Social'
      else if (prompt.includes('field trip')) eventType = 'Field Trip'
      else if (prompt.includes('defense')) eventType = 'Defense'

      // Extract location
      const locationMatch = prompt.match(/(?:at|in|location:|venue:)\s*([^,.]+)/)

      // Extract speaker info
      const speakerMatch = prompt.match(/(?:speaker|presenter|by|with)\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/)

      // Generate intelligent defaults
      const generatedData: Partial<EventForm> = {
        title: aiPrompt.split('.')[0].trim().replace(/^(event|seminar|workshop|lecture|create|add|new)\s+/i, ''),
        eventType,
        description: `<p>${aiPrompt}</p>`,
        shortDescription: aiPrompt.substring(0, 200),
      }

      if (locationMatch) {
        generatedData.location = locationMatch[1].trim()
      } else if (prompt.includes('online') || prompt.includes('virtual') || prompt.includes('zoom')) {
        generatedData.location = 'Virtual'
        generatedData.virtualLink = 'https://'
      } else {
        generatedData.location = 'Life Sciences Building, Room 1001'
      }

      if (speakerMatch) {
        generatedData.speaker = speakerMatch[1]
      }

      // Generate start date
      if (dateMatch) {
        const dateStr = dateMatch[0]
        generatedData.startDate = new Date(dateStr).toISOString().split('.')[0]
      } else {
        // Default to next week
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)
        nextWeek.setHours(15, 0, 0, 0)
        generatedData.startDate = nextWeek.toISOString().split('.')[0]
      }

      // Set end date 1 hour later
      const start = new Date(generatedData.startDate!)
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      generatedData.endDate = end.toISOString().split('.')[0]

      setFormData(prev => ({ ...prev, ...generatedData }))
      setSaveMessage('ai:AI generated event details! Review and adjust as needed.')
      setTimeout(() => setSaveMessage(''), 5000)
    } catch (error) {
      console.error('Error generating with AI:', error)
      setSaveMessage('Error generating event details')
    } finally {
      setIsAiGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      const eventData = {
        data: {
          title: formData.title,
          eventType: formData.eventType,
          startDate: formData.startDate,
          endDate: formData.endDate || null,
          allDay: formData.allDay,
          location: formData.location || null,
          virtualLink: formData.virtualLink || null,
          description: formData.description || null,
          shortDescription: formData.shortDescription || null,
          speaker: formData.speaker || null,
          speakerTitle: formData.speakerTitle || null,
          speakerAffiliation: formData.speakerAffiliation || null,
          speakerBio: formData.speakerBio || null,
          registrationRequired: formData.registrationRequired,
          registrationLink: formData.registrationLink || null,
          registrationDeadline: formData.registrationDeadline || null,
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          featured: formData.featured,
          recurring: formData.recurring,
          recurringPattern: formData.recurringPattern || null,
          publishedAt: new Date().toISOString()
        }
      }

      const url = editingEventId
        ? `http://localhost:1337/api/events/${editingEventId}`
        : 'http://localhost:1337/api/events'

      const method = editingEventId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
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
        setSaveMessage(`error:Error: ${error.error?.message || 'Failed to save event'}`)
      }
    } catch (error) {
      console.error('Error saving event:', error)
      setSaveMessage('error:Error saving event. Make sure the backend is running.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (event: any) => {
    const attrs = event.attributes
    setFormData({
      title: attrs.title || '',
      eventType: attrs.eventType || 'Seminar',
      startDate: attrs.startDate?.split('.')[0] || '',
      endDate: attrs.endDate?.split('.')[0] || '',
      allDay: attrs.allDay || false,
      location: attrs.location || '',
      virtualLink: attrs.virtualLink || '',
      description: attrs.description || '',
      shortDescription: attrs.shortDescription || '',
      speaker: attrs.speaker || '',
      speakerTitle: attrs.speakerTitle || '',
      speakerAffiliation: attrs.speakerAffiliation || '',
      speakerBio: attrs.speakerBio || '',
      registrationRequired: attrs.registrationRequired || false,
      registrationLink: attrs.registrationLink || '',
      registrationDeadline: attrs.registrationDeadline?.split('.')[0] || '',
      maxAttendees: attrs.maxAttendees?.toString() || '',
      tags: Array.isArray(attrs.tags) ? attrs.tags.join(', ') : '',
      featured: attrs.featured || false,
      recurring: attrs.recurring || false,
      recurringPattern: attrs.recurringPattern || ''
    })
    setEditingEventId(event.id)
    setShowForm(true)
  }

  const handleDelete = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`http://localhost:1337/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSaveMessage('success:Event deleted successfully!')
        fetchEvents()
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      setSaveMessage('error:Error deleting event')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-ocean-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Events Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm font-semibold">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-ocean-blue text-white py-3 rounded-lg font-semibold hover:bg-ocean-deep transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </button>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
              <p className="text-blue-700 text-xs">
                <strong>Demo Password:</strong> eemb2024admin
              </p>
            </div>
          </form>
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
              <h1 className="text-3xl font-bold mb-1">Events Admin</h1>
              <p className="text-white/80">AI-Powered Event Management</p>
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
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {saveMessage && (() => {
          const [type, message] = saveMessage.includes(':') ? saveMessage.split(':') : ['error', saveMessage]
          const isSuccess = type === 'success'
          const isAi = type === 'ai'
          return (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${isSuccess ? 'bg-green-50 border-l-4 border-green-500' : isAi ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
              {isSuccess && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
              {isAi && <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />}
              {!isSuccess && !isAi && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
              <p className={`font-semibold ${isSuccess ? 'text-green-700' : isAi ? 'text-blue-700' : 'text-red-700'}`}>
                {message}
              </p>
            </div>
          )
        })()}

        {!showForm && (
          <div className="mb-8">
            <button
              onClick={() => {
                setShowForm(true)
                setEditingEventId(null)
                setFormData(initialFormState)
              }}
              className="bg-ocean-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-ocean-sunset transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Event
            </button>
          </div>
        )}

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

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI Event Assistant</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Describe your event in natural language and let AI fill in the details!
              </p>
              <div className="space-y-3">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Example: 'Create a seminar on coral reef conservation by Dr. Sarah Chen on December 15th at 3pm in the Marine Science Institute. She'll discuss her latest research on climate adaptation in tropical corals.'"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAiGenerate}
                  disabled={isAiGenerating || !aiPrompt.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAiGenerating ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Event Details
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Event Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="EEMB Seminar: Ocean Acidification"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    required
                    value={formData.eventType}
                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  >
                    <option value="Seminar">Seminar</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Social">Social</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="Defense">Defense</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Alumni Event">Alumni Event</option>
                    <option value="Field Trip">Field Trip</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="Life Sciences Building, Room 1001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Virtual Link (Zoom, etc.)
                  </label>
                  <input
                    type="url"
                    value={formData.virtualLink}
                    onChange={(e) => setFormData({...formData, virtualLink: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="https://zoom.us/..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent resize-none"
                    rows={2}
                    placeholder="Brief summary for list views..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Detailed event description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaker Name
                  </label>
                  <input
                    type="text"
                    value={formData.speaker}
                    onChange={(e) => setFormData({...formData, speaker: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaker Title
                  </label>
                  <input
                    type="text"
                    value={formData.speakerTitle}
                    onChange={(e) => setFormData({...formData, speakerTitle: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="Professor of Marine Biology"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Speaker Affiliation
                  </label>
                  <input
                    type="text"
                    value={formData.speakerAffiliation}
                    onChange={(e) => setFormData({...formData, speakerAffiliation: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="Stanford University"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    placeholder="marine biology, conservation, coral reefs"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="w-5 h-5 text-ocean-blue"
                    />
                    <span className="text-sm font-semibold text-gray-700">Featured Event</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allDay}
                      onChange={(e) => setFormData({...formData, allDay: e.target.checked})}
                      className="w-5 h-5 text-ocean-blue"
                    />
                    <span className="text-sm font-semibold text-gray-700">All Day Event</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.registrationRequired}
                      onChange={(e) => setFormData({...formData, registrationRequired: e.target.checked})}
                      className="w-5 h-5 text-ocean-blue"
                    />
                    <span className="text-sm font-semibold text-gray-700">Registration Required</span>
                  </label>
                </div>

                {formData.registrationRequired && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Registration Link
                      </label>
                      <input
                        type="url"
                        value={formData.registrationLink}
                        onChange={(e) => setFormData({...formData, registrationLink: e.target.value})}
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
                        value={formData.maxAttendees}
                        onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                        placeholder="50"
                        min="0"
                      />
                    </div>
                  </>
                )}
              </div>

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

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events ({events.length})</h2>

          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg">No events created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-ocean-blue transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-ocean-blue text-white rounded-full text-xs font-semibold">
                          {event.attributes.eventType}
                        </span>
                        {event.attributes.featured && (
                          <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.attributes.title}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.attributes.startDate).toLocaleString()}
                        </p>
                        {event.attributes.location && (
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.attributes.location}
                          </p>
                        )}
                        {event.attributes.speaker && (
                          <p className="flex items-center gap-2">
                            <Mic className="w-4 h-4" />
                            {event.attributes.speaker}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
