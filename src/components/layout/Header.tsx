'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import ProfileDropdown from './ProfileDropdown'

interface Breadcrumb {
  label: string
  href?: string
}

export interface HeaderProps {
  onSidebarToggle?: () => void
  sidebarCollapsed?: boolean
  user?: {
    name: string
    role: string
    email?: string
    department?: string
    avatar?: string
  }
  breadcrumbs?: Breadcrumb[]
  className?: string
}

export function Header({
  onSidebarToggle,
  sidebarCollapsed = false,
  user,
  breadcrumbs = [],
  className
}: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-30",
      "h-16 bg-[#252d48] border-b border-[#3a4254]",
      "flex items-center justify-between px-4 lg:px-6",
      className
    )}>
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-2 rounded-lg text-[#a0a9c9] hover:text-white hover:bg-[#3a4254] transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo for mobile when sidebar is closed */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-[#14b8a6] to-[#7c3aed] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white">CRDVS</span>
        </div>

        {/* Breadcrumb navigation */}
        {breadcrumbs.length > 0 && (
          <nav className="hidden md:flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((breadcrumb, index) => {
              const isActive = breadcrumb.href ? pathname === breadcrumb.href : index === breadcrumbs.length - 1
              return (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <svg className="w-4 h-4 mx-2 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  {breadcrumb.href && !isActive ? (
                    <Link
                      href={breadcrumb.href}
                      className={cn(
                        'px-2 py-1 rounded-md transition-all duration-300 ease-out',
                        'text-[#a0a9c9] hover:text-[#14b8a6] hover:bg-[#14b8a6]/10',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-1 focus-visible:ring-offset-[#252d48]'
                      )}
                    >
                      {breadcrumb.label}
                    </Link>
                  ) : (
                    <span className={cn(
                      'px-2 py-1 rounded-md font-medium',
                      isActive ? [
                        'text-white bg-gradient-to-r from-[#14b8a6]/20 to-transparent',
                        'border border-[#14b8a6]/30',
                        'shadow-sm'
                      ] : 'text-[#a0a9c9]'
                    )}>
                      {breadcrumb.label}
                    </span>
                  )}
                </div>
              )
            })}
          </nav>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications button */}
        <button
          className={cn(
            "p-2 rounded-lg relative transition-all duration-300 ease-out",
            "text-[#a0a9c9] hover:text-white hover:bg-[#3a4254]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#252d48]",
            "hover:transform hover:scale-105"
          )}
          aria-label="Notifications"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a8.95 8.95 0 0 0-.5-8.5A8.95 8.95 0 0 0 8 2C4.69 2 2 4.69 2 8c0 1.09.2 2.13.57 3.09L5 14v3h10z" />
          </svg>
          {/* Notification badge with pulse animation */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#dc2626] rounded-full animate-pulse-glow"></span>
        </button>

        {/* User profile section */}
        {user && <ProfileDropdown user={user} />}
      </div>
    </header>
  )
}

export default Header