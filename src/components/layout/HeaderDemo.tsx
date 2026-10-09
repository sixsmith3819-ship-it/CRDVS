'use client'

import { Header } from './Header'

// Demo component to show Header usage
export function HeaderDemo() {
  const sampleBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Records', href: '/dashboard/records' },
    { label: 'Record-CR123' }
  ]

  const sampleUser = {
    name: 'John Doe',
    role: 'police_officer',
    canSwitchRole: false
  }

  const handleMenuToggle = () => {
    console.log('Menu toggle clicked')
  }

  const handleSearch = () => {
    console.log('Search clicked')
  }

  const handleProfileAction = (action: 'profile' | 'settings' | 'switch-role' | 'sign-out') => {
    console.log(`Profile action: ${action}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <Header
        breadcrumbs={sampleBreadcrumbs}
        user={sampleUser}
        onMenuToggle={handleMenuToggle}
        notificationCount={5}
        systemStatus="online"
        onSearch={handleSearch}
        onProfileAction={handleProfileAction}
      />
      
      {/* Sample content to show header positioning */}
      <div className="pt-16 p-6 lg:ml-64">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-white mb-4">
            Header Demo Page
          </h1>
          <p className="text-white/80 mb-6">
            This page demonstrates the Header component with breadcrumb navigation,
            user profile dropdown, notifications, and system status.
          </p>
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/15 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Features</h2>
            <ul className="space-y-2 text-white/80">
              <li>• Fixed header with glass morphic background</li>
              <li>• Responsive breadcrumb navigation</li>
              <li>• Mobile menu toggle (hidden on desktop)</li>
              <li>• Global search button</li>
              <li>• Notification bell with badge count</li>
              <li>• System status indicator (online/offline)</li>
              <li>• User profile dropdown with actions</li>
              <li>• Dark Aurora theme design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}