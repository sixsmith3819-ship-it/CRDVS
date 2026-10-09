'use client';

import * as React from 'react';
import { useRef, useState, useEffect, useCallback, useId } from 'react';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps {
  /** Label rendered above the trigger */
  label?: string;
  /** Placeholder text shown when no option is selected */
  placeholder?: string;
  /** Array of selectable options */
  options: SelectOption[];
  /** Controlled value (option value string) */
  value?: string;
  /** Called when the user selects an option */
  onChange?: (value: string) => void;
  /** Disables all interaction */
  disabled?: boolean;
  /** Marks field as required; renders a red asterisk next to the label */
  required?: boolean;
  /** Error message; triggers red border */
  errorMessage?: string;
  /** Small hint text shown below the field (hidden when errorMessage is shown) */
  helperText?: string;
  /** Shows a spinner instead of the chevron icon */
  isLoading?: boolean;
  /** Controls field height and text size */
  size?: SelectSize;
  /** Additional class names for the outermost wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Size maps
// ---------------------------------------------------------------------------

const sizeClasses: Record<SelectSize, { trigger: string; text: string; option: string }> = {
  sm: { trigger: 'px-3 py-1.5', text: 'text-sm', option: 'px-3 py-1.5 text-sm' },
  md: { trigger: 'px-3 py-2.5', text: 'text-sm', option: 'px-3 py-2.5 text-sm' },
  lg: { trigger: 'px-4 py-3',   text: 'text-base', option: 'px-4 py-3 text-base' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Select â€” single-select custom dropdown with keyboard navigation and ARIA.
 *
 * @example
 * <Select
 *   label="Role"
 *   placeholder="Select a role"
 *   options={[{ value: 'admin', label: 'Administrator' }]}
 *   value={role}
 *   onChange={setRole}
 * />
 */
export function Select({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  errorMessage,
  helperText,
  isLoading = false,
  size = 'md',
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const baseId = useId();
  const triggerId = `select-trigger-${baseId}`;
  const listboxId = `select-listbox-${baseId}`;
  const errorId = `select-error-${baseId}`;
  const helperId = `select-helper-${baseId}`;

  const selectedOption = options.find((o) => o.value === value) ?? null;
  const hasError = Boolean(errorMessage);
  const isInteractive = !disabled && !isLoading;

  const sizes = sizeClasses[size];

  // â”€â”€ Open / close helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const openList = useCallback(() => {
    if (!isInteractive) return;
    setIsOpen(true);
    // Pre-focus the currently selected option (or first)
    const idx = selectedOption ? options.findIndex((o) => o.value === selectedOption.value) : 0;
    setFocusedIndex(idx >= 0 ? idx : 0);
  }, [isInteractive, options, selectedOption]);

  const closeList = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const selectOption = useCallback(
    (option: SelectOption) => {
      onChange?.(option.value);
      closeList();
      triggerRef.current?.focus();
    },
    [onChange, closeList]
  );

  // â”€â”€ Outside-click handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeList();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, closeList]);

  // â”€â”€ Scroll focused option into view â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    if (!isOpen || focusedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[focusedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, focusedIndex]);

  // â”€â”€ Keyboard navigation on trigger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          if (focusedIndex >= 0 && options[focusedIndex]) {
            selectOption(options[focusedIndex]);
          } else {
            closeList();
          }
        } else {
          openList();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          openList();
        } else {
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          openList();
        } else {
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;

      case 'Escape':
        e.preventDefault();
        closeList();
        break;

      case 'Home':
        e.preventDefault();
        if (isOpen) setFocusedIndex(0);
        break;

      case 'End':
        e.preventDefault();
        if (isOpen) setFocusedIndex(options.length - 1);
        break;

      case 'Tab':
        // Allow natural tab; close list without preventing default
        closeList();
        break;
    }
  };

  // â”€â”€ Derive described-by ids â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const describedBy = [
    errorMessage ? errorId : null,
    !errorMessage && helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <div ref={containerRef} className={cn('flex flex-col gap-1.5', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={triggerId}
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

      {/* Trigger */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        aria-required={required || undefined}
        aria-disabled={!isInteractive || undefined}
        disabled={!isInteractive}
        onClick={() => (isOpen ? closeList() : openList())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          // Base
          'relative flex w-full items-center justify-between rounded-lg border text-left outline-none transition-all duration-200',
          sizes.trigger,
          sizes.text,
          // Normal border
          !hasError && [
            'border-[#3a4254]',
            'focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]/30',
          ],
          // Open state â€” teal border even without keyboard focus
          isOpen && !hasError && 'border-[#14b8a6] ring-2 ring-[#14b8a6]/30',
          // Error state
          hasError && 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30',
          // Disabled / loading
          !isInteractive && 'cursor-not-allowed opacity-50'
        )}
        style={{ backgroundColor: '#252d48' }}
      >
        {/* Selected label or placeholder */}
        <span
          className={cn(
            'truncate',
            selectedOption ? 'text-gray-900' : 'text-gray-600'
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Right icon: spinner or chevron */}
        <span
          className="ml-2 flex flex-shrink-0 items-center"
          aria-hidden="true"
        >
          {isLoading ? (
            <Loader2
              size={16}
              className="animate-spin"
              style={{ color: '#14b8a6' }}
            />
          ) : (
            <ChevronDown
              size={16}
              className={cn(
                'transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
              style={{ color: '#6b7280' }}
            />
          )}
        </span>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <div className="relative z-50">
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={label ?? placeholder}
            tabIndex={-1}
            className="absolute left-0 right-0 mt-1 overflow-y-auto rounded-lg border py-1 shadow-lg"
            style={{
              backgroundColor: '#1a1f3a',
              borderColor: 'rgba(255,255,255,0.15)',
              maxHeight: '200px',
            }}
          >
            {options.length === 0 ? (
              <li
                className={cn('px-3 py-2 text-sm', sizes.text)}
                style={{ color: '#6b7280' }}
                aria-disabled="true"
              >
                No options available
              </li>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;

                return (
                  <li
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onPointerEnter={() => setFocusedIndex(index)}
                    onClick={() => selectOption(option)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between transition-colors duration-100',
                      sizes.option
                    )}
                    style={{
                      color: isSelected ? '#14b8a6' : '#ffffff',
                      backgroundColor: isFocused
                        ? '#252d48'
                        : isSelected
                        ? 'rgba(20,184,166,0.08)'
                        : 'transparent',
                    }}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check
                        size={14}
                        className="ml-2 flex-shrink-0"
                        aria-hidden="true"
                        style={{ color: '#14b8a6' }}
                      />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-xs text-red-500"
        >
          {errorMessage}
        </p>
      )}

      {/* Helper text (only when no error message) */}
      {helperText && !errorMessage && (
        <p id={helperId} className="text-xs" style={{ color: '#6b7280' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Select;

