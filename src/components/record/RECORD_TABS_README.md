# RecordTabs Component Documentation

## Overview

The `RecordTabs` component is a sophisticated tab navigation system designed for criminal record detail pages. It provides a premium interface with Aurora gradient animations, badge counters, glassmorphic effects, and full keyboard accessibility.

## Features

- **Five Main Tabs**: Overview, Convictions, Verifications, Related Records, Audit Trail
- **Active State Indicators**: Aurora gradient underline with glowing animation
- **Badge Counters**: Display item counts on tabs (e.g., "3" convictions)
- **Smooth Animations**: 200ms fade transitions between tab content
- **Glassmorphism Effects**: Semi-transparent hover backgrounds on inactive tabs
- **Keyboard Navigation**: Arrow keys, Home/End keys for accessibility
- **Mobile Responsive**: Horizontal scrolling with snap behavior on small screens
- **ARIA Compliance**: Full accessibility labels and semantic HTML

## Installation

The component is located at:
```
src/components/record/RecordTabs.tsx
```

Import it along with supporting tab components:
```typescript
import { RecordTabs, TabDefinition } from '@/components/record/RecordTabs';
import { OverviewTab } from '@/components/record/OverviewTab';
import { ConvictionsTab } from '@/components/record/ConvictionsTab';
import { VerificationsTab } from '@/components/record/VerificationsTab';
import { RelatedRecordsTab } from '@/components/record/RelatedRecordsTab';
import { AuditTrailTab } from '@/components/record/AuditTrailTab';
```

## Usage

### Basic Example

```typescript
import { RecordTabs, TabDefinition } from '@/components/record/RecordTabs';
import { OverviewTab } from '@/components/record/OverviewTab';

export function RecordDetail({ record }: { record: CriminalRecord }) {
  const tabs: TabDefinition[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: <OverviewTab record={record} />
    }
  ];

  return (
    <RecordTabs
      tabs={tabs}
      defaultTab="overview"
      onTabChange={(tabId) => console.log('Tab:', tabId)}
    />
  );
}
```

### With Badge Counters

```typescript
const tabs: TabDefinition[] = [
  {
    id: 'overview',
    label: 'Overview',
    badge: undefined,
    content: <OverviewTab record={record} />
  },
  {
    id: 'convictions',
    label: 'Convictions',
    badge: 3,  // Shows badge with count
    content: <ConvictionsTab record={record} />
  },
  {
    id: 'verifications',
    label: 'Verifications',
    badge: 12,
    content: <VerificationsTab record={record} />
  },
  {
    id: 'related_records',
    label: 'Related Records',
    badge: 2,
    content: <RelatedRecordsTab record={record} />
  },
  {
    id: 'audit_trail',
    label: 'Audit Trail',
    badge: 45,
    content: <AuditTrailTab record={record} />
  }
];
```

## API Reference

### RecordTabs Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tabs` | `TabDefinition[]` | Yes | - | Array of tab definitions |
| `defaultTab` | `string` | No | `'overview'` | Initial active tab ID |
| `onTabChange` | `(tabId: string) => void` | No | - | Callback when tab changes |
| `className` | `string` | No | - | Additional CSS classes |

### TabDefinition Interface

```typescript
interface TabDefinition {
  id: 'overview' | 'convictions' | 'verifications' | 'related_records' | 'audit_trail';
  label: string;           // Display text for tab
  badge?: number;          // Optional badge count (hidden if 0 or undefined)
  content: ReactNode;      // Tab content component
  lazy?: boolean;          // Lazy-load content (future feature)
}
```

## Keyboard Navigation

The component supports full keyboard accessibility:

| Key | Action |
|-----|--------|
| **Arrow Right** | Navigate to next tab |
| **Arrow Left** | Navigate to previous tab |
| **Home** | Jump to first tab |
| **End** | Jump to last tab |
| **Tab** | Focus next focusable element |
| **Shift+Tab** | Focus previous focusable element |
| **Enter/Space** | Activate focused tab |

## Styling & Customization

### Design Tokens Used

The component utilizes the Aurora design system:

- **Colors**:
  - Primary background: `#0a0e27`
  - Aurora gradient: Purple (#7c3aed) → Teal (#14b8a6) → Green (#10b981)
  - Text primary: `#ffffff`
  - Text secondary: `#a0a9c9`
  - Glass background: `rgba(255, 255, 255, 0.08)`

- **Animations**:
  - Active tab underline: 200ms fade-in with glow
  - Content fade: 200ms opacity transition
  - Tab hover: Glassmorphic background fade-in

### Theme Colors

Active tab badge:
```
Background: Linear gradient from Teal to Green
```

Inactive tab hover:
```
Background: Glass background with backdrop blur
```

Tab underline (active):
```
Background: Aurora gradient (purple → teal → green)
Shadow: Glowing teal shadow
```

## Accessibility Features

1. **ARIA Labels**:
   - `role="tablist"` on tab container
   - `role="tab"` on each tab button
   - `role="tabpanel"` on content sections
   - `aria-selected` reflects active state
   - `aria-controls` links tabs to content

2. **Keyboard Support**: Full arrow key, Home/End navigation

3. **Focus Indicators**: 3px Aurora Teal focus ring on tab buttons

4. **Screen Reader Support**: Proper heading hierarchy and content structure

5. **Motion Preferences**: Respects `@prefers-reduced-motion` media query (future enhancement)

## Tab Content Components

### OverviewTab
Displays general criminal record information:
- Personal details (name, DOB, gender, national ID)
- Status and risk assessment
- Known aliases
- Additional notes

**Props**:
```typescript
interface OverviewTabProps {
  record: CriminalRecord;
  className?: string;
}
```

### ConvictionsTab
Displays conviction history (timeline visualization intended):
- Offense details
- Charges and verdicts
- Sentences and appeal status

**Props**:
```typescript
interface ConvictionsTabProps {
  record: CriminalRecord;
  className?: string;
}
```

### VerificationsTab
Shows verification history:
- Verification dates and officers
- Status and confidence scores
- Mismatch highlighting

**Props**:
```typescript
interface VerificationsTabProps {
  record: CriminalRecord;
  className?: string;
}
```

### RelatedRecordsTab
Displays related/duplicate records:
- Similarity scores
- Record comparison
- Merge/review actions

**Props**:
```typescript
interface RelatedRecordsTabProps {
  record: CriminalRecord;
  className?: string;
}
```

### AuditTrailTab
Shows immutable audit log:
- User actions (create, update, verify, delete)
- Timestamps and user information
- Field changes (old → new values)

**Props**:
```typescript
interface AuditTrailTabProps {
  record: CriminalRecord;
  className?: string;
}
```

## Mobile Responsiveness

- **Desktop (1024px+)**: All tabs visible, horizontal scrolling with snap behavior
- **Tablet (640-1023px)**: Tabs visible with adjusted spacing, scrollable on horizontal overflow
- **Mobile (0-639px)**: Tabs scroll horizontally with snap-to-stop behavior, hide scrollbar

### Mobile Features
- Horizontal snap-scroll for easy tab selection with touch
- Reduced padding on small screens
- Font sizes scale appropriately
- Touch-target minimum 44×44px for tab buttons

## Performance Considerations

### Lazy Loading (Future Feature)
The component supports lazy-loading tab content:

```typescript
const tabs: TabDefinition[] = [
  {
    id: 'verifications',
    label: 'Verifications',
    lazy: true,  // Content loads only when tab is active
    content: <VerificationsTab record={record} />
  }
];
```

### Current Implementation
All tabs render on mount with hidden visibility. Content loading is instantaneous.

### Optimization Tips
1. Use React.lazy() for heavy tab components
2. Implement Suspense boundaries for async data fetching
3. Keep badge counts accurate to avoid unnecessary re-renders
4. Memoize tab content components if they're expensive to render

## Examples

See the demo page at `/record-tabs-demo` for interactive examples and feature showcase.

## Dependencies

- `React` (18+)
- `lucide-react` (for icons)
- `@/lib/cn` (class name utility)
- `@/lib/design-tokens` (design system constants)

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE: Not supported (uses modern CSS/JS)

## Accessibility Compliance

- ✅ WCAG 2.1 Level AA
- ✅ Full keyboard navigation
- ✅ Screen reader compatible
- ✅ Focus indicators visible
- ✅ Semantic HTML

## Future Enhancements

- [ ] Lazy-loading support for heavy tabs
- [ ] Vertical tab layout option
- [ ] Tab bar scrolling on mobile
- [ ] Animation preferences (reduce-motion)
- [ ] Customizable colors/themes
- [ ] RTL language support
- [ ] Tab reordering/customization
- [ ] Nested tab support

## Testing

### Unit Tests
Test individual tab functionality:
- Tab selection and change callbacks
- Badge counter display
- Keyboard navigation
- Content visibility

### Integration Tests
Test component integration:
- Multiple tabs rendering correctly
- Tab switching with real content
- State persistence across navigation

### Accessibility Tests
Verify keyboard and screen reader support using:
- NVDA/JAWS screen readers
- Keyboard navigation only
- Focus indicator visibility
- Color contrast ratios

## Troubleshooting

### Tab content not updating
Ensure the `defaultTab` prop matches one of the tab IDs.

### Badge numbers not showing
Check that `badge > 0` in the TabDefinition. Badges are hidden when 0 or undefined.

### Animation not smooth
Verify that `@prefers-reduced-motion` is not enabled in system preferences.

### Keyboard navigation not working
Ensure the RecordTabs component is focused before using arrow keys.

## Related Components

- `RecordHeader` - Header section with photo and quick actions
- `ConvictionTimeline` - Timeline visualization for convictions
- `StatusBadge` - Status indicators and badges
- `Container` - Layout wrapper component

## License

Part of the Criminal Record Digital Verification System (CRDVS) project.

## Support

For issues or questions, refer to the project documentation or contact the development team.
