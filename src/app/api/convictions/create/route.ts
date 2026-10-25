import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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

    // Check authorization - only police_officer and court_officer can create convictions
    if (!profile || !['police_officer', 'court_officer'].includes((profile as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized - only police and court officers can add convictions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      criminalRecordId,
      caseNumber,
      offenseCategory,
      offenseDescription,
      courtName,
      chargeDate,
      convictionDate,
      verdict,
      sentenceDescription,
    } = body

    // Validation
    if (!criminalRecordId || !caseNumber || !offenseDescription || !courtName || !chargeDate) {
      return NextResponse.json(
        { error: 'Missing required fields: criminalRecordId, caseNumber, offenseDescription, courtName, chargeDate' },
        { status: 400 }
      )
    }

    // Validate case number format: CASE-YYYY-DDDDD
    if (!/^CASE-\d{4}-\d{5}$/.test(caseNumber)) {
      return NextResponse.json(
        { error: 'Invalid case number format. Must be CASE-YYYY-DDDDD (e.g., CASE-2026-00123)' },
        { status: 400 }
      )
    }

    // Create conviction
    const { data: conviction, error } = await supabase
      .from('convictions')
      .insert([
        {
          criminal_record_id: criminalRecordId,
          case_number: caseNumber,
          offense_category: offenseCategory,
          offense_description: offenseDescription,
          court_name: courtName,
          charge_date: chargeDate,
          conviction_date: convictionDate,
          verdict,
          sentence_description: sentenceDescription,
        },
      ])
      .select()

    if (error) {
      console.error('Error creating conviction:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create conviction' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      conviction,
    })
  } catch (error: any) {
    console.error('Error in POST /api/convictions/create:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
