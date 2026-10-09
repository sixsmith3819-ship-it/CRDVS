'use client';

import React, { 
  useState, 
  ReactNode, 
  Suspense, 
  lazy, 
  useMemo, 
  useCallback,
  useEffect,
  memo,
  ReactElement
} from 'react';
import { cn } from '@/lib/cn';
import { colors, animations, spacing } from '@/lib/design-tokens';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { AlertCircle } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Tab definition for record detail page
 */
export interface TabDefinition {
  /** Unique identifier for the tab */
  id: 'overview' | 'convictions' | 'verifications' | 'related_records' | 'audit_trail';
  /** Display label for the tab */
  label: string;
  /** Optional badge count for this tab */
  badge?: number;
  /** Tab content component or render function */
  content: ReactNode | (() => ReactNode);
  /** Whether content should be lazy-loaded (default: true) */
  lazy?: boolean;
}

export interface RecordTabsProps {
  /** Array of tab definitions */
  tabs: TabDefinition[];
  /** Default active tab ID */
  defaultTab?: 'overview' | 'convictions' | 'verifications' | 'related_records' | 'audit_trail';
  /** Callback when tab changes */
  onTabChange?: (tabId: string) => void;
  /** Additional className for the container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Error Boundary Component
// ---------------------------------------------------------------------------

interface ErrorBoundaryProps {
  children: ReactNode;
  tabId: string;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class TabErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in tab ${this.props.tabId}:`, error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={cn(
            'p-6 rounded-lg',
            'bg-[rgba(220,38,38,0.1)]',
            'border border-[rgba(220,38,38,0.3)]',
            'flex items-center gap-3'
          )}
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
          <div>
            <p className="font-medium text-[#dc2626]">Error loading tab content</p>
            <p className="text-sm text-[#a0a9c9] mt-1">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Tab Loading Skeleton Component
// ---------------------------------------------------------------------------

const TabLoadingSkeleton = memo(() => (
  <div className="space-y-4 animate-fadeIn" style={{
    animation: `fadeIn 200ms ${animations.easing.smooth} forwards`,
  }}>
    <SkeletonTable columns={4} rows={6} />
  </div>
));

TabLoadingSkeleton.displayName = 'TabLoadingSkeleton';

// ---------------------------------------------------------------------------
// Tab Content Wrapper with Memoization
// ---------------------------------------------------------------------------

interface TabContentWrapperProps {
  content: ReactNode | (() => ReactNode);
  tabId: string;
  isActive: boolean;
  isLazy: boolean;
}

const TabContentWrapper = memo(
  ({ content, tabId, isActive, isLazy }: TabContentWrapperProps) => {
    // Convert content render function to ReactNode if needed
    const renderContent = useCallback(() => {
      if (typeof content === 'function') {
        return content();
      }
      return content;
    }, [content]);

    // If not lazy or active, render immediately
    if (!isLazy) {
      return <>{renderContent()}</>;
    }

    // Lazy loading: render Suspense wrapper with error boundary
    if (isActive) {
      return (
        <TabErrorBoundary tabId={tabId}>
          <Suspense fallback={<TabLoadingSkeleton />}>
            {renderContent()}
          </Suspense>
        </TabErrorBoundary>
      );
    }

    // Not active and lazy: don't render yet
    return null;
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if tab ID, active state, or lazy flag changes
    // Don't re-render if content reference changes
    return (
      prevProps.tabId === nextProps.tabId &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.isLazy === nextProps.isLazy
    );
  }
);

TabContentWrapper.displayName = 'TabContentWrapper';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * RecordTabs — Premium tab navigation system for criminal record detail pages with lazy-loading.
 *
 * Features:
 * - Five main tabs: Overview, Convictions, Verifications, Related Records, Audit Trail
 * - Lazy-loading of tab content (only renders active tab, others on demand)
 * - Content caching: Once loaded, content stays in DOM to prevent re-fetch on re-activation
 * - Loading skeleton while content loads via Suspense
 * - Memoized tab components to prevent unnecessary re-renders
 * - Error boundaries for individual tabs to catch and display errors gracefully
 * - Smooth 200ms fade-in transitions as content loads
 * - ARIA live regions for accessibility announcements
 * - Active state with Aurora gradient underline animation
 * - Badge counters for relevant tabs (showing item counts)
 * - Glassmorphism effects on inactive tab backgrounds
 * - Proper keyboard navigation and accessibility (ARIA labels)
 * - Mobile-responsive tab scrolling with smooth transitions
 */
export function RecordTabs({
  tabs,
  defaultTab = 'overview',
  onTabChange,
  className,
}: RecordTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set([defaultTab]));

  // Get active tab content
  const activeTabDef = tabs.find(t => t.id === activeTab);

  // Determine if tabs should be lazy-loaded (default: true unless explicitly set to false)
  const shouldLazyLoad = useCallback((tab: TabDefinition) => {
    return tab.lazy !== false;
  }, []);

  // Handle tab change with caching
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    
    // Mark tab as loaded so it stays in DOM (cached)
    setLoadedTabs(prev => new Set(prev).add(tabId));
    
    // Announce to screen readers
    const tabLabel = tabs.find(t => t.id === tabId)?.label || tabId;
    announceTabChange(tabLabel);
    
    onTabChange?.(tabId);
  }, [tabs, onTabChange]);

  // Screen reader announcement
  const announceTabChange = useCallback((tabLabel: string) => {
    const announcement = `${tabLabel} tab content is loading`;
    const liveRegion = document.getElementById('tab-live-region');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, tabId: string) => {
    const tabIds = tabs.map(t => t.id);
    const currentIndex = tabIds.indexOf(tabId);

    if (e.key === 'ArrowRight' && currentIndex < tabIds.length - 1) {
      e.preventDefault();
      handleTabChange(tabIds[currentIndex + 1]);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      e.preventDefault();
      handleTabChange(tabIds[currentIndex - 1]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleTabChange(tabIds[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleTabChange(tabIds[tabIds.length - 1]);
    }
  }, [tabs, handleTabChange]);

  return (
    <div className={cn('w-full', className)}>
      {/* ARIA live region for screen reader announcements */}
      <div
        id="tab-live-region"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Tab Navigation Bar */}
      <div
        className={cn(
          'relative border-b',
          'bg-gradient-to-r from-[rgba(20,184,166,0.03)] via-transparent to-[rgba(124,58,237,0.03)]',
          'border-[rgba(255,255,255,0.1)]',
          'overflow-x-auto scrollbar-hide'
        )}
      >
        {/* Tab list */}
        <div
          role="tablist"
          className="flex gap-1 px-0 md:px-6 -mx-6 md:mx-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          aria-label="Record detail tabs"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={cn(
                // Base styles
                'relative flex items-center gap-2 px-4 md:px-5 py-4 md:py-5',
                'text-sm md:text-base font-medium',
                'transition-all duration-200 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]',
                'whitespace-nowrap snap-start',
                'group',

                // Active state
                activeTab === tab.id
                  ? 'text-white'
                  : cn(
                      'text-[#a0a9c9]',
                      'hover:text-white',
                      'hover:bg-[rgba(255,255,255,0.05)]',
                      'hover:backdrop-blur-sm'
                    )
              )}
            >
              {/* Glassmorphism background on hover (inactive tabs) */}
              {activeTab !== tab.id && (
                <div
                  className={cn(
                    'absolute inset-0 rounded-lg',
                    'bg-[rgba(255,255,255,0.06)]',
                    'backdrop-blur-sm',
                    'opacity-0 group-hover:opacity-100',
                    'transition-opacity duration-200 ease-out',
                    'pointer-events-none',
                    'z-0'
                  )}
                />
              )}

              {/* Tab label and badge */}
              <span className="relative z-10">
                {tab.label}
              </span>

              {/* Badge counter */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={cn(
                    'relative z-10',
                    'inline-flex items-center justify-center',
                    'min-w-6 h-6 px-1.5 rounded-full',
                    'text-xs font-semibold',
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#14b8a6] to-[#10b981] text-white'
                      : 'bg-[rgba(20,184,166,0.2)] text-[#14b8a6]'
                  )}
                >
                  {tab.badge}
                </span>
              )}

              {/* Aurora gradient underline for active tab */}
              {activeTab === tab.id && (
                <div
                  className={cn(
                    'absolute bottom-0 left-0 right-0 h-1 rounded-full',
                    'bg-gradient-to-r from-[#7c3aed] via-[#14b8a6] to-[#10b981]',
                    'shadow-[0_0_12px_rgba(20,184,166,0.5)]',
                    'animate-slideDownFadeIn'
                  )}
                  style={{
                    animation: `slideDownFadeIn 200ms ${animations.easing.smooth} forwards`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLoaded = loadedTabs.has(tab.id);
          const isLazy = shouldLazyLoad(tab);

          return (
            <div
              key={tab.id}
              id={`${tab.id}-panel`}
              role="tabpanel"
              aria-labelledby={tab.id}
              hidden={!isActive}
              className={cn(
                'w-full',
                isActive && 'animate-fadeIn'
              )}
              style={
                isActive
                  ? { animation: `fadeIn 200ms ${animations.easing.smooth} forwards` }
                  : {}
              }
            >
              {/* Only render if active or already loaded (cached) */}
              {(isActive || isLoaded) && !isLazy && (
                <TabContentWrapper
                  content={tab.content}
                  tabId={tab.id}
                  isActive={isActive}
                  isLazy={false}
                />
              )}

              {/* Lazy-loaded tabs: render only when active */}
              {(isActive || isLoaded) && isLazy && (
                <TabContentWrapper
                  content={tab.content}
                  tabId={tab.id}
                  isActive={isActive}
                  isLazy={true}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Global animation styles */}
      <style jsx>{`
        @keyframes slideDownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Scrollbar hiding for mobile */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Smooth scrolling behavior */
        .scrollbar-hide {
          scroll-behavior: smooth;
        }

        /* Screen reader only class */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </div>
  );
}

export default RecordTabs;
