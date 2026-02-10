import { createClient } from '@/lib/supabase/server'
import type { TablesInsert, Tables } from '@/lib/supabase/types'

type ContactSubmission = Tables<'contact_submissions'>

type ContactFormData = Omit<TablesInsert<'contact_submissions'>, 'id' | 'created_at' | 'status' | 'responded_at' | 'responded_by'>

/**
 * Submit a contact form
 * This runs on the server side via API route
 */
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contact_submissions')
    .insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      ip_address: data.ip_address,
      status: 'pending'
    })

  if (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: 'Failed to submit contact form' }
  }

  return { success: true }
}

/**
 * Get all contact submissions (admin only)
 */
export async function getContactSubmissions(options?: {
  status?: 'pending' | 'responded' | 'archived'
  limit?: number
  offset?: number
}): Promise<{ submissions: ContactSubmission[]; total: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('contact_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  // Apply pagination: use .range() when offset is specified (it handles both
  // offset and limit), otherwise fall back to .limit() for simple truncation.
  const limit = options?.limit || 10
  if (options?.offset) {
    query = query.range(options.offset, options.offset + limit - 1)
  } else if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching contact submissions:', error)
    return { submissions: [], total: 0 }
  }

  return { submissions: data || [], total: count || 0 }
}

/**
 * Update contact submission status (admin only)
 */
export async function updateContactStatus(
  id: number,
  status: 'pending' | 'responded' | 'archived',
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = { status }

  if (status === 'responded') {
    updateData.responded_at = new Date().toISOString()
    if (userId) {
      updateData.responded_by = userId
    }
  }

  const { error } = await supabase
    .from('contact_submissions')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error updating contact status:', error)
    return { success: false, error: 'Failed to update status' }
  }

  return { success: true }
}
