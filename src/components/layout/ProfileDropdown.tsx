'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'
import { logoutAction } from '@/actions/auth'
import { useTheme } from '@/lib/hooks/useTheme'

interface User {
  name: string
  role: string
  email?: string
  department?: string
  avatar?: string
}

interface ProfileDropdownProps {
  user: User
  className?: string
}

export function ProfileDropdown({ user, className }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      return () => document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    setIsOpen(false)
    await logoutAction()
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatRole = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const menuItems = [
    {
      label: 'View Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => {
        setIsOpen(false)
        // Navigate to profile page
        console.log('Navigate to profile')
      }
    },
    {
      label: 'Account Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onClick: () => {
        setIsOpen(false)
        // Navigate to settings
        console.log('Navigate to settings')
      }
    },
    {
      label: 'Switch Role',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m0-4l-4-4" />
        </svg>
      ),
      onClick: () => {
        setIsOpen(false)
        // Switch role functionality
        console.log('Switch role')
      },
      show: user.role === 'admin' || user.role === 'super_admin'
    }
  ]

  // Theme toggle — built separately so it can use live `theme` state
  const themeToggleItem = {
    label: theme === 'dark' ? 'Light mode' : 'Dark mode',
    isThemeToggle: true,
    icon: theme === 'dark' ? (
      /* Sun icon — clicking switches to light */
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ) : (
      /* Moon icon — clicking switches to dark */
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    onClick: () => {
      toggleTheme()
      // Keep dropdown open so the user can see the change immediately
    }
  }

  const dropdownContent = (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={cn(
          "absolute right-0 top-full mt-2 z-50",
          // Responsive width: smaller on mobile, larger on desktop
          "w-72 sm:w-80",
          // Position adjustments for mobile
          "max-w-[calc(100vw-2rem)] sm:max-w-none",
          "transform transition-all duration-200 ease-out origin-top-right",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
      >
        {/* Glass Card Container */}
        <div 
          className="overflow-hidden rounded-lg shadow-xl border"
          style={{
            backgroundColor: colors.glass,
            backdropFilter: 'blur(16px)',
            borderColor: colors.glassBorder,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Profile Header Section */}
          <div 
            className="p-4 sm:p-6 border-b relative overflow-hidden"
            style={{ 
              borderColor: colors.glassBorder,
              background: `linear-gradient(135deg, ${colors.auroraTeal}15, ${colors.auroraPurple}10)`
            }}
          >
            {/* Aurora gradient accent */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(135deg, ${colors.auroraTeal}, ${colors.auroraPurple})`,
                mask: 'linear-gradient(to bottom, transparent 60%, black 100%)'
              }}
            />
            
            <div className="relative flex items-center gap-3 sm:gap-4">
              {/* Avatar */}
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ring-2 ring-opacity-30"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.auroraTeal}, ${colors.auroraPurple})`,
                  ringColor: colors.auroraTeal
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                  />
                ) : (
                  <span 
                    className="text-lg sm:text-xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    {getUserInitials(user.name)}
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold text-base sm:text-lg truncate"
                  style={{ color: colors.textPrimary }}
                >
                  {user.name}
                </h3>
                <p 
                  className="text-xs sm:text-sm truncate"
                  style={{ color: colors.textSecondary }}
                >
                  {formatRole(user.role)}
                </p>
                {user.email && (
                  <p 
                    className="text-xs truncate mt-1 opacity-80 hidden sm:block"
                    style={{ color: colors.textSecondary }}
                  >
                    {user.email}
                  </p>
                )}
                {user.department && (
                  <p 
                    className="text-xs truncate opacity-75 hidden sm:block"
                    style={{ color: colors.textTertiary }}
                  >
                    {user.department}
                  </p>
                )}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.statusSuccess }}
                />
                <span 
                  className="text-xs font-medium"
                  style={{ color: colors.statusSuccess }}
                >
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              if (item.show === false) return null
              
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={cn(
                    "w-full px-4 sm:px-6 py-3 text-left transition-all duration-150",
                    "flex items-center gap-3 group hover:scale-[1.01]"
                  )}
                  style={{
                    color: colors.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.glassHover
                    e.currentTarget.style.color = colors.textPrimary
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.textSecondary
                  }}
                  role="menuitem"
                >
                  <span className="flex-shrink-0 transition-transform duration-150 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Hover indicator */}
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              )
            })}

            {/* Divider */}
            <div 
              className="mx-4 sm:mx-6 my-2 h-px"
              style={{ backgroundColor: colors.glassBorder }}
            />

            {/* Theme Toggle Item */}
            <button
              onClick={themeToggleItem.onClick}
              className={cn(
                "w-full px-4 sm:px-6 py-3 text-left transition-all duration-150",
                "flex items-center gap-3 group hover:scale-[1.01]"
              )}
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.glassHover
                e.currentTarget.style.color = colors.textPrimary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = colors.textSecondary
              }}
              role="menuitem"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="flex-shrink-0 transition-transform duration-150 group-hover:scale-110">
                {themeToggleItem.icon}
              </span>
              <span className="font-medium">{themeToggleItem.label}</span>

              {/* Active indicator — checkmark showing current mode */}
              <span
                className="ml-auto flex items-center gap-1"
                aria-label={`Currently in ${theme} mode`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.auroraTeal }}
                />
              </span>
            </button>

            {/* Divider */}
            <div 
              className="mx-4 sm:mx-6 my-2 h-px"
              style={{ backgroundColor: colors.glassBorder }}
            />

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className={cn(
                "w-full px-4 sm:px-6 py-3 text-left transition-all duration-150",
                "flex items-center gap-3 group hover:scale-[1.01]"
              )}
              style={{ color: colors.statusDanger }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.statusDanger}20`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              role="menuitem"
            >
              <span className="flex-shrink-0 transition-transform duration-150 group-hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
              <span className="font-medium">Sign Out</span>
              
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className={cn("relative", className)}>
      {/* Profile Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
          "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
          "hover:shadow-lg active:scale-95"
        )}
        style={{
          backgroundColor: isOpen ? colors.glassHover : 'transparent',
          focusRingColor: colors.auroraTeal,
          focusRingOffsetColor: colors.primary
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = colors.glass
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        id="user-menu-button"
      >
        {/* User Avatar */}
        <div 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-opacity-50 transition-all duration-200",
            isOpen && "ring-opacity-100 shadow-lg"
          )}
          style={{ 
            background: `linear-gradient(135deg, ${colors.auroraTeal}, ${colors.auroraPurple})`,
            ringColor: colors.auroraTeal
          }}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span 
              className="text-sm font-bold"
              style={{ color: colors.textPrimary }}
            >
              {getUserInitials(user.name)}
            </span>
          )}
        </div>

        {/* User Info - Hidden on small screens */}
        <div className="hidden sm:block text-left">
          <div 
            className="text-sm font-medium truncate max-w-32"
            style={{ color: colors.textPrimary }}
          >
            {user.name}
          </div>
          <div 
            className="text-xs capitalize truncate"
            style={{ color: colors.textSecondary }}
          >
            {formatRole(user.role)}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={cn(
            "w-4 h-4 transition-all duration-200 ease-out",
            isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"
          )}
          style={{ color: colors.textSecondary }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu - Portal to body for proper z-index */}
      {isMounted && createPortal(dropdownContent, document.body)}
    </div>
  )
}

export default ProfileDropdown