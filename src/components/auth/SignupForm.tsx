'use client'

import { useState } from 'react'
import { signupAction } from '@/actions/signup'
import {
  validateSignupForm,
  type SignupValidationErrors,
} from '@/lib/utils/signupValidation'

export function SignupForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<SignupValidationErrors>({})
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    role: '',
    rank: '',
    department: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Clear error for a specific field when user starts typing
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.currentTarget
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear validation error for this field
    if (validationErrors[name as keyof SignupValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    // Validate all fields before submission
    const validation = validateSignupForm(formData)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }

    setLoading(true)
    setValidationErrors({})

    const submissionFormData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        submissionFormData.append(key, value)
      }
    })

    try {
      // signupAction will throw a redirect() which is the Next.js way of handling redirects
      await signupAction(submissionFormData)
    } catch (err: any) {
      // If it's not a redirect, it's an error
      if (err.message && !err.message.includes('NEXT_REDIRECT')) {
        setError(err.message)
        setLoading(false)
      }
      // Redirect errors are expected and will be handled by Next.js
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
        <p className="font-medium">Account created successfully!</p>
        <p className="text-sm mt-1">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          <p className="font-medium">Registration failed</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.fullName
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="John Tendai Moyo"
            disabled={loading}
          />
          {validationErrors.fullName && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.fullName}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Letters, spaces, hyphens, and apostrophes only</p>
        </div>

        {/* Employee ID */}
        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
            Employee/Badge ID <span className="text-red-500">*</span>
          </label>
          <input
            id="employeeId"
            name="employeeId"
            type="text"
            required
            value={formData.employeeId}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.employeeId
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="EMP123"
            disabled={loading}
          />
          {validationErrors.employeeId && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.employeeId}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Letters, numbers, and hyphens (3-50 characters)</p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.email
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="user@magistrates.gov.zw"
            disabled={loading}
          />
          {validationErrors.email && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.role
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Select your role</option>
            <option value="police_officer">Police Officer</option>
            <option value="court_officer">Court Officer</option>
            <option value="prison_officer">Prison Officer</option>
          </select>
          {validationErrors.role && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.role}</p>
          )}
        </div>

        {/* Rank */}
        <div>
          <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mb-2">
            Rank
          </label>
          <input
            id="rank"
            name="rank"
            type="text"
            value={formData.rank}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.rank
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="Constable, Sergeant, Inspector..."
            disabled={loading}
          />
          {validationErrors.rank && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.rank}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Letters, spaces, hyphens, and periods (optional)</p>
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <input
            id="department"
            name="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.department
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="CID, Traffic, etc."
            disabled={loading}
          />
          {validationErrors.department && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.department}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Letters, numbers, spaces, hyphens, commas, slashes (optional)</p>
        </div>

        {/* Station */}
        <div>
          <label htmlFor="station" className="block text-sm font-medium text-gray-700 mb-2">
            Station/Branch
          </label>
          <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-medium flex items-center">
            Gweru Magistrate Court
          </div>
          <input
            id="station"
            name="station"
            type="hidden"
            value="Gweru Magistrate Court"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.phone
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="+263 XX XXX XXXX"
            disabled={loading}
          />
          {validationErrors.phone && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.phone}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Zimbabwe format: +263771234567 or 0771234567 (optional)</p>
        </div>

        {/* Password */}
        <div className="md:col-span-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.password
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="Minimum 8 characters"
            disabled={loading}
          />
          {validationErrors.password && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Must contain: uppercase, lowercase, number, special character (!@#$%^&* etc)
          </p>
        </div>

        {/* Confirm Password */}
        <div className="md:col-span-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              validationErrors.confirmPassword
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300'
            }`}
            placeholder="Re-enter your password"
            disabled={loading}
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.confirmPassword}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>

      <p className="text-xs text-center text-gray-600">
        By creating an account, you agree to use this system for official court duties only.
      </p>
    </form>
  )
}

