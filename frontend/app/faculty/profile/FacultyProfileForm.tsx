'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'

interface Faculty {
  id: number
  full_name: string | null
  first_name: string
  last_name: string
  title: string
  email: string
  phone: string | null
  office: string | null
  photo_url: string | null
  bio: string | null
  lab_website: string | null
  google_scholar: string | null
  orcid: string | null
  slug: string | null
}

interface FacultyProfileFormProps {
  faculty: Faculty
}

export default function FacultyProfileForm({ faculty }: FacultyProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: faculty.full_name || `${faculty.first_name} ${faculty.last_name}`,
    email: faculty.email || '',
    phone: faculty.phone || '',
    office: faculty.office || '',
    research_summary: faculty.bio || '',
    lab_website: faculty.lab_website || '',
    google_scholar: faculty.google_scholar || '',
    orcid: faculty.orcid || '',
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const supabase = createClient()

    const { error } = await supabase
      .from('faculty')
      .update({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        office: formData.office || null,
        bio: formData.research_summary || null,
        lab_website: formData.lab_website || null,
        google_scholar: formData.google_scholar || null,
        orcid: formData.orcid || null,
      })
      .eq('id', faculty.id)

    setSaving(false)

    if (error) {
      setMessage({ type: 'error', text: 'Failed to save changes. Please try again.' })
      console.error('Error updating faculty:', error)
    } else {
      setMessage({ type: 'success', text: 'Your profile has been updated successfully!' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-2xl shadow-warm-lg p-6 border border-warm-200">
        <h2 className="text-xl font-serif font-bold text-ocean-deep mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Basic Information
        </h2>

        {/* Photo Preview */}
        {faculty.photo_url && (
          <div className="mb-6 flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-warm-100">
              <Image
                src={faculty.photo_url}
                alt={faculty.full_name || `${faculty.first_name} ${faculty.last_name}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-sm text-warm-600">
              <p>To update your photo, please contact the web administrator.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={faculty.title}
              readOnly
              className="w-full px-4 py-3 border border-warm-200 rounded-xl bg-warm-50 text-warm-600 cursor-not-allowed"
            />
            <p className="text-xs text-warm-600 mt-1">Contact admin to change title</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., (805) 893-XXXX"
              className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Office Location
            </label>
            <input
              type="text"
              name="office"
              value={formData.office}
              onChange={handleChange}
              placeholder="e.g., Noble Hall 3220"
              className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition"
            />
          </div>
        </div>
      </div>

      {/* Research Information */}
      <div className="bg-white rounded-2xl shadow-warm-lg p-6 border border-warm-200">
        <h2 className="text-xl font-serif font-bold text-ocean-deep mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Research
        </h2>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-2">
            Research Summary
          </label>
          <textarea
            name="research_summary"
            value={formData.research_summary}
            onChange={handleChange}
            rows={6}
            placeholder="Describe your research interests and current projects..."
            className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition resize-y"
          />
          <p className="text-sm text-warm-600 mt-2">
            This will appear on your profile page. You can use plain text or basic formatting.
          </p>
        </div>
      </div>


      {/* External Links */}
      <div className="bg-white rounded-2xl shadow-warm-lg p-6 border border-warm-200">
        <h2 className="text-xl font-serif font-bold text-ocean-deep mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          External Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Lab Website
            </label>
            <input
              type="url"
              name="lab_website"
              value={formData.lab_website}
              onChange={handleChange}
              placeholder="https://yourlab.ucsb.edu"
              className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Google Scholar Profile
            </label>
            <input
              type="url"
              name="google_scholar"
              value={formData.google_scholar}
              onChange={handleChange}
              placeholder="https://scholar.google.com/citations?user=..."
              className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">
              ORCID
            </label>
            <input
              type="text"
              name="orcid"
              value={formData.orcid}
              onChange={handleChange}
              placeholder="0000-0000-0000-0000"
              className="w-full px-4 py-3 border border-warm-300 rounded-xl focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={`/people/faculty/${faculty.slug}`}
          className="text-ocean-blue hover:underline"
        >
          ← View public profile
        </Link>

        <button
          type="submit"
          disabled={saving}
          className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-lg ${
            saving
              ? 'bg-warm-300 text-warm-500 cursor-not-allowed'
              : 'bg-ucsb-gold text-ocean-deep hover:bg-yellow-400 hover:shadow-xl'
          }`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
