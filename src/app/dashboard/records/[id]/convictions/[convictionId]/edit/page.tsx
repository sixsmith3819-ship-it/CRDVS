import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { EditConvictionForm } from '@/components/records/EditConvictionForm'

export default async function EditConvictionPage({
  params,
}: {
  params: Promise<{ id: string; convictionId: string }>
}) {
  const { id, convictionId } = await params
  const supabase = await createClient()
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  // Fetch the criminal record
  const { data: record, error: recordError } = await supabase
    .from('criminal_records')
    .select('id, record_id, full_name, national_id_number')
    .eq('id', id)
    .single()

  if (recordError || !record) {
    notFound()
  }

  // Fetch the conviction
  const { data: conviction, error: convictionError } = await supabase
    .from('convictions')
    .select('*')
    .eq('id', convictionId)
    .eq('criminal_record_id', id)
    .single()

  if (convictionError || !conviction) {
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
            <span className="text-gray-900">Edit Conviction</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Conviction</h1>
          <p className="text-gray-600 mt-1">Update conviction details for {(record as any)?.full_name}</p>
        </div>
        <Link
          href={`/dashboard/records/${id}`}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
        >
          Back
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <EditConvictionForm 
          recordId={id} 
          convictionId={convictionId}
          recordData={record as any} 
          conviction={conviction as any}
        />
      </div>
    </div>
  )
}
