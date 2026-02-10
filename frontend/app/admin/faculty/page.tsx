'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FacultyMember {
  id: number
  first_name: string
  last_name: string
  full_name: string | null
  email: string
  title: string
  office: string | null
  phone: string | null
  bio: string | null
  short_bio: string | null
  research_interests: any[] | null
  google_scholar: string | null
  orcid: string | null
  lab_website: string | null
  active: boolean
  slug: string | null
}

export default function FacultyManagement() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    try {
      const response = await fetch('/api/admin/faculty')
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      const data = await response.json()
      setFaculty(data || [])
    } catch (error) {
      console.error('Failed to fetch faculty:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member: FacultyMember) => {
    setEditingId(member.id)
    setEditForm({
      full_name: member.full_name || '',
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      email: member.email || '',
      title: member.title || '',
      office: member.office || '',
      phone: member.phone || '',
      bio: member.bio || '',
      short_bio: member.short_bio || '',
      research_interests: Array.isArray(member.research_interests)
        ? member.research_interests.join(', ')
        : '',
      lab_website: member.lab_website || '',
      google_scholar: member.google_scholar || '',
      orcid: member.orcid || '',
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    setSaving(true)

    try {
      // Parse research interests from comma-separated string
      const research_interests = editForm.research_interests
        ? editForm.research_interests.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : []

      const dataToSave = {
        id: editingId,
        full_name: editForm.full_name,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        title: editForm.title,
        office: editForm.office || null,
        phone: editForm.phone || null,
        bio: editForm.bio || null,
        short_bio: editForm.short_bio || null,
        research_interests,
        lab_website: editForm.lab_website || null,
        google_scholar: editForm.google_scholar || null,
        orcid: editForm.orcid || null,
      }

      const response = await fetch('/api/admin/faculty', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      })

      if (response.ok) {
        // Refresh faculty list
        await fetchFaculty()
        setEditingId(null)
        setEditForm({})
      } else {
        const errorData = await response.json().catch(() => null)
        alert(errorData?.error || 'Failed to save changes')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const displayName = (member: FacultyMember) =>
    member.full_name || `${member.first_name} ${member.last_name}`

  const filteredFaculty = faculty.filter(member => {
    const name = displayName(member).toLowerCase()
    const email = (member.email || '').toLowerCase()
    const title = (member.title || '').toLowerCase()
    const term = searchTerm.toLowerCase()
    return name.includes(term) || email.includes(term) || title.includes(term)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-teal"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-ocean-blue hover:text-ocean-teal transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
              <span className="bg-ocean-teal/10 text-ocean-teal px-3 py-1 rounded-full text-sm font-medium">
                {faculty.length} members
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
          />
        </div>

        {/* Faculty List */}
        <div className="space-y-4">
          {filteredFaculty.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {editingId === member.id ? (
                /* Edit Form */
                <div className="p-6">
                  {/* Section 1: Basic Information */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Display)</label>
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <select
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                        >
                          <option value="">Select a title...</option>
                          <option value="Professor">Professor</option>
                          <option value="Associate Professor">Associate Professor</option>
                          <option value="Assistant Professor">Assistant Professor</option>
                          <option value="Adjunct Professor">Adjunct Professor</option>
                          <option value="Professor Emeritus">Professor Emeritus</option>
                          <option value="Lecturer">Lecturer</option>
                          <option value="Researcher">Researcher</option>
                          <option value="Visiting Professor">Visiting Professor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="(805) 893-XXXX"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Office</label>
                        <input
                          type="text"
                          value={editForm.office}
                          onChange={(e) => setEditForm({ ...editForm, office: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="Noble Hall 4XXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Research */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Research</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                        <textarea
                          value={editForm.short_bio}
                          onChange={(e) => setEditForm({ ...editForm, short_bio: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="Brief description for cards and previews..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Bio</label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="Detailed biography for profile page..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Research Interests (comma-separated)</label>
                        <textarea
                          value={editForm.research_interests}
                          onChange={(e) => setEditForm({ ...editForm, research_interests: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="Marine Biology, Ecology, Evolution, Climate Change"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Academic Links */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Academic Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lab Website</label>
                        <input
                          type="url"
                          value={editForm.lab_website}
                          onChange={(e) => setEditForm({ ...editForm, lab_website: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar</label>
                        <input
                          type="url"
                          value={editForm.google_scholar}
                          onChange={(e) => setEditForm({ ...editForm, google_scholar: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="https://scholar.google.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ORCID</label>
                        <input
                          type="text"
                          value={editForm.orcid}
                          onChange={(e) => setEditForm({ ...editForm, orcid: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="https://orcid.org/0000-..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-ocean-teal text-white rounded-lg hover:bg-ocean-blue transition disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setEditForm({})
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{displayName(member)}</h3>
                        {!member.active && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{member.title}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(member)}
                      className="px-4 py-2 bg-ocean-teal text-white rounded-lg hover:bg-ocean-blue transition text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{member.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{member.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Office:</span>
                      <span className="ml-2 text-gray-900">{member.office || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Academic Links */}
                  {(member.lab_website || member.google_scholar || member.orcid) && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {member.lab_website && (
                        <a href={member.lab_website} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">
                          Lab
                        </a>
                      )}
                      {member.google_scholar && (
                        <a href={member.google_scholar} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">
                          Scholar
                        </a>
                      )}
                      {member.orcid && (
                        <a href={member.orcid} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">
                          ORCID
                        </a>
                      )}
                    </div>
                  )}

                  {Array.isArray(member.research_interests) && member.research_interests.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Research Interests:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.research_interests.filter((i): i is string => typeof i === 'string').map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-ocean-teal/10 text-ocean-teal rounded-full text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.short_bio && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{member.short_bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
