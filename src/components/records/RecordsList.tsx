'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatDate, calculateAge } from '@/lib/utils/format'
import type { CriminalRecord } from '@/types'

export function RecordsList({
  records,
  total,
  page,
  pageSize,
}: {
  records: CriminalRecord[]
  total: number
  page: number
  pageSize: number
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const totalPages = Math.ceil(total / pageSize)

  const handleDelete = async (recordId: string, recordIdDisplay: string) => {
    if (!confirm(`Are you sure you want to delete record ${recordIdDisplay}? This action cannot be undone.`)) {
      return
    }

    setDeleting(recordId)
    setError(null)

    try {
      const response = await fetch(`/api/records/${recordId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete record')
      }

      // Refresh the page to show updated records list
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Failed to delete record')
      setDeleting(null)
    }
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
        <p className="text-gray-600">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} records
        </p>
      </div>

      {/* Records table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Record
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Individual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Convictions
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{record.record_id}</div>
                  <div className="text-sm text-gray-500">
                    Created {formatDate(record.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{record.full_name}</div>
                  <div className="text-sm text-gray-500">
                    {record.national_id_number} • Age {calculateAge(record.date_of_birth)}
                  </div>
                  {record.is_repeat_offender && (
                    <span className="inline-flex mt-1 px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                      Repeat Offender
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
                    {record.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.prior_conviction_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === record.id ? null : record.id)}
                      className="text-gray-400 hover:text-gray-600 p-2"
                      disabled={deleting === record.id}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {openMenuId === record.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                        <Link
                          href={`/dashboard/records/${record.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => {
                            setOpenMenuId(null)
                            handleDelete(record.id, record.record_id)
                          }}
                          disabled={deleting === record.id}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting === record.id ? 'Deleting...' : 'Delete Record'}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Link
            href={`/dashboard/records?page=${page - 1}`}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
              page === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            {...(page === 1 && { onClick: (e) => e.preventDefault() })}
          >
            Previous
          </Link>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/dashboard/records?page=${page + 1}`}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
              page >= totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            {...(page >= totalPages && { onClick: (e) => e.preventDefault() })}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  )
}
