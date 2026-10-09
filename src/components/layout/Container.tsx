import React from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
}

/**
 * Responsive container component with max-width constraints and automatic centering.
 * 
 * Breakpoints:
 * - Mobile: Full width with base padding (16px)
 * - Tablet: 640px max-width, lg padding (24px)
 * - Desktop: 1400px max-width, xl padding (32px)
 */
export function Container({ 
  children, 
  className, 
  maxWidth = 'xl',
  noPadding = false 
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',    // 640px
    md: 'max-w-md',    // 768px  
    lg: 'max-w-4xl',   // 896px
    xl: 'max-w-7xl',   // 1400px
    full: 'max-w-full'
  };

  return (
    <div
      className={cn(
        // Base container styles
        'mx-auto w-full',
        
        // Max width constraints
        maxWidthClasses[maxWidth],
        
        // Responsive padding
        !noPadding && [
          'px-4',      // Mobile: 16px padding
          'md:px-6',   // Tablet: 24px padding  
          'lg:px-8'    // Desktop: 32px padding
        ],
        
        className
      )}
    >
      {children}
    </div>
  );
}

export default Container;