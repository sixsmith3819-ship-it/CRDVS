import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from '@/lib/utils/format'

export async function RecentActivity({ userId }: { userId: string }) {
  const supabase = await createClient()

  // Fetch recent verification requests by this user
  const { data: recentVerifications } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('requested_by', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch recent audit logs for this user
  const { data: recentAudits } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  const activities = [
    ...(recentVerifications || []).map((v) => ({
      id: v.id,
      type: 'verification' as const,
      description: `Verification request for ${v.submitted_full_name}`,
      status: v.verification_status,
      timestamp: v.created_at,
    })),
    ...(recentAudits || []).map((a) => ({
      id: a.id,
      type: 'audit' as const,
      description: a.description || `${a.action} on ${a.table_name}`,
      status: a.action,
      timestamp: a.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  const statusColors: Record<string, string> = {
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    unverified: 'bg-gray-100 text-gray-800',
    mismatch: 'bg-red-100 text-red-800',
    flagged: 'bg-orange-100 text-orange-800',
    create: 'bg-blue-100 text-blue-800',
    update: 'bg-purple-100 text-purple-800',
    delete: 'bg-red-100 text-red-800',
    read: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(activity.timestamp)}
                  </p>
                </div>
                <span
                  className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[activity.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {activity.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
