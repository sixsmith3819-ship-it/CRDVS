'use client'

import Link from 'next/link'
import { useEffect } from 'react'

// error.tsx must be a Client Component (React Error Boundary requirement).
// Next.js ≥ 16.2 passes `unstable_retry`; earlier versions pass `reset`.
// We accept both so the file works across versions.
interface ErrorPageProps {
  error: Error & { digest?: string }
  reset?: () => void
  unstable_retry?: () => void
}

export default function ErrorPage({ error, reset, unstable_retry }: ErrorPageProps) {
  const retry = unstable_retry ?? reset

  useEffect(() => {
    // Log to the browser console; a real app would send to an error-tracking service
    console.error('[CRDVS] Runtime error:', error)
  }, [error])

  const isDev = process.env.NODE_ENV !== 'production'

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: '#0a0e27' }}
      role="alert"
      aria-live="assertive"
    >
      {/* ── Aurora background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Base gradient layer */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(circle at 15% 20%, rgba(239,68,68,0.20) 0%, transparent 50%),
              radial-gradient(circle at 85% 25%, rgba(124,58,237,0.20) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(239,68,68,0.12) 0%, transparent 50%)
            `,
          }}
        />

        {/* Floating orbs — red-tinted for error state */}
        <div
          className="absolute rounded-full"
          style={{
            width: 420,
            height: 420,
            top: '5%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'err-orb-1 22s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 280,
            height: 280,
            bottom: '10%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.30) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'err-orb-2 17s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            bottom: '25%',
            left: '5%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animation: 'err-orb-3 19s ease-in-out infinite',
          }}
        />

        {/* Subtle dot-grid */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="err-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="#ef4444" fillOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#err-grid)" />
          </svg>
        </div>
      </div>

      {/* ── CRDVS logo — fixed top-left ── */}
      <header
        className="fixed top-0 left-0 z-20 flex items-center gap-3 px-6 py-5"
        aria-label="CRDVS"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #7c3aed 100%)' }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div>
          <span className="text-white font-bold text-lg leading-none">CRDVS</span>
          <p className="text-[#a0a9c9] text-xs leading-none mt-0.5">Digital Verification System</p>
        </div>
      </header>

      {/* ── Main content ── */}
      <main
        className="relative z-10 flex-1 flex items-center justify-center px-4 py-12"
        id="main-content"
      >
        <div
          className="w-full max-w-lg rounded-2xl p-8 sm:p-12 text-center"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Alert icon */}
          <div className="flex justify-center mb-6" aria-hidden="true">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.30)',
              }}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="err-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <path
                  stroke="url(#err-icon-grad)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
          </div>

          {/* 500 number */}
          <p
            className="text-8xl sm:text-9xl font-black leading-none mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #ef4444 0%, #7c3aed 100%)',
            }}
            aria-label="Error 500"
          >
            500
          </p>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Something went wrong
          </h1>

          {/* Description */}
          <p className="text-[#a0a9c9] text-base leading-relaxed mb-6">
            An unexpected error occurred. You can try again or return to the dashboard.
          </p>

          {/* Dev-only error message block */}
          {isDev && error?.message && (
            <div
              className="mb-6 text-left rounded-lg overflow-auto"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-[#ef4444] uppercase tracking-wider">
                Error (development only)
              </p>
              <pre
                className="px-4 pb-4 text-xs text-[#fca5a5] leading-relaxed whitespace-pre-wrap break-words"
                aria-label="Error details"
              >
                {error.message}
                {error.digest ? `\n\nDigest: ${error.digest}` : ''}
              </pre>
            </div>
          )}

          {/* Production-safe digest hint */}
          {!isDev && error?.digest && (
            <p className="mb-6 text-xs text-[#6b7280]">
              Reference: <code className="text-[#a0a9c9]">{error.digest}</code>
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {retry && (
              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]"
                style={{
                  background: 'linear-gradient(90deg, #ef4444 0%, #7c3aed 100%)',
                  boxShadow: '0 0 16px rgba(239,68,68,0.25)',
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try again
              </button>
            )}

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Dashboard
            </Link>
          </div>

          {/* Fine-print */}
          <p className="mt-8 text-xs text-[#6b7280]">
            If the issue persists, please contact your system administrator.
          </p>
        </div>
      </main>

      {/* ── Keyframe animations (CSS-only) ── */}
      <style>{`
        @keyframes err-orb-1 {
          0%,  100% { transform: translateY(0)    translateX(0)    scale(1); }
          30%        { transform: translateY(-24px) translateX(12px)  scale(1.06); }
          60%        { transform: translateY(-44px) translateX(-10px) scale(1.12); }
        }
        @keyframes err-orb-2 {
          0%,  100% { transform: translateY(0)    translateX(0)    scale(1); }
          40%        { transform: translateY(18px)  translateX(-18px) scale(0.94); }
          70%        { transform: translateY(-22px) translateX(12px)  scale(1.08); }
        }
        @keyframes err-orb-3 {
          0%,  100% { transform: translateY(0)    translateX(0)    scale(1); }
          50%        { transform: translateY(-28px) translateX(18px)  scale(1.14); }
        }
      `}</style>
    </div>
  )
}
