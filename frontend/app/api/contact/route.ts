import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

// Contact email from environment variable (fallback for development only)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'eemb-web@ucsb.edu'

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 5 // Max 5 submissions per hour per IP

// Initialize Resend client (may be null if API key is not configured)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

/**
 * Check rate limit for an IP using the contact_submissions table in Supabase.
 * Counts submissions from the same IP in the last hour.
 */
async function checkRateLimit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  if (ip === 'unknown') {
    // Can't rate-limit without an IP; allow but with 0 remaining as a safety measure
    return { allowed: true, remaining: 0 }
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const { count, error } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', oneHourAgo)

  if (error) {
    console.error('Rate limit check failed:', error)
    // If the rate limit check fails, allow the request to avoid blocking legitimate users
    return { allowed: true, remaining: 0 }
  }

  const submissionCount = count ?? 0
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - submissionCount)

  return {
    allowed: submissionCount < RATE_LIMIT_MAX_REQUESTS,
    remaining,
  }
}

/**
 * Send an email notification via Resend about a new contact form submission.
 * Fails gracefully — errors are logged but do not block the response.
 */
async function sendEmailNotification(params: {
  name: string
  email: string
  subject: string | null
  message: string
}) {
  if (!resend) {
    console.log(
      'Resend not configured (RESEND_API_KEY missing) — skipping email notification'
    )
    return
  }

  try {
    const { error } = await resend.emails.send({
      from: 'EEMB Website <noreply@eemb.ucsb.edu>',
      to: [CONTACT_EMAIL],
      replyTo: params.email,
      subject: `[EEMB Contact] ${params.subject || 'New message'} — from ${params.name}`,
      text: [
        `New contact form submission from the EEMB website.\n`,
        `Name: ${params.name}`,
        `Email: ${params.email}`,
        `Subject: ${params.subject || '(none)'}`,
        `\nMessage:\n${params.message}`,
        `\n---`,
        `This email was sent automatically from the EEMB website contact form.`,
        `Reply directly to this email to respond to ${params.name}.`,
      ].join('\n'),
    })

    if (error) {
      console.error('Resend email error:', error)
    }
  } catch (err) {
    console.error('Failed to send email notification:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get IP address from headers for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'

    const supabase = await createClient()

    // Check rate limit using Supabase
    const rateLimit = await checkRateLimit(supabase, ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': '3600',
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

    // Send email notification (non-blocking — failures are logged, not returned)
    await sendEmailNotification({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || null,
      message: message.trim(),
    })

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
