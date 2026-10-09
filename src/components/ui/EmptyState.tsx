'use client';

import React from 'react';
import {
  Inbox,
  Search,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EmptyStateVariant = 'default' | 'search' | 'error' | 'permission';
export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface EmptyStateSecondaryAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps {
  /** Lucide icon or custom SVG. Overrides the variant default icon. */
  icon?: React.ReactNode;
  /** Main heading */
  title: string;
  /** Supporting text beneath the title */
  description?: string;
  /** Primary CTA button */
  action?: EmptyStateAction;
  /** Secondary text link */
  secondaryAction?: EmptyStateSecondaryAction;
  /**
   * Pre-defined visual preset that sets a default icon and fallback text.
   * Explicit `title`, `description`, and `icon` props always take precedence.
   */
  variant?: EmptyStateVariant;
  /** Controls overall spacing and text size */
  size?: EmptyStateSize;
  className?: string;
}

// ---------------------------------------------------------------------------
// Variant defaults
// ---------------------------------------------------------------------------

const VARIANT_DEFAULTS: Record<
  EmptyStateVariant,
  { icon: React.ReactNode; title: string; description: string }
> = {
  default: {
    icon: <Inbox aria-hidden="true" />,
    title: 'Nothing here yet',
    description: '',
  },
  search: {
    icon: <Search aria-hidden="true" />,
    title: 'No results found',
    description: 'Try different keywords or filters',
  },
  error: {
    icon: <AlertCircle aria-hidden="true" />,
    title: 'Something went wrong',
    description: 'Please try again',
  },
  permission: {
    icon: <Lock aria-hidden="true" />,
    title: 'Access restricted',
    description: "You don't have permission to view this",
  },
};

// ---------------------------------------------------------------------------
// Size class maps
// ---------------------------------------------------------------------------

const sizePadding: Record<EmptyStateSize, string> = {
  sm: 'py-8 px-6',
  md: 'py-12 px-8',
  lg: 'py-16 px-10',
};

const sizeIconWrapper: Record<EmptyStateSize, string> = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const sizeTitleText: Record<EmptyStateSize, string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
};

const sizeDescText: Record<EmptyStateSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const sizeGap: Record<EmptyStateSize, string> = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-5',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * EmptyState
 *
 * A glassmorphic empty state card with an icon, title, optional description,
 * and optional CTA buttons. Comes with four pre-defined variants for common
 * scenarios: default, search, error, and permission.
 *
 * @example
 * <EmptyState
 *   variant="search"
 *   title="No records found"
 *   description="Try adjusting your search filters"
 *   action={{ label: 'Clear filters', onClick: handleClear }}
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  size = 'md',
  className,
}: EmptyStateProps) {
  const defaults = VARIANT_DEFAULTS[variant];

  const resolvedIcon = icon ?? defaults.icon;
  const resolvedDescription = description ?? defaults.description;

  return (
    <div
      role="status"
      aria-label={title}
      className={cn(
        // Glassmorphism card
        'bg-[rgba(255,255,255,0.03)]',
        'border border-[rgba(255,255,255,0.08)]',
        'rounded-xl backdrop-blur-sm',
        // Layout
        'flex flex-col items-center justify-center text-center w-full',
        sizePadding[size],
        sizeGap[size],
        className,
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          sizeIconWrapper[size],
          'flex items-center justify-center',
          'text-[#3a4254]',
          '[&>svg]:w-full [&>svg]:h-full',
        )}
        aria-hidden="true"
      >
        {resolvedIcon}
      </div>

      {/* Text block */}
      <div className="flex flex-col items-center gap-1.5">
        <p
          className={cn(
            sizeTitleText[size],
            'text-[#a0a9c9] font-semibold leading-snug',
          )}
        >
          {title}
        </p>

        {resolvedDescription && (
          <p className={cn(sizeDescText[size], 'text-[#6b7280] max-w-xs leading-relaxed')}>
            {resolvedDescription}
          </p>
        )}
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col items-center gap-2 mt-1">
          {action && (
            <Button
              variant="primary"
              size={size === 'lg' ? 'md' : 'sm'}
              leftIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={cn(
                'text-[#6b7280] hover:text-[#a0a9c9]',
                'text-sm underline-offset-2 hover:underline',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
                'rounded',
              )}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// useEmptyState hook
// ---------------------------------------------------------------------------

/**
 * useEmptyState
 *
 * Returns factory helpers that pre-fill props for the three most common
 * empty-state scenarios. Pass the result directly to `<EmptyState {...props}>`.
 *
 * @example
 * const { emptySearch, emptyError } = useEmptyState();
 *
 * if (!results.length) {
 *   return <EmptyState {...emptySearch({ action: { label: 'Clear', onClick: reset } })} />;
 * }
 */
export function useEmptyState() {
  const emptySearch = (overrides?: Partial<EmptyStateProps>): EmptyStateProps => ({
    variant: 'search',
    title: 'No results found',
    description: 'Try different keywords or filters',
    ...overrides,
  });

  const emptyError = (overrides?: Partial<EmptyStateProps>): EmptyStateProps => ({
    variant: 'error',
    title: 'Something went wrong',
    description: 'Please try again or contact support',
    ...overrides,
  });

  const emptyPermission = (overrides?: Partial<EmptyStateProps>): EmptyStateProps => ({
    variant: 'permission',
    title: 'Access restricted',
    description: "You don't have permission to view this",
    ...overrides,
  });

  return { emptySearch, emptyError, emptyPermission };
}

export default EmptyState;
