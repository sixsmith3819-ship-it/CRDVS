import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'

export default async function SignupPage() {
  const supabase = await createClient()
  
  // Check if user is already logged in
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CRDVS</h1>
          <p className="text-blue-200">Criminal Record Digital Verification System</p>
          <p className="text-blue-300 text-sm mt-2">New Officer Registration</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Register as an authorized officer to access the system immediately.
          </p>
          <SignupForm />
          
          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Already have an account? Sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-blue-200">
          <p>Zimbabwe Republic Police</p>
          <p className="mt-1">Access will be granted immediately upon successful registration.</p>
        </div>
      </div>
    </div>
  )
}
