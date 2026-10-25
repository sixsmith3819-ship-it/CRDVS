import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DuplicatesPageContent from '@/components/duplicates/DuplicatesPageContent'

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

  if (!profile || !['administrator', 'police_officer', 'court_officer'].includes((profile as any)?.role)) {
    redirect('/dashboard')
  }

  return <DuplicatesPageContent initialStatus={searchParams.status || 'all'} />
}
