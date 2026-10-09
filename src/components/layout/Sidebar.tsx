'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: string
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'home',
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
  },
  {
    label: 'Criminal Records',
    href: '/dashboard/records',
    icon: 'folder',
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
  },
  {
    label: 'Verify Identity',
    href: '/dashboard/verify',
    icon: 'shield',
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
  },
  {
    label: 'Generate Report',
    href: '/dashboard/reports',
    icon: 'document',
    roles: ['administrator', 'police_officer', 'court_officer', 'prison_officer'],
  },
  {
    label: 'Duplicate Flags',
    href: '/dashboard/duplicates',
    icon: 'flag',
    roles: ['administrator', 'police_officer'],
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: 'users',
    roles: ['administrator'],
  },
  {
    label: 'Audit Logs',
    href: '/dashboard/audit',
    icon: 'clock',
    roles: ['administrator'],
  },
]

const icons: Record<string, JSX.Element> = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  folder: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  document: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  flag: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export interface SidebarProps {
  isOpen?: boolean
  isCollapsed?: boolean
  onToggle?: () => void
  className?: string
  userRole?: UserRole
}

export function Sidebar({
  isOpen = false,
  isCollapsed = false,
  onToggle,
  className,
  userRole = 'administrator' // Default to admin for now
}: SidebarProps) {
  const pathname = usePathname()

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter((item) => 
    item.roles.includes(userRole)
  )

  return (
    <aside
      className={cn(
        // Base sidebar styling
        "bg-[#252d48] border-r border-[#3a4254]",
        "flex flex-col h-full",
        
        // Width based on collapsed state
        isCollapsed ? "w-16" : "w-64",
        
        // Responsive behavior
        "transition-all duration-300 ease-in-out",
        
        className
      )}
    >
      {/* Sidebar header */}
      <div className={cn(
        "flex items-center border-b border-[#3a4254]",
        isCollapsed ? "justify-center p-4" : "justify-between p-6"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#14b8a6] to-[#7c3aed] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white">CRDVS</span>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-[#14b8a6] to-[#7c3aed] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        )}

        {/* Collapse toggle button - desktop only */}
        <button
          onClick={onToggle}
          className={cn(
            "hidden lg:flex items-center justify-center",
            "w-6 h-6 rounded-md",
            "text-[#a0a9c9] hover:text-white hover:bg-[#3a4254]",
            "transition-colors duration-200",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg 
            className={cn("w-4 h-4 transition-transform duration-200", isCollapsed && "rotate-180")} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <ul className="space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg relative group",
                    "transition-all duration-300 ease-out",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#252d48]",
                    isCollapsed ? "p-3 justify-center" : "p-3 gap-3",
                    // Active state styling with enhanced Aurora Teal accent
                    isActive ? [
                      "bg-gradient-to-r from-[#14b8a6]/25 via-[#14b8a6]/15 to-transparent",
                      "border-l-4 border-[#14b8a6]",
                      "text-white shadow-lg",
                      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#14b8a6]/10 before:to-transparent before:rounded-lg before:opacity-100"
                    ] : [
                      "text-[#a0a9c9]",
                      "hover:bg-gradient-to-r hover:from-[#3a4254]/80 hover:to-[#3a4254]/40",
                      "hover:border-l-2 hover:border-[#14b8a6]/50",
                      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#14b8a6]/5 before:to-transparent before:rounded-lg before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                    ]
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Glow effect for active items */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#14b8a6]/20 to-transparent blur-sm -z-10" />
                  )}
                  
                  <span className={cn(
                    "flex-shrink-0 relative z-10",
                    "transition-all duration-300 ease-out",
                    isActive ? [
                      "text-[#14b8a6]",
                      "drop-shadow-sm",
                      "transform scale-110"
                    ] : [
                      "text-[#a0a9c9]",
                      "group-hover:text-white",
                      "group-hover:transform group-hover:scale-105",
                      "group-focus:text-[#14b8a6]"
                    ]
                  )}>
                    {icons[item.icon]}
                  </span>
                  
                  {!isCollapsed && (
                    <span className={cn(
                      "font-medium relative z-10",
                      "transition-all duration-300 ease-out",
                      isActive ? [
                        "text-white",
                        "drop-shadow-sm"
                      ] : [
                        "text-[#a0a9c9]", 
                        "group-hover:text-white",
                        "group-focus:text-[#14b8a6]"
                      ]
                    )}>
                      {item.label}
                    </span>
                  )}

                  {/* Active indicator dot for collapsed state */}
                  {isCollapsed && isActive && (
                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#14b8a6] rounded-full animate-pulse-glow" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sidebar footer */}
      <div className={cn(
        "border-t border-[#3a4254] bg-[#1a1f3a]",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {!isCollapsed ? (
          <div className="text-center">
            <p className="text-xs text-[#6b7280]">
              Gweru Magistrates\' Court
            </p>
            <p className="text-xs text-[#6b7280] mt-1">v1.0.0</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#3a4254] flex items-center justify-center">
              <span className="text-xs text-[#a0a9c9] font-medium">GMC</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

