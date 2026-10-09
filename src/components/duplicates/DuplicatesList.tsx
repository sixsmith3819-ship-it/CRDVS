'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDate, calculateAge } from '@/lib/utils/format'
import { getRiskLabel, getRiskColor } from '@/types'

interface DuplicateFlag {
  id: string
  similarity_score: number
  name_similarity: number
  dob_match: boolean
  national_id_match: boolean
  matching_fields: string[]
  flag_status: string
  detection_method: string
  created_at: string
  reviewed_at: string | null
  review_notes: string | null
  record_a: any
  record_b: any
  flagged_by_profile: any
  reviewed_by_profile: any
}

export function DuplicatesList({ 
  initialFlags 
}: { 
  initialFlags: DuplicateFlag[] 
}) {
  const [flags, setFlags] = useState<DuplicateFlag[]>(initialFlags)
  const [selectedFlag, setSelectedFlag] = useState<DuplicateFlag | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReview = async (flagId: string, status: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/duplicates/${flagId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flag_status: status,
          review_notes: reviewNotes
        })
      })

      if (!response.ok) throw new Error('Failed to update flag')

      // Update local state
      setFlags(flags.map(f => 
        f.id === flagId 
          ? { ...f, flag_status: status, reviewed_at: new Date().toISOString(), review_notes: reviewNotes }
          : f
      ))

      setSelectedFlag(null)
      setReviewNotes('')
      alert(`Duplicate flag ${status === 'confirmed_duplicate' ? 'confirmed' : 'dismissed'} successfully`)
    } catch (error) {
      console.error('Error updating flag:', error)
      alert('Failed to update duplicate flag')
    } finally {
      setLoading(false)
    }
  }

  const getSimilarityColor = (score: number) => {
    if (score >= 95) return 'text-red-700 bg-red-100'
    if (score >= 85) return 'text-orange-700 bg-orange-100'
    if (score >= 75) return 'text-yellow-700 bg-yellow-100'
    return 'text-gray-700 bg-gray-100'
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      pending_review: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
      confirmed_duplicate: { label: 'Confirmed', color: 'bg-red-100 text-red-800' },
      false_positive: { label: 'False Positive', color: 'bg-green-100 text-green-800' },
      dismissed: { label: 'Dismissed', color: 'bg-gray-100 text-gray-800' },
      merged: { label: 'Merged', color: 'bg-blue-100 text-blue-800' },
    }
    const badge = badges[status] || badges.pending_review
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>{badge.label}</span>
  }

  if (flags.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Duplicate Flags</h3>
        <p className="text-gray-600">No potential duplicate records have been detected.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {flags.map((flag) => (
        <div key={flag.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getSimilarityColor(flag.similarity_score)}`}>
                  {flag.similarity_score}% Similar
                </span>
                {getStatusBadge(flag.flag_status)}
              </div>
              <div className="text-sm text-gray-500">
                Detected {formatDate(flag.created_at)}
              </div>
            </div>

            {/* Records Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {/* Record A */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Record A</h4>
                  <Link 
                    href={`/dashboard/records/${flag.record_a.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full →
                  </Link>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{flag.record_a.full_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Record ID:</span>
                    <span className="ml-2 font-medium">{flag.record_a.record_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">National ID:</span>
                    <span className="ml-2 font-medium">{flag.record_a.national_id_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">DOB:</span>
                    <span className="ml-2 font-medium">
                      {formatDate(flag.record_a.date_of_birth)} (Age {calculateAge(flag.record_a.date_of_birth)})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Convictions:</span>
                    <span className="ml-2 font-medium">{flag.record_a.prior_conviction_count}</span>
                  </div>
                </div>
              </div>

              {/* Record B */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Record B</h4>
                  <Link 
                    href={`/dashboard/records/${flag.record_b.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full →
                  </Link>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{flag.record_b.full_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Record ID:</span>
                    <span className="ml-2 font-medium">{flag.record_b.record_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">National ID:</span>
                    <span className="ml-2 font-medium">{flag.record_b.national_id_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">DOB:</span>
                    <span className="ml-2 font-medium">
                      {formatDate(flag.record_b.date_of_birth)} (Age {calculateAge(flag.record_b.date_of_birth)})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Convictions:</span>
                    <span className="ml-2 font-medium">{flag.record_b.prior_conviction_count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matching Fields */}
            <div className="mb-4">
              <span className="text-sm text-gray-600">Matching Fields:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {flag.matching_fields && flag.matching_fields.length > 0 ? (
                  flag.matching_fields.map((field: string) => (
                    <span key={field} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                      {field.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">No specific fields matched</span>
                )}
              </div>
            </div>

            {/* Similarity Breakdown */}
            <div className="mb-4 text-sm">
              <span className="text-gray-600">Similarity Breakdown:</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600 text-xs">Name</div>
                  <div className="font-medium">{flag.name_similarity}%</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600 text-xs">DOB</div>
                  <div className="font-medium">{flag.dob_match ? '✓ Match' : '✗ Different'}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600 text-xs">National ID</div>
                  <div className="font-medium">{flag.national_id_match ? '✓ Match' : '✗ Different'}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600 text-xs">Method</div>
                  <div className="font-medium text-xs">{flag.detection_method.replace(/_/g, ' ')}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {flag.flag_status === 'pending_review' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedFlag(flag)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Review
                </button>
              </div>
            )}

            {/* Review Notes */}
            {flag.review_notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Review Notes:</span> {flag.review_notes}
                </p>
                {flag.reviewed_by_profile && (
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed by {flag.reviewed_by_profile.full_name} on {formatDate(flag.reviewed_at!)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Review Modal */}
      {selectedFlag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Review Duplicate Flag</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Notes (Optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add any notes about your decision..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReview(selectedFlag.id, 'confirmed_duplicate')}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                Confirm Duplicate
              </button>
              <button
                onClick={() => handleReview(selectedFlag.id, 'false_positive')}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                False Positive
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedFlag(null)
                setReviewNotes('')
              }}
              disabled={loading}
              className="w-full mt-3 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
