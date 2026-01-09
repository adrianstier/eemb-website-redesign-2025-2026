import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FacultyProfileForm from './FacultyProfileForm'

export default async function FacultyProfilePage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=/faculty/profile')
  }

  // Get user's role and linked faculty record
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('*, faculty:faculty_id(*)')
    .eq('user_id', user.id)
    .single()

  // If no user role or not faculty, show message
  if (!userRole || !userRole.faculty_id) {
    return (
      <div className="min-h-screen bg-warm-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-warm-lg p-8 text-center">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-ocean-deep mb-2">
              Account Not Linked
            </h1>
            <p className="text-warm-600 mb-6">
              Your account is not linked to a faculty profile. Please contact the EEMB web administrator to link your account.
            </p>
            <p className="text-sm text-warm-500">
              Signed in as: <span className="font-medium">{user.email}</span>
            </p>
            <div className="mt-6">
              <a
                href="/auth/logout"
                className="text-ocean-blue hover:underline"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get full faculty data
  const { data: faculty, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('id', userRole.faculty_id)
    .single()

  if (error || !faculty) {
    return (
      <div className="min-h-screen bg-warm-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-warm-lg p-8 text-center">
            <h1 className="text-2xl font-serif font-bold text-ocean-deep mb-2">
              Error Loading Profile
            </h1>
            <p className="text-warm-600">
              There was an error loading your faculty profile. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-ocean-deep">
                Edit Your Profile
              </h1>
              <p className="text-warm-600 mt-1">
                Update your information displayed on the EEMB website
              </p>
            </div>
            <a
              href="/auth/logout"
              className="text-sm text-warm-500 hover:text-warm-700"
            >
              Sign out
            </a>
          </div>
        </div>

        {/* Profile Form */}
        <FacultyProfileForm faculty={faculty} />
      </div>
    </div>
  )
}
