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
      chargeDate,
      convictionDate,
      verdict,
      sentenceDescription,
    } = body

    // Validation
    if (!criminalRecordId || !caseNumber || !chargeDate) {
      return NextResponse.json(
        { error: 'Missing required fields: criminalRecordId, caseNumber, chargeDate' },
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

    // Update prior_conviction_count on the criminal record
    const { data: record } = await supabase
      .from('criminal_records')
      .select('prior_conviction_count')
      .eq('id', criminalRecordId)
      .single()

    if (record) {
      await supabase
        .from('criminal_records')
        .update({ prior_conviction_count: (record.prior_conviction_count || 0) + 1 })
        .eq('id', criminalRecordId)
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
