'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Student {
  id: number
  attributes: {
    fullName: string
    firstName: string
    lastName: string
    email: string
    degreeProgram: string
    yearEntered: number | null
    expectedGraduation: number | null
    office: string
    phone: string
    shortBio: string
    researchInterests: string[]
    personalWebsite: string
    labWebsite: string
    googleScholar: string
    orcid: string
    twitter: string
    linkedin: string
    advisor?: {
      data?: {
        id: number
        attributes: {
          fullName: string
          lastName: string
        }
      }
    }
  }
}

export default function StudentsManagement() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
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

    fetchStudents(token)
  }, [router])

  const fetchStudents = async (token: string) => {
    try {
      const response = await fetch('http://localhost:1337/api/graduate-students?pagination[limit]=200&sort=fullName:asc&populate=advisor', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setStudents(data.data || [])
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingId(student.id)
    setEditForm({
      fullName: student.attributes.fullName || '',
      email: student.attributes.email || '',
      degreeProgram: student.attributes.degreeProgram || 'PhD',
      yearEntered: student.attributes.yearEntered || '',
      expectedGraduation: student.attributes.expectedGraduation || '',
      office: student.attributes.office || '',
      phone: student.attributes.phone || '',
      shortBio: student.attributes.shortBio || '',
      researchInterests: (student.attributes.researchInterests || []).join(', '),
      personalWebsite: student.attributes.personalWebsite || '',
      labWebsite: student.attributes.labWebsite || '',
      googleScholar: student.attributes.googleScholar || '',
      orcid: student.attributes.orcid || '',
      twitter: student.attributes.twitter || '',
      linkedin: student.attributes.linkedin || ''
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    setSaving(true)
    const token = localStorage.getItem('adminToken')

    try {
      // Process the form data
      const dataToSave = {
        ...editForm,
        // Convert research interests from comma-separated string to array
        researchInterests: editForm.researchInterests
          ? editForm.researchInterests.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : [],
        // Convert year fields to integers or null
        yearEntered: editForm.yearEntered ? parseInt(editForm.yearEntered) : null,
        expectedGraduation: editForm.expectedGraduation ? parseInt(editForm.expectedGraduation) : null
      }

      const response = await fetch(`http://localhost:1337/api/graduate-students/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data: dataToSave })
      })

      if (response.ok) {
        await fetchStudents(token!)
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

  const filteredStudents = students.filter(student =>
    student.attributes.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.attributes.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
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
                        value={editForm.degreeProgram}
                        onChange={(e) => setEditForm({ ...editForm, degreeProgram: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      >
                        <option value="PhD">PhD</option>
                        <option value="MS">MS</option>
                        <option value="Combined BS/MS">Combined BS/MS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Entered</label>
                      <input
                        type="number"
                        value={editForm.yearEntered}
                        onChange={(e) => setEditForm({ ...editForm, yearEntered: e.target.value })}
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
                        value={editForm.expectedGraduation}
                        onChange={(e) => setEditForm({ ...editForm, expectedGraduation: e.target.value })}
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
                        value={editForm.shortBio}
                        onChange={(e) => setEditForm({ ...editForm, shortBio: e.target.value })}
                        rows={3}
                        placeholder="Brief description of your research focus..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Research Interests</label>
                      <input
                        type="text"
                        value={editForm.researchInterests}
                        onChange={(e) => setEditForm({ ...editForm, researchInterests: e.target.value })}
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
                        value={editForm.personalWebsite}
                        onChange={(e) => setEditForm({ ...editForm, personalWebsite: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lab Website</label>
                      <input
                        type="url"
                        value={editForm.labWebsite}
                        onChange={(e) => setEditForm({ ...editForm, labWebsite: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-teal focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar</label>
                      <input
                        type="url"
                        value={editForm.googleScholar}
                        onChange={(e) => setEditForm({ ...editForm, googleScholar: e.target.value })}
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
                      <h3 className="text-lg font-semibold text-gray-900">{student.attributes.fullName}</h3>
                      <p className="text-sm text-gray-600">
                        {student.attributes.degreeProgram} Student
                        {student.attributes.yearEntered && ` · Entered ${student.attributes.yearEntered}`}
                        {student.attributes.expectedGraduation && ` · Expected ${student.attributes.expectedGraduation}`}
                      </p>
                      {student.attributes.advisor?.data && (
                        <p className="text-sm text-ocean-teal">{student.attributes.advisor.data.attributes.fullName} Lab</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleEdit(student)}
                      className="px-4 py-2 bg-ocean-teal text-white rounded-lg hover:bg-ocean-blue transition text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Short Bio */}
                  {student.attributes.shortBio && (
                    <p className="text-sm text-gray-700 mb-4 italic">{student.attributes.shortBio}</p>
                  )}

                  {/* Research Interests */}
                  {student.attributes.researchInterests && student.attributes.researchInterests.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {student.attributes.researchInterests.map((interest, idx) => (
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
                      <span className="ml-2 text-gray-900">{student.attributes.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{student.attributes.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Office:</span>
                      <span className="ml-2 text-gray-900">{student.attributes.office || 'N/A'}</span>
                    </div>
                    {student.attributes.googleScholar && (
                      <div>
                        <span className="text-gray-600">Scholar:</span>
                        <a href={student.attributes.googleScholar} target="_blank" rel="noopener noreferrer" className="ml-2 text-ocean-teal hover:underline">View</a>
                      </div>
                    )}
                  </div>

                  {/* Social Links Preview */}
                  {(student.attributes.personalWebsite || student.attributes.labWebsite || student.attributes.twitter || student.attributes.linkedin || student.attributes.orcid) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                      {student.attributes.personalWebsite && (
                        <a href={student.attributes.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">Website</a>
                      )}
                      {student.attributes.labWebsite && (
                        <a href={student.attributes.labWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">Lab</a>
                      )}
                      {student.attributes.twitter && (
                        <a href={student.attributes.twitter.startsWith('http') ? student.attributes.twitter : `https://twitter.com/${student.attributes.twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">Twitter</a>
                      )}
                      {student.attributes.linkedin && (
                        <a href={student.attributes.linkedin.startsWith('http') ? student.attributes.linkedin : `https://linkedin.com/in/${student.attributes.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">LinkedIn</a>
                      )}
                      {student.attributes.orcid && (
                        <a href={`https://orcid.org/${student.attributes.orcid}`} target="_blank" rel="noopener noreferrer" className="text-xs text-ocean-teal hover:underline">ORCID</a>
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
