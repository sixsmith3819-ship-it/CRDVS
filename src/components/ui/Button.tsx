'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Shows a spinning Loader2 icon and disables the button */
  loading?: boolean;
  /** Icon rendered to the left of the label */
  leftIcon?: React.ReactNode;
  /** Icon rendered to the right of the label */
  rightIcon?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Variant / size class maps
// ---------------------------------------------------------------------------

/**
 * Primary: Aurora teal â†’ purple gradient with glow shadow on hover.
 * Secondary: Dark glass surface (surface layer) with a subtle border.
 * Tertiary: Fully transparent, text-only with a subtle underline on hover.
 * Danger: Red fill.
 * Success: Green fill.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    // Aurora teal-to-purple gradient background via inline gradient utility
    'bg-gradient-to-r from-[#14b8a6] to-[#7c3aed]',
    'text-white',
    'border border-transparent',
    'shadow-md',
    // Hover: slightly more pronounced shadow + glow
    'hover:shadow-[0_0_20px_rgba(20,184,166,0.45)]',
    'focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
  ].join(' '),

  secondary: [
    'bg-[#252d48]',
    'text-gray-700',
    'border border-[rgba(255,255,255,0.15)]',
    'hover:bg-[#3a4254] hover:text-gray-900 hover:border-[rgba(255,255,255,0.25)]',
    'focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
  ].join(' '),

  tertiary: [
    'bg-transparent',
    'text-gray-700',
    'border border-transparent',
    'hover:text-gray-900 hover:underline',
    'focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
  ].join(' '),

  danger: [
    'bg-[#dc2626]',
    'text-white',
    'border border-transparent',
    'hover:bg-[#b91c1c]',
    'hover:shadow-[0_0_16px_rgba(220,38,38,0.45)]',
    'focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
  ].join(' '),

  success: [
    'bg-[#10b981]',
    'text-white',
    'border border-transparent',
    'hover:bg-[#059669]',
    'hover:shadow-[0_0_16px_rgba(16,185,129,0.45)]',
    'focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Button
 *
 * A fully accessible button with multiple variants, sizes, icon slots,
 * and a loading state.
 *
 * @example
 * <Button variant="primary" leftIcon={<PlusIcon />} onClick={handleClick}>
 *   New Record
 * </Button>
 *
 * <Button variant="danger" loading>Deletingâ€¦</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        className={cn(
          // Base layout
          'inline-flex items-center justify-center',
          'font-medium rounded-lg',
          // Smooth transitions for color, shadow, transform
          'transition-all duration-200 ease-in-out',
          // Hover scale â€” only when not disabled
          'hover:scale-[1.02]',
          // Active press scale
          'active:scale-[0.98]',
          // Disabled state
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Variant-specific styles
          variantClasses[variant],
          // Size-specific styles
          sizeClasses[size],
          // Caller overrides
          className,
        )}
        {...props}
      >
        {/* Left icon or loading spinner (loading replaces left icon) */}
        {loading ? (
          <Loader2
            className={cn(iconSizeClasses[size], 'animate-spin shrink-0')}
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <span className={cn(iconSizeClasses[size], 'shrink-0')} aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}

        {/* Button label */}
        {children && <span>{children}</span>}

        {/* Right icon â€” hidden during loading */}
        {!loading && rightIcon ? (
          <span className={cn(iconSizeClasses[size], 'shrink-0')} aria-hidden="true">
            {rightIcon}
          </span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
export { Button };

