# Sidebar Redesign Specification

## Overview
Redesign the navigation sidebar for the CRDVS (Gweru Magistrates' Court) to be larger, more modern, visually attractive, and fully responsive across desktop and mobile devices.

## Current State
- **Location**: src/components/layout/Sidebar.tsx
- **Width**: 256px (w-64)
- **Item Height**: ~40px (p-3)
- **Mobile**: Hidden on smaller screens, hamburger menu in header
- **Styling**: Basic Tailwind, minimal visual hierarchy

## Design Goals
1. **Professional Appearance**: Modern, premium look matching court institution standards
2. **Improved Sizing**: Larger, more spacious layout with better visual hierarchy
3. **Better Touch Targets**: Increased interactive element sizes for accessibility
4. **Collapsible Desktop**: Collapse to compact 72-80px icon-only mode on desktop
5. **Mobile Drawer**: Slide-in drawer from left on mobile (instead of hidden)
6. **Visual Feedback**: Enhanced active state with animated indicators
7. **Accessibility**: Better contrast, icon clarity, and keyboard navigation

## Specifications

### Sidebar Dimensions
- **Expanded Width**: 270-290px (increased from 256px)
- **Collapsed Width**: 72-80px (icon-only mode, desktop only)
- **Item Height**: 50-52px (increased from ~40px)
- **Icon Size**: 21-24px (clear, recognizable)
- **Font Size**: 15-16px for labels (improved readability)
- **Font Weight**: Medium (500) for better hierarchy

### Desktop Behavior
- Sidebar visible on left side of layout
- Collapse toggle button in header or sidebar
- Smooth transition between expanded and collapsed states
- Active item indicator: Left border (4-5px) with aurora teal color (#06B6D4)
- Hover state: Subtle background highlight (gray-50 or similar)
- Navigation items: Clear icon + label when expanded, icon-only when collapsed

### Mobile Behavior (screens < 1024px)
- Sidebar hidden by default
- Hamburger menu button in header (or repurpose existing)
- Click hamburger: Slide-in drawer from left (72% viewport width, max 320px)
- Drawer backdrop: Semi-transparent overlay
- Close drawer: Click overlay, click item, or swipe right
- Full labels visible in drawer (always expanded)
- Smooth slide-in/slide-out animations

### Active State Design
- **Left Border**: 4-5px solid #06B6D4 (aurora teal)
- **Background**: Subtle highlight (e.g., gray-100 or teal-50)
- **Icon Color**: #06B6D4 (aurora teal)
- **Label Color**: Darker gray or teal (maintain contrast)

### Color Palette
- **Primary Background**: White or off-white (#F8FAFC or similar)
- **Item Hover**: Light gray (#F1F5F9)
- **Active Item**: Aurora teal border (#06B6D4) + subtle background
- **Text (Normal)**: Gray-700 or Gray-800
- **Text (Active)**: Aurora teal (#06B6D4)
- **Icons (Normal)**: Gray-600
- **Icons (Active)**: Aurora teal (#06B6D4)
- **Divider**: Light gray (#E2E8F0)

### Navigation Items
Current items (assumed, verify in code):
1. Dashboard
2. Records (if applicable)
3. Reports
4. Users/Admin Panel (role-based visibility)
5. Settings
6. Logout

Each item should have:
- Clear, recognizable icon (use Lucide React or similar)
- Text label (shown expanded, hidden collapsed on desktop)
- Proper spacing between items (12-16px)
- Consistent padding (left: 12-16px, vertical: 12-16px)

### Responsive Breakpoints
- **Mobile**: < 768px — Slide-in drawer only
- **Tablet**: 768px - 1023px — Toggle between sidebar and drawer
- **Desktop**: ≥ 1024px — Full collapsible sidebar

### Animation & Transitions
- Collapse/Expand: 300ms ease-in-out
- Slide-in Drawer: 250ms ease-out
- Hover States: 150ms ease-in-out
- Active State Highlight: Immediate or 100ms

### Accessibility Requirements
- Keyboard navigation (Tab, Enter, Arrow keys)
- ARIA labels for all icons and buttons
- Focus indicators (visible, high contrast)
- Semantic HTML (nav, ul, li, button, a)
- Color not sole indicator of state (use text + icon + border)
- Sufficient contrast ratios (WCAG AA minimum)

## Implementation Notes
- Use React hooks for state management (collapsed state)
- Leverage Tailwind CSS for responsive design
- Consider Framer Motion or Tailwind transitions for animations
- Maintain existing prop interface where possible
- Update component tests
- Ensure role-based navigation items remain functional

## Success Criteria
- [ ] Sidebar appears larger and more visually appealing
- [ ] Collapse/expand functionality works smoothly on desktop
- [ ] Mobile drawer slides in/out without layout shift
- [ ] Active navigation item is clearly indicated
- [ ] All roles see appropriate navigation items
- [ ] Touch targets meet accessibility standards (44px minimum recommended)
- [ ] No layout breaks or visual regressions
- [ ] Component remains responsive and performant
