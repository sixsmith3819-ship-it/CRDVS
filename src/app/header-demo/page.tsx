// @ts-nocheck
'use client'
import Header from '@/components/layout/Header'

export default function HeaderDemoPage() {
  const sampleUser = {
    name: 'Administrator',
    role: 'admin',
    email: 'admin@crdvs.gov.zw',
    department: 'System Administration'
  }

  const sampleBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Records', href: '/records' },
    { label: 'Criminal Record #CR-2024-001234' }
  ]

  return (
    <div className="min-h-screen bg-primary">
      {/* Header Demo */}
      <Header
        user={sampleUser}
        breadcrumbs={sampleBreadcrumbs}
        onSidebarToggle={() => console.log('Sidebar toggle clicked')}
      />
      
      {/* Content Area - Add top padding to account for fixed header */}
      <main className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface rounded-lg p-8 border border-elevation">
            <h1 className="text-3xl font-bold text-white mb-6">
              Header Component Integration Demo
            </h1>
            
            <div className="space-y-6 text-text-secondary">
              <p>
                The header component has been successfully updated with the new ProfileDropdown component.
                The profile dropdown includes:
              </p>
              
              <ul className="space-y-2 ml-6">
                <li>• Glassmorphic design with backdrop blur effects</li>
                <li>• Aurora gradient accents and hover animations</li>
                <li>• Responsive behavior for mobile and desktop</li>
                <li>• Click outside to close functionality</li>
                <li>• Keyboard navigation (Escape key support)</li>
                <li>• Role-based menu items</li>
                <li>• Online status indicator</li>
                <li>• Smooth open/close animations</li>
              </ul>
              
              <p>
                Click on the profile avatar in the header above to test the dropdown functionality.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-surface rounded-lg p-6 border border-elevation">
              <h2 className="text-xl font-semibold text-white mb-4">
                Design Features
              </h2>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>• Premium glassmorphic card design</li>
                <li>• Aurora gradient avatar backgrounds</li>
                <li>• Smooth scale and fade animations</li>
                <li>• Hover effects with micro-interactions</li>
                <li>• Consistent with dark spatial UI theme</li>
              </ul>
            </div>
            
            <div className="bg-surface rounded-lg p-6 border border-elevation">
              <h2 className="text-xl font-semibold text-white mb-4">
                Technical Features
              </h2>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>• React Portal for proper z-index layering</li>
                <li>• TypeScript interfaces for type safety</li>
                <li>• Accessible ARIA attributes</li>
                <li>• Mobile-responsive design</li>
                <li>• Clean click-outside detection</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}