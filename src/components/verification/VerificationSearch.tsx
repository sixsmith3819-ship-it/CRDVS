'use client'

import { useState } from 'react'
import { VerificationResults } from './VerificationResults'

export function VerificationSearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)
  const [searchParams, setSearchParams] = useState({
    nationalId: '',
    fullName: '',
    dateOfBirth: '',
  })

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setResults(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setSearchParams({
      nationalId: '',
      fullName: '',
      dateOfBirth: '',
    })
    setResults(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
              National ID Number
            </label>
            <input
              id="nationalId"
              type="text"
              value={searchParams.nationalId}
              onChange={(e) => setSearchParams({ ...searchParams, nationalId: e.target.value })}
              placeholder="63-6323979A13"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Format: DD-DDDDDDDADD</p>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={searchParams.fullName}
              onChange={(e) => setSearchParams({ ...searchParams, fullName: e.target.value })}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={searchParams.dateOfBirth}
              onChange={(e) => setSearchParams({ ...searchParams, dateOfBirth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || (!searchParams.nationalId && !searchParams.fullName)}
            className="bg-blue-600 text-gray-900 px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Verify Identity
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        {!searchParams.nationalId && !searchParams.fullName && (
          <p className="text-sm text-gray-500">
            At least one search field (National ID or Full Name) is required
          </p>
        )}
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Verification Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && <VerificationResults results={results} />}
    </div>
  )
}


