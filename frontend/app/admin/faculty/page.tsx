'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FacultyMember {
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
    shortBio: string
    researchInterests: string[]
    research_areas: string
    personalWebsite: string
    labWebsite: string
    googleScholar: string
    orcid: string
    twitter: string
    linkedin: string
  }
}

export default function FacultyManagement() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
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

    fetchFaculty(token)
  }, [router])

  const fetchFaculty = async (token: string) => {
    try {
      const response = await fetch('http://localhost:1337/api/faculties?pagination[limit]=200&sort=fullName:asc', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setFaculty(data.data || [])
    } catch (error) {
      console.error('Failed to fetch faculty:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member: FacultyMember) => {
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
      shortBio: member.attributes.shortBio || '',
      researchInterests: member.attributes.researchInterests?.join(', ') || '',
      research_areas: member.attributes.research_areas || '',
      personalWebsite: member.attributes.personalWebsite || '',
      labWebsite: member.attributes.labWebsite || '',
      googleScholar: member.attributes.googleScholar || '',
      orcid: member.attributes.orcid || '',
      twitter: member.attributes.twitter || '',
      linkedin: member.attributes.linkedin || ''
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    setSaving(true)
    const token = localStorage.getItem('adminToken')

    try {
      // Parse research interests from comma-separated string
      const researchInterests = editForm.researchInterests
        ? editForm.researchInterests.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
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
        shortBio: editForm.shortBio,
        researchInterests,
        research_areas: editForm.research_areas,
        personalWebsite: editForm.personalWebsite,
        labWebsite: editForm.labWebsite,
        googleScholar: editForm.googleScholar,
        orcid: editForm.orcid,
        twitter: editForm.twitter,
        linkedin: editForm.linkedin
      }

      const response = await fetch(`http://localhost:1337/api/faculties/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data: dataToSave })
      })

      if (response.ok) {
        // Refresh faculty list
        await fetchFaculty(token!)
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

  const filteredFaculty = faculty.filter(member =>
    member.attributes.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.attributes.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.attributes.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Display)</label>
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="Professor, Assistant Professor, etc."
                        />
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
                          value={editForm.shortBio}
                          onChange={(e) => setEditForm({ ...editForm, shortBio: e.target.value })}
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
                          value={editForm.researchInterests}
                          onChange={(e) => setEditForm({ ...editForm, researchInterests: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="Marine Biology, Ecology, Evolution, Climate Change"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Research Areas</label>
                        <select
                          value={editForm.research_areas}
                          onChange={(e) => setEditForm({ ...editForm, research_areas: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                        >
                          <option value="">Select research area...</option>
                          <option value="ecology">Ecology</option>
                          <option value="evolution">Evolution</option>
                          <option value="marine-biology">Marine Biology</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Links & Social Media */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Links & Social Media</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
                        <input
                          type="url"
                          value={editForm.personalWebsite}
                          onChange={(e) => setEditForm({ ...editForm, personalWebsite: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lab Website</label>
                        <input
                          type="url"
                          value={editForm.labWebsite}
                          onChange={(e) => setEditForm({ ...editForm, labWebsite: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar</label>
                        <input
                          type="url"
                          value={editForm.googleScholar}
                          onChange={(e) => setEditForm({ ...editForm, googleScholar: e.target.value })}
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X</label>
                        <input
                          type="url"
                          value={editForm.twitter}
                          onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                        <input
                          type="url"
                          value={editForm.linkedin}
                          onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal"
                          placeholder="https://linkedin.com/in/..."
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
                      <h3 className="text-lg font-semibold text-gray-900">{member.attributes.fullName}</h3>
                      <p className="text-sm text-gray-600">{member.attributes.title}</p>
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
                    {member.attributes.research_areas && (
                      <div>
                        <span className="text-gray-600">Area:</span>
                        <span className="ml-2 text-gray-900 capitalize">{member.attributes.research_areas.replace('-', ' ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Social/Academic Links */}
                  {(member.attributes.personalWebsite || member.attributes.labWebsite || member.attributes.googleScholar || member.attributes.orcid || member.attributes.twitter || member.attributes.linkedin) && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {member.attributes.personalWebsite && (
                        <a href={member.attributes.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">
                          Website
                        </a>
                      )}
                      {member.attributes.labWebsite && (
                        <a href={member.attributes.labWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">
                          Lab
                        </a>
                      )}
                      {member.attributes.googleScholar && (
                        <a href={member.attributes.googleScholar} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">
                          Scholar
                        </a>
                      )}
                      {member.attributes.orcid && (
                        <a href={member.attributes.orcid} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">
                          ORCID
                        </a>
                      )}
                      {member.attributes.twitter && (
                        <a href={member.attributes.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">
                          Twitter
                        </a>
                      )}
                      {member.attributes.linkedin && (
                        <a href={member.attributes.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}

                  {member.attributes.researchInterests && member.attributes.researchInterests.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Research Interests:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.attributes.researchInterests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-ocean-teal/10 text-ocean-teal rounded-full text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.attributes.shortBio && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{member.attributes.shortBio}</p>
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
