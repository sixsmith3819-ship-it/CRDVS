import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DuplicatesList } from '@/components/duplicates/DuplicatesList'
import { DetectionTrigger } from '@/components/duplicates/DetectionTrigger'

export default async function DuplicatesPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  // Check if user has permission
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', session.user.id)
    .single()

  if (!profile || !['administrator', 'police_officer'].includes((profile as any)?.role)) {
    redirect('/dashboard')
  }

  // Fetch duplicate flags
  const status = searchParams.status || 'pending_review'
  
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
    .limit(50)

  if (status !== 'all') {
    query = query.eq('flag_status', status)
  }

  const { data: flags } = await query

  // Get counts for each status
  const [
    { count: pendingCount },
    { count: confirmedCount },
    { count: dismissedCount },
  ] = await Promise.all([
    supabase.from('duplicate_flags').select('*', { count: 'exact', head: true }).eq('flag_status', 'pending_review'),
    supabase.from('duplicate_flags').select('*', { count: 'exact', head: true }).eq('flag_status', 'confirmed_duplicate'),
    supabase.from('duplicate_flags').select('*', { count: 'exact', head: true }).in('flag_status', ['false_positive', 'dismissed']),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Duplicate Flags</h1>
        <p className="text-gray-600 mt-1">
          Review and manage potential duplicate criminal records detected by the AI system
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="?status=pending_review"
          className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow ${status === 'pending_review' ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </a>

        <a
          href="?status=confirmed_duplicate"
          className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow ${status === 'confirmed_duplicate' ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{confirmedCount || 0}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </a>

        <a
          href="?status=false_positive"
          className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow ${status === 'false_positive' ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dismissed</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{dismissedCount || 0}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </a>
      </div>

      {/* Detection Trigger (Admin/Police only) */}
      <DetectionTrigger />

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { label: 'Pending Review', value: 'pending_review', count: pendingCount },
              { label: 'Confirmed', value: 'confirmed_duplicate', count: confirmedCount },
              { label: 'Dismissed', value: 'false_positive', count: dismissedCount },
              { label: 'All', value: 'all', count: (pendingCount || 0) + (confirmedCount || 0) + (dismissedCount || 0) },
            ].map((tab) => (
              <a
                key={tab.value}
                href={`?status=${tab.value}`}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  status === tab.value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count || 0})
              </a>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <DuplicatesList initialFlags={flags || []} />
        </div>
      </div>
    </div>
  )
}
