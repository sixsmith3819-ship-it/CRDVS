'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title (used in aria-labelledby) */
  title: string;
  /** Optional description/subtitle (used in aria-describedby) */
  description?: string;
  /** Main content slot */
  children: React.ReactNode;
  /** Footer slot — typically action buttons */
  footer?: React.ReactNode;
  /** Modal size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show the X close button */
  showCloseButton?: boolean;
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Additional className for the backdrop wrapper */
  className?: string;
  /** Additional className for the modal panel */
  contentClassName?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Modal — Premium glassmorphic modal dialog with Aurora accents.
 *
 * Features:
 * - Glassmorphic background with aurora gradient border
 * - Smooth scale-in/out + fade-in/out animations (150ms)
 * - Backdrop: bg-black/60 backdrop-blur-sm with fade transition
 * - Keyboard: Escape to close, Tab cycles within modal (focus trap)
 * - Focus returns to the element that triggered the modal on close
 * - ARIA: role="dialog", aria-modal="true", aria-labelledby, aria-describedby
 * - Size variants: sm, md, lg, xl
 * - Header / content / footer slots
 * - Scrollable content area: overflow-y-auto max-h-[calc(100vh-200px)]
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  contentClassName,
}: ModalProps) {
  // Track whether we are in the closing animation phase so we can unmount
  // only after the animation completes.
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Store the element that had focus before the modal opened so we can restore it.
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ── Mount / unmount lifecycle ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Remember what was focused before opening
      previousFocusRef.current = document.activeElement as HTMLElement;
      setIsClosing(false);
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else if (isVisible) {
      // Trigger exit animation; unmount after it completes (150ms)
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        document.body.style.overflow = 'unset';
        // Return focus to the trigger element
        previousFocusRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Escape key ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, closeOnEscape, onClose]);

  // ── Focus trap ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isVisible || !panelRef.current) return;

    // Move initial focus into the panel
    const panel = panelRef.current;
    const firstFocusable = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? panel).focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: wrap from first → last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: wrap from last → first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isVisible]);

  // ── Backdrop click ────────────────────────────────────────────────────
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && e.target === backdropRef.current) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose],
  );

  // ── Render ────────────────────────────────────────────────────────────
  if (!isVisible) return null;

  const labelId = 'modal-title';
  const descId = 'modal-description';

  return createPortal(
    <div
      ref={backdropRef}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/60 backdrop-blur-sm',
        isClosing ? 'animate-fade-out' : 'animate-fade-in',
        className,
      )}
      onClick={handleBackdropClick}
      role="presentation"
    >
      {/* ── Modal panel ─────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          // Layout
          'relative w-full mx-4 rounded-2xl outline-none',
          // Glassmorphism
          'bg-gradient-to-br from-[rgba(20,184,166,0.08)] via-[rgba(124,58,237,0.06)] to-[rgba(16,185,129,0.08)]',
          'backdrop-blur-2xl',
          // Aurora border
          'border border-[rgba(255,255,255,0.15)]',
          // Premium shadow
          'shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]',
          // Entrance / exit animation
          isClosing ? 'animate-scale-out' : 'animate-scale-in',
          // Size
          sizeClasses[size],
          contentClassName,
        )}
      >
        {/* Aurora gradient shimmer overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[rgba(20,184,166,0.05)] to-transparent opacity-60 pointer-events-none"
        />

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="relative z-10 flex items-start justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex-1">
            <h2
              id={labelId}
              className="text-2xl font-bold text-white tracking-tight"
            >
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-sm text-[#a0a9c9] mt-1">
                {description}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'ml-4 p-2 rounded-lg flex-shrink-0',
                'text-[#a0a9c9] hover:text-white',
                'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
              )}
              aria-label="Close modal"
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* ── Content slot ───────────────────────────────────────────── */}
        <div className="relative z-10 p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>

        {/* ── Footer slot ────────────────────────────────────────────── */}
        {footer && (
          <div className="relative z-10 flex items-center justify-end gap-3 p-6 border-t border-[rgba(255,255,255,0.1)]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
