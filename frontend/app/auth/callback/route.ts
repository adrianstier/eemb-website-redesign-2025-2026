import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Validate redirect URL to prevent open redirect attacks
function getSafeRedirectUrl(next: string | null): string {
  if (!next) return '/'
  if (!next.startsWith('/')) return '/'
  if (next.startsWith('//')) return '/'

  const decoded = decodeURIComponent(next)
  if (decoded !== next && (decoded.includes('://') || decoded.startsWith('//'))) {
    return '/'
  }

  const allowedPrefixes = [
    '/admin',
    '/faculty',
    '/people',
    '/research',
    '/news',
    '/events',
    '/academics',
    '/about',
    '/contact',
  ]

  if (next === '/') return '/'

  const isAllowed = allowedPrefixes.some(prefix => next.startsWith(prefix))
  if (!isAllowed) return '/'

  return next
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = getSafeRedirectUrl(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get the user to check their role
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if user exists in user_roles table
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        // If no role exists, check if they're a faculty member by email
        if (!userRole && user.email) {
          const { data: faculty } = await supabase
            .from('faculty')
            .select('id, email')
            .eq('email', user.email)
            .single()

          if (faculty) {
            // Create a faculty role for this user
            await supabase
              .from('user_roles')
              .insert({
                user_id: user.id,
                role: 'faculty',
                person_type: 'faculty',
                person_id: faculty.id
              })
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login page with error
  return NextResponse.redirect(`${origin}/auth/login?error=Could not authenticate`)
}
