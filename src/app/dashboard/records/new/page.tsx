import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewRecordForm } from '@/components/records/NewRecordForm'
import Link from 'next/link'

export default async function NewRecordPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  // Check if user has permission to create records
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', session.user.id)
    .single()

  if (!profile || !['administrator', 'police_officer'].includes((profile as any)?.role)) {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/records" className="hover:text-gray-900">Criminal Records</Link>
            <span>/</span>
            <span className="text-gray-900">New Record</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Criminal Record</h1>
          <p className="text-gray-600 mt-1">
            Enter the details of the individual and their criminal record
          </p>
        </div>
        <Link
          href="/dashboard/records"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Records
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Record Information</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete the form below to create a new criminal record
          </p>
        </div>
        <div className="p-6">
          <NewRecordForm />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Please Note</p>
            <ul className="space-y-1">
              <li>• Verify all information is accurate before submitting</li>
              <li>• Duplicate detection will run automatically after creation</li>
              <li>• You can add convictions and additional details after creating the record</li>
              <li>• All actions are logged in the audit trail</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
