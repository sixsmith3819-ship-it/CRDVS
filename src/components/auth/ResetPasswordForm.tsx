'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  // Password strength validation
  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    const isValid = Object.values(requirements).every(Boolean)
    return { isValid, requirements }
  }

  const { isValid: passwordValid, requirements } = validatePassword(formData.password)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null) // Clear error when user types
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!token) {
      setError('Invalid or expired reset link')
      return
    }
    
    if (!passwordValid) {
      setError('Password does not meet security requirements')
      return
    }
    
    if (!passwordsMatch) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual password reset API call
      // const response = await fetch('/api/auth/reset-password/confirm', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, password: formData.password })
      // })
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?message=Password updated successfully')
      }, 3000)
      
    } catch (err) {
      setError('Failed to reset password. Please try again.')
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
          className="absolute inset-0 opacity-30 rounded-2xl animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${colors.statusSuccess}20, transparent 50%, ${colors.auroraTeal}15)`
          }}
        />
        
        {/* Success Animation */}
        <div className="relative z-10 text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center animate-scaleIn">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2 animate-fadeInUp">
            Password Updated!
          </h1>
          <p className="text-[#a0a9c9] text-sm animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Your password has been successfully reset
          </p>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-[#6b7280] text-sm mb-4">
            Redirecting to sign in page...
          </p>
          
          <div className="w-full bg-[#3a4254] rounded-full h-2 mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#14b8a6] to-[#7c3aed] rounded-full"
              style={{
                width: '100%',
                animation: 'progress-fill 3s ease-in-out'
              }}
            />
          </div>
          
          <Link
            href="/login"
            className="text-sm text-[#14b8a6] hover:text-[#0d9488] transition-colors"
          >
            Go to Sign In now
          </Link>
        </div>

        {/* Progress animation styles */}
        <style jsx>{`
          @keyframes progress-fill {
            from { width: 0%; }
            to { width: 100%; }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
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
          background: `linear-gradient(135deg, ${colors.auroraPurple}15, transparent 50%, ${colors.auroraTeal}10)`
        }}
      />
      
      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Create New Password
        </h1>
        <p className="text-[#a0a9c9] text-sm">
          Choose a strong password for your CRDVS account
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
        {/* New Password */}
        <div>
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••••••"
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#a0a9c9] hover:text-white transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m6.121-3.879L21 21m-3-6.121l-2.879-2.879" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            }
            disabled={loading}
            required
          />
          
          {/* Password Strength Indicators */}
          {formData.password && (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-[#a0a9c9] mb-2">Password Requirements:</div>
              <div className="grid grid-cols-1 gap-1 text-xs">
                {Object.entries({
                  'At least 8 characters': requirements.minLength,
                  'Uppercase letter (A-Z)': requirements.hasUpperCase,
                  'Lowercase letter (a-z)': requirements.hasLowerCase,
                  'Number (0-9)': requirements.hasNumber,
                  'Special character (!@#$...)': requirements.hasSymbol
                }).map(([requirement, met]) => (
                  <div key={requirement} className="flex items-center gap-2">
                    <div className={cn(
                      "w-3 h-3 rounded-full flex items-center justify-center",
                      met ? "bg-green-500" : "bg-[#3a4254]"
                    )}>
                      {met && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                        <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                      </svg>}
                    </div>
                    <span className={met ? "text-green-400" : "text-[#6b7280]"}>
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="••••••••••••"
            error={formData.confirmPassword && !passwordsMatch ? "Passwords don't match" : undefined}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            rightIcon={
              <div className="flex items-center gap-1">
                {passwordsMatch && (
                  <div className="text-green-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#a0a9c9] hover:text-white transition-colors p-1"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m6.121-3.879L21 21m-3-6.121l-2.879-2.879" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            }
            disabled={loading}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || !passwordValid || !passwordsMatch}
          className="w-full"
          loading={loading}
        >
          {loading ? 'Updating Password...' : 'Update Password'}
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
    </div>
  )
}

export default ResetPasswordForm
