import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OffenseCategoryChart, OffenseCategory } from './OffenseCategoryChart';

describe('OffenseCategoryChart', () => {
  const mockData: OffenseCategory[] = [
    { name: 'Assault', count: 245, color: '#14b8a6' },
    { name: 'Theft', count: 189, color: '#7c3aed' },
    { name: 'Fraud', count: 156, color: '#10b981' },
    { name: 'Traffic', count: 98, color: '#f59e0b' },
    { name: 'Other', count: 112, color: '#3b82f6' },
  ];

  it('renders the chart title', () => {
    render(<OffenseCategoryChart data={mockData} />);
    expect(screen.getByText('Offense Category Distribution')).toBeInTheDocument();
  });

  it('renders all categories in legend', () => {
    render(<OffenseCategoryChart data={mockData} />);
    mockData.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('renders correct total count', () => {
    render(<OffenseCategoryChart data={mockData} />);
    const total = mockData.reduce((sum, item) => sum + item.count, 0);
    expect(screen.getByText(total.toLocaleString())).toBeInTheDocument();
  });

  it('renders correct percentages for each category', () => {
    render(<OffenseCategoryChart data={mockData} />);
    const total = mockData.reduce((sum, item) => sum + item.count, 0);

    mockData.forEach((category) => {
      const percentage = (category.count / total) * 100;
      const percentageText = `${category.count.toLocaleString()} (${percentage.toFixed(1)}%)`;
      expect(screen.getByText(percentageText)).toBeInTheDocument();
    });
  });

  it('renders category count', () => {
    render(<OffenseCategoryChart data={mockData} />);
    expect(screen.getByText(mockData.length.toString())).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    const customTitle = 'Crime Statistics';
    render(<OffenseCategoryChart data={mockData} title={customTitle} />);
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    const customSubtitle = 'Last 30 days';
    render(<OffenseCategoryChart data={mockData} subtitle={customSubtitle} />);
    expect(screen.getByText(customSubtitle)).toBeInTheDocument();
  });

  it('shows "No data available" when data is empty', () => {
    render(<OffenseCategoryChart data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('handles segment click callback', async () => {
    const onSegmentClick = jest.fn();
    const user = userEvent.setup();

    render(<OffenseCategoryChart data={mockData} onSegmentClick={onSegmentClick} />);

    // Click on a legend item
    const assaultLegend = screen.getByText('Assault');
    await user.click(assaultLegend.closest('div')!);

    expect(onSegmentClick).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Assault',
        count: 245,
      })
    );
  });

  it('calculates average per category correctly', () => {
    render(<OffenseCategoryChart data={mockData} />);
    const total = mockData.reduce((sum, item) => sum + item.count, 0);
    const average = Math.round(total / mockData.length);
    expect(screen.getByText(average.toString())).toBeInTheDocument();
  });

  it('applies responsive classes', () => {
    const { container } = render(<OffenseCategoryChart data={mockData} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'lg:flex-row');
  });

  it('renders with custom className', () => {
    const { container } = render(
      <OffenseCategoryChart data={mockData} className="custom-class" />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('handles single category data', () => {
    const singleCategoryData: OffenseCategory[] = [
      { name: 'Assault', count: 500, color: '#14b8a6' },
    ];
    render(<OffenceCategoryChart data={singleCategoryData} />);
    expect(screen.getByText('Assault')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('handles large numbers correctly', () => {
    const largeData: OffenseCategory[] = [
      { name: 'Assault', count: 1000000, color: '#14b8a6' },
      { name: 'Theft', count: 999999, color: '#7c3aed' },
    ];
    render(<OffenceCategoryChart data={largeData} />);
    expect(screen.getByText('1,000,000')).toBeInTheDocument();
    expect(screen.getByText('999,999')).toBeInTheDocument();
  });

  it('renders all offense categories from requirement', () => {
    const allCategories: OffenseCategory[] = [
      { name: 'Murder', count: 45, color: '#dc2626' },
      { name: 'Assault', count: 245, color: '#14b8a6' },
      { name: 'Theft', count: 189, color: '#7c3aed' },
      { name: 'Fraud', count: 156, color: '#10b981' },
      { name: 'Traffic', count: 98, color: '#f59e0b' },
      { name: 'Cybercrime', count: 67, color: '#8b5cf6' },
      { name: 'Other', count: 112, color: '#3b82f6' },
    ];
    render(<OffenceCategoryChart data={allCategories} />);

    allCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });
});
