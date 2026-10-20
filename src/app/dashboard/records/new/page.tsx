import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewRecordForm } from '@/components/records/NewRecordForm'
import { Container } from '@/components/layout/Container'
import { GlassCard } from '@/components/dashboard/GlassCard'
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

  if (!profile || !['police_officer', 'court_officer'].includes((profile as any)?.role)) {
    redirect('/dashboard')
  }

  return (
    <Container className="space-y-8 py-8">
      {/* Breadcrumb and Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/dashboard/records" className="hover:text-gray-900 transition-colors">Criminal Records</Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">New Record</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Criminal Record</h1>
            <p className="text-gray-600 text-lg">Enter the individual's details to create a new criminal record</p>
          </div>
          <Link
            href="/dashboard/records"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </div>
      </div>

      {/* Form Card */}
      <GlassCard variant="elevated" padding="lg">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900">Record Information</h2>
            <p className="text-sm text-gray-600 mt-1">Complete all required fields to create a new record</p>
          </div>
          <NewRecordForm />
        </div>
      </GlassCard>
    </Container>
  )
}
