'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { PageTransition } from './PageTransition'

export interface LayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  showHeader?: boolean  
  sidebarCollapsed?: boolean
  onSidebarToggle?: () => void
  user?: { 
    name: string
    role: string
    avatar?: string
  }
  breadcrumbs?: Array<{ 
    label: string
    href?: string 
  }>
}

export function Layout({
  children,
  showSidebar = true,
  showHeader = true,
  sidebarCollapsed: controlledCollapsed,
  onSidebarToggle,
  user,
  breadcrumbs = []
}: LayoutProps) {
  // Internal state for sidebar - can be controlled externally via props
  const [internalSidebarOpen, setInternalSidebarOpen] = useState(false)
  const [internalSidebarCollapsed, setInternalSidebarCollapsed] = useState(false)

  // Determine if we're using controlled or uncontrolled state
  const isControlled = controlledCollapsed !== undefined
  const sidebarCollapsed = isControlled ? controlledCollapsed : internalSidebarCollapsed
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    if (onSidebarToggle) {
      onSidebarToggle()
    } else {
      // Mobile: toggle open/close
      if (window.innerWidth < 1024) {
        setInternalSidebarOpen(!internalSidebarOpen)
      } else {
        // Desktop/Tablet: toggle collapsed/expanded
        setInternalSidebarCollapsed(!internalSidebarCollapsed)
      }
    }
  }

  // Handle mobile overlay click
  const handleOverlayClick = () => {
    setInternalSidebarOpen(false)
  }

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInternalSidebarOpen(false)
      }
    }

    if (internalSidebarOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [internalSidebarOpen])

  // Responsive breakpoint handling
  useEffect(() => {
    const handleResize = () => {
      // Auto-close mobile sidebar when resizing to desktop
      if (window.innerWidth >= 1024) {
        setInternalSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      {showHeader && (
        <Header
          onSidebarToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
          user={user}
          breadcrumbs={breadcrumbs}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <>
            <Sidebar
              isOpen={internalSidebarOpen}
              isCollapsed={sidebarCollapsed}
              onToggle={handleSidebarToggle}
              className={cn(
                // Mobile: overlay behavior
                "lg:relative lg:translate-x-0",
                "fixed inset-y-0 left-0 z-20",
                "transition-transform duration-300 ease-in-out",
                // Mobile positioning - account for header
                showHeader && "top-16 lg:top-0",
                // Mobile visibility
                internalSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              )}
            />

            {/* Mobile overlay */}
            {internalSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-10 lg:hidden"
                onClick={handleOverlayClick}
                aria-hidden="true"
              />
            )}
          </>
        )}

        {/* Main content area */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            // Background and basic styling
            "bg-gray-100",
            "min-h-screen",
            // Top padding for fixed header
            showHeader && "pt-16",
            // Left margin for sidebar on desktop/tablet
            showSidebar && [
              "lg:ml-64", // Default sidebar width (256px)
              sidebarCollapsed && "lg:ml-16" // Collapsed width (64px)
            ],
            // Responsive padding
            "p-4 lg:p-6"
          )}
        >
          <div className="max-w-full">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
