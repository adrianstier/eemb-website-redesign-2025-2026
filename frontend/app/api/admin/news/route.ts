import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

// Helper to check admin status
async function isAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}

// GET - List all news articles (admin view - includes unpublished)
export async function GET() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin status
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: news, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('publish_date', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }

  return NextResponse.json(news)
}

// POST - Create new news article
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin status
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json() as TablesInsert<'news_articles'>

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100)
    }

    // Set default publish date to now if not provided
    if (!body.publish_date) {
      body.publish_date = new Date().toISOString()
    }

    const { data: news, error } = await supabase
      .from('news_articles')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating news:', error)
      return NextResponse.json({ error: 'Failed to create news article' }, { status: 500 })
    }

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// PUT - Update news article
export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin status
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, ...updates } = body as { id: number } & TablesUpdate<'news_articles'>

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    const { data: news, error } = await supabase
      .from('news_articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating news:', error)
      return NextResponse.json({ error: 'Failed to update news article' }, { status: 500 })
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE - Delete news article
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin status
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', parseInt(id))

    if (error) {
      console.error('Error deleting news:', error)
      return NextResponse.json({ error: 'Failed to delete news article' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
