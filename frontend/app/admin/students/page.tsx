'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Student {
  id: number
  first_name: string
  last_name: string
  full_name: string | null
  email: string
  degree_program: string | null
  year_entered: number | null
  expected_graduation: number | null
  advisor_id: number | null
  office: string | null
  phone: string | null
  short_bio: string | null
  research_interests: string[] | null
  personal_website: string | null
  lab_website: string | null
  google_scholar: string | null
  orcid: string | null
  twitter: string | null
  linkedin: string | null
  active: boolean
}

export default function StudentsManagement() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setStudents(data || [])
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingId(student.id)
    setEditForm({
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      email: student.email || '',
      degree_program: student.degree_program || 'PhD',
      year_entered: student.year_entered != null ? String(student.year_entered) : '',
      expected_graduation: student.expected_graduation != null ? String(student.expected_graduation) : '',
      office: student.office || '',
      phone: student.phone || '',
      short_bio: student.short_bio || '',
      research_interests: (student.research_interests || []).join(', '),
      personal_website: student.personal_website || '',
      lab_website: student.lab_website || '',
      google_scholar: student.google_scholar || '',
      orcid: student.orcid || '',
      twitter: student.twitter || '',
      linkedin: student.linkedin || '',
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    setSaving(true)

    try {
      const dataToSave = {
        id: editingId,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        degree_program: editForm.degree_program || null,
        year_entered: editForm.year_entered ? parseInt(editForm.year_entered) : null,
        expected_graduation: editForm.expected_graduation ? parseInt(editForm.expected_graduation) : null,
        office: editForm.office || null,
        phone: editForm.phone || null,
        short_bio: editForm.short_bio || null,
        research_interests: editForm.research_interests
          ? editForm.research_interests.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : [],
        personal_website: editForm.personal_website || null,
        lab_website: editForm.lab_website || null,
        google_scholar: editForm.google_scholar || null,
        orcid: editForm.orcid || null,
        twitter: editForm.twitter || null,
        linkedin: editForm.linkedin || null,
      }

      const response = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })

      if (response.ok) {
        await fetchStudents()
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

  const displayName = (student: Student) =>
    student.full_name || `${student.first_name} ${student.last_name}`

  const filteredStudents = students.filter((student) => {
    const name = displayName(student).toLowerCase()
    const email = (student.email || '').toLowerCase()
    const term = searchTerm.toLowerCase()
    return name.includes(term) || email.includes(term)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-ocean-teal hover:text-ocean-deep transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Graduate Students Management</h1>
              <span className="bg-ocean-teal/10 text-ocean-teal px-3 py-1 rounded-full text-sm font-medium">
                {students.length} students
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
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {editingId === student.id ? (
                <div className="p-6">
                  {/* Basic Info */}
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree Program</label>
                      <select
                        value={editForm.degree_program}
                        onChange={(e) => setEditForm({ ...editForm, degree_program: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      >
                        <option value="PhD">PhD</option>
                        <option value="MS">MS</option>
                        <option value="Combined BS-MS">Combined BS-MS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Entered</label>
                      <input
                        type="number"
                        value={editForm.year_entered}
                        onChange={(e) => setEditForm({ ...editForm, year_entered: e.target.value })}
                        placeholder="2022"
                        min="2000"
                        max="2030"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation</label>
                      <input
                        type="number"
                        value={editForm.expected_graduation}
                        onChange={(e) => setEditForm({ ...editForm, expected_graduation: e.target.value })}
                        placeholder="2027"
                        min="2020"
                        max="2035"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Office</label>
                      <input
                        type="text"
                        value={editForm.office}
                        onChange={(e) => setEditForm({ ...editForm, office: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Research */}
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Research</h4>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio / Research Summary</label>
                      <textarea
                        value={editForm.short_bio}
                        onChange={(e) => setEditForm({ ...editForm, short_bio: e.target.value })}
                        rows={3}
                        placeholder="Brief description of your research focus..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Research Interests</label>
                      <input
                        type="text"
                        value={editForm.research_interests}
                        onChange={(e) => setEditForm({ ...editForm, research_interests: e.target.value })}
                        placeholder="Ecology, Climate Change, Marine Biology (comma-separated)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">Separate multiple interests with commas</p>
                    </div>
                  </div>

                  {/* Links & Social */}
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Links & Social Media</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
                      <input
                        type="url"
                        value={editForm.personal_website}
                        onChange={(e) => setEditForm({ ...editForm, personal_website: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lab Website</label>
                      <input
                        type="url"
                        value={editForm.lab_website}
                        onChange={(e) => setEditForm({ ...editForm, lab_website: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar</label>
                      <input
                        type="url"
                        value={editForm.google_scholar}
                        onChange={(e) => setEditForm({ ...editForm, google_scholar: e.target.value })}
                        placeholder="https://scholar.google.com/citations?user=..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ORCID iD</label>
                      <input
                        type="text"
                        value={editForm.orcid}
                        onChange={(e) => setEditForm({ ...editForm, orcid: e.target.value })}
                        placeholder="0000-0000-0000-0000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X</label>
                      <input
                        type="text"
                        value={editForm.twitter}
                        onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                        placeholder="@username or full URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                      <input
                        type="text"
                        value={editForm.linkedin}
                        onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                        placeholder="username or full URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {displayName(student)}
                        {!student.active && (
                          <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-normal">
                            Inactive
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {student.degree_program && `${student.degree_program} Student`}
                        {student.year_entered && ` · Entered ${student.year_entered}`}
                        {student.expected_graduation && ` · Expected ${student.expected_graduation}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEdit(student)}
                      className="px-4 py-2 bg-ocean-teal text-white rounded-lg hover:bg-ocean-blue transition text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Short Bio */}
                  {student.short_bio && (
                    <p className="text-sm text-gray-700 mb-4 italic">{student.short_bio}</p>
                  )}

                  {/* Research Interests */}
                  {student.research_interests && student.research_interests.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {student.research_interests.map((interest, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-ocean-50 text-ocean-teal text-xs rounded-full font-medium">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{student.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{student.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Office:</span>
                      <span className="ml-2 text-gray-900">{student.office || 'N/A'}</span>
                    </div>
                    {student.google_scholar && (
                      <div>
                        <span className="text-gray-600">Scholar:</span>
                        <a href={student.google_scholar} target="_blank" rel="noopener noreferrer" className="ml-2 text-ocean-teal hover:underline">View</a>
                      </div>
                    )}
                  </div>

                  {/* Social Links Preview */}
                  {(student.personal_website || student.lab_website || student.twitter || student.linkedin || student.orcid) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                      {student.personal_website && (
                        <a href={student.personal_website} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">Website</a>
                      )}
                      {student.lab_website && (
                        <a href={student.lab_website} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">Lab</a>
                      )}
                      {student.twitter && (
                        <a href={student.twitter.startsWith('http') ? student.twitter : `https://twitter.com/${student.twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">Twitter</a>
                      )}
                      {student.linkedin && (
                        <a href={student.linkedin.startsWith('http') ? student.linkedin : `https://linkedin.com/in/${student.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">LinkedIn</a>
                      )}
                      {student.orcid && (
                        <a href={`https://orcid.org/${student.orcid}`} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">ORCID</a>
                      )}
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
