'use client'

/**
 * Navigation Test Demo Component
 * 
 * This component demonstrates all the enhanced navigation states and interactions:
 * 1. Active route highlighting with Aurora gradients
 * 2. Smooth hover transitions and scale effects  
 * 3. Focus states for keyboard navigation
 * 4. Glassmorphism effects on mobile drawer
 * 5. Pulse glow animations for active indicators
 */

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

interface NavigationTestDemoProps {
  className?: string
}

export function NavigationTestDemo({ className }: NavigationTestDemoProps) {
  const [activeRoute, setActiveRoute] = useState('/dashboard')
  const [showMobileDemo, setShowMobileDemo] = useState(false)

  const demoNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { label: 'Records', href: '/dashboard/records', icon: '📁' },
    { label: 'Verify', href: '/dashboard/verify', icon: '🛡️' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📄' },
    { label: 'Users', href: '/dashboard/users', icon: '👥' }
  ]

  return (
    <div className={cn("p-8 space-y-8", className)}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Navigation States Demo</h2>
        <p className="text-[#a0a9c9]">
          Interactive demonstration of enhanced navigation highlighting and animations
        </p>
      </div>

      {/* Desktop Sidebar Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Desktop Sidebar Navigation</h3>
        <div className="bg-[#252d48] border border-[#3a4254] rounded-lg p-6 max-w-md">
          <nav className="space-y-1">
            {demoNavItems.map((item) => {
              const isActive = activeRoute === item.href
              return (
                <button
                  key={item.href}
                  onClick={() => setActiveRoute(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg relative group",
                    "transition-all duration-300 ease-out",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#252d48]",
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
                >
                  {/* Glow effect for active items */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#14b8a6]/20 to-transparent blur-sm -z-10" />
                  )}
                  
                  <span className={cn(
                    "flex-shrink-0 relative z-10 text-xl",
                    "transition-all duration-300 ease-out",
                    isActive ? [
                      "drop-shadow-sm",
                      "transform scale-110"
                    ] : [
                      "group-hover:transform group-hover:scale-105",
                      "group-focus:transform group-focus:scale-105"
                    ]
                  )}>
                    {item.icon}
                  </span>
                  
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

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-[#14b8a6] rounded-full animate-pulse-glow relative z-10" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Mobile Bottom Navigation</h3>
        <div className="space-y-4">
          <button
            onClick={() => setShowMobileDemo(!showMobileDemo)}
            className="px-4 py-2 bg-[#14b8a6] text-white rounded-lg hover:bg-[#14b8a6]/90 transition-colors duration-200"
          >
            {showMobileDemo ? 'Hide Mobile Demo' : 'Show Mobile Demo'}
          </button>
          
          {showMobileDemo && (
            <div 
              className="relative bg-[#1a1f3a]/90 border border-[#3a4254] rounded-lg p-4 backdrop-blur-md"
              style={{ width: '320px', height: '80px' }}
            >
              <div className="flex items-center justify-around h-full">
                {demoNavItems.slice(0, 4).map((item) => {
                  const isActive = activeRoute === item.href
                  return (
                    <button
                      key={item.href}
                      onClick={() => setActiveRoute(item.href)}
                      className={cn(
                        'flex flex-col items-center justify-center px-2 py-1 rounded-lg relative group',
                        'transition-all duration-300 ease-out',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a1f3a]',
                        isActive ? [
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
                      {isActive && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-[#14b8a6]/15 to-transparent blur-sm -z-10" />
                      )}
                      
                      <div className={cn(
                        'mb-1 relative z-10 text-lg',
                        'transition-all duration-300 ease-out',
                        isActive ? [
                          'transform scale-110',
                          'drop-shadow-sm'
                        ] : [
                          'group-hover:transform group-hover:scale-105',
                          'group-focus:transform group-focus:scale-105'
                        ]
                      )}>
                        {item.icon}
                      </div>
                      <span className={cn(
                        'text-xs font-medium relative z-10',
                        'transition-all duration-300 ease-out',
                        isActive ? 'drop-shadow-sm' : 'group-focus:text-[#14b8a6]'
                      )}>
                        {item.label}
                      </span>

                      {/* Active indicator dot */}
                      {isActive && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#14b8a6] rounded-full animate-pulse-glow" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Enhanced Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#252d48] border border-[#3a4254] rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">🎨 Visual Enhancements</h4>
            <ul className="text-sm text-[#a0a9c9] space-y-1">
              <li>• Aurora gradient active states</li>
              <li>• Smooth 300ms transitions</li>
              <li>• Glassmorphism effects</li>
              <li>• Glow animations for active items</li>
              <li>• Scale hover effects</li>
            </ul>
          </div>
          
          <div className="bg-[#252d48] border border-[#3a4254] rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">♿ Accessibility</h4>
            <ul className="text-sm text-[#a0a9c9] space-y-1">
              <li>• Focus-visible ring indicators</li>
              <li>• Keyboard navigation support</li>
              <li>• ARIA labels and roles</li>
              <li>• High contrast active states</li>
              <li>• Reduced motion support</li>
            </ul>
          </div>
          
          <div className="bg-[#252d48] border border-[#3a4254] rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">📱 Mobile Optimized</h4>
            <ul className="text-sm text-[#a0a9c9] space-y-1">
              <li>• Bottom navigation with drawer</li>
              <li>• Touch-friendly sizing</li>
              <li>• Swipe gesture support</li>
              <li>• Responsive breakpoints</li>
              <li>• Backdrop blur effects</li>
            </ul>
          </div>
          
          <div className="bg-[#252d48] border border-[#3a4254] rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">⚡ Performance</h4>
            <ul className="text-sm text-[#a0a9c9] space-y-1">
              <li>• CSS transform animations</li>
              <li>• GPU-accelerated effects</li>
              <li>• Debounced transitions</li>
              <li>• Optimized re-renders</li>
              <li>• 60fps smooth animations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="bg-[#252d48] border border-[#3a4254] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Technical Implementation</h3>
        <div className="text-sm text-[#a0a9c9] space-y-2">
          <p><strong className="text-white">usePathname():</strong> Next.js hook for detecting active routes</p>
          <p><strong className="text-white">Aurora Gradients:</strong> Teal (#14b8a6) to Purple (#7c3aed) with varying opacity</p>
          <p><strong className="text-white">Animations:</strong> CSS keyframes with transform properties for GPU acceleration</p>
          <p><strong className="text-white">Focus Management:</strong> focus-visible for keyboard-only focus rings</p>
          <p><strong className="text-white">Glassmorphism:</strong> backdrop-filter: blur() with rgba backgrounds</p>
        </div>
      </div>
    </div>
  )
}

export default NavigationTestDemo