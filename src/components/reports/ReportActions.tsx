'use client'

interface ReportActionsProps {
  reportId: string
  reportHash: string
}

export function ReportActions({ reportId, reportHash }: ReportActionsProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(reportHash)
      alert('Hash copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy hash:', err)
      alert('Failed to copy hash')
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopyHash}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        Copy Hash
      </button>
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        Print Report
      </button>
    </div>
  )
}
