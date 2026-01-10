import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MSO_EMAIL = 'andrea.jorgensen@lifesci.ucsb.edu'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
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

    // Get IP address from headers
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : null

    const supabase = await createClient()

    // Insert contact submission
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject: subject || null,
        message,
        ip_address: ip,
        status: 'pending'
      })

    if (dbError) {
      console.error('Error saving contact submission:', dbError)
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      )
    }

    // TODO: Send email notification to MSO
    // This will be implemented when email service (Resend/SendGrid) is configured
    // For now, log the intended recipient
    console.log(`Contact form submitted - would notify: ${MSO_EMAIL}`)

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
