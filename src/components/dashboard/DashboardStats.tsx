import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types'

export async function DashboardStats({ userRole }: { userRole: UserRole }) {
  const supabase = await createClient()

  // Fetch statistics
  const [
    { count: totalRecords },
    { count: activeRecords },
    { count: pendingVerifications },
    { count: duplicateFlags },
  ] = await Promise.all([
    supabase.from('criminal_records').select('*', { count: 'exact', head: true }),
    supabase.from('criminal_records').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('verification_requests').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    supabase.from('duplicate_flags').select('*', { count: 'exact', head: true }).eq('flag_status', 'pending_review'),
  ])

  const stats = [
    {
      label: 'Total Records',
      value: totalRecords ?? 0,
      icon: 'folder',
      color: 'blue',
    },
    {
      label: 'Active Records',
      value: activeRecords ?? 0,
      icon: 'check',
      color: 'green',
    },
    {
      label: 'Pending Verifications',
      value: pendingVerifications ?? 0,
      icon: 'clock',
      color: 'yellow',
    },
    {
      label: 'Duplicate Flags',
      value: duplicateFlags ?? 0,
      icon: 'flag',
      color: 'red',
    },
  ]

  const icons: Record<string, JSX.Element> = {
    folder: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    check: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    clock: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    flag: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
  }

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
              {icons[stat.icon]}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
