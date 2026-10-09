import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthHeroBackground } from '@/components/auth/AuthHeroBackground'

export default async function LoginPage() {
  const supabase = await createClient()
  
  // Check if user is already logged in
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <AuthHeroBackground>
      <div className="min-h-screen flex">
        {/* Left Hero Section - Hidden on Mobile */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
          <div className="max-w-md">
            {/* Logo and Branding */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#14b8a6] to-[#7c3aed] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">CRDVS</h1>
                  <p className="text-[#a0a9c9] text-sm">Digital Verification System</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white leading-tight">
                  Secure Criminal Record
                  <br />
                  <span className="bg-gradient-to-r from-[#14b8a6] to-[#7c3aed] bg-clip-text text-transparent">
                    Verification Platform
                  </span>
                </h2>
                
                <p className="text-lg text-[#a0a9c9] leading-relaxed">
                  Advanced digital infrastructure for law enforcement agencies. 
                  Secure access to criminal records, identity verification, and case management.
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#14b8a6]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#a0a9c9]">End-to-end encrypted data transmission</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#7c3aed]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-[#a0a9c9]">Role-based access control</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-[#a0a9c9]">Comprehensive audit logging</span>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between text-sm text-[#6b7280]">
                <span>Zimbabwe Republic Police</span>
                <span>v2.0 · 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md lg:max-w-lg">
            {/* Mobile Logo - Shown only on mobile */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#14b8a6] to-[#7c3aed] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CRDVS</h1>
                  <p className="text-[#a0a9c9] text-xs">Digital Verification System</p>
                </div>
              </div>
              
              <p className="text-sm text-[#a0a9c9]">
                Zimbabwe Republic Police
                <br />
                Authorized Personnel Only
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* System Notice - Mobile Only */}
            <div className="lg:hidden mt-6 text-center">
              <p className="text-xs text-[#6b7280] leading-relaxed">
                This system is for authorized use only. All activities are monitored and logged 
                in accordance with ZRP security protocols and national data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthHeroBackground>
  )
}
