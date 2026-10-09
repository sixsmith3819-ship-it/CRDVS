'use client'

import Link from 'next/link'

interface RecordActionsProps {
  nationalIdNumber: string
  recordId: string
}

export function RecordActions({ nationalIdNumber, recordId }: RecordActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <Link
          href={`/dashboard/verify?nationalId=${nationalIdNumber}`}
          className="block w-full text-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          Verify Identity
        </Link>
        <Link
          href={`/dashboard/reports/new?recordId=${recordId}`}
          className="block w-full text-center px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors text-sm font-medium"
        >
          Generate Report
        </Link>
        <button
          onClick={() => window.print()}
          className="block w-full text-center px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          Print Record
        </button>
      </div>
    </div>
  )
}
