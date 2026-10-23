'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface AddConvictionFormProps {
  recordId: string
  recordData: {
    id: string
    record_id: string
    full_name: string
    national_id_number: string
  }
}

export function AddConvictionForm({ recordId, recordData }: AddConvictionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    caseNumber: '',
    offenseCategory: 'sexual_offense',
    offenseDescription: '',
    courtName: 'Gweru Magistrate Court',
    chargeDate: '',
    convictionDate: '',
    verdict: 'convicted',
    sentenceDescription: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.caseNumber.trim()) {
      setError('Case number is required')
      return
    }
    // Validate case number format: CASE-YYYY-DDDDD
    if (!/^CASE-\d{4}-\d{5}$/.test(formData.caseNumber)) {
      setError('Case number must follow format: CASE-YYYY-DDDDD (e.g., CASE-2026-00123)')
      return
    }
    if (!formData.offenseDescription.trim()) {
      setError('Offense description is required')
      return
    }
    if (!formData.courtName.trim()) {
      setError('Court name is required')
      return
    }
    if (!formData.chargeDate) {
      setError('Charge date is required')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/convictions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criminalRecordId: recordId,
          caseNumber: formData.caseNumber,
          offenseCategory: formData.offenseCategory,
          offenseDescription: formData.offenseDescription,
          courtName: formData.courtName,
          chargeDate: formData.chargeDate,
          convictionDate: formData.convictionDate || null,
          verdict: formData.verdict,
          sentenceDescription: formData.sentenceDescription || null,
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create conviction')
      }

      const data = await response.json()

      // Success - redirect back to record
      router.push(`/dashboard/records/${recordId}`)
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

      {/* Record Information Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Record Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Record ID:</span>
            <span className="ml-2 font-medium text-gray-900">{recordData.record_id}</span>
          </div>
          <div>
            <span className="text-gray-600">Individual:</span>
            <span className="ml-2 font-medium text-gray-900">{recordData.full_name}</span>
          </div>
          <div>
            <span className="text-gray-600">National ID:</span>
            <span className="ml-2 font-medium text-gray-900">{recordData.national_id_number}</span>
          </div>
        </div>
      </div>

      {/* Conviction Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Conviction Details</h3>

        <div>
          <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Case Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="caseNumber"
            name="caseNumber"
            value={formData.caseNumber}
            onChange={handleChange}
            placeholder="CASE-2026-00123"
            pattern="^CASE-\d{4}-\d{5}$"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Format: CASE-YYYY-DDDDD (e.g., CASE-2026-00123)</p>
        </div>

        <div>
          <label htmlFor="offenseCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Offense Category <span className="text-red-500">*</span>
          </label>
          <select
            id="offenseCategory"
            name="offenseCategory"
            value={formData.offenseCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
            required
          >
            <option value="violent_crime">Violent Crime (Assault, Robbery, Murder)</option>
            <option value="property_crime">Property Crime (Theft, Burglary, Vandalism)</option>
            <option value="sexual_offense">Sexual Offense</option>
            <option value="drug_offense">Drug Offense</option>
            <option value="financial_crime">Financial Crime (Fraud, Embezzlement)</option>
            <option value="cybercrime">Cybercrime</option>
            <option value="terrorism">Terrorism</option>
            <option value="organized_crime">Organized Crime</option>
            <option value="traffic_offense">Traffic Offense</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="offenseDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Offense Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="offenseDescription"
            name="offenseDescription"
            value={formData.offenseDescription}
            onChange={handleChange}
            rows={2}
            placeholder="e.g., Sexual assault of a minor"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="courtName" className="block text-sm font-medium text-gray-700 mb-1">
            Court Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="courtName"
            name="courtName"
            value={formData.courtName}
            onChange={handleChange}
            placeholder="e.g., Harare High Court"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="chargeDate" className="block text-sm font-medium text-gray-700 mb-1">
              Charge Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="chargeDate"
              name="chargeDate"
              value={formData.chargeDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="convictionDate" className="block text-sm font-medium text-gray-700 mb-1">
              Conviction Date
            </label>
            <input
              type="date"
              id="convictionDate"
              name="convictionDate"
              value={formData.convictionDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="verdict" className="block text-sm font-medium text-gray-700 mb-1">
              Verdict <span className="text-red-500">*</span>
            </label>
            <select
              id="verdict"
              name="verdict"
              value={formData.verdict}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            >
              <option value="convicted">Convicted</option>
              <option value="acquitted">Acquitted</option>
              <option value="dismissed">Dismissed</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="sentenceDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Sentence Description
          </label>
          <textarea
            id="sentenceDescription"
            name="sentenceDescription"
            value={formData.sentenceDescription}
            onChange={handleChange}
            rows={2}
            placeholder="e.g., 12 years imprisonment"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Conviction...' : 'Add Conviction'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
