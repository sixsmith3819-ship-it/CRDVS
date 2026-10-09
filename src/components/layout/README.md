# Layout Components

This directory contains the core layout helpers for the Aurora design system.

## Container

A responsive container component with automatic centering and configurable padding.

```tsx
import { Container } from '@/components/layout';

// Basic usage
<Container>
  <h1>Content goes here</h1>
</Container>

// Custom max-width
<Container maxWidth="lg">
  <p>Narrower container</p>
</Container>

// No padding
<Container noPadding>
  <div className="bg-gray-100 p-8">
    Custom padding content
  </div>
</Container>
```

### Props

- `children`: React.ReactNode - Content to render inside container
- `className?`: string - Additional CSS classes
- `maxWidth?`: 'sm' | 'md' | 'lg' | 'xl' | 'full' - Maximum width constraint (default: 'xl')
- `noPadding?`: boolean - Disable automatic responsive padding (default: false)

### Responsive Behavior

- **Mobile**: Full width with 16px padding
- **Tablet**: 640px max-width with 24px padding  
- **Desktop**: 1400px max-width with 32px padding

## Grid

A CSS Grid wrapper with responsive column counts and configurable gaps.

```tsx
import { Grid } from '@/components/layout';

// Default responsive grid (1/2/3 columns)
<Grid>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

// Custom column counts
<Grid cols={{mobile: 1, tablet: 2, desktop: 4}}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>

// Large gap spacing
<Grid cols={{mobile: 1, tablet: 3, desktop: 6}} gap="xl">
  {items.map(item => (
    <Card key={item.id}>{item.title}</Card>
  ))}
</Grid>
```

### Props

- `children`: React.ReactNode - Grid items to render
- `className?`: string - Additional CSS classes
- `cols?`: {mobile: number, tablet: number, desktop: number} - Column counts (default: {mobile: 1, tablet: 2, desktop: 3})
- `gap?`: SpacingToken - Gap size between items (default: 'base')

### Gap Tokens

- `xs`: 4px (gap-1)
- `sm`: 8px (gap-2)
- `md`: 12px (gap-3)
- `base`: 16px (gap-4) 
- `lg`: 24px (gap-6)
- `xl`: 32px (gap-8)
- `xxl`: 48px (gap-12)

### Responsive Behavior

Supports 1-12 columns per breakpoint:
- **Mobile**: Uses `mobile` column count
- **Tablet (md+)**: Uses `tablet` column count  
- **Desktop (lg+)**: Uses `desktop` column count

## Combined Usage

```tsx
import { Container, Grid } from '@/components/layout';

function Dashboard() {
  return (
    <Container maxWidth="xl">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      <Grid cols={{mobile: 1, tablet: 2, desktop: 3}} gap="lg">
        <StatsCard title="Total Records" value="1,234" />
        <StatsCard title="Pending Verifications" value="56" />
        <StatsCard title="Active Users" value="89" />
      </Grid>
      
      <Grid cols={{mobile: 1, tablet: 1, desktop: 2}} gap="xl" className="mt-12">
        <RecentActivity />
        <SystemAlerts />
      </Grid>
    </Container>
  );
}
```