import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { timingSafeEqual } from 'crypto'

// Constant-time string comparison to prevent timing attacks
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

// Secret token for webhook authentication
const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN

// Map of table names to paths that should be revalidated
const TABLE_PATH_MAP: Record<string, string[]> = {
  faculty: ['/people', '/people/faculty', '/research'],
  staff: ['/people', '/people/staff'],
  graduate_students: ['/people', '/people/graduate-students', '/academics'],
  news_articles: ['/news', '/'],
  events: ['/events', '/'],
  research_areas: ['/research', '/people/faculty'],
  student_testimonials: ['/academics'],
}

// Map of tags for more granular cache invalidation
const TABLE_TAG_MAP: Record<string, string[]> = {
  faculty: ['faculty', 'people'],
  staff: ['staff', 'people'],
  graduate_students: ['students', 'people'],
  news_articles: ['news'],
  events: ['events'],
  research_areas: ['research'],
  student_testimonials: ['testimonials'],
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication token
    const token = request.headers.get('x-revalidation-token')

    if (!REVALIDATION_TOKEN) {
      console.warn('REVALIDATION_TOKEN not configured')
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 500 }
      )
    }

    if (!token || !safeCompare(token, REVALIDATION_TOKEN)) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { table, type, record } = body

    // Log the webhook event
    console.log(`Revalidation webhook: ${type} on ${table}`, record?.id ? `ID: ${record.id}` : '')

    // Get paths to revalidate based on table
    const paths = TABLE_PATH_MAP[table] || []
    const tags = TABLE_TAG_MAP[table] || []

    // Revalidate paths
    for (const path of paths) {
      try {
        revalidatePath(path)
        console.log(`Revalidated path: ${path}`)
      } catch (e) {
        console.error(`Failed to revalidate path ${path}:`, e)
      }
    }

    // Revalidate tags for more granular control
    for (const tag of tags) {
      try {
        revalidateTag(tag)
        console.log(`Revalidated tag: ${tag}`)
      } catch (e) {
        console.error(`Failed to revalidate tag ${tag}:`, e)
      }
    }

    // Handle specific record revalidation for detail pages
    if (record?.slug) {
      let detailPath: string | null = null

      switch (table) {
        case 'faculty':
          detailPath = `/people/faculty/${record.slug}`
          break
        case 'staff':
          detailPath = `/people/staff/${record.slug}`
          break
        case 'graduate_students':
          detailPath = `/people/graduate-students/${record.slug}`
          break
        case 'news_articles':
          detailPath = `/news/${record.slug}`
          break
        case 'events':
          detailPath = `/events/${record.slug}`
          break
        case 'research_areas':
          detailPath = `/research/${record.slug}`
          break
      }

      if (detailPath) {
        try {
          revalidatePath(detailPath)
          console.log(`Revalidated detail path: ${detailPath}`)
        } catch (e) {
          console.error(`Failed to revalidate detail path ${detailPath}:`, e)
        }
      }
    }

    return NextResponse.json({
      success: true,
      revalidated: {
        paths,
        tags,
        detail: record?.slug ? `/${table}/${record.slug}` : null
      }
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow GET for health check
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
