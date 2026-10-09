'use client'

import ProfileDropdown from './ProfileDropdown'

// Demo component to showcase the ProfileDropdown functionality
export function ProfileDropdownDemo() {
  // Sample user data for demonstration
  const sampleUsers = [
    {
      name: 'John Smith',
      role: 'admin',
      email: 'john.smith@crdvs.gov.zw',
      department: 'Criminal Investigation Department'
    },
    {
      name: 'Sarah Johnson',
      role: 'officer',
      email: 'sarah.johnson@crdvs.gov.zw',
      department: 'Records Management'
    },
    {
      name: 'Michael Chen',
      role: 'super_admin',
      email: 'michael.chen@crdvs.gov.zw',
      department: 'System Administration',
      avatar: '/placeholder-avatar.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Profile Dropdown Component Demo
          </h1>
          <p className="text-text-secondary">
            Showcasing the glassmorphic profile dropdown with Aurora gradient accents
          </p>
        </div>

        <div className="bg-surface rounded-lg p-8 border border-elevation">
          <h2 className="text-xl font-semibold text-white mb-6">
            Profile Dropdown Variations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleUsers.map((user, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  {user.role === 'admin' ? 'Admin User' : 
                   user.role === 'super_admin' ? 'Super Admin' : 'Officer'}
                </h3>
                
                {/* Container to simulate header positioning */}
                <div className="bg-primaryDark rounded-lg p-4 flex justify-end">
                  <ProfileDropdown user={user} />
                </div>

                <div className="text-sm text-text-secondary space-y-1">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Department:</strong> {user.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-lg p-8 border border-elevation">
          <h2 className="text-xl font-semibold text-white mb-6">
            Features Demonstrated
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-aurora-teal">
                Visual Features
              </h3>
              <ul className="space-y-2 text-text-secondary">
                <li>• Glassmorphic backdrop blur effect</li>
                <li>• Aurora gradient avatar backgrounds</li>
                <li>• Smooth open/close animations</li>
                <li>• Hover effects on menu items</li>
                <li>• Premium glass card design</li>
                <li>• Online status indicator</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-aurora-teal">
                Interactive Features
              </h3>
              <ul className="space-y-2 text-text-secondary">
                <li>• Click outside to close</li>
                <li>• Escape key to close</li>
                <li>• Role-based menu items</li>
                <li>• Responsive design (mobile/desktop)</li>
                <li>• Portal rendering for proper z-index</li>
                <li>• Accessible ARIA attributes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-glass backdrop-blur-lg rounded-lg p-8 border border-glass-border">
          <h2 className="text-xl font-semibold text-white mb-4">
            Implementation Notes
          </h2>
          <div className="text-text-secondary space-y-3">
            <p>
              The ProfileDropdown component has been integrated into the Header component 
              and follows the premium court UI design system with dark spatial themes and 
              Aurora gradient accents.
            </p>
            <p>
              Key features include glassmorphic effects with backdrop blur, smooth animations, 
              responsive behavior, and comprehensive accessibility support.
            </p>
            <p>
              The dropdown uses React portals for proper z-index layering and includes 
              click-outside-to-close functionality for optimal user experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDropdownDemo