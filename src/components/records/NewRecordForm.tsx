'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NATIONAL_ID_REGEX, RECORD_ID_REGEX } from '@/types'

export function NewRecordForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    recordId: '',
    nationalIdNumber: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    nationality: 'Zimbabwean',
    address: '',
    aliases: '',
    notes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    // Validate Record ID format
    if (!RECORD_ID_REGEX.test(formData.recordId)) {
      setError('Invalid Record ID format. Expected: CR-DDDDDDDADD (e.g., CR-0012345B26)')
      return false
    }

    // Validate National ID format
    if (!NATIONAL_ID_REGEX.test(formData.nationalIdNumber)) {
      setError('Invalid National ID format. Expected: DD-DDDDDDDADD (e.g., 63-6323979A13)')
      return false
    }

    // Validate required fields
    if (!formData.fullName.trim()) {
      setError('Full name is required')
      return false
    }

    if (!formData.dateOfBirth) {
      setError('Date of birth is required')
      return false
    }

    // Validate date is not in the future
    const dob = new Date(formData.dateOfBirth)
    if (dob > new Date()) {
      setError('Date of birth cannot be in the future')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/records/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          aliases: formData.aliases ? formData.aliases.split(',').map(a => a.trim()) : []
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create record')
      }

      // Success - redirect to the new record
      router.push(`/dashboard/records/${data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Record ID and National ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="recordId" className="block text-sm font-medium text-gray-700 mb-2">
            Record ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="recordId"
            name="recordId"
            value={formData.recordId}
            onChange={handleChange}
            placeholder="CR-0012345B26"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Format: CR-DDDDDDDADD</p>
        </div>

        <div>
          <label htmlFor="nationalIdNumber" className="block text-sm font-medium text-gray-700 mb-2">
            National ID Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nationalIdNumber"
            name="nationalIdNumber"
            value={formData.nationalIdNumber}
            onChange={handleChange}
            placeholder="63-6323979A13"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Format: DD-DDDDDDDADD</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Gender and Nationality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            placeholder="Zimbabwean"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main Street, Harare"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      {/* Aliases */}
      <div>
        <label htmlFor="aliases" className="block text-sm font-medium text-gray-700 mb-2">
          Known Aliases
        </label>
        <input
          type="text"
          id="aliases"
          name="aliases"
          value={formData.aliases}
          onChange={handleChange}
          placeholder="Johnny, JD (comma-separated)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">Separate multiple aliases with commas</p>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Additional information about this record..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Record...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Criminal Record
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Important Information</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Record ID must be unique and follow the format CR-DDDDDDDADD</li>
              <li>National ID must match the individual's official identification</li>
              <li>All fields marked with <span className="text-red-600">*</span> are required</li>
              <li>You can add convictions after creating the record</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  )
}
