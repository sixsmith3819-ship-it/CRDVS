import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/duplicates
 * Fetch all duplicate flags with related record information
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending_review'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch duplicate flags
    let query = supabase
      .from('duplicate_flags')
      .select(`
        *,
        record_a:criminal_records!duplicate_flags_record_a_id_fkey(
          id,
          record_id,
          full_name,
          national_id_number,
          date_of_birth,
          gender,
          status,
          risk_level,
          prior_conviction_count,
          address
        ),
        record_b:criminal_records!duplicate_flags_record_b_id_fkey(
          id,
          record_id,
          full_name,
          national_id_number,
          date_of_birth,
          gender,
          status,
          risk_level,
          prior_conviction_count,
          address
        ),
        flagged_by_profile:profiles!duplicate_flags_flagged_by_fkey(
          full_name,
          employee_id
        ),
        reviewed_by_profile:profiles!duplicate_flags_reviewed_by_fkey(
          full_name,
          employee_id
        )
      `)
      .order('similarity_score', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('flag_status', status)
    }

    const { data: flags, error, count } = await query

    if (error) {
      console.error('Error fetching duplicate flags:', error)
      return NextResponse.json({ error: 'Failed to fetch duplicate flags' }, { status: 500 })
    }

    // Get total count
    let countQuery = supabase
      .from('duplicate_flags')
      .select('*', { count: 'exact', head: true })
    
    if (status !== 'all') {
      countQuery = countQuery.eq('flag_status', status)
    }
    
    const { count: totalCount } = await countQuery

    return NextResponse.json({
      flags: flags || [],
      total: totalCount || 0,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Duplicate flags API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
