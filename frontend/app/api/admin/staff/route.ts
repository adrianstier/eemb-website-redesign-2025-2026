import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

// Helper to check admin status
async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}

// GET - List all staff (admin view - includes inactive)
export async function GET() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin status
  if (!await isAdmin(supabase)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: staff, error } = await supabase
    .from('staff')
    .select('*')
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
  }

  return NextResponse.json(staff)
}

// POST - Create new staff member
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin status
  if (!await isAdmin(supabase)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json() as TablesInsert<'staff'>

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

    const { data: staff, error } = await supabase
      .from('staff')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating staff:', error)
      return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 })
    }

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// PUT - Update staff member
export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin status
  if (!await isAdmin(supabase)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, ...updates } = body as { id: number } & TablesUpdate<'staff'>

    if (!id) {
      return NextResponse.json({ error: 'Staff member ID is required' }, { status: 400 })
    }

    // Only auto-generate full_name if not explicitly provided
    if (!updates.full_name && (updates.first_name || updates.last_name)) {
      const { data: existing } = await supabase
        .from('staff')
        .select('first_name, last_name')
        .eq('id', id)
        .single()

      if (existing) {
        const firstName = updates.first_name || existing.first_name
        const lastName = updates.last_name || existing.last_name
        updates.full_name = `${firstName} ${lastName}`
      }
    }

    updates.updated_at = new Date().toISOString()

    const { data: staff, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating staff:', error)
      return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 })
    }

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE - Soft delete (set inactive) or hard delete staff member
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin status
  if (!await isAdmin(supabase)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const hard = searchParams.get('hard') === 'true'

    if (!id) {
      return NextResponse.json({ error: 'Staff member ID is required' }, { status: 400 })
    }

    const numericId = parseInt(id, 10)
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: 'Staff member ID must be a positive integer' }, { status: 400 })
    }

    if (hard) {
      // Hard delete - actually remove the record
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', numericId)

      if (error) {
        console.error('Error deleting staff:', error)
        return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 })
      }
    } else {
      // Soft delete - set inactive
      const { error } = await supabase
        .from('staff')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', numericId)

      if (error) {
        console.error('Error deactivating staff:', error)
        return NextResponse.json({ error: 'Failed to deactivate staff member' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
