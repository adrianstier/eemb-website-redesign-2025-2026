import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Contact email from environment variable (fallback for development only)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'eemb-web@ucsb.edu'

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5 // Max 5 submissions per hour per IP
const MAX_RATE_LIMIT_ENTRIES = 10000 // Cap to prevent unbounded growth

// In-memory rate limit store (for serverless, consider using Redis or Supabase)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries periodically and enforce size limit
function cleanupRateLimitStore() {
  const now = Date.now()
  if (rateLimitStore.size > MAX_RATE_LIMIT_ENTRIES) {
    rateLimitStore.forEach((value, key) => {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    })
  }
}

// Check rate limit for an IP
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  cleanupRateLimitStore()

  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    // First request or window expired - create new record
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS }
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now }
  }

  // Increment count
  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetIn: record.resetTime - now }
}

export async function POST(request: NextRequest) {
  try {
    // Get IP address from headers for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'

    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }

    const body = await request.json()
    const { name, email, subject, message, website } = body

    // Honeypot field check - if 'website' field is filled, it's likely a bot
    // The frontend form should NOT include a visible 'website' field
    if (website) {
      // Silently reject but return success to not tip off bots
      console.log('Honeypot triggered - likely bot submission')
      return NextResponse.json(
        { success: true, message: 'Contact form submitted successfully' },
        { status: 200 }
      )
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate field lengths to prevent abuse
    if (name.length > 200 || email.length > 254 || message.length > 1000) {
      return NextResponse.json(
        { error: 'Field length exceeds maximum allowed' },
        { status: 400 }
      )
    }

    // Validate subject length separately for a clearer error message
    if (subject && subject.length > 200) {
      return NextResponse.json(
        { error: 'Subject is too long. Please keep it under 200 characters.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert contact submission
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject?.trim() || null,
        message: message.trim(),
        ip_address: ip !== 'unknown' ? ip : null,
        status: 'pending'
      })

    if (dbError) {
      console.error('Error saving contact submission:', dbError)
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      )
    }

    // TODO: Send email notification to contact recipient
    // This will be implemented when email service (Resend/SendGrid) is configured
    // For now, log the intended recipient
    console.log(`Contact form submitted - would notify: ${CONTACT_EMAIL}`)

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
