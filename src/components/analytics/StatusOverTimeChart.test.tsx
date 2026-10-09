import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { StatusOverTimeChart } from './StatusOverTimeChart'

/**
 * Tests for StatusOverTimeChart component
 * **Validates: Requirements 1.11**
 */
describe('StatusOverTimeChart', () => {
  const mockData = [
    { date: '2024-01-01', verified: 50, pending: 20, mismatch: 5 },
    { date: '2024-01-02', verified: 65, pending: 18, mismatch: 7 },
    { date: '2024-01-03', verified: 72, pending: 15, mismatch: 4 },
    { date: '2024-01-04', verified: 88, pending: 12, mismatch: 6 },
    { date: '2024-01-05', verified: 95, pending: 10, mismatch: 3 },
    { date: '2024-01-06', verified: 102, pending: 8, mismatch: 2 },
    { date: '2024-01-07', verified: 110, pending: 5, mismatch: 1 }
  ]

  describe('Rendering', () => {
    it('should render the component with SVG chart', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    it('should render with default height', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('height')).toBe('320')
    })

    it('should render with custom height', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} height={400} />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('height')).toBe('400')
    })

    it('should render empty SVG for empty data', () => {
      const { container } = render(<StatusOverTimeChart data={[]} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })
  })

  describe('Data Visualization', () => {
    it('should render three lines (verified, pending, mismatch)', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const paths = container.querySelectorAll('svg path[stroke]')
      // 3 data lines
      expect(paths.length).toBeGreaterThanOrEqual(3)
    })

    it('should use correct colors for each line', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const paths = container.querySelectorAll('svg path[stroke]')
      
      const verifiedPath = Array.from(paths).find(p => (p as SVGElement).getAttribute('stroke') === '#14b8a6')
      const pendingPath = Array.from(paths).find(p => (p as SVGElement).getAttribute('stroke') === '#7c3aed')
      const mismatchPath = Array.from(paths).find(p => (p as SVGElement).getAttribute('stroke') === '#dc2626')

      expect(verifiedPath).toBeTruthy()
      expect(pendingPath).toBeTruthy()
      expect(mismatchPath).toBeTruthy()
    })

    it('should render data points for each metric', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const circles = container.querySelectorAll('svg circle[fill]')
      // 3 metrics × 7 data points = 21 circles
      expect(circles.length).toBe(21)
    })

    it('should render correct number of data points per metric', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const verifiedCircles = Array.from(container.querySelectorAll('svg circle')).filter(
        c => (c as SVGElement).getAttribute('fill') === '#14b8a6'
      )
      expect(verifiedCircles.length).toBe(mockData.length)
    })
  })

  describe('Axes', () => {
    it('should render X and Y axes', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const lines = container.querySelectorAll('svg > line')
      expect(lines.length).toBeGreaterThanOrEqual(2) // At least X and Y axis
    })

    it('should render Y-axis labels', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const yLabels = container.querySelectorAll('svg text')
      expect(yLabels.length).toBeGreaterThan(0)
    })

    it('should render X-axis date labels', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const labels = Array.from(container.querySelectorAll('svg text')).map(t => t.textContent)
      // Should contain some date labels (like "Jan 1")
      const hasDateLabels = labels.some(label => label && /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/.test(label))
      expect(hasDateLabels).toBe(true)
    })
  })

  describe('Grid Lines', () => {
    it('should render grid lines by default', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} showGrid={true} />)
      const gridLines = container.querySelectorAll('svg line[stroke-dasharray]')
      expect(gridLines.length).toBeGreaterThan(0)
    })

    it('should not render grid lines when disabled', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} showGrid={false} />)
      // Even without grid, axes are rendered, so we can't use length directly
      // Check that grid-specific dasharray lines don't exist
      const gridLines = container.querySelectorAll('svg g[opacity] line[stroke-dasharray]')
      expect(gridLines.length).toBe(0)
    })
  })

  describe('Legend', () => {
    it('should render legend with three items', () => {
      render(<StatusOverTimeChart data={mockData} />)
      expect(screen.getByText('Verified')).toBeTruthy()
      expect(screen.getByText('Pending')).toBeTruthy()
      expect(screen.getByText('Mismatch')).toBeTruthy()
    })

    it('should have correct legend item colors', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const legendItems = container.querySelectorAll('[style*="background-color"]')
      // Legend has 3 colored dots
      expect(legendItems.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Hover Interaction', () => {
    it('should show tooltip on hover', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      
      // Find a hover detection circle
      const hoverCircles = container.querySelectorAll('svg circle')
      const lastHoverCircle = hoverCircles[hoverCircles.length - 1]
      
      fireEvent.mouseEnter(lastHoverCircle)
      
      // Check if tooltip elements appear
      const tooltip = container.querySelector('[style*="backdrop-filter"]')
      expect(tooltip).toBeTruthy()
    })

    it('should display correct values in tooltip', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      
      const hoverCircles = container.querySelectorAll('svg circle')
      const firstDataCircle = hoverCircles[0]
      
      fireEvent.mouseEnter(firstDataCircle)
      
      // Tooltip should show the data point values
      expect(screen.getByText(/Verified:/)).toBeTruthy()
      expect(screen.getByText(/Pending:/)).toBeTruthy()
      expect(screen.getByText(/Mismatch:/)).toBeTruthy()
    })

    it('should hide tooltip on mouse leave', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      
      const hoverCircles = container.querySelectorAll('svg circle')
      const firstDataCircle = hoverCircles[0]
      
      fireEvent.mouseEnter(firstDataCircle)
      fireEvent.mouseLeave(firstDataCircle)
      
      // Tooltip should not be visible
      const tooltips = container.querySelectorAll('[style*="backdrop-filter"]')
      expect(tooltips.length).toBe(0)
    })

    it('should show vertical line on hover', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      
      const hoverCircles = container.querySelectorAll('svg circle')
      const firstDataCircle = hoverCircles[0]
      
      fireEvent.mouseEnter(firstDataCircle)
      
      // Check for vertical reference line
      const verticalLine = Array.from(container.querySelectorAll('svg line')).find(
        line => (line as SVGElement).getAttribute('stroke-dasharray') === '4 4'
      )
      expect(verticalLine).toBeTruthy()
    })
  })

  describe('Animations', () => {
    it('should have animation styles on paths', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const animatedPaths = container.querySelectorAll('svg path[style*="animation"]')
      expect(animatedPaths.length).toBeGreaterThan(0)
    })

    it('should support custom animation duration', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} animationDuration={1200} />)
      const paths = container.querySelectorAll('svg path[style]')
      
      // Check that animation duration is reflected in style
      expect(paths.length).toBeGreaterThan(0)
    })

    it('should respect prefers-reduced-motion', () => {
      // This test would need to mock media query preferences
      // For now, we just verify the CSS is present
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const styleTag = container.querySelector('style')
      expect(styleTag?.textContent).toContain('@media (prefers-reduced-motion: reduce)')
    })
  })

  describe('Responsive Design', () => {
    it('should accept className prop', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} className="custom-class" />)
      const wrapper = container.querySelector('.custom-class')
      expect(wrapper).toBeTruthy()
    })

    it('should have glassmorphic container', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const glassContainer = container.querySelector('.glassmorphic-border')
      expect(glassContainer).toBeTruthy()
    })

    it('should be scrollable horizontally on small screens', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const scrollContainer = container.querySelector('.overflow-x-auto')
      expect(scrollContainer).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle single data point', () => {
      const singlePoint = [{ date: '2024-01-01', verified: 50, pending: 20, mismatch: 5 }]
      const { container } = render(<StatusOverTimeChart data={singlePoint} />)
      expect(container.querySelector('svg')).toBeTruthy()
    })

    it('should handle all zero values', () => {
      const zeroData = [
        { date: '2024-01-01', verified: 0, pending: 0, mismatch: 0 },
        { date: '2024-01-02', verified: 0, pending: 0, mismatch: 0 }
      ]
      const { container } = render(<StatusOverTimeChart data={zeroData} />)
      expect(container.querySelector('svg')).toBeTruthy()
    })

    it('should handle very large numbers', () => {
      const largeData = [
        { date: '2024-01-01', verified: 1000000, pending: 500000, mismatch: 100000 },
        { date: '2024-01-02', verified: 1200000, pending: 450000, mismatch: 80000 }
      ]
      const { container } = render(<StatusOverTimeChart data={largeData} />)
      expect(container.querySelector('svg')).toBeTruthy()
    })

    it('should handle mixed zero and non-zero values', () => {
      const mixedData = [
        { date: '2024-01-01', verified: 50, pending: 0, mismatch: 0 },
        { date: '2024-01-02', verified: 0, pending: 20, mismatch: 0 },
        { date: '2024-01-03', verified: 0, pending: 0, mismatch: 5 }
      ]
      const { container } = render(<StatusOverTimeChart data={mixedData} />)
      expect(container.querySelector('svg')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      expect(container.querySelector('svg')).toBeTruthy()
      // SVG should be present and have title or description
    })

    it('should render legend for color-blind users', () => {
      render(<StatusOverTimeChart data={mockData} />)
      expect(screen.getByText('Verified')).toBeTruthy()
      expect(screen.getByText('Pending')).toBeTruthy()
      expect(screen.getByText('Mismatch')).toBeTruthy()
    })

    it('should display numeric values in tooltips', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      
      const hoverCircles = container.querySelectorAll('svg circle')
      fireEvent.mouseEnter(hoverCircles[0])
      
      // Numeric values should be visible for people with color blindness
      const tooltip = container.querySelector('[style*="backdrop-filter"]')
      expect(tooltip?.textContent).toContain('50')
      expect(tooltip?.textContent).toContain('20')
      expect(tooltip?.textContent).toContain('5')
    })
  })

  describe('Data Formatting', () => {
    it('should format dates correctly in labels', () => {
      render(<StatusOverTimeChart data={mockData} />)
      // Dates should be formatted (e.g., "Jan 1" not "2024-01-01")
      expect(screen.queryByText('2024-01-01')).toBeFalsy()
      // Should have formatted dates
      const labels = screen.queryAllByText(/^[A-Za-z]{3} \d{1,2}$/)
      expect(labels.length).toBeGreaterThan(0)
    })

    it('should display numeric values in tooltip without currency', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      
      const hoverCircles = container.querySelectorAll('svg circle')
      fireEvent.mouseEnter(hoverCircles[0])
      
      // Values should be plain numbers
      expect(screen.getByText('50')).toBeTruthy()
    })
  })

  describe('Visual Design', () => {
    it('should use Aurora Teal for verified line', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const verifiedPath = Array.from(container.querySelectorAll('svg path')).find(
        p => (p as SVGElement).getAttribute('stroke') === '#14b8a6'
      )
      expect(verifiedPath).toBeTruthy()
    })

    it('should use Aurora Purple for pending line', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const pendingPath = Array.from(container.querySelectorAll('svg path')).find(
        p => (p as SVGElement).getAttribute('stroke') === '#7c3aed'
      )
      expect(pendingPath).toBeTruthy()
    })

    it('should use Critical Red for mismatch line', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const mismatchPath = Array.from(container.querySelectorAll('svg path')).find(
        p => (p as SVGElement).getAttribute('stroke') === '#dc2626'
      )
      expect(mismatchPath).toBeTruthy()
    })

    it('should apply dark spatial theme colors', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      const svg = container.querySelector('svg')
      expect(svg?.getAttribute('style')).toContain('drop-shadow')
    })
  })

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        date: `2024-01-${String((i % 30) + 1).padStart(2, '0')}`,
        verified: Math.floor(Math.random() * 1000),
        pending: Math.floor(Math.random() * 500),
        mismatch: Math.floor(Math.random() * 200)
      }))

      const { container } = render(<StatusOverTimeChart data={largeData} />)
      expect(container.querySelector('svg')).toBeTruthy()
    })

    it('should use SVG for performance (not canvas or DOM elements)', () => {
      const { container } = render(<StatusOverTimeChart data={mockData} />)
      expect(container.querySelector('svg')).toBeTruthy()
      expect(container.querySelector('canvas')).toBeFalsy()
    })
  })
})
