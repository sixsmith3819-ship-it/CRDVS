import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/layout/Container'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils/format'

const actionColorMap: Record<string, { bg: string; text: string; icon: string }> = {
  'INSERT': { bg: 'bg-green-100', text: 'text-green-800', icon: '✓' },
  'UPDATE': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '✎' },
  'DELETE': { bg: 'bg-red-100', text: 'text-red-800', icon: '✕' },
  'VERIFY': { bg: 'bg-purple-100', text: 'text-purple-800', icon: '✓' },
  'CREATE': { bg: 'bg-green-100', text: 'text-green-800', icon: '✓' },
  'AUTH': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🔐' },
  'ACCESS_DENIED': { bg: 'bg-red-100', text: 'text-red-800', icon: '✕' },
}

export default async function ActivityPage() {
  const supabase = await createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // Fetch all audit logs
  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select('id, action, table_name, record_id, description, user_id, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audit logs:', error)
  }

  return (
    <Container className="space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Activity Log</h1>
            <p className="text-gray-700 mt-2">Complete audit trail of all system activities</p>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {!logs || logs.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-1">No activity yet</p>
            <p className="text-gray-600">Activity logs will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log: any, index: number) => {
              const colors = actionColorMap[log.action] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' }
              
              return (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Action Badge */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                      <span className={`text-sm font-semibold ${colors.text}`}>
                        {log.action.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {log.action.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Table: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{log.table_name}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">
                            {formatDateTime(log.created_at)}
                          </p>
                        </div>
                      </div>

                      {log.description && (
                        <p className="text-xs text-gray-700 mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                          {log.description}
                        </p>
                      )}

                      {log.record_id && (
                        <p className="text-xs text-gray-600 mt-2">
                          Record ID: <span className="font-mono text-gray-800">{log.record_id}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {logs && logs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(() => {
            const stats = {
              total: logs.length,
              inserts: logs.filter((l: any) => l.action === 'INSERT').length,
              updates: logs.filter((l: any) => l.action === 'UPDATE').length,
              deletes: logs.filter((l: any) => l.action === 'DELETE').length,
            }
            
            return (
              <>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-gray-600 text-sm font-medium">Total Activities</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-gray-600 text-sm font-medium">Inserts</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.inserts}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-gray-600 text-sm font-medium">Updates</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.updates}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-gray-600 text-sm font-medium">Deletes</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.deletes}</p>
                </div>
              </>
            )
          })()}
        </div>
      )}
    </Container>
  )
}
