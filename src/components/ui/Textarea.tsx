'use client';

import * as React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label rendered above the field */
  label?: string;
  /** Marks the field required and renders a red asterisk next to the label */
  required?: boolean;
  /** Small hint text rendered below the field (hidden when errorMessage is shown) */
  helperText?: string;
  /** Error message; triggers red border + XCircle icon */
  errorMessage?: string;
  /** Controlled error state (red border) without a message text */
  isError?: boolean;
  /** Controlled success state (green border + CheckCircle icon) */
  isValid?: boolean;
  /** Additional class names for the outermost wrapper */
  containerClassName?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      required,
      helperText,
      errorMessage,
      isError,
      isValid,
      containerClassName,
      className,
      disabled,
      id,
      ...rest
    },
    ref
  ) => {
    const hasError = Boolean(errorMessage || isError);
    const hasSuccess = Boolean(isValid) && !hasError;

    const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium leading-none"
            style={{ color: '#a0a9c9' }}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea wrapper (relative for potential future icon overlays) */}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              errorMessage
                ? `${textareaId}-error`
                : helperText
                ? `${textareaId}-helper`
                : undefined
            }
            className={cn(
              // Base
              'w-full rounded-lg border px-3 py-2.5 text-sm text-white outline-none transition-all duration-200',
              // Resize: vertical only
              'resize-y',
              // Min height
              'min-h-[80px]',
              // Placeholder
              'placeholder:text-[#6b7280]',
              // Normal border
              !hasError && !hasSuccess && [
                'border-[#3a4254]',
                'focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]/30 focus:ring-offset-0',
              ],
              // Error state
              hasError && [
                'border-red-500',
                'focus:border-red-500 focus:ring-2 focus:ring-red-500/30',
              ],
              // Success state
              hasSuccess && [
                'border-[#10b981]',
                'focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/30',
              ],
              // Disabled
              disabled && 'cursor-not-allowed opacity-50',
              className
            )}
            style={{ backgroundColor: '#252d48' }}
            {...rest}
          />
        </div>

        {/* Inline status indicator (below textarea) */}
        {(hasError || hasSuccess) && !errorMessage && (
          <p
            className={cn(
              'flex items-center gap-1 text-xs',
              hasError ? 'text-red-500' : 'text-[#10b981]'
            )}
            aria-hidden="true"
          >
            {hasError ? (
              <XCircle size={12} />
            ) : (
              <CheckCircle size={12} />
            )}
            {hasError ? 'Invalid input' : 'Looks good'}
          </p>
        )}

        {/* Error message */}
        {errorMessage && (
          <p
            id={`${textareaId}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs text-red-500"
          >
            <XCircle size={12} aria-hidden="true" />
            {errorMessage}
          </p>
        )}

        {/* Helper text (only when no error message) */}
        {helperText && !errorMessage && !hasError && !hasSuccess && (
          <p
            id={`${textareaId}-helper`}
            className="text-xs"
            style={{ color: '#6b7280' }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export default Textarea;
