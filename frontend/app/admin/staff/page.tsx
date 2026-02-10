'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface StaffMember {
  id: number
  first_name: string
  last_name: string
  full_name: string | null
  email: string
  title: string | null
  office: string | null
  phone: string | null
  bio: string | null
  short_bio: string | null
  responsibilities: string[] | null
  department: string | null
  linkedin: string | null
  active: boolean
}

export default function StaffManagement() {
  const router = useRouter()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setError(null)
      const response = await fetch('/api/admin/staff')
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      const data = await response.json()
      setStaff(data || [])
    } catch (err) {
      console.error('Failed to fetch staff:', err)
      setError('Failed to load staff data. Please try refreshing the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member: StaffMember) => {
    setEditingId(member.id)
    setEditForm({
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      full_name: member.full_name || '',
      email: member.email || '',
      title: member.title || '',
      office: member.office || '',
      phone: member.phone || '',
      bio: member.bio || '',
      short_bio: member.short_bio || '',
      responsibilities: member.responsibilities?.join(', ') || '',
      department: member.department || '',
      linkedin: member.linkedin || ''
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    setSaving(true)

    try {
      const responsibilities = editForm.responsibilities
        ? editForm.responsibilities.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : []

      const dataToSave = {
        id: editingId,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        full_name: editForm.full_name || null,
        email: editForm.email,
        title: editForm.title || null,
        office: editForm.office || null,
        phone: editForm.phone || null,
        bio: editForm.bio || null,
        short_bio: editForm.short_bio || null,
        responsibilities,
        department: editForm.department || null,
        linkedin: editForm.linkedin || null
      }

      const response = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      })

      if (response.ok) {
        await fetchStaff()
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
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const displayName = (member: StaffMember) =>
    member.full_name || `${member.first_name} ${member.last_name}`.trim()

  const filteredStaff = staff.filter(member => {
    const name = displayName(member).toLowerCase()
    const email = (member.email || '').toLowerCase()
    const title = (member.title || '').toLowerCase()
    const term = searchTerm.toLowerCase()
    return name.includes(term) || email.includes(term) || title.includes(term)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-green-600 hover:text-green-700 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
              <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                {staff.length} members
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
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          {filteredStaff.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {editingId === member.id ? (
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Display)</label>
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title/Position</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Department Manager, Administrative Assistant, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="(805) 893-XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Office</label>
                        <input
                          type="text"
                          value={editForm.office}
                          onChange={(e) => setEditForm({ ...editForm, office: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Noble Hall 3XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select a department...</option>
                          <option value="EEMB">EEMB</option>
                          <option value="MCDB">MCDB</option>
                          <option value="Joint Appointment">Joint Appointment</option>
                          <option value="Administration">Administration</option>
                          <option value="Shared">Shared</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Role & Bio */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Role & Bio</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Brief description of role and background..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                        <textarea
                          value={editForm.short_bio}
                          onChange={(e) => setEditForm({ ...editForm, short_bio: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="One-line summary for card views..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (comma-separated)</label>
                        <textarea
                          value={editForm.responsibilities}
                          onChange={(e) => setEditForm({ ...editForm, responsibilities: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Payroll, Budgets, Purchasing, Travel Reimbursements"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Links */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                        <input
                          type="url"
                          value={editForm.linkedin}
                          onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
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
                      <h3 className="text-lg font-semibold text-gray-900">{displayName(member)}</h3>
                      <p className="text-sm text-gray-600">{member.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!member.active && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      )}
                      <button
                        onClick={() => handleEdit(member)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
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
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <span className="ml-2 text-gray-900">{member.department || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Links */}
                  {member.linkedin && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">
                        LinkedIn
                      </a>
                    </div>
                  )}

                  {member.responsibilities && member.responsibilities.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Responsibilities:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.responsibilities.map((resp, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs">
                            {resp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.bio && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{member.bio}</p>
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
