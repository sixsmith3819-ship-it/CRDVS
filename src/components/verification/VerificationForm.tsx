'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { VerificationResults } from './VerificationResults'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'
import { useToast } from '@/components/ui/Toast'

interface VerificationFormProps {
  userRole?: string
  userId: string
  className?: string
}

interface FormData {
  nationalId: string
  fullName: string
  dateOfBirth: string
  phoneNumber: string
  alternateId: string
  idType: string
  searchType: string
}

interface ValidationErrors {
  [key: string]: string | undefined
}

interface FieldStatus {
  [key: string]: 'idle' | 'validating' | 'valid' | 'invalid'
}

export function VerificationForm({ userRole, userId, className }: VerificationFormProps) {
  const router = useRouter()
  const { success, error: showError } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({})
  
  const [formData, setFormData] = useState<FormData>({
    nationalId: '',
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    alternateId: '',
    idType: 'national_id',
    searchType: 'comprehensive'
  })

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  // Real-time validation
  const validateField = (name: string, value: string) => {
    setFieldStatus(prev => ({ ...prev, [name]: 'validating' }))
    
    let error = ''
    
    switch (name) {
      case 'nationalId':
        if (value && !/^[0-9]{2}-[0-9]{6,7}[A-Z][0-9]{2}$/.test(value)) {
          error = 'Invalid format. Use: XX-XXXXXXXXX (e.g., 63-1234567A12)'
        }
        break
      case 'fullName':
        if (value && value.length < 2) {
          error = 'Name must be at least 2 characters'
        }
        break
      case 'dateOfBirth':
        if (value) {
          const date = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - date.getFullYear()
          if (age < 0 || age > 150) {
            error = 'Please enter a valid date of birth'
          }
        }
        break
      case 'phoneNumber':
        if (value && !/^\+263[0-9]{9}$|^0[0-9]{9}$/.test(value)) {
          error = 'Invalid format. Use: +263XXXXXXXXX or 0XXXXXXXXX'
        }
        break
    }

    setTimeout(() => {
      setValidationErrors(prev => ({ ...prev, [name]: error }))
      setFieldStatus(prev => ({ 
        ...prev, 
        [name]: error ? 'invalid' : value ? 'valid' : 'idle' 
      }))
    }, 500)
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null) // Clear form error
    
    // Format National ID input
    if (name === 'nationalId') {
      let formatted = value.replace(/[^0-9A-Z]/g, '')
      if (formatted.length > 2) {
        formatted = `${formatted.slice(0, 2)}-${formatted.slice(2)}`
      }
      if (formatted.length > 10) {
        formatted = `${formatted.slice(0, 10)}${formatted.slice(10, 11)}${formatted.slice(11, 13)}`
      }
      value = formatted.slice(0, 14) // Max length with formatting
    }

    // Format phone number
    if (name === 'phoneNumber') {
      if (value.startsWith('263')) {
        value = `+${value}`
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Debounced validation
    if (value.trim()) {
      validateField(name, value)
    } else {
      setFieldStatus(prev => ({ ...prev, [name]: 'idle' }))
      setValidationErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    
    // At least one search field must be provided
    if (!formData.nationalId && !formData.fullName && !formData.alternateId) {
      errors.form = 'Please provide at least one form of identification'
      setError(errors.form)
      return false
    }

    // Check individual field errors
    Object.keys(validationErrors).forEach(field => {
      if (validationErrors[field]) {
        errors[field] = validationErrors[field]
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showError('Validation Error', 'Please fix the form errors before submitting')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          ...formData,
          userId,
          timestamp: new Date().toISOString()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification request failed')
      }

      setResults(data)
      success(
        'Verification Complete',
        `Found ${data.results?.length || 0} matching records`,
        { duration: 4000 }
      )

    } catch (err: any) {
      const errorMessage = err.message || 'Verification failed. Please try again.'
      setError(errorMessage)
      showError('Verification Failed', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFormData({
      nationalId: '',
      fullName: '',
      dateOfBirth: '',
      phoneNumber: '',
      alternateId: '',
      idType: 'national_id',
      searchType: 'comprehensive'
    })
    setResults(null)
    setError(null)
    setValidationErrors({})
    setFieldStatus({})
  }

  const getFieldIcon = (name: string) => {
    const status = fieldStatus[name] || 'idle'
    
    switch (status) {
      case 'validating':
        return (
          <svg className="w-4 h-4 animate-spin text-gray-700" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )
      case 'valid':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'invalid':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Search Form */}
      <GlassCard variant="elevated">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Verification Search</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-700">System Online</span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Primary Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2" style={{ borderColor: colors.glassBorder }}>
                Primary Information
              </h3>

              <Input
                label="National ID Number"
                placeholder="e.g., 63-1234567A12"
                value={formData.nationalId}
                onChange={(e) => handleInputChange('nationalId', e.target.value)}
                error={validationErrors.nationalId}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                }
                rightIcon={getFieldIcon('nationalId')}
                disabled={loading}
              />

              <Input
                label="Full Name"
                placeholder="e.g., John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                error={validationErrors.fullName}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                rightIcon={getFieldIcon('fullName')}
                disabled={loading}
              />

              <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                error={validationErrors.dateOfBirth}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                rightIcon={getFieldIcon('dateOfBirth')}
                disabled={loading}
              />
            </div>

            {/* Secondary Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2" style={{ borderColor: colors.glassBorder }}>
                Additional Information
              </h3>

              <Input
                label="Phone Number (Optional)"
                placeholder="e.g., +263712345678"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                error={validationErrors.phoneNumber}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                rightIcon={getFieldIcon('phoneNumber')}
                disabled={loading}
              />

              <Input
                label="Alternate ID (Optional)"
                placeholder="Passport, Driver's License, etc."
                value={formData.alternateId}
                onChange={(e) => handleInputChange('alternateId', e.target.value)}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                disabled={loading}
              />

              <Select
                label="Search Type"
                value={formData.searchType}
                onChange={(value) => setFormData(prev => ({ ...prev, searchType: value }))}
                options={[
                  { value: 'comprehensive', label: 'Comprehensive Search' },
                  { value: 'exact', label: 'Exact Match Only' },
                  { value: 'fuzzy', label: 'Fuzzy Match' }
                ]}
                disabled={loading}
              />
            </div>
          </div>

          {/* Form Error */}
          {error && (
            <div 
              className="p-4 rounded-lg border-l-4 animate-fadeInUp"
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
                <p className="text-sm text-gray-900">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: colors.glassBorder }}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear Form
            </Button>

            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-600">
                {Object.values(formData).filter(v => v.trim()).length > 0 && (
                  <span>
                    {Object.values(formData).filter(v => v.trim()).length} fields filled
                  </span>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Records'}
              </Button>
            </div>
          </div>
        </form>
      </GlassCard>

      {/* Results */}
      {results && (
        <VerificationResults 
          results={results}
          searchParams={formData}
          onNewSearch={handleClear}
        />
      )}
    </div>
  )
}

export default VerificationForm

