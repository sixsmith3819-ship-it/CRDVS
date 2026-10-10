"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/cn"
import type { UserRole } from "@/types"
import { useEffect, useState } from "react"

interface NavItem {
  label: string
  href: string
  icon: string
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "home",
    roles: ["administrator", "police_officer", "court_officer", "prison_officer"],
  },
  {
    label: "Criminal Records",
    href: "/dashboard/records",
    icon: "folder",
    roles: ["administrator", "police_officer", "court_officer", "prison_officer"],
  },
  {
    label: "Verify Identity",
    href: "/dashboard/verify",
    icon: "shield",
    roles: ["administrator", "police_officer", "court_officer", "prison_officer"],
  },
  {
    label: "Generate Report",
    href: "/dashboard/reports",
    icon: "document",
    roles: ["administrator", "police_officer", "court_officer", "prison_officer"],
  },
  {
    label: "Duplicate Flags",
    href: "/dashboard/duplicates",
    icon: "flag",
    roles: ["administrator", "police_officer"],
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: "users",
    roles: ["administrator"],
  },
  {
    label: "Audit Logs",
    href: "/dashboard/audit",
    icon: "clock",
    roles: ["administrator"],
  },
]

const icons: Record<string, JSX.Element> = {
  home: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  folder: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  document: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  flag: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
      />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
}

export interface SidebarProps {
  isOpen?: boolean
  isCollapsed?: boolean
  onToggle?: () => void
  className?: string
  userRole?: UserRole
  mobileDrawerOpen?: boolean
  onMobileDrawerClose?: () => void
}

export function Sidebar({
  isOpen = false,
  isCollapsed = false,
  onToggle,
  className,
  userRole = "administrator",
  mobileDrawerOpen = false,
  onMobileDrawerClose,
}: SidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          // Base sidebar styling - modern premium look with white background
          "bg-white border-r border-gray-200",
          "flex flex-col h-full",

          // Responsive: hidden on mobile, visible on desktop
          "hidden lg:flex",

          // Width based on collapsed state: expanded 280px, collapsed 80px
          isCollapsed ? "w-20" : "w-70",

          // Smooth transitions
          "transition-all duration-300 ease-in-out",

          className
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex items-center border-b border-gray-200",
            "bg-gradient-to-r from-gray-50 to-white",
            isCollapsed ? "justify-center p-4" : "justify-between p-6"
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-gray-900">CRDVS</span>
                <span className="text-xs text-gray-500">Court System</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          )}

          {/* Collapse toggle button */}
          <button
            onClick={onToggle}
            className={cn(
              "hidden lg:flex items-center justify-center",
              "w-8 h-8 rounded-lg",
              "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              "transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2",
              isCollapsed && "mx-auto"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <svg
              className={cn("w-5 h-5 transition-transform duration-200", isCollapsed && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 overflow-y-auto", isCollapsed ? "p-3" : "p-4")}>
          <ul className="space-y-2">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      // Base styles
                      "flex items-center rounded-lg relative",
                      "transition-all duration-300 ease-out",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",

                      // Layout
                      isCollapsed ? "p-3 justify-center h-14" : "px-4 py-3 h-14 gap-3",

                      // Active state: teal left border, subtle background
                      isActive
                        ? [
                            "bg-cyan-50",
                            "border-l-4 border-cyan-500",
                            "text-cyan-900",
                            "shadow-sm",
                          ]
                        : [
                            "text-gray-700",
                            "hover:bg-gray-50",
                            "hover:border-l-2 hover:border-cyan-300",
                          ]
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {/* Icon */}
                    <span
                      className={cn(
                        "flex-shrink-0 relative z-10",
                        "transition-all duration-300 ease-out",
                        isActive ? ["text-cyan-500", "drop-shadow-sm"] : [
                          "text-gray-600",
                          "group-hover:text-gray-900",
                        ]
                      )}
                    >
                      {icons[item.icon]}
                    </span>

                    {/* Label - hidden when collapsed */}
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "font-medium text-sm relative z-10",
                          "transition-all duration-300 ease-out",
                          isActive ? ["text-cyan-900", "drop-shadow-sm"] : ["text-gray-700"]
                        )}
                      >
                        {item.label}
                      </span>
                    )}

                    {/* Active indicator dot for collapsed state */}
                    {isCollapsed && isActive && (
                      <div className="absolute -right-1.5 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-md" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className={cn("border-t border-gray-200 bg-gray-50", isCollapsed ? "p-3" : "p-4")}>
          {!isCollapsed ? (
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">Gweru Magistrates Court</p>
              <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center border border-cyan-200">
                <span className="text-xs text-cyan-700 font-bold">GMC</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobile && mobileDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-250"
            onClick={onMobileDrawerClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside
            className={cn(
              "fixed left-0 top-0 h-screen",
              "w-[72vw] max-w-xs",
              "bg-white border-r border-gray-200",
              "flex flex-col z-50 lg:hidden",
              "transform transition-transform duration-250 ease-out",
              mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-gray-900">CRDVS</span>
                  <span className="text-xs text-gray-500">Court System</span>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onMobileDrawerClose}
                className={cn(
                  "flex items-center justify-center",
                  "w-8 h-8 rounded-lg",
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  "transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                )}
                aria-label="Close navigation drawer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {visibleNavItems.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onMobileDrawerClose}
                        className={cn(
                          "flex items-center rounded-lg px-4 py-3 h-14 gap-3",
                          "transition-all duration-300 ease-out",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500",
                          isActive
                            ? [
                                "bg-cyan-50",
                                "border-l-4 border-cyan-500",
                                "text-cyan-900",
                                "shadow-sm",
                              ]
                            : [
                                "text-gray-700",
                                "hover:bg-gray-50",
                                "hover:border-l-2 hover:border-cyan-300",
                              ]
                        )}
                      >
                        <span className={cn("flex-shrink-0", isActive ? "text-cyan-500" : "text-gray-600")}>
                          {icons[item.icon]}
                        </span>
                        <span className={cn("font-medium text-sm", isActive ? "text-cyan-900" : "text-gray-700")}>
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Drawer Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium">Gweru Magistrates Court</p>
                <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

export default Sidebar
