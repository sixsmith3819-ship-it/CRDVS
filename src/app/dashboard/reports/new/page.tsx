import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewReportForm } from '@/components/reports/NewReportForm'

interface NewReportPageProps {
  searchParams: Promise<{
    recordId?: string
  }>
}

export default async function NewReportPage({ searchParams }: NewReportPageProps) {
  const supabase = await createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  const params = await searchParams
  const recordId = params.recordId

  // If recordId is provided, fetch the record details
  let record = null
  if (recordId) {
    const { data } = await supabase
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
      .eq('id', recordId)
      .single()
    
    record = data
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Verification Report</h1>
        <p className="text-gray-600 mt-1">
          Create a tamper-evident verification report for criminal records
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">About Verification Reports</h3>
            <p className="text-sm text-blue-700 mt-1">
              Reports are tamper-evident with SHA-256 cryptographic hashes. Each report captures a 
              complete snapshot of the criminal record at the time of generation. Reports can be 
              set to expire after a specified date.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <NewReportForm preloadedRecord={record} />
      </div>
    </div>
  )
}
