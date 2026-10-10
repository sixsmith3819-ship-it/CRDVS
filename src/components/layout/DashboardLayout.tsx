"use client"

import { useState } from "react"
import { logoutAction } from "@/actions/auth"
import { Sidebar } from "@/components/layout/Sidebar"
import type { Profile } from "@/types"

export function DashboardLayout({
  profile,
  children,
}: {
  profile: Profile
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  async function handleSignOut() {
    await logoutAction()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Spacer for mobile */}
          <div className="flex-1 lg:hidden" />

          {/* User info and logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold text-gray-900">{profile.full_name}</div>
              <div className="text-xs text-gray-500 capitalize">{profile.role.replace(/_/g, " ")}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              title="Sign Out"
              aria-label="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main layout with sidebar */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole={profile.role}
          mobileDrawerOpen={mobileDrawerOpen}
          onMobileDrawerClose={() => setMobileDrawerOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
