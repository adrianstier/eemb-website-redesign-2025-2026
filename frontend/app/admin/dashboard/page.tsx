'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
  faculty: number
  students: number
  staff: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ faculty: 0, students: 0, staff: 0 })
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')

    if (!token) {
      router.push('/admin')
      return
    }

    if (user) {
      setAdminUser(JSON.parse(user))
    }

    // Fetch statistics
    fetchStats(token)
  }, [router])

  const fetchStats = async (token: string) => {
    try {
      const [facultyRes, studentsRes, staffRes] = await Promise.all([
        fetch('http://localhost:1337/api/faculties?pagination[limit]=1', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:1337/api/graduate-students?pagination[limit]=1', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:1337/api/staff-members?pagination[limit]=1', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const [facultyData, studentsData, staffData] = await Promise.all([
        facultyRes.json(),
        studentsRes.json(),
        staffRes.json()
      ])

      setStats({
        faculty: facultyData.meta?.pagination?.total || 0,
        students: studentsData.meta?.pagination?.total || 0,
        staff: staffData.meta?.pagination?.total || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
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
              <Link href="/" className="text-2xl font-bold text-ocean-blue hover:text-ocean-teal transition">
                EEMB
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{adminUser?.username || 'Admin'}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-ocean-teal">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Faculty</p>
                <p className="text-3xl font-bold text-gray-900">{stats.faculty}</p>
              </div>
              <div className="bg-ocean-teal/10 rounded-full p-3">
                <svg className="w-8 h-8 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Graduate Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.students}</p>
              </div>
              <div className="bg-blue-500/10 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staff</p>
                <p className="text-3xl font-bold text-gray-900">{stats.staff}</p>
              </div>
              <div className="bg-green-500/10 rounded-full p-3">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Faculty Management */}
          <Link href="/admin/faculty" className="group">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 border border-gray-200 hover:border-ocean-teal">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-ocean-teal/10 rounded-lg p-3 group-hover:bg-ocean-teal/20 transition">
                  <svg className="w-6 h-6 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-ocean-teal transition">
                  Manage Faculty
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Edit faculty profiles, titles, contact information, and research interests
              </p>
              <div className="flex items-center text-ocean-teal font-medium text-sm group-hover:gap-2 transition-all">
                <span>Manage</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Students Management */}
          <Link href="/admin/students" className="group">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 border border-gray-200 hover:border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500/10 rounded-lg p-3 group-hover:bg-blue-500/20 transition">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-500 transition">
                  Manage Students
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Edit graduate student profiles, advisors, and contact details
              </p>
              <div className="flex items-center text-blue-500 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Manage</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Staff Management */}
          <Link href="/admin/staff" className="group">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 border border-gray-200 hover:border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-500/10 rounded-lg p-3 group-hover:bg-green-500/20 transition">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-500 transition">
                  Manage Staff
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Edit staff member profiles, positions, and responsibilities
              </p>
              <div className="flex items-center text-green-500 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Manage</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Strapi Admin */}
          <a href="http://localhost:1337/admin" target="_blank" rel="noopener noreferrer" className="group">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 border border-gray-200 hover:border-purple-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-500/10 rounded-lg p-3 group-hover:bg-purple-500/20 transition">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-500 transition">
                  Strapi CMS
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Access the full Strapi admin panel for advanced management
              </p>
              <div className="flex items-center text-purple-500 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Open Panel</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </a>

          {/* View Site */}
          <Link href="/" className="group">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 border border-gray-200 hover:border-ocean-blue">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-ocean-blue/10 rounded-lg p-3 group-hover:bg-ocean-blue/20 transition">
                  <svg className="w-6 h-6 text-ocean-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-ocean-blue transition">
                  View Website
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Visit the public-facing EEMB department website
              </p>
              <div className="flex items-center text-ocean-blue font-medium text-sm group-hover:gap-2 transition-all">
                <span>View Site</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
