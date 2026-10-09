import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MetricCards } from '@/components/dashboard/MetricCards'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Container } from '@/components/layout/Container'

// Mock function to fetch dashboard metrics
async function getDashboardMetrics() {
  // TODO: Replace with actual database queries
  return {
    pendingVerifications: 47,
    recordsThisMonth: 324,
    activeUsers: 28
  }
}

// Mock function to get greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
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

  // Fetch dashboard metrics
  const metrics = await getDashboardMetrics()

  // System status (mock - replace with actual health check)
  const systemStatus = {
    status: 'online' as 'online' | 'degraded' | 'offline',
    uptime: '99.9%',
    lastUpdate: new Date().toISOString()
  }

  const currentDate = new Date()
  const greeting = getGreeting()

  return (
    <Container className="space-y-8 py-8">
      {/* Personalized Greeting */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {(profile as any)?.full_name || 'Officer'}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-700">
                {currentDate.toLocaleDateString('en-ZW', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  systemStatus.status === 'online' ? 'bg-green-500' : 
                  systemStatus.status === 'degraded' ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  systemStatus.status === 'online' ? 'text-green-600' : 
                  systemStatus.status === 'degraded' ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  System {systemStatus.status}
                </span>
              </div>
            </div>
          </div>
          
          {/* User Info Card */}
          <GlassCard variant="subtle" padding="sm" className="text-right">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {(profile as any)?.full_name}
                </p>
                <p className="text-xs text-gray-700 capitalize">
                  {(((profile as any)?.rank || (profile as any)?.role || '').replace('_', ' '))}
                </p>
                <p className="text-xs text-gray-600">
                  {(profile as any)?.department || 'CRDVS'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#7c3aed] flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  {(((profile as any)?.full_name || 'U').charAt(0))}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Metrics</h2>
        <MetricCards data={metrics} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <QuickActions userRole={(profile as any)?.role} />
      </div>

      {/* Recent Activity & Notifications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <NotificationsPanel />
      </div>

      {/* System Information */}
      <GlassCard variant="subtle" padding="md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">System Information</h3>
            <p className="text-xs text-gray-700">
              CRDVS v2.0 • Database: {systemStatus.uptime} uptime • 
              Last updated: {new Date(systemStatus.lastUpdate).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#14b8a6]/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </GlassCard>
    </Container>
  )
}

