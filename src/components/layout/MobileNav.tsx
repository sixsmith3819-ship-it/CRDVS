'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Search, 
  FileText, 
  User, 
  MoreHorizontal,
  Settings,
  BarChart3,
  Shield,
  X
} from 'lucide-react'
import { cn } from '@/lib/cn'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
  isMainItem?: boolean
}

interface MobileNavProps {
  currentPath: string
  user: {
    name: string
    role: string
  }
  onNavigate?: (href: string) => void
}

// Navigation configuration matching the sidebar structure
const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home size={20} />,
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
    isMainItem: true
  },
  {
    label: 'Verify',
    href: '/dashboard/verify',
    icon: <Shield size={20} />,
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
    isMainItem: true
  },
  {
    label: 'Records',
    href: '/dashboard/records',
    icon: <FileText size={20} />,
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
    isMainItem: true
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: <User size={20} />,
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
    isMainItem: true
  },
  // Additional items for drawer
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: <FileText size={20} />,
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
    isMainItem: false
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: <BarChart3 size={20} />,
    roles: ['administrator', 'police_officer'],
    isMainItem: false
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings size={20} />,
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
    isMainItem: false
  }
]

export function MobileNav({ currentPath, user, onNavigate }: MobileNavProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Filter items based on user role
  const visibleItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  )
  
  const mainNavItems = visibleItems.filter(item => item.isMainItem)
  const drawerItems = visibleItems.filter(item => !item.isMainItem)

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setStartY(e.touches[0].clientY)
      setIsDragging(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    
    const currentY = e.touches[0].clientY
    setCurrentY(currentY)
    
    // If swiping up from bottom area, show drawer
    if (startY - currentY > 50 && !isDrawerOpen) {
      setIsDrawerOpen(true)
      setIsDragging(false)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setStartY(0)
    setCurrentY(0)
  }

  // Handle drawer swipe down to close
  const handleDrawerTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setStartY(e.touches[0].clientY)
      setIsDragging(true)
    }
  }

  const handleDrawerTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    
    const currentY = e.touches[0].clientY
    setCurrentY(currentY)
    
    // If swiping down in drawer, close it
    if (currentY - startY > 100 && isDrawerOpen) {
      setIsDrawerOpen(false)
      setIsDragging(false)
    }
  }

  // Handle navigation
  const handleNavigation = (href: string) => {
    if (onNavigate) {
      onNavigate(href)
    }
    setIsDrawerOpen(false)
  }

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen])

  const isActive = (href: string) => {
    return currentPath === href || (href !== '/dashboard' && currentPath.startsWith(href))
  }

  return (
    <>
      {/* Bottom Navigation Bar - Only visible on mobile */}
      <nav 
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 h-16 backdrop-blur-md border-t border-white/15"
        style={{
          background: 'rgba(26, 31, 58, 0.9)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-around h-full px-2">
          {/* Main navigation items */}
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                'flex flex-col items-center justify-center min-w-0 px-1 py-2 rounded-lg relative group',
                'transition-all duration-300 ease-out',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a1f3a]',
                isActive(item.href) ? [
                  'text-[#14b8a6]',
                  'bg-gradient-to-t from-[#14b8a6]/20 to-[#14b8a6]/10',
                  'shadow-lg shadow-[#14b8a6]/25'
                ] : [
                  'text-[#a0a9c9]',
                  'hover:text-white',
                  'hover:bg-gradient-to-t hover:from-white/10 hover:to-white/5'
                ]
              )}
            >
              {/* Glow effect for active items */}
              {isActive(item.href) && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-[#14b8a6]/15 to-transparent blur-sm -z-10" />
              )}
              
              <div className={cn(
                'mb-1 relative z-10',
                'transition-all duration-300 ease-out',
                isActive(item.href) ? [
                  'transform scale-110',
                  'drop-shadow-sm'
                ] : [
                  'group-hover:transform group-hover:scale-105',
                  'group-focus:transform group-focus:scale-105 group-focus:text-[#14b8a6]'
                ]
              )}>
                {item.icon}
              </div>
              <span className={cn(
                'text-xs font-medium truncate max-w-full relative z-10',
                'transition-all duration-300 ease-out',
                isActive(item.href) ? 'drop-shadow-sm' : 'group-focus:text-[#14b8a6]'
              )}>
                {item.label}
              </span>

              {/* Active indicator dot */}
              {isActive(item.href) && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#14b8a6] rounded-full animate-pulse-glow" />
              )}
            </Link>
          ))}
          
          {/* More button to open drawer */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center px-1 py-2 rounded-lg",
              "text-[#a0a9c9] hover:text-white transition-all duration-300 ease-out",
              "hover:bg-gradient-to-t hover:from-white/10 hover:to-white/5",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a1f3a]",
              "group"
            )}
          >
            <div className="mb-1 transition-all duration-300 ease-out group-hover:transform group-hover:scale-105 group-focus:transform group-focus:scale-105">
              <MoreHorizontal size={20} />
            </div>
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Backdrop Overlay */}
      {isDrawerOpen && (
        <div 
          className="sm:hidden fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          style={{
            opacity: isDrawerOpen ? 0.5 : 0
          }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Swipe-up Drawer */}
      <div
        className={cn(
          'sm:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg border-t border-white/15 transition-transform duration-300 ease-out',
          isDrawerOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{
          background: 'rgba(26, 31, 58, 0.95)',
          maxHeight: '70vh'
        }}
        onTouchStart={handleDrawerTouchStart}
        onTouchMove={handleDrawerTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drawer Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-white/30 rounded-full" />
        </div>

        {/* Close Button */}
        <div className="flex justify-between items-center px-6 pb-4">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 text-[#a0a9c9] hover:text-white transition-colors duration-200 rounded-md hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="px-6 pb-8 max-h-[50vh] overflow-y-auto">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 mb-4 rounded-lg bg-white/5 border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-r from-[#7c3aed] to-[#14b8a6] rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-white">{user.name}</div>
              <div className="text-sm text-[#a0a9c9] capitalize">
                {user.role.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* All Navigation Items */}
          <div className="space-y-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg relative group',
                  'transition-all duration-300 ease-out',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f3a]',
                  isActive(item.href) ? [
                    'bg-gradient-to-r from-[#14b8a6]/25 via-[#14b8a6]/15 to-[#14b8a6]/5',
                    'text-[#14b8a6]',
                    'border border-[#14b8a6]/30',
                    'shadow-lg shadow-[#14b8a6]/25'
                  ] : [
                    'text-[#a0a9c9]',
                    'hover:text-white',
                    'hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5',
                    'hover:border hover:border-white/10'
                  ]
                )}
              >
                {/* Glow effect for active items */}
                {isActive(item.href) && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#14b8a6]/20 to-transparent blur-sm -z-10" />
                )}
                
                <div className={cn(
                  'relative z-10',
                  'transition-all duration-300 ease-out',
                  isActive(item.href) ? [
                    'transform scale-110',
                    'drop-shadow-sm'
                  ] : [
                    'group-hover:transform group-hover:scale-105',
                    'group-focus:transform group-focus:scale-105 group-focus:text-[#14b8a6]'
                  ]
                )}>
                  {item.icon}
                </div>
                <span className={cn(
                  'font-medium relative z-10',
                  'transition-all duration-300 ease-out',
                  isActive(item.href) ? 'drop-shadow-sm' : 'group-focus:text-[#14b8a6]'
                )}>
                  {item.label}
                </span>
                {isActive(item.href) && (
                  <div className="ml-auto w-2 h-2 bg-[#14b8a6] rounded-full animate-pulse-glow relative z-10" />
                )}
              </Link>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-[#6b7280] text-center">
              Gweru Magistrates\' Court
            </p>
            <p className="text-xs text-[#6b7280] text-center mt-1">v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  )
}

