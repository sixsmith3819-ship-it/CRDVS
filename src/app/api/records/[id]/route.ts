import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CriminalRecordUpdate } from '@/types/database'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/records/[id]
 * Update a criminal record with audit logging
 * 
 * Requires:
 * - Authentication
 * - Administrator role
 * 
 * Body:
 * - Updated fields from CriminalRecordUpdate
 * - userId: string (for audit logging)
 * - oldValues: object (for audit diff)
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is administrator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile as any)?.role !== 'administrator') {
      return NextResponse.json(
        { error: 'Only administrators can update criminal records' },
        { status: 403 }
      )
    }

    const { id } = await context.params
    const body = await request.json()

    // Extract update data and audit information
    const {
      full_name,
      aliases,
      date_of_birth,
      gender,
      national_id_number,
      address,
      notes,
      status,
      risk_level,
      userId,
      oldValues,
    } = body

    // Validate required fields if being updated
    if (full_name !== undefined && (!full_name || full_name.trim().length < 2)) {
      return NextResponse.json(
        { error: 'Full name must be at least 2 characters' },
        { status: 400 }
      )
    }

    if (risk_level !== undefined && (risk_level < 1 || risk_level > 5)) {
      return NextResponse.json(
        { error: 'Risk level must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (
      national_id_number !== undefined &&
      !/^\d{2}-\d{7}[A-Z]\d{2}$/.test(national_id_number)
    ) {
      return NextResponse.json(
        { error: 'Invalid national ID format. Expected: DD-DDDDDDDADD' },
        { status: 400 }
      )
    }

    if (gender !== undefined && !['male', 'female', 'other'].includes(gender)) {
      return NextResponse.json(
        { error: 'Invalid gender value' },
        { status: 400 }
      )
    }

    if (status !== undefined) {
      const validStatuses = [
        'active',
        'closed',
        'under_investigation',
        'acquitted',
        'deceased',
        'archived',
      ]
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid record status' },
          { status: 400 }
        )
      }
    }

    // Build update object with only provided fields
    const updateData: CriminalRecordUpdate = {}

    if (full_name !== undefined) updateData.full_name = full_name.trim()
    if (aliases !== undefined) updateData.aliases = aliases
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth
    if (gender !== undefined) updateData.gender = gender
    if (national_id_number !== undefined)
      updateData.national_id_number = national_id_number
    if (address !== undefined) updateData.address = address
    if (notes !== undefined) updateData.notes = notes
    if (status !== undefined) updateData.status = status
    if (risk_level !== undefined) updateData.risk_level = risk_level
    if (userId !== undefined) updateData.updated_by = userId

    // Update the record
    const { data: updatedRecord, error: updateError } = await (supabase
      .from('criminal_records') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating record:', updateError)
      return NextResponse.json(
        { error: `Failed to update record: ${updateError.message}` },
        { status: 500 }
      )
    }

    // Prepare audit log data - calculate which fields changed
    const changedFields = Object.keys(updateData).filter(
      key => updateData[key as keyof CriminalRecordUpdate] !== oldValues?.[key]
    )

    // Log audit event for each changed field
    const auditEntries = changedFields.map(field => ({
      user_id: session.user.id,
      user_role: (profile as any)?.role,
      action: 'update' as const,
      table_name: 'criminal_records',
      record_id: id,
      old_values: {
        [field]: oldValues?.[field],
      },
      new_values: {
        [field]: updateData[field as keyof CriminalRecordUpdate],
      },
      description: `Updated ${field}: ${JSON.stringify(oldValues?.[field])} → ${JSON.stringify(
        updateData[field as keyof CriminalRecordUpdate]
      )}`,
    }))

    if (auditEntries.length > 0) {
      const { error: auditError } = await (supabase
        .from('audit_logs') as any)
        .insert(auditEntries)

      if (auditError) {
        console.error('Warning: Failed to log audit entry:', auditError)
        // Don't fail the update, but log the warning
      }
    }

    return NextResponse.json(
      {
        success: true,
        record: updatedRecord,
        changedFields,
        message: `Record updated successfully. ${changedFields.length} field(s) changed.`,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Update record error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update record' },
      { status: 500 }
    )
  }
}
