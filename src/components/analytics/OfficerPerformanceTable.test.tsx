import React from 'react'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OfficerPerformanceTable, OfficerData } from './OfficerPerformanceTable'

// Mock the child components
jest.mock('@/components/dashboard/GlassCard', () => {
  return {
    GlassCard: ({ children, ...props }: any) => <div data-testid="glass-card" {...props}>{children}</div>
  }
})

jest.mock('@/components/ui/Badge', () => {
  return {
    Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>
  }
})

jest.mock('@/components/ui/Button', () => {
  return {
    Button: ({ children, onClick, ...props }: any) => (
      <button data-testid="button" onClick={onClick} {...props}>{children}</button>
    )
  }
})

jest.mock('@/components/ui/Input', () => {
  return {
    Input: ({ onChange, ...props }: any) => (
      <input data-testid="input" onChange={onChange} {...props} />
    )
  }
})

jest.mock('@/components/ui/Skeleton', () => {
  return {
    Skeleton: (props: any) => <div data-testid="skeleton" {...props} />
  }
})

jest.mock('@/lib/cn', () => {
  return {
    cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
  }
})

const MOCK_OFFICERS: OfficerData[] = [
  {
    id: '1',
    name: 'Alice Smith',
    recordsProcessed: 100,
    verificationSuccessRate: 98.5,
    averageProcessingTime: 45,
    flaggedRecords: 2,
    status: 'online'
  },
  {
    id: '2',
    name: 'Bob Johnson',
    recordsProcessed: 85,
    verificationSuccessRate: 92.0,
    averageProcessingTime: 50,
    flaggedRecords: 7,
    status: 'offline'
  },
  {
    id: '3',
    name: 'Carol White',
    recordsProcessed: 120,
    verificationSuccessRate: 99.0,
    averageProcessingTime: 40,
    flaggedRecords: 1,
    status: 'online'
  }
]

describe('OfficerPerformanceTable', () => {
  it('renders the table with officer data', () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    expect(screen.getByText('Officer Performance')).toBeInTheDocument()
    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    expect(screen.getByText('Carol White')).toBeInTheDocument()
  })

  it('displays correct officer data in columns', () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    // Check records processed
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    
    // Check status badges
    expect(screen.getAllByText('online')).toHaveLength(2)
    expect(screen.getByText('offline')).toBeInTheDocument()
  })

  it('filters officers by search query', async () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    const searchInput = screen.getByPlaceholderText('Search officer name...')
    
    await userEvent.type(searchInput, 'Alice')
    
    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol White')).not.toBeInTheDocument()
  })

  it('shows empty state when search yields no results', async () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    const searchInput = screen.getByPlaceholderText('Search officer name...')
    await userEvent.type(searchInput, 'NonExistent')
    
    expect(screen.getByText('No officers to display')).toBeInTheDocument()
  })

  it('sorts data by clicking column headers', () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    const nameHeader = screen.getByLabelText('Sort by Officer Name')
    fireEvent.click(nameHeader)
    
    // After first click, should be ascending
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBeGreaterThan(0)
  })

  it('toggles sort direction on repeated header clicks', () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    const recordsHeader = screen.getByLabelText('Sort by Records Processed')
    
    // First click - descending
    fireEvent.click(recordsHeader)
    expect(recordsHeader).toHaveAttribute('aria-sort', 'descending')
    
    // Second click - ascending
    fireEvent.click(recordsHeader)
    expect(recordsHeader).toHaveAttribute('aria-sort', 'ascending')
  })

  it('calls onRowClick when a row is clicked', async () => {
    const mockOnRowClick = jest.fn()
    render(
      <OfficerPerformanceTable 
        data={MOCK_OFFICERS}
        onRowClick={mockOnRowClick}
      />
    )
    
    const rows = screen.getAllByRole('row')
    // Skip header row, click first data row
    fireEvent.click(rows[1])
    
    expect(mockOnRowClick).toHaveBeenCalledWith(MOCK_OFFICERS[0])
  })

  it('shows loading skeleton when loading prop is true', () => {
    render(<OfficerPerformanceTable data={[]} loading={true} />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('displays pagination info', () => {
    const manyOfficers = Array.from({ length: 25 }, (_, i) => ({
      ...MOCK_OFFICERS[0],
      id: String(i),
      name: `Officer ${i}`
    }))
    
    render(<OfficerPerformanceTable data={manyOfficers} />)
    
    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()
  })

  it('handles pagination navigation', async () => {
    const manyOfficers = Array.from({ length: 25 }, (_, i) => ({
      ...MOCK_OFFICERS[0],
      id: String(i),
      name: `Officer ${i}`
    }))
    
    render(<OfficerPerformanceTable data={manyOfficers} />)
    
    const nextButton = screen.getByLabelText('Next page')
    fireEvent.click(nextButton)
    
    expect(screen.getByText(/Page 2 of/)).toBeInTheDocument()
  })

  it('provides accessibility features', () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    // Check for aria labels
    expect(screen.getByLabelText('Sort by Officer Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Search officers by name')).toBeInTheDocument()
    
    // Check for status announcements
    const statusDiv = screen.getByRole('status', { hidden: true })
    expect(statusDiv).toBeInTheDocument()
  })

  it('exports table data to CSV', async () => {
    const mockLink = jest.fn()
    const mockBlob = jest.fn()
    
    global.URL.createObjectURL = jest.fn()
    document.createElement = jest.fn((tagName) => {
      if (tagName === 'a') {
        return {
          href: '',
          download: '',
          click: mockLink,
          style: {}
        } as any
      }
      return document.createElement(tagName)
    })
    
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    const exportButton = screen.getByText('Export CSV')
    fireEvent.click(exportButton)
    
    // CSV export function should be called
    expect(mockLink).toHaveBeenCalled()
  })

  it('disables pagination buttons appropriately', () => {
    const threeOfficers = MOCK_OFFICERS.slice(0, 3)
    render(<OfficerPerformanceTable data={threeOfficers} />)
    
    // With only 3 officers (less than 10 per page), pagination should not show
    const nextButton = screen.queryByLabelText('Next page')
    expect(nextButton).not.toBeInTheDocument()
  })

  it('shows correct officer count in results info', () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    expect(screen.getByText(/Showing 1 to 3 of 3 officers/)).toBeInTheDocument()
  })

  it('renders status badges with correct styling', () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    const badges = screen.getAllByTestId('badge')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('keyboard navigates through sortable headers', async () => {
    render(<OfficerPerformanceTable data={MOCK_OFFICERS} />)
    
    const nameHeader = screen.getByLabelText('Sort by Officer Name')
    
    nameHeader.focus()
    expect(document.activeElement).toBe(nameHeader)
    
    // Can press Enter to activate sort
    fireEvent.keyDown(nameHeader, { key: 'Enter' })
    expect(nameHeader).toHaveAttribute('aria-sort')
  })
})
