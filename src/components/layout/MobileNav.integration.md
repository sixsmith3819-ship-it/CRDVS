# MobileNav Integration Guide

This guide shows how to integrate the new `MobileNav` component with the existing `DashboardLayout`.

## Current State

The existing `DashboardLayout.tsx` component handles:
- Desktop/tablet sidebar navigation
- Mobile hamburger menu overlay
- User profile and authentication

## Integration Steps

### Step 1: Update DashboardLayout.tsx

Add the MobileNav component to work alongside the existing navigation:

```tsx
// Add import
import { MobileNav } from './MobileNav'

export function DashboardLayout({
  profile,
  children,
}: {
  profile: Profile
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Existing top bar and sidebar code */}
      {/* ... */}

      {/* Main Content - add bottom padding for mobile nav */}
      <main className="flex-1 p-6 lg:p-8 pb-20 sm:pb-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Add MobileNav component */}
      <MobileNav
        currentPath={pathname}
        user={{
          name: profile.full_name,
          role: profile.role
        }}
      />
    </div>
  )
}
```

### Step 2: Update Mobile Sidebar Behavior (Optional)

You may want to hide the existing mobile sidebar when using MobileNav:

```tsx
// Update the sidebar className to hide on mobile when MobileNav is active
<aside
  className={`${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out mt-14 lg:mt-0 hidden sm:block`}
>
  {/* Add hidden sm:block to hide on mobile */}
```

### Step 3: Update Mobile Toggle Button

Hide the hamburger menu button on mobile since MobileNav handles mobile navigation:

```tsx
<button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="sm:hidden md:lg:hidden p-2 rounded-md hover:bg-gray-100" // Updated className
>
  {/* ... existing hamburger icon ... */}
</button>
```

### Step 4: Color Scheme Alignment

To match the Aurora design system, you may want to update the background colors:

```tsx
<div className="min-h-screen bg-[#0a0e27]"> {/* Aurora dark background */}
  {/* Update top bar background */}
  <div className="bg-[#1a1f3a] border-b border-[#3a4254] sticky top-0 z-30">
    {/* ... */}
  </div>
</div>
```

## Complete Updated DashboardLayout

Here's the complete updated version that integrates MobileNav:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/actions/auth'
import { MobileNav } from './MobileNav'
import type { Profile, UserRole } from '@/types'

// ... existing navItems and icons ...

export function DashboardLayout({
  profile,
  children,
}: {
  profile: Profile
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const visibleNavItems = navItems.filter((item) => item.roles.includes(profile.role))

  async function handleSignOut() {
    await logoutAction()
  }

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Top Bar - Updated styling */}
      <div className="bg-[#1a1f3a] border-b border-[#3a4254] sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Hide hamburger on mobile, MobileNav handles mobile navigation */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:lg:block p-2 rounded-md hover:bg-white/10 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#7c3aed] to-[#14b8a6] rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-lg hidden sm:block text-white">CRDVS</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-white">{profile.full_name}</div>
              <div className="text-xs text-gray-400 capitalize">{profile.role.replace('_', ' ')}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Hidden on mobile, MobileNav handles mobile navigation */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-[#1a1f3a] border-r border-[#3a4254] transition-transform duration-200 ease-in-out mt-14 lg:mt-0 hidden sm:block`}
        >
          {/* Existing sidebar content with updated styling */}
          <nav className="p-4 space-y-1">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#14b8a6]/20 text-[#14b8a6] border border-[#14b8a6]/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {icons[item.icon]}
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#3a4254] bg-[#252d48]">
            <p className="text-xs text-gray-400 text-center">
              Zimbabwe Republic Police
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">v1.0.0</p>
          </div>
        </aside>

        {/* Overlay for tablet/desktop sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 hidden sm:lg:block"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Updated padding for mobile nav */}
        <main className="flex-1 p-6 lg:p-8 pb-20 sm:pb-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Navigation - New addition */}
      <MobileNav
        currentPath={pathname}
        user={{
          name: profile.full_name,
          role: profile.role
        }}
      />
    </div>
  )
}
```

## Key Changes Summary

1. **Added MobileNav import and component**
2. **Updated background colors** to match Aurora design system
3. **Hidden existing mobile hamburger menu** - MobileNav handles mobile navigation
4. **Added bottom padding** to main content (`pb-20 sm:pb-6`) for mobile nav space
5. **Updated sidebar styling** to match dark theme
6. **Hidden sidebar on mobile** (`hidden sm:block`) since MobileNav provides mobile navigation

## Testing

After integration, test the following:

1. **Mobile (< 640px)**: 
   - Bottom nav appears and functions
   - Swipe gestures work
   - Drawer opens/closes correctly
   - No conflicts with existing layout

2. **Tablet/Desktop (≥ 640px)**:
   - MobileNav is hidden
   - Existing sidebar works normally
   - No visual regressions

3. **Cross-device**:
   - Responsive behavior works correctly
   - Navigation state doesn't conflict between mobile/desktop