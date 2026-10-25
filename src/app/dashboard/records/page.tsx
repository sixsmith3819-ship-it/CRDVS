import { createClient } from '@/lib/supabase/server'
import { RecordsSearch } from '@/components/records/RecordsSearch'
import { RecordsList } from '@/components/records/RecordsList'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Container } from '@/components/layout/Container'
import Link from 'next/link'

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  
  // Build query
  let query = supabase
    .from('criminal_records')
    .select(`
      *,
      convictions (
        id,
        verdict,
        conviction_date,
        created_at
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply filters
  if (params.query) {
    query = query.or(`full_name.ilike.%${params.query}%,national_id_number.ilike.%${params.query}%,record_id.ilike.%${params.query}%`)
  }

  if (params.status) {
    query = query.eq('status', params.status)
  }

  if (params.risk_level) {
    query = query.eq('risk_level', params.risk_level)
  }

  if (params.repeat_offender === 'true') {
    query = query.eq('is_repeat_offender', true)
  }

  // Pagination
  const page = Number(params.page) || 1
  const pageSize = 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to)

  const { data: records, error, count } = await query

  return (
    <Container className="space-y-8 py-8">
      {/* Page Header with Gradient Background */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Criminal Records</h1>
            <p className="text-gray-600 text-lg">Search and manage criminal records database</p>
          </div>
          <Link
            href="/dashboard/records/new"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold flex items-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Record
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <RecordsSearch currentParams={params} />

      {/* Results */}
      {error ? (
        <GlassCard variant="elevated" className="border-l-4 border-red-500">
          <div className="flex items-center gap-4">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Error loading records</p>
              <p className="text-sm text-gray-600 mt-1">{error.message}</p>
            </div>
          </div>
        </GlassCard>
      ) : (
        <RecordsList
          records={records || []}
          total={count || 0}
          page={page}
          pageSize={pageSize}
        />
      )}
    </Container>
  )
}
