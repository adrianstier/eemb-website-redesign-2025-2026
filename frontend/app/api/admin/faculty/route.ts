import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

// Helper to check admin status
async function isAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}

// GET - List all faculty (admin view - includes inactive)
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

  const { data: faculty, error } = await supabase
    .from('faculty')
    .select('*')
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching faculty:', error)
    return NextResponse.json({ error: 'Failed to fetch faculty' }, { status: 500 })
  }

  return NextResponse.json(faculty)
}

// POST - Create new faculty member
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
    const body = await request.json() as TablesInsert<'faculty'>

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = `${body.first_name}-${body.last_name}`.toLowerCase().replace(/\s+/g, '-')
    }

    // Generate full_name if not provided
    if (!body.full_name) {
      body.full_name = `${body.first_name} ${body.last_name}`
    }

    const { data: faculty, error } = await supabase
      .from('faculty')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating faculty:', error)
      return NextResponse.json({ error: 'Failed to create faculty' }, { status: 500 })
    }

    return NextResponse.json(faculty, { status: 201 })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// PUT - Update faculty member
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
    const { id, ...updates } = body as { id: number } & TablesUpdate<'faculty'>

    if (!id) {
      return NextResponse.json({ error: 'Faculty ID is required' }, { status: 400 })
    }

    // Update full_name if first/last name changed
    if (updates.first_name || updates.last_name) {
      const { data: existing } = await supabase
        .from('faculty')
        .select('first_name, last_name')
        .eq('id', id)
        .single()

      if (existing) {
        const firstName = updates.first_name || existing.first_name
        const lastName = updates.last_name || existing.last_name
        updates.full_name = `${firstName} ${lastName}`
      }
    }

    const { data: faculty, error } = await supabase
      .from('faculty')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating faculty:', error)
      return NextResponse.json({ error: 'Failed to update faculty' }, { status: 500 })
    }

    return NextResponse.json(faculty)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE - Soft delete (set inactive) or hard delete faculty member
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
    const hard = searchParams.get('hard') === 'true'

    if (!id) {
      return NextResponse.json({ error: 'Faculty ID is required' }, { status: 400 })
    }

    if (hard) {
      // Hard delete - actually remove the record
      const { error } = await supabase
        .from('faculty')
        .delete()
        .eq('id', parseInt(id))

      if (error) {
        console.error('Error deleting faculty:', error)
        return NextResponse.json({ error: 'Failed to delete faculty' }, { status: 500 })
      }
    } else {
      // Soft delete - set inactive
      const { error } = await supabase
        .from('faculty')
        .update({ active: false })
        .eq('id', parseInt(id))

      if (error) {
        console.error('Error deactivating faculty:', error)
        return NextResponse.json({ error: 'Failed to deactivate faculty' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
