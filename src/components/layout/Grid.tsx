import React from 'react';
import { cn } from '@/lib/cn';

type SpacingToken = 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | 'xxl';

interface GridCols {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: GridCols;
  gap?: SpacingToken;
}

/**
 * CSS Grid wrapper with responsive column counts and configurable gaps.
 * 
 * Default responsive behavior:
 * - Mobile: 1 column
 * - Tablet (md+): 2 columns  
 * - Desktop (lg+): 3 columns
 * 
 * @example
 * ```tsx
 * <Grid cols={{mobile: 1, tablet: 2, desktop: 3}} gap="lg">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 * ```
 */
export function Grid({ 
  children, 
  className, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'base'
}: GridProps) {
  // Map spacing tokens to Tailwind gap classes
  const gapClasses: Record<SpacingToken, string> = {
    xs: 'gap-1',    // 4px
    sm: 'gap-2',    // 8px  
    md: 'gap-3',    // 12px
    base: 'gap-4',  // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8',    // 32px
    xxl: 'gap-12'   // 48px
  };

  // Generate responsive grid column classes
  const getGridCols = (count: number): string => {
    const colsMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2', 
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12'
    };
    
    return colsMap[count] || 'grid-cols-1';
  };

  return (
    <div
      className={cn(
        // Base grid setup
        'grid',
        
        // Responsive column counts
        getGridCols(cols.mobile),                    // Mobile columns
        `md:${getGridCols(cols.tablet)}`,           // Tablet columns
        `lg:${getGridCols(cols.desktop)}`,          // Desktop columns
        
        // Gap spacing
        gapClasses[gap],
        
        className
      )}
    >
      {children}
    </div>
  );
}

export default Grid;