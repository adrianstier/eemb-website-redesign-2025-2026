'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Validate redirect URL to prevent open redirect attacks
function getSafeRedirectUrl(next: string | null): string {
  // Default to home page
  if (!next) return '/'

  // Must start with / (relative path)
  if (!next.startsWith('/')) return '/'

  // Block protocol-relative URLs (//example.com)
  if (next.startsWith('//')) return '/'

  // Block URLs with encoded characters that could bypass checks
  const decoded = decodeURIComponent(next)
  if (decoded !== next && (decoded.includes('://') || decoded.startsWith('//'))) {
    return '/'
  }

  // Allowed paths whitelist (add more as needed)
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

  // Allow root path
  if (next === '/') return '/'

  // Check if path starts with an allowed prefix
  const isAllowed = allowedPrefixes.some(prefix => next.startsWith(prefix))
  if (!isAllowed) return '/'

  return next
}

// Allowlist of known error messages to prevent XSS via crafted URLs
const errorMessages: Record<string, string> = {
  'Could not authenticate': 'Authentication failed. Please try again.',
  'Access denied': 'You do not have permission to access this page.',
  'Session expired': 'Your session has expired. Please sign in again.',
}

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const rawNext = searchParams?.get('next') ?? null

  // Sanitize error: only show known messages, fallback for unknown
  const displayError = error ? (errorMessages[error] || 'An error occurred. Please try again.') : null

  // Validate and sanitize the redirect URL
  const next = getSafeRedirectUrl(rawNext)

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Error signing in:', error)
    }
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-ocean-deep rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-serif font-bold text-ocean-deep">EEMB</span>
            </div>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-ocean-deep mb-2">
            Faculty & Staff Login
          </h1>
          <p className="text-warm-600">
            Sign in with your UCSB Google account to access your profile
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-warm-lg p-8 border border-warm-200">
          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {displayError}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-warm-300 rounded-xl px-6 py-4 font-medium text-warm-700 hover:bg-warm-50 hover:border-warm-400 transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-6 pt-6 border-t border-warm-200">
            <p className="text-sm text-warm-500 text-center">
              Use your <span className="font-medium">@ucsb.edu</span> email address to sign in.
              Only EEMB faculty and staff can edit their profiles.
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-warm-500">
            Having trouble?{' '}
            <a href="mailto:eemb-web@ucsb.edu" className="text-ocean-blue hover:underline">
              Contact support
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-ocean-blue hover:underline">
            ← Back to EEMB website
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-warm-600">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
