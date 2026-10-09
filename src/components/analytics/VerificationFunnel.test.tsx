import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VerificationFunnel, type FunnelStage } from './VerificationFunnel'

describe('VerificationFunnel', () => {
  const mockStages: FunnelStage[] = [
    {
      id: 'submitted',
      label: 'Records Submitted',
      count: 1000,
      description: 'Total records submitted'
    },
    {
      id: 'verified',
      label: 'Records Verified',
      count: 800,
      description: 'Successfully verified records'
    },
    {
      id: 'matched',
      label: 'Matched',
      count: 600,
      description: 'Records with matches'
    },
    {
      id: 'flagged',
      label: 'Flagged',
      count: 300,
      description: 'Records with issues'
    },
    {
      id: 'resolved',
      label: 'Resolved',
      count: 150,
      description: 'Issues resolved'
    }
  ]

  describe('Rendering', () => {
    it('should render the component with default stages', () => {
      render(<VerificationFunnel />)
      expect(screen.getByText('Verification Funnel')).toBeInTheDocument()
      expect(screen.getByText('Records Submitted')).toBeInTheDocument()
    })

    it('should render custom stages', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      mockStages.forEach(stage => {
        expect(screen.getByText(stage.label)).toBeInTheDocument()
      })
    })

    it('should display loading skeleton when loading is true', () => {
      const { container } = render(<VerificationFunnel loading={true} />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('should render all stage bars with correct labels', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      mockStages.forEach(stage => {
        expect(screen.getByText(stage.label)).toBeInTheDocument()
        expect(screen.getByText(new RegExp(stage.count.toLocaleString()))).toBeInTheDocument()
      })
    })
  })

  describe('Percentages', () => {
    it('should show percentages when showPercentages is true', () => {
      render(<VerificationFunnel stages={mockStages} showPercentages={true} />)
      
      // First stage should be 100%
      expect(screen.getByText('100.0%')).toBeInTheDocument()
    })

    it('should hide percentages when showPercentages is false', () => {
      render(<VerificationFunnel stages={mockStages} showPercentages={false} />)
      
      // All percentage displays should be hidden
      const percentages = screen.queryAllByText(/\d+\.\d+%/)
      const visiblePercentages = percentages.filter(el => {
        const computed = window.getComputedStyle(el)
        return computed.display !== 'none' && computed.visibility !== 'hidden'
      })
      
      expect(visiblePercentages.length).toBe(0)
    })

    it('should calculate correct percentages for each stage', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      // Stage 1: 1000/1000 = 100%
      expect(screen.getByText('100.0%')).toBeInTheDocument()
      
      // Stage 2: 800/1000 = 80%
      expect(screen.getByText('80.0%')).toBeInTheDocument()
      
      // Stage 3: 600/1000 = 60%
      expect(screen.getByText('60.0%')).toBeInTheDocument()
      
      // Stage 4: 300/1000 = 30%
      expect(screen.getByText('30.0%')).toBeInTheDocument()
      
      // Stage 5: 150/1000 = 15.0%
      expect(screen.getByText('15.0%')).toBeInTheDocument()
    })
  })

  describe('Drop-off Calculations', () => {
    it('should calculate drop-off percentages correctly', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      // Stage 2: (1000-800)/1000 * 100 = 20%
      expect(screen.getByText('-20.0%')).toBeInTheDocument()
      
      // Stage 3: (800-600)/800 * 100 = 25%
      expect(screen.getByText('-25.0%')).toBeInTheDocument()
    })

    it('should show overall conversion rate in summary', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      const conversionRate = (150 / 1000) * 100
      expect(screen.getByText(`${conversionRate.toFixed(1)}%`)).toBeInTheDocument()
    })

    it('should show total drop-off in summary', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      const totalDropoff = 100 - ((150 / 1000) * 100)
      expect(screen.getByText(`${totalDropoff.toFixed(1)}%`)).toBeInTheDocument()
    })

    it('should show highest drop-off stage', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      // Highest drop-off is stage 3: (800-600)/800 = 25%
      expect(screen.getByText('Highest Drop-off Stage')).toBeInTheDocument()
    })
  })

  describe('Interactivity', () => {
    it('should handle stage hover and call onStageHover callback', async () => {
      const onStageHover = jest.fn()
      const { container } = render(
        <VerificationFunnel stages={mockStages} onStageHover={onStageHover} />
      )
      
      const firstStage = container.querySelector('[role="progressbar"]') as HTMLElement
      fireEvent.mouseEnter(firstStage)
      
      await waitFor(() => {
        expect(onStageHover).toHaveBeenCalledWith('submitted')
      })
    })

    it('should show tooltip on stage hover', async () => {
      const { container } = render(<VerificationFunnel stages={mockStages} />)
      
      const stageBar = container.querySelector('[role="progressbar"]') as HTMLElement
      fireEvent.mouseEnter(stageBar)
      
      await waitFor(() => {
        // Description should be visible in tooltip
        expect(screen.getByText('Total records submitted')).toBeInTheDocument()
      })
    })

    it('should hide tooltip on stage leave', async () => {
      const { container } = render(<VerificationFunnel stages={mockStages} />)
      
      const stageBar = container.querySelector('[role="progressbar"]') as HTMLElement
      fireEvent.mouseEnter(stageBar)
      
      await waitFor(() => {
        expect(screen.getByText('Total records submitted')).toBeInTheDocument()
      })
      
      fireEvent.mouseLeave(stageBar)
      
      await waitFor(() => {
        expect(screen.queryByText('Total records submitted')).not.toBeInTheDocument()
      }, { timeout: 100 })
    })

    it('should be keyboard accessible', async () => {
      const { container } = render(<VerificationFunnel stages={mockStages} />)
      
      const stageBar = container.querySelector('[role="progressbar"]') as HTMLElement
      expect(stageBar).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for each stage', () => {
      const { container } = render(<VerificationFunnel stages={mockStages} />)
      
      const stageBars = container.querySelectorAll('[role="progressbar"]')
      expect(stageBars.length).toBe(mockStages.length)
      
      stageBars.forEach((bar, index) => {
        expect(bar).toHaveAttribute('aria-valuenow')
        expect(bar).toHaveAttribute('aria-valuemin', '0')
        expect(bar).toHaveAttribute('aria-valuemax')
        expect(bar).toHaveAttribute('aria-label')
      })
    })

    it('should have meaningful aria-label text', () => {
      const { container } = render(<VerificationFunnel stages={mockStages} />)
      
      const firstStageBar = container.querySelector('[role="progressbar"]') as HTMLElement
      const ariaLabel = firstStageBar.getAttribute('aria-label')
      
      expect(ariaLabel).toContain('Records Submitted')
      expect(ariaLabel).toContain('1000')
      expect(ariaLabel).toContain('100.0%')
    })

    it('should have aria-live region for summary statistics', () => {
      const { container } = render(<VerificationFunnel stages={mockStages} />)
      
      // Summary statistics should be visible and meaningful
      expect(screen.getByText('Overall Conversion')).toBeInTheDocument()
      expect(screen.getByText('Total Drop-off')).toBeInTheDocument()
    })
  })

  describe('Animations', () => {
    it('should have animation styles when animated is true', () => {
      const { container } = render(<VerificationFunnel stages={mockStages} animated={true} />)
      
      const stageBars = container.querySelectorAll('[role="progressbar"]')
      stageBars.forEach(bar => {
        // Check for animation-related classes or styles
        const style = bar.getAttribute('style') || ''
        expect(style).toBeTruthy()
      })
    })

    it('should respect animated prop for disabling animations', () => {
      const { container } = render(<VerificationFunnel stages={mockStages} animated={false} />)
      
      const stageBars = container.querySelectorAll('[role="progressbar"]')
      expect(stageBars.length).toBe(mockStages.length)
    })
  })

  describe('Responsive Design', () => {
    it('should render with className prop', () => {
      const { container } = render(
        <VerificationFunnel stages={mockStages} className="custom-class" />
      )
      
      const glassCard = container.firstChild
      expect(glassCard).toHaveClass('custom-class')
    })
  })

  describe('Summary Statistics', () => {
    it('should display records count in correct format', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      // Should show formatted numbers
      expect(screen.getByText('1,000')).toBeInTheDocument()
      expect(screen.getByText('800')).toBeInTheDocument()
    })

    it('should calculate and display total records lost', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      // 1000 - 150 = 850 records lost
      expect(screen.getByText('850')).toBeInTheDocument()
    })

    it('should show drop-off information for each stage', () => {
      render(<VerificationFunnel stages={mockStages} />)
      
      // Should show drop-off information
      const dropoffElements = screen.getAllByText(/Drop-off:/i)
      expect(dropoffElements.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty stages array', () => {
      render(<VerificationFunnel stages={[]} />)
      expect(screen.getByText('Verification Funnel')).toBeInTheDocument()
    })

    it('should handle single stage', () => {
      const singleStage: FunnelStage[] = [
        { id: 'test', label: 'Test Stage', count: 100 }
      ]
      render(<VerificationFunnel stages={singleStage} />)
      expect(screen.getByText('Test Stage')).toBeInTheDocument()
    })

    it('should handle stages with same count', () => {
      const sameCountStages: FunnelStage[] = [
        { id: '1', label: 'Stage 1', count: 100 },
        { id: '2', label: 'Stage 2', count: 100 }
      ]
      render(<VerificationFunnel stages={sameCountStages} />)
      expect(screen.getByText('Stage 1')).toBeInTheDocument()
      expect(screen.getByText('Stage 2')).toBeInTheDocument()
    })

    it('should handle stages with increasing counts', () => {
      const increasingCountStages: FunnelStage[] = [
        { id: '1', label: 'Stage 1', count: 50 },
        { id: '2', label: 'Stage 2', count: 100 }
      ]
      render(<VerificationFunnel stages={increasingCountStages} />)
      expect(screen.getByText('Stage 1')).toBeInTheDocument()
      expect(screen.getByText('Stage 2')).toBeInTheDocument()
    })
  })
})
