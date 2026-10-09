# MobileNav Component

A responsive mobile bottom navigation drawer component for the Criminal Record Digital Verification System (CRDVS).

## Overview

The `MobileNav` component provides a mobile-optimized navigation experience that includes:

- **Bottom Navigation Bar**: Fixed at the bottom on mobile devices (< 640px)
- **Swipe-up Drawer**: Full menu that slides up from the bottom
- **Role-based Navigation**: Shows different menu items based on user role
- **Touch Gestures**: Supports swipe gestures for drawer interaction
- **Accessibility**: Keyboard navigation support (Escape to close)

## Features

### Bottom Navigation Bar
- Fixed position at `bottom: 0` with 64px height
- Dark glass background (`rgba(26, 31, 58, 0.9)`) with backdrop blur
- 4 main navigation items: Dashboard, Verify, Records, Profile
- Icons with labels underneath (text-xs)
- Active item highlighted with Aurora teal color (`#14b8a6`)
- "More" button to access additional menu items

### Swipe-up Drawer
- Triggered by swiping up from bottom nav or tapping "More" button
- Semi-transparent backdrop (`rgba(0, 0, 0, 0.5)`)
- Slides up from bottom with smooth animation (300ms ease-out)
- Maximum height: 70vh
- Contains full navigation menu with user profile section
- Closes on: backdrop tap, swipe down gesture, or Escape key

### Navigation Structure
The component uses the same navigation structure as the sidebar:
- **Dashboard** (`/dashboard`) - All roles
- **Verify** (`/dashboard/verify`) - All roles  
- **Records** (`/dashboard/records`) - All roles
- **Profile** (`/dashboard/profile`) - All roles
- **Reports** (`/dashboard/reports`) - All roles (drawer only)
- **Analytics** (`/dashboard/analytics`) - Admin/Police only (drawer only)
- **Settings** (`/dashboard/settings`) - All roles (drawer only)

### Role-based Filtering
Navigation items are filtered based on user role:
- `administrator` - Access to all features
- `police_officer` - Access to all except some admin features
- `court_officer` - Limited access
- `prison_officer` - Limited access

## Props

```typescript
interface MobileNavProps {
  currentPath: string         // Current route path for active highlighting
  user: {                    // User information for profile and role filtering
    name: string             // User's display name
    role: string             // User's role (administrator, police_officer, etc.)
  }
  onNavigate?: (href: string) => void  // Optional callback when navigation occurs
}
```

## Usage

### Basic Integration

```tsx
import { MobileNav } from '@/components/layout/MobileNav'
import { usePathname } from 'next/navigation'

export function MyLayout() {
  const pathname = usePathname()
  
  return (
    <div className="min-h-screen">
      {/* Your content */}
      <main className="pb-16"> {/* Add bottom padding for nav bar */}
        {/* Page content */}
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav
        currentPath={pathname}
        user={{
          name: 'John Doe',
          role: 'police_officer'
        }}
      />
    </div>
  )
}
```

### With Custom Navigation Handler

```tsx
import { MobileNav } from '@/components/layout/MobileNav'

function handleNavigation(href: string) {
  // Custom logic before navigation
  analytics.track('mobile_nav_click', { href })
  
  // Navigation happens automatically via Next.js Link
}

<MobileNav
  currentPath="/dashboard/records"
  user={{ name: 'Jane Smith', role: 'administrator' }}
  onNavigate={handleNavigation}
/>
```

## Responsive Behavior

- **Mobile (< 640px)**: Component is visible and functional
- **Tablet/Desktop (≥ 640px)**: Component is completely hidden (`sm:hidden`)

The component is designed to work alongside desktop sidebar navigation without conflicts.

## Styling

The component uses the Aurora design system colors:
- **Aurora Teal** (`#14b8a6`) - Active states, primary accents
- **Dark Blue** (`rgba(26, 31, 58, 0.9)`) - Background glass effect
- **White/Gray** - Text colors with proper contrast ratios

## Animations

All animations use CSS transitions for smooth performance:
- **Drawer slide**: `transform: translateY()` with 300ms ease-out
- **Backdrop fade**: `opacity` transition with 300ms duration
- **Active scale**: Icons scale to 110% when active
- **Hover states**: Color transitions with 200ms duration

## Touch Gestures

### Swipe Up (Bottom Nav)
- Detects swipe up gesture from bottom navigation area
- Threshold: 50px upward movement
- Opens the drawer menu

### Swipe Down (Drawer)
- Detects swipe down gesture within drawer
- Threshold: 100px downward movement  
- Closes the drawer menu

## Accessibility

- **Keyboard Navigation**: Escape key closes drawer
- **Focus Management**: Maintains proper focus order
- **Screen Reader Support**: Proper semantic elements and ARIA labels
- **Touch Target Size**: All interactive elements meet 44px minimum
- **Color Contrast**: Meets WCAG AA standards

## Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Touch events**: Full support for touch gestures
- **Backdrop-filter**: Uses backdrop-blur with fallbacks

## Performance

- **Minimal re-renders**: Uses React state efficiently
- **Smooth animations**: Uses transform and opacity for 60fps
- **Memory management**: Proper cleanup of event listeners
- **Bundle size**: Uses tree-shaking friendly imports

## Dependencies

- `react` - Component state and effects
- `next/link` - Navigation routing
- `lucide-react` - Icon components
- `clsx/tailwind-merge` - Utility classes via `cn` helper

## Notes

1. **Body Scroll**: Component prevents body scrolling when drawer is open
2. **Z-index**: Uses z-40 for nav bar, z-50 for drawer to ensure proper layering
3. **Viewport Units**: Uses vh units for drawer height (70vh max)
4. **Safe Areas**: Respects mobile device safe areas and notches

## Future Enhancements

Potential improvements for future versions:
- Haptic feedback on supported devices
- Customizable gesture thresholds
- Animation preferences (reduced motion)
- Badging system for notifications
- Quick action shortcuts