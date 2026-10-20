import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/duplicates/merge
 * Merge two duplicate criminal records into one
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission (police, court, or admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['administrator', 'police_officer', 'court_officer'].includes((profile as any)?.role)) {
      return NextResponse.json(
        { error: 'Only administrators, police, and court officers can merge records' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { primary_id, secondary_id, merge_reason } = body

    // Validation
    if (!primary_id || !secondary_id) {
      return NextResponse.json(
        { error: 'Both primary_id and secondary_id are required' },
        { status: 400 }
      )
    }

    if (primary_id === secondary_id) {
      return NextResponse.json(
        { error: 'Cannot merge a record with itself' },
        { status: 400 }
      )
    }

    // Call the merge function
    const { data: mergeResult, error: mergeError } = await supabase
      .rpc('merge_criminal_records', {
        p_primary_id: primary_id,
        p_secondary_id: secondary_id,
        p_merge_reason: merge_reason || 'Confirmed duplicate'
      })

    if (mergeError) {
      console.error('Error merging records:', mergeError)
      return NextResponse.json(
        { error: mergeError.message || 'Failed to merge records' },
        { status: 500 }
      )
    }

    if (!mergeResult || !mergeResult[0]?.success) {
      const errorMsg = mergeResult?.[0]?.message || 'Merge failed'
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mergeResult[0],
      message: 'Records merged successfully'
    })

  } catch (error: any) {
    console.error('Error in POST /api/duplicates/merge:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
