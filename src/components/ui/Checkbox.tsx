'use client';

import React, { useId } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Indeterminate state (overrides checked visually) */
  indeterminate?: boolean;
  /** Callback when the user toggles the checkbox */
  onChange?: (checked: boolean) => void;
  /** Size of the checkbox */
  size?: CheckboxSize;
  /** Optional label rendered to the right */
  label?: string;
  /** Disables the checkbox */
  disabled?: boolean;
  /** Accessible label (used when no visible label is provided) */
  'aria-label'?: string;
  /** HTML id – auto-generated when omitted */
  id?: string;
  /** Additional class names for the root wrapper */
  className?: string;
}

// ─── Size maps ────────────────────────────────────────────────────────────────

const boxSizePx: Record<CheckboxSize, number> = { sm: 16, md: 20, lg: 24 };
const iconSizePx: Record<CheckboxSize, number> = { sm: 10, md: 13, lg: 16 };
const labelSizeClass: Record<CheckboxSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

// ─── Checkbox Component ───────────────────────────────────────────────────────

/**
 * Custom-styled accessible Checkbox component.
 *
 * Backed by a hidden native `<input type="checkbox">` for full form and
 * assistive-technology compatibility. The visual indicator is a purely
 * presentational div driven by the `checked` / `indeterminate` props.
 *
 * @example
 * <Checkbox checked={isChecked} onChange={setIsChecked} label="Remember me" />
 * <Checkbox indeterminate label="Select all" />
 */
export function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  size = 'md',
  label,
  disabled = false,
  'aria-label': ariaLabel,
  id: providedId,
  className,
}: CheckboxProps) {
  const autoId = useId();
  const id = providedId ?? autoId;

  const boxPx = boxSizePx[size];
  const iconPx = iconSizePx[size];

  const isActive = indeterminate || checked;

  function handleClick() {
    if (!disabled) {
      onChange?.(!checked);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!disabled && e.key === ' ') {
      e.preventDefault();
      onChange?.(!checked);
    }
  }

  // aria-checked: true | false | "mixed" for indeterminate
  const ariaChecked: boolean | 'mixed' = indeterminate ? 'mixed' : checked;

  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-center gap-2 select-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )}
    >
      {/* Hidden native input for form submission + keyboard/focus baseline */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        aria-label={!label ? (ariaLabel ?? undefined) : undefined}
        onChange={(e) => !disabled && onChange?.(e.target.checked)}
        // Visually hidden but reachable by assistive technology
        className="sr-only"
        // Sync ref-based indeterminate property (React doesn't expose it as a prop)
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
      />

      {/* Visual checkbox box */}
      <div
        role="checkbox"
        aria-checked={ariaChecked}
        aria-label={!label ? ariaLabel : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex-shrink-0 rounded flex items-center justify-center',
          'transition-all duration-200 ease-in-out',
          'outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
          !disabled && !isActive && 'hover:border-[#14b8a6]'
        )}
        style={{
          width: boxPx,
          height: boxPx,
          backgroundColor: isActive ? '#14b8a6' : '#252d48',
          border: `1.5px solid ${isActive ? '#14b8a6' : '#3a4254'}`,
        }}
        // Prevent double-fire from label's htmlFor click already toggling the input
        aria-hidden="true"
      >
        {indeterminate ? (
          <Minus
            size={iconPx}
            strokeWidth={2.5}
            color="#ffffff"
            aria-hidden="true"
          />
        ) : checked ? (
          <Check
            size={iconPx}
            strokeWidth={2.5}
            color="#ffffff"
            aria-hidden="true"
          />
        ) : null}
      </div>

      {/* Optional label text */}
      {label && (
        <span
          className={cn(
            'leading-none text-white',
            labelSizeClass[size]
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
}

export default Checkbox;
