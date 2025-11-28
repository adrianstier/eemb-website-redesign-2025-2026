'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface StaffMember {
  id: number
  attributes: {
    fullName: string
    firstName: string
    lastName: string
    email: string
    title: string
    office: string
    phone: string
    bio: string
    responsibilities: string[]
    department: string
    personalWebsite: string
    linkedin: string
  }
}

export default function StaffManagement() {
  const router = useRouter()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetchStaff(token)
  }, [router])

  const fetchStaff = async (token: string) => {
    try {
      const response = await fetch('http://localhost:1337/api/staff-members?pagination[limit]=200&sort=fullName:asc', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setStaff(data.data || [])
    } catch (error) {
      console.error('Failed to fetch staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member: StaffMember) => {
    setEditingId(member.id)
    setEditForm({
      fullName: member.attributes.fullName || '',
      firstName: member.attributes.firstName || '',
      lastName: member.attributes.lastName || '',
      email: member.attributes.email || '',
      title: member.attributes.title || '',
      office: member.attributes.office || '',
      phone: member.attributes.phone || '',
      bio: member.attributes.bio || '',
      responsibilities: member.attributes.responsibilities?.join(', ') || '',
      department: member.attributes.department || '',
      personalWebsite: member.attributes.personalWebsite || '',
      linkedin: member.attributes.linkedin || ''
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    setSaving(true)
    const token = localStorage.getItem('adminToken')

    try {
      const responsibilities = editForm.responsibilities
        ? editForm.responsibilities.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : []

      const dataToSave = {
        fullName: editForm.fullName,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        title: editForm.title,
        office: editForm.office,
        phone: editForm.phone,
        bio: editForm.bio,
        responsibilities,
        department: editForm.department,
        personalWebsite: editForm.personalWebsite,
        linkedin: editForm.linkedin
      }

      const response = await fetch(`http://localhost:1337/api/staff-members/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data: dataToSave })
      })

      if (response.ok) {
        await fetchStaff(token!)
        setEditingId(null)
        setEditForm({})
      } else {
        alert('Failed to save changes')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const filteredStaff = staff.filter(member =>
    member.attributes.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.attributes.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.attributes.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Display)</label>
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
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
                        <input
                          type="text"
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="EEMB"
                        />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
                        <input
                          type="url"
                          value={editForm.personalWebsite}
                          onChange={(e) => setEditForm({ ...editForm, personalWebsite: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://..."
                        />
                      </div>
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
                      <h3 className="text-lg font-semibold text-gray-900">{member.attributes.fullName}</h3>
                      <p className="text-sm text-gray-600">{member.attributes.title}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(member)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{member.attributes.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{member.attributes.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Office:</span>
                      <span className="ml-2 text-gray-900">{member.attributes.office || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <span className="ml-2 text-gray-900">{member.attributes.department || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Links */}
                  {(member.attributes.personalWebsite || member.attributes.linkedin) && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {member.attributes.personalWebsite && (
                        <a href={member.attributes.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">
                          Website
                        </a>
                      )}
                      {member.attributes.linkedin && (
                        <a href={member.attributes.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}

                  {member.attributes.responsibilities && member.attributes.responsibilities.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Responsibilities:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.attributes.responsibilities.map((resp, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs">
                            {resp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.attributes.bio && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{member.attributes.bio}</p>
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
