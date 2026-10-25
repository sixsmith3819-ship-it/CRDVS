import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const { caseNumber, offenseCategory, offenseDescription, courtName, chargeDate, convictionDate, verdict, sentenceDescription } = body

    // Validate required fields
    if (!caseNumber || !offenseCategory || !offenseDescription || !courtName || !chargeDate || !verdict) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update the conviction
    const { data, error } = await supabase
      .from('convictions')
      .update({
        case_number: caseNumber,
        offense_category: offenseCategory,
        offense_description: offenseDescription,
        court_name: courtName,
        charge_date: chargeDate,
        conviction_date: convictionDate || null,
        verdict: verdict,
        sentence_description: sentenceDescription || null,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating conviction:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update conviction' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update conviction' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin or police officer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (!['administrator', 'police_officer'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Only administrators and police officers can delete convictions' },
        { status: 403 }
      )
    }

    // Delete the conviction
    const { error: deleteError } = await supabase
      .from('convictions')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting conviction:', deleteError)
      return NextResponse.json(
        { error: deleteError.message || 'Failed to delete conviction' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete conviction' },
      { status: 500 }
    )
  }
}
