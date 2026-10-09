'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ErrorBoundaryProps {
  /** Child components to render and catch errors from */
  children: React.ReactNode;
  /** Optional custom fallback UI (receives error and resetErrorBoundary callback) */
  fallback?: (error: Error, resetErrorBoundary: () => void) => React.ReactNode;
  /** Callback invoked when an error is caught (for error reporting, e.g. Sentry) */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Array of values; when any value changes, boundary auto-resets */
  resetKeys?: Array<unknown>;
  /** Optional: custom className for the fallback container */
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ---------------------------------------------------------------------------
// Context for useErrorBoundary hook
// ---------------------------------------------------------------------------

interface ErrorBoundaryContextValue {
  resetBoundary: () => void;
}

const ErrorBoundaryContext = React.createContext<ErrorBoundaryContextValue | null>(null);

/**
 * Hook that returns { resetBoundary } for programmatic reset from within children.
 * Must be used within an ErrorBoundary component tree.
 */
export function useErrorBoundary() {
  const context = React.useContext(ErrorBoundaryContext);
  if (!context) {
    throw new Error('useErrorBoundary must be used within an ErrorBoundary component');
  }
  return context;
}

// ---------------------------------------------------------------------------
// ErrorBoundary Class Component
// ---------------------------------------------------------------------------

/**
 * React class-based error boundary with premium glassmorphism fallback UI.
 * 
 * Features:
 * - Catches render errors from any descendant component tree
 * - Shows a premium glassmorphic fallback UI when an error is caught
 * - Fallback UI includes AlertCircle icon, error message, and reset button
 * - onError prop callback for error reporting (e.g. Sentry)
 * - fallback prop for custom fallback UI
 * - resetKeys prop — array of values; when any value changes, boundary auto-resets
 * - Accessible: role="alert" on fallback container
 * - Styling: dark spatial theme, Aurora red accents, glassmorphism card
 * 
 * @example
 * ```tsx
 * <ErrorBoundary onError={(error) => logToSentry(error)}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Call onError callback if provided (for error reporting)
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    // Auto-reset if resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );
      if (hasResetKeyChanged) {
        this.reset();
      }
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, className } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.reset);
      }

      // Default premium glassmorphic fallback UI
      return (
        <ErrorBoundaryContext.Provider value={{ resetBoundary: this.reset }}>
          <div
            role="alert"
            className={cn(
              'min-h-screen flex items-center justify-center p-4',
              'bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]',
              className
            )}
          >
            <div
              className={cn(
                // Glassmorphism card
                'w-full max-w-lg p-8 rounded-2xl',
                'bg-white/[0.08] backdrop-blur-xl',
                'border border-white/[0.15]',
                'shadow-[0_8px_32px_rgba(0,0,0,0.37)]',
                // Subtle glow effect with danger color
                'shadow-[0_0_40px_rgba(220,38,38,0.15)]',
                // Animation
                'animate-in fade-in-0 zoom-in-95 duration-300'
              )}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full',
                    'bg-gradient-to-br from-red-500 to-red-600',
                    'flex items-center justify-center',
                    'shadow-lg shadow-red-500/30'
                  )}
                >
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-semibold text-white text-center mb-3">
                Something went wrong
              </h2>

              {/* Error message (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div
                  className={cn(
                    'mb-6 p-4 rounded-lg',
                    'bg-red-950/20 border border-red-900/30',
                    'max-h-48 overflow-y-auto'
                  )}
                >
                  <p className="text-sm text-red-300 font-mono break-words">
                    {error.message}
                  </p>
                  {error.stack && (
                    <pre className="mt-2 text-xs text-red-400/70 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  )}
                </div>
              )}

              <p className="text-[#a0a9c9] text-center mb-6">
                We encountered an unexpected error. Please try again or return to the dashboard.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="danger"
                  size="lg"
                  onClick={this.reset}
                  className="flex-1"
                >
                  Try again
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    window.location.href = '/dashboard';
                  }}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </ErrorBoundaryContext.Provider>
      );
    }

    // No error, render children with context provider
    return (
      <ErrorBoundaryContext.Provider value={{ resetBoundary: this.reset }}>
        {children}
      </ErrorBoundaryContext.Provider>
    );
  }
}

// ---------------------------------------------------------------------------
// Higher-Order Component (HOC)
// ---------------------------------------------------------------------------

export interface WithErrorBoundaryOptions {
  /** Optional custom fallback UI */
  fallback?: ErrorBoundaryProps['fallback'];
  /** Callback invoked when an error is caught */
  onError?: ErrorBoundaryProps['onError'];
  /** Array of values; when any value changes, boundary auto-resets */
  resetKeys?: ErrorBoundaryProps['resetKeys'];
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary.
 * 
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   onError: (error) => logToSentry(error),
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithErrorBoundaryOptions
) {
  function WrappedComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={options?.fallback}
        onError={options?.onError}
        resetKeys={options?.resetKeys}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  }

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
