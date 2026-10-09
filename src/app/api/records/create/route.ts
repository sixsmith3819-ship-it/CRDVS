import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NATIONAL_ID_REGEX, RECORD_ID_REGEX } from '@/types'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or police officer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['administrator', 'police_officer'].includes((profile as any)?.role)) {
      return NextResponse.json({ 
        error: 'Only administrators and police officers can create criminal records' 
      }, { status: 403 })
    }

    const body = await request.json()
    const {
      recordId,
      nationalIdNumber,
      fullName,
      dateOfBirth,
      gender,
      nationality,
      address,
      aliases,
      notes
    } = body

    // Validate required fields
    if (!recordId || !nationalIdNumber || !fullName || !dateOfBirth || !gender) {
      return NextResponse.json({ 
        error: 'Missing required fields: recordId, nationalIdNumber, fullName, dateOfBirth, gender' 
      }, { status: 400 })
    }

    // Validate Record ID format
    if (!RECORD_ID_REGEX.test(recordId)) {
      return NextResponse.json({ 
        error: 'Invalid Record ID format. Expected: CR-DDDDDDDADD (e.g., CR-0012345B26)' 
      }, { status: 400 })
    }

    // Validate National ID format
    if (!NATIONAL_ID_REGEX.test(nationalIdNumber)) {
      return NextResponse.json({ 
        error: 'Invalid National ID format. Expected: DD-DDDDDDDADD (e.g., 63-6323979A13)' 
      }, { status: 400 })
    }

    // Validate gender
    if (!['male', 'female', 'other'].includes(gender)) {
      return NextResponse.json({ 
        error: 'Invalid gender. Must be male, female, or other' 
      }, { status: 400 })
    }

    // Check if record ID already exists
    const { data: existingRecordId } = await supabase
      .from('criminal_records')
      .select('record_id')
      .eq('record_id', recordId)
      .maybeSingle()

    if (existingRecordId) {
      return NextResponse.json({ 
        error: 'Record ID already exists. Please use a unique Record ID.' 
      }, { status: 409 })
    }

    // Check if National ID already has a criminal record
    const { data: existingNationalId } = await supabase
      .from('criminal_records')
      .select('record_id, full_name')
      .eq('national_id_number', nationalIdNumber)
      .maybeSingle()

    if (existingNationalId) {
      return NextResponse.json({ 
        error: `This National ID already has a criminal record: ${(existingNationalId as any)?.record_id} (${(existingNationalId as any)?.full_name})` 
      }, { status: 409 })
    }

    // Create the criminal record
    const newRecordData: any = {
      record_id: recordId.trim().toUpperCase(),
      national_id_number: nationalIdNumber.trim(),
      full_name: fullName.trim(),
      date_of_birth: dateOfBirth,
      gender: gender,
      nationality: nationality?.trim() || 'Zimbabwean',
      address: address?.trim() || null,
      aliases: Array.isArray(aliases) ? aliases : [],
      notes: notes?.trim() || null,
      status: 'active',
      risk_level: 1,
      is_repeat_offender: false,
      prior_conviction_count: 0,
      created_by: session.user.id,
      updated_by: session.user.id
    };
    const { data: newRecord, error: insertError } = await (supabase
      .from('criminal_records') as any)
      .insert(newRecordData)
      .select()
      .single()

    if (insertError) {
      console.error('Error creating criminal record:', insertError)
      return NextResponse.json({ 
        error: `Failed to create record: ${insertError.message}` 
      }, { status: 500 })
    }

    // Log the creation
    try {
      const auditLog: any = {
        user_id: session.user.id,
        action: 'create',
        table_name: 'criminal_records',
        record_id: recordId,
        description: `Created criminal record: ${fullName} (${recordId})`,
        new_values: {
          record_id: recordId,
          national_id_number: nationalIdNumber,
          full_name: fullName
        },
      };
      (await (supabase.from('audit_logs') as any).insert([auditLog])) as any
    } catch (error) {
      console.error('Failed to log record creation:', error)
    }

    return NextResponse.json({
      success: true,
      id: newRecord.id,
      record_id: newRecord.record_id,
      message: 'Criminal record created successfully'
    })

  } catch (error: any) {
    console.error('Create record error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create record' },
      { status: 500 }
    )
  }
}
