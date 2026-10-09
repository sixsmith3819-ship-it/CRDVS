import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * PATCH /api/duplicates/[id]
 * Update duplicate flag status (confirm, dismiss, etc.)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile as any)?.role !== 'administrator') {
      return NextResponse.json({ error: 'Only administrators can review duplicates' }, { status: 403 })
    }

    const body = await request.json()
    const { flag_status, review_notes } = body

    if (!flag_status || !['confirmed_duplicate', 'false_positive', 'dismissed'].includes(flag_status)) {
      return NextResponse.json({ error: 'Invalid flag_status' }, { status: 400 })
    }

    // Update the duplicate flag
    const updateData: any = {
      flag_status,
      review_notes: review_notes || null,
      reviewed_by: session.user.id,
      reviewed_at: new Date().toISOString()
    };
    const { data, error } = await (supabase
      .from('duplicate_flags') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating duplicate flag:', error)
      return NextResponse.json({ error: 'Failed to update duplicate flag' }, { status: 500 })
    }

    // Log the action
    try {
      const auditLog: any = {
        user_id: session.user.id,
        action: 'resolve_duplicate',
        table_name: 'duplicate_flags',
        record_id: id,
        description: `Duplicate flag marked as ${flag_status}`,
        new_values: { flag_status, review_notes },
      };
      (await (supabase.from('audit_logs') as any).insert([auditLog])) as any
    } catch (error) {
      console.error('Failed to log duplicate resolution:', error)
    }

    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    console.error('Duplicate flag update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * DELETE /api/duplicates/[id]
 * Delete a duplicate flag (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile as any)?.role !== 'administrator') {
      return NextResponse.json({ error: 'Only administrators can delete duplicate flags' }, { status: 403 })
    }

    // Delete the duplicate flag
    const { error } = await (supabase
      .from('duplicate_flags') as any)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting duplicate flag:', error)
      return NextResponse.json({ error: 'Failed to delete duplicate flag' }, { status: 500 })
    }

    // Log the action
    try {
      const auditLog: any = {
        user_id: session.user.id,
        action: 'delete',
        table_name: 'duplicate_flags',
        record_id: id,
        description: 'Duplicate flag deleted',
      };
      (await (supabase.from('audit_logs') as any).insert([auditLog])) as any
    } catch (error) {
      console.error('Failed to log duplicate deletion:', error)
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Duplicate flag delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
