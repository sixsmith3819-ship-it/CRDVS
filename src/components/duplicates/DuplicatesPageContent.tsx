'use client'

import { useState, useEffect, useCallback } from 'react'
import { DetectionTrigger } from './DetectionTrigger'
import { DuplicatesList } from './DuplicatesList'

interface DuplicateFlag {
  id: string
  similarity_score: number
  flag_status: string
  created_at: string
  record_a: any
  record_b: any
}

interface Stats {
  total: number
  pendingReview: number
  confirmedDuplicates: number
  falsePositives: number
}

export default function DuplicatesPageContent({ initialStatus }: { initialStatus: string }) {
  const [flags, setFlags] = useState<DuplicateFlag[]>([])
  const [filteredFlags, setFilteredFlags] = useState<DuplicateFlag[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pendingReview: 0,
    confirmedDuplicates: 0,
    falsePositives: 0,
  })
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || 'all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch duplicate flags
  const fetchFlags = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/duplicates?status=all&limit=500', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch duplicate flags')
      }

      const data = await response.json()
      const allFlags = data.flags || []

      // Calculate stats
      const newStats: Stats = {
        total: allFlags.length,
        pendingReview: allFlags.filter((f: DuplicateFlag) => f.flag_status === 'pending_review').length,
        confirmedDuplicates: allFlags.filter((f: DuplicateFlag) => f.flag_status === 'confirmed_duplicate').length,
        falsePositives: allFlags.filter((f: DuplicateFlag) => f.flag_status === 'false_positive').length,
      }

      setStats(newStats)
      setFlags(allFlags)
      filterFlags(allFlags, selectedStatus)
    } catch (err: any) {
      console.error('Error fetching flags:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [selectedStatus])

  // Filter flags based on status
  const filterFlags = (allFlags: DuplicateFlag[], status: string) => {
    let filtered = allFlags

    if (status !== 'all') {
      filtered = allFlags.filter(f => f.flag_status === status)
    }

    // Sort by similarity score descending
    filtered.sort((a, b) => b.similarity_score - a.similarity_score)
    setFilteredFlags(filtered)
  }

  // Handle tab change
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    filterFlags(flags, status)
  }

  // Handle detection complete
  const handleDetectionComplete = useCallback(() => {
    // Refresh the data after detection scan completes
    fetchFlags()
  }, [fetchFlags])

  // Initial load
  useEffect(() => {
    fetchFlags()
  }, [])

  const tabs = [
    { status: 'all', label: 'All Flags', count: stats.total },
    { status: 'pending_review', label: 'Pending Review', count: stats.pendingReview },
    { status: 'confirmed_duplicate', label: 'Confirmed', count: stats.confirmedDuplicates },
    { status: 'false_positive', label: 'False Positives', count: stats.falsePositives },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Duplicate Records Management</h1>
        <p className="mt-2 text-gray-600">
          Identify, review, and merge duplicate criminal records to maintain data integrity.
        </p>
      </div>

      {/* Detection Trigger */}
      <DetectionTrigger onDetectionComplete={handleDetectionComplete} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Flags</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pendingReview}</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Confirmed Duplicates</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.confirmedDuplicates}</p>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">False Positives</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.falsePositives}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              onClick={() => handleStatusChange(tab.status)}
              className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                selectedStatus === tab.status
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  selectedStatus === tab.status
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <span className="font-medium">Error:</span> {error}
              </p>
              <button
                onClick={fetchFlags}
                className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading duplicate flags...</p>
              </div>
            </div>
          ) : filteredFlags.length === 0 ? (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedStatus === 'all'
                  ? 'No Duplicate Flags'
                  : `No ${tabs.find(t => t.status === selectedStatus)?.label?.toLowerCase()} Flags`}
              </h3>
              <p className="text-gray-600">
                {selectedStatus === 'all'
                  ? 'No potential duplicate records have been detected. Run a detection scan to find duplicates.'
                  : 'No records match this filter.'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Showing <span className="font-medium">{filteredFlags.length}</span> of <span className="font-medium">{stats.total}</span> duplicate flags
                </p>
              </div>
              <DuplicatesList initialFlags={filteredFlags} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
