/**
 * Example usage of the MobileNav component
 * 
 * This file demonstrates how to integrate the MobileNav component
 * into your layout or page components.
 */

'use client'

import { usePathname } from 'next/navigation'
import { MobileNav } from './MobileNav'

// Example integration in a dashboard layout
export function ExampleMobileNavUsage() {
  const pathname = usePathname()
  
  // Example user data (would typically come from auth context)
  const user = {
    name: 'John Doe',
    role: 'police_officer' // or 'administrator', 'court_officer', 'prison_officer'
  }

  const handleNavigation = (href: string) => {
    // Optional: Add custom navigation logic here
    // e.g., analytics tracking, state updates
    console.log('Navigating to:', href)
  }

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Your main content */}
      <div className="p-4 pb-20"> {/* pb-20 to account for bottom nav */}
        <h1 className="text-2xl font-bold text-white">Dashboard Content</h1>
        <p className="text-gray-400 mt-2">
          The mobile navigation will appear at the bottom on screens smaller than 640px.
          Swipe up from the bottom navigation or tap "More" to open the full menu drawer.
        </p>
      </div>

      {/* Mobile Navigation - automatically hidden on desktop */}
      <MobileNav
        currentPath={pathname}
        user={user}
        onNavigate={handleNavigation}
      />
    </div>
  )
}

// Example integration with existing DashboardLayout
export function IntegrateWithExistingLayout() {
  return (
    <>
      {/* Existing layout components */}
      {/* ... */}
      
      {/* Add MobileNav at the bottom */}
      <MobileNav
        currentPath="/dashboard/records"
        user={{
          name: 'Jane Smith',
          role: 'administrator'
        }}
      />
    </>
  )
}