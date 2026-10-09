'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ForgotPasswordFormProps {
  onSuccess?: () => void
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!email) {
      setError('Email address is required')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual password reset API call
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div 
        className="w-full max-w-md mx-auto p-8 rounded-2xl border relative overflow-hidden"
        style={{
          backgroundColor: colors.glass,
          backdropFilter: 'blur(20px)',
          borderColor: colors.glassBorder,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Success Aurora Glow */}
        <div 
          className="absolute inset-0 opacity-30 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors.statusSuccess}15, transparent 50%, ${colors.auroraTeal}10)`
          }}
        />
        
        {/* Success Icon */}
        <div className="relative z-10 text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Check Your Email
          </h1>
          <p className="text-[#a0a9c9] text-sm">
            We've sent password reset instructions to your email
          </p>
        </div>

        {/* Instructions */}
        <div className="relative z-10 space-y-4 mb-8">
          <div 
            className="p-4 rounded-lg border-l-4"
            style={{
              backgroundColor: `${colors.statusInfo}15`,
              borderColor: colors.statusInfo,
              borderLeftColor: colors.statusInfo
            }}
          >
            <p className="text-sm text-white mb-2">
              <strong>Next steps:</strong>
            </p>
            <ul className="text-sm text-[#a0a9c9] space-y-1">
              <li>• Check your inbox for an email from CRDVS</li>
              <li>• Click the reset link (expires in 1 hour)</li>
              <li>• Create a new secure password</li>
              <li>• Sign in with your new password</li>
            </ul>
          </div>

          <p className="text-xs text-[#6b7280] text-center">
            Didn't receive the email? Check your spam folder or contact your system administrator.
          </p>
        </div>

        {/* Actions */}
        <div className="relative z-10 space-y-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Back to Sign In
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => {
              setSuccess(false)
              setEmail('')
            }}
            className="w-full"
          >
            Try Another Email
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="w-full max-w-md mx-auto p-8 rounded-2xl border relative overflow-hidden"
      style={{
        backgroundColor: colors.glass,
        backdropFilter: 'blur(20px)',
        borderColor: colors.glassBorder,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Aurora Glow Effect */}
      <div 
        className="absolute inset-0 opacity-30 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${colors.auroraTeal}10, transparent 50%, ${colors.auroraPurple}15)`
        }}
      />
      
      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Reset Your Password
        </h1>
        <p className="text-[#a0a9c9] text-sm">
          Enter your email address and we'll send you a reset link
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="mb-6 p-4 rounded-lg border-l-4 animate-fadeInUp"
          style={{
            backgroundColor: `${colors.statusDanger}15`,
            borderColor: colors.statusDanger,
            borderLeftColor: colors.statusDanger
          }}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: colors.statusDanger }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-white">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        <div>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null) // Clear error when user types
            }}
            placeholder="officer@zrp.gov.zw"
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
            disabled={loading}
            autoComplete="email"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || !email}
          className="w-full"
          loading={loading}
        >
          {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
        </Button>

        {/* Back to Sign In */}
        <div className="text-center">
          <Link 
            href="/login"
            className="text-sm text-[#14b8a6] hover:text-[#0d9488] transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sign In
          </Link>
        </div>
      </form>

      {/* Footer */}
      <div className="relative z-10 text-center mt-6 pt-4 border-t" style={{ borderColor: colors.glassBorder }}>
        <p className="text-xs text-[#6b7280]">
          Need help? Contact your system administrator
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
