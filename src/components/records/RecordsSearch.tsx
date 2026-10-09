'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function RecordsSearch({ currentParams }: { currentParams: { [key: string]: string | string[] | undefined } }) {
  const router = useRouter()
  const [query, setQuery] = useState((currentParams.query as string) || '')
  const [status, setStatus] = useState((currentParams.status as string) || '')
  const [riskLevel, setRiskLevel] = useState((currentParams.risk_level as string) || '')
  const [repeatOffender, setRepeatOffender] = useState((currentParams.repeat_offender as string) || '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (query) params.set('query', query)
    if (status) params.set('status', status)
    if (riskLevel) params.set('risk_level', riskLevel)
    if (repeatOffender) params.set('repeat_offender', repeatOffender)
    
    router.push(`/dashboard/records?${params.toString()}`)
  }

  function handleClear() {
    setQuery('')
    setStatus('')
    setRiskLevel('')
    setRepeatOffender('')
    router.push('/dashboard/records')
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, National ID, Record ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="acquitted">Acquitted</option>
            <option value="deceased">Deceased</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Level
          </label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            <option value="1">Low (1)</option>
            <option value="2">Moderate (2)</option>
            <option value="3">High (3)</option>
            <option value="4">Very High (4)</option>
            <option value="5">Critical (5)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repeat Offender
          </label>
          <select
            value={repeatOffender}
            onChange={(e) => setRepeatOffender(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          Clear
        </button>
      </div>
    </form>
  )
}
