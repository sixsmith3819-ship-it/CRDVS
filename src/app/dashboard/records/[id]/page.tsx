// @ts-nocheck
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate, calculateAge } from '@/lib/utils/format'
import { getRiskLabel, getRiskColor } from '@/types'
import Link from 'next/link'
import { RecordActions } from '@/components/records/RecordActions'

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  // Fetch the criminal record with related data
  const { data: record, error } = await supabase
    .from('criminal_records')
    .select(`
      *,
      convictions (
        id,
        case_number,
        offense_category,
        offense_description,
        court_name,
        verdict,
        sentence_description,
        charge_date,
        conviction_date,
        created_at
      ),
      created_by_profile:profiles!criminal_records_created_by_fkey(
        full_name,
        employee_id
      ),
      updated_by_profile:profiles!criminal_records_updated_by_fkey(
        full_name,
        employee_id
      )
    `)
    .eq('id', id)
    .single()

  if (error || !record) {
    notFound()
  }

  const recordData = record as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/records" className="hover:text-gray-900">Criminal Records</Link>
            <span>/</span>
            <span className="text-gray-900">{(record as any)?.record_id || id}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{(record as any)?.full_name}</h1>
          <p className="text-gray-600 mt-1">Criminal Record Details</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/records"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
          >
            Back to Records
          </Link>
          <Link
            href={`/dashboard/records/${id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Edit Record
          </Link>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-3">
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskColor(record.risk_level)}`}>
          Risk Level: {getRiskLabel(record.risk_level)}
        </span>
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
          Status: {record.status.replace('_', ' ')}
        </span>
        {record.is_repeat_offender && (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800">
            Repeat Offender
          </span>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Record Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Record ID</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{record.record_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">National ID</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{record.national_id_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{record.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(record.date_of_birth)} (Age {calculateAge(record.date_of_birth)})
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{record.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nationality</label>
                <p className="mt-1 text-sm text-gray-900">{record.nationality}</p>
              </div>
              {record.address && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{record.address}</p>
                </div>
              )}
              {record.aliases && record.aliases.length > 0 && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Known Aliases</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {record.aliases.map((alias, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Convictions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Convictions ({record.convictions?.length || 0})
              </h2>
              <Link
                href={`/dashboard/records/${id}/convictions/new`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Conviction
              </Link>
            </div>
            <div className="p-6">
              {!record.convictions || record.convictions.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 text-sm">No convictions recorded</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {record.convictions.map((conviction: any) => (
                    <div key={conviction.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{conviction.offense_description}</h3>
                          <p className="text-sm text-gray-600 mt-1">Case: {conviction.case_number}</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
                          {conviction.verdict.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Court:</span>
                          <span className="ml-2 text-gray-900">{conviction.court_name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="ml-2 text-gray-900 capitalize">
                            {conviction.offense_category.replace('_', ' ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Charge Date:</span>
                          <span className="ml-2 text-gray-900">{formatDate(conviction.charge_date)}</span>
                        </div>
                        {conviction.conviction_date && (
                          <div>
                            <span className="text-gray-500">Conviction Date:</span>
                            <span className="ml-2 text-gray-900">{formatDate(conviction.conviction_date)}</span>
                          </div>
                        )}
                        {conviction.sentence_description && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Sentence:</span>
                            <span className="ml-2 text-gray-900">{conviction.sentence_description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {record.notes && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{record.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Statistics & Metadata */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className="text-sm font-medium text-gray-900">{record.risk_level}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      record.risk_level >= 4 ? 'bg-red-600' :
                      record.risk_level >= 3 ? 'bg-orange-500' :
                      record.risk_level >= 2 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(record.risk_level / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Total Convictions</span>
                  <span className="text-sm font-medium text-gray-900">{record.prior_conviction_count}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Repeat Offender</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.is_repeat_offender ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {record.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Record Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Record Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Created</span>
                <p className="text-gray-900 font-medium mt-1">{formatDate(record.created_at)}</p>
                {record.created_by_profile && (
                  <p className="text-gray-600 text-xs mt-1">
                    by {record.created_by_profile.full_name} ({record.created_by_profile.employee_id})
                  </p>
                )}
              </div>
              <div>
                <span className="text-gray-600">Last Updated</span>
                <p className="text-gray-900 font-medium mt-1">{formatDate(record.updated_at)}</p>
                {record.updated_by_profile && (
                  <p className="text-gray-600 text-xs mt-1">
                    by {record.updated_by_profile.full_name} ({record.updated_by_profile.employee_id})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <RecordActions 
            nationalIdNumber={record.national_id_number}
            recordId={record.id}
          />
        </div>
      </div>
    </div>
  )
}
