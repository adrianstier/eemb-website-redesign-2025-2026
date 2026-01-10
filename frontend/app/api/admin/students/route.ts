import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TablesInsert, TablesUpdate } from '@/lib/supabase/types'

// Helper to check admin status
async function isAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}

// GET - List all graduate students (admin view - includes inactive)
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

  const { data: students, error } = await supabase
    .from('graduate_students')
    .select('*')
    .order('last_name', { ascending: true })

  if (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }

  return NextResponse.json(students)
}

// POST - Create new graduate student
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
    const body = await request.json() as TablesInsert<'graduate_students'>

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

    const { data: student, error } = await supabase
      .from('graduate_students')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating student:', error)
      return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
    }

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// PUT - Update graduate student
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
    const { id, ...updates } = body as { id: number } & TablesUpdate<'graduate_students'>

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    // Update full_name if first/last name changed
    if (updates.first_name || updates.last_name) {
      const { data: existing } = await supabase
        .from('graduate_students')
        .select('first_name, last_name')
        .eq('id', id)
        .single()

      if (existing) {
        const firstName = updates.first_name || existing.first_name
        const lastName = updates.last_name || existing.last_name
        updates.full_name = `${firstName} ${lastName}`
      }
    }

    const { data: student, error } = await supabase
      .from('graduate_students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating student:', error)
      return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE - Soft delete (set inactive) or hard delete student
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
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    if (hard) {
      // Hard delete
      const { error } = await supabase
        .from('graduate_students')
        .delete()
        .eq('id', parseInt(id))

      if (error) {
        console.error('Error deleting student:', error)
        return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
      }
    } else {
      // Soft delete - set inactive
      const { error } = await supabase
        .from('graduate_students')
        .update({ active: false })
        .eq('id', parseInt(id))

      if (error) {
        console.error('Error deactivating student:', error)
        return NextResponse.json({ error: 'Failed to deactivate student' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
