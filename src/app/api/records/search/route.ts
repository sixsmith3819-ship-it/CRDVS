import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json({ 
        error: 'Query parameter is required' 
      }, { status: 400 })
    }

    // Try to find the record by Record ID or National ID
    const { data: record, error } = await supabase
      .from('criminal_records')
      .select(`
        *,
        convictions (
          id,
          case_number,
          offense_category,
          offense_description,
          verdict,
          sentence_description,
          charge_date,
          conviction_date
        )
      `)
      .or(`record_id.ilike.%${query}%,national_id_number.ilike.%${query}%`)
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ 
        error: `Search failed: ${error.message}` 
      }, { status: 500 })
    }

    if (!record) {
      return NextResponse.json({ 
        error: 'No record found with that ID',
        record: null
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      record
    })

  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    )
  }
}
