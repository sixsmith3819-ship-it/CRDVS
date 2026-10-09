'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Toast {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'warning' | 'info'
  /** Auto-dismiss delay in ms. Defaults to 4000. */
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// ---------------------------------------------------------------------------
// Per-variant config
// ---------------------------------------------------------------------------

const VARIANT_CONFIG = {
  success: {
    accent: '#10b981',         // green
    iconPath:
      'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
    ariaLive: 'assertive' as const,
  },
  error: {
    accent: '#dc2626',         // red
    iconPath:
      'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
    ariaLive: 'assertive' as const,
  },
  warning: {
    accent: '#f59e0b',         // orange
    iconPath:
      'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
    ariaLive: 'polite' as const,
  },
  info: {
    accent: '#3b82f6',         // blue
    iconPath:
      'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
    ariaLive: 'polite' as const,
  },
} as const

const MAX_TOASTS = 5
const DEFAULT_DURATION = 4000

// ---------------------------------------------------------------------------
// ToastItem — individual notification card
// ---------------------------------------------------------------------------

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [phase, setPhase] = useState<'entering' | 'visible' | 'leaving'>('entering')
  const removeRef = useRef(onRemove)
  removeRef.current = onRemove

  useEffect(() => {
    // 20ms kick-start gives the browser a frame to paint the "entering" state
    // so the slide-in transition is visible.
    const enterTimer = setTimeout(() => setPhase('visible'), 20)

    const duration = toast.duration ?? DEFAULT_DURATION
    const leaveTimer = setTimeout(() => {
      setPhase('leaving')
      setTimeout(() => removeRef.current(toast.id), 200)
    }, duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(leaveTimer)
    }
  }, [toast.id, toast.duration])

  const handleDismiss = useCallback(() => {
    setPhase('leaving')
    setTimeout(() => removeRef.current(toast.id), 200)
  }, [toast.id])

  const cfg = VARIANT_CONFIG[toast.type]

  const isEntering = phase === 'entering'
  const isLeaving  = phase === 'leaving'

  return (
    <div
      role="alert"
      aria-live={cfg.ariaLive}
      aria-atomic="true"
      className={cn(
        // Layout
        'w-[360px] max-w-[calc(100vw-3rem)] pointer-events-auto',
        // Transition — 200ms slide-in/out
        'transition-all duration-200 ease-out',
        // Entering: off to the right, transparent
        // Visible: in place, opaque
        // Leaving: back off to the right, transparent
        isEntering || isLeaving
          ? 'translate-x-8 opacity-0'
          : 'translate-x-0 opacity-100',
      )}
    >
      {/* Card */}
      <div
        className="rounded-lg overflow-hidden border shadow-xl"
        style={{
          // Glassmorphism background as specified
          background: 'rgba(15,20,45,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: `${cfg.accent}40`,
          boxShadow: `0 10px 25px rgba(0,0,0,0.45), 0 0 20px ${cfg.accent}18`,
        }}
      >
        <div className="flex">
          {/* Coloured left accent border — 4px */}
          <div
            className="flex-shrink-0 w-1 rounded-l-lg"
            style={{ backgroundColor: cfg.accent }}
            aria-hidden="true"
          />

          {/* Body */}
          <div className="flex items-start gap-3 p-4 flex-1 min-w-0">
            {/* Icon */}
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
              style={{
                backgroundColor: `${cfg.accent}20`,
                color: cfg.accent,
              }}
              aria-hidden="true"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d={cfg.iconPath} clipRule="evenodd" />
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-snug">
                {toast.title}
              </p>
              {toast.message && (
                <p className="mt-0.5 text-sm text-[#a0a9c9] leading-relaxed">
                  {toast.message}
                </p>
              )}
              {toast.action && (
                <button
                  type="button"
                  onClick={toast.action.onClick}
                  className="mt-2 text-xs font-medium transition-colors duration-200 hover:underline"
                  style={{ color: cfg.accent }}
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            {/* Dismiss × */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss notification"
              className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[#6b7280] hover:text-white hover:bg-white/10 transition-colors duration-200 mt-0.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ToastProvider — self-managing container that listens on the event bus
// Mount once at the app root (layout.tsx).
// ---------------------------------------------------------------------------

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    const handleAdd = (e: Event) => {
      const toast = (e as CustomEvent<Toast>).detail
      setToasts(prev => {
        // Enforce stack limit — drop oldest if already at max
        const next = prev.length >= MAX_TOASTS ? prev.slice(1) : prev
        return [...next, toast]
      })
    }

    const handleRemove = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      removeToast(id)
    }

    window.addEventListener('add-toast', handleAdd)
    window.addEventListener('remove-toast', handleRemove)
    return () => {
      window.removeEventListener('add-toast', handleAdd)
      window.removeEventListener('remove-toast', handleRemove)
    }
  }, [removeToast])

  if (!isMounted || toasts.length === 0) return null

  return createPortal(
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body,
  )
}

// ---------------------------------------------------------------------------
// ToastContainer — kept for backwards compatibility with existing consumers
// that already pass toasts + onRemove as props (e.g. any page-level usage).
// New code should use <ToastProvider> instead.
// ---------------------------------------------------------------------------

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || toasts.length === 0) return null

  return createPortal(
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body,
  )
}

// ---------------------------------------------------------------------------
// useToast — hook exposing typed convenience methods.
// All calls fire into the global window event bus so they work from anywhere.
// ---------------------------------------------------------------------------

let _toastCount = 0

export function useToast() {
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++_toastCount}-${Date.now()}`
    const full: Toast = { ...toast, id }
    window.dispatchEvent(new CustomEvent('add-toast', { detail: full }))
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    window.dispatchEvent(new CustomEvent('remove-toast', { detail: id }))
  }, [])

  const success = useCallback(
    (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title' | 'message'>>) =>
      addToast({ type: 'success', title, message, ...options }),
    [addToast],
  )

  const error = useCallback(
    (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title' | 'message'>>) =>
      addToast({ type: 'error', title, message, ...options }),
    [addToast],
  )

  const warning = useCallback(
    (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title' | 'message'>>) =>
      addToast({ type: 'warning', title, message, ...options }),
    [addToast],
  )

  const info = useCallback(
    (title: string, message?: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'title' | 'message'>>) =>
      addToast({ type: 'info', title, message, ...options }),
    [addToast],
  )

  return { addToast, removeToast, success, error, warning, info }
}

export default ToastContainer
