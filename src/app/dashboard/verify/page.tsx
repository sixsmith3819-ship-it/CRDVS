// @ts-nocheck
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VerificationForm } from '@/components/verification/VerificationForm'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Container } from '@/components/layout/Container'
import { colors } from '@/lib/design-tokens'

export default async function VerifyPage() {
  const supabase = await createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }

  // Fetch user profile for role-based permissions
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <Container className="space-y-8 py-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Identity Verification Centre
          </h1>
          <p className="text-gray-700 text-lg">
            Search for criminal records using National ID, name, or identifying information
          </p>
        </div>

        {/* Information Banner */}
        <GlassCard 
          variant="aurora" 
          className="border-l-4"
          style={{ borderLeftColor: colors.statusInfo }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Verification Guidelines
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  • Enter at least one form of identification (National ID recommended)
                </p>
                <p>
                  • The system will search for exact matches and detect potential duplicates
                </p>
                <p>
                  • All searches are logged for audit purposes
                </p>
                <p>
                  • Results include criminal history, court records, and verification status
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Verification Form */}
      <VerificationForm 
        userRole={profile.role}
        userId={session.user.id}
      />
    </Container>
  )
}

