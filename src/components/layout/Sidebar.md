# Sidebar Component

A responsive navigation sidebar component with glassmorphism design and role-based access control for the Criminal Record Digital Verification System.

## Features

### ✅ Responsive Behavior
- **Desktop (1024px+)**: Fixed left sidebar, 256px width when expanded, 64px when collapsed
- **Tablet (640px-1023px)**: Same as desktop but 200px expanded, 60px collapsed
- **Mobile (< 640px)**: Hidden by default, overlay drawer when opened

### ✅ Navigation Structure
- Dashboard (Home icon)
- Verification Centre (Search icon) 
- Criminal Records (FileText icon)
- Analytics (BarChart3 icon) - admin/police only
- Audit Logs (Shield icon) - admin only
- User Management (Users icon) - admin only
- Settings (Settings icon)

### ✅ Design System Compliance
- **Active route highlighting**: Aurora teal left border (4px) + teal background + white text
- **Inactive routes**: Transparent background, text-secondary color (#a0a9c9)
- **Dark glass styling**: Background #1a1f3a, glassmorphism border
- **Smooth transitions**: 200ms ease-in-out for width changes

### ✅ Accessibility Features
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Semantic HTML structure

## Props Interface

```typescript
interface SidebarProps {
  userRole?: 'admin' | 'police' | 'clerk' | 'guest';
  userName?: string;
  userAvatar?: string;
  className?: string;
}
```

## Usage

```tsx
import { Sidebar } from '@/components/layout/Sidebar';

// Basic usage
<Sidebar />

// With user information
<Sidebar 
  userRole="admin"
  userName="John Doe"
  userAvatar="/path/to/avatar.jpg"
/>
```

## Role-Based Access

The component automatically filters navigation items based on user role:

- **All roles**: Dashboard, Verification Centre, Criminal Records, Settings
- **Admin + Police**: Analytics
- **Admin only**: Audit Logs, User Management

## Responsive Behavior

### Desktop (1024px+)
- Fixed position sidebar
- 256px width when expanded
- 64px width when collapsed
- Toggle button to collapse/expand

### Tablet (640px-1023px)  
- Same behavior as desktop
- 200px width when expanded
- 60px width when collapsed

### Mobile (< 640px)
- Hidden by default
- Hamburger menu button in top-left
- Overlay drawer slides in from left
- Backdrop overlay when open

## Color Palette

Uses the Aurora design system colors:

- **Aurora Teal**: `#14b8a6` (active states, brand color)
- **Primary Dark Blue**: `#1a1f3a` (background)
- **Text Primary**: `#ffffff` (main text)
- **Text Secondary**: `#a0a9c9` (secondary text, inactive items)
- **Glass Border**: `rgba(255,255,255,0.15)` (borders, separators)

## Components Used

- **Lucide React Icons**: Home, Search, FileText, BarChart3, Shield, Users, Settings, Menu, Scale, LogOut, User
- **Next.js**: Link, usePathname
- **Utility**: cn() function for class name merging

## File Location

```
src/components/layout/Sidebar.tsx
```

## Testing

Test page available at `/test-sidebar` to validate:
- Responsive behavior across breakpoints
- Role-based navigation filtering
- Active state highlighting
- Smooth transitions and animations
- Accessibility features

## Implementation Details

### State Management
- `isCollapsed`: Controls expanded/collapsed state on desktop
- `isMobileOpen`: Controls mobile overlay drawer visibility

### Active Route Detection
Uses Next.js `usePathname()` hook to determine current route and highlight active navigation item.

### Keyboard Navigation
- Tab navigation through menu items
- Enter/Space to activate links
- Escape to close mobile drawer

### Performance Optimizations
- Smooth CSS transitions (200ms)
- Proper event handling
- Efficient re-renders with React hooks

This component provides a complete navigation solution that adapts to different screen sizes while maintaining consistent branding and accessibility standards.