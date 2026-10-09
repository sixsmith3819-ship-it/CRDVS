'use client'

import { useState } from 'react'

export function DetectionTrigger() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runDetection = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/duplicates/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: 75, limit: 100 })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Detection failed')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Run Duplicate Detection</h3>
          <p className="text-sm text-gray-600">
            Scan all active criminal records to identify potential duplicates using AI-based similarity algorithms.
          </p>
        </div>
      </div>

      <button
        onClick={runDetection}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Scanning...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Run Detection Scan
          </>
        )}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h4 className="font-medium text-green-900 mb-2">Detection Complete</h4>
          <div className="text-sm text-green-800 space-y-1">
            <p>✓ Scanned {result.recordsScanned} records</p>
            <p>✓ Performed {result.comparisons} comparisons</p>
            <p>✓ Found {result.duplicatesFound} potential duplicate{result.duplicatesFound !== 1 ? 's' : ''}</p>
            <p className="mt-2 text-xs text-green-700">{result.message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <span className="font-medium">Error:</span> {error}
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Detection Algorithm</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Name similarity (Levenshtein distance + Phonetic matching)</li>
          <li>Date of birth comparison</li>
          <li>National ID similarity</li>
          <li>Address matching</li>
          <li>Composite scoring with weighted factors</li>
        </ul>
      </div>
    </div>
  )
}
