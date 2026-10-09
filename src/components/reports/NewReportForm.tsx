'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CriminalRecord {
  id: string
  record_id: string
  national_id_number: string
  full_name: string
  date_of_birth: string
  gender: string
  nationality: string
  address: string | null
  status: string
  risk_level: number
  is_repeat_offender: boolean
  prior_conviction_count: number
  convictions?: Array<{
    id: string
    case_number: string
    offense_category: string
    offense_description: string
    verdict: string
    sentence_description: string | null
    charge_date: string
    conviction_date: string | null
  }>
}

interface NewReportFormProps {
  preloadedRecord?: CriminalRecord | null
}

export function NewReportForm({ preloadedRecord }: NewReportFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<CriminalRecord | null>(preloadedRecord || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    reportType: 'full_verification',
    purpose: '',
    recipient: '',
    expiresInDays: '90'
  })

  useEffect(() => {
    if (preloadedRecord) {
      setSelectedRecord(preloadedRecord)
    }
  }, [preloadedRecord])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const searchRecord = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a Record ID or National ID to search')
      return
    }

    setSearchLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/records/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search for record')
      }

      if (!data.record) {
        throw new Error('No record found with that ID')
      }

      setSelectedRecord(data.record)
    } catch (err: any) {
      setError(err.message)
      setSelectedRecord(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedRecord) {
      setError('Please select a criminal record first')
      return
    }

    if (!formData.purpose.trim()) {
      setError('Purpose is required')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/reports/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criminalRecordId: selectedRecord.id,
          reportType: formData.reportType,
          purpose: formData.purpose,
          recipient: formData.recipient || null,
          expiresInDays: formData.expiresInDays ? parseInt(formData.expiresInDays) : null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }

      // Success - redirect to the report
      router.push(`/dashboard/reports/${data.id}`)
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

      {/* Record Selection */}
      {!preloadedRecord && (
        <div className="space-y-4">
          <div>
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">
              Search Criminal Record <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Record ID or National ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={searchLoading || loading}
              />
              <button
                type="button"
                onClick={searchRecord}
                disabled={searchLoading || loading}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Search by Record ID (e.g., CR-0012345B26) or National ID (e.g., 63-6323979A13)
            </p>
          </div>
        </div>
      )}

      {/* Selected Record Display */}
      {selectedRecord && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Selected Record</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Record ID:</span>
              <span className="ml-2 font-medium text-gray-900">{selectedRecord.record_id}</span>
            </div>
            <div>
              <span className="text-gray-600">National ID:</span>
              <span className="ml-2 font-medium text-gray-900">{selectedRecord.national_id_number}</span>
            </div>
            <div>
              <span className="text-gray-600">Full Name:</span>
              <span className="ml-2 font-medium text-gray-900">{selectedRecord.full_name}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                selectedRecord.status === 'active' ? 'bg-green-100 text-green-800' :
                selectedRecord.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedRecord.status}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Convictions:</span>
              <span className="ml-2 font-medium text-gray-900">
                {selectedRecord.convictions?.length || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Risk Level:</span>
              <span className="ml-2 font-medium text-gray-900">{selectedRecord.risk_level}/5</span>
            </div>
          </div>
          {!preloadedRecord && (
            <button
              type="button"
              onClick={() => {
                setSelectedRecord(null)
                setSearchQuery('')
              }}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              Select a different record
            </button>
          )}
        </div>
      )}

      {/* Report Type */}
      <div>
        <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
          Report Type <span className="text-red-500">*</span>
        </label>
        <select
          id="reportType"
          name="reportType"
          value={formData.reportType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading}
        >
          <option value="full_verification">Full Verification Report</option>
          <option value="summary">Summary Report</option>
          <option value="background_check">Background Check</option>
          <option value="court_submission">Court Submission</option>
        </select>
      </div>

      {/* Purpose */}
      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
          Purpose <span className="text-red-500">*</span>
        </label>
        <textarea
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          rows={3}
          placeholder="e.g., Employment background check, Court proceedings, Immigration application..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">Explain why this report is being generated</p>
      </div>

      {/* Recipient */}
      <div>
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
          Recipient (Optional)
        </label>
        <input
          type="text"
          id="recipient"
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          placeholder="e.g., XYZ Corporation, Ministry of Justice..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">Organization or person requesting the report</p>
      </div>

      {/* Expiration */}
      <div>
        <label htmlFor="expiresInDays" className="block text-sm font-medium text-gray-700 mb-2">
          Report Validity Period
        </label>
        <select
          id="expiresInDays"
          name="expiresInDays"
          value={formData.expiresInDays}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="">No Expiration</option>
          <option value="30">30 Days</option>
          <option value="60">60 Days</option>
          <option value="90">90 Days</option>
          <option value="180">180 Days</option>
          <option value="365">1 Year</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          After this period, the report will be marked as expired
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading || !selectedRecord}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Report...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
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

      {/* Security Note */}
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Tamper-Evident Security</p>
            <p>
              Each report includes a SHA-256 cryptographic hash that ensures the report has not 
              been modified after generation. The hash is calculated from the complete report data 
              and can be used to verify authenticity.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
