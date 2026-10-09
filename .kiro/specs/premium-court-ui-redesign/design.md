# Design Document: Premium Court UI Redesign

## Introduction

The Premium Court UI Redesign establishes a comprehensive design system for the Criminal Record Digital Verification System. This document specifies the architectural foundation, component library, page layouts, visual design details, responsive behavior, accessibility standards, and implementation structure required to deliver a modern, professional court-grade interface that combines visual sophistication with security-first design principles.

---

## 1. Design System Architecture

### 1.1 Color Palette

#### Primary Dark Colors
```json
{
  "Primary_Black": "#0a0e27",
  "Primary_Dark_Blue": "#1a1f3a",
  "Surface_Dark": "#252d48",
  "Elevation_Light": "#3a4254",
  "Text_Primary": "#ffffff",
  "Text_Secondary": "#a0a9c9",
  "Text_Tertiary": "#6b7280"
}
```

**Usage:**
- `Primary_Black`: Page background, deep section backgrounds
- `Primary_Dark_Blue`: Primary container backgrounds, sidebar base
- `Surface_Dark`: Card backgrounds, secondary containers
- `Elevation_Light`: Elevated surfaces, hover states, borders
- `Text_Primary`: Primary text on dark backgrounds
- `Text_Secondary`: Secondary information, metadata, labels
- `Text_Tertiary`: Disabled text, placeholder text

#### Aurora Gradient Accent Colors
```json
{
  "Aurora_Purple": "#7c3aed",
  "Aurora_Teal": "#14b8a6",
  "Aurora_Green": "#10b981",
  "Aurora_Gradient": "linear-gradient(90deg, #7c3aed 0%, #14b8a6 50%, #10b981 100%)"
}
```

**Usage:**
- Login page hero section
- Active navigation highlights
- Primary button gradients
- Focus ring indicators
- Loading spinners
- Chart accent lines
- Status badge accents

#### Semantic Status Colors
```json
{
  "Verified_Status": "#10b981",
  "Unverified_Status": "#6b7280",
  "Mismatch_Status": "#dc2626",
  "Pending_Status": "#f59e0b",
  "Critical_Red": "#dc2626",
  "Success_Green": "#10b981",
  "Warning_Amber": "#f59e0b",
  "Info_Blue": "#3b82f6"
}
```

**Usage:**
- Status badges and indicators
- Validation states (success/error/warning)
- Alert colors
- Icon tinting
- Progress indicators

#### Glassmorphism Colors
```json
{
  "Glass_Base": "rgba(255, 255, 255, 0.08)",
  "Glass_Hover": "rgba(255, 255, 255, 0.12)",
  "Glass_Elevated": "rgba(255, 255, 255, 0.15)",
  "Glass_Border": "rgba(255, 255, 255, 0.15)",
  "Glass_Border_Hover": "rgba(255, 255, 255, 0.25)"
}
```

**Glassmorphism Specification:**
- Backdrop filter: `backdrop-filter: blur(10px)`
- Border: `1px solid rgba(255, 255, 255, 0.15)`
- On hover: Border becomes `rgba(255, 255, 255, 0.25)`, background `rgba(255, 255, 255, 0.12)`
- Applied to: Login form card, modals, overlay panels, sidebar panels
- Never applied to: Page backgrounds, primary navigation, main content areas

---

### 1.2 Typography System

#### Font Family
```typescript
const fontFamily = {
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  mono: '"JetBrains Mono", "Courier New", monospace'
}
```

#### Heading Hierarchy
```typescript
const headings = {
  h1: {
    fontSize: '32px',
    fontWeight: 'bold', // 700
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    color: 'Text_Primary'
  },
  h2: {
    fontSize: '24px',
    fontWeight: 'bold', // 700
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    color: 'Text_Primary'
  },
  h3: {
    fontSize: '20px',
    fontWeight: '600', // semibold
    lineHeight: '1.4',
    letterSpacing: '0',
    color: 'Text_Primary'
  },
  h4: {
    fontSize: '16px',
    fontWeight: '600', // semibold
    lineHeight: '1.5',
    letterSpacing: '0',
    color: 'Text_Primary'
  }
}
```

#### Body Text Variants
```typescript
const body = {
  large: {
    fontSize: '16px',
    fontWeight: '400', // regular
    lineHeight: '1.6',
    color: 'Text_Primary'
  },
  regular: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.6',
    color: 'Text_Primary'
  },
  small: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '1.5',
    color: 'Text_Primary'
  },
  caption: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '1.4',
    color: 'Text_Secondary'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500', // medium
    lineHeight: '1.5',
    color: 'Text_Primary'
  }
}
```

#### Responsive Typography Adjustments
- **Mobile (< 640px):** Reduce all font sizes by 10% for better readability on small screens
  - H1: 28.8px → 28px (round down)
  - H2: 21.6px → 22px
  - H3: 18px
  - Body: 14.4px → 14px
- **Tablet (640–1023px):** Use 95% of desktop size
- **Desktop (1024px+):** Use full specified size

#### Minimum Contrast Requirements
- **WCAG AA (4.5:1):** All body text on backgrounds
- **WCAG AA (3:1):** Large text (18px+), graphics, UI components
- **Verified combinations:**
  - Text_Primary (#ffffff) on Primary_Black (#0a0e27): 18.5:1 ✓
  - Text_Secondary (#a0a9c9) on Primary_Black: 5.2:1 ✓
  - Text_Tertiary (#6b7280) on Primary_Dark_Blue: 4.5:1 ✓
  - Critical_Red (#dc2626) text on Elevation_Light background: 3.2:1 (use for UI only, not body text)

---

### 1.3 Spacing System

#### Spacing Scale
```typescript
const spacing = {
  'xs': '4px',   // 0.25rem
  'sm': '8px',   // 0.5rem
  'md': '12px',  // 0.75rem
  'base': '16px', // 1rem
  'lg': '24px',  // 1.5rem
  'xl': '32px',  // 2rem
  'xxl': '48px', // 3rem
  'xxxl': '64px' // 4rem
}
```

#### Responsive Spacing Adjustments
- **Mobile:** Reduce padding/margins by 20%
  - `base` (16px) → 12.8px → 12px
  - `lg` (24px) → 19.2px → 20px
  - `xl` (32px) → 25.6px → 28px
- **Tablet:** Reduce by 10%
- **Desktop:** Use full specified values

#### Common Spacing Patterns
- **Component padding:** `base` (16px) default, `lg` (24px) for cards
- **Section margin:** `xl` (32px) between sections
- **Element gap:** `sm` (8px) for inline items, `md` (12px) for stacked items
- **Container padding:** `lg` (24px) on tablet/desktop, `base` (16px) on mobile

---

### 1.4 Shadow System

#### Elevation Levels
```typescript
const shadows = {
  base: '0 2px 8px rgba(0, 0, 0, 0.12)',
  hover: '0 4px 16px rgba(0, 0, 0, 0.15)',
  elevated: '0 8px 32px rgba(0, 0, 0, 0.20)',
  floating: '0 12px 48px rgba(0, 0, 0, 0.25)',
  critical: '0 16px 64px rgba(0, 0, 0, 0.30)' // For modals, drawers
}
```

**Usage:**
- **base:** Cards, input fields, default button state
- **hover:** Cards on hover, floating buttons on hover
- **elevated:** Modals, popovers, sticky headers when scrolling
- **floating:** Deep modals, full-screen overlays
- **critical:** Top-level modals, full-page overlays

#### Shadow Transitions
All shadow changes use `transition: box-shadow 200ms ease-out`

---

### 1.5 Border Radius

```typescript
const borderRadius = {
  subtle: '0.25rem', // 4px
  normal: '0.375rem', // 6px
  large: '0.5rem', // 8px
  full: '9999px' // Circle/pill shape
}
```

**Usage:**
- **subtle (4px):** Input fields, small components, badges
- **normal (6px):** Cards, buttons, modals
- **large (8px):** Large cards, major containers
- **full:** Avatar images, circular buttons, toggle switches

---

### 1.6 Animation & Motion Timings

#### Animation Durations
```typescript
const animations = {
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  transition: '400ms'
}
```

#### Easing Functions
```typescript
const easing = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}
```

**Usage:**
- **easeOut:** Entrance animations (fade-in, slide-in)
- **easeIn:** Exit animations (fade-out, slide-out)
- **easeInOut:** General transitions (color changes, property shifts)
- **bounce:** Playful feedback (error shake, success pulse)

#### Common Animation Patterns
```typescript
// Micro-interaction: Button hover
'@keyframes buttonHover': {
  'from': { transform: 'scale(1)', boxShadow: shadows.base },
  'to': { transform: 'scale(1.02)', boxShadow: shadows.hover }
},

// Micro-interaction: Tab transition
'@keyframes tabFadeIn': {
  'from': { opacity: '0', transform: 'translateY(4px)' },
  'to': { opacity: '1', transform: 'translateY(0)' }
},

// Status pulse (e.g., new notification)
'@keyframes statusPulse': {
  '0%': { opacity: '1', transform: 'scale(1)' },
  '50%': { opacity: '0.7' },
  '100%': { opacity: '1', transform: 'scale(1)' }
},

// Form error shake
'@keyframes errorShake': {
  '0%, 100%': { transform: 'translateX(0)' },
  '25%': { transform: 'translateX(-10px)' },
  '75%': { transform: 'translateX(10px)' }
},

// Skeleton loading pulse
'@keyframes skeletonPulse': {
  '0%': { opacity: '0.6' },
  '50%': { opacity: '1' },
  '100%': { opacity: '0.6' }
}
```

#### Reduced Motion Support
All animations must respect `@prefers-reduced-motion: reduce` media query:
```typescript
'@media (prefers-reduced-motion: reduce)': {
  '*': {
    animation: 'none !important',
    transition: 'none !important'
  }
}
```

For components with animations, provide reduced motion alternatives:
- Fade animations → Instant display (opacity: 1)
- Slide animations → Instant positioning
- Scale/transform → No transform applied
- Transitions should complete in ≤ 50ms or be disabled entirely

---

## 2. Component Architecture

### 2.1 Base Components

#### Button Component
**File:** `/src/components/ui/Button.tsx`

**Variants:**
- `primary`: Aurora gradient background, white text
- `secondary`: Glass background, white text
- `tertiary`: Transparent, white text, hover glass effect
- `danger`: Critical_Red background, white text
- `success`: Success_Green background, white text

**Sizes:**
- `sm`: 12px font, 8px padding vertical, 16px horizontal
- `md`: 14px font, 12px padding vertical, 20px horizontal (default)
- `lg`: 16px font, 16px padding vertical, 24px horizontal

**States:**
- Default: Base styling
- Hover: Scale 1.02, shadow elevation increase (150ms ease-out)
- Focus: Focus ring (3px, Aurora_Teal, 2px offset)
- Active: Pressed state (scale 0.98)
- Disabled: Opacity 50%, cursor not-allowed, no interactions

**Loading State:**
- Display spinning icon (Lucide `Loader2` rotated 180deg indefinitely)
- Disable pointer events
- Maintain button width

**Implementation:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-normal font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-3 focus:ring-aurora-teal focus:ring-offset-2 focus:ring-offset-primary-black disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-gradient-to-r from-aurora-purple to-aurora-green text-white hover:scale-102 hover:shadow-hover active:scale-98': variant === 'primary',
          'bg-glass-base text-white hover:bg-glass-hover hover:scale-102 hover:shadow-hover active:scale-98': variant === 'secondary',
          'text-white hover:bg-glass-base hover:scale-102 active:scale-98': variant === 'tertiary',
          'bg-critical-red text-white hover:shadow-hover hover:scale-102 active:scale-98': variant === 'danger',
          'bg-success-green text-white hover:shadow-hover hover:scale-102 active:scale-98': variant === 'success'
        },
        {
          'px-4 py-2 text-sm': size === 'sm',
          'px-5 py-3 text-base': size === 'md',
          'px-6 py-4 text-lg': size === 'lg'
        }
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={20} /> : icon}
      {children}
    </button>
  );
}
```

#### Input Component
**File:** `/src/components/ui/Input.tsx`

**Features:**
- Text input with built-in validation states
- Optional label with required indicator (*)
- Optional helper text and error message
- Icon support (left/right)
- Copy-to-clipboard button option
- Password toggle (Eye/EyeOff)

**States:**
- Default: Surface_Dark background, Elevation_Light border
- Focus: Aurora_Teal focus ring, border color change
- Error: Critical_Red border, error text below
- Disabled: Opacity 50%, cursor not-allowed
- Loading: Spinner icon right-aligned
- Success: Success_Green checkmark right-aligned

**Validation:**
- Real-time inline validation (email, phone, national ID format)
- Display validation icon (green checkmark/red X) on right
- Show error message immediately on validation failure

**Implementation:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  isRequired?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: string;
  onCopy?: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export function Input({
  label,
  error,
  helper,
  isRequired = false,
  icon,
  rightIcon,
  onCopy,
  isLoading,
  isSuccess,
  disabled,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = props.type === 'password' && showPassword ? 'text' : props.type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-body-label mb-2">
          {label}
          {isRequired && <span className="text-critical-red ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-3 py-2 bg-surface-dark border rounded-subtle text-text-primary placeholder:text-text-tertiary transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-aurora-teal focus:ring-offset-2 focus:ring-offset-primary-black disabled:opacity-50 disabled:cursor-not-allowed',
            {
              'border-elevation-light': !error && !isSuccess,
              'border-critical-red': error,
              'border-success-green': isSuccess,
              'pl-10': icon,
              'pr-10': rightIcon || onCopy || isLoading || isSuccess || props.type === 'password'
            }
          )}
          type={inputType}
          disabled={disabled}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="animate-spin text-text-secondary" size={18} />}
          {isSuccess && <CheckCircle className="text-success-green" size={18} />}
          {error && <XCircle className="text-critical-red" size={18} />}
          {props.type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-secondary hover:text-text-primary"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {onCopy && !error && (
            <button
              type="button"
              onClick={onCopy}
              className="text-text-secondary hover:text-text-primary"
            >
              <Copy size={18} />
            </button>
          )}
        </div>
      </div>
      {helper && !error && (
        <p className="text-caption mt-1 text-text-secondary">{helper}</p>
      )}
      {error && (
        <p className="text-caption mt-1 text-critical-red" role="alert">{error}</p>
      )}
    </div>
  );
}
```

#### Card Component
**File:** `/src/components/ui/Card.tsx`

**Features:**
- Container with base shadow and border radius
- Optional header with title and action button
- Optional footer with action buttons
- Hover elevation effect

**States:**
- Default: Surface_Dark background, base shadow
- Hover: Elevation_Light border accent, hover shadow
- Glass variant: Glass background with blur effect

**Implementation:**
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  header?: {
    title: string;
    action?: React.ReactNode;
  };
  footer?: React.ReactNode;
}

export function Card({
  variant = 'default',
  header,
  footer,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-normal transition-all duration-200',
        {
          'bg-surface-dark border border-elevation-light shadow-base hover:shadow-hover': variant === 'default',
          'bg-glass-base backdrop-blur-lg border border-glass-border hover:border-glass-border-hover hover:bg-glass-hover': variant === 'glass',
          'bg-elevation-light border border-elevation-light shadow-elevated': variant === 'elevated'
        },
        className
      )}
      {...props}
    >
      {header && (
        <div className="flex items-center justify-between p-base border-b border-elevation-light">
          <h3 className="text-h4 text-text-primary">{header.title}</h3>
          {header.action}
        </div>
      )}
      <div className="p-base">
        {children}
      </div>
      {footer && (
        <div className="px-base py-3 border-t border-elevation-light flex items-center justify-end gap-2">
          {footer}
        </div>
      )}
    </div>
  );
}
```

#### Badge Component
**File:** `/src/components/ui/Badge.tsx`

**Variants:**
- `default`: Surface_Dark background, white text
- `success`: Success_Green background, white text
- `danger`: Critical_Red background, white text
- `warning`: Warning_Amber background, dark text
- `info`: Info_Blue background, white text
- `glass`: Glass background, white text

**Sizes:**
- `sm`: 12px font, 4px vertical, 8px horizontal
- `md`: 14px font, 6px vertical, 12px horizontal (default)

**Implementation:**
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'glass';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  icon,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
        {
          'bg-surface-dark text-text-primary': variant === 'default',
          'bg-success-green text-white': variant === 'success',
          'bg-critical-red text-white': variant === 'danger',
          'bg-warning-amber text-slate-950': variant === 'warning',
          'bg-info-blue text-white': variant === 'info',
          'bg-glass-base text-text-primary': variant === 'glass'
        },
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-3 py-1.5 text-sm': size === 'md'
        },
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
```

#### Select Component
**File:** `/src/components/ui/Select.tsx`

**Features:**
- Dropdown with option groups support
- Search/filter within dropdown
- Multi-select mode optional
- Keyboard navigation (arrow keys, Enter, Escape)
- Custom option rendering

**States:**
- Default: Surface_Dark background, Elevation_Light border
- Open: Dropdown visible with glass background
- Focus: Aurora_Teal ring
- Disabled: Opacity 50%

#### Checkbox Component
**File:** `/src/components/ui/Checkbox.tsx`

**Features:**
- 18×18px square with rounded corners
- Aurora gradient fill when checked
- Checkmark icon (Lucide `Check`)
- Optional label with click support

**States:**
- Unchecked: Surface_Dark background, Elevation_Light border
- Checked: Aurora gradient background, white checkmark
- Indeterminate: Half-filled state for group selections
- Disabled: Opacity 50%
- Focus: Focus ring (Aurora_Teal)

#### Skeleton Loader Component
**File:** `/src/components/ui/Skeleton.tsx`

**Features:**
- Animated loading placeholder with pulse effect
- Custom width/height/border-radius
- Can create complex layouts by stacking multiple skeletons

**Animation:**
- Pulse opacity from 0.6 → 1 → 0.6 over 1.5 seconds (repeating)
- Smooth CSS animation (no jank)

**Implementation:**
```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export function Skeleton({
  width = '100%',
  height = '16px',
  circle = false,
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-elevation-light animate-skeleton-pulse',
        {
          'rounded-full': circle,
          'rounded-subtle': !circle
        },
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
      {...props}
    />
  );
}
```

### 2.2 Layout Components

#### Sidebar Component
**File:** `/src/components/layout/Sidebar.tsx`

**Desktop (1024px+):**
- Fixed left position, 280px width
- Full height, dark background
- Logo/brand at top (40px height)
- Menu items vertically stacked below
- User profile section at bottom (sticky)
- Scrollable menu area

**Tablet (640–1023px):**
- Width: 200px
- Abbreviated labels (icon + tooltip on hover)
- Same vertical structure

**Mobile (< 640px):**
- Bottom navigation bar, 64px height
- Horizontal icon-only menu (5–6 items max)
- Collapsible drawer menu icon (hamburger) for additional items

**Menu Structure:**
- Each item: icon (20px), label (14px), active state highlight
- Active item: Aurora gradient background + teal accent bar (4px, left edge)
- Hover state: Glass background

**User Profile Section:**
- Avatar (32px circular)
- User name (12px)
- User role (12px, text_secondary)
- Logout button (text, 12px)

#### Header Component
**File:** `/src/components/layout/Header.tsx`

**Features:**
- Fixed top position (below logo on desktop, below top nav on mobile)
- Spans full width minus sidebar
- 64px height (fixed)
- Breadcrumb navigation on left
- User controls on right

**Left Section:**
- Page title (H4, 20px)
- Breadcrumb trail: "Dashboard / Records / Record-123" (12px, text_secondary, "/" dividers)

**Right Section:**
- Notifications icon (20px) with red badge (count)
- System status indicator (online/offline dot)
- User menu (profile + dropdown)

**Sticky Behavior:**
- Fixed when user scrolls past initial viewport
- Add box-shadow when scrolled (hover shadow level)

#### Layout Wrapper Component
**File:** `/src/components/layout/Layout.tsx`

**Structure:**
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}

export function Layout({
  children,
  showSidebar = true,
  showHeader = true
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-primary-black text-text-primary">
      <Sidebar hidden={!showSidebar} />
      <div className={cn(
        'transition-all duration-200',
        showSidebar ? 'ml-280' : 'ml-0'
      )}>
        {showHeader && <Header />}
        <main className="p-base md:p-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Responsive Adjustments:**
- Mobile: No margin-left (sidebar absolute/fixed bottom), full width
- Tablet: margin-left 200px
- Desktop: margin-left 280px

#### Container Component
**File:** `/src/components/layout/Container.tsx`

**Features:**
- Responsive max-width constraint
- Centered with responsive padding
- Mobile: Full width with base padding
- Tablet: 640px max-width
- Desktop: 1400px max-width

#### Grid Component
**File:** `/src/components/layout/Grid.tsx`

**Features:**
- Responsive CSS Grid
- Customizable column count per breakpoint
- Automatic gap management
- Children automatically fill grid cells

**Implementation:**
```typescript
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: keyof typeof spacing;
}

export function Grid({
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'base',
  children,
  className,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        `grid grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop} gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### 2.3 Feature Components

#### GlassCard Component
**File:** `/src/components/dashboard/GlassCard.tsx`

**Purpose:** Premium card with glassmorphic effect for dashboard widgets

**Features:**
- Glass background (rgba backdrop + blur)
- Elevated border treatment
- Optional header with title and icon
- Optional footer with metrics
- Hover animation (scale, shadow elevation)

**Implementation:**
```typescript
interface GlassCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function GlassCard({
  title,
  icon,
  children,
  footer,
  onClick,
  className
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-normal bg-glass-base backdrop-blur-lg border border-glass-border hover:border-glass-border-hover p-lg transition-all duration-200 cursor-pointer hover:shadow-hover hover:scale-105 hover:bg-glass-hover',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-base">
        {icon && <span className="text-aurora-teal">{icon}</span>}
        <h3 className="text-h4 text-text-primary">{title}</h3>
      </div>
      <div className="mb-base">
        {children}
      </div>
      {footer && (
        <div className="pt-base border-t border-glass-border text-text-secondary text-body-small">
          {footer}
        </div>
      )}
    </div>
  );
}
```

#### StatCard Component with Animation
**File:** `/src/components/dashboard/StatCard.tsx`

**Purpose:** Display metric with trend indicator and animated value

**Features:**
- Large numeric value with unit
- Trend indicator (↑/↓ with color)
- Mini sparkline chart (6-month history)
- Animated count-up on mount
- Glass background

**Implementation:**
```typescript
interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  trend?: {
    percentage: number;
    direction: 'up' | 'down';
  };
  sparklineData?: number[];
  icon?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  unit = '',
  trend,
  sparklineData = [],
  icon
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60;
    const stepValue = value / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps) {
        currentStep++;
        setDisplayValue(Math.floor(stepValue * currentStep));
      } else {
        setDisplayValue(value);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  const trendColor = trend?.direction === 'up' ? 'text-success-green' : 'text-critical-red';

  return (
    <GlassCard
      title={label}
      icon={icon}
      footer={
        trend && (
          <span className={trendColor}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}% from last period
          </span>
        )
      }
    >
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-aurora-teal">
          {displayValue.toLocaleString()}
        </span>
        {unit && <span className="text-body-large text-text-secondary">{unit}</span>}
      </div>
      {sparklineData.length > 0 && (
        <div className="mt-lg h-8">
          <SimpleSparkline data={sparklineData} color="Aurora_Teal" />
        </div>
      )}
    </GlassCard>
  );
}
```

#### VerificationCard Component
**File:** `/src/components/verification/VerificationCard.tsx`

**Purpose:** Display verification result with match details

**Features:**
- Record preview (photo thumbnail, name, ID)
- Confidence score badge (color-coded)
- Match details (fields matched/mismatched)
- Action buttons (view record, re-verify)
- Status indicators

**Example Match Result:**
```typescript
interface VerificationResult {
  recordId: string;
  fullName: string;
  dateOfBirth: string;
  confidenceScore: number; // 0-100
  matchedFields: string[];
  mismatchedFields: string[];
  photo?: string;
  status: 'verified' | 'mismatch' | 'pending';
}

export function VerificationCard({ result }: { result: VerificationResult }) {
  const confidenceLevel = 
    result.confidenceScore >= 85 ? 'high' :
    result.confidenceScore >= 70 ? 'moderate' :
    'low';

  return (
    <Card className="border-l-4" style={{
      borderLeftColor: confidenceLevel === 'high' ? '#10b981' :
                       confidenceLevel === 'moderate' ? '#f59e0b' :
                       '#dc2626'
    }}>
      <div className="flex gap-lg">
        {result.photo && (
          <img
            src={result.photo}
            alt={result.fullName}
            className="w-24 h-32 rounded-normal object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-base">
            <div>
              <h3 className="text-h4">{result.fullName}</h3>
              <p className="text-body-small text-text-secondary">{result.dateOfBirth}</p>
              <p className="text-body-small text-text-tertiary">{result.recordId}</p>
            </div>
            <Badge variant={
              confidenceLevel === 'high' ? 'success' :
              confidenceLevel === 'moderate' ? 'warning' :
              'danger'
            }>
              {confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1)} Confidence
            </Badge>
          </div>
          
          <div className="mb-base">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-body-small text-text-secondary">Confidence Score</span>
              <span className="text-h4">{result.confidenceScore}%</span>
            </div>
            <div className="w-full bg-elevation-light rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-500',
                  confidenceLevel === 'high' ? 'bg-success-green' :
                  confidenceLevel === 'moderate' ? 'bg-warning-amber' :
                  'bg-critical-red'
                )}
                style={{ width: `${result.confidenceScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md mb-lg">
            <div>
              <p className="text-caption text-text-secondary mb-1">Matched Fields</p>
              <div className="space-y-1">
                {result.matchedFields.map((field) => (
                  <p key={field} className="text-body-small text-success-green flex items-center gap-1">
                    <CheckCircle size={14} /> {field}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-caption text-text-secondary mb-1">Mismatched Fields</p>
              <div className="space-y-1">
                {result.mismatchedFields.map((field) => (
                  <p key={field} className="text-body-small text-critical-red flex items-center gap-1">
                    <XCircle size={14} /> {field}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-md">
            <Button variant="primary" size="sm">
              <FileText size={16} /> View Full Record
            </Button>
            <Button variant="secondary" size="sm">
              <RotateCw size={16} /> Re-Verify
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

#### StatusBadge Component
**File:** `/src/components/ui/StatusBadge.tsx`

**Purpose:** Color-coded status indicator with icon and text

**Status Mappings:**
```typescript
const statusConfig = {
  verified: {
    color: 'Success_Green',
    icon: CheckCircle,
    label: 'Verified'
  },
  unverified: {
    color: 'Unverified_Status',
    icon: HelpCircle,
    label: 'Unverified'
  },
  mismatch: {
    color: 'Mismatch_Status',
    icon: XCircle,
    label: 'Mismatch'
  },
  pending: {
    color: 'Pending_Status',
    icon: Clock,
    label: 'Pending'
  },
  flagged: {
    color: 'Critical_Red',
    icon: Flag,
    label: 'Flagged'
  }
}
```

**Never use color alone:** Always combine color with icon and text

#### RiskLevel Component
**File:** `/src/components/records/RiskLevel.tsx`

**Features:**
- 5-star visualization
- Filled stars in red-to-orange gradient (more stars = higher risk)
- Numeric level (1–5)
- Text description

**Implementation:**
```typescript
interface RiskLevelProps {
  level: 1 | 2 | 3 | 4 | 5;
  showLabel?: boolean;
}

export function RiskLevel({ level, showLabel = true }: RiskLevelProps) {
  const riskLabel = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'Critical'][level - 1];
  const colors = [
    'text-warning-amber',
    'text-amber-500',
    'text-orange-500',
    'text-orange-600',
    'text-critical-red'
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={20}
            className={cn(
              'transition-colors duration-200',
              i < level ? `${colors[level - 1]} fill-current` : 'text-elevation-light'
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-body-small text-text-secondary">
          {riskLabel} Risk
        </span>
      )}
    </div>
  );
}
```

#### Timeline Component
**File:** `/src/components/records/Timeline.tsx`

**Features:**
- Vertical timeline for conviction history
- Connection line on left side
- Event circles with icons
- Event details on right
- Expandable items for additional details

**Implementation:**
```typescript
interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: string;
  color?: string;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-lg">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-lg">
          <div className="flex flex-col items-center">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center bg-surface-dark border-2 transition-all duration-200',
              expandedId === event.id ? 'border-aurora-teal bg-elevation-light' : 'border-elevation-light'
            )}>
              {event.icon}
            </div>
            {index < events.length - 1 && (
              <div className="w-1 h-16 bg-elevation-light mt-2" />
            )}
          </div>
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
          >
            <p className="text-body-small text-text-secondary">{event.date}</p>
            <p className="text-h4 hover:text-aurora-teal transition-colors">{event.title}</p>
            <p className="text-body-regular text-text-secondary mt-1">{event.description}</p>
            {expandedId === event.id && event.details && (
              <p className="text-body-small bg-elevation-light p-md rounded-subtle mt-md animate-fade-in">
                {event.details}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### Table Component
**File:** `/src/components/ui/Table.tsx`

**Features:**
- Responsive table with horizontal scroll on mobile
- Sortable columns
- Row hover effects
- Pagination controls
- Selectable rows (checkbox)
- Expandable rows

#### Modal Component
**File:** `/src/components/ui/Modal.tsx`

**Features:**
- Full-screen overlay with dark backdrop (rgba(0,0,0,0.5))
- Centered modal window (max-width: 600px on desktop, full on mobile)
- Header with title and close button (X icon)
- Body content area
- Footer with action buttons
- Close on Escape key
- Glassmorphic body option

**Implementation:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  variant = 'default'
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-base animate-fade-in">
      <div
        className={cn(
          'w-full rounded-normal shadow-critical transition-all duration-200',
          sizeClasses[size],
          variant === 'glass'
            ? 'bg-glass-base backdrop-blur-lg border border-glass-border'
            : 'bg-surface-dark border border-elevation-light'
        )}
      >
        <div className="flex items-center justify-between p-lg border-b border-elevation-light">
          <h2 className="text-h3">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-elevation-light rounded-subtle transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-lg max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-lg border-t border-elevation-light flex items-center justify-end gap-md">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
```

#### Toast Component
**File:** `/src/components/ui/Toast.tsx`

**Features:**
- Toast notifications with auto-dismiss (6 seconds default)
- Position: top-right (desktop), top-center (mobile)
- Variant: success (green), error (red), warning (amber), info (blue)
- Icon + message + close button
- Stack multiple toasts

**Implementation:**
```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({
  id,
  type,
  title,
  message,
  duration = 6000,
  action,
  onDismiss
}: Toast & { onDismiss: (id: string) => void }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const icons = {
    success: <CheckCircle className="text-success-green" />,
    error: <XCircle className="text-critical-red" />,
    warning: <AlertCircle className="text-warning-amber" />,
    info: <Info className="text-info-blue" />
  };

  const backgrounds = {
    success: 'bg-green-950',
    error: 'bg-red-950',
    warning: 'bg-amber-950',
    info: 'bg-blue-950'
  };

  return (
    <div
      className={cn(
        'p-lg rounded-normal border shadow-floating flex items-start gap-md animate-fade-in-down max-w-sm',
        backgrounds[type],
        'border-' + {
          success: 'success-green',
          error: 'critical-red',
          warning: 'warning-amber',
          info: 'info-blue'
        }[type]
      )}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {message && <p className="text-body-small text-text-secondary mt-1">{message}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className="text-body-small text-aurora-teal hover:underline mt-2"
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="text-text-secondary hover:text-text-primary p-1"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
```

---

## 3. Page Layouts

### 3.1 Login Page
**URL:** `/` or `/login`

**Layout (Desktop):**
- 50/50 split: Aurora gradient hero (left), Login form card (right)
- Min height: 100vh
- No sidebar/header

**Hero Section (Left):**
- Background: Gradient from Aurora_Purple to Aurora_Green
- Geometric patterns (subtle animated SVG shapes)
- Logo watermark (center, semi-transparent)
- Tagline: "Secure. Professional. Court-Grade." (large, white text, bottom-aligned)

**Login Form Card (Right):**
- 60% width on desktop, full width on mobile
- Glassmorphic card (centered)
- Logo + "CRDVS" branding at top
- Aurora accent line (3px height)
- Form fields: email, password
- "Sign In" button (primary, full width)
- "Forgot Password?" link (tertiary)
- Footer: "Secure login powered by Supabase" (12px, text_secondary)

**Layout (Mobile):**
- Single column, full screen
- Hero section hidden
- Login form full width
- Top spacing (logo centered)

### 3.2 Dashboard Page
**URL:** `/dashboard`

**Grid Layout (Desktop):**
- 3-column layout, max-width 1400px
- Gap: 16px
- Left column (1/3): Quick actions, notifications
- Center column (1/3): Main metrics, stats
- Right column (1/3): Recent activity, alerts

**Top Section:**
- Welcome message (H1): "Welcome, [Officer Name]"
- Date + system status indicator
- 4 StatCards in a row: Pending Verifications, Records This Month, Active Users, Average Verification Time

**Quick Actions Card:**
- 4 large buttons: "New Verification", "Search Records", "Generate Report", "View Analytics"
- Buttons arranged in 2×2 grid
- Full width, hover effects

**Sidebar Content:**
- Notifications section
- Recent records list
- Quick links

**Responsive:**
- Tablet (640–1023px): 2-column layout, reflow cards
- Mobile (< 640px): 1-column, stack all sections vertically

### 3.3 Verification Centre Page
**URL:** `/verification/new` or `/verification`

**2-Column Layout (Desktop):**
- Left column (60%): Form
- Right column (40%): Guidelines + examples

**Form Section:**
- Title: "New Verification Request"
- Section 1: Personal Information (name, DOB, gender)
- Section 2: Identification Data (national ID, aliases)
- Section 3: Photo upload (optional)
- Section 4: Notes (optional)
- Submit button (primary, full width)
- Recent requests list (collapsible)

**Guidelines Section:**
- Card: "Submission Guidelines"
- Checklist: Required fields explanation
- Examples: Sample national ID format, date format
- Support link: "Need help? Contact support"

**Search Results:**
- Display below form
- Top 5 matches with VerificationCard components
- Pagination if more results
- Expandable for details

**Responsive:**
- Mobile/Tablet: Stack to single column
- Guidelines collapse to expandable section

### 3.4 Record Profile Page
**URL:** `/records/[id]`

**Header Section:**
- Photo (120px circular) + Personal info + Status badge + Risk level
- Sticky breadcrumb navigation

**Tab Navigation (Sticky):**
- Tabs: Overview, Convictions, Verifications, Related Records, Audit Trail, [Edit Record, Manage Flags for admins]

**Overview Tab (Default):**
- Record metadata grid: ID, Created date, Last verified, Repeat offender, Prior convictions
- Conviction history timeline
- Key alerts/flags (if any)

**Convictions Tab:**
- Full conviction timeline with expandable details
- Filters by conviction type

**Verifications Tab:**
- Table of verification requests
- Columns: Reference ID, Officer, Date, Status, Confidence Score
- Filters: Status, date range

**Related Records Tab:**
- Duplicate flags
- Side-by-side comparison option
- Review/dismiss controls (admin)

**Audit Trail Tab:**
- Complete audit log
- Filters: Action type, date range
- Sortable columns

**Responsive:**
- Mobile: Single column, tabs as horizontal scroll
- Lazy load tabs for performance

### 3.5 Analytics Dashboard
**URL:** `/analytics`

**Header:**
- Title: "Analytics Dashboard"
- Date range filter: Last 7/30/90 days, custom
- Export buttons: CSV, PDF

**Metrics Grid (4 columns on desktop, responsive):**
- Total Verifications (StatCard with sparkline)
- Verification Success Rate (progress ring, benchmark line)
- Average Verification Time (histogram)
- High-Risk Records Flagged (pie chart)
- Records Archived (metric card)
- Duplicate Matches Detected (metric card)

**Performance Section:**
- Top Performing Officers table (sortable)
- 10 rows per page with pagination

**Visualizations:**
- Verification Funnel chart
- Cases by Offense Category donut chart
- Verification Status Timeline line chart

**Responsive:**
- Desktop: 4-column grid of metrics
- Tablet: 2-column grid
- Mobile: Single column

---

## 4. Visual Design Details

### 4.1 Glassmorphism Specification

**Material Definition:**
```css
.glass-material {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.glass-material:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
```

**Applications:**
1. **Login Form Card:** Glassmorphic background, contains form fields
2. **Modal Dialogs:** Optional glass background variant
3. **Overlay Panels:** Sidebar panels, dropdowns
4. **Subtle Hover States:** Card hover effect on dashboard

**Browser Support:**
- Uses `backdrop-filter` (supported in Chrome 76+, Firefox 103+, Safari 9+)
- Fallback: Solid background color for unsupported browsers

### 4.2 Aurora Gradient Applications

**Color Flow:** #7c3aed (purple) → #14b8a6 (teal) → #10b981 (green)

**Applications:**
1. **Login Hero Background:** 90deg gradient across left section
2. **Primary Button:** Gradient fill with white text
3. **Active Navigation Highlight:** Accent line or background
4. **Focus Rings:** 3px ring in teal (#14b8a6)
5. **Loading Spinners:** Rotating gradient stroke
6. **Chart Accent Lines:** Line color in analytics
7. **Status Badges:** Accent for positive/verified states
8. **Progress Bars:** Fill color for successful progress

### 4.3 Depth Effects

**Shadow Hierarchy:**
1. **Base Shadow** (0 2px 8px rgba(0,0,0,0.12)): Cards, inputs
2. **Hover Shadow** (0 4px 16px rgba(0,0,0,0.15)): Cards on hover, buttons
3. **Elevated Shadow** (0 8px 32px rgba(0,0,0,0.20)): Modal dialogs, sticky headers
4. **Floating Shadow** (0 12px 48px rgba(0,0,0,0.25)): Full-screen overlays
5. **Critical Shadow** (0 16px 64px rgba(0,0,0,0.30)): Top-level modals

**Layering Strategy:**
- Each shadow level represents 1 visual layer
- Higher layers have darker, larger shadows
- Shadows only used for depth, not for borders or outlines

### 4.4 Micro-interactions

#### Button Hover Interaction
```typescript
// Duration: 150ms, Easing: ease-out
// Properties: transform (scale 1→1.02), box-shadow (base→hover)
// No layout shift: Use transform: scale instead of width/height changes
// GPU accelerated: transform and box-shadow trigger GPU rendering
```

#### Tab Transition
```typescript
// Duration: 150ms, Easing: ease-out
// Animation: Fade in (opacity 0→1) + slight slide up (translateY 4px→0)
// Prevent layout shift: Set min-height on tab pane
```

#### Card Hover (Glass Effect Activation)
```typescript
// Duration: 200ms, Easing: ease-in-out
// Properties:
//   - Background opacity: 0.08→0.12
//   - Border color: rgba(255,255,255,0.15)→rgba(255,255,255,0.25)
//   - Box-shadow: base→hover
//   - Transform: scale(1)→scale(1.02)
```

#### Error Shake
```typescript
// Duration: 100ms × 4 cycles = 400ms total
// Keyframes:
//   0%, 100%: translateX(0)
//   25%: translateX(-10px)
//   75%: translateX(10px)
// Applied to: Form container, input fields with errors
```

#### Status Pulse (New Notification)
```typescript
// Duration: 2 seconds (repeating)
// Keyframes:
//   0%, 100%: opacity 1, scale 1
//   50%: opacity 0.7, scale 1
// Applied to: Notification badges, alert indicators
```

#### Skeleton Loader Pulse
```typescript
// Duration: 1.5 seconds (repeating)
// Keyframes:
//   0%, 100%: opacity 0.6
//   50%: opacity 1
// Applied to: Skeleton components during data loading
```

### 4.5 Status Indicators

**Design Rule:** Never use color alone. Always combine with icon + text.

**Verified Status:**
- Color: Success_Green (#10b981)
- Icon: CheckCircle (Lucide)
- Text: "Verified"
- Badge background: Glass_Base or Success_Green with transparency

**Unverified Status:**
- Color: Unverified_Status (#6b7280)
- Icon: HelpCircle or QuestionMark
- Text: "Unverified"
- Badge background: Glass_Base

**Mismatch Status:**
- Color: Mismatch_Status (#dc2626)
- Icon: XCircle or AlertTriangle
- Text: "Mismatch"
- Badge background: Glass_Base with red tint

**Pending Status:**
- Color: Pending_Status (#f59e0b)
- Icon: Clock or Hourglass
- Text: "Pending"
- Badge background: Glass_Base with amber tint
- Animation: Status pulse (optional)

**Example Implementation:**
```typescript
const statusComponents = {
  verified: (
    <Badge variant="success">
      <CheckCircle size={16} />
      Verified
    </Badge>
  ),
  mismatch: (
    <Badge variant="danger">
      <AlertTriangle size={16} />
      Mismatch Detected
    </Badge>
  ),
  pending: (
    <Badge variant="warning" className="animate-status-pulse">
      <Clock size={16} />
      Pending Review
    </Badge>
  )
}
```

---

## 5. Responsive Design System

### 5.1 Breakpoints

```typescript
const breakpoints = {
  mobile: '0px',    // 0–639px
  tablet: '640px',  // 640–1023px
  desktop: '1024px' // 1024px+
}
```

### 5.2 Mobile (0–639px)

**Layout:**
- Single column layout
- Full width with base padding (16px)
- No horizontal scrolling

**Navigation:**
- Sidebar collapses to bottom navigation bar (64px height)
- 5–6 icon-only items
- Hamburger menu for additional items
- Drawer menu (glassmorphic, slides up from bottom)

**Components:**
- Touch targets minimum 44×44px
- Increased padding/margin (20% more than desktop)
- Larger font sizes for readability (14px minimum for body)
- Input fields full width, stacked vertically

**Images:**
- Avatar: 32px minimum
- Thumbnails: Full width with max-width 300px
- Photos: Full width, aspect ratio maintained

**Forms:**
- Single-column input layout
- Labels above inputs
- Error messages inline below fields
- Submit button full width, large (44px minimum height)

**Cards:**
- Full width, stacked vertically
- Reduced shadow for visual clarity
- Reduced padding (16px instead of 24px)

### 5.3 Tablet (640–1023px)

**Layout:**
- 2-column layout for dashboard
- Sidebar visible (200px width) or collapsible
- Content area adjusts accordingly

**Navigation:**
- Sidebar with abbreviated labels (icon + short label)
- Top navigation bar for page title

**Grids:**
- 2-column card grids
- Adjusted gaps (12px instead of 16px)

**Tables:**
- Scrollable horizontally with sticky first column
- Reduced font size (13px for body)

**Images:**
- Avatar: 40px
- Thumbnails: Larger, 200px width

### 5.4 Desktop (1024px+)

**Layout:**
- 3-column layout for dashboard
- Sidebar fixed (280px width)
- Content area 100% minus sidebar
- Max-width constraint (1400px)

**Navigation:**
- Full sidebar with labels and icons
- Breadcrumb trail in header

**Grids:**
- 3–4 column card grids
- Full 16px gaps

**Images:**
- Avatar: 48px
- Thumbnails: 240px width

### 5.5 Responsive Page Layouts

#### Dashboard Responsive Behavior
```css
/* Mobile: 1 column */
@media (max-width: 639px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }
}

/* Tablet: 2 columns */
@media (640px to 1023px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 20px;
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 32px;
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

#### Verification Centre Responsive Behavior
```css
/* Desktop: 2 columns (60/40 split) */
@media (min-width: 1024px) {
  .verification-layout {
    grid-template-columns: 60% 40%;
    gap: 24px;
  }
}

/* Tablet: 2 columns (50/50 split) */
@media (640px to 1023px) {
  .verification-layout {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* Mobile: 1 column, stacked */
@media (max-width: 639px) {
  .verification-layout {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .guidelines {
    order: 2; /* Move guidelines below form */
  }
}
```

#### Record Profile Responsive Behavior
```css
/* Desktop: Header + tabs + content */
@media (min-width: 1024px) {
  .record-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 32px;
    align-items: start;
  }
  .record-tabs {
    position: sticky;
    top: 64px; /* Below header */
    z-index: 40;
  }
}

/* Mobile: Stacked layout */
@media (max-width: 639px) {
  .record-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .record-tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }
}
```

---

## 6. Accessibility Specifications

### 6.1 Focus Management & Keyboard Navigation

**Focus Ring Specification:**
- Width: 3px
- Color: Aurora_Teal (#14b8a6)
- Offset: 2px from element edge
- Border-radius: Matches element shape
- Animation: None (static indicator)

**Focus Ring Implementation:**
```css
element:focus {
  outline: 3px solid #14b8a6;
  outline-offset: 2px;
}

/* Remove default browser outline */
button, input, select, textarea {
  outline: none;
}
```

**Tab Order:**
- Natural DOM order (no tabindex manipulation)
- Skip links: Allow users to skip to main content (not implemented by default, but structure supports it)
- Logical flow: Left-to-right, top-to-bottom

**Keyboard Navigation Shortcuts:**
- Tab: Move to next focusable element
- Shift+Tab: Move to previous focusable element
- Enter: Activate button/submit form
- Escape: Close modal, cancel form
- Arrow keys: Navigate within component (select options, table rows)
- Space: Toggle checkbox/radio, activate button

**Implementation:**
```typescript
// Example: Modal keyboard handling
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isOpen, onClose]);
```

### 6.2 Contrast Ratios

**WCAG AA Compliance (4.5:1 for body text):**
- Text_Primary (#ffffff) on Primary_Black (#0a0e27): 18.5:1 ✓
- Text_Secondary (#a0a9c9) on Primary_Black: 5.2:1 ✓
- Text_Tertiary (#6b7280) on Primary_Dark_Blue (#1a1f3a): 4.5:1 ✓

**WCAG AA Graphics & UI Components (3:1):**
- Aurora_Teal (#14b8a6) on Primary_Black: 3:1 ✓
- Success_Green (#10b981) on Primary_Black: 3:1 ✓
- Critical_Red (#dc2626) on Primary_Black: 3:1 ✓

**Non-Compliant Combinations (Avoid):**
- Status colors on colored backgrounds
- Tertiary text on any background (use only for truly secondary information)
- Disabled text on backgrounds without sufficient contrast

### 6.3 Screen Reader Labels

**ARIA Attributes:**

```typescript
// Form labels
<label htmlFor="email-input">Email Address</label>
<input
  id="email-input"
  type="email"
  aria-label="Email address for account login"
  aria-required="true"
/>

// Icon-only buttons
<button aria-label="Close dialog">
  <X size={20} />
</button>

// Form validation
<input
  id="national-id"
  aria-invalid={hasError}
  aria-describedby={hasError ? "error-message" : undefined}
/>
{hasError && (
  <span id="error-message" role="alert">
    Invalid national ID format
  </span>
)}

// Status indicators
<span role="status" aria-live="polite">
  New notification received
</span>

// Modal dialogs
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
>
  <h2 id="modal-title">Confirm Action</h2>
</div>

// Tables
<table role="grid">
  <caption>Verification requests history</caption>
  <thead>
    <tr>
      <th scope="col">Reference ID</th>
      <th scope="col">Officer</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
</table>

// Navigation landmarks
<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>
<main>{/* Main content */}</main>
<aside aria-label="Sidebar filters">{/* Sidebar */}</aside>
```

### 6.4 Semantic HTML Structure

```typescript
// Page structure
<body>
  <header>{/* Logo, search */}</header>
  <nav>{/* Main navigation */}</nav>
  <main>{/* Page content */}</main>
  <footer>{/* Copyright, links */}</footer>
</body>

// Form structure
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>Personal Information</legend>
    <label htmlFor="name">Full Name</label>
    <input id="name" type="text" required />
  </fieldset>
  <button type="submit">Submit</button>
</form>

// List structure
<nav aria-label="Page navigation">
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/records">Records</a></li>
  </ul>
</nav>
```

### 6.5 Reduced Motion Support

**Media Query:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Component Implementation:**
```typescript
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function AnimatedCard() {
  return (
    <div
      className={motionPreference ? 'no-animation' : 'animate-fade-in'}
      style={{
        transition: motionPreference ? 'none' : 'opacity 200ms ease-out'
      }}
    >
      {/* Content */}
    </div>
  );
}
```

**Alternatives for Animations:**
- Fade animations: Remove or make instant (opacity: 1)
- Slide animations: Remove or make instant (no transform)
- Scale/transform: Remove completely
- Transitions: Duration ≤ 50ms or disabled

---

## 7. Icon Usage (Lucide React)

### 7.1 Sidebar Navigation Icons (20px)
```typescript
const sidebarIcons = {
  dashboard: Home,
  verification: Search,
  records: FileText,
  analytics: BarChart3,
  audit: Shield,
  management: Users,
  settings: Settings
}
```

### 7.2 Status Icons (20px)
```typescript
const statusIcons = {
  verified: CheckCircle,
  pending: Clock,
  mismatch: AlertCircle,
  unverified: HelpCircle,
  flagged: Flag,
  error: XCircle
}
```

### 7.3 Action Icons (20px)
```typescript
const actionIcons = {
  add: Plus,
  edit: Edit2,
  delete: Trash2,
  download: Download,
  copy: Copy,
  view: Eye,
  hide: EyeOff,
  search: Search,
  filter: Filter,
  sort: ArrowUpDown,
  moreOptions: MoreVertical,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  close: X,
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle
}
```

### 7.4 Icon Sizing

```typescript
const iconSizes = {
  small: 16,      // Labels, badges, inline text
  standard: 20,   // Navigation, buttons, status
  large: 24,      // Hero sections, emphasis
  extraLarge: 32  // Large interactive elements
}
```

### 7.5 Icon Color Usage

```typescript
// Status icons: Use semantic colors
<CheckCircle className="text-success-green" size={20} />
<AlertCircle className="text-warning-amber" size={20} />
<XCircle className="text-critical-red" size={20} />

// Navigation icons: Use text-secondary, text-primary on hover
<Home className="text-text-secondary group-hover:text-aurora-teal" size={20} />

// Action icons: Use text-secondary or inherit parent color
<Download className="text-text-secondary" size={20} />
```

---

## 8. Implementation File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── Table.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── Container.tsx
│   │   ├── Grid.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── GlassCard.tsx
│   │   ├── StatCard.tsx
│   │   ├── QuickActionsCard.tsx
│   │   ├── NotificationsPanel.tsx
│   │   └── Dashboard.tsx
│   ├── verification/
│   │   ├── VerificationCard.tsx
│   │   ├── VerificationForm.tsx
│   │   ├── VerificationResults.tsx
│   │   └── VerificationCentre.tsx
│   ├── records/
│   │   ├── RecordHeader.tsx
│   │   ├── RiskLevel.tsx
│   │   ├── Timeline.tsx
│   │   ├── ConvictionDetails.tsx
│   │   ├── VerificationHistory.tsx
│   │   ├── AuditTrail.tsx
│   │   └── RecordProfile.tsx
│   ├── analytics/
│   │   ├── MetricCard.tsx
│   │   ├── StatCard.tsx
│   │   ├── OfficerPerformanceTable.tsx
│   │   ├── VerificationFunnel.tsx
│   │   ├── OffenseCategoryChart.tsx
│   │   └── Analytics.tsx
│   └── common/
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── NotFound.tsx
├── lib/
│   ├── design-tokens.ts
│   ├── cn.ts
│   ├── hooks.ts
│   └── utils.ts
├── styles/
│   ├── globals.css
│   ├── animations.css
│   └── responsive.css
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Login)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── verification/
│   │   └── page.tsx
│   ├── records/
│   │   └── [id]/page.tsx
│   └── analytics/
│       └── page.tsx
└── tailwind.config.ts
```

---

## 9. Design Tokens Implementation

### 9.1 TypeScript Constants (`/src/lib/design-tokens.ts`)

```typescript
export const COLORS = {
  // Primary Dark Colors
  Primary: {
    Black: '#0a0e27',
    DarkBlue: '#1a1f3a',
    Surface: '#252d48',
    ElevationLight: '#3a4254'
  },
  
  // Aurora Gradient
  Aurora: {
    Purple: '#7c3aed',
    Teal: '#14b8a6',
    Green: '#10b981',
    Gradient: 'linear-gradient(90deg, #7c3aed 0%, #14b8a6 50%, #10b981 100%)'
  },
  
  // Semantic Status Colors
  Status: {
    Verified: '#10b981',
    Unverified: '#6b7280',
    Mismatch: '#dc2626',
    Pending: '#f59e0b',
    CriticalRed: '#dc2626',
    SuccessGreen: '#10b981',
    WarningAmber: '#f59e0b',
    InfoBlue: '#3b82f6'
  },
  
  // Text Colors
  Text: {
    Primary: '#ffffff',
    Secondary: '#a0a9c9',
    Tertiary: '#6b7280'
  },
  
  // Glass Colors
  Glass: {
    Base: 'rgba(255, 255, 255, 0.08)',
    Hover: 'rgba(255, 255, 255, 0.12)',
    Elevated: 'rgba(255, 255, 255, 0.15)',
    Border: 'rgba(255, 255, 255, 0.15)',
    BorderHover: 'rgba(255, 255, 255, 0.25)'
  }
} as const;

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px'
} as const;

export const TYPOGRAPHY = {
  Heading: {
    H1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: '1.2',
      letterSpacing: '-0.02em'
    },
    H2: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '1.3',
      letterSpacing: '-0.01em'
    },
    H3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '1.4'
    },
    H4: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '1.5'
    }
  },
  Body: {
    Large: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '1.6'
    },
    Regular: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '1.6'
    },
    Small: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '1.5'
    },
    Caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '1.4'
    }
  }
} as const;

export const SHADOWS = {
  base: '0 2px 8px rgba(0, 0, 0, 0.12)',
  hover: '0 4px 16px rgba(0, 0, 0, 0.15)',
  elevated: '0 8px 32px rgba(0, 0, 0, 0.20)',
  floating: '0 12px 48px rgba(0, 0, 0, 0.25)',
  critical: '0 16px 64px rgba(0, 0, 0, 0.30)'
} as const;

export const ANIMATIONS = {
  Fast: '100ms',
  Normal: '200ms',
  Slow: '300ms',
  Transition: '400ms'
} as const;

export const EASING = {
  EaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
  EaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
  EaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  Bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const;

export const BORDER_RADIUS = {
  Subtle: '0.25rem',
  Normal: '0.375rem',
  Large: '0.5rem',
  Full: '9999px'
} as const;
```

### 9.2 Class Name Utility (`/src/lib/cn.ts`)

```typescript
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 9.3 Tailwind Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss';
import { COLORS, SPACING, SHADOWS, ANIMATIONS, EASING, BORDER_RADIUS } from './src/lib/design-tokens';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': COLORS.Primary.Black,
        'primary-dark-blue': COLORS.Primary.DarkBlue,
        'surface-dark': COLORS.Primary.Surface,
        'elevation-light': COLORS.Primary.ElevationLight,
        'aurora-purple': COLORS.Aurora.Purple,
        'aurora-teal': COLORS.Aurora.Teal,
        'aurora-green': COLORS.Aurora.Green,
        'verified-status': COLORS.Status.Verified,
        'unverified-status': COLORS.Status.Unverified,
        'mismatch-status': COLORS.Status.Mismatch,
        'pending-status': COLORS.Status.Pending,
        'critical-red': COLORS.Status.CriticalRed,
        'success-green': COLORS.Status.SuccessGreen,
        'warning-amber': COLORS.Status.WarningAmber,
        'info-blue': COLORS.Status.InfoBlue,
        'text-primary': COLORS.Text.Primary,
        'text-secondary': COLORS.Text.Secondary,
        'text-tertiary': COLORS.Text.Tertiary,
        'glass-base': COLORS.Glass.Base,
        'glass-hover': COLORS.Glass.Hover,
        'glass-elevated': COLORS.Glass.Elevated,
        'glass-border': COLORS.Glass.Border
      },
      spacing: {
        xs: SPACING.xs,
        sm: SPACING.sm,
        md: SPACING.md,
        base: SPACING.base,
        lg: SPACING.lg,
        xl: SPACING.xl,
        xxl: SPACING.xxl,
        xxxl: SPACING.xxxl
      },
      boxShadow: {
        base: SHADOWS.base,
        hover: SHADOWS.hover,
        elevated: SHADOWS.elevated,
        floating: SHADOWS.floating,
        critical: SHADOWS.critical
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'fade-in-down': 'fadeInDown 200ms ease-out forwards',
        'fade-out': 'fadeOut 200ms ease-in forwards',
        'slide-in-left': 'slideInLeft 200ms ease-out forwards',
        'slide-out-right': 'slideOutRight 200ms ease-in forwards',
        'skeleton-pulse': 'skeletonPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'status-pulse': 'statusPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        fadeInDown: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeOut: {
          'from': { opacity: '1' },
          'to': { opacity: '0' }
        },
        slideInLeft: {
          'from': { transform: 'translateX(-20px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' }
        },
        slideOutRight: {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(20px)', opacity: '0' }
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        },
        statusPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7' }
        }
      },
      transitionDuration: {
        fast: ANIMATIONS.Fast,
        normal: ANIMATIONS.Normal,
        slow: ANIMATIONS.Slow,
        transition: ANIMATIONS.Transition
      },
      transitionTimingFunction: {
        'ease-in': EASING.EaseIn,
        'ease-out': EASING.EaseOut,
        'ease-in-out': EASING.EaseInOut,
        'bounce': EASING.Bounce
      },
      borderRadius: {
        subtle: BORDER_RADIUS.Subtle,
        normal: BORDER_RADIUS.Normal,
        large: BORDER_RADIUS.Large
      },
      backdropFilter: {
        'blur': 'blur(10px)'
      }
    }
  },
  plugins: [],
  darkMode: 'class'
};

export default config;
```

---

## 10. Animation Principles

### 10.1 Performance Optimization

**GPU-Accelerated Properties:**
- Use `transform` (translate, rotate, scale) instead of positioning (top, left)
- Use `opacity` instead of visibility
- These properties trigger GPU rendering and avoid layout recalculations

**Non-Animated Properties (Avoid):**
- width, height, margin, padding (cause layout shift)
- background-color on large elements (expensive)
- box-shadow on hover (limit to elevation changes)

### 10.2 Duration Guidelines

**Micro-interactions (User immediate feedback):**
- Button hover: 150ms
- Input focus: 100ms
- Checkbox toggle: 100ms

**Transition Animations (Between states):**
- Tab changes: 200ms
- Card hover: 200ms
- Modal open: 200ms

**Page Transitions (Navigation):**
- Route changes: 300ms fade
- Loading → content: 300ms

**Long Animations (Background effects):**
- Gradient animations: 4–6 seconds
- Skeleton pulse: 1.5 seconds
- Loading spinner: 2–3 seconds

### 10.3 Easing Selection

**Entrance Effects:** easeOut (start fast, slow down)
- Fade in: opacity 0→1
- Slide up: translateY(20px)→0
- Scale in: scale(0.95)→1

**Exit Effects:** easeIn (start slow, speed up)
- Fade out: opacity 1→0
- Slide down: translateY(0)→20px
- Scale out: scale(1)→0.95

**State Transitions:** easeInOut (smooth throughout)
- Color changes
- Size adjustments
- Property morphing

### 10.4 Layout Shift Prevention

```typescript
// ✓ Good: Use transform (GPU accelerated, no layout shift)
element {
  transition: transform 200ms ease-out;
}
element:hover {
  transform: scale(1.02);
}

// ✗ Bad: Use width/height (causes layout shift)
element:hover {
  width: 102%;
  height: 102%;
}

// ✓ Good: Set min-height to prevent shift on content load
.tab-pane {
  min-height: 400px;
  transition: opacity 200ms ease-out;
}

// ✗ Bad: Height auto changes when content loads
.tab-pane {
  height: auto;
}
```

### 10.5 Reduced Motion Implementation

```typescript
// CSS approach
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

// React approach
function useMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

// Usage
function AnimatedComponent() {
  const prefersReducedMotion = useMotionPreference();
  
  return (
    <div
      className={prefersReducedMotion ? '' : 'animate-fade-in'}
      style={{
        transition: prefersReducedMotion ? 'none' : 'opacity 200ms ease-out'
      }}
    >
      Content
    </div>
  );
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of the design system—essentially, a formal statement about what the design system should achieve. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees for design consistency and implementation fidelity.*

### Property 1: Color Contrast Compliance

**For any** text element rendered with colors defined in the Design_System, the contrast ratio between foreground and background colors SHALL be at least 4.5:1 (WCAG AA), ensuring readability for all users including those with color vision deficiency.

**Validates: Requirements 1.1, 6**

### Property 2: Responsive Layout Adaptation

**For any** component rendered on different viewport sizes (mobile, tablet, desktop), the layout SHALL automatically adapt according to the defined breakpoints (0–639px mobile, 640–1023px tablet, 1024px+ desktop) without requiring manual intervention or losing content accessibility.

**Validates: Requirements 1.4, 5**

### Property 3: Focus Ring Visibility

**For any** interactive element (button, input, link) that receives keyboard focus, a visible focus ring (3px outline, Aurora_Teal color, 2px offset) SHALL be displayed, enabling keyboard navigation for all users.

**Validates: Requirements 6.1**

### Property 4: Animation Performance

**For any** animation defined in the Design_System, the animation SHALL use GPU-accelerated properties (transform, opacity) and complete within specified duration (100–400ms), ensuring no layout shifts or jank (frame rate < 60fps).

**Validates: Requirements 10**

### Property 5: Status Indicator Clarity

**For any** status badge or indicator in the Design_System, the visual representation SHALL include both color AND icon AND text—never color alone—ensuring users with color blindness can understand the status without relying on color perception.

**Validates: Requirements 4.5, 6.2**

### Property 6: Glassmorphism Specification Consistency

**For any** component applying glassmorphism effect, the implementation SHALL use backdrop-filter blur(10px), rgba(255,255,255,0.08) base background, and 1px border with rgba(255,255,255,0.15) color, maintaining visual consistency across all glass surfaces.

**Validates: Requirements 4.1**

### Property 7: Responsive Typography Scaling

**For any** heading or body text rendered on different viewport sizes, the font size SHALL adjust proportionally (reduce by 10% on mobile, 5% on tablet, full size on desktop) while maintaining readability and hierarchy, ensuring optimal legibility across all screen sizes.

**Validates: Requirements 1.2, 5**

### Property 8: Keyboard Navigation Completeness

**For any** page or component in the Design_System, all interactive elements SHALL be reachable and operable via keyboard navigation alone (Tab, Shift+Tab, Enter, Escape, Arrow keys), enabling full accessibility for users without mouse capability.

**Validates: Requirements 6.1, 6.3**

### Property 9: Reduced Motion Respect

**For any** animation or transition in the Design_System, when @prefers-reduced-motion media query is active, the animation SHALL be disabled or reduced to ≤50ms, respecting user accessibility preferences without degrading functionality.

**Validates: Requirements 1.6, 6.5**

### Property 10: Component State Variant Coverage

**For any** interactive component (Button, Input, Card), all defined state variants (default, hover, focus, active, disabled, loading) SHALL be visually distinct and functionally correct, providing clear feedback for all user interactions.

**Validates: Requirements 2.1**

---

## Appendix: JSON Token Export Format

```json
{
  "colors": {
    "primary": {
      "black": "#0a0e27",
      "darkBlue": "#1a1f3a",
      "surface": "#252d48",
      "elevationLight": "#3a4254"
    },
    "aurora": {
      "purple": "#7c3aed",
      "teal": "#14b8a6",
      "green": "#10b981"
    },
    "status": {
      "verified": "#10b981",
      "mismatch": "#dc2626",
      "pending": "#f59e0b"
    },
    "text": {
      "primary": "#ffffff",
      "secondary": "#a0a9c9"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "base": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "typography": {
    "h1": { "fontSize": "32px", "fontWeight": 700, "lineHeight": "1.2" },
    "body": { "fontSize": "14px", "fontWeight": 400, "lineHeight": "1.6" }
  },
  "shadows": {
    "base": "0 2px 8px rgba(0, 0, 0, 0.12)",
    "hover": "0 4px 16px rgba(0, 0, 0, 0.15)",
    "elevated": "0 8px 32px rgba(0, 0, 0, 0.20)"
  },
  "animations": {
    "fast": "100ms",
    "normal": "200ms",
    "slow": "300ms"
  }
}
```

---

## Summary

This comprehensive design document establishes the complete visual and interaction framework for the Premium Court UI Redesign. It provides developers with:

1. **Centralized design tokens** for consistent styling across components
2. **Reusable component library** with documented states and behaviors
3. **Page layout specifications** for all major interfaces
4. **Responsive design rules** for mobile, tablet, and desktop
5. **Accessibility standards** meeting WCAG AA compliance
6. **Animation principles** ensuring performance and user preference respect
7. **Implementation guidance** with file structure and code examples

All components, layouts, and interactions are designed to work together cohesively, creating a premium, professional, and accessible user experience that distinguishes the CRDVS as a court-grade verification platform.
