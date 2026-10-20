import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Get session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Check authorization - only police_officer and court_officer can update records
    if (!profile || !['police_officer', 'court_officer'].includes((profile as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized - only police and court officers can edit records' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { fullName, gender, nationality, address, status } = body

    // Validation
    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    // Update record
    const { data: updatedRecord, error } = await supabase
      .from('criminal_records')
      .update({
        full_name: fullName,
        gender,
        nationality,
        address,
        status,
      })
      .eq('id', params.id)
      .select()

    if (error) {
      console.error('Error updating record:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update record' },
        { status: 500 }
      )
    }

    if (!updatedRecord || updatedRecord.length === 0) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      record: updatedRecord[0],
    })
  } catch (error: any) {
    console.error('Error in PUT /api/records/[id]:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
