import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { EditRecordForm } from '@/components/records/EditRecordForm'

export default async function EditRecordPage({
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

  // Fetch the criminal record
  const { data: record, error } = await supabase
    .from('criminal_records')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !record) {
    notFound()
  }

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
            <Link href={`/dashboard/records/${id}`} className="hover:text-gray-900">{(record as any)?.record_id}</Link>
            <span>/</span>
            <span className="text-gray-900">Edit</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Record</h1>
          <p className="text-gray-600 mt-1">Update information for {(record as any)?.full_name}</p>
        </div>
        <Link
          href={`/dashboard/records/${id}`}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
        >
          Back to Record
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <EditRecordForm recordId={id} recordData={record as any} />
      </div>
    </div>
  )
}
