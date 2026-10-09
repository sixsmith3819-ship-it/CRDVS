import { createClient } from '@/lib/supabase/server'
import { RecordsSearch } from '@/components/records/RecordsSearch'
import { RecordsList } from '@/components/records/RecordsList'
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
    .select('*', { count: 'exact' })
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criminal Records</h1>
          <p className="text-gray-600 mt-1">Search and manage criminal records</p>
        </div>
        <Link
          href="/dashboard/records/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          + New Record
        </Link>
      </div>

      {/* Search and Filters */}
      <RecordsSearch currentParams={params} />

      {/* Results */}
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading records</p>
          <p className="text-sm">{error.message}</p>
        </div>
      ) : (
        <RecordsList
          records={records || []}
          total={count || 0}
          page={page}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}
