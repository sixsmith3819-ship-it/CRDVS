import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { AuthHeroBackground } from '@/components/auth/AuthHeroBackground'

export default async function ForgotPasswordPage() {
  const supabase = await createClient()
  
  // Check if user is already logged in
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <AuthHeroBackground>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </AuthHeroBackground>
  )
}
