'use client'

import { useState, useEffect } from 'react'
import { loginAction } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [trustDevice, setTrustDevice] = useState(false)
  const [shake, setShake] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState({
    browser: 'Unknown',
    os: 'Unknown',
    lastLogin: null as string | null
  })
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()

  // Form validation
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  // Get device information
  useEffect(() => {
    const getBrowserInfo = () => {
      const userAgent = navigator.userAgent
      let browser = 'Unknown'
      let os = 'Unknown'

      // Detect browser
      if (userAgent.includes('Chrome')) browser = 'Chrome'
      else if (userAgent.includes('Firefox')) browser = 'Firefox'
      else if (userAgent.includes('Safari')) browser = 'Safari'
      else if (userAgent.includes('Edge')) browser = 'Edge'

      // Detect OS
      if (userAgent.includes('Windows')) os = 'Windows'
      else if (userAgent.includes('Mac')) os = 'macOS'
      else if (userAgent.includes('Linux')) os = 'Linux'
      else if (userAgent.includes('Android')) os = 'Android'
      else if (userAgent.includes('iOS')) os = 'iOS'

      return { browser, os }
    }

    const info = getBrowserInfo()
    setDeviceInfo(prev => ({ ...prev, ...info }))

    // Check for last login info from localStorage
    const lastLogin = localStorage.getItem('crdvs_last_login')
    if (lastLogin) {
      setDeviceInfo(prev => ({ ...prev, lastLogin }))
    }
  }, [])

  // Reset shake animation after it completes
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [shake])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    // Clear global error when user starts typing
    if (error) {
      setError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) {
      setShake(true)
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      const formDataObj = new FormData()
      formDataObj.append('email', formData.email)
      formDataObj.append('password', formData.password)
      if (rememberMe) {
        formDataObj.append('remember', 'true')
      }
      if (trustDevice) {
        formDataObj.append('trustDevice', 'true')
      }

      const result = await loginAction(formDataObj)

      if (result?.error) {
        setError(result.error)
        setShake(true) // Trigger shake animation on login failure
      } else if (result.success) {
        // Store login info
        localStorage.setItem('crdvs_last_login', new Date().toISOString())
        
        // Show success state briefly before redirect
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setShake(true) // Trigger shake animation on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className={cn(
        "w-full max-w-md mx-auto p-8 rounded-2xl border relative overflow-hidden transition-all duration-300",
        shake && "animate-shake"
      )}
      style={{
        backgroundColor: colors.glass,
        backdropFilter: 'blur(20px)',
        borderColor: colors.glassBorder,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Aurora Glow Effect */}
      <div 
        className={cn(
          "absolute inset-0 opacity-30 rounded-2xl transition-all duration-300",
          error && "opacity-40"
        )}
        style={{
          background: error
            ? `linear-gradient(135deg, ${colors.statusDanger}20, transparent 50%, ${colors.auroraPurple}15)`
            : `linear-gradient(135deg, ${colors.auroraTeal}10, transparent 50%, ${colors.auroraPurple}15)`
        }}
      />
      
      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <div className={cn(
          "w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br flex items-center justify-center transition-all duration-300",
          error
            ? "from-red-500 to-red-700 animate-pulse"
            : "from-[#14b8a6] to-[#7c3aed]"
        )}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-[#a0a9c9] text-sm">
          Sign in to your CRDVS account
        </p>
      </div>

      {/* Session Security Info */}
      <div 
        className="relative z-10 mb-6 p-4 rounded-lg border"
        style={{
          backgroundColor: `${colors.statusInfo}10`,
          borderColor: `${colors.statusInfo}30`
        }}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#a0a9c9] mb-2">
              <strong className="text-white">Device Information</strong>
            </div>
            <div className="space-y-1 text-xs text-[#6b7280]">
              <div className="flex items-center justify-between">
                <span>Browser:</span>
                <span className="text-[#a0a9c9]">{deviceInfo.browser}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Operating System:</span>
                <span className="text-[#a0a9c9]">{deviceInfo.os}</span>
              </div>
              {deviceInfo.lastLogin && (
                <div className="flex items-center justify-between">
                  <span>Last Sign In:</span>
                  <span className="text-[#a0a9c9]">
                    {new Date(deviceInfo.lastLogin).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Connection:</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400">Secure (TLS 1.3)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <div>
              <p className="text-sm font-medium text-white">Sign in failed</p>
              <p className="text-sm text-[#a0a9c9] mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Email Field */}
        <div>
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="officer@zrp.gov.zw"
            error={errors.email}
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

        {/* Password Field */}
        <div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••"
            error={errors.password}
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
            autoComplete="current-password"
            required
          />
        </div>

        {/* Security Options */}
        <div className="space-y-3">
          {/* Remember Me */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={cn(
                "w-4 h-4 rounded border-2 transition-all duration-200",
                "focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
                rememberMe 
                  ? "bg-[#14b8a6] border-[#14b8a6] text-white"
                  : "bg-transparent border-[#3a4254]",
                "focus:border-[#14b8a6] focus:ring-[#14b8a6]"
              )}
              disabled={loading}
            />
            <span className="ml-2 text-sm text-[#a0a9c9]">Keep me signed in for 7 days</span>
          </label>

          {/* Trust Device */}
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              className={cn(
                "w-4 h-4 rounded border-2 transition-all duration-200 mt-0.5",
                "focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
                trustDevice 
                  ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                  : "bg-transparent border-[#3a4254]",
                "focus:border-[#7c3aed] focus:ring-[#7c3aed]"
              )}
              disabled={loading}
            />
            <div className="flex-1">
              <span className="text-sm text-[#a0a9c9]">Trust this device for 30 days</span>
              <div className="text-xs text-[#6b7280] mt-1 leading-relaxed">
                Skip verification for future sign-ins from this {deviceInfo.browser} browser on {deviceInfo.os}. 
                Only use on personal devices.
              </div>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-end">
          <a 
            href="/auth/forgot-password"
            className="text-sm text-[#14b8a6] hover:text-[#0d9488] transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full"
          loading={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: colors.glassBorder }} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span 
              className="px-3 text-[#6b7280]"
              style={{ backgroundColor: colors.glass }}
            >
              New to CRDVS?
            </span>
          </div>
        </div>

        {/* Create Account Button */}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.push('/signup')}
          className="w-full"
          disabled={loading}
        >
          Create New Account
        </Button>
      </form>

      {/* Footer */}
      <div className="relative z-10 text-center mt-6 pt-4 border-t" style={{ borderColor: colors.glassBorder }}>
        <p className="text-xs text-[#6b7280]">
          Need access? Contact your system administrator
        </p>
        <p className="text-xs text-[#6b7280] mt-1">
          Zimbabwe Republic Police · CRDVS v1.0
        </p>
      </div>
    </div>
  )
}

export default LoginForm
