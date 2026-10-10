'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
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
  /** Shows a spinning loader icon on the right side */
  isLoading?: boolean;
  /** Icon rendered inside the input on the left */
  leftIcon?: React.ReactNode;
  /** Icon rendered inside the input on the right (overridden by status icons) */
  rightIcon?: React.ReactNode;
  /** Renders a copy-to-clipboard button on the right */
  copyable?: boolean;
  /** Additional class names for the outermost wrapper */
  containerClassName?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required,
      helperText,
      errorMessage,
      isError,
      isValid,
      isLoading,
      leftIcon,
      rightIcon,
      copyable,
      containerClassName,
      className,
      type = 'text',
      disabled,
      id,
      value,
      defaultValue,
      onChange,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    // Derive whether we are in an error state
    const hasError = Boolean(errorMessage || isError);
    const hasSuccess = Boolean(isValid) && !hasError;

    // Resolve the actual input type (handle password toggle)
    const resolvedType =
      type === 'password' ? (showPassword ? 'text' : 'password') : type;

    // Determine which right-side adornment to show (priority: loading > error > success > password > copy > rightIcon)
    const showLoader = Boolean(isLoading);
    const showErrorIcon = hasError && !showLoader;
    const showSuccessIcon = hasSuccess && !showLoader;
    const showPasswordToggle =
      type === 'password' && !showLoader && !showErrorIcon && !showSuccessIcon;
    const showCopyButton =
      copyable && !showLoader && !showErrorIcon && !showSuccessIcon && !showPasswordToggle;
    const showRightIcon =
      rightIcon && !showLoader && !showErrorIcon && !showSuccessIcon && !showPasswordToggle && !showCopyButton;

    const hasRightAdornment =
      showLoader ||
      showErrorIcon ||
      showSuccessIcon ||
      showPasswordToggle ||
      showCopyButton ||
      showRightIcon;

    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    // Copy handler
    const handleCopy = useCallback(async () => {
      const text =
        (value as string) ??
        (ref && typeof ref === 'object' && ref.current ? ref.current.value : '');
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard access denied â€” silent fail
      }
    }, [value, ref]);

    // Shared icon button class
    const iconBtnCls =
      'flex items-center justify-center rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1';

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
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

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <span
              className="pointer-events-none absolute left-3 flex items-center"
              style={{ color: '#6b7280' }}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            aria-invalid={hasError}
            aria-describedby={
              errorMessage
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={cn(
              // Base
              'w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 bg-white',
              // Placeholder
              'placeholder:text-gray-500',
              // Left padding when icon present
              leftIcon && 'pl-10',
              // Right padding when adornment present
              hasRightAdornment && 'pr-10',
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

          {/* Right adornments */}
          {showLoader && (
            <span
              className="pointer-events-none absolute right-3 flex items-center"
              aria-label="Loading"
              aria-live="polite"
            >
              <Loader2
                size={16}
                className="animate-spin"
                style={{ color: '#14b8a6' }}
              />
            </span>
          )}

          {showErrorIcon && (
            <span
              className="pointer-events-none absolute right-3 flex items-center"
              aria-hidden="true"
            >
              <XCircle size={16} className="text-red-500" />
            </span>
          )}

          {showSuccessIcon && (
            <span
              className="pointer-events-none absolute right-3 flex items-center"
              aria-hidden="true"
            >
              <CheckCircle size={16} style={{ color: '#10b981' }} />
            </span>
          )}

          {showPasswordToggle && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className={cn(
                iconBtnCls,
                'absolute right-3 p-0.5',
                'focus-visible:ring-[#14b8a6]'
              )}
              style={{ color: '#6b7280' }}
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={disabled}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {showCopyButton && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
              className={cn(
                iconBtnCls,
                'absolute right-3 p-0.5',
                'focus-visible:ring-[#14b8a6]'
              )}
              style={{ color: copied ? '#10b981' : '#6b7280' }}
              onClick={handleCopy}
              disabled={disabled}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          )}

          {showRightIcon && (
            <span
              className="pointer-events-none absolute right-3 flex items-center"
              style={{ color: '#6b7280' }}
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs text-red-500"
          >
            <XCircle size={12} aria-hidden="true" />
            {errorMessage}
          </p>
        )}

        {/* Helper text (only when no error message) */}
        {helperText && !errorMessage && (
          <p
            id={`${inputId}-helper`}
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

Input.displayName = 'Input';

export { Input };
export default Input;


