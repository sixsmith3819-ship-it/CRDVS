'use client'

import Link from 'next/link'
import { formatDate, calculateAge } from '@/lib/utils/format'
import { getRiskLabel, getRiskColor } from '@/types'
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
  const totalPages = Math.ceil(total / pageSize)

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
                Risk Level
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(record.risk_level)}`}>
                    {getRiskLabel(record.risk_level)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.prior_conviction_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/dashboard/records/${record.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </Link>
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
